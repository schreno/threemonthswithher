'use client';

import { useState, useRef, useEffect, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { showToast } from '@/lib/toast';

interface PlaylistProps {
  onContinue?: () => void;
}

interface Track {
  id: number;
  title: string;
  description: string;
  image: string;
  audio: string;
}

const tracks: Track[] = [
  {
    id: 1,
    title: 'Dil Cheeze Tujhe Dedi',
    description: 'You own this heart — dedicated to you 💞',
    image: '/assets/rideyourwave.gif',
    audio: '/assets/music1-Bpgt1BZ5.mp3',
  },
  {
    id: 2,
    title: 'If the world was ending',
    description: "Even if the world ends, I'd still find you 🤍",
    image: '/assets/music2.png',
    audio: '/assets/music2-mdcMq3L1.mp3',
  },
  {
    id: 3,
    title: 'Dil ka Jo Haal hai',
    description: 'Tu Kaare Dil Bekarar 💞',
    image: '/assets/music3.png',
    audio: '/assets/music3-ClPh4k2q.mp3',
  },
];

// Memoized image component - won't re-render when parent state changes
const StableImage = memo(({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    fill
    unoptimized
    className="object-cover"
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  useEffect(() => {
    if (currentTrack) {
      const audio = audioRefs.current[currentTrack];
      if (audio) {
        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
          audio.removeEventListener('timeupdate', updateTime);
          audio.removeEventListener('loadedmetadata', updateDuration);
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

  const handleTrackClick = async (trackId: number) => {
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
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // useMemo so this only recalculates when currentTrack ID changes, not on every time update
  const currentTrackData = useMemo(
    () => (currentTrack ? tracks.find((t) => t.id === currentTrack) : null),
    [currentTrack]
  );

  return (
    <div className="page-container font-display relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6">
      {/* Decorative floating elements - Updated to Yellows */}
      <svg
        className="absolute top-16 left-8 w-10 h-10 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2l2.39 4.84L19 8.1l-3.5 3.41.82 5.04L12 15.77 7.68 16.55l.82-5.04L5 8.1l4.61-1.26L12 2z"
          fill="#FDE047"
        />
      </svg>

      <svg
        className="absolute right-10 top-20 w-12 h-12 opacity-80 animate-float"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M20 17.58A4.42 4.42 0 0115.58 22H7.42A4.42 4.42 0 013 17.58 4.5 4.5 0 017.5 13H8a5 5 0 019.9-1.2A3.5 3.5 0 0120 17.58z"
          fill="#FEF08A"
        />
      </svg>

      <svg
        className="absolute left-16 bottom-32 w-8 h-8 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 21s-6-4.35-8.5-6.5C1.85 12.73 3 9 6 8c2.28-.75 3.5 1 6 1s3.72-1.75 6-1c3 1 4.15 4.73 2.5 6.5C18 16.65 12 21 12 21z"
          fill="#FACC15"
        />
      </svg>

      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="text-center">
            <h2 className="text-[#A16207] text-lg font-bold leading-tight">
              A Dedicated Playlist For You
            </h2>
            <div className="text-xs text-[#854D0E]">
              I Hope You&apos;ll Like It
            </div>
          </div>
        </div>

        {/* Playlist Container */}
        <div className="bg-[#FEFCE8] rounded-2xl p-4 sm:p-5 md:p-6 border border-yellow-200 shadow-md animate-fadeIn mx-auto">
          {/* Music Player */}
          {currentTrackData ? (
            <div className="mb-6 flex items-center gap-4 p-3 rounded-lg bg-white/70 border border-yellow-100 shadow-sm max-w-lg w-full mx-auto">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                <StableImage
                  src={currentTrackData.image}
                  alt={currentTrackData.title}
                />
                <div className="absolute inset-0 flex items-center justify-center text-lg opacity-30 pointer-events-none">
                  🎵
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#422006] truncate">
                  {currentTrackData.title}
                </div>
                <div className="text-xs text-[#854D0E] mb-2 truncate">
                  {currentTrackData.description}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#854D0E] w-8 text-left">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 accent-[#EAB308] appearance-none bg-yellow-100 rounded-full cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #EAB308 0%, #EAB308 ${(currentTime / (duration || 1)) * 100}%, #FEF9C3 ${(currentTime / (duration || 1)) * 100}%, #FEF9C3 100%)`,
                    }}
                  />
                  <span className="text-xs text-[#854D0E] w-8 text-right">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all transform bg-white text-[#A16207] border border-yellow-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-300 cursor-pointer"
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
              <div className="text-base text-[#854D0E] font-medium text-center">
                Choose a track to start vibing ✨
              </div>
            </div>
          )}

          {/* Carousel */}
          <div className="mb-8">
            <div className="relative max-w-4xl mx-auto">
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-yellow-200 flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-yellow-300 ${
                  canScrollLeft
                    ? 'text-[#A16207] hover:bg-yellow-50 cursor-pointer'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Scroll left"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-yellow-200 flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-yellow-300 ${
                  canScrollRight
                    ? 'text-[#A16207] hover:bg-yellow-50 cursor-pointer'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Scroll right"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Tracks Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-14 py-2 justify-start"
                style={{ scrollbarWidth: 'none' }}
              >
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className={`group relative cursor-pointer transform transition-all duration-300 flex-shrink-0 w-56 h-full hover:scale-105 hover:z-10 ${
                      currentTrack === track.id
                        ? 'ring-2 ring-[#EAB308] ring-offset-2 rounded-xl'
                        : ''
                    }`}
                    onClick={() => handleTrackClick(track.id)}
                  >
                    <div className="relative bg-white rounded-xl p-4 border-2 shadow-lg transition-all border-yellow-100 hover:border-yellow-200 hover:shadow-xl group-hover:shadow-yellow-200/30 h-full flex flex-col">
                      <div className="relative mb-3">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 shadow-md">
                          <StableImage
                            src={track.image}
                            alt={track.title}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30 pointer-events-none">
                            🎵
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            {currentTrack === track.id ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <rect x="6" y="4" width="4" height="16" fill="#A16207" />
                                <rect x="14" y="4" width="4" height="16" fill="#A16207" />
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M8 5v14l11-7z" fill="#A16207" />
                              </svg>
                            )}
                          </div>
                        </div>
                        {currentTrack === track.id && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-[#EAB308] rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="text-center flex-1 flex flex-col justify-center">
                        <div className="font-bold text-[#422006] mb-1 text-sm min-h-[1.25rem]">
                          {track.title}
                        </div>
                        <div className="text-xs text-[#854D0E] leading-relaxed min-h-[2.5rem] flex items-center justify-center">
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
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {onContinue && (
          <div className="text-center mt-8 sm:mt-10">
            <button
              onClick={onContinue}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#EAB308] text-[#422006] font-semibold shadow-md transition-all transform hover:scale-105 active:scale-95 hover:shadow-yellow-300/50 focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer"
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
