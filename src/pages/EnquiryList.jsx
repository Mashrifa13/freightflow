
import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import EnquiryFilters from '../components/EnquiryFilters';
import EnquiryListPageTable from '../components/EnquiryListPageTable';
import EnquiryDetailsModal from '../components/EnquiryDetailsModal';
import { enquiriesData as initialEnquiriesData } from '../data/dashboardData';
import { loadFromLocalStorage } from '../utils/storage';

function EnquiryList({
  enquiries: externalEnquiries,
  setEnquiries: externalSetEnquiries,
  onCreateEnquiry,
  onEditEnquiry,
}) {
  // Enquiry state
  const [internalEnquiries, setInternalEnquiries] = useState(
    () => loadFromLocalStorage('ff_enquiries', initialEnquiriesData)
  );

  const enquiries =
    externalEnquiries !== undefined
      ? externalEnquiries
      : internalEnquiries;

  const setEnquiries = externalSetEnquiries || setInternalEnquiries;

  // Selected enquiry
  const [viewingEnquiry, setViewingEnquiry] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('');
  const [status, setStatus] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setMode('');
    setStatus('');
    setCurrentPage(1);
  };

  // Modal handlers
  const handleViewEnquiry = (enquiry) => setViewingEnquiry(enquiry);
  const handleCloseModal = () => setViewingEnquiry(null);

  // Delete enquiry
  const handleDeleteEnquiry = (enquiryToDelete) => {
    setEnquiries((prev) =>
      prev.filter(
        (e) =>
          (e.id || e.enquiry_no) !==
          (enquiryToDelete.id || enquiryToDelete.enquiry_no)
      )
    );
  };

  // Update enquiry status
  const handleStatusChange = (enquiryToUpdate, newStatus) => {
    setEnquiries((prev) =>
      prev.map((item) =>
        (item.id || item.enquiry_no) ===
          (enquiryToUpdate.id || enquiryToUpdate.enquiry_no)
          ? { ...item, status: newStatus }
          : item
      )
    );
  };

  // Apply filters
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const enqId = item.id || item.enquiry_no || '';
      const customer = item.customer || item.customer_name || '';
      const pol = item.pol || '';
      const pod = item.pod || '';

      const query = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !query ||
        enqId.toLowerCase().includes(query) ||
        customer.toLowerCase().includes(query) ||
        pol.toLowerCase().includes(query) ||
        pod.toLowerCase().includes(query);

      const itemMode = item.mode || item.shipment_mode || '';
      const matchesMode = !mode || itemMode === mode;
      const matchesStatus = !status || item.status === status;

      return matchesSearch && matchesMode && matchesStatus;
    });
  }, [enquiries, searchTerm, mode, status]);

  // Pagination calculations
  const totalCount = filteredEnquiries.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;

  const paginatedEnquiries = filteredEnquiries.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="space-y-5">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#242A31] tracking-tight flex items-center gap-2">
            <ClipboardList
              size={24}
              className="text-[#354C63]"
            />
            Freight Enquiries
          </h2>

          <p className="text-xs text-[#74808C] mt-1">
            Track, price, and respond to incoming customer freight and shipping rate requests.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateEnquiry}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#354C63] hover:bg-[#293D52] active:bg-[#223447] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Create Enquiry</span>
        </button>
      </div>

      {/* Filters Section */}
      <EnquiryFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        mode={mode}
        onModeChange={(val) => {
          setMode(val);
          setCurrentPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Enquiry Table */}
      <EnquiryListPageTable
        enquiries={paginatedEnquiries}
        onViewEnquiry={handleViewEnquiry}
        onEditEnquiry={onEditEnquiry}
        onDeleteEnquiry={handleDeleteEnquiry}
        onCreateEnquiry={onCreateEnquiry}
        onStatusChange={handleStatusChange}
      />

      {/* Pagination */}
      <div className="bg-white rounded-xl border border-[#E2E7ED] shadow-sm px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#74808C]">

        <div>
          {totalCount === 0 ? (
            <span>Showing 0 of 0 enquiries</span>
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
              enquiries
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">

          {/* Previous */}
          <button
            type="button"
            disabled={currentPage <= 1 || totalCount === 0}
            onClick={() =>
              setCurrentPage((p) => Math.max(1, p - 1))
            }
            className="p-1.5 rounded-lg border border-[#D3DBE4] text-[#647E96] hover:bg-[#EEF2F6] hover:text-[#354C63] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Indicator */}
          <span className="px-3 py-1.5 font-semibold text-[#354C63] bg-[#F1F4F7] border border-[#E2E7ED] rounded-lg">
            Page {currentPage} of {totalPages}
          </span>

          {/* Next */}
          <button
            type="button"
            disabled={currentPage >= totalPages || totalCount === 0}
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            className="p-1.5 rounded-lg border border-[#D3DBE4] text-[#647E96] hover:bg-[#EEF2F6] hover:text-[#354C63] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>

        </div>
      </div>

      {/* Enquiry Details Modal */}
      {viewingEnquiry && (
        <EnquiryDetailsModal
          enquiry={viewingEnquiry}
          onClose={handleCloseModal}
        />
      )}

    </div>
  );
}

export default EnquiryList;
