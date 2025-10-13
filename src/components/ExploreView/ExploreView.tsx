import { useState, useRef, useMemo } from 'react';
import type { Planet } from '../../types/planet';
import type { OrbitPlanet } from '../../utils/calculateOrbits';
import { LightSpeed } from '../LightSpeed/LightSpeed';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ExploreViewProps {
  orbitingPlanets: OrbitPlanet[];
  onPlanetClick: (planet: Planet) => void;
  onLightSpeedChange?: (isActive: boolean) => void;
}

/**
 * ExploreView component - Orrery-style view with orbiting planets
 */
export function ExploreView({
  orbitingPlanets,
  onPlanetClick,
  onLightSpeedChange,
}: ExploreViewProps) {
  const [isLightSpeed, setIsLightSpeed] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [showAllLabels, setShowAllLabels] = useLocalStorage<boolean>(
    'swapi-showAllLabels',
    false
  );
  const clickTimestamps = useRef<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate star positions once and memoize them
  const stars = useMemo(
    () =>
      Array.from({ length: 100 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random(),
      })),
    []
  );

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
      onLightSpeedChange?.(true);
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
        onLightSpeedChange?.(false);
      }, 7200);
    }
  };
  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Hidden audio element for lightspeed sound */}
      <audio ref={audioRef} src="/light-speed.mp3" preload="auto" />

      {/* Stars background */}
      <div className="absolute inset-0 opacity-30">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Light Speed Effect */}
      <LightSpeed isActive={isLightSpeed} />

      {/* No Results Message */}
      {orbitingPlanets.length === 0 ? (
        <div className="relative z-50 flex flex-col items-center justify-center text-center">
          <div className="mb-4 text-6xl">🔭</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-400">
            No planets in orbit
          </h2>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        /* Orrery Container */
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
                <div key={planet.url}>
                  {/* Planet orbit container */}
                  <div
                    className="absolute top-1/2 left-1/2"
                    style={{
                      animation: `orbit ${animationDuration}s linear infinite`,
                      animationDelay: `-${(startAngle / 360) * animationDuration}s`,
                      transformOrigin: '0 0',
                    }}
                  >
                    <button
                      onClick={() => onPlanetClick(planet)}
                      onMouseEnter={() => setHoveredPlanet(planet.url)}
                      onMouseLeave={() => setHoveredPlanet(null)}
                      className={`absolute rounded-full transition-all hover:scale-125 ${colorClass}`}
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${orbitRadius}px`,
                        transform: `translateY(-50%) rotate(-${startAngle}deg)`,
                        opacity: isLightSpeed ? 0 : 1,
                        transition:
                          'opacity 0.5s ease-out, transform 0.2s ease-out',
                        boxShadow: `
                        inset -${size * 0.2}px -${size * 0.2}px ${size * 0.3}px rgba(0, 0, 0, 0.5),
                        inset ${size * 0.15}px ${size * 0.15}px ${size * 0.25}px rgba(255, 255, 255, 0.15),
                        0 ${size * 0.15}px ${size * 0.4}px rgba(0, 0, 0, 0.4)
                      `,
                      }}
                      title={planet.name}
                    />
                  </div>

                  {/* Label orbit container - follows planet but stays horizontal */}
                  <div
                    className="pointer-events-none absolute top-1/2 left-1/2 z-[100]"
                    style={{
                      animation: `orbit ${animationDuration}s linear infinite`,
                      animationDelay: `-${(startAngle / 360) * animationDuration}s`,
                      transformOrigin: '0 0',
                    }}
                  >
                    <div
                      className="absolute"
                      style={{
                        left: `${orbitRadius + size / 2}px`,
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <div
                        className="absolute top-0 left-0"
                        style={{
                          animation: `counter-orbit ${animationDuration}s linear infinite`,
                          animationDelay: `-${(startAngle / 360) * animationDuration}s`,
                        }}
                      >
                        <span
                          className="absolute left-1/2 -translate-x-1/2 rounded bg-gray-900/90 px-2 py-1 text-xs font-semibold whitespace-nowrap text-yellow-400 transition-opacity"
                          style={{
                            top: `${size / 2 + 8}px`,
                            opacity: isLightSpeed
                              ? 0
                              : showAllLabels || hoveredPlanet === planet.url
                                ? 1
                                : 0,
                          }}
                        >
                          {planet.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}

          {/* Instructions - moved outside orrery container */}

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
            @keyframes counter-orbit {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(-360deg);
              }
            }
          `}</style>
        </div>
      )}

      {/* Instructions pinned to bottom */}
      {!isLightSpeed && (
        <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 text-center opacity-50">
          <p className="rounded-full px-4 py-2 text-sm text-gray-400 backdrop-blur-sm">
            Click on any planet to view details
          </p>
        </div>
      )}

      {/* Label toggle button - bottom right */}
      {!isLightSpeed && (
        <button
          onClick={() => setShowAllLabels(!showAllLabels)}
          className={`fixed right-4 bottom-4 z-[60] flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all ${
            showAllLabels
              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
              : 'bg-gray-800/80 text-gray-300 opacity-50 hover:bg-gray-700/80 hover:text-yellow-400'
          }`}
          title={showAllLabels ? 'Hide planet labels' : 'Show planet labels'}
        >
          <span>{showAllLabels ? 'Labels On' : 'Labels Off'}</span>
        </button>
      )}
    </div>
  );
}
