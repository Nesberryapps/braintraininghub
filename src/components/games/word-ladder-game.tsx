
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowRight, Lightbulb, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { words3, words4, words5 } from "@/lib/word-lists";
import { showRewardAd, showInterstitialAd } from "@/services/admob";
import { getAnalytics, logEvent } from "firebase/analytics";

type Puzzle = {
  start: string;
  end: string;
  solution: string[];
};

// All words are 4 letters to keep it consistent
const puzzles: Puzzle[] = [
  { start: "COLD", end: "WARM", solution: ["COLD", "CORD", "WORD", "WARD", "WARM"] },
  { start: "HEAD", end: "TAIL", solution: ["HEAD", "HEAL", "TEAL", "TELL", "TALL", "TAIL"] },
  { start: "FOUR", end: "FIVE", solution: ["FOUR", "FOUL", "FOIL", "FAIL", "FALL", "FILL", "FILE", "FIVE"] },
  { start: "PIG", end: "STY", solution: ["PIG", "FIG", "FIT", "SIT", "STY"] }, // 3-letter example
  { start: "WORK", end: "PLAY", solution: ["WORK", "PORK", "PERK", "PEAK", "PLAT", "PLAY"] },
  { start: "CAT", end: "DOG", solution: ["CAT", "COT", "DOT", "DOG"] }, // 3-letter example
  { start: "LOVE", end: "HATE", solution: ["LOVE", "LAVE", "HAVE", "HATE"] },
  { start: "WHEAT", end: "BREAD", solution: ["WHEAT", "CHEAT", "CLEAT", "BLEAT", "BLEAK", "BREAK", "BREAD"] }, // 5-letter example
  { start: "SMILE", end: "FROWN", solution: ["SMILE", "SLIME", "SLIMS", "SLOWS", "FLOWN", "FROWN"] }, // 5-letter example
];

const getShuffledPuzzles = () => [...puzzles].sort(() => Math.random() - 0.5);

const getWordList = (length: number): Set<string> => {
    switch (length) {
        case 3: return words3;
        case 4: return words4;
        case 5: return words5;
        default: return new Set();
    }
}

