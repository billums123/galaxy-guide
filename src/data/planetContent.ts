/**
 * Mock AI-generated content for planets
 * TODO: This will be replaced with OpenAI API calls
 */

import type { Planet } from '../types/planet';

export interface PlanetContent {
  tagline: string;
  travelGuide: string;
  emoji: string;
}

/**
 * Mock travel content templates
 * These are randomly assigned to planets until OpenAI integration
 */
const MOCK_CONTENT_TEMPLATES: PlanetContent[] = [
  {
    emoji: '🌍',
    tagline: 'An Epic Galactic Destination Awaits',
    travelGuide:
      "Discover the wonders of this incredible planet! From breathtaking landscapes to unique cultures, this destination offers unforgettable experiences. Whether you're seeking adventure, relaxation, or cultural immersion, you'll find it all here. Pack your bags and prepare for a journey across the stars!",
  },
  {
    emoji: '🪐',
    tagline: 'Where Adventure Meets the Unknown',
    travelGuide:
      "Explore uncharted territories and experience the extraordinary! This planet boasts stunning natural wonders, fascinating local traditions, and endless opportunities for discovery. Perfect for travelers seeking authentic galactic experiences. Don't miss the chance to create memories that will last a lifetime in this remarkable corner of the universe.",
  },
];

/**
 * Get random content for a planet
 * TODO: Replace with OpenAI API call
 */
export function getPlanetContent(planet?: Planet): PlanetContent {
  // Pick a random template for now until AI integration (non-deterministic)
  if (!planet) {
    const templateIndex = Math.floor(
      Math.random() * MOCK_CONTENT_TEMPLATES.length
    );
    return MOCK_CONTENT_TEMPLATES[templateIndex];
  }
  return MOCK_CONTENT_TEMPLATES[0];
}
