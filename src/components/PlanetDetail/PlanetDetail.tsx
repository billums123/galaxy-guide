import type { Planet } from '../../types/planet';

interface PlanetDetailProps {
  planet: Planet;
}

/**
 * PlanetDetail component - displays detailed information about a planet
 * Shows population, diameter, orbital period, surface water, and resident count
 */
export function PlanetDetail({ planet }: PlanetDetailProps) {
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
    </div>
  );
}

