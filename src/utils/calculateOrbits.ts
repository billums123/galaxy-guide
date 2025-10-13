import type { Planet } from '../types/planet';
import { getClimateColor } from './getClimateColor';

export interface OrbitPlanet {
  planet: Planet;
  orbitRadius: number;
  startAngle: number;
  size: number;
  animationDuration: number;
  colorClass: string;
}

/**
 * Calculate orbital positions for planets in the orrery view
 * Randomly assigns planets to orbits with varied properties for a natural appearance
 */
export function calculateOrbits(planets: Planet[]): OrbitPlanet[] {
  if (planets.length === 0) return [];

  // Define base orbit rings (in pixels from center)
  const baseOrbitRings = [120, 180, 240, 300, 360, 420];

  // Create a shuffled array of orbit indices for better distribution
  const shuffledOrbits = planets
    .map((_, index) => baseOrbitRings[index % baseOrbitRings.length])
    .sort(() => Math.random() - 0.5);

  return planets.map((planet, index) => {
    // Get orbit from shuffled list and add some variance (-20 to +20px)
    const baseOrbit = shuffledOrbits[index];
    const orbitVariance = (Math.random() - 0.5) * 40;
    const orbitRadius = baseOrbit + orbitVariance;

    // Random starting angle (0-360 degrees)
    const startAngle = Math.random() * 360;

    // Vary planet sizes slightly
    const size = 40 + Math.random() * 20;

    // Different rotation speeds for different orbits (closer = faster)
    // Add some randomness to speed for more natural feel
    const baseSpeed = 20 + orbitRadius / 20;
    const speedVariance = (Math.random() - 0.5) * 5;
    const animationDuration = baseSpeed + speedVariance;

    // Get color based on climate
    const colorClass = getClimateColor(planet.climate);

    return {
      planet,
      orbitRadius,
      startAngle,
      size,
      animationDuration,
      colorClass,
    };
  });
}

