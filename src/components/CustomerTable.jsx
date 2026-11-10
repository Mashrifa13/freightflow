
import React, { useState } from 'react';
import { Eye, Edit, Trash2, UserX, Plus, AlertTriangle } from 'lucide-react';

function CustomerTable({
  customers = [],
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onAddCustomer,
}) {
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const statusStyles = {
    Active: 'bg-[#E8F5EF] text-[#16845B] border-[#D0EBDD]',
    Pending: 'bg-[#FBF2E2] text-[#B17A25] border-[#F0E1C3]',
    Inactive: 'bg-[#F1F3F5] text-[#74808C] border-[#E2E7ED]',
    Suspended: 'bg-[#FCEEEE] text-[#C45151] border-[#F3DADA]',
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-[#354C63] border-b border-[#354C63]">
              {[
                'Customer ID',
                'Customer Name',
                'Customer Type',
                'Country',
                'Email',
                'Phone',
                'Status',
                'Actions',
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className={`px-6 py-4 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap ${heading === 'Actions' ? 'text-right' : ''
                    }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E7ED]">
            {customers && customers.length > 0 ? (
              customers.map((cust, idx) => (
                <tr
                  key={cust.id || cust.customer_id || idx}
                  className={`transition-colors hover:bg-[#EEF2F6] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F9FB]'
                    }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-semibold text-[#354C63]">
                    {cust.customer_code || cust.customer_id || cust.id}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#242A31]">
                    {cust.name || cust.customer_name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-[#596673]">
                    {cust.customer_type || cust.type || '—'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-[#596673]">
                    {cust.country || '—'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-[#596673] font-mono text-xs">
                    {cust.email || '—'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-[#596673]">
                    {cust.phone || '—'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[cust.status] ||
                        'bg-[#F1F3F5] text-[#74808C] border-[#E2E7ED]'
                        }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                      {cust.status || 'Active'}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewCustomer && onViewCustomer(cust)}
                        title="View Customer"
                        className="p-2 text-[#74808C] hover:text-[#354C63] hover:bg-[#EAF0F5] rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditCustomer && onEditCustomer(cust)}
                        title="Edit Customer"
                        className="p-2 text-[#74808C] hover:text-[#354C63] hover:bg-[#EAF0F5] rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomerToDelete(cust)}
                        title="Cancel / Delete Customer"
                        className="p-2 text-[#74808C] hover:text-[#C45151] hover:bg-[#FCEEEE] rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#F1F4F7] border border-[#E2E7ED] flex items-center justify-center text-[#74808C] mb-3.5">
                      <UserX size={26} />
                    </div>

                    <h3 className="text-base font-semibold text-[#242A31]">
                      No customers found
                    </h3>

                    <p className="text-sm text-[#74808C] mt-1 mb-5">
                      Add your first customer to get started.
                    </p>

                    <button
                      type="button"
                      onClick={onAddCustomer}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#354C63] hover:bg-[#293D52] text-white text-sm font-medium rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Add Customer</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#100F0E]/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
          onClick={() => setCustomerToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-[#E2E7ED] max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FCEEEE] text-[#C45151] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#242A31]">
                  Cancel / Delete Customer
                </h4>
                <p className="text-xs text-[#74808C] font-mono">
                  {customerToDelete.customer_code ||
                    customerToDelete.customer_id ||
                    customerToDelete.id}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#596673] mb-6">
              Are you sure you want to cancel and remove customer{' '}
              <span className="font-semibold text-[#242A31]">
                "{customerToDelete.name || customerToDelete.customer_name}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 border border-[#D3DBE4] text-[#596673] hover:bg-[#F1F4F7] text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Keep Customer
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onDeleteCustomer) {
                    onDeleteCustomer(customerToDelete);
                  }
                  setCustomerToDelete(null);
                }}
                className="px-4 py-2 bg-[#C45151] hover:bg-[#A93E3E] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
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

export default CustomerTable;
