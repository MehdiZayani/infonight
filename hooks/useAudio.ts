"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

// Sound effect types
export type SoundEffect = 
  | 'click' 
  | 'success' 
  | 'error' 
  | 'notification' 
  | 'pageFlip' 
  | 'coin' 
  | 'levelUp'
  | 'bell'
  | 'typing'
  | 'whoosh'
  | 'magic'
  | 'alert';

// Audio context singleton
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
};

// Generate synthetic sounds
const generateSound = (ctx: AudioContext, type: SoundEffect): void => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  switch (type) {
    case 'click':
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.05);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      oscillator.start(now);
      oscillator.stop(now + 0.05);
      break;
      
    case 'success':
      oscillator.frequency.setValueAtTime(523.25, now); // C5
      oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      oscillator.start(now);
      oscillator.stop(now + 0.4);
      break;
      
    case 'error':
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.setValueAtTime(150, now + 0.1);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      oscillator.type = 'sawtooth';
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;
      
    case 'notification':
      oscillator.frequency.setValueAtTime(880, now);
      oscillator.frequency.setValueAtTime(1100, now + 0.1);
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
      break;
      
    case 'pageFlip':
      // White noise burst for page flip
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.1, now);
      noiseSource.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(now);
      return;
      
    case 'coin':
      oscillator.frequency.setValueAtTime(1318.51, now); // E6
      oscillator.frequency.setValueAtTime(1567.98, now + 0.08); // G6
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;
      
    case 'levelUp':
      oscillator.frequency.setValueAtTime(440, now);
      oscillator.frequency.setValueAtTime(554.37, now + 0.1);
      oscillator.frequency.setValueAtTime(659.25, now + 0.2);
      oscillator.frequency.setValueAtTime(880, now + 0.3);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      oscillator.start(now);
      oscillator.stop(now + 0.5);
      break;
      
    case 'bell':
      oscillator.frequency.setValueAtTime(830.61, now); // G#5
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      oscillator.start(now);
      oscillator.stop(now + 0.8);
      break;
      
    case 'typing':
      oscillator.frequency.setValueAtTime(400 + Math.random() * 200, now);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
      oscillator.start(now);
      oscillator.stop(now + 0.02);
      break;
      
    case 'whoosh':
      const whooshBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const whooshData = whooshBuffer.getChannelData(0);
      for (let i = 0; i < whooshBuffer.length; i++) {
        const t = i / whooshBuffer.length;
        whooshData[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.3;
      }
      const whooshSource = ctx.createBufferSource();
      whooshSource.buffer = whooshBuffer;
      const whooshGain = ctx.createGain();
      whooshGain.gain.setValueAtTime(0.15, now);
      whooshSource.connect(whooshGain);
      whooshGain.connect(ctx.destination);
      whooshSource.start(now);
      return;
      
    case 'magic':
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800 + i * 200, now + i * 0.05);
        osc.frequency.exponentialRampToValueAtTime(400 + i * 100, now + i * 0.05 + 0.1);
        gain.gain.setValueAtTime(0.1, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.15);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.15);
      }
      return;
      
    case 'alert':
      oscillator.frequency.setValueAtTime(880, now);
      oscillator.frequency.setValueAtTime(440, now + 0.15);
      oscillator.frequency.setValueAtTime(880, now + 0.3);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.setValueAtTime(0.3, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      oscillator.start(now);
      oscillator.stop(now + 0.5);
      break;
  }
};

