import { useState, useMemo } from 'react';
import './App.css';
import { usePlanets } from './hooks/usePlanets';
import { calculateOrbits } from './utils/calculateOrbits';
import type { Planet } from './types/planet';
import { ListView } from './components/ListView/ListView';
import { ExploreView } from './components/ExploreView/ExploreView';
import { PlanetModal } from './components/PlanetModal/PlanetModal';

type ViewMode = 'list' | 'explore';

function App() {
  const { planets, loading, error } = usePlanets();
  const orbitingPlanets = useMemo(() => calculateOrbits(planets), [planets]);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Handle planet selection in browse mode
  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(planet);
  };

  // Handle modal close
  const handleModalClose = () => {
    setSelectedPlanet(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="mb-4 text-6xl">🌌</div>
          <h2 className="mb-2 text-2xl font-bold text-yellow-400">
            Loading Planets...
          </h2>
          <p className="text-gray-400">
            Fetching data from a galaxy far, far away
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <h2 className="mb-2 text-2xl font-bold text-red-400">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app min-h-screen bg-gray-950 text-white">
      {/* Tab Navigation */}
      <nav className="sticky top-0 z-[500] border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-4 text-sm font-semibold transition-all ${
                viewMode === 'list'
                  ? 'border-b-2 border-yellow-400 text-yellow-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              📋 List View
            </button>
            <button
              onClick={() => setViewMode('explore')}
              className={`px-6 py-4 text-sm font-semibold transition-all ${
                viewMode === 'explore'
                  ? 'border-b-2 border-yellow-400 text-yellow-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              🚀 Explore
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        className={`min-h-screen ${
          viewMode === 'list' ? 'overflow-y-auto' : 'overflow-hidden'
        }`}
      >
        {viewMode === 'list' ? (
          <ListView planets={planets} onPlanetClick={handlePlanetClick} />
        ) : (
          <ExploreView
            orbitingPlanets={orbitingPlanets}
            onPlanetClick={handlePlanetClick}
          />
        )}
      </main>

      {/* Planet Detail Modal */}
      <PlanetModal
        planet={selectedPlanet}
        isOpen={selectedPlanet !== null}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default App;
