import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { countriesList } from '../data/countries';

/**
 * SearchableCountrySelect component
 * Allows typing to search/filter countries as well as picking from the full dropdown.
 * Also supports keyboard navigation and click outside to close.
 */
function SearchableCountrySelect({
  id = 'country-select',
  value = '',
  onChange,
  placeholder = 'Select Country',
  hasError = false,
  isFilterMode = false, // If true, includes an "All Countries" option
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredCountries = countriesList.filter((country) =>
    country.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSelect = (country) => {
    onChange(country);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <div
        id={id}
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2 text-sm bg-gray-50 border rounded-xl cursor-pointer transition-all ${hasError
            ? 'border-red-400 focus:ring-2 focus:ring-red-100'
            : isOpen
              ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
              : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          }`}
      >
        <span className={`truncate ${value ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
          {value || (isFilterMode ? 'All Countries' : placeholder)}
        </span>

        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              title="Clear selection"
            >
              <X size={13} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Search Box inside Dropdown */}
          <div className="p-2 border-b border-gray-100 bg-gray-50/70">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-2.5 text-gray-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search country..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                onClick={(e) => e.stopPropagation()}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto py-1">
            {isFilterMode && (
              <div
                onClick={() => handleSelect('')}
                className={`flex items-center justify-between px-3.5 py-2 text-xs font-medium cursor-pointer transition-colors ${!value ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span>All Countries</span>
                {!value && <Check size={14} className="text-blue-600" />}
              </div>
            )}

            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = value === country;
                return (
                  <div
                    key={country}
                    onClick={() => handleSelect(country)}
                    className={`flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer transition-colors ${isSelected
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <span>{country}</span>
                    {isSelected && <Check size={14} className="text-blue-600 flex-shrink-0" />}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-gray-400">
                No countries matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableCountrySelect;

