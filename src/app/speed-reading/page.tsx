
"use client";

import AdBanner from "@/components/ads/ad-banner";
import { GameArticles } from "@/components/game-articles";
import { SpeedReadingGame } from "@/components/games/speed-reading-game";

export default function SpeedReadingPage() {
  return (
    <div className="flex flex-col items-center pb-8">
      <div className="flex-grow flex flex-col items-center justify-center p-4 w-full">
        <SpeedReadingGame />
        <GameArticles game="speedReading" />
      </div>
      <AdBanner dataAdSlot="9200324245" className="mt-4 mb-4 w-full max-w-2xl" />
    </div>
  );
}
