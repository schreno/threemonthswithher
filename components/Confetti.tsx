'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

// 1. Lightened Sunflower Palette
const lightSunflowerColors = [
  '#FEF3C7', // Warm Cream (Amber 100)
  '#FDE68A', // Soft Yellow (Amber 200)
  '#FCD34D', // Bright Sunflower (Amber 300)
  '#FBBF24', // Golden (Amber 400)
  '#FEFCE8', // Pale Chiffon (Yellow 50)
  '#A16207', // Light Toasted Brown (Yellow 800 - for center contrast)
];

export default function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [windowHeight, setWindowHeight] = useState(1000);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
      const handleResize = () => setWindowHeight(window.innerHeight);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (!trigger) return;

    const duration = 3000; 
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  if (!trigger) return null;

  // High density for a "strong" shower
  const particleCount = 150;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => {
        const delay = Math.random() * 0.4;
        const duration = 2 + Math.random() * 1.5;
        const xSpawn = Math.random() * 100;
        const ySpawn = -10 - Math.random() * 20;
        const initialRotation = Math.random() * 360;
        const color = lightSunflowerColors[Math.floor(Math.random() * lightSunflowerColors.length)];
        const isCircle = Math.random() > 0.4; // Slightly more circles for a "petal" look
        const size = 6 + Math.random() * 6;

        return (
          <motion.div
            key={i}
            className={`absolute ${isCircle ? 'rounded-full' : 'rounded-sm'}`}
            style={{
              left: `${xSpawn}%`,
              top: `${ySpawn}%`,
              backgroundColor: color,
              width: `${size}px`,
              height: `${size}px`,
              boxShadow: '0px 1px 2px rgba(0,0,0,0.05)', 
            }}
            initial={{
              opacity: 1,
              y: 0,
              rotate: initialRotation,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: windowHeight + 150, 
              rotate: initialRotation + (Math.random() - 0.5) * 1440, // High-speed spin
              scale: [0, 1.2, 1, 0.6], 
              x: (Math.random() - 0.5) * 350, // Wide horizontal drift
            }}
            transition={{
              duration,
              delay,
              ease: [0.23, 1, 0.32, 1], 
            }}
          />
        );
      })}
    </div>
  );
}
