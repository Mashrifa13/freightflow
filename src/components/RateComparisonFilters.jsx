
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export const COMPARISON_STATUSES = [
  'In Progress',
  'Agent Selected',
  'Finalized',
  'Archived',
];

function RateComparisonFilters({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  onResetFilters,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-4 transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74808C] pointer-events-none"
          />

          <input
            type="text"
            placeholder="Search Comparison ID, RFQ No., Customer, Selected Agent..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl text-[#242A31] placeholder:text-[#74808C] focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all"
          />
        </div>

        {/* Status Filter + Reset */}
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl text-[#242A31] focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all cursor-pointer"
          >
            <option value="">All Statuses</option>

            {COMPARISON_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onResetFilters}
            title="Reset Filters"
            className="inline-flex items-center justify-center px-3 py-2 border border-[#D3DBE4] text-[#74808C] hover:text-[#354C63] hover:bg-[#F1F4F7] rounded-xl transition-all cursor-pointer flex-shrink-0"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RateComparisonFilters;
