import type { Planet } from '../../types/planet';
import { PlanetDetail } from '../PlanetDetail/PlanetDetail';

interface PlanetCardProps {
  planet: Planet;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * PlanetCard component - displays a collapsible card for a Star Wars planet
 * Shows basic info when collapsed, full details when expanded
 */
export function PlanetCard({
  planet,
  isExpanded,
  onToggle,
}: PlanetCardProps) {
  return (
    <div
      className={`
        rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10
        ${isExpanded ? 'ring-2 ring-yellow-500/30' : ''}
      `}
    >
      {/* Card Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-6 text-left transition-colors"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${planet.name}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold text-yellow-400">
              {planet.name}
            </h2>
            <div className="flex flex-wrap gap-2 text-sm text-gray-400">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-300">
                {planet.climate}
              </span>
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-300">
                {planet.terrain}
              </span>
            </div>
          </div>
          <div
            className={`ml-4 transform text-gray-400 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            {/* Downward chevron for expand/collapse indicator */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="border-t border-gray-700 px-6 pb-6">
          <PlanetDetail planet={planet} />
        </div>
      </div>
    </div>
  );
}

