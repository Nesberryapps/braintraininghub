
export type InsightContext = {
    mostPlayed: string;
    leastPlayed: string;
    totalPlays: number;
};

export type Insight = {
  id: string;
  text: (context: InsightContext) => string;
  condition?: (context: InsightContext) => boolean;
};

type InsightCategory = {
    [key: string]: Insight;
};

export const cognitiveInsights: InsightCategory = {
    welcome: {
        id: "welcome",
        text: () => "Welcome! Play a few games to start tracking your progress and receive personalized insights.",
    },
    firstPlay: {
        id: "firstPlay",
        text: () => "You've completed your first game! This is the first step on your journey to a sharper mind. Keep it up!",
    },
    keepGoing: {
        id: "keepGoing",
        text: (ctx) => `You've played ${ctx.totalPlays} games. Consistency is key to cognitive improvement. Let's play another round!`,
    },
    strongestSkill: {
        id: "strongestSkill",
        text: (ctx) => `You seem to have a knack for ${ctx.mostPlayed}! It's your most played game. Strengthening your talents is just as important as improving your weaknesses.`,
    },
    diversify: {
        id: "diversify",
        text: (ctx) => `It looks like you've been focusing on ${ctx.mostPlayed}. To ensure well-rounded brain training, why not try a game of ${ctx.leastPlayed}?`,
    },
};
