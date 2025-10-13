import { getPlanetEmoji } from '../../utils/getPlanetEmoji';
import type { Planet } from '../../types/planet';

interface ListViewProps {
  planets: Planet[];
  onPlanetClick: (planet: Planet) => void;
}

/**
 * ListView component - Grid view of all planets
 */
export function ListView({ planets, onPlanetClick }: ListViewProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-yellow-400">
          Galaxy Guide
        </h1>
        <p className="text-lg text-gray-400">
          {planets.length} {planets.length === 1 ? 'planet' : 'planets'} to
          discover
        </p>
      </div>

      {/* No Results Message */}
      {planets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 text-6xl">🔭</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-400">
            No planets found
          </h2>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        /* Planet Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {planets.map(planet => {
            return (
              <button
                key={planet.url}
                onClick={() => onPlanetClick(planet)}
                className="group relative overflow-hidden rounded-lg border border-gray-700 bg-gray-900/50 p-6 text-left transition-all hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10"
              >
                {/* Planet Emoji */}
                <div className="mb-3 text-4xl">{getPlanetEmoji(planet)}</div>

                {/* Planet Name */}
                <h3 className="mb-2 text-xl font-bold text-yellow-400 group-hover:text-yellow-300">
                  {planet.name}
                </h3>

                {/* Quick Info */}
                <p className="mb-3 text-sm text-gray-400 italic">
                  Click to discover this world
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                    {planet.climate}
                  </span>
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">
                    {planet.terrain}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
