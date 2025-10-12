import { useState, useEffect } from 'react';
import type { Planet, SWAPIResponse } from '../types/planet';

interface UsePlanetsReturn {
  planets: Planet[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch all Star Wars planets from SWAPI
 * Handles pagination automatically to retrieve all planets
 */
export function usePlanets(): UsePlanetsReturn {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  useEffect(() => {
    const fetchAllPlanets = async () => {
      setLoading(true);
      setError(null);
      const allPlanets: Planet[] = [];

      try {
        let nextUrl: string | null = 'https://swapi.dev/api/planets/';

        // Fetch all pages sequentially
        while (nextUrl) {
          const response = await fetch(nextUrl);

          if (!response.ok) {
            throw new Error('Failed to fetch planets from SWAPI');
          }

          const data: SWAPIResponse = await response.json();
          allPlanets.push(...data.results);
          nextUrl = data.next;
        }

        setPlanets(allPlanets);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllPlanets();
  }, [refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { planets, loading, error, refetch };
}

