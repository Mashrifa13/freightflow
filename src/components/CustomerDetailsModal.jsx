
import React from 'react';
import {
  X,
  Building2,
  PhoneCall,
  MapPin,
  CreditCard,
  Globe,
  Mail,
  User,
} from 'lucide-react';

function CustomerDetailsModal({ customer, onClose, onEdit }) {
  if (!customer) return null;

  const statusStyles = {
    Active: 'bg-[#E8F5EF] text-[#16845B] border-[#D1EEDB]',
    Pending: 'bg-[#FBF2E2] text-[#B17A25] border-[#F4E1BE]',
    Inactive: 'bg-[#F1F3F5] text-[#74808C] border-[#DDE2E7]',
    Suspended: 'bg-[#FCEEEE] text-[#C45151] border-[#F6CACA]',
  };

  const customerId =
    customer.customer_code ||
    customer.customer_id ||
    customer.id ||
    '—';

  const sectionHeading =
    'flex items-center gap-2 mb-3 text-xs font-bold text-[#354C63] uppercase tracking-wider';

  const sectionBox =
    'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#F7F9FB] p-4 rounded-xl border border-[#E2E7ED]';

  const labelStyle =
    'text-xs font-medium text-[#74808C] block mb-0.5';

  const valueStyle =
    'text-sm text-[#242A31]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-[#E2E7ED] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E7ED] bg-[#F7F9FB] flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center flex-shrink-0">
              <Building2 size={20} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#242A31] leading-tight">
                  {customer.name || customer.customer_name}
                </h3>

                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[customer.status] ||
                    'bg-[#F1F3F5] text-[#74808C] border-[#DDE2E7]'
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                  {customer.status || 'Active'}
                </span>
              </div>

              <p className="text-xs text-[#74808C] mt-0.5">
                Customer ID:{' '}
                <span className="text-[#354C63] font-semibold">
                  {customerId}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#74808C] hover:text-[#354C63] hover:bg-[#EAF0F5] rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">

          {/* 1. Basic Information */}
          <div>
            <div className={sectionHeading}>
              <Building2 size={15} className="text-[#354C63]" />
              <span>1. Basic Information</span>
            </div>

            <div className={sectionBox}>
              <div>
                <span className={labelStyle}>Customer Name</span>
                <span className="text-sm font-semibold text-[#242A31]">
                  {customer.name || customer.customer_name || '—'}
                </span>
              </div>

              <div>
                <span className={labelStyle}>Customer Code</span>
                <span className="text-sm font-semibold text-[#354C63]">
                  {customerId}
                </span>
              </div>

              <div>
                <span className={labelStyle}>Customer Type</span>
                <span className={valueStyle}>
                  {customer.customer_type || customer.type || '—'}
                </span>
              </div>

              <div>
                <span className={labelStyle}>Company Registration</span>
                <span className={valueStyle}>
                  {customer.company_registration_number || '—'}
                </span>
              </div>

              <div>
                <span className={labelStyle}>Tax / VAT Number</span>
                <span className={valueStyle}>
                  {customer.tax_vat_number || '—'}
                </span>
              </div>

              <div>
                <span className={labelStyle}>Website</span>
                {customer.website ? (
                  <a
                    href={
                      customer.website.startsWith('http')
                        ? customer.website
                        : `https://${customer.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#354C63] hover:text-[#647E96] hover:underline flex items-center gap-1.5 truncate text-sm"
                  >
                    <Globe size={13} className="flex-shrink-0" />
                    <span className="truncate">{customer.website}</span>
                  </a>
                ) : (
                  <span className="text-sm text-[#74808C]">—</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Contact Information */}
          <div>
            <div className={sectionHeading}>
              <PhoneCall size={15} className="text-[#354C63]" />
              <span>2. Contact Information</span>
            </div>

            <div className={`${sectionBox} lg:grid-cols-4`}>
              <div>
                <span className={labelStyle}>Contact Person</span>
                <span className={`${valueStyle} flex items-center gap-1.5`}>
                  <User size={13} className="text-[#74808C]" />
                  {customer.contact_person || '—'}
                </span>
              </div>

              <div>
                <span className={labelStyle}>Email Address</span>
                <span className={`${valueStyle} flex items-center gap-1.5 min-w-0`}>
                  <Mail size={13} className="text-[#74808C] flex-shrink-0" />
                  <span className="truncate">{customer.email || '—'}</span>
                </span>
              </div>

              <div>
                <span className={labelStyle}>Phone</span>
                <span className={valueStyle}>
                  {customer.phone || '—'}
                </span>
              </div>

              <div>
                <span className={labelStyle}>Alternate Phone</span>
                <span className={valueStyle}>
                  {customer.alternate_phone || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Address Information */}
          <div>
            <div className={sectionHeading}>
              <MapPin size={15} className="text-[#354C63]" />
              <span>3. Address Information</span>
            </div>

            <div className={`${sectionBox} lg:grid-cols-4`}>
              <div>
                <span className={labelStyle}>Country</span>
                <span className="text-sm font-semibold text-[#242A31]">
                  {customer.country || '—'}
                </span>
              </div>

              <div>
                <span className={labelStyle}>State / Province</span>
                <span className={valueStyle}>
                  {customer.state || '—'}
                </span>
              </div>

              <div>
                <span className={labelStyle}>City</span>
                <span className={valueStyle}>
                  {customer.city || '—'}
                </span>
              </div>

              <div>
                <span className={labelStyle}>Postal / ZIP Code</span>
                <span className={valueStyle}>
                  {customer.postal_code || '—'}
                </span>
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <span className={labelStyle}>Street Address</span>
                <span className={valueStyle}>
                  {customer.address || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Financial Information */}
          <div>
            <div className={sectionHeading}>
              <CreditCard size={15} className="text-[#354C63]" />
              <span>4. Financial Information</span>
            </div>

            <div className={`${sectionBox} sm:grid-cols-2 max-w-xl`}>
              <div>
                <span className={labelStyle}>Credit Limit</span>
                <span className="text-sm font-bold text-[#242A31]">
                  {customer.credit_limit != null &&
                    customer.credit_limit !== ''
                    ? `₹ ${Number(customer.credit_limit).toLocaleString('en-IN')}`
                    : '₹ 0.00'}
                </span>
              </div>

              <div>
                <span className={labelStyle}>Credit Terms</span>
                <span className="text-sm font-bold text-[#242A31]">
                  {customer.credit_days != null &&
                    customer.credit_days !== ''
                    ? `${customer.credit_days} days`
                    : 'Net 0 days'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-[#E2E7ED] bg-[#F7F9FB] flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#D3DBE4] text-[#596673] hover:bg-[#EEF2F6] hover:text-[#242A31] text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailsModal;
