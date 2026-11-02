import React, { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, FileCheck } from 'lucide-react';
import AgentQuotationFilters from '../components/AgentQuotationFilters';
import AgentQuotationTable from '../components/AgentQuotationTable';

function AgentQuotationList({
  quotations = [],
  onCreateQuotation,
  onViewQuotation,
  onEditQuotation,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [currency, setCurrency] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatus('');
    setCurrency('');
    setCurrentPage(1);
  };

  const filteredQuotations = useMemo(() => {
    return quotations.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      const quoteNo = (item.quotation_no || item.id || '').toLowerCase();
      const rfqNo = (item.rfq_no || item.rfq_id || '').toLowerCase();
      const agentName = (item.agent_name || item.agent || '').toLowerCase();
      const pol = (item.pol || '').toLowerCase();
      const pod = (item.pod || '').toLowerCase();

      const matchesSearch =
        !q ||
        quoteNo.includes(q) ||
        rfqNo.includes(q) ||
        agentName.includes(q) ||
        pol.includes(q) ||
        pod.includes(q);

      const matchesStatus = !status || item.status === status;
      const matchesCurrency = !currency || item.currency === currency;

      return matchesSearch && matchesStatus && matchesCurrency;
    });
  }, [quotations, searchTerm, status, currency]);

  const totalCount = filteredQuotations.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedQuotations = filteredQuotations.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <FileCheck className="text-blue-600" size={24} />
            Agent Quotations
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Log and review freight rates, origin/destination charges, and validity from overseas agents.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateQuotation}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Agent Quotation</span>
        </button>
      </div>

      {/* Filters Section */}
      <AgentQuotationFilters
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
        currency={currency}
        onCurrencyChange={(val) => {
          setCurrency(val);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Quotation Table */}
      <AgentQuotationTable
        quotations={paginatedQuotations}
        onViewQuotation={onViewQuotation}
        onEditQuotation={onEditQuotation}
        onCreateQuotation={onCreateQuotation}
      />

      {/* Pagination Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          {totalCount === 0 ? (
            <span>Showing 0 of 0 quotations</span>
          ) : (
            <span>
              Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(startIndex + pageSize, totalCount)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{totalCount}</span> quotations
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1 || totalCount === 0}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-3 py-1 font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages || totalCount === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgentQuotationList;

