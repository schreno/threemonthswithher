'use client';

import { useState, useRef, useEffect, memo, useMemo, useCallback } from 'react';
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
    title: "Mahika",
    description: "You told me this was your favorite andddd now it's ours 🥹. Your mahika, forever always baby 🌻🥰",
    image: "/assets/mahika.gif",
    audio: "/assets/mahika-song.mp3"
  },
  {
    id: 2,
    title: "Brand New Story",
    description: "Every time this music plays, I think of us and our movie. I will always be there when you sing it 🥹🌊✨",
    image: "/assets/rideyourwave.gif",
    audio: "/assets/rideyourwave-song.mp3"
  },
  {
    id: 3,
    title: "High School Sweethearts",
    description: "Honestly, distance is just a test to see how far love can travel baby. My high school sweetheart, no matter the miles ✈️🥰🌎",
    image: "/assets/rideyourwave.gif",
    audio: "/assets/rideyourwave-song.mp3"
  },
  {
    id: 4,
    title: "Ang Pag-ibig ay Kanibalismo",
    description: "Magdodroga tayo... kimi lang, bawal 'yon. Ikaw lang sapat na, hehe 🤤😋",
    image: "/assets/rideyourwave.gif",
    audio: "/assets/rideyourwave-song.mp3"
  },
  {
    id: 5,
    title: "Blue",
    description: "Remember talking about this while we were on roblox? Now every time I hear it, I just picture us by the waves. 🌊💙💛",    
    image: "/assets/rideyourwave.gif",
    audio: "/assets/rideyourwave-song.mp3"
  },
  {
    id: 6,
    title: "Yellow",
    description: "Look how the stars shine for you, and everything is yellow. Just like the sunflowers. 🌻✨",
    image: "/assets/rideyourwave.gif",
    audio: "/assets/rideyourwave-song.mp3"
  },
  {
    id: 7,
    title: "Seasons",
    description: "I'll give you all my life, my seasons. By your side, I'll be your seasons. ☀️💛",
    image: "/assets/rideyourwave.gif",
    audio: "/assets/rideyourwave-song.mp3"
  }
];

// Memoized image component - won't re-render when parent state changes
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({});
  const progressRef = useRef<HTMLInputElement>(null);

  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStartLeft, setScrollStartLeft] = useState(0);
  const dragRef = useRef(false);

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
      progressRef.current.style.background = `linear-gradient(to right, #EAB308 0%, #EAB308 ${percent}%, #FEF9C3 ${percent}%, #FEF9C3 100%)`;
    }
  };

  useEffect(() => {
    if (duration > 0) {
      updateProgressStyle(currentTime, duration);
    }
  }, [duration, currentTime]);

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

  // Drag to scroll handlers
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

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
                  isActive={true}
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
                  <span className="text-xs text-[#854D0E] w-8 text-left tabular-nums">
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
                    className="music-slider flex-1 h-1.5 rounded-full cursor-pointer appearance-none bg-[#FEF9C3]"
                    style={{
                      background: `linear-gradient(to right, #EAB308 0%, #EAB308 ${duration > 0 ? (currentTime / duration) * 100 : 0}%, #FEF9C3 ${duration > 0 ? (currentTime / duration) * 100 : 0}%, #FEF9C3 100%)`,
                    }}
                  />
                  <span className="text-xs text-[#854D0E] w-8 text-right tabular-nums">
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
              {/* Left Arrow - full height flex wrapper for perfect vertical centering */}
              <div className="absolute left-0 top-0 bottom-0 flex items-center z-30 pl-1">
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className={`w-10 h-10 rounded-full bg-white shadow-lg border border-yellow-200 flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-yellow-300 ${
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
              </div>

              {/* Right Arrow - full height flex wrapper for perfect vertical centering */}
              <div className="absolute right-0 top-0 bottom-0 flex items-center z-30 pr-1">
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className={`w-10 h-10 rounded-full bg-white shadow-lg border border-yellow-200 flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-yellow-300 ${
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
              </div>

              {/* Tracks Container */}
              <div
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                className={`flex gap-4 overflow-x-auto scrollbar-hide px-12 py-2 justify-start select-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{ scrollbarWidth: 'none' }}
              >
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className={`group relative cursor-pointer transform transition-all duration-300 flex-shrink-0 w-56 h-full hover:scale-105 hover:z-10 pointer-events-auto ${
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
                            isActive={currentTrack === track.id}
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
