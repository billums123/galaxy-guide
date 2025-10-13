import { useState } from 'react';
import './App.css';
import { usePlanets } from './hooks/usePlanets';
import type { Planet } from './types/planet';
import { ListView } from './components/ListView/ListView';
import { PlanetModal } from './components/PlanetModal/PlanetModal';

function App() {
  const { planets, loading, error } = usePlanets();
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

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
      {/* Main Content */}
      <main className="min-h-screen overflow-y-auto">
        <ListView planets={planets} onPlanetClick={handlePlanetClick} />
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
