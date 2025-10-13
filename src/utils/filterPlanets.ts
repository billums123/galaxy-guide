import type { Planet } from '../types/planet';

/**
 * Extract unique climates from all planets
 */
export function extractUniqueClimates(planets: Planet[]): string[] {
  const climateSet = new Set<string>();

  planets.forEach((planet) => {
    // Split comma-separated climates and trim whitespace
    const climates = planet.climate.split(',').map(c => c.trim());

    climates.forEach(climate => climateSet.add(climate));
  });

  return Array.from(climateSet);
}

/**
 * Fuzzy search - checks if all characters in query appear in target in order
 */
function fuzzyMatch(target: string, query: string): boolean {
  const targetLower = target.toLowerCase();
  const queryLower = query.toLowerCase();

  let queryIndex = 0;
  for (let i = 0; i < targetLower.length && queryIndex < queryLower.length; i++) {
    if (targetLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === queryLower.length;
}

/**
 * Filter planets by search query and selected climates
 */
export function filterPlanets(
  planets: Planet[],
  searchQuery: string,
  selectedClimates: string[]
): Planet[] {
  return planets.filter((planet) => {
    // Search filter (fuzzy match on name)
    if (searchQuery) {
      if (!fuzzyMatch(planet.name, searchQuery)) {
        return false;
      }
    }

    // Climate filter
    if (selectedClimates.length > 0) {
      const planetClimates = planet.climate.split(',').map(c => c.trim());

      // Check if planet has at least one of the selected climates
      const hasMatchingClimate = selectedClimates.some((selected) =>
        planetClimates.includes(selected)
      );

      if (!hasMatchingClimate) {
        return false;
      }
    }

    return true;
  });
}

