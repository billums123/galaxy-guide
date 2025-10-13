import { useMemo, useState, useEffect, useRef } from 'react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedClimates: string[];
  onClimateChange: (climates: string[]) => void;
  availableClimates: string[];
}

/**
 * FilterBar component - Floating search button with overlay
 */
export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedClimates,
  onClimateChange,
  availableClimates,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const sortedClimates = useMemo(
    () => [...availableClimates].sort(),
    [availableClimates]
  );

  const handleClimateToggle = (climate: string) => {
    if (selectedClimates.includes(climate)) {
      onClimateChange(selectedClimates.filter((c) => c !== climate));
    } else {
      onClimateChange([...selectedClimates, climate]);
    }
  };

  const clearFilters = () => {
    onSearchChange('');
    onClimateChange([]);
  };

  const hasActiveFilters = searchQuery.length > 0 || selectedClimates.length > 0;

  // Keyboard shortcut (Cmd+K / Ctrl+K / /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const isTyping = ['INPUT', 'TEXTAREA'].includes(
        (e.target as HTMLElement)?.tagName
      );

      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // Open with / (only if not already typing)
      if (e.key === '/' && !isTyping && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus search input when overlay opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Large Floating Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`group fixed top-5 right-5 z-[95] flex h-12 w-12 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110 ${
          hasActiveFilters
            ? 'bg-yellow-400 text-gray-900'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
        title="Search & Filter (⌘K or /)"
      >
        <span className="text-2xl">🔍</span>
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {selectedClimates.length + (searchQuery ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative z-10 mx-4 w-full max-w-2xl rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-yellow-400">
                Search & Filter Planets
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 transition-colors hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  placeholder="Type to search planets..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/80 px-4 py-3 text-white placeholder-gray-500 transition-all outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Climate Filters */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="py-1 text-sm font-semibold text-gray-400">
                  Filter by Climate
                </span>
                {selectedClimates.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sortedClimates.map(climate => (
                  <button
                    key={climate}
                    onClick={() => handleClimateToggle(climate)}
                    className={`rounded-full px-2 py-1 text-sm font-medium transition-all ${
                      selectedClimates.includes(climate)
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {climate}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyboard Hint */}
            <div className="mt-4 pt-4 text-center text-xs text-gray-500">
              <kbd className="rounded bg-gray-800 px-2 py-1">⌘K</kbd> or{' '}
              <kbd className="rounded bg-gray-800 px-2 py-1">/</kbd> to open •{' '}
              <kbd className="rounded bg-gray-800 px-2 py-1">ESC</kbd> to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}

