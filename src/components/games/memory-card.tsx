"use client";

import { cn } from "@/lib/utils";
import type { LucideProps } from "lucide-react";

type MemoryCardProps = {
  icon: React.ElementType<LucideProps>;
  isFlipped: boolean;
  onClick: () => void;
};

export function MemoryCard({ icon: Icon, isFlipped, onClick }: MemoryCardProps) {
  return (
    <div
      className="w-16 h-16 sm:w-20 sm:h-20 [perspective:1000px] cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={cn(
          "relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500",
          isFlipped && "[transform:rotateY(180deg)]"
        )}
      >
        <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center bg-green-400/80 rounded-lg shadow-md border border-green-400/90 group-hover:bg-green-400/70 transition-colors">
          {/* Card Back */}
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center bg-card rounded-lg shadow-md">
          <Icon className="w-10 h-10 text-primary" />
        </div>
      </div>
    </div>
  );
}
