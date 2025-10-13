import type { Planet } from '../../types/planet';
import { getPlanetContent } from '../../data/planetContent';

interface ExploreViewProps {
  planets: Planet[];
  onPlanetClick: (planet: Planet) => void;
}

interface OrbitPlanet {
  planet: Planet;
  orbitRadius: number;
  startAngle: number;
  size: number;
  animationDuration: number;
}

/**
 * ExploreView component -  view with rotating planets randomly placed on
 */
export function ExploreView({ planets, onPlanetClick }: ExploreViewProps) {
  // Assign planets to orbits randomly - recalculated each time view is rendered
  // Define base orbit rings (in pixels from center)
  const baseOrbitRings = [120, 180, 240, 300, 360, 420];

  // Create a shuffled array of orbit indices for better distribution
  const shuffledOrbits = planets
    .map((_, index) => baseOrbitRings[index % baseOrbitRings.length])
    .sort(() => Math.random() - 0.5);

  const orbitingPlanets: OrbitPlanet[] = planets.map((planet, index) => {
    // Get orbit from shuffled list and add some variance (-20 to +20px)
    const baseOrbit = shuffledOrbits[index];
    const orbitVariance = (Math.random() - 0.5) * 40;
    const orbitRadius = baseOrbit + orbitVariance;

    // Random starting angle (0-360 degrees)
    const startAngle = Math.random() * 360;

    // Vary planet sizes slightly
    const size = 40 + Math.random() * 20;

    // Different rotation speeds for different orbits (closer = faster)
    // Add some randomness to speed for more natural feel
    const baseSpeed = 20 + orbitRadius / 20;
    const speedVariance = (Math.random() - 0.5) * 5;
    const animationDuration = baseSpeed + speedVariance;

    return {
      planet,
      orbitRadius,
      startAngle,
      size,
      animationDuration,
    };
  });

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
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 text-6xl shadow-2xl shadow-orange-500/50">
          </div>
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
          ({ planet, orbitRadius, startAngle, size, animationDuration }) => {
            const content = getPlanetContent(planet);

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
                  className="group absolute flex items-center justify-center rounded-full bg-gray-900/80 backdrop-blur-sm transition-all hover:scale-110 hover:bg-gray-800 hover:shadow-lg hover:shadow-yellow-500/30"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${orbitRadius}px`,
                    transform: `translateY(-50%) rotate(-${startAngle}deg)`,
                  }}
                  title={planet.name}
                >
                  <span className="text-2xl">{content.emoji}</span>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap text-yellow-400 opacity-0 transition-opacity group-hover:opacity-100">
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
