'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { messageData } from '@/data/message';
import { showToast } from '@/lib/toast';
import Playlist from '@/components/Playlist';
import FlipCards from '@/components/FlipCards';
import TypewriterText from '@/components/TypewriterText';

interface MessageCardProps {
  isRevealed: boolean;
  onRestart?: () => void;
}

export default function MessageCard({
  isRevealed,
  onRestart,
}: MessageCardProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showFlipCards, setShowFlipCards] = useState(false);
  const [typewriterComplete, setTypewriterComplete] = useState({
    signature: false,
    love: false,
    stamped: false,
  });
  const [stampText, setStampText] = useState({ love: '', stamped: '' });

  const handleEnvelopeClick = () => {
    setIsEnvelopeOpen(true);
    setTimeout(() => {
      setShowLetter(true);
      setTimeout(() => {
        typeText('LOVE', 'love', () =>
          setTypewriterComplete((prev) => ({ ...prev, love: true }))
        );
        setTimeout(() => {
          typeText('STAMPED', 'stamped', () =>
            setTypewriterComplete((prev) => ({ ...prev, stamped: true }))
          );
        }, 800);
      }, 1000);
    }, 400);
  };

  const typeText = (
    fullText: string,
    key: 'love' | 'stamped',
    onComplete: () => void
  ) => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setStampText((prev) => ({
          ...prev,
          [key]: fullText.slice(0, currentIndex),
        }));
        currentIndex++;
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 100);
  };

  if (!isRevealed) return null;

  if (showFlipCards) {
    return <FlipCards onRestart={onRestart} />;
  }

  if (showPlaylist) {
    return <Playlist onContinue={() => setShowFlipCards(true)} />;
  }

  return (
    <div className="page-container font-display relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6">
      {/* Decorative floating elements */}
      <svg
        className="absolute top-10 left-10 w-8 h-8 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2l2.39 4.84L19 8.1l-3.5 3.41.82 5.04L12 15.77 7.68 16.55l.82-5.04L5 8.1l4.61-1.26L12 2z"
          fill="#FFD700" // Gold star
        />
      </svg>

      <svg
        className="absolute right-10 top-16 w-10 h-10 opacity-80 animate-float"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M20 17.58A4.42 4.42 0 0115.58 22H7.42A4.42 4.42 0 013 17.58 4.5 4.5 0 017.5 13H8a5 5 0 019.9-1.2A3.5 3.5 0 0120 17.58z"
          fill="#FFF7A1" // Soft yellow cloud
        />
      </svg>

      <svg
        className="absolute left-12 bottom-20 w-6 h-6 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 21s-6-4.35-8.5-6.5C1.85 12.73 3 9 6 8c2.28-.75 3.5 1 6 1s3.72-1.75 6-1c3 1 4.15 4.73 2.5 6.5C18 16.65 12 21 12 21z"
          fill="#FFB800" // Darker yellow heart
        />
      </svg>

      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6 animate-slideDown">
          <div className="text-center">
            <h2 className="text-[#8B7300] text-lg sm:text-xl font-bold leading-tight">
              A Love Letter 🌻
            </h2>
            <div className="text-xs text-[#A68A00] mt-1">
              From my heart to yours
            </div>
          </div>
        </div>

        {/* Envelope and Letter Container */}
        <div className="bg-[#FFFDF0] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-yellow-200 shadow-xl animate-fadeIn overflow-hidden">
          <AnimatePresence mode="wait">
            {!isEnvelopeOpen ? (
              <motion.div
                key="envelope-closed"
                className="flex flex-col items-center justify-center min-h-[400px] relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div
                  className="relative cursor-pointer transition-all duration-800 transform hover:scale-105 hover:-rotate-1"
                  onClick={handleEnvelopeClick}
                >
                  <div className="relative w-80 h-56 mx-auto">
                    {/* Envelope base */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDE7] to-[#FFF9C4] rounded-lg shadow-lg border-2 border-yellow-200"></div>

                    {/* Envelope flap (closed) */}
                    <div
                      className="absolute -top-1 left-0 right-0 h-28 bg-gradient-to-br from-[#FDD835] to-[#FBC02D]"
                      style={{
                        clipPath: 'polygon(0px 0px, 100% 0px, 50% 100%)',
                        borderRadius: '8px 8px 0px 0px',
                      }}
                    />

                    {/* Heart seal */}
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#FFC107] rounded-full flex items-center justify-center text-white text-xl shadow-md animate-pulse">
                      ☀️
                    </div>

                    <div className="absolute -top-2 -right-2 text-yellow-500 text-sm animate-bounce-slow">
                      ✨
                    </div>
                    <div
                      className="absolute -bottom-2 -left-2 text-yellow-400 text-xs animate-bounce-slow"
                      style={{ animationDelay: '0.5s' }}
                    >
                      ⭐
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-sm text-[#8B7300] mb-2">
                      Click to open the envelope
                    </p>
                    <div className="inline-block px-4 py-2 bg-yellow-50 rounded-full text-xs font-medium text-[#8B7300] border border-yellow-200 animate-pulse">
                      Special Delivery 🌻
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="envelope-opened"
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {!showLetter && (
                  <motion.div
                    className="relative w-80 h-56 mx-auto mb-6"
                    style={{ perspective: '1000px' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDE7] to-[#FFF9C4] rounded-lg shadow-lg border-2 border-yellow-200"></div>

                    <motion.div
                      className="absolute -top-1 left-0 right-0 h-28 bg-gradient-to-br from-[#FDD835] to-[#FBC02D]"
                      style={{
                        clipPath: 'polygon(0px 0px, 100% 0px, 50% 0px)',
                        borderRadius: '8px 8px 0px 0px',
                        transformOrigin: 'top center',
                        transformStyle: 'preserve-3d',
                      }}
                      initial={{ rotateX: 0, y: 0 }}
                      animate={{ rotateX: -160, y: -20 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                  </motion.div>
                )}

                <AnimatePresence>
                  {showLetter && (
                    <motion.div
                      className="relative w-full"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    >
                      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-inner border border-yellow-100 relative">
                        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-yellow-50 to-transparent rounded-xl"></div>

                        {/* Letter content */}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-yellow-100 relative">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#FFC107] flex items-center justify-center text-white text-sm">
                                🌻
                              </div>
                              <span className="text-sm font-semibold text-[#8B7300]">
                                My Sweetest Love
                              </span>
                            </div>
                          </div>

                          <div className="handwriting text-sm sm:text-base leading-relaxed text-[#2C2500] pb-20 pt-6">
                            <div className="mb-4 text-[#8B7300] font-medium">
                              My dearest Cara,
                            </div>
                          <div className="handwriting text-sm sm:text-base leading-relaxed text-[#2C2500] pb-20 pt-6">
                          <div className="mb-4 text-[#8B7300] font-medium">
                            My dearest Cara,
                          </div>
                          <div
                            className="mb-6 text-justify"
                            style={{ textIndent: '2rem' }}
                          >
                            HAPPY 3RD MONTHSARYYY, MY LOVEEEEEEE.
                            <br /><br />
                            Ive been sitting here trying to find the perfect words to capture everything that im feeling, pero ang totoo is that, no matter how long i make this letter, it will never be enough to describe how much you trulyyy mean to me. Para sa &apos;kin, in just three short months, you&apos;ve alwayss managed to become the best part of my every day, my safest harbor and space, and the person that i genuinely and with all my heart want to share my every single forever with.
                            <br /><br />
                            First baby, i want to start by saying thank you. Thank you for staying with me, especially during those times when things got hard and the world felt a little too heavy for me to carry on my own. You may havent noticed pero may mga moments when i&apos;m completely lost, drifting in my own thoughts, but the thing is baby, your love is like a lighthouse that always brings me back home kasi for some reason, you have this beautiful, effortless way of lightening the mood just by being yourself baby kasi honestly, one laugh just from you, one sweet word of reassurance, and suddenly the darkness doesn&apos;t seem so scary anymore.
                            <br /><br />
                            Cara, i am so so so so sooooo soooooooo INCREDIBLYY THANKFULL for the effort you give us and i see it in the way you make sure im okay, in the way you never let me doubt where i stand with you, andd in the way you constantly reassure my heart at ang nakikita ko is that you don&apos;t just say you love me baby; you show it in the way you choose me every single day, that you chose to stay with me, chose to love me and chose to create these very memories with me.
                            <br /><br />
                            Kahit sa mga maliliit na bagay na ginagawa natin together means the WHOLEEE universe to me. I cherish every hour we spend together in our own worlds whether we build something together in minecraft and admire our base afterwards, playing different roblox games, the fun times whenever we play chaos, the adrenaline and the feeling of accomplishment whenever we win together in flee the facility, and other games that we have played all throughout, para sa &apos;kin kasi baby, those aren&apos;t just games to me. They are memories. They are the moments where i feel most connected to you, laughing and just being yk, us and it doesn&apos;t matter what were doing or what game we&apos;re playing and as long as your name is on my screen and your voice is in my ear, i am EXACTLY where im supposed to be.
                            <br /><br />
                            So cara, here is my promise to you, written from the deepest part of my heart: i promise that we will keep being together forever and ever, and always and alam ko sa sobrang daming beses ko &apos;tong sinasabi but i&apos;ll still say it anyways is that i am not just here for the fun times or the easy days. I am HERE for the struggles, the growth, and the quiet moments and everything in between. I also promise din na to hold your hand through every storm and to be the person who lightens your mood just like you do for me. Please baby, laging lagi mong tatandaan that i promise that im yours, completely and indefinitely forever.
                            <br /><br />
                            I hope and pray with everything i am that this love lasts a damn lifetime and one of my goals is that i want to look back fifty years from now and tell you that my heart still beats the same way it did on our 3rd monthsary. Cara, always know that you are my greatest blessing, my favorite person, my love, my wife, my safe haven, my home, my treasure, and my entire universe.
                            <br /><br />
                            Thank you for loving me. Thank you for being my peace and i love you more than all the stars in the sky and every block we&apos;ve ever placed together baby.
                          </div>
                        </div>
                            <div className="mt-8 ml-auto w-fit">
                              <div className="font-medium text-[#8B7300]">
                                <TypewriterText
                                  text="Always and forever, Your Carl 💜💛"
                                  duration={2}
                                  delay={0}
                                  onComplete={() =>
                                    setTypewriterComplete((prev) => ({
                                      ...prev,
                                      signature: true,
                                    }))
                                  }
                                  showCursor={false}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Yellow Heart stamp SVG */}
                        <div className="absolute bottom-4 left-4 transform -rotate-12 animate-float-slow opacity-40">
                          <svg
                            width="120"
                            height="120"
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-24 h-24"
                          >
                            <g fill="#FFC107" opacity="0.9">
                                {/* Circles for the dotted border - simplified */}
                                <circle cx="100" cy="12" r="3" />
                                <circle cx="188" cy="100" r="3" />
                                <circle cx="100" cy="188" r="3" />
                                <circle cx="12" cy="100" r="3" />
                            </g>
                            <circle cx="100" cy="100" r="72" stroke="#FFC107" strokeWidth="5" fill="none" opacity="0.9" />
                            <path
                              d="M100 82 C100 68 82 68 82 82 C82 96 100 108 100 108 C100 108 118 96 118 82 C118 68 100 68 100 82 Z"
                              fill="#FFC107"
                              stroke="#A68A00"
                              strokeWidth="1"
                            />
                            <path id="topArc" d="M50 90 A45 45 0 0 1 150 95" fill="none" />
                            <text fontSize="14" textAnchor="middle" fill="#8B7300" style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.2em', fontWeight: 600 }}>
                              <textPath href="#topArc" startOffset="50%">{stampText.love || ''}</textPath>
                            </text>
                            <path id="bottomArc" d="M155 110 A55 50 0 0 1 45 110" fill="none" />
                            <text fontSize="12" textAnchor="middle" fill="#A68A00" style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.15em', fontWeight: 500 }}>
                              <textPath href="#bottomArc" startOffset="50%">{stampText.stamped || ''}</textPath>
                            </text>
                          </svg>
                        </div>
                      </div>

                      {/* Continue button */}
                      {typewriterComplete.signature &&
                        typewriterComplete.love &&
                        typewriterComplete.stamped && (
                          <div className="flex justify-center mt-6 animate-slideUp">
                          <motion.button
                            onClick={() => setShowPlaylist(true)} 
                            className="mt-4 inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#FFD700] text-[#54470C] font-bold shadow-md transition-all transform hover:scale-105 active:scale-95 hover:shadow-yellow-400/50 focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                                Keep going, baby.. 🌻
                            </motion.button>
                          </div>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
