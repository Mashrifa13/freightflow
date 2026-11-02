import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import SearchableCountrySelect from './SearchableCountrySelect';

/**
 * AgentFilters component
 * Provides search and filter controls for the Agent Management page.
 */
function AgentFilters({
  searchTerm,
  onSearchChange,
  agentType,
  onAgentTypeChange,
  country,
  onCountryChange,
  status,
  onStatusChange,
  onResetFilters,
}) {
  const hasActiveFilters = Boolean(searchTerm || agentType || country || status);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Search Field */}
        <div className="relative">
          <label htmlFor="agent-search" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Search
          </label>
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input
              id="agent-search"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by agent name or ID..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Agent Type Filter */}
        <div>
          <label htmlFor="agent-type-filter" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Agent Type
          </label>
          <select
            id="agent-type-filter"
            value={agentType}
            onChange={(e) => onAgentTypeChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="Origin Agent">Origin Agent</option>
            <option value="Destination Agent">Destination Agent</option>
            <option value="Customs Broker">Customs Broker</option>
            <option value="Transporter / Haulier">Transporter / Haulier</option>
            <option value="Warehouse Partner">Warehouse Partner</option>
            <option value="Co-Loader">Co-Loader</option>
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label htmlFor="agent-country-filter" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Country
          </label>
          <SearchableCountrySelect
            id="agent-country-filter"
            value={country}
            onChange={onCountryChange}
            isFilterMode={true}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="agent-status-filter" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            id="agent-status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
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

export default AgentFilters;

