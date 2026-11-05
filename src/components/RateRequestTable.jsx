import React from 'react';
import { Eye, Edit, FileX, Plus, Ship, Plane, Truck, Calendar, Clock } from 'lucide-react';

const statusConfig = {
  Draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  Sent: {
    label: 'Sent',
    className: 'bg-blue-50 text-blue-700 border-blue-100',
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

function RateRequestTable({
  rateRequests = [],
  onViewRateRequest,
  onEditRateRequest,
  onCreateRateRequest,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                RFQ Number
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Enquiry No.
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Mode
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                POL / POD
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Request Date
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Deadline
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
                    className={`hover:bg-blue-50/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-blue-700 text-xs">
                      {rfqId}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-700 text-xs">
                      {enqId}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-800">
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
                        <span>{requestDate}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5 text-amber-700">
                        <Clock size={13} className="text-amber-500" />
                        <span>{deadline}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewRateRequest && onViewRateRequest(req)}
                          title="View Rate Request Details"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditRateRequest && onEditRateRequest(req)}
                          title="Edit Rate Request"
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-3.5 shadow-xs">
                      <FileX size={26} className="text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">
                      No Rate Requests Found
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-5">
                      Generate your first rate request (RFQ) from an active enquiry to request quotes from agents.
                    </p>
                    <button
                      type="button"
                      onClick={onCreateRateRequest}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
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

