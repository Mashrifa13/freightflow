
import React, { useState, useMemo } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  LayoutGrid,
  List,
  Building2,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
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
  const [viewMode, setViewMode] = useState('table');

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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />


      {/* Customer Grid / Table View */}
      {viewMode === 'table' ? (
        <CustomerTable
          customers={paginatedCustomers}
          onViewCustomer={handleViewCustomer}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteCustomer}
          onAddCustomer={handleAddCustomer}
        />
      ) : (
        <div>
          {paginatedCustomers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedCustomers.map((customer) => (
                <div
                  key={customer.id || customer.customer_code || customer.customer_id}
                  className="bg-white border border-[#E2E7ED] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#C5D0DC] transition-all duration-200"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#EAF0F5] flex items-center justify-center flex-shrink-0">
                        <Building2 size={21} className="text-[#354C63]" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#242A31] truncate">
                          {customer.name || 'Unnamed Customer'}
                        </h3>

                        <p className="text-xs text-[#74808C] mt-1">
                          {customer.customer_code ||
                            customer.customer_id ||
                            customer.id}
                        </p>
                      </div>
                    </div>

                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${customer.status === 'Active'
                      ? 'bg-green-50 text-green-700'
                      : customer.status === 'Inactive'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-blue-50 text-blue-700'
                      }`}>
                      {customer.status || 'Not specified'}
                    </span>
                  </div>

                  {/* Customer Information */}
                  <div className="mt-5 space-y-3 text-sm">

                    <div className="flex items-center gap-3 text-[#64707D]">
                      <UserCircle size={16} className="flex-shrink-0" />
                      <span className="truncate">
                        {customer.contact_person ||
                          customer.contact_name ||
                          customer.contact_person_name ||
                          'No contact person'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[#64707D]">
                      <Mail size={16} className="flex-shrink-0" />
                      <span className="truncate">
                        {customer.email || 'No email'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[#64707D]">
                      <Phone size={16} className="flex-shrink-0" />
                      <span className="truncate">
                        {customer.phone ||
                          customer.phone_number ||
                          'No phone number'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[#64707D]">
                      <MapPin size={16} className="flex-shrink-0" />
                      <span className="truncate">
                        {customer.country || 'No country specified'}
                      </span>
                    </div>

                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-[#E2E7ED]">

                    <button
                      type="button"
                      onClick={() => handleViewCustomer(customer)}
                      className="flex items-center gap-1.5 text-sm font-medium text-[#354C63] hover:text-[#647E96] transition-colors"
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditCustomer(customer)}
                        title="Edit Customer"
                        className="p-2 rounded-lg text-[#647E96] hover:bg-[#EEF2F6] transition-colors"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCustomer(customer)}
                        title="Delete Customer"
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#E2E7ED] rounded-xl py-12 text-center">
              <Building2 size={32} className="mx-auto text-[#AAB3BD] mb-3" />
              <p className="font-medium text-[#424B55]">
                No customers found
              </p>
              <p className="text-sm text-[#74808C] mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      )}


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
