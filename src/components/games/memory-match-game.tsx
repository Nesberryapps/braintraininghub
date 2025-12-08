
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Confetti from 'react-confetti';
import {
  // Food
  Apple, Carrot, Cherry, Grape, Pizza, Sandwich, Cookie, Croissant,
  // Animals
  Dog, Cat, Bird, Fish, Rabbit, Turtle, Squirrel, Bug,
  // Sports
  Goal, Bike, Trophy, Medal, Swords, Target, Dumbbell, Award,
  // Shapes
  Circle, Square, Triangle, Hexagon, Pentagon, Octagon, Diamond, RectangleHorizontal as ShapeRectangle,
  // Other
  type LucideProps, Timer, HelpCircle, Video,
} from "lucide-react";
import { MemoryCard } from "./memory-card";
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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAudio } from "@/hooks/use-audio";
import { showRewardAd } from "@/services/admob";
import { useToast } from "@/hooks/use-toast";

type CardData = {
  id: number;
  icon: React.ElementType<LucideProps>;
  iconName: string;
};

type Theme = {
  name: string;
  icons: { icon: React.ElementType<LucideProps>; name: string }[];
};

type Difficulty = "Easy" | "Medium" | "Hard";

const THEMES: Theme[] = [
  { name: "Food", icons: [
      { icon: Apple, name: "Apple" }, { icon: Carrot, name: "Carrot" },
      { icon: Cherry, name: "Cherry" }, { icon: Grape, name: "Grape" },
      { icon: Pizza, name: "Pizza" }, { icon: Sandwich, name: "Sandwich" },
      { icon: Cookie, name: "Cookie" }, { icon: Croissant, name: "Croissant" }
  ]},
  { name: "Animals", icons: [
      { icon: Dog, name: "Dog" }, { icon: Cat, name: "Cat" },
      { icon: Bird, name: "Bird" }, { icon: Fish, name: "Fish" },
      { icon: Rabbit, name: "Rabbit" }, { icon: Turtle, name: "Turtle" },
      { icon: Squirrel, name: "Squirrel" }, { icon: Bug, name: "Bug" }
  ]},
  { name: "Sports", icons: [
    { icon: Goal, name: "Soccer Ball" }, { icon: Bike, name: "Bike" },
    { icon: Trophy, name: "Trophy" }, { icon: Medal, name: "Medal" },
    { icon: Swords, name: "Swords" }, { icon: Target, name: "Target" },
    { icon: Dumbbell, name: "Dumbbell" }, { icon: Award, name: "Award" }
  ]},
  { name: "Shapes", icons: [
    { icon: Circle, name: "Circle" }, { icon: Square, name: "Square" },
    { icon: Triangle, name: "Triangle" }, { icon: Hexagon, name: "Hexagon" },
    { icon: Pentagon, name: "Pentagon" }, { icon: Octagon, name: "Octagon" },
    { icon: Diamond, name: "Diamond" }, { icon: ShapeRectangle, name: "Rectangle" }
  ]},
];

const DIFFICULTY_SETTINGS: Record<Difficulty, { pairs: number; time: number }> = {
    Easy: { pairs: 4, time: 25 },
    Medium: { pairs: 6, time: 45 },
    Hard: { pairs: 8, time: 60 },
};

