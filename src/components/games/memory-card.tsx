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
      className="w-20 h-20 sm:w-24 sm:h-24 [perspective:1000px] cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={cn(
          "relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500",
          isFlipped && "[transform:rotateY(180deg)]"
        )}
      >
        <div className="absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center bg-green-200/20 rounded-lg shadow-md border border-green-200/30 group-hover:bg-green-200/30 transition-colors">
          {/* Card Back */}
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center bg-card rounded-lg shadow-md">
          <Icon className="w-12 h-12 text-primary" />
        </div>
      </div>
    </div>
  );
}
