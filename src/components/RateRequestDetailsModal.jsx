import React from 'react';
import {
  X,
  FileText,
  Ship,
  Plane,
  Truck,
  Users,
  Calendar,
  Clock,
  Building2,
  Mail,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Edit,
} from 'lucide-react';

const statusConfig = {
  Draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  Sent: {
    label: 'Sent',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'Partially Responded': {
    label: 'Partially Responded',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  'Responses Received': {
    label: 'Responses Received',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Closed: {
    label: 'Closed',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  Cancelled: {
    label: 'Cancelled',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

function RateRequestDetailsModal({ rateRequest, onClose, onEdit }) {
  if (!rateRequest) return null;

  const mode = rateRequest.shipment_mode || rateRequest.mode || 'Sea';
  const stConfig = statusConfig[rateRequest.status] || statusConfig.Draft;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FileText size={17} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-800">
                  {rateRequest.rfq_no || rateRequest.id}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${stConfig.className}`}
                >
                  {stConfig.label}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Enquiry: {rateRequest.enquiry_no || rateRequest.enquiry_id || '—'} • Customer:{' '}
                {rateRequest.customer_name || '—'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Key Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Mode</span>
              <span className="font-semibold text-gray-800 block mt-0.5">{mode}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Route</span>
              <span className="font-semibold text-blue-700 block mt-0.5 truncate">
                {rateRequest.pol} → {rateRequest.pod}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Request Date</span>
              <span className="font-semibold text-gray-800 block mt-0.5">
                {rateRequest.request_date || '—'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Deadline</span>
              <span className="font-semibold text-amber-700 block mt-0.5">
                {rateRequest.response_deadline || '—'}
              </span>
            </div>
          </div>

          {/* Agents Table */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <Users size={14} className="text-blue-600" />
              Assigned Overseas Agents ({rateRequest.agents?.length || 0})
            </h4>
            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
              {rateRequest.agents && rateRequest.agents.length > 0 ? (
                rateRequest.agents.map((ag, i) => (
                  <div key={i} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{ag.agent_name || ag.name}</p>
                      <p className="text-[11px] text-gray-400">{ag.country || 'Global'} • {ag.email || '—'}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                        {ag.response_status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-3 text-xs text-gray-400 italic">No agents linked.</p>
              )}
            </div>
          </div>

          {rateRequest.special_instructions && (
            <div className="text-xs bg-amber-50/40 border border-amber-200/50 p-3 rounded-xl">
              <span className="font-semibold text-amber-800 block mb-0.5">Special Instructions:</span>
              <p className="text-gray-700">{rateRequest.special_instructions}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold transition-all"
          >
            Close
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(rateRequest);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              <Edit size={13} />
              <span>Edit Details</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RateRequestDetailsModal;

