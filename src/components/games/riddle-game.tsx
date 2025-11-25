
"use client";

import { useState, useMemo, useCallback, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/use-progress";
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
import { useToast } from "@/hooks/use-toast";
import { useAudio } from "@/hooks/use-audio";
import { Lightbulb } from "lucide-react";

type Riddle = {
  text: string;
  answer: string;
  hint: string;
};

const riddles: Riddle[] = [
  { text: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", answer: "a map", hint: "I'm a representation of the world, often on paper." },
  { text: "What has to be broken before you can use it?", answer: "an egg", hint: "It's often eaten for breakfast." },
  { text: "I’m tall when I’m young, and I’m short when I’m old. What am I?", answer: "a candle", hint: "I have a wick and give off light." },
  { text: "What is full of holes but still holds water?", answer: "a sponge", hint: "You use me to clean dishes or yourself." },
  { text: "What question can you never answer yes to?", answer: "are you asleep yet", hint: "The question itself implies a state you can't be in to answer." },
  { text: "What is always in front of you but can’t be seen?", answer: "the future", hint: "It hasn't happened yet." },
  { text: "What has many keys but can't open a single lock?", answer: "a piano", hint: "It makes music." },
  { text: "What can you hold in your left hand but not in your right?", answer: "your right elbow", hint: "It's a part of your own body." },
  { text: "What gets wet while drying?", answer: "a towel", hint: "You use me after a shower." },
  { text: "What goes up and down but does not move?", answer: "a staircase", hint: "You use me to get to another floor." },
  { text: "The more of this there is, the less you see. What is it?", answer: "darkness", hint: "It's the absence of light." },
  { text: "I have a neck and no head, a body and no legs. What am I?", answer: "a bottle", hint: "You might drink from me." },
  { text: "What has one eye, but cannot see?", answer: "a needle", hint: "I'm used for sewing." },
  { text: "What has a thumb and four fingers, but is not a hand?", answer: "a glove", hint: "You wear me in the winter." },
  { text: "I am an odd number. Take away a letter and I become even. What number am I?", answer: "seven", hint: "It's a number between one and ten." },
  { text: "What is so fragile that saying its name breaks it?", answer: "silence", hint: "It's the absence of sound." },
  { text: "What can you catch, but not throw?", answer: "a cold", hint: "It's a common illness." },
  { text: "I shave every day, but my beard stays the same. What am I?", answer: "a barber", hint: "I'm a person with a profession." },
];

const getShuffledRiddles = () => [...riddles].sort(() => Math.random() - 0.5);

export function RiddleGame() {
  const [riddleSet, setRiddleSet] = useState<Riddle[]>([]);
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(true);
  const [hint, setHint] = useState<string | null>(null);
  const { incrementProgress } = useProgress();
  const router = useRouter();
  const { toast } = useToast();
  const playSound = useAudio();

  useEffect(() => {
    setRiddleSet(getShuffledRiddles());
  }, []);

  const currentRiddle = useMemo(
    () => riddleSet[currentRiddleIndex],
    [currentRiddleIndex, riddleSet]
  );

  const resetGame = useCallback(() => {
    setRiddleSet(getShuffledRiddles());
    setCurrentRiddleIndex(0);
    setInputValue("");
    setIsGameComplete(false);
    setHint(null);
  }, []);

  const handleNextRiddle = () => {
    if (currentRiddleIndex < riddleSet.length - 1) {
      setCurrentRiddleIndex(currentRiddleIndex + 1);
    } else {
      setIsGameComplete(true);
      incrementProgress("riddle");
    }
    setInputValue("");
    setHint(null);
  }

  const handleCheckAnswer = (e: FormEvent) => {
    e.preventDefault();
    const userAnswer = inputValue.trim().toLowerCase();

    if (!userAnswer) {
      toast({
        title: "Invalid Input",
        description: "Please enter an answer.",
        variant: "destructive",
      });
      return;
    }

    if (currentRiddle && userAnswer.includes(currentRiddle.answer.toLowerCase())) {
      playSound('correct');
      toast({
          title: "Correct!",
          description: "You solved the riddle!",
      });
      setTimeout(() => {
        handleNextRiddle();
      }, 1000);
    } else {
      playSound('incorrect');
      toast({
        title: "Not quite!",
        description: "That's not the right answer. Give it another thought!",
        variant: "destructive",
      });
    }
  };

  const showHint = () => {
    if (currentRiddle) {
        setHint(currentRiddle.hint);
        toast({
            title: `Hint Unlocked!`,
            description: currentRiddle.hint,
        });
    }
  };

  if (!currentRiddle) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h1 className="text-center text-3xl font-bold font-headline">Riddle Me This</h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 min-h-[200px]">
          <p className="text-muted-foreground">Loading riddle...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h1 className="text-center text-3xl font-bold font-headline">Riddle Me This</h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <p className="text-center text-lg/relaxed bg-primary/10 p-6 rounded-lg w-full min-h-[100px]">
            {currentRiddle.text}
          </p>
          <form onSubmit={handleCheckAnswer} className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Your answer"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-center text-lg"
              aria-label="Enter your answer for the riddle"
            />
            <Button type="submit">Guess</Button>
          </form>
          <div className="flex gap-2">
           <Button variant="outline" onClick={resetGame} className="mt-2">
            New Game
          </Button>
           <Button variant="outline" onClick={showHint} className="mt-2" disabled={!!hint}>
            <Lightbulb className="mr-2 h-4 w-4" /> Hint
          </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isGameComplete} onOpenChange={setIsGameComplete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Congratulations!</AlertDialogTitle>
            <AlertDialogDescription>
              You've solved all the riddles. Your wit is sharp!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
              <Button variant="outline" onClick={() => router.push("/")}>
              Back to Menu
            </Button>
            <AlertDialogAction onClick={resetGame}>Play Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>How to Play: Riddle Me This</AlertDialogTitle>
              <AlertDialogDescription>
                Read the riddle carefully and type your answer in the box. The answers are usually simple, everyday objects or concepts. Good luck!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsTutorialOpen(false)}>Let's Go!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
