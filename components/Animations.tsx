"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  emoji: string;
  color: string;
}

interface ParticleSystemProps {
  type?: 'leaves' | 'sparkles' | 'dust' | 'magic' | 'celebration';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const CONFIGS = {
  leaves: {
    count: { low: 5, medium: 10, high: 20 },
    colors: ['#22c55e', '#16a34a', '#15803d'],
    emojis: ['🍃', '🌿', '🍂'],
  },
  sparkles: {
    count: { low: 10, medium: 20, high: 40 },
    colors: ['#fbbf24', '#f59e0b', '#fcd34d'],
    emojis: ['✨', '⭐', '💫'],
  },
  dust: {
    count: { low: 15, medium: 30, high: 50 },
    colors: ['#d4a574', '#c4956a', '#b4855a'],
    emojis: [],
  },
  magic: {
    count: { low: 8, medium: 15, high: 30 },
    colors: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
    emojis: ['✨', '💫', '🔮'],
  },
  celebration: {
    count: { low: 20, medium: 40, high: 60 },
    colors: ['#fbbf24', '#22c55e', '#3b82f6', '#ef4444', '#8b5cf6'],
    emojis: ['🎉', '🎊', '✨', '⭐', '🌟'],
  },
};

export function ParticleSystem({ type = 'leaves', intensity = 'medium', className = '' }: ParticleSystemProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const idCounter = useRef(0);
  const config = CONFIGS[type];

  const makeParticle = useCallback((fromTop = false): Particle => {
    const id = idCounter.current++;
    return {
      id,
      x: Math.random() * 100,
      y: fromTop ? -10 : Math.random() * 100,
      size: 12 + Math.random() * 16,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: 0.3 + Math.random() * 0.6,
      opacity: 0.4 + Math.random() * 0.6,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 3,
      emoji: config.emojis.length > 0 ? config.emojis[id % config.emojis.length] : '',
      color: config.colors[id % config.colors.length],
    };
  }, [config]);

  // Initialize particles on mount/config change
  useEffect(() => {
    const count = config.count[intensity];
    const initial: Particle[] = [];
    for (let i = 0; i < count; i++) {
      initial.push(makeParticle(false));
    }
    setParticles(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, intensity]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setParticles(prev =>
        prev.map(p => {
          const newY = p.y + p.speedY;
          const newX = p.x + p.speedX + Math.sin(p.y * 0.02) * 0.3;
          let newOpacity = p.opacity;

          // Reset if off screen
          if (newY > 105 || newX < -5 || newX > 105) {
            return makeParticle(true);
          }

          // Fade near bottom
          if (newY > 85) {
            newOpacity *= 0.96;
          }

          return {
            ...p,
            x: newX,
            y: newY,
            opacity: newOpacity,
            rotation: p.rotation + p.rotationSpeed,
          };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [makeParticle]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ zIndex: 1 }}>
      {particles.map(p => (
        p.emoji ? (
          <div
            key={p.id}
            className="absolute pointer-events-none select-none transition-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: p.size,
              opacity: p.opacity,
              transform: `rotate(${p.rotation}deg)`,
            }}
          >
            {p.emoji}
          </div>
        ) : (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size * 0.4,
              height: p.size * 0.4,
              backgroundColor: p.color,
              opacity: p.opacity * 0.6,
              transform: `rotate(${p.rotation}deg)`,
              filter: 'blur(1px)',
            }}
          />
        )
      ))}
    </div>
  );
}

// Floating animation component
interface FloatingElementProps {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  className?: string;
}

export function FloatingElement({ children, duration = 3, className = '' }: FloatingElementProps) {
  return (
    <div
      className={`animate-bounce-slow ${className}`}
      style={{
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
}

// Pulse glow effect
interface PulseGlowProps {
  color?: string;
  size?: number;
  className?: string;
}

export function PulseGlow({ color = '#22c55e', size = 100, className = '' }: PulseGlowProps) {
  return (
    <div
      className={`absolute rounded-full animate-pulse pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        filter: 'blur(20px)',
      }}
    />
  );
}

// Shimmer effect for text/elements
interface ShimmerProps {
  children: React.ReactNode;
  className?: string;
}

export function Shimmer({ children, className = '' }: ShimmerProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }}
      />
    </div>
  );
}

// Screen shake hook
export function useScreenShake() {
  const [isShaking, setIsShaking] = useState(false);

  const shake = useCallback((duration = 500) => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), duration);
  }, []);

  return { shake, isShaking };
}

// Typewriter effect
interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({ text, speed = 50, className = '', onComplete }: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayText('');
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setShowCursor(false);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  );
}

// Confetti burst hook
export function useConfetti() {
  const [confetti, setConfetti] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    vx: number;
    vy: number;
  }>>([]);

  const burst = useCallback((x: number, y: number, count = 30) => {
    const colors = ['#fbbf24', '#22c55e', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];
    const newConfetti = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vx: (Math.random() - 0.5) * 15,
      vy: -Math.random() * 15 - 5,
    }));

    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 2000);
  }, []);

  const ConfettiComponent = useCallback(() => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute animate-confetti-fall"
          style={{
            left: c.x + c.vx * 10,
            top: c.y,
            width: 10,
            height: 10,
            backgroundColor: c.color,
            transform: `rotate(${c.rotation}deg)`,
            borderRadius: c.id % 2 === 0 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  ), [confetti]);

  return { burst, ConfettiComponent };
}

export default ParticleSystem;
