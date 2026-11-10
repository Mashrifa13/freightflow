
import React from 'react';
import {
  Eye,
  Edit,
  FileX,
  Plus,
  Ship,
  Plane,
  Truck,
  Calendar,
  Clock,
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
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${isAir
        ? 'bg-[#EDF2F7] text-[#354C63] border-[#D3DBE4]'
        : isLand
          ? 'bg-[#FBF2E2] text-[#A87525] border-[#F0DFC0]'
          : 'bg-[#F0ECF7] text-[#75618F] border-[#E1D8EF]'
        }`}
    >
      {isAir ? (
        <Plane size={11} />
      ) : isLand ? (
        <Truck size={11} />
      ) : (
        <Ship size={11} />
      )}
      {mode || 'Sea'}
    </span>
  );
}

function RateRequestTable({
  rateRequests = [],
  onViewRateRequest,
  onEditRateRequest,
  onCreateRateRequest,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">

          {/* Table Header */}
          <thead>
            <tr className="bg-[#354C63] border-b border-[#354C63]">
              {[
                'RFQ Number',
                'Enquiry No.',
                'Customer',
                'Mode',
                'POL / POD',
                'Request Date',
                'Deadline',
                'Status',
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}

              <th
                scope="col"
                className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap text-right"
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#E2E7ED]">
            {rateRequests && rateRequests.length > 0 ? (
              rateRequests.map((req, idx) => {
                const rfqId = req.rfq_no || req.id;
                const enqId = req.enquiry_no || req.enquiry_id || '—';
                const customer = req.customer_name || req.customer || '—';
                const mode = req.shipment_mode || req.mode || 'Sea';
                const polPod = `${req.pol || '—'} → ${req.pod || '—'}`;
                const requestDate = req.request_date || '—';
                const deadline = req.response_deadline || '—';

                return (
                  <tr
                    key={rfqId || idx}
                    className={`transition-colors hover:bg-[#EEF2F6] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F9FB]'
                      }`}
                  >
                    {/* RFQ Number */}
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-[#354C63] text-xs">
                      {rfqId}
                    </td>

                    {/* Enquiry Number */}
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-[#596673] text-xs">
                      {enqId}
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-[#242A31]">
                      {customer}
                    </td>

                    {/* Mode */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <ModeBadge mode={mode} />
                    </td>

                    {/* POL / POD */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-[#596673]">
                      {polPod}
                    </td>

                    {/* Request Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-[#596673]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#74808C]" />
                        <span>{requestDate}</span>
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5 text-[#A87525]">
                        <Clock size={13} className="text-[#C28A35]" />
                        <span>{deadline}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            onViewRateRequest && onViewRateRequest(req)
                          }
                          title="View Rate Request Details"
                          className="p-1.5 text-[#74808C] hover:text-[#354C63] hover:bg-[#EAF0F5] rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onEditRateRequest && onEditRateRequest(req)
                          }
                          title="Edit Rate Request"
                          className="p-1.5 text-[#74808C] hover:text-[#16845B] hover:bg-[#E8F5EF] rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              /* Empty State */
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">

                    <div className="w-14 h-14 rounded-2xl bg-[#F1F4F7] border border-[#E2E7ED] flex items-center justify-center text-[#74808C] mb-3.5">
                      <FileX size={26} />
                    </div>

                    <h3 className="text-base font-semibold text-[#242A31]">
                      No Rate Requests Found
                    </h3>

                    <p className="text-sm text-[#74808C] mt-1 mb-5">
                      Generate your first rate request (RFQ) from an active
                      enquiry to request quotes from agents.
                    </p>

                    <button
                      type="button"
                      onClick={onCreateRateRequest}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#354C63] hover:bg-[#293D52] text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Create Rate Request</span>
                    </button>

                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RateRequestTable;
