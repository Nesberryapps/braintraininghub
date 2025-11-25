
"use client";

import { Button } from "@/components/ui/button";

export function Hero() {

  const scrollToGames = () => {
    const gamesSection = document.getElementById('games');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="text-center py-16 sm:py-24">
      <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary mb-4">
        Nurture Your Mind
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        Relaxing yet challenging mini-games designed to enhance your memory, focus, and problem-solving skills.
      </p>
      <Button size="lg" onClick={scrollToGames}>
        Explore the Games
      </Button>
    </div>
  );
}
