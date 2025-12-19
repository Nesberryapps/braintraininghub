
"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useProgress } from "@/hooks/use-progress";
import { useToast } from "@/hooks/use-toast";
import { showRewardAd, showInterstitialAd } from "@/services/admob";
import { getAnalytics, logEvent } from "firebase/analytics";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type Story = {
  id: string;
  title: string;
  text: string;
  questions: Question[];
};

const stories: Story[] = [
  {
    id: "story1",
    title: "The Clever Fox",
    text: `A fox was boasting to a cat of its clever devices for escaping its enemies. "I have a whole bag of tricks," he said, "which contains a hundred ways of escaping my enemies."\n"I have only one," said the cat; "but I can generally manage with that." Just at that moment they heard the cry of a pack of hounds in the distance. The hounds were coming in their direction. At once the cat scurried up a tree and hid herself in the boughs.\n"This is my plan," said the cat. "What are you going to do?" The fox thought first of one way, then of another, and while he was debating the hounds came nearer and nearer, and at last the fox in his confusion was caught up by the hounds and soon killed by the huntsmen.`,
    questions: [
      {
        question: "How many tricks did the fox claim to have?",
        options: ["One", "Ten", "A hundred", "A thousand"],
        correctAnswer: "A hundred",
      },
      {
        question: "What was the cat's plan?",
        options: [
          "To run away",
          "To hide in a hole",
          "To climb a tree",
          "To fight the hounds",
        ],
        correctAnswer: "To climb a tree",
      },
      {
        question: "What happened to the fox in the end?",
        options: [
          "He escaped using a clever trick.",
          "He was caught and killed.",
          "He outsmarted the hounds.",
          "The cat helped him escape.",
        ],
        correctAnswer: "He was caught and killed.",
      },
    ],
  },
  {
    id: "story2",
    title: "The Ant and the Grasshopper",
    text: `In a field one summer's day a Grasshopper was hopping about, chirping and singing to its heart's content. An Ant passed by, bearing along with great toil an ear of corn he was taking to the nest.\n"Why not come and chat with me," said the Grasshopper, "instead of toiling and moiling in that way?"\n"I am helping to lay up food for the winter," said the Ant, "and recommend you to do the same."\n"Why bother about winter?" said the Grasshopper; "we have got plenty of food at present." But the Ant went on its way and continued its toil. When the winter came the Grasshopper had no food and found itself dying of hunger, while it saw the ants distributing every day corn and grain from the stores they had collected in the summer.`,
    questions: [
      {
        question: "What was the Grasshopper doing in the summer?",
        options: [
          "Working hard",
          "Sleeping all day",
          "Singing and hopping",
          "Building a house",
        ],
        correctAnswer: "Singing and hopping",
      },
      {
        question: "What did the Ant suggest the Grasshopper do?",
        options: [
          "Sing a song with him",
          "Store food for the winter",
          "Go on a vacation",
          "Take a nap",
        ],
        correctAnswer: "Store food for the winter",
      },
      {
        question: "What happened when winter came?",
        options: [
          "The Grasshopper had plenty of food.",
          "The Ant shared its food with the Grasshopper.",
          "The Grasshopper was hungry.",
          "They both went south for the winter.",
        ],
        correctAnswer: "The Grasshopper was hungry.",
      },
    ],
  },
  {
    id: "story3",
    title: "The Mars Rover",
    text: `The Perseverance rover, a marvel of modern engineering, successfully landed on Mars in February 2021. Its primary mission is to seek signs of ancient microbial life and collect samples of rock and soil for possible return to Earth. The rover navigates the harsh Martian terrain, characterized by extreme temperatures and a thin atmosphere. It uses a suite of advanced scientific instruments to analyze the geology and climate of the Jezero Crater, a location believed to have once been a flooded river delta, making it a prime spot to find evidence of past life.`,
    questions: [
      {
        question: "What is the main goal of the Perseverance rover?",
        options: [
          "To build a human colony",
          "To search for signs of past life",
          "To measure the size of Mars",
          "To look for liquid water",
        ],
        correctAnswer: "To search for signs of past life",
      },
      {
        question: "Why was Jezero Crater chosen as the landing site?",
        options: [
          "It has a thicker atmosphere.",
          "It is the warmest place on Mars.",
          "It's believed to be a former river delta.",
          "It is close to the Martian poles.",
        ],
        correctAnswer: "It's believed to be a former river delta.",
      },
      {
        question: "What is one of the challenges the rover faces on Mars?",
        options: [
          "Heavy rainfall",
          "Dense forests",
          "Extreme temperatures",
          "Hostile alien species",
        ],
        correctAnswer: "Extreme temperatures",
      },
    ],
  },
  {
    id: "story4",
    title: "The Invention of the Printing Press",
    text: `Before the mid-15th century, books were rare and expensive, as each copy had to be written by hand, a painstaking process undertaken primarily by monks. This changed dramatically with Johannes Gutenberg's invention of the printing press with movable type in Europe around 1440. This technology allowed for the mass production of books. Suddenly, knowledge and ideas could be shared faster and more widely than ever before. The printing press fueled the Renaissance, the Reformation, and the Age of Enlightenment by making information accessible to a much larger portion of the population.`,
    questions: [
      {
        question: "How were books primarily made before the printing press?",
        options: [
          "They were individually typed on typewriters.",
          "They were copied by hand.",
          "They were carved into stone tablets.",
          "They didn't exist.",
        ],
        correctAnswer: "They were copied by hand.",
      },
      {
        question: "Who is credited with inventing the movable-type printing press in Europe?",
        options: [
          "Leonardo da Vinci",
          "Isaac Newton",
          "Martin Luther",
          "Johannes Gutenberg",
        ],
        correctAnswer: "Johannes Gutenberg",
      },
      {
        question: "What was the main impact of the printing press?",
        options: [
          "It made books more expensive.",
          "It limited the spread of information.",
          "It allowed for the mass production of books.",
          "It was only used for religious texts.",
        ],
        correctAnswer: "It allowed for the mass production of books.",
      },
    ],
  },
  {
    id: "story5",
    title: "The Great Wall of China",
    text: `The Great Wall of China is one of the most impressive architectural feats in history. Stretching over 13,000 miles, it was not built as a single continuous wall but as a series of fortifications. Construction began as early as the 7th century BC to protect Chinese states against raids from nomadic groups. The most famous and best-preserved sections were built during the Ming Dynasty (1368–1644). Contrary to popular belief, it is not visible from the moon with the naked eye.`,
    questions: [
      {
        question: "What was the primary purpose of the Great Wall?",
        options: ["To mark a border", "For tourism", "To protect against nomadic invasions", "To be a trade route"],
        correctAnswer: "To protect against nomadic invasions",
      },
      {
        question: "Which dynasty built the most famous sections of the wall?",
        options: ["Qin Dynasty", "Han Dynasty", "Ming Dynasty", "Tang Dynasty"],
        correctAnswer: "Ming Dynasty",
      },
      {
        question: "Is the Great Wall visible from the moon without a telescope?",
        options: ["Yes, easily", "Only during the day", "No", "Yes, but only the newer parts"],
        correctAnswer: "No",
      },
    ],
  },
  {
    id: "story6",
    title: "The Power of Photosynthesis",
    text: `Photosynthesis is the process used by plants, algae, and some bacteria to convert light energy into chemical energy. This process converts carbon dioxide and water into glucose (sugar) and oxygen. It is essential for life on Earth as it produces most of the planet's oxygen. The primary pigment used is chlorophyll, which absorbs blue and red light and reflects green light, giving plants their color. This all takes place in organelles called chloroplasts.`,
    questions: [
      {
        question: "What are the main inputs for photosynthesis?",
        options: ["Oxygen and sugar", "Sunlight and oxygen", "Carbon dioxide and water", "Water and chlorophyll"],
        correctAnswer: "Carbon dioxide and water",
      },
      {
        question: "What is the green pigment that captures light energy?",
        options: ["Chloroplast", "Glucose", "Chlorophyll", "Oxygen"],
        correctAnswer: "Chlorophyll",
      },
      {
        question: "Besides glucose, what is a crucial output of photosynthesis?",
        options: ["Carbon dioxide", "Water", "Light energy", "Oxygen"],
        correctAnswer: "Oxygen",
      },
    ],
  },
  {
    id: "story7",
    title: "The Mystery of Amelia Earhart",
    text: `Amelia Earhart was an American aviation pioneer who became the first female aviator to fly solo across the Atlantic Ocean. She set many other records and wrote best-selling books about her experiences. In 1937, during an attempt to circumnavigate the globe, Earhart and her navigator Fred Noonan disappeared over the central Pacific Ocean near Howland Island. The mystery of her disappearance remains unsolved and continues to fascinate historians.`,
    questions: [
      {
        question: "What is Amelia Earhart most famous for?",
        options: ["Writing books", "First solo female flight across the Atlantic", "Discovering an island", "Inventing a new plane"],
        correctAnswer: "First solo female flight across the Atlantic",
      },
      {
        question: "What happened during her attempt to fly around the world?",
        options: ["She successfully completed it", "She ran out of fuel", "She disappeared over the Pacific Ocean", "She turned back due to bad weather"],
        correctAnswer: "She disappeared over the Pacific Ocean",
      },
      {
        question: "Who was with Amelia Earhart on her final flight?",
        options: ["Her husband", "No one", "A co-pilot", "Fred Noonan"],
        correctAnswer: "Fred Noonan",
      },
    ],
  },
  {
    id: "story8",
    title: "The Roman Colosseum",
    text: `The Colosseum, in Rome, Italy, is the largest ancient amphitheater ever built. Construction began under emperor Vespasian in AD 72 and was completed in AD 80 under his heir, Titus. It could hold 50,000 to 80,000 spectators who watched gladiatorial contests, public spectacles such as mock sea battles, animal hunts, and executions. Despite damage from earthquakes and stone-robbers, the Colosseum is still an iconic symbol of Imperial Rome.`,
    questions: [
      {
        question: "What was the maximum estimated capacity of the Colosseum?",
        options: ["10,000", "25,000", "80,000", "100,000"],
        correctAnswer: "80,000",
      },
      {
        question: "Which emperor started the construction of the Colosseum?",
        options: ["Nero", "Augustus", "Titus", "Vespasian"],
        correctAnswer: "Vespasian",
      },
      {
        question: "Which of the following was an event held at the Colosseum?",
        options: ["Chariot races", "Political debates", "Gladiatorial contests", "Olympic games"],
        correctAnswer: "Gladiatorial contests",
      },
    ],
  },
  {
    id: "story9",
    title: "The Monarch's Great Migration",
    text: `The monarch butterfly is famous for its incredible long-distance migration. Every fall, millions of monarchs from the eastern United States and Canada fly south to overwintering sites in central Mexico, a journey of up to 3,000 miles. This multi-generational migration is a unique phenomenon. No single butterfly completes the entire round trip. The butterflies that fly south are a special "super-generation" that can live for up to eight months, much longer than the typical lifespan of other monarchs.`,
    questions: [
      {
        question: "Where do monarch butterflies from the eastern US migrate for the winter?",
        options: ["South America", "The Caribbean", "Central Mexico", "Florida"],
        correctAnswer: "Central Mexico",
      },
      {
        question: "What is special about the generation of monarchs that migrates south?",
        options: ["They are larger", "They fly faster", "They live much longer", "They are a different color"],
        correctAnswer: "They live much longer",
      },
      {
        question: "Does a single butterfly complete the entire migration round trip?",
        options: ["Yes", "No", "Only the males", "Only the females"],
        correctAnswer: "No",
      },
    ],
  },
  {
    id: "story10",
    title: "The Legend of the Trojan War",
    text: `The Trojan War is a famous event in Greek mythology, immortalized in Homer's epic poem, the Iliad. The war was waged against the city of Troy by the Achaeans (Greeks) after Paris of Troy took Helen from her husband Menelaus, king of Sparta. The war lasted for ten years and is famous for the tale of the Trojan Horse, a giant wooden horse constructed by the Greeks to get inside the city walls. The story ends with the fall and destruction of Troy.`,
    questions: [
      {
        question: "What event is said to have started the Trojan War?",
        options: ["A dispute over land", "The abduction of Helen", "A trade disagreement", "An assassination"],
        correctAnswer: "The abduction of Helen",
      },
      {
        question: "How long did the Trojan War last?",
        options: ["One year", "Five years", "Ten years", "Twenty years"],
        correctAnswer: "Ten years",
      },
      {
        question: "What famous trick did the Greeks use to win the war?",
        options: ["A naval blockade", "A surprise night attack", "The Trojan Horse", "Poisoning the water supply"],
        correctAnswer: "The Trojan Horse",
      },
    ],
  },
  {
    id: "story11",
    title: "The Discovery of Penicillin",
    text: `The discovery of penicillin, one of the world's first antibiotics, is a classic story of serendipity. In 1928, scientist Alexander Fleming returned from holiday to find a Petri dish of bacteria contaminated by a mold, Penicillium notatum. He noticed that the bacteria colonies around the mold had been destroyed. He isolated the mold and confirmed it produced a substance that could kill several types of disease-causing bacteria. This discovery revolutionized medicine.`,
    questions: [
      {
        question: "Who discovered penicillin?",
        options: ["Louis Pasteur", "Marie Curie", "Alexander Fleming", "Robert Koch"],
        correctAnswer: "Alexander Fleming",
      },
      {
        question: "What did Fleming notice on his contaminated Petri dish?",
        options: ["The bacteria grew faster", "The bacteria changed color", "Bacteria were destroyed around a mold", "The mold had no effect"],
        correctAnswer: "Bacteria were destroyed around a mold",
      },
      {
        question: "What is penicillin?",
        options: ["A type of virus", "A pain reliever", "A vaccine", "One of the first antibiotics"],
        correctAnswer: "One of the first antibiotics",
      },
    ],
  },
  {
    id: "story12",
    title: "The Vast Sahara Desert",
    text: `The Sahara is the largest hot desert in the world and the third-largest desert overall. Its area of 9.2 million square kilometers is comparable to the area of the United States. The desert comprises much of North Africa. While often depicted as endless sand dunes, the Sahara is very diverse, with rocky plateaus, salt flats, and mountain ranges. The climate has fluctuated between wet and dry over the last few hundred thousand years.`,
    questions: [
      {
        question: "What is the Sahara's rank in size among all deserts?",
        options: ["First", "Second", "Third", "Fourth"],
        correctAnswer: "Third",
      },
      {
        question: "Is the Sahara Desert composed only of sand dunes?",
        options: ["Yes, entirely", "Mostly, with a few oases", "No, it has diverse landscapes", "It has no sand dunes at all"],
        correctAnswer: "No, it has diverse landscapes",
      },
      {
        question: "How does the area of the Sahara compare to the United States?",
        options: ["It is much smaller", "It is slightly smaller", "It is comparable in size", "It is much larger"],
        correctAnswer: "It is comparable in size",
      },
    ],
  },
  {
    id: "story13",
    title: "The Life Cycle of a Star",
    text: `Stars are born from vast clouds of gas and dust called nebulae. Gravity pulls this material together, forming a protostar. When the core becomes hot enough, nuclear fusion begins, and the star starts to shine. It enters the main sequence phase, where it will spend most of its life. The star's fate depends on its mass. Lower-mass stars like our Sun will swell into a red giant before becoming a white dwarf. Massive stars have a more dramatic end, exploding in a supernova.`,
    questions: [
      {
        question: "What are the stellar nurseries where stars are born called?",
        options: ["Galaxies", "Black holes", "Nebulae", "Quasars"],
        correctAnswer: "Nebulae",
      },
      {
        question: "What process powers a star during its main sequence phase?",
        options: ["Nuclear fission", "Gravity", "Chemical reactions", "Nuclear fusion"],
        correctAnswer: "Nuclear fusion",
      },
      {
        question: "What is the spectacular explosion that marks the death of a massive star?",
        options: ["A red giant", "A white dwarf", "A supernova", "A protostar"],
        correctAnswer: "A supernova",
      },
    ],
  },
  {
    id: "story14",
    title: "The Lungs of the Planet",
    text: `The Amazon rainforest covers most of the Amazon basin of South America. This basin encompasses 7,000,000 square kilometers. Often called the "Lungs of the Planet," it produces more than 20% of the world's oxygen. It is home to an incredible diversity of species, with millions of types of insects, plants, fish, and other forms of life. Many of these species are still unknown to science.`,
    questions: [
      {
        question: "What nickname is often given to the Amazon rainforest?",
        options: ["The Green Hell", "The Lungs of the Planet", "The River Sea", "The Great Forest"],
        correctAnswer: "The Lungs of the Planet",
      },
      {
        question: "What percentage of the world's oxygen does the Amazon produce?",
        options: ["About 5%", "About 10%", "More than 20%", "Almost 50%"],
        correctAnswer: "More than 20%",
      },
      {
        question: "The biodiversity of the Amazon rainforest is best described as:",
        options: ["Low", "Average", "High", "Unknown"],
        correctAnswer: "High",
      },
    ],
  },
  {
    id: "story15",
    title: "The History of Coffee",
    text: `The history of coffee dates back to the 15th century. The origin of coffee is thought to be Ethiopia. The earliest credible evidence of coffee drinking appears in the middle of the 15th century in the Sufi shrines of Yemen. By the 16th century, it had reached the rest of the Middle East, Persia, and Turkey. Coffee then spread to Europe and the Americas. The first coffee house in England was opened in Oxford in 1652.`,
    questions: [
      {
        question: "Where is coffee believed to have originated?",
        options: ["Brazil", "Yemen", "Ethiopia", "Italy"],
        correctAnswer: "Ethiopia",
      },
      {
        question: "Where does the first credible evidence of coffee drinking come from?",
        options: ["Turkey", "Yemen", "England", "Persia"],
        correctAnswer: "Yemen",
      },
      {
        question: "After spreading through the Middle East, where did coffee expand to next?",
        options: ["Asia", "Australia", "Africa", "Europe"],
        correctAnswer: "Europe",
      },
    ],
  },
  {
    id: "story16",
    title: "The Ultimate Renaissance Man",
    text: `Leonardo da Vinci was an Italian polymath of the High Renaissance, considered one of the most diversely talented individuals ever. While famous as a painter for masterpieces like the "Mona Lisa" and "The Last Supper," his interests were vast. He was a sculptor, architect, musician, scientist, inventor, and anatomist. His notebooks contain designs for flying machines and armored vehicles, and anatomical studies that were centuries ahead of their time.`,
    questions: [
      {
        question: "Which famous painting is mentioned as one of Leonardo's masterpieces?",
        options: ["The Starry Night", "The Birth of Venus", "The Last Supper", "The School of Athens"],
        correctAnswer: "The Last Supper",
      },
      {
        question: "Which term best describes Leonardo da Vinci?",
        options: ["Philosopher", "Polymath", "Poet", "Historian"],
        correctAnswer: "Polymath",
      },
      {
        question: "What did Leonardo's notebooks contain?",
        options: ["Poems and stories", "Musical compositions", "Financial ledgers", "Designs for inventions and scientific studies"],
        correctAnswer: "Designs for inventions and scientific studies",
      },
    ],
  },
  {
    id: "story17",
    title: "The Enigma of Black Holes",
    text: `A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even light—can escape. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole. The boundary of no escape is called the event horizon. Although the event horizon has an enormous effect on an object crossing it, it has no locally detectable features. In many ways, a black hole acts as an ideal black body, as it reflects no light.`,
    questions: [
      {
        question: "Can light escape from a black hole?",
        options: ["Yes", "No", "Only some types of light", "It depends on the black hole's size"],
        correctAnswer: "No",
      },
      {
        question: "What is the 'point of no return' for a black hole called?",
        options: ["The singularity", "The event horizon", "The photon sphere", "The ergosphere"],
        correctAnswer: "The event horizon",
      },
      {
        question: "Which scientific theory predicts the existence of black holes?",
        options: ["Quantum Mechanics", "String Theory", "General Relativity", "Special Relativity"],
        correctAnswer: "General Relativity",
      },
    ],
  },
  {
    id: "story18",
    title: "The Sinking of the Titanic",
    text: `The RMS Titanic sank in the North Atlantic Ocean on 15 April 1912, after striking an iceberg during its maiden voyage from Southampton to New York City. Of the estimated 2,224 passengers and crew aboard, more than 1,500 died, making it one of modern history's deadliest peacetime commercial marine disasters. The ship was considered "unsinkable" due to its advanced safety features, but the iceberg breach was too severe. The disaster prompted major improvements in maritime safety.`,
    questions: [
      {
        question: "What caused the Titanic to sink?",
        options: ["A fire", "A storm", "It struck an iceberg", "Human error"],
        correctAnswer: "It struck an iceberg",
      },
      {
        question: "The Titanic was on its maiden voyage to which city?",
        options: ["Boston", "London", "New York City", "Halifax"],
        correctAnswer: "New York City",
      },
      {
        question: "What was a significant outcome of the Titanic disaster?",
        options: ["The end of luxury liners", "Major improvements in maritime safety", "A ban on night-time sailing", "The invention of sonar"],
        correctAnswer: "Major improvements in maritime safety",
      },
    ],
  },
  {
    id: "story19",
    title: "The Incredible Human Brain",
    text: `The human brain is the command center for the nervous system. It weighs about 3 pounds in the average adult and contains about 86 billion neurons. The brain is protected by the skull and is composed of the cerebrum, cerebellum, and brainstem. The cerebrum is the largest part and is responsible for thought and voluntary movement. The cerebellum is responsible for balance and coordination, while the brainstem controls vital functions like breathing and heart rate.`,
    questions: [
      {
        question: "What is the approximate weight of an adult human brain?",
        options: ["1 pound", "3 pounds", "5 pounds", "7 pounds"],
        correctAnswer: "3 pounds",
      },
      {
        question: "Which part of the brain is responsible for balance and coordination?",
        options: ["Cerebrum", "Brainstem", "Frontal Lobe", "Cerebellum"],
        correctAnswer: "Cerebellum",
      },
      {
        question: "Which part of the brain controls vital functions like breathing?",
        options: ["Cerebellum", "Cerebrum", "Brainstem", "Thalamus"],
        correctAnswer: "Brainstem",
      },
    ],
  },
  {
    id: "story20",
    title: "The Aurora Borealis",
    text: `The Aurora Borealis, or Northern Lights, is a natural light display in the Earth's sky, seen in high-latitude regions. Auroras are the result of disturbances in the magnetosphere caused by solar wind. These disturbances are caused by charged particles from the sun colliding with atoms in the upper atmosphere. When these particles collide with atoms, they excite them, causing them to emit light of various colors. The most common color is a brilliant yellow-green.`,
    questions: [
      {
        question: "What is another name for the Northern Lights?",
        options: ["The Southern Lights", "The Zodiacal Light", "The Aurora Australis", "The Aurora Borealis"],
        correctAnswer: "The Aurora Borealis",
      },
      {
        question: "What causes the aurora?",
        options: ["Moonlight reflecting off ice crystals", "Weather patterns", "Charged particles from the sun", "Pollution"],
        correctAnswer: "Charged particles from the sun",
      },
      {
        question: "Where on Earth are auroras most commonly seen?",
        options: ["Near the equator", "In desert regions", "In high-latitude regions", "Over the oceans"],
        correctAnswer: "In high-latitude regions",
      },
    ],
  },
];

