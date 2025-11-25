// hooks/use-audio.ts
"use client";

import { useRef, useEffect, useCallback } from 'react';

// Web Audio API helper
export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext after a user gesture (e.g., component mount in client component)
    // This is good practice for browser compatibility.
    if (typeof window !== 'undefined' && !audioContextRef.current) {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser", e);
        }
    }
  }, []);

  const playSound = useCallback((type: 'correct' | 'incorrect' | 'win' | 'lose') => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    // Resume context if it's suspended (for autoplay policies)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const now = ctx.currentTime;

    if (type === 'correct') {
      const notes = [392, 523, 659]; // G4, C5, E5
      notes.forEach((note, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note, now + i * 0.1);
        gainNode.gain.setValueAtTime(0.2, now + i * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.08);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start(now + i * 0.1);
        oscillator.stop(now + i * 0.1 + 0.1);
      });
    } else if (type === 'incorrect') {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(110, now); // A2
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
    } else if (type === 'win') {
        const notes = [392, 523, 659, 784]; // G4, C5, E5, G5
        notes.forEach((note, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(note, now + i * 0.1);
            gainNode.gain.setValueAtTime(0.3, now + i * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.08);
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.start(now + i * 0.1);
            oscillator.stop(now + i * 0.1 + 0.1);
        });
    } else if (type === 'lose') {
        const notes = [330, 261, 196]; // E4, C4, G3
        notes.forEach((note, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(note, now + i * 0.15);
            gainNode.gain.setValueAtTime(0.3, now + i * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.1);
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.start(now + i * 0.15);
            oscillator.stop(now + i * 0.15 + 0.15);
        });
    }
  }, []);

  return playSound;
};
