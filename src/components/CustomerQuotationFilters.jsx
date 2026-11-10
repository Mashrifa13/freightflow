
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export const CUSTOMER_QUOTATION_STATUSES = [
  'Draft',
  'Sent',
  'Accepted',
  'Rejected',
  'Expired',
];

function CustomerQuotationFilters({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  mode,
  onModeChange,
  onResetFilters,
}) {
  const inputClass =
    "w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-lg text-[#242A31] focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all";

  return (
    <div className="space-y-3">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74808C] pointer-events-none"
          />

          <input
            type="text"
            placeholder="Search quotation, enquiry, customer, POL/POD..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${inputClass} pl-10 pr-4 placeholder:text-[#9AA4AE]`}
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={inputClass}
          >
            <option value="">All Statuses</option>

            {CUSTOMER_QUOTATION_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Shipment Mode + Reset */}
        <div className="flex gap-2">
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value)}
            className={`${inputClass} min-w-0`}
          >
            <option value="">All Modes</option>
            <option value="Air">Air</option>
            <option value="Sea">Sea</option>
            <option value="Land">Land</option>
          </select>

          <button
            type="button"
            onClick={onResetFilters}
            title="Reset Filters"
            className="inline-flex items-center justify-center px-3 rounded-lg border border-[#D3DBE4] bg-white text-[#647E96] hover:text-[#354C63] hover:bg-[#EEF2F6] hover:border-[#647E96] transition-all cursor-pointer flex-shrink-0"
          >
            <RotateCcw size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default CustomerQuotationFilters;
