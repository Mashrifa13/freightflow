
import React, { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, BarChart2, ArrowRight } from 'lucide-react';
import RateComparisonFilters from '../components/RateComparisonFilters';
import RateComparisonTable from '../components/RateComparisonTable';

function RateComparisonList({
  comparisons = [],
  onCreateComparison,
  onViewComparison,
  onEditComparison,
  onNavigateToPricing,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatus('');
    setCurrentPage(1);
  };

  const filteredComparisons = useMemo(() => {
    return comparisons.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      const compId = (item.comparison_id || item.id || '').toLowerCase();
      const enquiryNo = (item.enquiry_no || item.enquiry_id || '').toLowerCase();
      const rfqNo = (item.rfq_no || '').toLowerCase();
      const customer = (item.customer_name || '').toLowerCase();
      const selectedAgent = (item.selected_agent_name || '').toLowerCase();

      const matchesSearch =
        !q ||
        compId.includes(q) ||
        enquiryNo.includes(q) ||
        rfqNo.includes(q) ||
        customer.includes(q) ||
        selectedAgent.includes(q);

      const matchesStatus = !status || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [comparisons, searchTerm, status]);

  const totalCount = filteredComparisons.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;

  const paginatedComparisons = filteredComparisons.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#242A31] tracking-tight flex items-center gap-2">
            <BarChart2 className="text-[#354C63]" size={24} />
            Rate Comparison Management
          </h2>

          <p className="text-xs text-[#74808C] mt-1">
            Compare received agent quotations side-by-side to determine lowest cost, transit times, and select winning partners. Rate comparison is optional — you can proceed directly to Pricing at any time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {onNavigateToPricing && (
            <button
              type="button"
              onClick={onNavigateToPricing}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white border border-[#D3DBE4] text-[#354C63] hover:bg-[#F1F4F7] text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
              title="Proceed directly to Pricing without comparison"
            >
              <span>Go to Pricing</span>
              <ArrowRight size={15} />
            </button>
          )}

          <button
            type="button"
            onClick={onCreateComparison}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#354C63] hover:bg-[#293D52] active:bg-[#243649] text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Comparison</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <RateComparisonFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Comparisons Table */}
      <RateComparisonTable
        comparisons={paginatedComparisons}
        onViewComparison={onViewComparison}
        onEditComparison={onEditComparison}
        onCreateComparison={onCreateComparison}
      />

      {/* Pagination */}
      <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#74808C]">
        <div>
          {totalCount === 0 ? (
            <span>Showing 0 of 0 rate comparisons</span>
          ) : (
            <span>
              Showing{' '}
              <span className="font-semibold text-[#354C63]">
                {startIndex + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-[#354C63]">
                {Math.min(startIndex + pageSize, totalCount)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-[#354C63]">
                {totalCount}
              </span>{' '}
              rate comparisons
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1 || totalCount === 0}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-[#D3DBE4] text-[#596673] hover:bg-[#EDF2F7] hover:text-[#354C63] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-3 py-1 font-medium text-[#354C63] bg-[#EDF2F7] border border-[#D3DBE4] rounded-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages || totalCount === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-[#D3DBE4] text-[#596673] hover:bg-[#EDF2F7] hover:text-[#354C63] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RateComparisonList;
