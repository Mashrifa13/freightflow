import React from 'react';
import {
  X,
  FileText,
  Ship,
  Plane,
  Truck,
  MapPin,
  Calendar,
  User,
  ArrowRight,
  Clock,
} from 'lucide-react';

const statusConfig = {
  Pricing: {
    label: 'Pricing in Progress',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  Pending: {
    label: 'Pending Agent Response',
    className: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  Quoted: {
    label: 'Quotation Sent',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  Completed: {
    label: 'Completed / Won',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Rejected: {
    label: 'Declined / Expired',
    className: 'bg-red-50 text-red-600 border-red-200',
  },
};

/**
 * EnquiryDetailsModal
 * Quick inspection modal for viewing freight enquiry route and details
 */
function EnquiryDetailsModal({ enquiry, onClose }) {
  if (!enquiry) return null;

  const enqId = enquiry.id || enquiry.enquiry_no || '—';
  const mode = enquiry.mode || 'Sea';
  const isAir = mode === 'Air';
  const isRoad = mode === 'Road';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  Enquiry {enqId}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    statusConfig[enquiry.status]?.className || 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                  {statusConfig[enquiry.status]?.label || enquiry.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Client: <span className="text-gray-800 font-semibold">{enquiry.customer || enquiry.customer_name}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm overflow-y-auto">
          {/* Shipping Lane Visual */}
          <div className="p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 rounded-xl border border-blue-100 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Port of Loading (Origin)</span>
              <p className="text-base font-bold text-gray-900 mt-0.5">{enquiry.pol || 'Origin Port'}</p>
            </div>

            <div className="flex flex-col items-center px-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-blue-200 text-xs font-semibold text-blue-700 shadow-xs">
                {isAir ? <Plane size={13} /> : isRoad ? <Truck size={13} /> : <Ship size={13} />}
                <span>{mode} Freight</span>
              </div>
              <ArrowRight size={18} className="text-blue-500 mt-1" />
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Port of Discharge (Destination)</span>
              <p className="text-base font-bold text-gray-900 mt-0.5">{enquiry.pod || 'Destination Port'}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50/70 p-4.5 rounded-xl border border-gray-100">
            <div>
              <span className="text-xs font-medium text-gray-600 block mb-0.5">Customer Name</span>
              <span className="text-sm font-semibold text-gray-900">{enquiry.customer || enquiry.customer_name}</span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-600 block mb-0.5">Enquiry Reference</span>
              <span className="text-sm font-semibold text-blue-700">{enqId}</span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-600 block mb-0.5">Transportation Mode</span>
              <span className="text-sm text-gray-800">{mode} Freight</span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-600 block mb-0.5">Pricing Status</span>
              <span className="text-sm text-gray-800">{enquiry.status || 'Pricing'}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnquiryDetailsModal;

