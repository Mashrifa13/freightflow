import React, { useState } from 'react';
import { Eye, Edit, Trash2, FileX, Plus, AlertTriangle, Ship, Plane, Truck } from 'lucide-react';

// ── Status badge config ────────────────────────────────────────────────────────
const statusConfig = {
  Pricing: { label: 'Pricing', className: 'bg-blue-50 text-blue-700 border-blue-100' },
  Pending: { label: 'Pending', className: 'bg-orange-50 text-orange-700 border-orange-100' },
  Quoted: { label: 'Quoted', className: 'bg-purple-50 text-purple-700 border-purple-100' },
  Completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  Rejected: { label: 'Rejected', className: 'bg-red-50 text-red-600 border-red-100' },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}>
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
      {mode}
    </span>
  );
}

/**
 * EnquiryListPageTable
 * Renders the tabular display of freight enquiries with View, Edit, and Delete actions.
 *
 * Props:
 *   enquiries       – array of enquiry objects to display
 *   onViewEnquiry   – callback(enq) to open the quick-view modal
 *   onEditEnquiry   – callback(enq) to navigate to the edit form
 *   onDeleteEnquiry – callback(enq) called after delete confirmation
 *   onCreateEnquiry – callback to navigate to create form (used in empty state)
 */
function EnquiryListPageTable({
  enquiries = [],
  onViewEnquiry,
  onEditEnquiry,
  onDeleteEnquiry,
  onCreateEnquiry,
}) {
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Enquiry No
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Port of Loading (POL)
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Port of Discharge (POD)
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Mode
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {enquiries && enquiries.length > 0 ? (
              enquiries.map((enq, idx) => (
                <tr
                  key={enq.id || enq.enquiry_no || idx}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-700 text-xs">
                    {enq.id || enq.enquiry_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                    {enq.customer || enq.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {enq.pol || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {enq.pod || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ModeBadge mode={enq.mode || enq.shipment_mode || 'Sea'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={enq.status || 'Pending'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View */}
                      <button
                        type="button"
                        onClick={() => onViewEnquiry && onViewEnquiry(enq)}
                        title="View Enquiry"
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>
                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => onEditEnquiry && onEditEnquiry(enq)}
                        title="Edit Enquiry"
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>
                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setEnquiryToDelete(enq)}
                        title="Delete Enquiry"
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-3.5 shadow-xs">
                      <FileX size={26} className="text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">No enquiries found</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-5">
                      Create your first freight pricing enquiry to get started.
                    </p>
                    <button
                      type="button"
                      onClick={onCreateEnquiry}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Create Enquiry</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Delete Confirmation Modal ────────────────────────────────────────── */}
      {enquiryToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          onClick={() => setEnquiryToDelete(null)}
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
                <h4 className="text-base font-bold text-gray-800">Delete Freight Enquiry</h4>
                <p className="text-xs text-gray-500">{enquiryToDelete.id || enquiryToDelete.enquiry_no}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete enquiry{' '}
              <span className="font-semibold text-gray-800">
                &quot;{enquiryToDelete.id || enquiryToDelete.enquiry_no}&quot;
              </span>{' '}
              for customer{' '}
              <span className="font-semibold text-gray-800">
                {enquiryToDelete.customer || enquiryToDelete.customer_name}
              </span>
              ?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEnquiryToDelete(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Keep Enquiry
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteEnquiry) onDeleteEnquiry(enquiryToDelete);
                  setEnquiryToDelete(null);
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

export default EnquiryListPageTable;
