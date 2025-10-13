import type { Planet } from '../../types/planet';
import { getPlanetContent } from '../../data/planetContent';

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
          Explore Star Wars Planets
        </h1>
        <p className="text-lg text-gray-400">
          {planets.length} planets to discover
        </p>
      </div>

      {/* Planet Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {planets.map((planet) => {
          const content = getPlanetContent(planet);

          return (
            <button
              key={planet.url}
              onClick={() => onPlanetClick(planet)}
              className="group relative overflow-hidden rounded-lg border border-gray-700 bg-gray-900/50 p-6 text-left transition-all hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10"
            >
              {/* Planet Emoji */}
              <div className="mb-3 text-4xl">{content.emoji}</div>

              {/* Planet Name */}
              <h3 className="mb-2 text-xl font-bold text-yellow-400 group-hover:text-yellow-300">
                {planet.name}
              </h3>

              {/* Tagline */}
              <p className="mb-3 text-sm italic text-gray-400">
                {content.tagline}
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
    </div>
  );
}
