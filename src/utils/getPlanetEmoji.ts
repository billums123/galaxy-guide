import { getClimateEmoji } from './getClimateEmoji';
import type { Planet } from '../types/planet';
import type { PlanetContent } from '../hooks/usePlanetContent';

/**
 * Get the emoji for a planet, preferring cached AI-generated emoji if available
 * Falls back to climate-based emoji if no cached content exists
 */
export function getPlanetEmoji(planet: Planet): string {
  try {
    const cacheKey = `planet-content-${planet.url}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const content: PlanetContent = JSON.parse(cached);
      if (content.emoji) {
        return content.emoji;
      }
    }
  } catch {
    // Fall through to default emoji
  }
  return getClimateEmoji(planet.climate);
}

