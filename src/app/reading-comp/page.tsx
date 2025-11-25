
"use client";

import AdBanner from "@/components/ads/ad-banner";
import { GameArticles } from "@/components/game-articles";
import { ReadingCompGame } from "@/components/games/reading-comp-game";

export default function ReadingCompPage() {
  return (
    <div className="flex flex-col items-center pb-8">
      <div className="flex-grow flex flex-col items-center justify-center p-4 w-full">
        <ReadingCompGame />
        <GameArticles game="reading" />
      </div>
      <AdBanner dataAdSlot="9200324245" className="mt-4 mb-4 w-full max-w-2xl" />
    </div>
  );
}
