
import React from 'react';
import {
  X,
  FileText,
  Users,
  Edit,
} from 'lucide-react';

const statusConfig = {
  Draft: {
    label: 'Draft',
    className: 'bg-[#F1F4F7] text-[#596673] border-[#E2E7ED]',
  },
  Sent: {
    label: 'Sent',
    className: 'bg-[#EDF2F7] text-[#354C63] border-[#D3DBE4]',
  },
  'Partially Responded': {
    label: 'Partially Responded',
    className: 'bg-[#FBF2E2] text-[#A87525] border-[#F0DFC0]',
  },
  'Responses Received': {
    label: 'Responses Received',
    className: 'bg-[#E8F5EF] text-[#16845B] border-[#CDE8DA]',
  },
  Closed: {
    label: 'Closed',
    className: 'bg-[#F1F4F7] text-[#596673] border-[#E2E7ED]',
  },
  Cancelled: {
    label: 'Cancelled',
    className: 'bg-[#FCEEEE] text-[#C45151] border-[#F3D5D5]',
  },
};

function RateRequestDetailsModal({ rateRequest, onClose, onEdit }) {
  if (!rateRequest) return null;

  const mode = rateRequest.shipment_mode || rateRequest.mode || 'Sea';
  const stConfig = statusConfig[rateRequest.status] || statusConfig.Draft;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#100F0E]/55 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-[#E2E7ED] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E2E7ED] bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center flex-shrink-0">
              <FileText size={19} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#242A31]">
                  {rateRequest.rfq_no || rateRequest.id}
                </h3>

                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${stConfig.className}`}
                >
                  {stConfig.label}
                </span>
              </div>

              <p className="text-xs text-[#74808C] mt-1">
                Enquiry: {rateRequest.enquiry_no || rateRequest.enquiry_id || '—'}
                {' '}• Customer: {rateRequest.customer_name || '—'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="p-2 text-[#74808C] hover:text-[#242A31] rounded-lg hover:bg-[#F1F4F7] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">

          {/* Key Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F9FB] p-4 rounded-xl border border-[#E2E7ED] text-xs">

            <div>
              <span className="text-[#74808C] block font-medium">Mode</span>
              <span className="font-semibold text-[#242A31] block mt-1">
                {mode}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">Route</span>
              <span className="font-semibold text-[#354C63] block mt-1 truncate">
                {rateRequest.pol || '—'} → {rateRequest.pod || '—'}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">Request Date</span>
              <span className="font-semibold text-[#242A31] block mt-1">
                {rateRequest.request_date || '—'}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">Deadline</span>
              <span className="font-semibold text-[#A87525] block mt-1">
                {rateRequest.response_deadline || '—'}
              </span>
            </div>

          </div>

          {/* Assigned Agents */}
          <div>
            <h4 className="text-sm font-bold text-[#242A31] mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#EAF0F5] text-[#354C63] flex items-center justify-center">
                <Users size={15} />
              </span>

              Assigned Overseas Agents

              <span className="text-xs font-medium text-[#74808C]">
                ({rateRequest.agents?.length || 0})
              </span>
            </h4>

            <div className="border border-[#E2E7ED] rounded-xl overflow-hidden divide-y divide-[#E2E7ED] text-xs">

              {rateRequest.agents && rateRequest.agents.length > 0 ? (
                rateRequest.agents.map((ag, i) => (
                  <div
                    key={ag.agent_id || ag.id || i}
                    className="p-3.5 flex items-center justify-between gap-3 even:bg-[#F7F9FB] hover:bg-[#EEF2F6] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[#242A31]">
                        {ag.agent_name || ag.name}
                      </p>

                      <p className="text-[11px] text-[#74808C] mt-1 break-all">
                        {ag.country || 'Global'} • {ag.email || '—'}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#F1F4F7] text-[#596673] border border-[#E2E7ED]">
                        {ag.response_status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-xs text-[#74808C] italic">
                  No agents linked.
                </p>
              )}

            </div>
          </div>

          {/* Special Instructions */}
          {rateRequest.special_instructions && (
            <div className="text-xs bg-[#FBF2E2] border border-[#F0DFC0] p-4 rounded-xl">
              <span className="font-semibold text-[#8B642C] block mb-1.5">
                Special Instructions
              </span>

              <p className="text-[#596673] leading-relaxed">
                {rateRequest.special_instructions}
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 p-4 border-t border-[#E2E7ED] bg-[#F7F9FB]">

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-[#D3DBE4] bg-white text-[#596673] hover:bg-[#F1F4F7] hover:text-[#242A31] rounded-xl text-xs font-semibold transition-all cursor-pointer"
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
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#354C63] hover:bg-[#293D52] text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Edit size={14} />
              <span>Edit Details</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default RateRequestDetailsModal;
