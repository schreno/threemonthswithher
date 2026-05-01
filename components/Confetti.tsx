'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

// 1. Ultra-light Sunflower Palette: Pales, Creams, and Softest Yellows
const ultraLightSunflowerColors = [
  '#FFFBEB', // Bleached Yellow (Amber 50)
  '#FEFCE8', // Soft Cream (Yellow 50)
  '#FEF9C3', // Pale Lemon (Yellow 100)
  '#FEF3C7', // Chiffon (Amber 100)
  '#FDE68A', // Light Butter (Amber 200)
  '#EAB3081A', // A very faint, translucent gold for depth
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
    const duration = 3500; 
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  if (!trigger) return null;

  // 180 particles for a very strong, dense burst
  const particleCount = 180;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => {
        const delay = Math.random() * 0.6;
        const duration = 2.5 + Math.random() * 2;
        const xSpawn = Math.random() * 100;
        const ySpawn = -10 - Math.random() * 20;
        const initialRotation = Math.random() * 360;
        const color = ultraLightSunflowerColors[Math.floor(Math.random() * ultraLightSunflowerColors.length)];
        const isCircle = Math.random() > 0.3; // More circles for a "petal" aesthetic
        const size = 5 + Math.random() * 7;

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
              // Subtle glow instead of a dark shadow for the "light" theme
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)', 
              opacity: 0.9,
            }}
            initial={{
              opacity: 0,
              y: 0,
              rotate: initialRotation,
              scale: 0,
            }}
            animate={{
              opacity: [0, 0.9, 0.9, 0],
              y: windowHeight + 200, 
              rotate: initialRotation + (Math.random() - 0.5) * 2000, 
              scale: [0, 1.3, 1, 0.5], 
              x: (Math.random() - 0.5) * 450, // Even wider drift for a "stronger" storm effect
            }}
            transition={{
              duration,
              delay,
              ease: [0.1, 0.5, 0.3, 1], // Floatier, more natural fall
            }}
          />
        );
      })}
    </div>
  );
}
