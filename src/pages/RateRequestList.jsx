
import React, { useState, useMemo } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  BarChart2,
} from 'lucide-react';

import RateRequestFilters from '../components/RateRequestFilters';
import RateRequestTable from '../components/RateRequestTable';
import RateComparisonList from './RateComparisonList';

function RateRequestList({
  rateRequests = [],
  onCreateRateRequest,
  onViewRateRequest,
  onEditRateRequest,
  // Rate Comparison props
  comparisons = [],
  onCreateComparison,
  onViewComparison,
  onEditComparison,
  activeTab = 'rfq-list',
  onTabChange,
  onNavigateToPricing,
}) {
  const [internalTab, setInternalTab] = useState('rfq-list');
  const currentTab = onTabChange ? activeTab : internalTab;
  const handleTabClick = (tabKey) => {
    if (onTabChange) {
      onTabChange(tabKey);
    } else {
      setInternalTab(tabKey);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [mode, setMode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatus('');
    setMode('');
    setCurrentPage(1);
  };

  const filteredRequests = useMemo(() => {
    return rateRequests.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      const rfqNo = (item.rfq_no || item.id || '').toLowerCase();
      const enqNo = (item.enquiry_no || item.enquiry_id || '').toLowerCase();
      const customer = (item.customer_name || item.customer || '').toLowerCase();
      const pol = (item.pol || '').toLowerCase();
      const pod = (item.pod || '').toLowerCase();

      const matchesSearch =
        !q ||
        rfqNo.includes(q) ||
        enqNo.includes(q) ||
        customer.includes(q) ||
        pol.includes(q) ||
        pod.includes(q);

      const matchesStatus = !status || item.status === status;
      const matchesMode = !mode || (item.shipment_mode || item.mode) === mode;

      return matchesSearch && matchesStatus && matchesMode;
    });
  }, [rateRequests, searchTerm, status, mode]);

  const totalCount = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;

  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="space-y-5">
      {/* Module Tabs Header */}
      <div className="flex items-center gap-2 border-b border-[#E2E7ED]">
        <button
          type="button"
          onClick={() => handleTabClick('rfq-list')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            currentTab === 'rfq-list'
              ? 'border-[#354C63] text-[#354C63]'
              : 'border-transparent text-[#74808C] hover:text-[#242A31] hover:border-[#D3DBE4]'
          }`}
        >
          <ClipboardList size={17} />
          <span>RFQ List</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              currentTab === 'rfq-list'
                ? 'bg-[#EAF0F5] text-[#354C63]'
                : 'bg-[#F1F4F7] text-[#74808C]'
            }`}
          >
            {rateRequests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('rate-comparison')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            currentTab === 'rate-comparison'
              ? 'border-[#354C63] text-[#354C63]'
              : 'border-transparent text-[#74808C] hover:text-[#242A31] hover:border-[#D3DBE4]'
          }`}
        >
          <BarChart2 size={17} />
          <span>Rate Comparison</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              currentTab === 'rate-comparison'
                ? 'bg-[#EAF0F5] text-[#354C63]'
                : 'bg-[#F1F4F7] text-[#74808C]'
            }`}
          >
            {comparisons.length}
          </span>
        </button>
      </div>

      {/* Tab 1: RFQ List */}
      {currentTab === 'rfq-list' && (
        <div className="space-y-5">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#242A31] tracking-tight flex items-center gap-2">
                <ClipboardList className="text-[#354C63]" size={24} />
                Rate Request Management (RFQ)
              </h2>

              <p className="text-xs text-[#74808C] mt-0.5">
                Broadcast freight rate inquiries to overseas network agents and manage responses.
              </p>
            </div>

            <button
              type="button"
              onClick={onCreateRateRequest}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#354C63] hover:bg-[#293D52] active:bg-[#24364A] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus size={16} />
              <span>Create Rate Request</span>
            </button>
          </div>

          {/* Filters Section */}
          <RateRequestFilters
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
            mode={mode}
            onModeChange={(val) => {
              setMode(val);
              setCurrentPage(1);
            }}
            onResetFilters={handleResetFilters}
          />

          {/* Table Section */}
          <RateRequestTable
            rateRequests={paginatedRequests}
            onViewRateRequest={onViewRateRequest}
            onEditRateRequest={onEditRateRequest}
            onCreateRateRequest={onCreateRateRequest}
          />

          {/* Pagination */}
          <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#74808C]">
            <div>
              {totalCount === 0 ? (
                <span>Showing 0 of 0 rate requests</span>
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
                  rate requests
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                type="button"
                disabled={currentPage <= 1 || totalCount === 0}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[#D3DBE4] text-[#596673] hover:bg-[#EDF2F7] hover:text-[#354C63] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Current Page */}
              <span className="px-3 py-1 font-semibold text-[#354C63] bg-[#EDF2F7] border border-[#D3DBE4] rounded-lg">
                Page {currentPage} of {totalPages}
              </span>

              {/* Next */}
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
      )}

      {/* Tab 2: Rate Comparison */}
      {currentTab === 'rate-comparison' && (
        <RateComparisonList
          comparisons={comparisons}
          onCreateComparison={onCreateComparison}
          onViewComparison={onViewComparison}
          onEditComparison={onEditComparison}
          onNavigateToPricing={onNavigateToPricing}
        />
      )}
    </div>
  );
}

export default RateRequestList;