const getShuffledStories = () =>
  [...stories].sort(() => Math.random() - 0.5);

export function ReadingCompGame() {
  const [gameState, setGameState] = useState<
    "setup" | "reading" | "answering" | "results"
  >("setup");
  const [storySet, setStorySet] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(true);

  const router = useRouter();
  const { incrementProgress } = useProgress();
  const { toast } = useToast();

  useEffect(() => {
    setStorySet(getShuffledStories());
  }, []);

  const currentStory = storySet[currentStoryIndex];
  const allStoriesCompleted =
    storySet.length > 0 && currentStoryIndex >= storySet.length - 1;

  const startGame = () => {
    logEvent(getAnalytics(), 'play_a_game', { game_name: 'ReadingComp' });
    setUserAnswers({});
    setScore(0);
    setGameState("reading");
  };

  const resetGame = useCallback(async () => {
    await showInterstitialAd();
    setStorySet(getShuffledStories());
    setCurrentStoryIndex(0);
    setGameState("setup");
  }, [] );

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.keys(userAnswers).length !== currentStory.questions.length) {
      toast({
        title: "Incomplete",
        description: "Please answer all questions.",
        variant: "destructive",
      });
      return;
    }

    let correctAnswers = 0;
    currentStory.questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    if (correctAnswers === currentStory.questions.length) {
      incrementProgress("reading");
    }
    setGameState("results");
  };

  const handleNextStory = () => {
    // The "Play Again" button in the dialog now handles the case where all stories are complete.
    if (currentStoryIndex < storySet.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      startGame();
    }
  };
  
  const handleStartFromTutorial = () => {
    setIsTutorialOpen(false);
    startGame();
  };

  if (gameState === "setup" || !currentStory) {
    return (
      <>
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <h1 className="text-3xl font-bold font-headline">
              Reading Comprehension
            </h1>
            <CardDescription>
              Read a short passage and answer questions to test your skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={startGame} size="lg">
              Start Challenge
            </Button>
          </CardContent>
        </Card>
        <AlertDialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>How to Play: Reading Comprehension</AlertDialogTitle>
                <AlertDialogDescription>
                    Read the passage carefully. When you're ready, proceed to the questions. Answer them based on what you've read. Good luck!
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogAction onClick={handleStartFromTutorial}>
                    Start Reading
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  if (gameState === "reading") {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <h1 className="text-3xl font-bold font-headline">
            {currentStory?.title}
          </h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg/relaxed whitespace-pre-line bg-primary/5 p-4 rounded-md border max-h-96 overflow-y-auto">
            {currentStory?.text}
          </div>
          <Button
            onClick={() => setGameState("answering")}
            className="w-full"
            size="lg"
          >
            I'm Ready for the Questions
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === "answering") {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <h1 className="text-3xl font-bold font-headline">
            Questions for "{currentStory?.title}"
          </h1>
          <CardDescription>
            Answer the following questions based on the text you just read.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {currentStory?.questions.map((q, index) => (
              <div key={index} className="space-y-3">
                <p className="font-semibold text-lg">{`${
                  index + 1
                }. ${q.question}`}</p>
                <RadioGroup
                  value={userAnswers[index]}
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  className="space-y-2"
                >
                  {q.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-3"
                    >
                      <RadioGroupItem
                        value={option}
                        id={`${currentStory.id}-q${index}-${option}`}
                      />
                      <Label
                        htmlFor={`${currentStory.id}-q${index}-${option}`}
                        className="font-normal cursor-pointer text-base"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <Button type="submit" size="lg" className="w-full">
              Submit Answers
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <AlertDialog
      open={gameState === "results"}
      onOpenChange={(open) => !open && setGameState("setup")}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Challenge Complete!</AlertDialogTitle>
          <AlertDialogDescription>
            You scored {score} out of {currentStory?.questions.length}.
            {score === currentStory?.questions.length
              ? " Perfect score, great job!"
              : " Keep practicing!"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Menu
          </Button>
          {allStoriesCompleted ? (
            <AlertDialogAction onClick={resetGame}>Play Again</AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={handleNextStory}>
              Next Story
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
