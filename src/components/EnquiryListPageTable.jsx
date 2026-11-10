
import React, { useState } from 'react';
import {
  Eye,
  Edit,
  Trash2,
  FileX,
  Plus,
  AlertTriangle,
  Ship,
  Plane,
  Truck,
} from 'lucide-react';

// Status badge configuration
const statusConfig = {
  Pricing: {
    label: 'Pricing',
    className: 'bg-[#EDF2F7] text-[#354C63] border-[#D6E0E9]',
  },
  Pending: {
    label: 'Pending',
    className: 'bg-[#FBF2E2] text-[#A87527] border-[#F0DDB8]',
  },
  Quoted: {
    label: 'Quoted',
    className: 'bg-[#F0ECF5] text-[#745A91] border-[#E1D7EC]',
  },
  Completed: {
    label: 'Completed',
    className: 'bg-[#E8F5EF] text-[#16845B] border-[#C8E8D7]',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-[#FCEEEE] text-[#C45151] border-[#F3D0D0]',
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status || 'Pending',
    className: 'bg-[#F1F4F7] text-[#74808C] border-[#E2E7ED]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  );
}

// Transport mode badge
function ModeBadge({ mode }) {
  const isAir = mode === 'Air';
  const isLand = mode === 'Land' || mode === 'Road';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${isAir
          ? 'bg-[#EDF2F7] text-[#647E96] border-[#D6E0E9]'
          : isLand
            ? 'bg-[#FBF2E2] text-[#A87527] border-[#F0DDB8]'
            : 'bg-[#F0ECF5] text-[#745A91] border-[#E1D7EC]'
        }`}
    >
      {isAir ? (
        <Plane size={11} />
      ) : isLand ? (
        <Truck size={11} />
      ) : (
        <Ship size={11} />
      )}
      {mode}
    </span>
  );
}

/**
 * EnquiryListPageTable
 * Displays freight enquiries with View, Edit, and Delete actions.
 */
function EnquiryListPageTable({
  enquiries = [],
  onViewEnquiry,
  onEditEnquiry,
  onDeleteEnquiry,
  onCreateEnquiry,
  onStatusChange,
}) {
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);

  return (
    <div className="bg-white rounded-xl border border-[#E2E7ED] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">

          {/* Table Header */}
          <thead>
            <tr className="bg-[#354C63] border-b border-[#293D52]">
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Enquiry No
              </th>

              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Customer
              </th>

              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Port of Loading (POL)
              </th>

              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Port of Discharge (POD)
              </th>

              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Mode
              </th>

              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Status
              </th>

              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#E2E7ED]">
            {enquiries && enquiries.length > 0 ? (
              enquiries.map((enq, idx) => (
                <tr
                  key={enq.id || enq.enquiry_no || idx}
                  className={`hover:bg-[#EEF2F6] transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F9FB]'
                    }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#354C63] text-xs">
                    {enq.id || enq.enquiry_no}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#242A31]">
                    {enq.customer || enq.customer_name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-[#596673]">
                    {enq.pol || '—'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-[#596673]">
                    {enq.pod || '—'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <ModeBadge
                      mode={enq.mode || enq.shipment_mode || 'Sea'}
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={enq.status || 'Pending'} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">

                      {/* View */}
                      <button
                        type="button"
                        onClick={() =>
                          onViewEnquiry && onViewEnquiry(enq)
                        }
                        title="View Enquiry"
                        className="p-1.5 text-[#8995A1] hover:text-[#354C63] hover:bg-[#EDF2F7] rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() =>
                          onEditEnquiry && onEditEnquiry(enq)
                        }
                        title="Edit Enquiry"
                        className="p-1.5 text-[#8995A1] hover:text-[#16845B] hover:bg-[#E8F5EF] rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setEnquiryToDelete(enq)}
                        title="Delete Enquiry"
                        className="p-1.5 text-[#8995A1] hover:text-[#C45151] hover:bg-[#FCEEEE] rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (

              /* Empty State */
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">

                    <div className="w-14 h-14 rounded-2xl bg-[#F1F4F7] border border-[#E2E7ED] flex items-center justify-center text-[#74808C] mb-3.5">
                      <FileX size={26} />
                    </div>

                    <h3 className="text-base font-semibold text-[#242A31]">
                      No enquiries found
                    </h3>

                    <p className="text-sm text-[#74808C] mt-1 mb-5">
                      Create your first freight pricing enquiry to get started.
                    </p>

                    <button
                      type="button"
                      onClick={onCreateEnquiry}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#354C63] hover:bg-[#293D52] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
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

      {/* Delete Confirmation Modal */}
      {enquiryToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#100F0E]/55 backdrop-blur-sm transition-opacity"
          onClick={() => setEnquiryToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-[#E2E7ED] max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FCEEEE] text-[#C45151] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#242A31]">
                  Delete Freight Enquiry
                </h4>

                <p className="text-xs text-[#74808C]">
                  {enquiryToDelete.id || enquiryToDelete.enquiry_no}
                </p>
              </div>
            </div>

            {/* Confirmation Message */}
            <p className="text-sm text-[#596673] mb-6">
              Are you sure you want to delete enquiry{' '}
              <span className="font-semibold text-[#242A31]">
                &quot;{enquiryToDelete.id || enquiryToDelete.enquiry_no}&quot;
              </span>{' '}
              for customer{' '}
              <span className="font-semibold text-[#242A31]">
                {enquiryToDelete.customer || enquiryToDelete.customer_name}
              </span>
              ?
            </p>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEnquiryToDelete(null)}
                className="px-4 py-2 border border-[#D3DBE4] text-[#354C63] hover:bg-[#EEF2F6] text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Keep Enquiry
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onDeleteEnquiry) {
                    onDeleteEnquiry(enquiryToDelete);
                  }
                  setEnquiryToDelete(null);
                }}
                className="px-4 py-2 bg-[#C45151] hover:bg-[#A93F3F] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
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
