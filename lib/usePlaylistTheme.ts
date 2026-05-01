// lib/usePlaylistTheme.ts
import { useState, useCallback } from 'react';

export interface TrackTheme {
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

export const defaultTheme: TrackTheme = {
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

export function usePlaylistTheme() {
  const [theme, setTheme] = useState<TrackTheme>(defaultTheme);

  const updateTheme = useCallback((newTheme: TrackTheme) => {
    setTheme(newTheme);
    // Also update CSS variables for global access
    const root = document.documentElement;
    root.style.setProperty('--pl-bg', newTheme.bg);
    root.style.setProperty('--pl-cardBg', newTheme.cardBg);
    root.style.setProperty('--pl-border', newTheme.border);
    root.style.setProperty('--pl-accent', newTheme.accent);
    root.style.setProperty('--pl-text', newTheme.text);
    root.style.setProperty('--pl-textMuted', newTheme.textMuted);
    root.style.setProperty('--pl-progressFill', newTheme.progressFill);
    root.style.setProperty('--pl-progressTrack', newTheme.progressTrack);
    root.style.setProperty('--pl-arrowText', newTheme.arrowText);
    root.style.setProperty('--pl-decorative1', newTheme.decorative1);
    root.style.setProperty('--pl-decorative2', newTheme.decorative2);
    root.style.setProperty('--pl-decorative3', newTheme.decorative3);
    root.style.setProperty('--pl-playerBg', newTheme.playerBg);
    root.style.setProperty('--pl-ring', newTheme.ring);
  }, []);

  return { theme, updateTheme };
}