export function MemoryMatchGame() {
  const [gameState, setGameState] = useState<"setup" | "playing" | "completed" | "failed">("setup");
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0].name);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("Medium");
  const [isTutorialOpen, setIsTutorialOpen] = useState(true);
  
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeBonusUsed, setTimeBonusUsed] = useState(false);
  
  const { incrementProgress } = useProgress();
  const router = useRouter();
  const playSound = useAudio();
  const { toast } = useToast();

  const settings = useMemo(() => DIFFICULTY_SETTINGS[selectedDifficulty], [selectedDifficulty]);

  const generateCards = useCallback((themeName: string, difficulty: Difficulty) => {
    const theme = THEMES.find(t => t.name === themeName);
    if (!theme) return [];
    
    const { pairs } = DIFFICULTY_SETTINGS[difficulty];
    const iconsForLevel = theme.icons.slice(0, pairs);
    const cardPairs = iconsForLevel.flatMap((item, index) => [
      { id: index * 2, icon: item.icon, iconName: item.name },
      { id: index * 2 + 1, icon: item.icon, iconName: item.name },
    ]);
    return cardPairs.sort(() => Math.random() - 0.5);
  }, []);

  const startGame = useCallback(() => {
    setTimeLeft(settings.time);
    setCards(generateCards(selectedTheme, selectedDifficulty));
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsTimerRunning(false); // Timer starts on first click
    setShowConfetti(false);
    setTimeBonusUsed(false);
    setGameState("playing");
  }, [selectedTheme, selectedDifficulty, settings, generateCards]);


  const resetGame = useCallback(() => {
    setShowConfetti(false);
    setGameState("setup");
  }, []);

  const handleAddTime = () => {
    if (timeBonusUsed) return;
    showRewardAd(() => {
      setTimeLeft(prev => prev + 10);
      setTimeBonusUsed(true);
      toast({
        title: "Time Added!",
        description: "You've got 10 extra seconds.",
      });
    });
  };

  // Timer, win, and lose condition logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState !== "playing") return;
  
    if (isTimerRunning) {
      if (timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else {
        setGameState("failed");
        playSound("lose");
        setIsTimerRunning(false);
      }
    }
  
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, isTimerRunning, timeLeft, playSound]);

  // Win condition
  useEffect(() => {
    if (gameState === "playing" && cards.length > 0 && matchedPairs.length === settings.pairs) {
      setGameState("completed");
      setIsTimerRunning(false);
      setShowConfetti(true);
      playSound("win");
      incrementProgress("memory");
    }
  }, [gameState, matchedPairs, cards.length, settings.pairs, incrementProgress, playSound]);

  // Match checking logic
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCardIndex, secondCardIndex] = flippedCards;
      const firstCard = cards[firstCardIndex];
      const secondCard = cards[secondCardIndex];

      if (firstCard.iconName === secondCard.iconName) {
        playSound('correct');
        setMatchedPairs((prev) => [...prev, firstCard.iconName]);
        setFlippedCards([]); 
      } else {
        playSound('incorrect');
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, playSound]);

  const handleCardClick = (index: number) => {
    if (gameState !== 'playing' || flippedCards.length >= 2 || flippedCards.includes(index) || matchedPairs.includes(cards[index].iconName)) {
      return;
    }

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
    
    setMoves((prev) => prev + 1);
    setFlippedCards((prev) => [...prev, index]);
  };

  const dialogContent = useMemo(() => {
    if (gameState === 'completed') {
      return {
        title: "Congratulations!",
        description: `You matched all pairs! You did it in ${Math.ceil(moves / 2)} moves with ${timeLeft} seconds left!`
      };
    }
    if (gameState === 'failed') {
      return {
        title: "Time's Up!",
        description: "You ran out of time. Better luck next time!"
      };
    }
    return { title: "", description: "" };
  }, [gameState, moves, timeLeft]);
  
  const handlePlayAgain = () => {
    resetGame();
  }

  const handleBackToMenu = () => {
    router.push("/");
  }
  
  if (gameState === "setup") {
    return (
      <>
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-center text-3xl font-bold font-headline">Memory Match Setup</h1>
            <CardDescription className="text-center">Choose your theme and difficulty to start.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="theme-select">Theme</Label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger id="theme-select">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {THEMES.map(theme => (
                    <SelectItem key={theme.name} value={theme.name}>{theme.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="difficulty-select">Difficulty</Label>
              <Select value={selectedDifficulty} onValueChange={(val: string) => setSelectedDifficulty(val as Difficulty)}>
                <SelectTrigger id="difficulty-select">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(DIFFICULTY_SETTINGS).map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={startGame} size="lg">Start Game</Button>
            <Button variant="outline" size="sm" onClick={() => setIsTutorialOpen(true)}>
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Play
            </Button>
          </CardContent>
        </Card>

        <AlertDialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>How to Play: Memory Match</AlertDialogTitle>
              <AlertDialogDescription>
                Test your focus and recall. Flip over cards to find matching pairs. Find all the pairs before the timer runs out!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsTutorialOpen(false)}>Let's Play!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      {showConfetti && <Confetti recycle={false} onConfettiComplete={() => setShowConfetti(false)} />}
      <div className="flex flex-col items-center w-full max-w-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-4 px-2 gap-4">
           <h1 className="text-3xl font-bold font-headline text-left">Memory Match</h1>
           <div className="flex items-center gap-2 sm:gap-4">
                <Badge variant="outline" className="text-lg px-3 py-1">Moves: {Math.ceil(moves / 2)}</Badge>
                <Badge variant="outline" className="text-lg px-3 py-1 flex items-center gap-2">
                    <Timer className="w-5 h-5"/>
                    {timeLeft}s
                </Badge>
           </div>
        </div>
        <div className={`grid grid-cols-4 gap-2 sm:gap-4 p-4 bg-primary/10 rounded-lg`}>
          {cards.map((card, index) => (
            <MemoryCard
              key={card.id}
              icon={card.icon}
              isFlipped={
                flippedCards.includes(index) || matchedPairs.includes(card.iconName)
              }
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
        <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={resetGame}>
            New Game
            </Button>
            <Button variant="outline" onClick={handleAddTime} disabled={timeBonusUsed}>
                <Video className="mr-2 h-4 w-4" /> +10 Seconds
            </Button>
        </div>

        <AlertDialog open={gameState === 'completed' || gameState === 'failed'}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogContent.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={handleBackToMenu}>
                Back to Menu
              </Button>
              <AlertDialogAction onClick={handlePlayAgain}>Play Again</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
