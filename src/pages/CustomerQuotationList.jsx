import React, { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, FilePlus } from 'lucide-react';
import CustomerQuotationFilters from '../components/CustomerQuotationFilters';
import CustomerQuotationTable from '../components/CustomerQuotationTable';

function CustomerQuotationList({
  quotations = [],
  onCreateQuotation,
  onViewQuotation,
  onEditQuotation,
  onDeleteQuotation,
}) {
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

  const filteredQuotations = useMemo(() => {
    return quotations.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      const quoteNo = (item.quotation_no || item.id || '').toLowerCase();
      const enqNo = (item.enquiry_no || item.enquiry_id || '').toLowerCase();
      const customer = (item.customer_name || item.customer || '').toLowerCase();
      const pol = (item.pol || '').toLowerCase();
      const pod = (item.pod || '').toLowerCase();
      const itemMode = item.shipment_mode || item.mode || '';

      const matchesSearch =
        !q ||
        quoteNo.includes(q) ||
        enqNo.includes(q) ||
        customer.includes(q) ||
        pol.includes(q) ||
        pod.includes(q);

      const matchesStatus = !status || item.status === status;
      const matchesMode = !mode || itemMode === mode;

      return matchesSearch && matchesStatus && matchesMode;
    });
  }, [quotations, searchTerm, status, mode]);

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
            <FilePlus className="text-blue-600" size={24} />
            Customer Quotation Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Create, issue, and manage professional client quotations with final selling rates and validity terms.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateQuotation}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Create Quotation</span>
        </button>
      </div>

      {/* Filters Section */}
      <CustomerQuotationFilters
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
      <CustomerQuotationTable
        quotations={paginatedQuotations}
        onViewQuotation={onViewQuotation}
        onEditQuotation={onEditQuotation}
        onDeleteQuotation={onDeleteQuotation}
        onCreateQuotation={onCreateQuotation}
      />

      {/* Pagination Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          {totalCount === 0 ? (
            <span>Showing 0 of 0 customer quotations</span>
          ) : (
            <span>
              Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(startIndex + pageSize, totalCount)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{totalCount}</span> customer quotations
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

export default CustomerQuotationList;

