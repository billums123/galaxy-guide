import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch multiple SWAPI resources from an array of URLs
 * Handles loading states and errors gracefully
 * @param urls - Array of SWAPI resource URLs to fetch
 * @param enabled - Whether to fetch the data (default: true)
 */
export function useSWAPIResources<T = unknown>(
  urls: string[],
  enabled: boolean = true
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    // Don't fetch if disabled or no URLs
    if (!enabled || urls.length === 0) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    let isCancelled = false;

    const fetchResources = async () => {
      setState({ data: [], loading: true, error: null });

      try {
        // Fetch all URLs in parallel
        const responses = await Promise.all(
          urls.map(url => fetch(url).then(res => {
            if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
            return res.json();
          }))
        );

        if (!isCancelled) {
          setState({ data: responses, loading: false, error: null });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch resources',
          });
        }
      }
    };

    fetchResources();

    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isCancelled = true;
    };
  }, [urls.join(','), enabled]); // Join URLs to create stable dependency (since array is a reference type)

  return state;
}

