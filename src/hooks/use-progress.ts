
"use client";

import { useState, useEffect, useCallback } from "react";

export type Progress = {
  memory: number;
  logic: number;
  reading: number;
  speedReading: number;
  riddle: number;
  wordLadder: number;
};

export type ProgressGame = keyof Progress;

const initialProgress: Progress = { memory: 0, logic: 0, reading: 0, speedReading: 0, riddle: 0, wordLadder: 0 };
const GUEST_PROGRESS_KEY = "braintraininghub-guest-progress";

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // This check ensures localStorage is only accessed on the client-side.
    if (typeof window === "undefined") {
      return;
    }
    
    try {
      const storedProgress = localStorage.getItem(GUEST_PROGRESS_KEY);
      if (storedProgress) {
        const parsed = JSON.parse(storedProgress);
        setProgress(prev => ({ ...initialProgress, ...parsed }));
      } else {
        setProgress(initialProgress);
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage", error);
      setProgress(initialProgress);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const incrementProgress = useCallback((game: ProgressGame) => {
    setProgress((prev) => {
      const updatedProgress = { ...prev, [game]: (prev[game] || 0) + 1 };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(updatedProgress));
        }
      } catch (error) {
        console.error("Failed to save progress to localStorage", error);
      }
      return updatedProgress;
    });
  }, []);

  const resetProgress = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(initialProgress));
        setProgress(initialProgress);
      }
    } catch (error)
      {
      console.error("Failed to reset progress in localStorage", error);
    }
  }, []);

  return { progress, incrementProgress, resetProgress, isLoaded };
}
