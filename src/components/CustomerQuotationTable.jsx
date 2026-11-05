import React, { useState } from 'react';
import { Eye, Edit, Trash2, FileX, Plus, Ship, Plane, Truck, Calendar, Clock, AlertTriangle } from 'lucide-react';

const statusConfig = {
  Draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  Sent: {
    label: 'Sent to Customer',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  Accepted: {
    label: 'Accepted',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  Expired: {
    label: 'Expired',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Draft;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  );
}

function ModeBadge({ mode }) {
  const isAir = mode === 'Air';
  const isLand = mode === 'Land' || mode === 'Road';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isAir
          ? 'bg-sky-50 text-sky-600 border-sky-100'
          : isLand
          ? 'bg-amber-50 text-amber-700 border-amber-100'
          : 'bg-indigo-50 text-indigo-600 border-indigo-100'
      }`}
    >
      {isAir ? <Plane size={11} /> : isLand ? <Truck size={11} /> : <Ship size={11} />}
      {mode || 'Sea'}
    </span>
  );
}

function CustomerQuotationTable({
  quotations = [],
  onViewQuotation,
  onEditQuotation,
  onDeleteQuotation,
  onCreateQuotation,
}) {
  const [quotationToDelete, setQuotationToDelete] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Quotation No.
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Enquiry No.
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Shipment Mode
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                POL / POD
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Date
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Validity
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Selling Price
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {quotations && quotations.length > 0 ? (
              quotations.map((quote, idx) => {
                const quoteNo = quote.quotation_no || quote.id;
                const enqNo = quote.enquiry_no || quote.enquiry_id || '—';
                const customer = quote.customer_name || quote.customer || '—';
                const mode = quote.shipment_mode || quote.mode || 'Sea';
                const polPod = `${quote.pol || '—'} → ${quote.pod || '—'}`;
                const quoteDate = quote.quotation_date || quote.date || '—';
                const validity = quote.validity_date || '—';
                const currency = quote.currency || 'USD';
                const sellingPrice =
                  quote.selling_price != null
                    ? `${currency} ${Number(quote.selling_price).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : '—';

                return (
                  <tr
                    key={quoteNo || idx}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-blue-700 text-xs">
                      {quoteNo}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-700 text-xs">
                      {enqNo}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-gray-800">
                      {customer}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <ModeBadge mode={mode} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600">
                      {polPod}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        <span>{quoteDate}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                        <Clock size={13} className="text-amber-500" />
                        <span>{validity}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-emerald-600">
                      {sellingPrice}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={quote.status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewQuotation && onViewQuotation(quote)}
                          title="View Quotation"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditQuotation && onEditQuotation(quote)}
                          title="Edit Quotation"
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuotationToDelete(quote)}
                          title="Delete Quotation"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-3.5 shadow-xs">
                      <FileX size={26} className="text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">
                      No Customer Quotations Found
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-5">
                      Create your first customer-facing quotation from an approved Pricing calculation.
                    </p>
                    <button
                      type="button"
                      onClick={onCreateQuotation}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Create Customer Quotation</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {quotationToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={() => setQuotationToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-800">Delete Quotation</h4>
                <p className="text-xs text-gray-500">
                  {quotationToDelete.quotation_no || quotationToDelete.id}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete customer quotation{' '}
              <span className="font-semibold text-gray-800">
                "{quotationToDelete.quotation_no || quotationToDelete.id}"
              </span>{' '}
              for customer{' '}
              <span className="font-semibold text-gray-800">
                {quotationToDelete.customer_name || 'Customer'}
              </span>
              ?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setQuotationToDelete(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteQuotation) {
                    onDeleteQuotation(quotationToDelete);
                  }
                  setQuotationToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerQuotationTable;

