import { useState, useMemo } from 'react';
import './App.css';
import { usePlanets } from './hooks/usePlanets';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateOrbits } from './utils/calculateOrbits';
import { filterPlanets, extractUniqueClimates } from './utils/filterPlanets';
import type { Planet } from './types/planet';
import { ListView } from './components/ListView/ListView';
import { ExploreView } from './components/ExploreView/ExploreView';
import { PlanetModal } from './components/PlanetModal/PlanetModal';
import { FilterBar } from './components/FilterBar/FilterBar';

type ViewMode = 'list' | 'explore';

function App() {
  const { planets, loading, error } = usePlanets();
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    'swapi-viewMode',
    'list'
  );
  const [searchQuery, setSearchQuery] = useLocalStorage<string>(
    'swapi-searchQuery',
    ''
  );
  const [selectedClimates, setSelectedClimates] = useLocalStorage<string[]>(
    'swapi-selectedClimates',
    []
  );

  // Extract available climates
  const availableClimates = useMemo(
    () => extractUniqueClimates(planets),
    [planets]
  );

  // Calculate orbits for ALL planets (once, never changes positions)
  const allOrbitingPlanets = useMemo(() => calculateOrbits(planets), [planets]);

  // Filter planets based on search and climate
  const filteredPlanets = useMemo(
    () => filterPlanets(planets, searchQuery, selectedClimates),
    [planets, searchQuery, selectedClimates]
  );

  // Filter the orbiting planets to match the filtered planets
  const orbitingPlanets = useMemo(
    () =>
      allOrbitingPlanets.filter(op =>
        // Treating the url as a unique identifier here to match the filtered planets
        filteredPlanets.some(fp => fp.url === op.planet.url)
      ),
    [allOrbitingPlanets, filteredPlanets]
  );

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
    <div
      className={`app bg-gray-950 text-white ${
        viewMode === 'explore' ? 'h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      {/* Tab Navigation */}
      <nav className="sticky top-0 z-[500] border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-1 text-base font-semibold transition-all ${
                viewMode === 'list'
                  ? 'border-b-2 border-yellow-400 text-yellow-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              📋 List View
            </button>
            <button
              onClick={() => setViewMode('explore')}
              className={`px-4 py-1 text-base font-semibold transition-all ${
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
        className={`${
          viewMode === 'list'
            ? 'min-h-screen overflow-y-auto'
            : 'h-[calc(100vh-49px)] overflow-hidden'
        }`}
      >
        {viewMode === 'list' ? (
          <ListView
            planets={filteredPlanets}
            onPlanetClick={handlePlanetClick}
          />
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

      {/* Floating Search Button */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedClimates={selectedClimates}
        onClimateChange={setSelectedClimates}
        availableClimates={availableClimates}
      />
    </div>
  );
}

export default App;
