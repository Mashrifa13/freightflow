import React, { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';
import CustomerFilters from '../components/CustomerFilters';
import CustomerTable from '../components/CustomerTable';

/**
 * CustomerList Page Component
 * Handles the state management for filters, search, and pagination.
 * Ready for Django REST Framework integration (e.g., fetch from /api/customers/).
 */
function CustomerList({ onNavigateToAddCustomer }) {
  // Empty customer list by default (no dummy data, ready for backend integration)
  const [customers, setCustomers] = useState([]);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');

  // Pagination state (ready for DRF PageNumberPagination / LimitOffsetPagination)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Handlers
  const handleResetFilters = () => {
    setSearchTerm('');
    setCustomerType('');
    setCountry('');
    setStatus('');
    setCurrentPage(1);
  };

  const handleAddCustomer = () => {
    if (onNavigateToAddCustomer) {
      onNavigateToAddCustomer();
    } else {
      console.log('Navigate to Add Customer placeholder route');
    }
  };

  const handleViewCustomer = (customer) => {
    console.log('View customer action triggered for:', customer);
  };

  const handleEditCustomer = (customer) => {
    console.log('Edit customer action triggered for:', customer);
  };

  // Filter application logic ready for client-side or DRF queryParams
  const filteredCustomers = useMemo(() => {
    return customers.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.customer_id && item.customer_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.id && String(item.id).toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = !customerType || item.customer_type === customerType || item.type === customerType;
      const matchesCountry = !country || item.country === country;
      const matchesStatus = !status || item.status === status;

      return matchesSearch && matchesType && matchesCountry && matchesStatus;
    });
  }, [customers, searchTerm, customerType, country, status]);

  const totalCount = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-5">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <UserCircle className="text-blue-600" size={24} />
            Customer Management
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your client accounts, partners, and shipping customer profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddCustomer}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filters Section */}
      <CustomerFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        customerType={customerType}
        onCustomerTypeChange={(val) => {
          setCustomerType(val);
          setCurrentPage(1);
        }}
        country={country}
        onCountryChange={(val) => {
          setCountry(val);
          setCurrentPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Customers Table / Empty State */}
      <CustomerTable
        customers={paginatedCustomers}
        onViewCustomer={handleViewCustomer}
        onEditCustomer={handleEditCustomer}
        onAddCustomer={handleAddCustomer}
      />

      {/* Pagination Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          {totalCount === 0 ? (
            <span>Showing 0 of 0 customers</span>
          ) : (
            <span>
              Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(startIndex + pageSize, totalCount)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{totalCount}</span> customers
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

export default CustomerList;
