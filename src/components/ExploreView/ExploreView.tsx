import type { Planet } from '../../types/planet';
import type { OrbitPlanet } from '../../utils/calculateOrbits';

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
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gray-950">
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

      {/* Orrery Container */}
      <div className="relative h-[1000px] w-[1000px]">
        {/* Central Sun */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 text-6xl shadow-2xl shadow-orange-500/50"></div>
        </div>

        {/* Orbit Rings (visual guides) */}
        {[120, 180, 240, 300, 360, 420].map(radius => (
          <div
            key={radius}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-800/30"
            style={{
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
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
                  className={`group absolute rounded-full transition-all hover:scale-125 ${colorClass}`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${orbitRadius}px`,
                    transform: `translateY(-50%) rotate(-${startAngle}deg)`,
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
