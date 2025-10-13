/**
 * Get a simple emoji based on planet climate
 */
export const getClimateEmoji = (climate: string): string => {
  const climateLower = climate.toLowerCase();
  if (climateLower.includes('frozen') || climateLower.includes('frigid'))
    return '❄️';
  if (climateLower.includes('hot') || climateLower.includes('arid'))
    return '🔥';
  if (climateLower.includes('tropical')) return '🌴';
  if (climateLower.includes('temperate')) return '🌍';
  if (climateLower.includes('murky') || climateLower.includes('polluted'))
    return '🌫️';
  if (climateLower.includes('artificial')) return '🏙️';
  if (climateLower.includes('gas')) return '💨';
  return '🪐';
};
