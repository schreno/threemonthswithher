'use client';

import { useState, useRef, useEffect, memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { showToast } from '@/lib/toast';

interface PlaylistProps {
  onContinue?: () => void;
  onThemeChange?: (theme: TrackTheme) => void; // NEW
}


interface TrackTheme {
  bg: string;
  cardBg: string;
  border: string;
  accent: string;
  text: string;
  textMuted: string;
  progressFill: string;
  progressTrack: string;
  arrowText: string;
  decorative1: string;
  decorative2: string;
  decorative3: string;
  playerBg: string;
  ring: string;
}

interface Track {
  id: number;
  title: string;
  description: string;
  image: string;
  audio: string;
  color: string;
  theme: TrackTheme;
}

const defaultTheme: TrackTheme = {
  bg: '#FFFBEB',
  cardBg: '#FEFCE8',
  border: '#FEF08A',
  accent: '#EAB308',
  text: '#A16207',
  textMuted: '#854D0E',
  progressFill: '#EAB308',
  progressTrack: '#FEF9C3',
  arrowText: '#A16207',
  decorative1: '#FDE047',
  decorative2: '#FEF08A',
  decorative3: '#FACC15',
  playerBg: 'rgba(255,255,255,0.7)',
  ring: '#EAB308',
};

const tracks: Track[] = [
  {
    id: 1,
    title: "Mahika",
    description: "You told me this was your favorite andddd now it's ours 🥹. Your mahika, forever always baby 🌻🥰",
    image: "/assets/mahika.gif",
    audio: "/assets/mahika-song.mp3",
    color: "#C026D3",
    theme: {
      bg: '#FDF4FF',
      cardBg: '#FAE8FF',
      border: '#F0ABFC',
      accent: '#C026D3',
      text: '#701A75',
      textMuted: '#86198F',
      progressFill: '#C026D3',
      progressTrack: '#F5D0FE',
      arrowText: '#86198F',
      decorative1: '#E879F9',
      decorative2: '#F0ABFC',
      decorative3: '#D946EF',
      playerBg: 'rgba(250,232,255,0.85)',
      ring: '#C026D3',
    }
  },
  {
    id: 2,
    title: "Brand New Story",
    description: "Every time this music plays, I think of us and our movie. I will always be there when you sing it 🥹🌊✨",
    image: "/assets/rideyourwave.gif",
    audio: "/assets/rideyourwave-song.mp3",
    color: "#0EA5E9",
    theme: {
      bg: '#F0F9FF',
      cardBg: '#E0F2FE',
      border: '#7DD3FC',
      accent: '#0EA5E9',
      text: '#0C4A6E',
      textMuted: '#075985',
      progressFill: '#0EA5E9',
      progressTrack: '#BAE6FD',
      arrowText: '#075985',
      decorative1: '#38BDF8',
      decorative2: '#7DD3FC',
      decorative3: '#0284C7',
      playerBg: 'rgba(224,242,254,0.85)',
      ring: '#0EA5E9',
    }
  },
  {
    id: 3,
    title: "High School Sweethearts",
    description: "Honestly, distance is just a test to see how far love can travel baby. My high school sweetheart, no matter the miles ✈️🥰🌎",
    image: "/assets/hss.gif",
    audio: "/assets/hss-song.mp3",
    color: "#EC4899",
    theme: {
      bg: '#FDF2F8',
      cardBg: '#FCE7F3',
      border: '#F9A8D4',
      accent: '#EC4899',
      text: '#831843',
      textMuted: '#9D174D',
      progressFill: '#EC4899',
      progressTrack: '#FBCFE8',
      arrowText: '#9D174D',
      decorative1: '#F472B6',
      decorative2: '#F9A8D4',
      decorative3: '#DB2777',
      playerBg: 'rgba(252,231,243,0.85)',
      ring: '#EC4899',
    }
  },
  {
    id: 4,
    title: "Ang Pag-ibig ay Kanibalismo",
    description: "Magdodroga tayo... kimi lang, bawal 'yon. Ikaw lang sapat na, hehe 🤤😋",
    image: "/assets/pak.gif",
    audio: "/assets/pak-song.mp3",
    color: "#DC2626",
    theme: {
      bg: '#FEF2F2',
      cardBg: '#FEE2E2',
      border: '#FCA5A5',
      accent: '#DC2626',
      text: '#7F1D1D',
      textMuted: '#991B1B',
      progressFill: '#DC2626',
      progressTrack: '#FECACA',
      arrowText: '#991B1B',
      decorative1: '#F87171',
      decorative2: '#FCA5A5',
      decorative3: '#B91C1C',
      playerBg: 'rgba(254,226,226,0.85)',
      ring: '#DC2626',
    }
  },
  {
    id: 5,
    title: "Blue",
    description: "Remember talking about this while we were on roblox? Now every time I hear it, I just picture us by the waves 🌊💙💛",
    image: "/assets/blue.gif",
    audio: "/assets/blue-song.mp3",
    color: "#2563EB",
    theme: {
      bg: '#EFF6FF',
      cardBg: '#DBEAFE',
      border: '#93C5FD',
      accent: '#2563EB',
      text: '#1E3A8A',
      textMuted: '#1E40AF',
      progressFill: '#2563EB',
      progressTrack: '#BFDBFE',
      arrowText: '#1E40AF',
      decorative1: '#60A5FA',
      decorative2: '#93C5FD',
      decorative3: '#3B82F6',
      playerBg: 'rgba(219,234,254,0.85)',
      ring: '#2563EB',
    }
  },
  {
    id: 6,
    title: "Yellow",
    description: "Look how the stars shine for you, and everything is yellow. Just like the sunflowers 🌻✨",
    image: "/assets/yellow.gif",
    audio: "/assets/yellow-song.mp3",
    color: "#CA8A04",
    theme: {
      bg: '#FEFCE8',
      cardBg: '#FEF9C3',
      border: '#FDE047',
      accent: '#CA8A04',
      text: '#713F12',
      textMuted: '#854D0E',
      progressFill: '#CA8A04',
      progressTrack: '#FEF08A',
      arrowText: '#854D0E',
      decorative1: '#FACC15',
      decorative2: '#FDE047',
      decorative3: '#EAB308',
      playerBg: 'rgba(254,249,195,0.85)',
      ring: '#CA8A04',
    }
  },
  {
    id: 7,
    title: "Seasons",
    description: "I'll give you all my life, my seasons. By your side, I'll be your seasons ☀️💛",
    image: "/assets/wte.jpg",
    audio: "/assets/wte-song.mp3",
    color: "#EA580C",
    theme: {
      bg: '#FFF7ED',
      cardBg: '#FFEDD5',
      border: '#FDBA74',
      accent: '#EA580C',
      text: '#7C2D12',
      textMuted: '#9A3412',
      progressFill: '#EA580C',
      progressTrack: '#FED7AA',
      arrowText: '#9A3412',
      decorative1: '#FB923C',
      decorative2: '#FDBA74',
      decorative3: '#C2410C',
      playerBg: 'rgba(255,237,213,0.85)',
      ring: '#EA580C',
    }
  }, 
  {
    id: 8,
    title: "Risk It All",
    description: "I'd risk it all for you, always and forever 🤤💜💛",
    image: "/assets/riskitall.gif",
    audio: "/assets/riskitall-song.mp3",
    color: "#991B1B",
   theme: {
      bg: '#FEF2F2',
      cardBg: '#FEE2E2',
      border: '#F87171',
      accent: '#B91C1C',
      text: '#450A0A',
      textMuted: '#7F1D1D',
      progressFill: '#B91C1C',
      progressTrack: '#FECACA',
      arrowText: '#7F1D1D',
      decorative1: '#EF4444',
      decorative2: '#FCA5A5',
      decorative3: '#991B1B',
      playerBg: 'rgba(254,226,226,0.9)',
      ring: '#B91C1C',
    }
  }
];

const StableImage = memo(({ src, alt, isActive }: { src: string; alt: string; isActive: boolean }) => (
  <Image
    src={src}
    alt={alt}
    fill
    unoptimized
    className={`object-cover transition-all duration-700 ease-out ${
      isActive ? 'grayscale-0 saturate-100 brightness-100' : 'grayscale-[0.6] saturate-[0.3] brightness-[0.85]'
    }`}
    sizes="48px"
    onError={(e) => {
      e.currentTarget.style.display = 'none';
    }}
  />
));

StableImage.displayName = 'StableImage';

export default function Playlist({ onContinue }: PlaylistProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Random Text States
  const [headerIndex, setHeaderIndex] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});
  const progressRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStartLeft, setScrollStartLeft] = useState(0);
  const dragRef = useRef(false);

  // Content Variations
  const headerPairs = [
    { title: "My heart, in a Playlist", sub: "I guessssss press play and think of me? 🥰" },
    { title: "Just a little piece of me", sub: "Press play and let the music hug you for me 🥰" },
    { title: "Listen at your own risk!", sub: "Warning: May cause extreme kilig and thinking about me 🤭💛" },
    { title: "Closing the distance", sub: "Close your eyes, press play, and pretend I’m right there ✈️🌌" },
    { title: "Songs for my Sunflower", sub: "To keep you company while I’m not around 🌻☀️" }
  ];

  const placeholders = [
    "Press play on a memory...",
    "Pili ka na ng kanta babyyy 🎶",
    "Pipili ka o pipili ka 😤",
    "Every song here has a piece of my heart. Which one first? 🥰",
    "I spent hours picking these, so don't just stare at them! 😋",
    "Our movie needs a background song. Pili ka na, baby. 🌊",
    "Choose or i'll fuck you 🤤",
    "Waiting for my sunflower to choose a melody.. 🌻✨",
    "Can't decide? Just pick one, they're all about you anyway 🥰🌎"
  ];

  // Pick random content on initial load
  useEffect(() => {
    setHeaderIndex(Math.floor(Math.random() * headerPairs.length));
    setPlaceholderIndex(Math.floor(Math.random() * placeholders.length));
  }, []);

  const activeTheme = useMemo(() => {
    if (!currentTrack) return defaultTheme;
    const track = tracks.find(t => t.id === currentTrack);
    return track?.theme || defaultTheme;
  }, [currentTrack]);

  
  useEffect(() => {
    const t = activeTheme;
    
    const root = document.documentElement;
    root.style.setProperty('--pl-bg', t.bg);
    root.style.setProperty('--pl-cardBg', t.cardBg);
    root.style.setProperty('--pl-border', t.border);
    root.style.setProperty('--pl-accent', t.accent);
    root.style.setProperty('--pl-text', t.text);
    root.style.setProperty('--pl-textMuted', t.textMuted);
    root.style.setProperty('--pl-progressFill', t.progressFill);
    root.style.setProperty('--pl-progressTrack', t.progressTrack);
    root.style.setProperty('--pl-arrowText', t.arrowText);
    root.style.setProperty('--pl-decorative1', t.decorative1);
    root.style.setProperty('--pl-decorative2', t.decorative2);
    root.style.setProperty('--pl-decorative3', t.decorative3);
    root.style.setProperty('--pl-playerBg', t.playerBg);
    root.style.setProperty('--pl-ring', t.ring);
  }, [activeTheme]);

  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [checkScrollButtons]);

  useEffect(() => {
    if (currentTrack) {
      const audio = audioRefs.current[currentTrack];
      if (audio) {
        const updateTime = () => {
          setCurrentTime(audio.currentTime);
          updateProgressStyle(audio.currentTime, audio.duration);
        };
        const updateDuration = () => {
          if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
            setDuration(audio.duration);
          }
        };
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleLoadedMetadata = () => {
          if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
            setDuration(audio.duration);
            updateProgressStyle(audio.currentTime, audio.duration);
          }
        };

        if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
          setDuration(audio.duration);
        }

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('durationchange', updateDuration);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
          audio.removeEventListener('timeupdate', updateTime);
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('durationchange', updateDuration);
          audio.removeEventListener('play', handlePlay);
          audio.removeEventListener('pause', handlePause);
        };
      }
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentTrack]);

  const updateProgressStyle = (time: number, dur: number) => {
    if (progressRef.current && dur && dur > 0) {
      const percent = (time / dur) * 100;
      progressRef.current.style.background = `linear-gradient(to right, ${activeTheme.progressFill} 0%, ${activeTheme.progressFill} ${percent}%, ${activeTheme.progressTrack} ${percent}%, ${activeTheme.progressTrack} 100%)`;
    }
  };

  useEffect(() => {
    if (duration > 0) {
      updateProgressStyle(currentTime, duration);
    }
  }, [duration, currentTime, activeTheme]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    dragRef.current = false;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollStartLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    dragRef.current = true;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    scrollContainerRef.current.scrollLeft = scrollStartLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleTrackClick = async (trackId: number) => {
    if (dragRef.current) return;
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio && audio !== audioRefs.current[trackId]) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    const audio = audioRefs.current[trackId];
    if (audio) {
      try {
        if (currentTrack === trackId && !audio.paused) {
          audio.pause();
          setIsPlaying(false);
        } else {
          await audio.play();
          setCurrentTrack(trackId);
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        if (error instanceof Error && error.name === 'NotAllowedError') {
          showToast.error('Please click the play button to start the music');
        }
      }
    }
  };

  const handlePlayPause = async () => {
    if (currentTrack) {
      const audio = audioRefs.current[currentTrack];
      if (audio) {
        try {
          if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
          } else {
            await audio.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.error('Error playing audio:', error);
          showToast.error('Failed to play audio');
        }
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentTrack) {
      const audio = audioRefs.current[currentTrack];
      if (audio) {
        const newTime = parseFloat(e.target.value);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
        updateProgressStyle(newTime, duration || audio.duration || 1);
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds === Infinity) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTrackData = useMemo(
    () => (currentTrack ? tracks.find((t) => t.id === currentTrack) : null),
    [currentTrack]
  );

  const t = activeTheme;

  return (
    <div 
      className="page-container font-display relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 transition-colors duration-700"
      style={{ backgroundColor: t.bg }}
    >
      {/* Decorative floating elements */}
      <svg
        className="absolute top-16 left-8 w-10 h-10 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M12 2l2.39 4.84L19 8.1l-3.5 3.41.82 5.04L12 15.77 7.68 16.55l.82-5.04L5 8.1l4.61-1.26L12 2z" fill={t.decorative1} />
      </svg>

      <svg
        className="absolute right-10 top-20 w-12 h-12 opacity-80 animate-float"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M20 17.58A4.42 4.42 0 0115.58 22H7.42A4.42 4.42 0 013 17.58 4.5 4.5 0 017.5 13H8a5 5 0 019.9-1.2A3.5 3.5 0 0120 17.58z" fill={t.decorative2} />
      </svg>

      <svg
        className="absolute left-16 bottom-32 w-8 h-8 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M12 21s-6-4.35-8.5-6.5C1.85 12.73 3 9 6 8c2.28-.75 3.5 1 6 1s3.72-1.75 6-1c3 1 4.15 4.73 2.5 6.5C18 16.65 12 21 12 21z" fill={t.decorative3} />
      </svg>

      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="text-center">
            <h2 
              className="text-lg font-bold leading-tight transition-colors duration-700"
              style={{ color: t.text }}
            >
              {headerPairs[headerIndex].title}
            </h2>
            <div 
              className="text-xs transition-colors duration-700"
              style={{ color: t.textMuted }}
            >
              {headerPairs[headerIndex].sub}
            </div>
          </div>
        </div>

        {/* Playlist Container */}
        <div 
          className="rounded-2xl p-4 sm:p-5 md:p-6 border shadow-md animate-fadeIn mx-auto transition-all duration-700"
          style={{ 
            backgroundColor: t.cardBg, 
            borderColor: t.border 
          }}
        >
          {/* Music Player */}
          {currentTrackData ? (
            <div 
              className="mb-6 flex items-center gap-4 p-3 rounded-lg border shadow-sm max-w-lg w-full mx-auto transition-all duration-700"
              style={{ 
                backgroundColor: t.playerBg,
                borderColor: t.border 
              }}
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                <StableImage
                  src={currentTrackData.image}
                  alt={currentTrackData.title}
                  isActive={true}
                />
                <div className="absolute inset-0 flex items-center justify-center text-lg opacity-30 pointer-events-none">
                  🎵
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div 
                  className="text-sm font-bold truncate transition-colors duration-500"
                  style={{ color: currentTrackData.color }}
                >
                  {currentTrackData.title}
                </div>
                <div 
                  className="text-xs mb-2 truncate transition-colors duration-700"
                  style={{ color: t.textMuted }}
                >
                  {currentTrackData.description}
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-xs w-8 text-left tabular-nums transition-colors duration-700"
                    style={{ color: t.textMuted }}
                  >
                    {formatTime(currentTime)}
                  </span>
                  <input
                    ref={progressRef}
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="music-slider flex-1 h-1.5 rounded-full cursor-pointer appearance-none"
                    style={{
                      background: `linear-gradient(to right, ${t.progressFill} 0%, ${t.progressFill} ${duration > 0 ? (currentTime / duration) * 100 : 0}%, ${t.progressTrack} ${duration > 0 ? (currentTime / duration) * 100 : 0}%, ${t.progressTrack} 100%)`,
                    }}
                  />
                  <span 
                    className="text-xs w-8 text-right tabular-nums transition-colors duration-700"
                    style={{ color: t.textMuted }}
                  >
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all transform hover:scale-110 focus:outline-none cursor-pointer"
                style={{ 
                  backgroundColor: 'white',
                  color: t.accent,
                  border: `1px solid ${t.border}`
                }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                    <rect x="14" y="4" width="4" height="16" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <div className="mb-6 h-20 flex items-center justify-center">
              <div 
                className="text-base font-medium text-center transition-colors duration-700 px-4"
                style={{ color: t.textMuted }}
              >
                {placeholders[placeholderIndex]}
              </div>
            </div>
          )}

          {/* Carousel */}
          <div className="mb-4">
            <div className="relative max-w-4xl mx-auto py-4">
              {/* Left Arrow */}
              <div className="absolute left-0 top-0 bottom-0 flex items-center z-30 pl-1">
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className="w-10 h-10 rounded-full shadow-lg border flex items-center justify-center transition-all focus:outline-none"
                  style={{
                    backgroundColor: 'white',
                    borderColor: t.border,
                    color: canScrollLeft ? t.arrowText : '#D1D5DB',
                    cursor: canScrollLeft ? 'pointer' : 'not-allowed'
                  }}
                  aria-label="Scroll left"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Right Arrow */}
              <div className="absolute right-0 top-0 bottom-0 flex items-center z-30 pr-1">
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className="w-10 h-10 rounded-full shadow-lg border flex items-center justify-center transition-all focus:outline-none"
                  style={{
                    backgroundColor: 'white',
                    borderColor: t.border,
                    color: canScrollRight ? t.arrowText : '#D1D5DB',
                    cursor: canScrollRight ? 'pointer' : 'not-allowed'
                  }}
                  aria-label="Scroll right"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Tracks Container */}
              <div
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                className={`flex gap-4 overflow-x-auto scrollbar-hide px-12 py-4 justify-start select-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{ scrollbarWidth: 'none' }}
              >
                {tracks.map((track) => {
                  const isActive = currentTrack === track.id;
                  return (
                    <div
                      key={track.id}
                      className="group relative cursor-pointer transform transition-all duration-300 flex-shrink-0 w-56 hover:scale-105 hover:z-10 pointer-events-auto"
                      style={{
                        boxShadow: isActive ? `0 0 0 2px ${track.theme.ring}, 0 0 0 4px white` : undefined,
                        borderRadius: isActive ? '0.75rem' : undefined
                      }}
                      onClick={() => handleTrackClick(track.id)}
                    >
                      <div 
                        className="relative rounded-xl p-4 border-2 shadow-lg transition-all h-full flex flex-col"
                        style={{
                          backgroundColor: 'white',
                          borderColor: isActive ? track.theme.ring : t.border,
                        }}
                      >
                        <div className="relative mb-3">
                          <div 
                            className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md"
                            style={{
                              background: `linear-gradient(to bottom right, ${track.theme.cardBg}, ${track.theme.border})`
                            }}
                          >
                            <StableImage
                              src={track.image}
                              alt={track.title}
                              isActive={isActive}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30 pointer-events-none">
                              🎵
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                              {isActive ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                  <rect x="6" y="4" width="4" height="16" fill={track.theme.text} />
                                  <rect x="14" y="4" width="4" height="16" fill={track.theme.text} />
                                </svg>
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                  <path d="M8 5v14l11-7z" fill={track.theme.text} />
                                </svg>
                              )}
                            </div>
                          </div>
                          {isActive && (
                            <div 
                              className="absolute top-2 right-2 w-3 h-3 rounded-full animate-pulse"
                              style={{ backgroundColor: track.theme.accent }}
                            />
                          )}
                        </div>
                        <div className="text-center flex-1 flex flex-col justify-center">
                          <div 
                            className="font-bold mb-1 text-sm min-h-[1.25rem] transition-colors duration-500"
                            style={{ color: isActive ? track.color : t.text }}
                          >
                            {track.title}
                          </div>
                          <div 
                            className="text-xs leading-relaxed min-h-[2.5rem] flex items-center justify-center transition-colors duration-700"
                            style={{ color: t.textMuted }}
                          >
                            {track.description}
                          </div>
                        </div>
                      </div>
                      <audio
                        ref={(el) => {
                          audioRefs.current[track.id] = el;
                        }}
                        src={track.audio}
                        preload="metadata"
                        onEnded={() => {
                          setCurrentTrack(null);
                          setIsPlaying(false);
                          setCurrentTime(0);
                        }}
                        onError={(e) => {
                          console.error('Audio error:', e);
                          showToast.error('Failed to load audio. Please check the file.');
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {onContinue && (
          <div className="text-center mt-8 sm:mt-10">
            <button
              onClick={onContinue}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold shadow-md transition-all transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
              style={{
                backgroundColor: t.accent,
                color: 'white',
                boxShadow: `0 4px 14px ${t.accent}40`
              }}
              aria-label="Continue to next"
            >
              Continue to Next ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
