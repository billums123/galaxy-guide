import type { Planet } from '../../types/planet';

interface ExploreViewProps {
  planets: Planet[];
  onPlanetClick: (planet: Planet) => void;
}

/**
 * ExploreView component - Interactive explore interface for planets
 */
export function ExploreView({ planets: _planets, onPlanetClick: _onPlanetClick }: ExploreViewProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Placeholder for Explore View */}
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-yellow-400">
            Explore View
          </h1>
        </div>
      </div>
    </div>
  );
}

