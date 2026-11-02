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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Search Field */}
        <div className="relative">
          <label htmlFor="enquiry-search" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Search
          </label>
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input
              id="enquiry-search"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Enquiry No, customer, POL, POD..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Transport Mode Filter */}
        <div>
          <label htmlFor="mode-filter" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Transport Mode
          </label>
          <select
            id="mode-filter"
            value={mode}
            onChange={(e) => onModeChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
          >
            <option value="">All Modes</option>
            <option value="Sea">Sea Freight (FCL / LCL)</option>
            <option value="Air">Air Freight</option>
            <option value="Road">Road Transport</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
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

      {/* Filter Reset if filters active */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-medium text-gray-600">
            <Filter size={13} className="text-blue-600" />
            Filtered view active
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
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

