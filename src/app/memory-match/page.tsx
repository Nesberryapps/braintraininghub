
"use client";

import AdBanner from "@/components/ads/ad-banner";
import { GameArticles } from "@/components/game-articles";
import { MemoryMatchGame } from "@/components/games/memory-match-game";

export default function MemoryMatchPage() {

  return (
    <div className="flex flex-col items-center pb-8">
      <div className="flex-grow flex flex-col items-center justify-center p-4 w-full">
        <MemoryMatchGame />
        <GameArticles game="memory" />
      </div>
      <AdBanner dataAdSlot="9200324245" className="mt-4 mb-4 w-full max-w-3xl" />
    </div>
  );
}
