import React from 'react';
import { Eye, Edit, FileX, Plus, Ship, Plane, Truck, DollarSign, TrendingUp } from 'lucide-react';

const statusConfig = {
  Draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  'Pending Approval': {
    label: 'Pending Approval',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  Approved: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Quoted: {
    label: 'Quoted to Customer',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  Rejected: {
    label: 'Rejected',
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

function PricingTable({
  pricingList = [],
  onViewPricing,
  onEditPricing,
  onCreatePricing,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Pricing ID
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Enquiry Number
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer Name
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Shipment Mode
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Total Buying Cost
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Selling Price
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
            {pricingList && pricingList.length > 0 ? (
              pricingList.map((item, idx) => {
                const pricingId = item.pricing_id || item.id;
                const enqNo = item.enquiry_no || item.enquiry_id || '—';
                const customer = item.customer_name || item.customer || '—';
                const mode = item.shipment_mode || item.mode || 'Sea';
                const currency = item.currency || 'USD';

                const buyingCost =
                  item.total_buying_cost != null
                    ? `${currency} ${Number(item.total_buying_cost).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : '—';

                const sellingPrice =
                  item.selling_price != null
                    ? `${currency} ${Number(item.selling_price).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : '—';

                return (
                  <tr
                    key={pricingId || idx}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    {/* Pricing ID */}
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-blue-700 text-xs">
                      {pricingId}
                    </td>

                    {/* Enquiry Number */}
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-700 text-xs">
                      {enqNo}
                    </td>

                    {/* Customer Name */}
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-gray-800">
                      {customer}
                    </td>

                    {/* Shipment Mode */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <ModeBadge mode={mode} />
                    </td>

                    {/* Total Buying Cost */}
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-gray-700">
                      {buyingCost}
                    </td>

                    {/* Selling Price */}
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-emerald-600">
                      {sellingPrice}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewPricing && onViewPricing(item)}
                          title="View Pricing Details"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditPricing && onEditPricing(item)}
                          title="Edit Pricing"
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
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-3.5 shadow-xs">
                      <FileX size={26} className="text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">
                      No Pricing Records Found
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-5">
                      Calculate buying cost markups and build customer selling prices for pending enquiries.
                    </p>
                    <button
                      type="button"
                      onClick={onCreatePricing}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Create Pricing</span>
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

export default PricingTable;

