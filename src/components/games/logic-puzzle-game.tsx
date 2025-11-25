
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

type Puzzle = {
  sequence: number[];
  answer: number;
};

const puzzles: Puzzle[] = [
  { sequence: [2, 4, 6, 8], answer: 10 },
  { sequence: [5, 10, 15, 20], answer: 25 },
  { sequence: [1, 1, 2, 3, 5], answer: 8 },
  { sequence: [10, 20, 30, 40], answer: 50 },
  { sequence: [9, 8, 7, 6], answer: 5 },
  { sequence: [1, 4, 9, 16], answer: 25 }, // Squares
  { sequence: [2, 3, 5, 7], answer: 11 }, // Prime Numbers
  { sequence: [8, 27, 64, 125], answer: 216 }, // Cubes
  { sequence: [3, 6, 12, 24], answer: 48 }, // Geometric Progression (x2)
  { sequence: [4, 5, 7, 10], answer: 14 }, // Difference increases by 1
  { sequence: [50, 45, 40, 35], answer: 30 }, // Arithmetic Progression (-5)
  { sequence: [1, 2, 6, 24], answer: 120 }, // Factorials
  { sequence: [17, 16, 14, 11], answer: 7 }, // Decreasing difference
  { sequence: [2, 6, 18, 54], answer: 162 }, // Geometric Progression (x3)
  { sequence: [99, 92, 86, 81], answer: 77 }, // Difference decreases by 1
  { sequence: [1, 3, 6, 10], answer: 15 }, // Triangular numbers
  { sequence: [4, 9, 13, 22], answer: 35 }, // Sum of previous two
  { sequence: [80, 40, 20, 10], answer: 5 }, // Halving
  { sequence: [5, 7, 10, 14], answer: 19 }, // Add 2, 3, 4, ...
  { sequence: [120, 99, 80, 63], answer: 48 }, // n^2 - 1
  { sequence: [3, 4, 7, 11], answer: 18 }, // Fibonacci-like
  { sequence: [2, 5, 11, 23], answer: 47 }, // (x * 2) + 1
  { sequence: [61, 52, 43, 34], answer: 25 }, // Subtracting 9
  { sequence: [1, 5, 13, 29], answer: 61 }, // (x * 2) + 3
];

const getShuffledPuzzles = () => [...puzzles].sort(() => Math.random() - 0.5);

export function LogicPuzzleGame() {
  const [puzzleSet, setPuzzleSet] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(true);
  const { incrementProgress } = useProgress();
  const router = useRouter();
  const { toast } = useToast();
  const playSound = useAudio();

  useEffect(() => {
    setPuzzleSet(getShuffledPuzzles());
  }, []);

  const currentPuzzle = useMemo(
    () => puzzleSet[currentPuzzleIndex],
    [currentPuzzleIndex, puzzleSet]
  );

  const resetGame = useCallback(() => {
    setPuzzleSet(getShuffledPuzzles());
    setCurrentPuzzleIndex(0);
    setInputValue("");
    setIsGameComplete(false);
  }, []);

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < puzzleSet.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
    } else {
      setIsGameComplete(true);
      incrementProgress("logic");
    }
    setInputValue("");
  }

  const handleCheckAnswer = (e: FormEvent) => {
    e.preventDefault();
    const userAnswer = parseInt(inputValue, 10);

    if (isNaN(userAnswer)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a number.",
        variant: "destructive",
      });
      return;
    }

    if (currentPuzzle && userAnswer === currentPuzzle.answer) {
      playSound('correct');
      setTimeout(() => {
        handleNextPuzzle();
      }, 500);
    } else {
      playSound('incorrect');
      toast({
        title: "Not quite!",
        description: "That's not the one, but don't give up. You've got this!",
        variant: "destructive",
      });
    }
  };

  if (!currentPuzzle) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-center text-3xl font-bold font-headline">Logic Puzzle</h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 min-h-[200px]">
          <p className="text-muted-foreground">Loading puzzle...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-center text-3xl font-bold font-headline">Logic Puzzle</h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <p className="text-muted-foreground">What number comes next in the sequence?</p>
          <div className="flex items-center justify-center gap-4 text-2xl font-mono bg-primary/10 p-4 rounded-lg w-full">
            {currentPuzzle.sequence.map((num, i) => (
              <span key={i}>{num}</span>
            ))}
            <span className="text-primary font-bold">?</span>
          </div>
          <form onSubmit={handleCheckAnswer} className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="number"
              placeholder="Your answer"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-center text-lg"
              aria-label="Enter your answer for the sequence"
            />
            <Button type="submit">Check</Button>
          </form>
           <Button variant="outline" onClick={resetGame} className="mt-2">
            Reset Puzzles
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={isGameComplete} onOpenChange={setIsGameComplete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Congratulations!</AlertDialogTitle>
            <AlertDialogDescription>
              You've solved all the puzzles. Your logic skills are sharp!
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
              <AlertDialogTitle>How to Play: Logic Puzzle</AlertDialogTitle>
              <AlertDialogDescription>
                Analyze the sequence of numbers to find the pattern. Enter the number that should come next to solve the puzzle.
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
