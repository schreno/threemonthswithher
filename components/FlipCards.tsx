'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import FinalLetter from './FinalLetter';

interface FlipCardsProps {
  onRestart?: () => void;
}

interface Card {
  id: number;
  image: string;
  message: string;
  gradient: string;
  delay: number;
}

const messagePool = [
  "i love you so much, Cara.. MY BABYYYYYYY 🥹🥹💛",
  "you honestly make everything feel so much easier, yk just being around you makes my day 100x better ✨",
  "i love ALLLLLL the little things about you baby, your laugh, your voice, your random reactions, basically LITERALLY everything. You're my favorite person in the wholeeeee wideee worlddd 🤤🌻",
  "3 months already? Best 3 months of my life, hands down!!!!!!11! 💫💫💫💫💫💫💫💫",
  "thanks for being my person, baby. i trulyyyy appreciate you more than i probably say 😚😚🥹",
  "everyday with you is a w baby, can't wait for more memories💛💛",
  "you are literally my sunshine. thanks for always shining my wholeeee world baby 🥹🥹💛",
  "yeah i still can't believe i AM the one who gets to be with you. happy 3rd month, loveyyyy 🥂🥹",
  "just a reminder: you're beautiful and i am CRAZILYYYYY INSANELYYYY obsessed with you 🤤💖",
  "i don't take a single second with you for granted. you are my everything to me bebiii 💛💜",
  "my favorite duo partner for life. whether it's the random talks, laughs, chikas, gaming, chilling, watching, getting bored w you, the g-times🤤, the sad and happy times, it's always better with you 😽🌻"
  "HASHSAHASDHAH NO BUT SRSLY HOW ARE U SO CUTE?? i literally stare at your pics for hours bebiii i'm so whipped for u 😭🫠💖",
  "every time i hear your voice i just..AAAAAAAAAAA it makes me so kilig parin kahit 3 months na tayo. i love u so muchieeee 😚💛",
  "manifesting more years and years and yearssss with u. ikaw lang talaga sapat na sapat na baby 🥹🫶✨",
  "staying up late just to talk to u is literally the highlight of my whole day. i'd choose u every single time bebiii 🧸💛",
  "happy 3 months to us my loveyyy!! stay as makulit and as beautiful as u are. i'm always here for u no matter what happens 🫡💖✨"
  "HAKDHAHSADHH PLS UR SO PRETTY FOR WHAT??? i actually can't handle it anymore bebiii my heart is literally gonna burst 😭💖",
  "good luck nalang talaga sakin kasi i'm never getting over you. never ever ever everrr everrrr!! u r mine forever perioddddd 😤💛✨",
  "i love our random chikas and everything in between.. thank u for being my safe space baby. i love u so muchie so muchieeee 🥹😚",
  "BARELY 3 MONTHS AND I'M ALREADY THIS WHIPPED?? yeah it's over for me. u win baby, u always do AHAHHAHSHA 😭🤤🌻",
  "idk how u do it but u literally make my worst days feel like nothing at all. thank u for being my sunshine always bebiii 🥹✨",
  "i'm so lucky i get to call u mine.. like srsly?? out of everyone, i got the best girl in the worlddddd?? thank u lord talaga 😭🙌💖",
  "BABY AHSHHAHAHHAHA YEAH IVE SAID THISSS FORRR ALOT OF TIEMS NA PEROO NO BUT SRSLY UR VOICE IS MY FAVORITE SOUND EVERRRRR. i could listen to u talk all day and i'd still want more bebiii 🧸💛",
  "just checking in to say i love u and i'm thinking about u (as always lol). u r literally rent-free in my head baby 😚🤤",
  "happy 3 months my loveyyy!! thank u for sticking with me through my kakulitan. i'll make u the happiest girl ever, promise 🫡🥹🌻",
  "AAAAAAAAAAAAA I LOVE U I LOVE U I LOVE U I LOVE UUUUU!!!!1111111!! just in case u forgot hshshs 😚💖✨",
  "every time u message me i still get those butterflies parin.. 3 months in and it still feels like the first day. i'm so in love w u baby 😭🫠💛",
  "u r literally my everything. my bestfriend, my duo, my baby, my loveyyy.. everything. thank u for existing bebiii 🥹🫶✨",
  "HAKDHASHADHA no but srsly ur so makulit but that's why i love u. never change baby, i love every single bit of u 😽💖",
  "3 months down, infinite more to go!! i'm ready for everything basta ikaw kasama ko. i love u more than anything else in this world baby 🥂🥹💛"
];

