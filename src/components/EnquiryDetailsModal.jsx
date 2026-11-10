
import React from 'react';
import {
  X,
  FileText,
  Ship,
  Plane,
  Truck,
  ArrowRight,
  Package,
} from 'lucide-react';

const statusConfig = {
  Pricing: {
    label: 'Pricing in Progress',
    className: 'bg-[#EDF2F7] text-[#354C63] border-[#D3DBE4]',
  },
  Pending: {
    label: 'Pending Agent Response',
    className: 'bg-[#FBF2E2] text-[#A87525] border-[#EEDDBB]',
  },
  Quoted: {
    label: 'Quotation Sent',
    className: 'bg-[#F0EBF7] text-[#7955A3] border-[#E0D5EF]',
  },
  Completed: {
    label: 'Completed / Won',
    className: 'bg-[#E8F5EF] text-[#16845B] border-[#C9E8D8]',
  },
  Rejected: {
    label: 'Declined / Expired',
    className: 'bg-[#FCEEEE] text-[#C45151] border-[#F3D1D1]',
  },
};

/**
 * EnquiryDetailsModal
 * Quick inspection modal for viewing freight enquiry route and details.
 */
function EnquiryDetailsModal({ enquiry, onClose }) {
  if (!enquiry) return null;

  const enqId = enquiry.id || enquiry.enquiry_no || '—';
  const mode = enquiry.mode || 'Sea';
  const isAir = mode === 'Air';
  const isRoad = mode === 'Road';

  const labelClass = 'text-xs font-medium text-[#74808C] block mb-0.5';
  const valueClass = 'text-sm font-semibold text-[#242A31]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#100F0E]/55 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-[#E2E7ED] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E7ED] bg-[#F7F9FB] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center">
              <FileText size={20} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#242A31] leading-tight">
                  Enquiry {enqId}
                </h3>

                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusConfig[enquiry.status]?.className ||
                    'bg-[#F1F4F7] text-[#596673] border-[#E2E7ED]'
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                  {statusConfig[enquiry.status]?.label || enquiry.status || 'Active'}
                </span>
              </div>

              <p className="text-xs text-[#74808C] mt-0.5">
                Client:{' '}
                <span className="text-[#354C63] font-semibold">
                  {enquiry.customer || enquiry.customer_name || '—'}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#74808C] hover:text-[#242A31] hover:bg-[#E9EEF3] rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm overflow-y-auto">

          {/* Shipping Lane */}
          <div className="p-4 bg-gradient-to-r from-[#EDF2F7] to-[#F7F9FB] rounded-xl border border-[#D3DBE4] flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-[#74808C] uppercase tracking-wider block">
                Port of Loading (Origin)
              </span>
              <p className="text-base font-bold text-[#242A31] mt-0.5 break-words">
                {enquiry.pol || 'Origin Port'}
              </p>
            </div>

            <div className="flex flex-col items-center px-2 sm:px-4 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#D3DBE4] text-xs font-semibold text-[#354C63] shadow-sm">
                {isAir ? (
                  <Plane size={13} />
                ) : isRoad ? (
                  <Truck size={13} />
                ) : (
                  <Ship size={13} />
                )}
                <span>{mode} Freight</span>
              </div>

              <ArrowRight size={18} className="text-[#647E96] mt-1" />
            </div>

            <div className="text-right min-w-0">
              <span className="text-[11px] font-semibold text-[#74808C] uppercase tracking-wider block">
                Port of Discharge (Destination)
              </span>
              <p className="text-base font-bold text-[#242A31] mt-0.5 break-words">
                {enquiry.pod || 'Destination Port'}
              </p>
            </div>
          </div>

          {/* Enquiry Details */}
          <div className="grid grid-cols-2 gap-4 bg-[#F7F9FB] p-4 rounded-xl border border-[#E2E7ED]">
            <div>
              <span className={labelClass}>Customer Name</span>
              <span className={valueClass}>
                {enquiry.customer || enquiry.customer_name || '—'}
              </span>
            </div>

            <div>
              <span className={labelClass}>Enquiry Reference</span>
              <span className="text-sm font-semibold text-[#354C63]">
                {enqId}
              </span>
            </div>

            <div>
              <span className={labelClass}>Transportation Mode</span>
              <span className="text-sm text-[#354C63] font-medium">
                {mode} Freight
              </span>
            </div>

            <div>
              <span className={labelClass}>Pricing Status</span>
              <span className="text-sm text-[#354C63] font-medium">
                {enquiry.status || 'Pricing'}
              </span>
            </div>
          </div>

          {/* Cargo Information */}
          <div className="bg-[#F7F9FB] p-4 rounded-xl border border-[#E2E7ED]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#EAF0F5] text-[#354C63] flex items-center justify-center">
                <Package size={17} />
              </div>

              <h4 className="text-sm font-bold text-[#354C63]">
                Cargo Information
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className={labelClass}>Commodity</span>
                <span className={valueClass}>
                  {enquiry.commodity || '—'}
                </span>
              </div>

              <div>
                <span className={labelClass}>Number of Packages</span>
                <span className={valueClass}>
                  {enquiry.no_of_packages ?? '—'}
                </span>
              </div>

              <div>
                <span className={labelClass}>Gross Weight</span>
                <span className={valueClass}>
                  {enquiry.gross_weight != null
                    ? `${enquiry.gross_weight} ${enquiry.gross_weight_unit || 'kg'}`
                    : '—'}
                </span>
              </div>

              <div>
                <span className={labelClass}>Volume (CBM)</span>
                <span className={valueClass}>
                  {enquiry.volume_cbm != null ? enquiry.volume_cbm : '—'}
                </span>
              </div>

              <div>
                <span className={labelClass}>Shipment Type</span>
                <span className={valueClass}>
                  {enquiry.shipment_type || '—'}
                </span>
              </div>

              <div>
                <span className={labelClass}>Incoterms</span>
                <span className={valueClass}>
                  {enquiry.incoterms || '—'}
                </span>
              </div>
            </div>

            {/* Cargo Description */}
            <div className="mt-4 pt-3 border-t border-[#E2E7ED]">
              <span className={labelClass}>Cargo Description</span>
              <span className="text-sm text-[#35404B] whitespace-pre-wrap">
                {enquiry.cargo_description || '—'}
              </span>
            </div>

            {/* Container Details */}
            {enquiry.containers?.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#E2E7ED]">
                <span className={labelClass}>Container Details</span>

                <div className="space-y-2 mt-2">
                  {enquiry.containers.map((container, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm bg-white border border-[#E2E7ED] rounded-lg px-3 py-2"
                    >
                      <span className="text-[#35404B] font-medium">
                        {container.containerType || '—'}
                      </span>

                      <span className="font-semibold text-[#354C63]">
                        Qty: {container.quantity || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-[#E2E7ED] bg-[#F7F9FB] flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#354C63] hover:bg-[#293D52] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnquiryDetailsModal;
