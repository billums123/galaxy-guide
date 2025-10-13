import { useState, useRef } from 'react';
import type { Planet } from '../../types/planet';
import type { OrbitPlanet } from '../../utils/calculateOrbits';
import { LightSpeed } from '../LightSpeed/LightSpeed';

interface ExploreViewProps {
  orbitingPlanets: OrbitPlanet[];
  onPlanetClick: (planet: Planet) => void;
}

/**
 * ExploreView component - Orrery-style view with orbiting planets
 */
export function ExploreView({
  orbitingPlanets,
  onPlanetClick,
}: ExploreViewProps) {
  const [isLightSpeed, setIsLightSpeed] = useState(false);
  const clickTimestamps = useRef<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle sun clicks for easter egg
  const handleSunClick = () => {
    const now = Date.now();

    // Add current click timestamp
    clickTimestamps.current.push(now);

    // Remove clicks older than 2 seconds
    clickTimestamps.current = clickTimestamps.current.filter(
      timestamp => now - timestamp <= 2000
    );

    // Check if 5 clicks within 2 seconds
    if (clickTimestamps.current.length >= 5) {
      setIsLightSpeed(true);
      clickTimestamps.current = [];

      // Play hyperspace sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Reset to start
        audioRef.current.play().catch(error => {
          console.log('Audio play failed:', error);
        });
      }

      // Reset after animation (7s for audio sync)
      setTimeout(() => {
        setIsLightSpeed(false);
      }, 7200);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Hidden audio element for lightspeed sound */}
      <audio ref={audioRef} src="/light-speed.mp3" preload="auto" />

      {/* Stars background */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random(),
            }}
          />
        ))}
      </div>

      {/* Light Speed Effect */}
      <LightSpeed isActive={isLightSpeed} />

      {/* Orrery Container */}
      <div className="relative z-50 h-[min(1000px,90vh)] w-[min(1000px,90vw)]">
        {/* Central Sun */}
        <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={handleSunClick}
            className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 text-6xl shadow-2xl shadow-orange-500/50 transition-all"
            style={{
              opacity: isLightSpeed ? 0 : 1,
              transition: 'opacity 0.3s ease-out',
            }}
          ></button>
        </div>

        {/* Orbit Rings (visual guides) */}
        {[120, 180, 240, 300, 360, 420].map(radius => (
          <div
            key={radius}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-800/30 transition-opacity"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              opacity: isLightSpeed ? 0 : 1,
            }}
          />
        ))}

        {/* Orbiting Planets */}
        {orbitingPlanets.map(
          ({
            planet,
            orbitRadius,
            startAngle,
            size,
            animationDuration,
            colorClass,
          }) => {
            return (
              <div
                key={planet.url}
                className="absolute top-1/2 left-1/2"
                style={{
                  animation: `orbit ${animationDuration}s linear infinite`,
                  animationDelay: `-${(startAngle / 360) * animationDuration}s`,
                  transformOrigin: '0 0',
                }}
              >
                <button
                  onClick={() => onPlanetClick(planet)}
                  className={`group absolute rounded-full transition-opacity hover:scale-125 ${colorClass}`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${orbitRadius}px`,
                    transform: `translateY(-50%) rotate(-${startAngle}deg)`,
                    opacity: isLightSpeed ? 0 : 1,
                    transition: 'opacity 0.5s ease-out',
                    boxShadow: `
                      inset -${size * 0.2}px -${size * 0.2}px ${size * 0.3}px rgba(0, 0, 0, 0.5),
                      inset ${size * 0.15}px ${size * 0.15}px ${size * 0.25}px rgba(255, 255, 255, 0.15),
                      0 ${size * 0.15}px ${size * 0.4}px rgba(0, 0, 0, 0.4)
                    `,
                  }}
                  title={planet.name}
                >
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded bg-gray-900/90 px-2 py-1 text-xs font-semibold whitespace-nowrap text-yellow-400 opacity-0 transition-opacity group-hover:opacity-100">
                    {planet.name}
                  </span>
                </button>
              </div>
            );
          }
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-gray-400">
          Click on any planet to view details
        </p>
      </div>

      {/* CSS Animation for orbiting */}
      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
