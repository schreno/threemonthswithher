'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SealedLetterProps {
  onExperienceAgain?: () => void;
  onSendKiss?: () => void;
}

interface KissParticle {
  id: number;
  x: number;
  driftX: number;
  rotation: number;
}

export default function SealedLetter({
  onExperienceAgain,
  onSendKiss,
}: SealedLetterProps) {
  const [kissParticles, setKissParticles] = useState<KissParticle[]>([]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSendKiss = () => {
    const particles: KissParticle[] = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 30,
        driftX: (Math.random() - 0.5) * 50,
        rotation: Math.random() * 360,
      });
    }
    setKissParticles(particles);

    if (onSendKiss) {
      onSendKiss();
    }

    setTimeout(() => {
      setKissParticles([]);
    }, 1600);
  };

  return (
    <div className="page-container">
      <div className="font-display min-h-screen flex items-center justify-center py-10 px-4 bg-[#FFFDF0] relative overflow-hidden">
        {/* Decorative background elements - Golden palette */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 grid-paper opacity-30"></div>

          <svg
            className="absolute left-8 top-14 text-[#FFD700] opacity-70 w-5 h-5 animate-float-slow"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l2.39 4.84L19 8.1l-3.5 3.41.82 5.04L12 15.77 7.68 16.55l.82-5.04L5 8.1l4.61-1.26L12 2z" />
          </svg>

          <svg
            className="absolute right-8 top-28 text-[#FBC02D] opacity-60 w-6 h-6 animate-float-rev"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>

          <svg
            className="absolute left-6 bottom-28 text-[#FFC107] opacity-40 w-6 h-6 animate-pulse-tiny"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-yellow-100 text-center relative"
          >
            {/* Sun Icon Header */}
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-[#FFF9C4] to-[#FFD700] flex items-center justify-center shadow-inner">
              <div className="text-4xl">☀️</div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#8B7300] mb-2">
              Letter Sealed with Sunshine
            </h2>
            <p className="text-sm sm:text-base text-[#A68A00] mb-5 font-medium">
              I Love You Always, Cara
            </p>

            {/* Animated Sunbeams/Hearts */}
            <div className="flex justify-center gap-2 mb-5">
              {[0, 140, 280, 420, 560, 700].map((delay, index) => (
                <span 
                  key={index}
                  className="text-yellow-400 animate-pulse" 
                  style={{ animationDelay: `${delay}ms` }}
                >
                  ✨
                </span>
              ))}
            </div>

            <div className="text-lg sm:text-xl font-bold text-[#2C2500] mb-1">
              <span className="text-[#8B7300]">Forever Yours 🌻</span>
            </div>

            <div className="text-xs text-[#A68A00] mb-8 uppercase tracking-widest font-bold">
              {currentDate}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative">
              <AnimatePresence>
                {kissParticles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="kiss-particle"
                    style={{
                      left: `${particle.x}%`,
                      // @ts-ignore
                      '--driftX': `${particle.driftX}px`,
                      // @ts-ignore
                      '--rot': `${particle.rotation}deg`,
                    }}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -100 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="text-2xl">💛</span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {onExperienceAgain && (
                <button
                  onClick={onExperienceAgain}
                  className="rounded-full bg-gradient-to-r from-[#FBC02D] to-[#FFD700] text-[#54470C] px-6 py-3 text-sm sm:text-base font-bold shadow-lg hover:scale-105 transition active:scale-95 cursor-pointer"
                >
                  Experience Again ✨
                </button>
              )}
              
              <button
                onClick={handleSendKiss}
                className="rounded-full bg-[#FFF9C4] text-[#8B7300] px-6 py-3 text-sm sm:text-base font-bold shadow-md hover:bg-[#FFF59D] transition border border-yellow-200 cursor-pointer active:scale-95"
              >
                Send a Virtual Kiss 💛
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
