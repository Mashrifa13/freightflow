
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export const PRICING_STATUSES = [
  'Draft',
  'Approved',
  'Pending Approval',
  'Rejected',
  'Quoted',
];

function PricingFilters({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  mode,
  onModeChange,
  onResetFilters,
}) {
  const selectClass =
    'w-full px-3.5 py-2 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all text-[#424B55]';

  return (
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-4 transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74808C] pointer-events-none"
          />

          <input
            type="text"
            placeholder="Search Pricing ID, Enquiry No., Customer, Mode..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all placeholder:text-[#9AA4AE] text-[#242A31]"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={selectClass}
          >
            <option value="">All Statuses</option>

            {PRICING_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Mode Filter + Reset */}
        <div className="flex gap-2">
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value)}
            className={selectClass}
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
            className="inline-flex items-center justify-center px-3 py-2 border border-[#D3DBE4] text-[#647E96] hover:text-[#354C63] hover:bg-[#EDF2F7] rounded-xl transition-all cursor-pointer flex-shrink-0"
          >
            <RotateCcw size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default PricingFilters;
