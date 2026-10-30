import React from 'react';
import {
  X,
  Building2,
  PhoneCall,
  MapPin,
  CreditCard,
  Edit,
  Globe,
  Mail,
  User,
} from 'lucide-react';

/**
 * CustomerDetailsModal
 * Modal displaying comprehensive customer profile details with Edit and Close actions.
 * Features crisp readable labels and consistent typography across all fields.
 */
function CustomerDetailsModal({ customer, onClose, onEdit }) {
  if (!customer) return null;

  const statusStyles = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-orange-50 text-orange-700 border-orange-200',
    Inactive: 'bg-gray-100 text-gray-600 border-gray-200',
    Suspended: 'bg-red-50 text-red-600 border-red-200',
  };

  const customerId = customer.customer_code || customer.customer_id || customer.id || '—';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {customer.name || customer.customer_name}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    statusStyles[customer.status] || 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                  {customer.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Customer ID:{' '}
                <span className="text-blue-700 font-semibold">{customerId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(customer);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* 1. Basic Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <Building2 size={15} className="text-blue-600" />
              <span>1. Basic Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50/70 p-4.5 rounded-xl border border-gray-100">
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Customer Name</span>
                <span className="text-sm font-semibold text-gray-900">{customer.name || customer.customer_name || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Customer Code</span>
                <span className="text-sm font-semibold text-blue-700">{customerId}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Customer Type</span>
                <span className="text-sm text-gray-800">{customer.customer_type || customer.type || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Company Registration</span>
                <span className="text-sm text-gray-800">{customer.company_registration_number || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Tax / VAT Number</span>
                <span className="text-sm text-gray-800">{customer.tax_vat_number || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Website</span>
                {customer.website ? (
                  <a
                    href={customer.website.startsWith('http') ? customer.website : `https://${customer.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 truncate text-sm"
                  >
                    <Globe size={13} className="flex-shrink-0" />
                    <span className="truncate">{customer.website}</span>
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Contact Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <PhoneCall size={15} className="text-purple-600" />
              <span>2. Contact Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50/70 p-4.5 rounded-xl border border-gray-100">
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Contact Person</span>
                <span className="text-sm text-gray-800 flex items-center gap-1.5">
                  <User size={13} className="text-gray-400" />
                  {customer.contact_person || '—'}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Email Address</span>
                <span className="text-sm text-gray-800 flex items-center gap-1.5 truncate">
                  <Mail size={13} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{customer.email || '—'}</span>
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Phone</span>
                <span className="text-sm text-gray-800 block">{customer.phone || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Alternate Phone</span>
                <span className="text-sm text-gray-800 block">{customer.alternate_phone || '—'}</span>
              </div>
            </div>
          </div>

          {/* 3. Address Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <MapPin size={15} className="text-emerald-600" />
              <span>3. Address Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50/70 p-4.5 rounded-xl border border-gray-100">
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Country</span>
                <span className="text-sm font-semibold text-gray-800">{customer.country || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">State / Province</span>
                <span className="text-sm text-gray-800">{customer.state || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">City</span>
                <span className="text-sm text-gray-800">{customer.city || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Postal / ZIP Code</span>
                <span className="text-sm text-gray-800">{customer.postal_code || '—'}</span>
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Street Address</span>
                <span className="text-sm text-gray-800">{customer.address || '—'}</span>
              </div>
            </div>
          </div>

          {/* 4. Financial Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <CreditCard size={15} className="text-orange-600" />
              <span>4. Financial Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-4.5 rounded-xl border border-gray-100 max-w-xl">
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Credit Limit</span>
                <span className="text-sm font-bold text-gray-900">
                  {customer.credit_limit != null && customer.credit_limit !== ''
                    ? `₹ ${Number(customer.credit_limit).toLocaleString('en-IN')}`
                    : '₹ 0.00'}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Credit Terms</span>
                <span className="text-sm font-bold text-gray-900">
                  {customer.credit_days != null && customer.credit_days !== ''
                    ? `${customer.credit_days} days`
                    : 'Net 0 days'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(customer);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Edit size={13} />
            <span>Edit Customer</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailsModal;
