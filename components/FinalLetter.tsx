'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SealedLetter from './SealedLetter';

interface FinalLetterProps {
  onRestart?: () => void;
}

interface KissParticle {
  id: number;
  x: number;
  driftX: number;
  rotation: number;
}

export default function FinalLetter({ onRestart }: FinalLetterProps) {
  const [isSealed, setIsSealed] = useState(false);
  const [showSealedPage, setShowSealedPage] = useState(false);
  const [kissParticles, setKissParticles] = useState<KissParticle[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSeal = () => {
    if (isSealed) return;

    const particles: KissParticle[] = [];
    for (let i = 0; i < 12; i++) {
      particles.push({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 20,
        driftX: (Math.random() - 0.5) * 40,
        rotation: Math.random() * 360,
      });
    }
    setKissParticles(particles);

    setIsSealed(true);

    setTimeout(() => {
      setKissParticles([]);
      setShowSealedPage(true);
    }, 1600);
  };

  if (showSealedPage) {
    return <SealedLetter onExperienceAgain={onRestart} />;
  }

  return (
    <div className="page-container">
      {/* Background changed to a soft warm cream/yellow */}
      <div className="font-display min-h-screen flex items-center justify-center py-10 px-4 bg-[#FFFDF0] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 grid-paper opacity-20"></div>
          
          {/* Updated Floating Icons to Yellow/Gold Palette */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star absolute left-8 top-14 text-[#FFD700] opacity-70 w-5 h-5 animate-float-slow"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-sun absolute right-8 top-28 text-[#FBC02D] opacity-60 w-6 h-6 animate-float-rev"
          >
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-heart absolute left-6 bottom-28 text-[#FFC107] opacity-40 w-6 h-6 animate-pulse-tiny"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-yellow-100 relative"
          >
            {/* Subtle sunflower watermark or accent */}
            <div className="absolute top-4 right-4 text-2xl opacity-20">🌻</div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center text-[#54470C] shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#2C2500]">
                  Final Love Letter
                </h3>
              </div>
            </div>

            <article className="handwriting text-sm sm:text-base text-[#2C2500] leading-relaxed space-y-4">
              <p className="text-[#8B7300] font-semibold text-lg">
                My sweetest Cutiepie,
              </p>
              <p>
                You&apos;re the calm I reach for and the laugh that brightens my
                day. ☀️
              </p>
              <p className="text-[#A68A00] bg-yellow-50/50 p-2 rounded-lg">
                I hope this tiny world made you smile — and whispered how much
                you mean to me.
              </p>
              <p>
                I&apos;ll keep making memories, big and small, always with you.
              </p>
              <p className="text-[#8B7300] font-medium border-l-4 border-yellow-400 pl-4">
                Forever yours, in every little universe. 🌻
              </p>
            </article>

            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 items-center border-t border-yellow-50 pt-6">
              <div className="text-xs text-[#A68A00] font-medium">
                Sealing will finish our little journey.
              </div>
              
              <div className="flex gap-3 relative">
                <AnimatePresence>
                  {kissParticles.map((particle) => (
                    <motion.div
                      key={particle.id}
                      className="kiss-particle"
                      style={
                        {
                          left: `${particle.x}%`,
                          '--driftX': `${particle.driftX}px`,
                          '--rot': `${particle.rotation}deg`,
                        } as React.CSSProperties
                      }
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className="text-2xl">💛</span>
                      <div className="sparkle"></div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  ref={buttonRef}
                  onClick={handleSeal}
                  disabled={isSealed}
                  className="rounded-full bg-gradient-to-r from-[#FBC02D] to-[#FFD700] px-6 py-2.5 text-sm sm:text-base font-bold text-[#54470C] shadow-md hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSealed ? 'Sealed 🌻' : 'Seal with Love 💌'}
                </button>
                
                {onRestart && (
                  <button
                    onClick={onRestart}
                    className="rounded-full bg-[#FFF9C4] text-[#8B7300] px-4 py-2.5 text-sm sm:text-base font-medium shadow-sm hover:bg-[#FFF59D] transition cursor-pointer border border-yellow-100"
                  >
                    Restart
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
