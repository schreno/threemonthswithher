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
        <title>Happy National Princess Day 👑</title>
        <meta
          name="description"
          content="A special surprise for National Princess Day - A delightful interactive experience with love letters, music, and memories"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="National Princess Day, love letter, surprise, romantic, interactive"
        />
        <meta name="author" content="Made with 💕" />

        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Happy National Princess Day 👑" />
        <meta
          property="og:description"
          content="A special surprise for National Princess Day - A delightful interactive experience with love letters, music, and memories"
        />
        <meta property="og:image" content="/og-image.jpg" />
        <meta
          property="og:url"
          content="https://national-princess-day.vercel.app"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Happy National Princess Day 👑" />
        <meta
          name="twitter:description"
          content="A special surprise for National Princess Day"
        />
        <meta name="twitter:image" content="/og-image.jpg" />

        <meta name="theme-color" content="#fff8e7" />
        <link rel="canonical" href="https://national-princess-day.vercel.app" />
      </Head>

      <main className="min-h-screen">
        {!isGiftOpened && (
          <Hero onOpenGift={handleOpenGift} isGiftOpened={isGiftOpened} />
        )}
        {isGiftOpened && (
          <MessageCard isRevealed={isGiftOpened} onRestart={handleRestart} />
        )}
        <Confetti trigger={showConfetti} onComplete={handleConfettiComplete} />

        {/* 1. FIXED BUTTON REMOVED FROM HERE */}

        <footer className="px-4 py-8 text-center text-text/60 relative z-50">
          <p className="text-sm">
            National Princess Day —{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-xs mt-2">Made with 💕</p>
          {/* 2. FOOTER BUTTON REMOVED FROM HERE */}
        </footer>
      </main>

      <Toaster position="bottom-center" toastOptions={toastOptions} />
    </>
  );
}
