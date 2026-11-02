import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export const QUOTATION_STATUSES = [
  'Pending Review',
  'Accepted',
  'Rejected',
  'Expired',
];

function AgentQuotationFilters({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  currency,
  onCurrencyChange,
  onResetFilters,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search Quote No., RFQ No., Agent, Route..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-700"
          >
            <option value="">All Statuses</option>
            {QUOTATION_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Filter + Reset */}
        <div className="flex gap-2">
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-gray-700"
          >
            <option value="">All Currencies</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="INR">INR (₹)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED (AED)</option>
          </select>

          <button
            type="button"
            onClick={onResetFilters}
            title="Reset Filters"
            className="inline-flex items-center justify-center px-3 py-2 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all cursor-pointer flex-shrink-0"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgentQuotationFilters;

