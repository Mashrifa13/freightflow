import React, { useState, useMemo } from 'react';
import { ClipboardList, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import EnquiryFilters from '../components/EnquiryFilters';
import EnquiryListPageTable from '../components/EnquiryListPageTable';
import EnquiryDetailsModal from '../components/EnquiryDetailsModal';
import { enquiriesData as initialEnquiriesData } from '../data/dashboardData';
import { loadFromLocalStorage } from '../utils/storage';

/**
 * EnquiryList Page Component
 * Main page for managing and viewing freight enquiries with filters, pagination,
 * and Create / Edit Enquiry actions.
 *
 * Props:
 *   enquiries        – controlled list from App.jsx state
 *   setEnquiries     – setter from App.jsx (for delete)
 *   onCreateEnquiry  – navigate to create-enquiry page
 *   onEditEnquiry    – navigate to edit-enquiry page with the selected enquiry
 */
function EnquiryList({
  enquiries: externalEnquiries,
  setEnquiries: externalSetEnquiries,
  onCreateEnquiry,
  onEditEnquiry,
}) {
  // Fall back to internal state if not controlled externally
  const [internalEnquiries, setInternalEnquiries] = useState(() => loadFromLocalStorage('ff_enquiries', initialEnquiriesData));
  const enquiries = externalEnquiries !== undefined ? externalEnquiries : internalEnquiries;
  const setEnquiries = externalSetEnquiries || setInternalEnquiries;

  // Selected enquiry for quick-view modal
  const [viewingEnquiry, setViewingEnquiry] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('');
  const [status, setStatus] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Handlers
  const handleResetFilters = () => {
    setSearchTerm('');
    setMode('');
    setStatus('');
    setCurrentPage(1);
  };

  const handleViewEnquiry = (enquiry) => setViewingEnquiry(enquiry);
  const handleCloseModal = () => setViewingEnquiry(null);

  const handleDeleteEnquiry = (enquiryToDelete) => {
    setEnquiries((prev) =>
      prev.filter(
        (e) => (e.id || e.enquiry_no) !== (enquiryToDelete.id || enquiryToDelete.enquiry_no)
      )
    );
  };

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

  // Filter application
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

  const totalCount = filteredEnquiries.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-5">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>

          <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <ClipboardList size={24} className="text-blue-600" />
            Freight Enquiries
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Track, price, and respond to incoming customer freight and shipping rate requests.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateEnquiry}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer self-start sm:self-auto"
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

      {/* Pagination Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          {totalCount === 0 ? (
            <span>Showing 0 of 0 enquiries</span>
          ) : (
            <span>
              Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(startIndex + pageSize, totalCount)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{totalCount}</span> enquiries
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

      {/* Quick-view Modal */}
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