// Generate ambient music - enhanced version
const generateAmbientMusic = (ctx: AudioContext): OscillatorNode[] => {
  const oscillators: OscillatorNode[] = [];
  const now = ctx.currentTime;
  
  // Deep bass foundation
  const bass = ctx.createOscillator();
  const bassGain = ctx.createGain();
  bass.type = 'sine';
  bass.frequency.setValueAtTime(55, now); // A1 - deep
  bassGain.gain.setValueAtTime(0.15, now);
  bass.connect(bassGain);
  bassGain.connect(ctx.destination);
  oscillators.push(bass);
  
  // Rich harmonic pad layer 1
  const harmonic1 = ctx.createOscillator();
  const harmonic1Gain = ctx.createGain();
  harmonic1.type = 'triangle';
  harmonic1.frequency.setValueAtTime(110, now); // A2
  harmonic1Gain.gain.setValueAtTime(0.12, now);
  harmonic1.connect(harmonic1Gain);
  harmonic1Gain.connect(ctx.destination);
  oscillators.push(harmonic1);
  
  // Harmonic pad layer 2
  const harmonic2 = ctx.createOscillator();
  const harmonic2Gain = ctx.createGain();
  harmonic2.type = 'sine';
  harmonic2.frequency.setValueAtTime(165, now); // E3
  harmonic2Gain.gain.setValueAtTime(0.1, now);
  harmonic2.connect(harmonic2Gain);
  harmonic2Gain.connect(ctx.destination);
  oscillators.push(harmonic2);
  
  // Chord voices
  const chordOsc1 = ctx.createOscillator();
  const chordGain1 = ctx.createGain();
  chordOsc1.type = 'sine';
  chordOsc1.frequency.setValueAtTime(220, now); // A3
  chordGain1.gain.setValueAtTime(0.08, now);
  chordOsc1.connect(chordGain1);
  chordGain1.connect(ctx.destination);
  oscillators.push(chordOsc1);
  
  const chordOsc2 = ctx.createOscillator();
  const chordGain2 = ctx.createGain();
  chordOsc2.type = 'sine';
  chordOsc2.frequency.setValueAtTime(275, now); // D#4
  chordGain2.gain.setValueAtTime(0.08, now);
  chordOsc2.connect(chordGain2);
  chordGain2.connect(ctx.destination);
  oscillators.push(chordOsc2);
  
  // Sweeping atmospheric tone with LFO
  const sweepOsc = ctx.createOscillator();
  const sweepGain = ctx.createGain();
  const lfo1 = ctx.createOscillator();
  const lfo1Gain = ctx.createGain();
  
  lfo1.frequency.setValueAtTime(0.08, now);
  lfo1Gain.gain.setValueAtTime(50, now);
  lfo1.connect(lfo1Gain);
  
  sweepOsc.type = 'sine';
  sweepOsc.frequency.setValueAtTime(330, now); // E4
  lfo1Gain.connect(sweepOsc.frequency);
  sweepGain.gain.setValueAtTime(0.06, now);
  sweepOsc.connect(sweepGain);
  sweepGain.connect(ctx.destination);
  oscillators.push(sweepOsc);
  oscillators.push(lfo1);
  
  // High melody line with LFO modulation
  const melody = ctx.createOscillator();
  const melodyGain = ctx.createGain();
  const lfo2 = ctx.createOscillator();
  const lfo2Gain = ctx.createGain();
  
  lfo2.frequency.setValueAtTime(0.12, now);
  lfo2Gain.gain.setValueAtTime(30, now);
  lfo2.connect(lfo2Gain);
  
  melody.type = 'sine';
  melody.frequency.setValueAtTime(440, now); // A4
  lfo2Gain.connect(melody.frequency);
  melodyGain.gain.setValueAtTime(0.04, now);
  melody.connect(melodyGain);
  melodyGain.connect(ctx.destination);
  oscillators.push(melody);
  oscillators.push(lfo2);
  
  return oscillators;
};

interface AudioState {
  isMuted: boolean;
  musicVolume: number;
  sfxVolume: number;
  isMusicPlaying: boolean;
}

export function useAudio() {
  const [audioState, setAudioState] = useState<AudioState>({
    isMuted: false,
    musicVolume: 0.4,
    sfxVolume: 0.5,
    isMusicPlaying: false,
  });
  
  const musicOscillators = useRef<OscillatorNode[]>([]);
  const gainNode = useRef<GainNode | null>(null);
  const isInitialized = useRef(false);
  
  // Initialize audio on user interaction
  const initAudio = useCallback(() => {
    if (isInitialized.current) return;
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    isInitialized.current = true;
  }, []);
  
  // Play sound effect
  const playSound = useCallback((effect: SoundEffect) => {
    if (audioState.isMuted) return;
    
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    generateSound(ctx, effect);
  }, [audioState.isMuted]);
  
  // Start background music
  const startMusic = useCallback(() => {
    if (audioState.isMuted || audioState.isMusicPlaying) return;
    
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // Create gain node for volume control
    gainNode.current = ctx.createGain();
    gainNode.current.gain.setValueAtTime(audioState.musicVolume, ctx.currentTime);
    gainNode.current.connect(ctx.destination);
    
    musicOscillators.current = generateAmbientMusic(ctx);
    musicOscillators.current.forEach(osc => {
      osc.connect(gainNode.current!);
      osc.start();
    });
    
    setAudioState(prev => ({ ...prev, isMusicPlaying: true }));
  }, [audioState.isMuted, audioState.isMusicPlaying, audioState.musicVolume]);
  
  // Update music volume
  const setMusicVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setAudioState(prev => ({ ...prev, musicVolume: clampedVolume }));
    
    if (gainNode.current) {
      gainNode.current.gain.setValueAtTime(clampedVolume, (getAudioContext()?.currentTime || 0));
    }
  }, []);
  
  // Stop background music
  const stopMusic = useCallback(() => {
    musicOscillators.current.forEach(osc => {
      try {
        osc.stop();
      } catch {
        // Oscillator already stopped
      }
    });
    musicOscillators.current = [];
    setAudioState(prev => ({ ...prev, isMusicPlaying: false }));
  }, []);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    setAudioState(prev => {
      if (!prev.isMuted) {
        // Muting - stop music
        musicOscillators.current.forEach(osc => {
          try { osc.stop(); } catch { /* ignore */ }
        });
        musicOscillators.current = [];
        return { ...prev, isMuted: true, isMusicPlaying: false };
      }
      return { ...prev, isMuted: false };
    });
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      musicOscillators.current.forEach(osc => {
        try { osc.stop(); } catch { /* ignore */ }
      });
    };
  }, []);
  
  return {
    playSound,
    startMusic,
    stopMusic,
    toggleMute,
    setMusicVolume,
    initAudio,
    isMuted: audioState.isMuted,
    isMusicPlaying: audioState.isMusicPlaying,
    musicVolume: audioState.musicVolume,
  };
}

export default useAudio;
