import { useEffect } from 'react';
import type { Planet } from '../../types/planet';
import { usePlanetContent } from '../../hooks/usePlanetContent';
import { PlanetDetail } from '../PlanetDetail/PlanetDetail';
import { getPlanetEmoji } from '../../utils/getPlanetEmoji';

interface PlanetModalProps {
  planet: Planet | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PlanetModal component - Full details modal for a planet
 * Displays SWAPI data and AI-generated travel guide
 */
export function PlanetModal({ planet, isOpen, onClose }: PlanetModalProps) {
  const { content, loading, regenerate } = usePlanetContent(planet);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !planet) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal Content */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-gray-700 hover:text-white"
          aria-label="Close modal"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Body */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-6 flex items-start gap-4 pb-3">
            <span className="text-6xl" role="img" aria-label="planet emoji">
              {content?.emoji || getPlanetEmoji(planet)}
            </span>
            <div className="flex-1">
              <h2
                id="modal-title"
                className="mb-2 text-4xl font-bold text-yellow-400"
              >
                {planet.name}
              </h2>
              <p className="text-sm text-gray-400 italic">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-pulse">✨</span>
                    Generating travel guide...
                  </span>
                ) : (
                  content?.tagline || 'Explore this galactic destination'
                )}
              </p>
            </div>
          </div>

          {/* AI Travel Guide */}
          {!loading && content && (
            <div className="mb-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">📖</span>
                <h3 className="font-semibold text-yellow-400">
                  Traveler's Guide
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-300">
                {content.travelGuide}
              </p>
            </div>
          )}

          {loading && (
            <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/30 p-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"></div>
                <p className="text-sm text-gray-400">
                  Consulting the galactic archives...
                </p>
              </div>
            </div>
          )}

          {/* Planet Details (reusing existing component) */}
          <PlanetDetail planet={planet} />

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={regenerate}
              disabled={loading}
              className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-gray-900 transition-all hover:bg-yellow-400 disabled:opacity-50"
              aria-label="Get a new AI travel guide"
            >
              {loading ? 'Generating…' : 'Get new guide'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-6 py-3 font-semibold text-gray-300 transition-all hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

