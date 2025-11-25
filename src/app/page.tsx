
"use client";

import Link from "next/link";
import { BrainCircuit, Puzzle, FileText, Rabbit, TrendingUp, Sparkles, Brain, HelpCircle, CaseUpper } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProgress, type ProgressGame } from "@/hooks/use-progress";
import { Badge } from "@/components/ui/badge";
import AdBanner from "@/components/ads/ad-banner";
import { DailyTipCard } from "@/components/daily-tip-card";
import { Hero } from "@/components/hero";
import { FeatureCard } from "@/components/feature-card";
import { CognitiveCoachCard } from "@/components/cognitive-coach-card";

const gameIcons: Record<ProgressGame, React.ReactNode> = {
  memory: <BrainCircuit className="w-8 h-8 text-primary" />,
  logic: <Puzzle className="w-8 h-8 text-primary" />,
  reading: <FileText className="w-8 h-8 text-primary" />,
  speedReading: <Rabbit className="w-8 h-8 text-primary" />,
  riddle: <HelpCircle className="w-8 h-8 text-primary" />,
  wordLadder: <CaseUpper className="w-8 h-8 text-primary" />,
};

const gameNames: Record<ProgressGame, string> = {
  memory: 'Memory Match',
  logic: 'Logic Puzzle',
  reading: 'Reading Comprehension',
  speedReading: 'Speed Reading',
  riddle: 'Riddle Me This',
  wordLadder: 'Word Ladder',
};

export default function Home() {
  const { progress, isLoaded } = useProgress();

  const games = [
    {
      name: "Memory Match",
      description: "Test your focus and recall by matching pairs of cards.",
      href: "/memory-match",
      icon: <BrainCircuit className="w-12 h-12 text-primary" />,
      progress: progress.memory,
    },
    {
      name: "Logic Puzzle",
      description:
        "Sharpen your reasoning skills with number sequence puzzles.",
      href: "/logic-puzzle",
      icon: <Puzzle className="w-12 h-12 text-primary" />,
      progress: progress.logic,
    },
    {
      name: "Reading Comprehension",
      description: "Read a short passage and test your understanding.",
      href: "/reading-comp",
      icon: <FileText className="w-12 h-12 text-primary" />,
      progress: progress.reading,
    },
    {
      name: "Speed Reading",
      description: "Challenge your focus and improve your reading speed.",
      href: "/speed-reading",
      icon: <Rabbit className="w-12 h-12 text-primary" />,
      progress: progress.speedReading,
    },
    {
      name: "Riddle Me This",
      description: "Solve clever riddles to boost your lateral thinking.",
      href: "/riddle-game",
      icon: <HelpCircle className="w-12 h-12 text-primary" />,
      progress: progress.riddle,
    },
    {
      name: "Word Ladder",
      description: "Transform one word into another, one letter at a time.",
      href: "/word-ladder",
      icon: <CaseUpper className="w-12 h-12 text-primary" />,
      progress: progress.wordLadder,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        <Hero />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16 text-center">
            <FeatureCard 
                icon={<Brain className="w-12 h-12 text-primary" />}
                title="Diverse Brain Games"
                description="Engage with a variety of games designed to challenge different cognitive skills, from memory and logic to reading speed and comprehension."
            />
            <FeatureCard 
                icon={<TrendingUp className="w-12 h-12 text-primary" />}
                title="Track Your Progress"
                description="Monitor your performance over time. Your scores are saved on your device so you can see your cognitive abilities grow with each session."
            />
            <FeatureCard 
                icon={<Sparkles className="w-12 h-12 text-primary" />}
                title="AI-Powered Insights"
                description="Get personalized feedback with our AI Coach. See insights into your cognitive patterns and get suggestions for targeted training."
            />
        </div>

        <DailyTipCard />

        <div id="games" className="my-16 text-center">
             <h2 className="text-4xl font-bold font-headline text-primary mb-4">Our Games</h2>
             <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Each game is a fun workout for your mind, designed to be both engaging and beneficial.
             </p>
        </div>

        <CognitiveCoachCard />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          {games.map((game) => (
            <Link
              href={game.href}
              key={game.name}
              className="block group"
            >
              <Card className="h-full flex flex-col text-left hover:shadow-lg hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4">
                  {game.icon}
                  <div>
                    <CardTitle className="text-2xl font-headline">
                      {game.name}
                    </CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow"></CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Button variant="default">Play Now</Button>
                  {isLoaded && game.progress > 0 && (
                    <Badge variant="secondary">
                      Completed: {game.progress}
                    </Badge>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        <AdBanner dataAdSlot="9200324245" className="mt-8" />
      </div>
    </div>
  );
}
