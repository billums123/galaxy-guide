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
 * Person interface for residents (from SWAPI people endpoint), may use for future features
 */
export interface Person {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  url: string;
}

/**
 * Film interface for films (from SWAPI films endpoint), may use for future features
 */
export interface Film {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  url: string;
}