export default function FlipCards({ onRestart }: FlipCardsProps) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [showFinalLetter, setShowFinalLetter] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Randomize the messages only once when the component mounts
  const randomizedCards = useMemo(() => {
    const images = ['/assets/sf1.jpg', '/assets/sf2.jpg', '/assets/sf3.jpg'];
    const gradients = [
      'from-yellow-100 to-amber-200',
      'from-orange-100 to-yellow-200',
      'from-yellow-200 to-amber-300',
    ];

    // Shuffle and pick 3 unique messages
    const shuffledMessages = [...messagePool].sort(() => 0.5 - Math.random());

    return [0, 1, 2].map((i) => ({
      id: i + 1,
      image: images[i],
      message: shuffledMessages[i],
      gradient: gradients[i],
      delay: i * 0.2,
    }));
  }, []);

  const handleCardClick = (cardId: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (flippedCards.size === 3) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [flippedCards.size]);

  const progress = (flippedCards.size / 3) * 100;

  const handleOpenFinalLetter = () => {
    setShowModal(false);
    setShowFinalLetter(true);
  };

  const handleStayHere = () => {
    setShowModal(false);
  };

  if (!isClient) return <div className="min-h-screen bg-[#FFFDF0]" />;
  if (showFinalLetter) return <FinalLetter onRestart={onRestart} />;

  return (
    <div className="page-container font-display relative min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-2 sm:py-4">
      {/* Decorative floating elements */}
      <svg className="absolute top-8 left-4 w-6 h-6 animate-float-slow" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.39 4.84L19 8.1l-3.5 3.41.82 5.04L12 15.77 7.68 16.55l.82-5.04L5 8.1l4.61-1.26L12 2z" fill="#FFD700" />
      </svg>
      <svg className="absolute right-8 top-10 w-8 h-8 opacity-80 animate-float" viewBox="0 0 24 24" fill="none">
        <path d="M20 17.58A4.42 4.42 0 0115.58 22H7.42A4.42 4.42 0 013 17.58 4.5 4.5 0 017.5 13H8a5 5 0 019.9-1.2A3.5 3.5 0 0120 17.58z" fill="#FFF7A1" />
      </svg>

      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-center gap-2 mb-4 animate-slideDown">
          <div className="text-center">
            <h2 className="text-[#8B7300] text-base sm:text-xl font-bold leading-tight">
              A Gallery of Sunshine 🌻
            </h2>
            <div className="text-xs text-[#A68A00] mt-0.5">
              Click each card to reveal a special thought
            </div>
          </div>
        </div>

        <div className="bg-[#FFFDF0] rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 border border-yellow-200 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {randomizedCards.map((card) => {
              const isFlipped = flippedCards.has(card.id);
              return (
                <div
                  key={card.id}
                  className="relative h-44 sm:h-48 md:h-52 cursor-pointer perspective-1000 group animate-slideUp"
                  style={{ animationDelay: `${card.delay}s` }}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-700 preserve-3d"
                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                  >
                    {/* Front */}
                    <div className="absolute w-full h-full rounded-lg border-2 border-white shadow-lg backface-hidden overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
                      <div className="relative w-full h-full">
                        <Image src={card.image} alt="Memory" fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" priority={card.id === 1} />
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-20`} />
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="px-2 py-1 bg-white/95 rounded-full text-xs font-medium text-[#8B7300] border border-yellow-100 shadow-lg backdrop-blur-sm animate-pulse">✨ Tap!</div>
                        </div>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full bg-white rounded-lg border-2 border-yellow-300 shadow-lg rotate-y-180 backface-hidden p-3 sm:p-4 flex flex-col justify-center">
                      <div className="text-center space-y-2 h-full flex flex-col justify-center">
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-xs sm:text-sm leading-relaxed text-[#2C2500] px-1 overflow-y-auto max-h-full handwriting">
                            {card.message}
                          </div>
                        </div>
                        <div className="pt-1">
                          <div className="px-2 py-1 bg-yellow-50 rounded-full text-xs font-medium text-[#8B7300] border border-yellow-200 inline-block">Flip back</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center py-2 sm:py-3">
            <div className="text-xs sm:text-sm text-[#A68A00] font-medium">Collecting memories... ✨</div>
            <div className="mt-2 w-full max-w-xs mx-auto bg-yellow-50 rounded-full h-1.5 overflow-hidden border border-yellow-100">
              <div
                className="h-full bg-gradient-to-r from-[#FBC02D] to-[#FFD700] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FFFDF0] rounded-2xl p-5 sm:p-6 max-w-sm w-full mx-4 shadow-2xl animate-popUp border-2 border-yellow-400 text-center space-y-4">
            <div className="text-4xl animate-bounce">☀️</div>
            <h3 className="text-lg font-bold text-[#8B7300]">All Thoughts Revealed!</h3>
            <p className="text-sm text-[#A68A00] leading-relaxed">
              Thank you for being the brightest part of my world. Ready for the last bit? 🌻
            </p>
            <div className="space-y-2.5 pt-1">
              <button onClick={handleOpenFinalLetter} className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#FFD700] text-[#54470C] font-bold shadow-lg transition-all hover:scale-105 active:scale-95 text-sm cursor-pointer">
                Open the Final Letter 💌
              </button>
              <button onClick={handleStayHere} className="w-full text-xs text-[#A68A00] hover:text-[#8B7300] cursor-pointer">
                Stay in this moment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
