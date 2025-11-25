
"use client";

import { useState, useEffect, useMemo } from "react";
import { Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/use-progress";
import {
  cognitiveInsights,
  type Insight,
  type InsightContext,
} from "@/lib/cognitive-insights";

const gameNames: Record<string, string> = {
  memory: "Memory Match",
  logic: "Logic Puzzle",
  reading: "Reading Comprehension",
  speedReading: "Speed Reading",
};

export function CognitiveCoachCard() {
  const { progress, isLoaded } = useProgress();
  const [insight, setInsight] = useState<string | null>(null);

  const totalGamesPlayed = useMemo(() => {
    return Object.values(progress).reduce((sum, count) => sum + count, 0);
  }, [progress]);

  const getInsight = (): Insight | null => {
    // Wait until progress is loaded and there's some data
    if (!isLoaded || totalGamesPlayed === 0) {
      return cognitiveInsights.welcome;
    }

    const sortedProgress = Object.entries(progress).sort((a, b) => b[1] - a[1]);
    const mostPlayedGame = sortedProgress[0]?.[0];
    const leastPlayedGame = sortedProgress[sortedProgress.length - 1]?.[0];

    const context: InsightContext = {
      mostPlayed: gameNames[mostPlayedGame],
      leastPlayed: gameNames[leastPlayedGame],
      totalPlays: totalGamesPlayed,
    };
    
    // Find an applicable insight
    if (totalGamesPlayed > 15 && mostPlayedGame) {
        return cognitiveInsights.strongestSkill;
    }
    if (totalGamesPlayed > 5 && leastPlayedGame && leastPlayedGame !== mostPlayedGame) {
        return cognitiveInsights.diversify;
    }
    if (totalGamesPlayed > 1) {
        return cognitiveInsights.keepGoing;
    }

    // Default starting insight if they've played at least one game
    return cognitiveInsights.firstPlay;
  };

  useEffect(() => {
    const selectedInsight = getInsight();
    if (selectedInsight) {
      const context: InsightContext = {
        mostPlayed: gameNames[Object.entries(progress).sort((a, b) => b[1] - a[1])[0]?.[0]],
        leastPlayed: gameNames[Object.entries(progress).sort((a, b) => a[1] - b[1])[0]?.[0]],
        totalPlays: totalGamesPlayed,
      };
      setInsight(selectedInsight.text(context));
    }
  }, [progress, isLoaded, totalGamesPlayed]);
  
  // Don't render the card if there's no insight to show yet
  if (!insight) {
    return null;
  }

  return (
    <Card className="mb-12 bg-accent/20 border-accent/30 text-left">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Bot className="w-8 h-8 text-primary" />
        <CardTitle className="text-xl font-headline">Your AI Coach</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{insight}</p>
      </CardContent>
    </Card>
  );
}
