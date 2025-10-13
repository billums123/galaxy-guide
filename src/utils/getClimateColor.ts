/**
 * Maps climate types to color gradients for visual representation
 * Returns Tailwind gradient classes for planet styling
 */
export function getClimateColor(climate: string): string {
  const climateLower = climate.toLowerCase();

  // Check for specific climate keywords (order matters - most specific first)
  if (climateLower.includes('frozen') || climateLower.includes('frigid')) {
    return 'bg-gradient-to-br from-cyan-200 via-blue-300 to-blue-400'; // Icy blue
  }
  
  if (climateLower.includes('superheated')) {
    return 'bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400'; // Extreme heat
  }
  
  if (climateLower.includes('hot')) {
    return 'bg-gradient-to-br from-red-400 via-orange-400 to-red-500'; // Hot red/orange
  }
  
  if (climateLower.includes('arid') && !climateLower.includes('temperate')) {
    return 'bg-gradient-to-br from-yellow-700 via-amber-600 to-orange-700'; // Desert brown
  }
  
  if (climateLower.includes('tropical')) {
    return 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500'; // Lush tropical green
  }
  
  if (climateLower.includes('murky')) {
    return 'bg-gradient-to-br from-gray-600 via-slate-700 to-gray-800'; // Dark murky
  }
  
  if (climateLower.includes('polluted')) {
    return 'bg-gradient-to-br from-slate-500 via-gray-600 to-stone-700'; // Polluted gray-brown
  }
  
  if (climateLower.includes('artificial')) {
    return 'bg-gradient-to-br from-slate-400 via-blue-400 to-indigo-500'; // Metallic/artificial
  }
  
  if (climateLower.includes('temperate') || climateLower.includes('moist')) {
    return 'bg-gradient-to-br from-blue-400 via-green-400 to-blue-500'; // Earth-like blue/green
  }
  
  if (climateLower.includes('windy') || climateLower.includes('rocky')) {
    return 'bg-gradient-to-br from-stone-500 via-gray-500 to-slate-600'; // Rocky gray
  }
  
  // Default for unknown
  return 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700'; // Unknown gray
}

