import React from 'react';
import { Eye, Edit, UserX, Plus } from 'lucide-react';

/**
 * CustomerTable component
 * Renders the tabular display of customers or an empty state when no customer records exist.
 * Configured for future integration with Django REST Framework serializers.
 */
function CustomerTable({
  customers = [],
  onViewCustomer,
  onEditCustomer,
  onAddCustomer,
}) {
  const statusStyles = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Pending: 'bg-orange-50 text-orange-700 border-orange-100',
    Inactive: 'bg-gray-100 text-gray-600 border-gray-200',
    Suspended: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer ID
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer Name
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer Type
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Country
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Email
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Phone
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
            {customers && customers.length > 0 ? (
              customers.map((cust, idx) => (
                <tr
                  key={cust.id || cust.customer_id || idx}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-semibold text-blue-700">
                    {cust.customer_id || cust.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                    {cust.name || cust.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {cust.customer_type || cust.type || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {cust.country || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-mono text-xs">
                    {cust.email || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {cust.phone || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        statusStyles[cust.status] || 'bg-gray-50 text-gray-700 border-gray-100'
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
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditCustomer && onEditCustomer(cust)}
                        title="Edit Customer"
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-3.5 shadow-xs">
                      <UserX size={26} className="text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">
                      No customers found
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-5">
                      Add your first customer to get started.
                    </p>
                    <button
                      type="button"
                      onClick={onAddCustomer}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
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
    </div>
  );
}

export default CustomerTable;
