'use client';

import { useState, useRef, useEffect } from 'react';
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
    image: '/assets/music1.png',
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
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
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
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
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
        } else {
          await audio.play();
          setCurrentTrack(trackId);
        }
      } catch (error) {
        console.error('Playback error:', error);
        showToast.error('Please click play to start');
      }
    }
  };

  const handlePlayPause = async () => {
    if (currentTrack) {
      const audio = audioRefs.current[currentTrack];
      if (audio) {
        isPlaying ? audio.pause() : await audio.play();
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

  const currentTrackData = currentTrack ? tracks.find((t) => t.id === currentTrack) : null;

  return (
    <div className="page-container font-display relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-16 left-8 w-10 h-10 animate-float-slow opacity-50 bg-[#FDE047] rounded-full blur-xl" />
      <div className="absolute right-10 top-20 w-12 h-12 animate-float opacity-30 bg-[#FACC15] rounded-full blur-xl" />

      <div className="w-full max-w-4xl mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-[#A16207] text-2xl font-bold leading-tight">
            A Dedicated Playlist For You
          </h2>
          <p className="text-sm text-[#854D0E] opacity-80 mt-1">I Hope You&apos;ll Like It</p>
        </div>

        {/* Playlist Main Container */}
        <div className="bg-[#FEFCE8]/80 backdrop-blur-sm rounded-3xl p-6 border border-yellow-200 shadow-xl shadow-yellow-900/5 mx-auto">
          
          {/* Active Player (The Fix for your Screenshot) */}
          {currentTrackData ? (
            <div className="mb-8 flex items-center gap-4 p-4 rounded-2xl bg-white/90 border border-yellow-100 shadow-inner max-w-lg w-full mx-auto">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-yellow-50 flex-shrink-0">
                <Image
                  src={currentTrackData.image}
                  alt={currentTrackData.title}
                  fill
                  className="object-cover"
                  onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🎵</div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-[#422006] truncate">{currentTrackData.title}</h3>
                <p className="text-xs text-[#854D0E] mb-3 truncate">{currentTrackData.description}</p>
                
                {/* Progress Bar Logic */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#854D0E] w-8 tabular-nums font-medium">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    step="0.1"
                    onChange={handleSeek}
                    className="flex-1 h-1.5 accent-[#EAB308] appearance-none bg-yellow-100 rounded-full cursor-pointer overflow-hidden"
                    style={{
                      background: `linear-gradient(to right, #EAB308 0%, #EAB308 ${(currentTime / (duration || 1)) * 100}%, #FEF9C3 ${(currentTime / (duration || 1)) * 100}%, #FEF9C3 100%)`,
                    }}
                  />
                  <span className="text-[10px] text-[#854D0E] w-8 tabular-nums font-medium text-right">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlayPause}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all transform bg-white text-[#A16207] border border-yellow-100 hover:scale-110 active:scale-95"
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
            </div>
          ) : (
            <div className="mb-8 h-24 flex items-center justify-center border-2 border-dashed border-yellow-200 rounded-2xl">
              <span className="text-[#854D0E] animate-pulse">Choose a track to start vibing ✨</span>
            </div>
          )}

          {/* Selection Carousel */}
          <div className="relative group">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-opacity ${canScrollLeft ? 'opacity-100 hover:bg-yellow-50 text-[#A16207]' : 'opacity-0'}`}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-opacity ${canScrollRight ? 'opacity-100 hover:bg-yellow-50 text-[#A16207]' : 'opacity-0'}`}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6 6-6" /></svg>
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide px-2 py-4 snap-x"
              style={{ scrollbarWidth: 'none' }}
            >
              {tracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackClick(track.id)}
                  className={`flex-shrink-0 w-48 snap-start cursor-pointer transform transition-all duration-300 ${currentTrack === track.id ? 'scale-105 ring-4 ring-yellow-400 ring-offset-4 rounded-2xl' : 'hover:scale-105'}`}
                >
                  <div className="bg-white rounded-2xl p-3 shadow-md border border-yellow-100 flex flex-col h-full">
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-yellow-50">
                      <Image
                        src={track.image}
                        alt={track.title}
                        fill
                        className="object-cover"
                      />
                      {currentTrack === track.id && isPlaying && (
                        <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                          <div className="flex gap-1 items-end h-6">
                            <div className="w-1 bg-white animate-music-bar-1" />
                            <div className="w-1 bg-white animate-music-bar-2" />
                            <div className="w-1 bg-white animate-music-bar-3" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-bold text-[#422006] truncate">{track.title}</h4>
                      <p className="text-[10px] text-[#854D0E] line-clamp-2 mt-1">{track.description}</p>
                    </div>
                  </div>
                  <audio
                    ref={(el) => { audioRefs.current[track.id] = el; }}
                    src={track.audio}
                    onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onContinue && (
          <div className="text-center mt-10">
            <button
              onClick={onContinue}
              className="px-10 py-4 rounded-full bg-[#EAB308] text-[#422006] font-bold shadow-lg shadow-yellow-200 transition-all hover:scale-105 active:scale-95 hover:bg-[#FACC15]"
            >
              Continue to Next ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
