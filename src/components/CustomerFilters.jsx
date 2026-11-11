
import React from 'react';
import { Search, Filter, X, List, LayoutGrid } from 'lucide-react';
import SearchableCountrySelect from './SearchableCountrySelect';

function CustomerFilters({
  searchTerm,
  onSearchChange,
  customerType,
  onCustomerTypeChange,
  country,
  onCountryChange,
  status,
  onStatusChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
}) {
  const hasActiveFilters = Boolean(
    searchTerm || customerType || country || status
  );

  const labelClass =
    'block text-xs font-semibold text-[#596673] uppercase tracking-wider mb-1.5';

  const inputClass =
    'w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl text-[#242A31] placeholder-[#929DA8] focus:bg-white focus:outline-none focus:border-[#354C63] focus:ring-2 focus:ring-[#354C63]/10 transition-all';

  return (
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-4 md:p-5 transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">

        {/* Search Field */}
        <div>
          <label htmlFor="customer-search" className={labelClass}>
            Search
          </label>

          <div className="relative flex items-center">
            <Search
              size={16}
              className="absolute left-3 text-[#74808C] pointer-events-none"
            />

            <input
              id="customer-search"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or ID..."
              className={`${inputClass} pl-9 pr-3`}
            />
          </div>
        </div>



        {/* Country Filter */}
        <div>
          <label htmlFor="country-filter" className={labelClass}>
            Country
          </label>

          <SearchableCountrySelect
            id="country-filter"
            value={country}
            onChange={onCountryChange}
            isFilterMode={true}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className={labelClass}>
            Status
          </label>

          <select
            id="status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {/* View Toggle */}
        <div className="flex items-center gap-1 border border-[#D3DBE4] rounded-lg p-1 bg-transparent self-end ml-auto shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'table'
              ? 'bg-[#E2E7ED] text-[#242A31]'
              : 'bg-transparent text-[#424B55] hover:bg-[#F1F4F7]'
              }`}
          >
            <List size={16} />
            Table
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'grid'
              ? 'bg-[#E2E7ED] text-[#242A31]'
              : 'bg-transparent text-[#424B55] hover:bg-[#F1F4F7]'
              }`}
          >
            <LayoutGrid size={16} />
            Grid
          </button>
        </div>
      </div>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-[#E2E7ED] flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-[#596673]">
            <Filter size={13} className="text-[#647E96]" />
            Filtered view active
          </span>

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-[#354C63] hover:text-[#293D52] font-semibold cursor-pointer transition-colors"
          >
            <X size={12} />
            Reset all filters
          </button>
        </div>
      )}


    </div>
  );
}

export default CustomerFilters;
