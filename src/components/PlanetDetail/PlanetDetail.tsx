import { useState } from 'react';
import type { Planet, Person, Film } from '../../types/planet';
import { useSWAPIResources } from '../../hooks/useSWAPIResources';

interface PlanetDetailProps {
  planet: Planet;
}

/**
 * PlanetDetail component - displays detailed information about a planet
 * Shows population, diameter, orbital period, surface water, residents, and films
 */
export function PlanetDetail({ planet }: PlanetDetailProps) {
  const [showResidents, setShowResidents] = useState(false);
  const [showFilms, setShowFilms] = useState(false);

  // Fetch residents and films on demand
  const residents = useSWAPIResources<Person>(planet.residents, showResidents);
  const films = useSWAPIResources<Film>(planet.films, showFilms);
  const formatNumber = (value: string): string => {
    if (value === 'unknown') return 'Unknown';
    const num = parseInt(value);
    if (isNaN(num)) return value;
    return num.toLocaleString();
  };

  const formatDiameter = (value: string): string => {
    if (value === 'unknown') return 'Unknown';
    return `${formatNumber(value)} km`;
  };

  const formatDays = (value: string): string => {
    if (value === 'unknown') return 'Unknown';
    return `${value} days`;
  };

  const formatPercent = (value: string): string => {
    if (value === 'unknown') return 'Unknown';
    return `${value}%`;
  };

  const detailItems = [
    { label: 'Population', value: formatNumber(planet.population) },
    { label: 'Diameter', value: formatDiameter(planet.diameter) },
    { label: 'Rotation Period', value: formatDays(planet.rotation_period) },
    { label: 'Orbital Period', value: formatDays(planet.orbital_period) },
    { label: 'Surface Water', value: formatPercent(planet.surface_water) },
    { label: 'Gravity', value: planet.gravity },
    { label: 'Terrain', value: planet.terrain },
    { label: 'Climate', value: planet.climate },
  ];

  return (
    <div className="pt-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-200">
        Planet Details
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {detailItems.map(item => (
          <div
            key={item.label}
            className="rounded-md bg-gray-800/50 p-3 transition-colors hover:bg-gray-800"
          >
            <div className="text-xs font-medium text-gray-400">
              {item.label}
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-100">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Residents Section */}
      {planet.residents.length > 0 && (
        <div className="mt-4 pt-3">
          <button
            onClick={() => setShowResidents(!showResidents)}
            className="flex w-full items-center justify-between rounded-md bg-gray-800/50 p-3 transition-colors hover:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-200">
                Residents
              </span>
              <span className="rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs text-yellow-400">
                {planet.residents.length}
              </span>
            </div>
            <span className="text-gray-400">{showResidents ? '▼' : '▶'}</span>
          </button>

          {showResidents && (
            <div className="mt-2 rounded-md bg-gray-800/30 p-3">
              {residents.loading && (
                <div className="text-sm text-gray-400">
                  Loading residents...
                </div>
              )}
              {residents.error && (
                <div className="text-sm text-red-400">{residents.error}</div>
              )}
              {residents.data.length > 0 && (
                <ul className="space-y-2">
                  {residents.data.map(resident => (
                    <li
                      key={resident.url}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <span className="text-yellow-400">•</span>
                      {resident.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Films Section */}
      {planet.films.length > 0 && (
        <div className="mt-2 pt-3">
          <button
            onClick={() => setShowFilms(!showFilms)}
            className="flex w-full items-center justify-between rounded-md bg-gray-800/50 p-3 transition-colors hover:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-200">
                Featured in Films
              </span>
              <span className="rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs text-yellow-400">
                {planet.films.length}
              </span>
            </div>
            <span className="text-gray-400">{showFilms ? '▼' : '▶'}</span>
          </button>

          {showFilms && (
            <div className="mt-2 rounded-md bg-gray-800/30 p-3">
              {films.loading && (
                <div className="text-sm text-gray-400">Loading films...</div>
              )}
              {films.error && (
                <div className="text-sm text-red-400">{films.error}</div>
              )}
              {films.data.length > 0 && (
                <ul className="space-y-2">
                  {films.data
                    .sort((a, b) => a.episode_id - b.episode_id)
                    .map(film => (
                      <li key={film.url} className="text-sm text-gray-300">
                        <span className="font-semibold text-yellow-400">
                          Episode {film.episode_id}:
                        </span>{' '}
                        {film.title}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
