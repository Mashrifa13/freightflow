
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { countriesList } from '../data/countries';

function SearchableCountrySelect({
  id = 'country-select',
  value = '',
  onChange,
  placeholder = 'Select Country',
  hasError = false,
  isFilterMode = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  // Filter countries
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
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (
            e.key === 'Enter' ||
            e.key === ' ' ||
            e.key === 'ArrowDown'
          ) {
            e.preventDefault();
            setIsOpen(true);
          }

          if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm bg-[#F7F9FB] border rounded-xl cursor-pointer transition-all ${hasError
            ? 'border-[#C45151] ring-2 ring-[#C45151]/10'
            : isOpen
              ? 'border-[#354C63] ring-2 ring-[#354C63]/10 bg-white'
              : 'border-[#D3DBE4] hover:border-[#AEBBC8] focus:outline-none focus:border-[#354C63] focus:ring-2 focus:ring-[#354C63]/10'
          }`}
      >
        <span
          className={`truncate ${value
              ? 'text-[#242A31] font-medium'
              : 'text-[#929DA8]'
            }`}
        >
          {value || (isFilterMode ? 'All Countries' : placeholder)}
        </span>

        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 text-[#929DA8] hover:text-[#354C63] rounded-full hover:bg-[#EAF0F5] transition-colors"
              title="Clear selection"
            >
              <X size={13} />
            </button>
          )}

          <ChevronDown
            size={16}
            className={`text-[#74808C] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#354C63]' : ''
              }`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-[#E2E7ED] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">

          {/* Search Box */}
          <div className="p-2 border-b border-[#E2E7ED] bg-[#F7F9FB]">
            <div className="relative flex items-center">
              <Search
                size={14}
                className="absolute left-2.5 text-[#74808C] pointer-events-none"
              />

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search country..."
                className="w-full pl-8 pr-8 py-2 text-xs bg-white border border-[#D3DBE4] rounded-lg text-[#242A31] placeholder-[#929DA8] focus:outline-none focus:border-[#354C63] focus:ring-1 focus:ring-[#354C63]/10"
                onClick={(e) => e.stopPropagation()}
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-[#929DA8] hover:text-[#354C63] p-0.5 transition-colors"
                  title="Clear search"
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
                className={`flex items-center justify-between px-3.5 py-2.5 text-xs cursor-pointer transition-colors ${!value
                    ? 'bg-[#EAF0F5] text-[#354C63] font-semibold'
                    : 'text-[#596673] hover:bg-[#F1F4F7]'
                  }`}
              >
                <span>All Countries</span>

                {!value && (
                  <Check size={14} className="text-[#354C63]" />
                )}
              </div>
            )}

            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = value === country;

                return (
                  <div
                    key={country}
                    onClick={() => handleSelect(country)}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs cursor-pointer transition-colors ${isSelected
                        ? 'bg-[#EAF0F5] text-[#354C63] font-semibold'
                        : 'text-[#596673] hover:bg-[#F1F4F7]'
                      }`}
                  >
                    <span>{country}</span>

                    {isSelected && (
                      <Check
                        size={14}
                        className="text-[#354C63] flex-shrink-0"
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-[#929DA8]">
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
