import { useState, useEffect } from 'react';
import type { Planet } from '../types/planet';

export interface PlanetContent {
  tagline: string;
  travelGuide: string;
  emoji: string;
}

interface UsePlanetContentReturn {
  content: PlanetContent | null;
  loading: boolean;
  error: string | null;
  regenerate: () => Promise<void>;
}

// Fallback content for when API fails or is not configured
const FALLBACK_CONTENT: PlanetContent = {
  emoji: '🌍',
  tagline: 'An Epic Galactic Destination Awaits',
  travelGuide:
    "Discover the wonders of this incredible planet! From breathtaking landscapes to unique cultures, this destination offers unforgettable experiences. Whether you're seeking adventure, relaxation, or cultural immersion, you'll find it all here. Pack your bags and prepare for a journey across the stars!",
};

/**
 * Generate a cache key for a planet
 */
const getCacheKey = (planet: Planet): string => {
  return `planet-content-${planet.url}`;
};

/**
 * Get cached content from localStorage
 */
const getCachedContent = (planet: Planet): PlanetContent | null => {
  try {
    const cached = localStorage.getItem(getCacheKey(planet));
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Failed to read cached planet content:', error);
  }
  return null;
};

/**
 * Save content to localStorage cache
 */
const setCachedContent = (planet: Planet, content: PlanetContent): void => {
  try {
    localStorage.setItem(getCacheKey(planet), JSON.stringify(content));
  } catch (error) {
    console.warn('Failed to cache planet content:', error);
  }
};

/**
 * Generate AI content for a planet using Vercel serverless function
 * This keeps the OpenAI API key secure on the server side
 */
const generatePlanetContent = async (
  planet: Planet
): Promise<PlanetContent> => {
  try {
    // Call Vercel serverless function
    const response = await fetch('/api/generate-planet-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planet: {
          name: planet.name,
          climate: planet.climate,
          terrain: planet.terrain,
          population: planet.population,
          gravity: planet.gravity,
          diameter: planet.diameter,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const content: PlanetContent = await response.json();
    return content;
  } catch (error) {
    console.error('Failed to generate planet content:', error);
    // Return fallback on error
    return FALLBACK_CONTENT;
  }
};

/**
 * Custom hook to get planet content (with caching and AI generation)
 * @param planet - The planet to get content for
 */
export function usePlanetContent(
  planet: Planet | null
): UsePlanetContentReturn {
  const [content, setContent] = useState<PlanetContent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const regenerate = async (): Promise<void> => {
    if (!planet) return;
    setLoading(true);
    setError(null);
    try {
      const generated = await generatePlanetContent(planet);
      setContent(generated);
      setCachedContent(planet, generated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load planet content'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!planet) {
      setContent(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Check cache first
    const cached = getCachedContent(planet);
    if (cached) {
      setContent(cached);
      setLoading(false);
      setError(null);
      return;
    }

    // Generate new content
    let isCancelled = false;

    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const generated = await generatePlanetContent(planet);

        if (!isCancelled) {
          setContent(generated);
          setCachedContent(planet, generated);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load planet content'
          );
          setContent(FALLBACK_CONTENT);
          setLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      isCancelled = true;
    };
  }, [planet]); // Re-run when planet changes

  return { content, loading, error, regenerate };
}

