"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function DeployCelebration() {
  useEffect(() => {
    const end = Date.now() + 1200;
    const fire = () => {
      confetti({ particleCount: 90, spread: 100, origin: { y: 0.6 }, colors: ["#3B82F6", "#60A5FA", "#F5F5F7"] });
      if (Date.now() < end) requestAnimationFrame(fire);
    };
    fire();
  }, []);
  return null;
}
