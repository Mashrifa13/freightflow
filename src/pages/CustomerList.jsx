
import React, { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';
import CustomerFilters from '../components/CustomerFilters';
import CustomerTable from '../components/CustomerTable';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import { loadFromLocalStorage } from '../utils/storage';

function CustomerList({
  customers: externalCustomers,
  setCustomers: externalSetCustomers,
  onNavigateToAddCustomer,
  onEditCustomer: externalOnEditCustomer,
  onDeleteCustomer: externalOnDeleteCustomer,
}) {
  const [internalCustomers, setInternalCustomers] = useState(() =>
    loadFromLocalStorage('ff_customers', [])
  );

  const customers =
    externalCustomers !== undefined ? externalCustomers : internalCustomers;

  const setCustomers = externalSetCustomers || setInternalCustomers;

  const [viewingCustomer, setViewingCustomer] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
    }
  };

  const handleViewCustomer = (customer) => {
    setViewingCustomer(customer);
  };

  const handleCloseModal = () => {
    setViewingCustomer(null);
  };

  const handleEditCustomer = (customer) => {
    if (externalOnEditCustomer) {
      externalOnEditCustomer(customer);
    }
  };

  const handleDeleteCustomer = (customer) => {
    if (externalOnDeleteCustomer) {
      externalOnDeleteCustomer(customer);
    } else {
      setCustomers((prev) =>
        prev.filter(
          (c) =>
            (c.customer_code && c.customer_code !== customer.customer_code) ||
            (c.customer_id && c.customer_id !== customer.customer_id) ||
            (c.id && c.id !== customer.id)
        )
      );
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.customer_code &&
          item.customer_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.customer_id &&
          item.customer_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.id &&
          String(item.id).toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType =
        !customerType ||
        item.customer_type === customerType ||
        item.type === customerType;

      const matchesCountry = !country || item.country === country;
      const matchesStatus = !status || item.status === status;

      return matchesSearch && matchesType && matchesCountry && matchesStatus;
    });
  }, [customers, searchTerm, customerType, country, status]);

  const totalCount = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;

  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF0F5] flex items-center justify-center">
              <UserCircle size={21} className="text-[#354C63]" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
                Customer Management
              </h2>

              <p className="text-sm text-[#74808C] mt-0.5">
                Manage your client accounts, partners, and shipping customer profiles.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddCustomer}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5
          bg-[#354C63] hover:bg-[#293D52] active:bg-[#223448]
          text-white text-sm font-medium rounded-lg
          shadow-sm hover:shadow-md transition-all
          cursor-pointer self-start sm:self-auto"
        >
          <Plus size={17} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filters */}
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

      {/* Customer Table */}
      <CustomerTable
        customers={paginatedCustomers}
        onViewCustomer={handleViewCustomer}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDeleteCustomer}
        onAddCustomer={handleAddCustomer}
      />

      {/* Pagination */}
      <div className="bg-white rounded-xl border border-[#E2E7ED]
      shadow-sm px-5 py-4 flex flex-col sm:flex-row
      items-center justify-between gap-3 text-sm">

        <div className="text-[#74808C]">
          {totalCount === 0 ? (
            <span>Showing 0 of 0 customers</span>
          ) : (
            <span>
              Showing{' '}
              <span className="font-semibold text-[#354C63]">
                {startIndex + 1}
              </span>
              {' '}to{' '}
              <span className="font-semibold text-[#354C63]">
                {Math.min(startIndex + pageSize, totalCount)}
              </span>
              {' '}of{' '}
              <span className="font-semibold text-[#354C63]">
                {totalCount}
              </span>
              {' '}customers
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            disabled={currentPage <= 1 || totalCount === 0}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-9 h-9 flex items-center justify-center
            rounded-lg border border-[#D3DBE4]
            text-[#354C63] bg-white
            hover:bg-[#EEF2F6]
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors"
            title="Previous Page"
          >
            <ChevronLeft size={17} />
          </button>

          <span className="px-4 py-2 text-xs font-medium
          text-[#354C63] bg-[#F1F4F7]
          border border-[#E2E7ED] rounded-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages || totalCount === 0}
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            className="w-9 h-9 flex items-center justify-center
            rounded-lg border border-[#D3DBE4]
            text-[#354C63] bg-white
            hover:bg-[#EEF2F6]
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors"
            title="Next Page"
          >
            <ChevronRight size={17} />
          </button>

        </div>
      </div>

      {/* Customer Details Modal */}
      {viewingCustomer && (
        <CustomerDetailsModal
          customer={viewingCustomer}
          onClose={handleCloseModal}
          onEdit={(customer) => {
            handleCloseModal();
            handleEditCustomer(customer);
          }}
        />
      )}

    </div>
  );
}

export default CustomerList;
