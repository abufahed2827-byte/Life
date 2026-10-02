import { useMemo } from 'react';
import { useAmbient } from '@/context/AmbientContext';

export default function AmbientBackground() {
  const { theme } = useAmbient();

  // Pre-generate star positions (stable across renders)
  const stars = useMemo(() => {
    if (!theme.starCount) return [];
    return Array.from({ length: theme.starCount }, (_, i) => {
      const seed = i * 137.5;
      const x = (seed * 1.618) % 100;
      const y = (seed * 2.414) % 100;
      const delay = `${(seed % 3).toFixed(2)}s`;
      const duration = `${2 + (seed % 3)}.${Math.floor(seed) % 10}s`;
      const isLarge = i % 7 === 0;
      const hue = i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#818cf8' : '#60a5fa';
      return { x, y, delay, duration, isLarge, hue, id: i };
    });
  }, [theme.starCount]);

  // Pre-generate mist particles
  const mists = useMemo(() => {
    if (!theme.mistCount) return [];
    return Array.from({ length: theme.mistCount }, (_, i) => {
      const seed = i * 73.2;
      const x = (seed * 1.618) % 100;
      const y = 30 + ((seed * 2.414) % 60);
      const size = 40 + Math.floor(seed % 80);
      const delay = `${(seed % 8).toFixed(1)}s`;
      const duration = `${8 + (seed % 6)}.${Math.floor(seed) % 10}s`;
      const color = i % 2 === 0 ? 'rgba(132,204,22,0.15)' : 'rgba(20,184,166,0.12)';
      return { x, y, size, delay, duration, color, id: i };
    });
  }, [theme.mistCount]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Gradient blobs (all themes) */}
      {theme.effects.filter((e) => e.type === 'blob').map((blob, i) => (
        <div
          key={`${theme.id}-blob-${i}`}
          className="ambient-blob"
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            top: blob.top,
            left: blob.left,
            backgroundColor: blob.color,
            animationDelay: blob.delay,
          }}
        />
      ))}

      {/* Stars (Space theme) */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className={`ambient-star ${star.isLarge ? 'ambient-star-lg' : ''}`}
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            backgroundColor: star.hue,
            color: star.hue,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      {/* Ocean waves */}
      {theme.waveLayers?.map((wave, i) => (
        <div
          key={`wave-${i}`}
          className="ambient-wave"
          style={{
            bottom: `${i * 12}%`,
            height: '120px',
            opacity: wave.opacity,
            animationDuration: wave.duration,
            animationDelay: `${wave.offset}s`,
          }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
              fill={wave.color}
            />
          </svg>
        </div>
      ))}

      {/* Forest mist */}
      {mists.map((mist) => (
        <div
          key={`mist-${mist.id}`}
          className="ambient-mist"
          style={{
            width: `${mist.size}px`,
            height: `${mist.size}px`,
            top: `${mist.y}%`,
            left: `${mist.x}%`,
            backgroundColor: mist.color,
            animationDelay: mist.delay,
            animationDuration: mist.duration,
          }}
        />
      ))}
    </div>
  );
}