export function WordLadderGame() {
  const [puzzleSet, setPuzzleSet] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [ladder, setLadder] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(true);
  const [hintUsed, setHintUsed] = useState(false);
  const { incrementProgress } = useProgress();
  const router = useRouter();
  const { toast } = useToast();
  const playSound = useAudio();

  const currentPuzzle = useMemo(() => puzzleSet[currentPuzzleIndex], [currentPuzzleIndex, puzzleSet]);
  const wordList = useMemo(() => currentPuzzle ? getWordList(currentPuzzle.start.length) : new Set(), [currentPuzzle]);


  const startNewPuzzle = useCallback((puzzles: Puzzle[], index: number) => {
    const puzzle = puzzles[index];
    if (puzzle) {
      logEvent(getAnalytics(), 'play_a_game', { game_name: 'WordLadder' });
      setLadder([puzzle.start]);
      setInputValue("");
      setHintUsed(false);
    }
  }, []);

  useEffect(() => {
    const shuffled = getShuffledPuzzles();
    setPuzzleSet(shuffled);
    startNewPuzzle(shuffled, 0);
  }, [startNewPuzzle]);

  const resetGame = useCallback(async () => { // Make async
    await showInterstitialAd(); // Show Ad
    
    const shuffled = getShuffledPuzzles();
    setPuzzleSet(shuffled);
    setCurrentPuzzleIndex(0);
    startNewPuzzle(shuffled, 0);
    setIsGameComplete(false);
  }, [startNewPuzzle, puzzleSet]);
  
  // 1. Make the function async
  const handleNextPuzzle = async () => {
    
    // 2. Trigger the Ad (The game pauses here until they close the ad)
    await showInterstitialAd();

    // 3. Original Logic continues...
    const nextIndex = currentPuzzleIndex + 1;
    if (nextIndex < puzzleSet.length) {
      setCurrentPuzzleIndex(nextIndex);
      startNewPuzzle(puzzleSet, nextIndex);
    } else {
      setIsGameComplete(true);
      incrementProgress("wordLadder");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentPuzzle) {
        setInputValue(e.target.value.toUpperCase().slice(0, currentPuzzle.start.length));
    }
  };

  const checkWordValidity = (current: string, next: string): boolean => {
    if (current.length !== next.length) return false;
    let diff = 0;
    for (let i = 0; i < current.length; i++) {
      if (current[i] !== next[i]) {
        diff++;
      }
    }
    return diff === 1;
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    if (!wordList.has(inputValue.toLowerCase())) {
        playSound('incorrect');
        toast({
            variant: 'destructive',
            title: 'Not a valid word',
            description: `"${inputValue}" is not in our dictionary.`
        });
        return;
    }

    const lastWord = ladder[ladder.length - 1];
    if (checkWordValidity(lastWord, inputValue)) {
      const newLadder = [...ladder, inputValue];
      setLadder(newLadder);
      setInputValue("");
      playSound('correct');

      if (inputValue === currentPuzzle.end) {
        const userSteps = newLadder.length - 1;
        const optimalSteps = currentPuzzle.solution.length - 1;
        toast({
            title: "You reached the end!",
            description: `Solved in ${userSteps} steps. ${userSteps === optimalSteps ? "Perfect!" : `Optimal is ${optimalSteps}.`}`
        });
        incrementProgress("wordLadder");
        setTimeout(handleNextPuzzle, 1500);
      }
    } else {
      playSound('incorrect');
      toast({
        variant: 'destructive',
        title: 'Invalid step',
        description: 'You can only change one letter at a time.'
      });
    }
  };

  const handleUndo = () => {
    if (ladder.length > 1) {
      setLadder(ladder.slice(0, -1));
    }
  };

  const handleShowHint = () => {
    if (!currentPuzzle || hintUsed) return;
    showRewardAd(() => {
        const currentStepIndex = ladder.length - 1;
        const solution = currentPuzzle.solution;
        if (currentStepIndex < solution.length - 1) {
            const nextCorrectWord = solution[currentStepIndex + 1];
            if (ladder[ladder.length - 1] === solution[currentStepIndex]) {
                setLadder([...ladder, nextCorrectWord]);
                toast({
                    title: "Hint Unlocked!",
                    description: `The next word is ${nextCorrectWord}.`,
                });
            } else {
                toast({
                    title: "Hint",
                    description: `A possible next word from the solution path is '${solution[currentStepIndex + 1]}'. You may need to undo to get back on the optimal path.`
                });
            }
            setHintUsed(true);
        }
    });
  };

  const handleStartFromTutorial = () => {
    setIsTutorialOpen(false);
  };

  if (!currentPuzzle) {
    return <p>Loading...</p>;
  }

  const optimalSteps = currentPuzzle.solution.length - 1;
  const currentSteps = ladder.length - 1;

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold font-headline">Word Ladder</h1>
          <CardDescription>Change one letter at a time to reach the end word.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center gap-2 text-2xl font-bold font-mono">
                <span>{currentPuzzle.start}</span>
                <ArrowRight className="h-6 w-6 text-primary"/>
                <span>{currentPuzzle.end}</span>
            </div>
            <Badge variant="outline" className="text-sm">
                Steps: {currentSteps} / {optimalSteps}
            </Badge>
          </div>

          <div className="w-full bg-primary/10 p-4 rounded-md min-h-[150px] flex flex-col items-center gap-1">
            {ladder.map((word, index) => (
              <Badge key={index} variant="secondary" className="text-lg font-mono p-2">
                {word}
              </Badge>
            ))}
          </div>

          <form onSubmit={handleAddWord} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder={`Next ${currentPuzzle.start.length}-letter word`}
              value={inputValue}
              onChange={handleInputChange}
              className="text-center text-lg font-mono"
              aria-label="Enter next word"
            />
            <Button type="submit">Add</Button>
          </form>

          <div className="grid grid-cols-3 gap-2 w-full">
            <Button variant="outline" onClick={handleUndo} disabled={ladder.length <= 1}>
              Undo
            </Button>
            <Button variant="secondary" onClick={resetGame}>
              New Game
            </Button>
            <Button variant="outline" onClick={handleShowHint} disabled={hintUsed} >
              <Video className="mr-2 h-4 w-4" />
              Hint
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isGameComplete} onOpenChange={setIsGameComplete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Congratulations!</AlertDialogTitle>
            <AlertDialogDescription>
              You've completed all the word ladders. Your vocabulary skills are impressive!
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
            <AlertDialogTitle>How to Play: Word Ladder</AlertDialogTitle>
            <AlertDialogDescription>
              Transform the start word into the end word by changing only one letter at a time. Each intermediate step must be a valid word. Try to do it in the optimal number of steps!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleStartFromTutorial}>Let's Climb!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
