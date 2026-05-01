'use client';

import { useState } from 'react';
import Head from 'next/head';
import Hero from '@/components/Hero';
import MessageCard from '@/components/MessageCard';
import Confetti from '@/components/Confetti';
import { Toaster } from '@/lib/toast';

export default function Home() {
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleOpenGift = () => {
    setIsGiftOpened(true);
    setShowConfetti(true);
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  const handleRestart = () => {
    setIsGiftOpened(false);
    setShowConfetti(false);
  };

  const toastOptions = {
    duration: 3000,
    style: {
      background: 'var(--primary)',
      color: 'var(--text)',
      borderRadius: '12px',
      padding: '12px 20px',
      fontSize: '14px',
    },
  };

  return (
    <>
      <Head>
        {/* Updated Title for the 3-Month Anniversary */}
        <title>Happy 3 Monthsary! ❤️</title>
        <meta
          name="description"
          content="Celebrating 3 wonderful months together. A special surprise filled with memories and love."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="anniversary, 3 months, love letter, surprise, romantic"
        />
        <meta name="author" content="Made with 💕" />

        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />

        {/* Social Media OpenGraph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Happy 3 Monthsary! ❤️" />
        <meta
          property="og:description"
          content="3 months down, a lifetime to go. Open your surprise here!"
        />
        <meta property="og:image" content="/og-image.jpg" />
        <meta
          property="og:url"
          content="https://our-anniversary.vercel.app"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Happy 3 Monthsary! ❤️" />
        <meta
          name="twitter:description"
          content="A special surprise for our 3-month anniversary"
        />

        <meta name="theme-color" content="#fff8e7" />
      </Head>

      <main className="min-h-screen">
        {!isGiftOpened && (
          <Hero onOpenGift={handleOpenGift} isGiftOpened={isGiftOpened} />
        )}
        
        {isGiftOpened && (
          <MessageCard isRevealed={isGiftOpened} onRestart={handleRestart} />
        )}
        
        <Confetti trigger={showConfetti} onComplete={handleConfettiComplete} />

        <footer className="px-4 py-8 text-center text-text/60 relative z-50">
          <p className="text-sm font-medium">
            Celebrating 3 Months Together ✨
          </p>
          <p className="text-xs mt-1">
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-xs mt-3 opacity-70">Made with 💕</p>
        </footer>
      </main>

      <Toaster position="bottom-center" toastOptions={toastOptions} />
    </>
  );
}
