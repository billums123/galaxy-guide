/**
 * Planet interface to match SWAPI API response structure
 */
export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

/**
 * SWAPI API response structure for planets endpoint
 */
export interface SWAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Planet[];
}

/**
 * View mode type for the app
 */
export type ViewMode = 'swipe' | 'browse';

/**
 * Extended planet data with match status
 */
export interface PlanetWithMatch extends Planet {
  isMatched?: boolean;
}

