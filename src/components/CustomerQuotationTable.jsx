
import React, { useState } from 'react';
import {
  Eye,
  Edit,
  Trash2,
  FileX,
  Plus,
  Ship,
  Plane,
  Truck,
  Calendar,
  Clock,
  AlertTriangle
} from 'lucide-react';

const statusConfig = {
  Draft: {
    label: 'Draft',
    className: 'bg-[#F1F4F7] text-[#64717E] border-[#DCE2E8]',
  },
  Sent: {
    label: 'Sent to Customer',
    className: 'bg-[#EDF2F7] text-[#354C63] border-[#D3DFEA]',
  },
  Accepted: {
    label: 'Accepted',
    className: 'bg-[#E8F5EF] text-[#16845B] border-[#C8E8D8]',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-[#FCEEEE] text-[#C45151] border-[#F3D3D3]',
  },
  Expired: {
    label: 'Expired',
    className: 'bg-[#FBF2E2] text-[#A87527] border-[#F0DFBC]',
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Draft;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isAir
          ? 'bg-[#EDF2F7] text-[#354C63] border-[#D3DFEA]'
          : isLand
            ? 'bg-[#FBF2E2] text-[#A87527] border-[#F0DFBC]'
            : 'bg-[#F0EDF6] text-[#75618E] border-[#DED6EA]'
        }`}
    >
      {isAir ? (
        <Plane size={12} />
      ) : isLand ? (
        <Truck size={12} />
      ) : (
        <Ship size={12} />
      )}
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
    <div className="bg-white overflow-hidden">

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">

          <thead>
            <tr className="bg-[#354C63] border-b border-[#293D52]">

              <th scope="col" className="px-5 py-4 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Quotation No.
              </th>

              <th scope="col" className="px-5 py-4 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Enquiry No.
              </th>

              <th scope="col" className="px-5 py-4 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Customer
              </th>

              <th scope="col" className="px-5 py-4 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Shipment Mode
              </th>

              <th scope="col" className="px-5 py-4 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                POL / POD
              </th>

              <th scope="col" className="px-5 py-4 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Date
              </th>

              <th scope="col" className="px-5 py-4 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Validity
              </th>

              <th scope="col" className="px-5 py-4 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Selling Price
              </th>

              <th scope="col" className="px-5 py-4 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Status
              </th>

              <th scope="col" className="px-5 py-4 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap text-right">
                Actions
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-[#E8ECF0]">

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
                    className={`transition-colors hover:bg-[#EEF2F6] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F9FB]'
                      }`}
                  >

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-bold text-[#354C63] text-xs">
                        {quoteNo}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap font-medium text-[#64717E] text-xs">
                      {enqNo}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-semibold text-[#242A31]">
                        {customer}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <ModeBadge mode={mode} />
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-xs text-[#424B55]">
                      {polPod}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-xs text-[#64717E]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#74808C]" />
                        <span>{quoteDate}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5 text-[#A87527] font-medium">
                        <Clock size={13} />
                        <span>{validity}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-bold text-[#16845B]">
                        {sellingPrice}
                      </span>
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
                          className="p-2 text-[#74808C] hover:text-[#354C63] hover:bg-[#EDF2F7] rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditQuotation && onEditQuotation(quote)}
                          title="Edit Quotation"
                          className="p-2 text-[#74808C] hover:text-[#16845B] hover:bg-[#E8F5EF] rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setQuotationToDelete(quote)}
                          title="Delete Quotation"
                          className="p-2 text-[#74808C] hover:text-[#C45151] hover:bg-[#FCEEEE] rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (

              /* Empty State */
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">

                    <div className="w-16 h-16 rounded-2xl bg-[#EDF2F7] border border-[#DCE4EC] flex items-center justify-center text-[#647E96] mb-4">
                      <FileX size={28} />
                    </div>

                    <h3 className="text-base font-semibold text-[#242A31]">
                      No Customer Quotations Found
                    </h3>

                    <p className="text-sm text-[#74808C] mt-1 mb-5">
                      Create your first customer-facing quotation from an approved Pricing calculation.
                    </p>

                    <button
                      type="button"
                      onClick={onCreateQuotation}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#354C63] hover:bg-[#293D52] text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#100F0E]/55 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
          onClick={() => setQuotationToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-[#E2E7ED] max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center gap-3 mb-4">

              <div className="w-11 h-11 rounded-xl bg-[#FCEEEE] text-[#C45151] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={21} />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#242A31]">
                  Delete Quotation
                </h4>

                <p className="text-xs text-[#74808C] mt-0.5">
                  {quotationToDelete.quotation_no || quotationToDelete.id}
                </p>
              </div>

            </div>

            <p className="text-sm text-[#424B55] mb-6 leading-relaxed">
              Are you sure you want to delete customer quotation{' '}
              <span className="font-semibold text-[#242A31]">
                "{quotationToDelete.quotation_no || quotationToDelete.id}"
              </span>
              {' '}for customer{' '}
              <span className="font-semibold text-[#242A31]">
                {quotationToDelete.customer_name || 'Customer'}
              </span>
              ?
            </p>

            <div className="flex items-center justify-end gap-3">

              <button
                type="button"
                onClick={() => setQuotationToDelete(null)}
                className="px-4 py-2.5 border border-[#D3DBE4] text-[#424B55] hover:bg-[#F1F4F7] text-xs font-semibold rounded-lg transition-all cursor-pointer"
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
                className="px-4 py-2.5 bg-[#C45151] hover:bg-[#AC3F3F] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
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
