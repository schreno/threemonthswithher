'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

// 1. Sunflower themed colors: yellows, golds, and contrasting brown/orange
const sunflowerColors = [
  '#FBBF24', // Amber 400
  '#F59E0B', // Amber 500
  '#FCD34D', // Amber 300
  '#FFFBEB', // Amber 50
  '#78350F', // Amber 900 (Brown for contrast)
  '#CA8A04', // Yellow 600
];

export default function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [windowHeight, setWindowHeight] = useState(1000); // Default to a bit larger

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
      
      // Update height on resize just in case
      const handleResize = () => setWindowHeight(window.innerHeight);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (!trigger) return;

    // Increased duration slightly so the "stronger" effect finishes falling
    const duration = 3000; 
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  if (!trigger) return null;

  // 2. Increased quantity significantly (from 50 to 150) for a "stronger" effect
  const particleCount = 150;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => {
        // Stronger physics settings
        const delay = Math.random() * 0.4; // tighter delay spread for more initial impact
        const duration = 2 + Math.random() * 1.5; // fall at varying speeds
        
        // Spawn across the whole width
        const xSpawn = Math.random() * 100;
        // Spawn slightly above viewport
        const ySpawn = -10 - Math.random() * 20;
        
        const initialRotation = Math.random() * 360;
        const color = sunflowerColors[Math.floor(Math.random() * sunflowerColors.length)];
        
        // 3. Add shape variety (some squares, some circles)
        const isCircle = Math.random() > 0.5;
        // 4. Slightly larger base size
        const size = 6 + Math.random() * 6; // between 6px and 12px

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
              // Add a subtle drop shadow for depth against light backgrounds
              boxShadow: '1px 1px 2px rgba(0,0,0,0.1)', 
            }}
            initial={{
              opacity: 1,
              y: 0,
              rotate: initialRotation,
              scale: 0, // start small
            }}
            animate={{
              opacity: [0, 1, 1, 0], // Fade in quick, stay, fade out at end
              // Fall past the bottom
              y: windowHeight + 150, 
              // 4. Stronger spin
              rotate: initialRotation + (Math.random() - 0.5) * 1800, // rapid spinning
              scale: [0, 1.1, 1, 0.7], // pop out, settle, shrink slightly
              // 4. Stronger horizontal drift (wind effect)
              x: (Math.random() - 0.5) * 400, 
            }}
            transition={{
              duration,
              delay,
              // easeOut allows them to burst and then settle into a constant fall rate
              ease: [0.22, 1, 0.36, 1], 
            }}
          />
        );
      })}
    </div>
  );
}
