
"use client";

import { useState, useEffect, useCallback, useMemo, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/hooks/use-progress";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { showRewardAd, showInterstitialAd } from "@/services/admob";
import { Video } from "lucide-react";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type PassageContent = {
  text: string;
  questions: Question[];
};

const passages: PassageContent[] = [
  {
    text: "The journey of a thousand miles begins with a single step. This ancient proverb speaks to the importance of taking that first, crucial action towards any goal. Often, the sheer size of a task can feel overwhelming, leading to procrastination or inaction. However, by breaking down a large objective into smaller, more manageable parts, the path forward becomes clearer and less daunting. Each step, no matter how small, builds momentum and brings you closer to your destination. It is a testament to the power of persistence and the simple act of starting.",
    questions: [
      {
        question: "What does the proverb 'The journey of a thousand miles begins with a single step' emphasize?",
        options: ["The difficulty of long journeys", "The importance of starting", "The need for a map", "The speed of travel"],
        correctAnswer: "The importance of starting",
      },
      {
        question: "What is a common reaction to a large, overwhelming task mentioned in the passage?",
        options: ["Immediate action", "Procrastination or inaction", "Asking for help", "Breaking it down"],
        correctAnswer: "Procrastination or inaction",
      },
      {
        question: "According to the passage, what is the benefit of breaking down a large objective?",
        options: ["It makes the task take longer", "The path forward becomes clearer", "It requires more resources", "It guarantees success"],
        correctAnswer: "The path forward becomes clearer",
      },
    ],
  },
  {
    text: "The Great Barrier Reef is the world's largest coral reef system, composed of over 2,900 individual reefs and 900 islands stretching for over 2,300 kilometres. Located in the Coral Sea, off the coast of Queensland, Australia, it is a marvel of biodiversity. The reef is home to a vast array of marine life, including countless species of fish, mollusks, and starfish. Unfortunately, this natural wonder is under threat. Climate change is causing rising sea temperatures, which leads to coral bleaching, a phenomenon where corals expel their symbiotic algae and turn white, often leading to their death.",
    questions: [
      {
        question: "Where is the Great Barrier Reef located?",
        options: ["The Atlantic Ocean", "The Indian Ocean", "The Coral Sea", "The Mediterranean Sea"],
        correctAnswer: "The Coral Sea",
      },
      {
        question: "What is the primary threat to the Great Barrier Reef mentioned in the text?",
        options: ["Overfishing", "Pollution from ships", "Coral bleaching from rising sea temperatures", "Coastal development"],
        correctAnswer: "Coral bleaching from rising sea temperatures",
      },
      {
        question: "What happens during coral bleaching?",
        options: ["The coral changes its color to blue.", "The coral grows faster than usual.", "Corals expel their algae and turn white.", "The reef attracts more tourists."],
        correctAnswer: "Corals expel their algae and turn white.",
      },
    ],
  },
  {
    text: "Honeybees are vital pollinators for flowers, fruits, and vegetables. They live in large, organized colonies which can contain tens of thousands of individuals. Each colony has a single queen bee, whose primary role is to lay eggs. The vast majority of the bees are female worker bees, who perform all the tasks of foraging, building the hive, and caring for the young. Male bees, called drones, have one job: to mate with a new queen. Bees communicate through a series of complex 'dances,' the most famous of which is the 'waggle dance,' used to direct other bees to sources of nectar.",
    questions: [
      {
        question: "What is the primary role of a queen bee?",
        options: ["To build the hive", "To defend the colony", "To lay eggs", "To find nectar"],
        correctAnswer: "To lay eggs",
      },
      {
        question: "What is the name of the dance bees use to communicate the location of food?",
        options: ["The circle dance", "The waggle dance", "The nectar-hop", "The pollen polka"],
        correctAnswer: "The waggle dance",
      },
      {
        question: "Who performs most of the tasks in a honeybee hive?",
        options: ["The queen bee", "The male drones", "The female worker bees", "The young bees"],
        correctAnswer: "The female worker bees",
      },
    ],
  },
];

export function SpeedReadingGame() {
    const [gameState, setGameState] = useState<"setup" | "reading" | "answering" | "results">("setup");
    const [wpm, setWpm] = useState(200);
    const [selectedPassage, setSelectedPassage] = useState<PassageContent | null>(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [score, setScore] = useState(0);
    const [isTutorialOpen, setIsTutorialOpen] = useState(true);
    const [bonusUsed, setBonusUsed] = useState(false);
    
    const { incrementProgress } = useProgress();
    const router = useRouter();
    const { toast } = useToast();

    const words = useMemo(() => selectedPassage ? selectedPassage.text.split(/\s+/) : [], [selectedPassage]);
    const questions = useMemo(() => selectedPassage ? selectedPassage.questions : [], [selectedPassage]);

    const intervalTime = useMemo(() => 60000 / wpm, [wpm]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && currentWordIndex < words.length) {
            timer = setInterval(() => {
                setCurrentWordIndex(prev => prev + 1);
            }, intervalTime);
        } else if (currentWordIndex >= words.length && words.length > 0 && gameState === 'reading') {
            setIsPlaying(false);
            setGameState("answering");
        }

        return () => clearInterval(timer);
    }, [isPlaying, currentWordIndex, intervalTime, gameState, words.length]);

    const startGame = useCallback((useBonus = false) => {
        const randomPassage = passages[Math.floor(Math.random() * passages.length)];
        setSelectedPassage(randomPassage);
        setCurrentWordIndex(0);
        setUserAnswers({});
        setScore(0);
        setGameState("reading");
        setIsPlaying(true);
        setBonusUsed(useBonus);
    }, []);

    const restartWithBonus = () => {
        if (!selectedPassage) return;
        showRewardAd(() => {
          setCurrentWordIndex(0);
          setUserAnswers({});
          setScore(0);
          setGameState("reading");
          setIsPlaying(true);
          setBonusUsed(true);
          toast({
              title: "Bonus Active!",
              description: "Slower speed has been applied for this round.",
          });
          // Temporarily reduce WPM for the bonus round
          setWpm(prev => Math.max(100, prev - 50)); 
        });
    };

    const resetGame = useCallback(async() => {
        await showInterstitialAd();
        setGameState("setup");
        setCurrentWordIndex(0);
        setIsPlaying(false);
        setUserAnswers({});
        setScore(0);
        setSelectedPassage(null);
        setBonusUsed(false);
        setWpm(200); // Reset WPM to default
    }, []);

    const togglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        setUserAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (Object.keys(userAnswers).length !== questions.length) {
            toast({
                title: "Incomplete",
                description: "Please answer all questions.",
                variant: "destructive",
            });
            return;
        }

        let correctAnswers = 0;
        questions.forEach((q, index) => {
            if (userAnswers[index] === q.correctAnswer) {
                correctAnswers++;
            }
        });
        setScore(correctAnswers);
        if (correctAnswers === questions.length) {
            incrementProgress("speedReading");
        }
        setGameState("results");
    };
    
    const readingProgress = words.length > 0 ? (currentWordIndex / words.length) * 100 : 0;

    if (gameState === "setup") {
        return (
            <>
                <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <h1 className="text-3xl font-bold font-headline">Speed Reading</h1>
                        <CardDescription>Challenge your focus and reading speed.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 items-center">
                        <div className="w-full px-4">
                            <Label htmlFor="wpm-slider" className="text-lg">Words Per Minute: {wpm}</Label>
                            <Slider
                                id="wpm-slider"
                                min={100}
                                max={1000}
                                step={10}
                                value={[wpm]}
                                onValueChange={(value) => setWpm(value[0])}
                                className="my-4"
                            />
                        </div>
                        <Button onClick={() => startGame(false)} size="lg">Start Reading</Button>
                    </CardContent>
                </Card>
                <AlertDialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>How to Play: Speed Reading</AlertDialogTitle>
                        <AlertDialogDescription>
                            A passage will be displayed one word at a time at your chosen speed. After the passage is complete, you will answer a few questions to test your comprehension.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogAction onClick={() => {
                            setIsTutorialOpen(false);
                            startGame();
                        }}>Start</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        );
    }

    if (gameState === "reading") {
        return (
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                     <h1 className="text-3xl font-bold font-headline">Speed Reading</h1>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-8">
                    <div className="w-full h-32 flex items-center justify-center bg-primary/10 rounded-lg">
                        <p className="text-5xl md:text-6xl font-bold font-mono tracking-wider">{words[currentWordIndex]}</p>
                    </div>
                    <div className="w-full px-4">
                        <Progress value={readingProgress} className="h-4" />
                        <p className="text-sm text-muted-foreground mt-2">{currentWordIndex} / {words.length} words</p>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={togglePlay} variant="outline">{isPlaying ? "Pause" : "Resume"}</Button>
                        <Button onClick={resetGame} variant="destructive">Stop</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (gameState === "answering") {
        return (
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <h1 className="text-3xl font-bold font-headline">
                        Comprehension Check
                    </h1>
                    <CardDescription>
                        Answer the following questions based on the text you just read.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {questions.map((q, index) => (
                            <div key={index} className="space-y-3">
                                <p className="font-semibold text-lg">{`${index + 1}. ${q.question}`}</p>
                                <RadioGroup
                                    value={userAnswers[index]}
                                    onValueChange={(value) => handleAnswerChange(index, value)}
                                    className="space-y-2"
                                >
                                    {q.options.map((option) => (
                                        <div key={option} className="flex items-center space-x-3">
                                            <RadioGroupItem value={option} id={`q${index}-${option}`} />
                                            <Label htmlFor={`q${index}-${option}`} className="font-normal cursor-pointer text-base">
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
        <AlertDialog open={gameState === 'results'} onOpenChange={(open) => !open && resetGame()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Challenge Complete!</AlertDialogTitle>
                    <AlertDialogDescription>
                        You scored {score} out of {questions.length}.
                        {score === questions.length ? " Perfect score! Your focus is sharp!" : " Good effort! Keep practicing."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => router.push("/")}>
                        Back to Menu
                    </Button>
                    <Button variant="outline" onClick={resetGame}>
                        New Passage
                    </Button>
                    <AlertDialogAction onClick={restartWithBonus} disabled={bonusUsed}>
                        <Video className="mr-2 h-4 w-4" /> Try Again with Bonus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
