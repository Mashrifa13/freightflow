
import React from 'react';
import { Search, Filter, X } from 'lucide-react';

/**
 * EnquiryFilters component
 * Provides search and filter controls for the Enquiry List page.
 */
function EnquiryFilters({
  searchTerm,
  onSearchChange,
  mode,
  onModeChange,
  status,
  onStatusChange,
  onResetFilters,
}) {
  const hasActiveFilters = Boolean(searchTerm || mode || status);

  const inputClass =
    "w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl text-[#242A31] placeholder-[#929DA8] focus:bg-white focus:outline-none focus:border-[#647E96] focus:ring-2 focus:ring-[#647E96]/15 transition-all";

  const labelClass =
    "block text-xs font-semibold text-[#74808C] uppercase tracking-wider mb-1.5";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-4 md:p-5 transition-all">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">

        {/* Search Field */}
        <div className="relative">
          <label
            htmlFor="enquiry-search"
            className={labelClass}
          >
            Search
          </label>

          <div className="relative flex items-center">
            <Search
              size={16}
              className="absolute left-3 text-[#74808C] pointer-events-none"
            />

            <input
              id="enquiry-search"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Enquiry No, customer, POL, POD..."
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {/* Transport Mode Filter */}
        <div>
          <label
            htmlFor="mode-filter"
            className={labelClass}
          >
            Transport Mode
          </label>

          <select
            id="mode-filter"
            value={mode}
            onChange={(e) => onModeChange(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">All Modes</option>
            <option value="Sea">Sea Freight (FCL / LCL)</option>
            <option value="Air">Air Freight</option>
            <option value="Road">Road Transport</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label
            htmlFor="status-filter"
            className={labelClass}
          >
            Status
          </label>

          <select
            id="status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">All Statuses</option>
            <option value="Pricing">Pricing</option>
            <option value="Pending">Pending</option>
            <option value="Quoted">Quoted</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

      </div>

      {/* Filter Reset */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-[#E2E7ED] flex items-center justify-between text-xs">

          <span className="flex items-center gap-1.5 font-medium text-[#596673]">
            <Filter
              size={13}
              className="text-[#354C63]"
            />
            Filtered view active
          </span>

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-[#354C63] hover:text-[#35271F] font-semibold cursor-pointer transition-colors"
          >
            <X size={12} />
            Reset all filters
          </button>

        </div>
      )}

    </div>
  );
}

export default EnquiryFilters;
