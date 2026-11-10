
import React from 'react';
import {
  Eye,
  Edit,
  FileX,
  Plus,
  Ship,
  Plane,
  Truck,
} from 'lucide-react';

const statusConfig = {
  Draft: {
    label: 'Draft',
    className: 'bg-[#F0F2F4] text-[#596673] border-[#E2E7ED]',
  },
  'Pending Approval': {
    label: 'Pending Approval',
    className: 'bg-[#FBF2E2] text-[#A87527] border-[#F1DFC0]',
  },
  Approved: {
    label: 'Approved',
    className: 'bg-[#E8F5EF] text-[#16845B] border-[#C9E9D8]',
  },
  Quoted: {
    label: 'Quoted to Customer',
    className: 'bg-[#EDF2F7] text-[#354C63] border-[#D3DBE4]',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-[#FCEEEE] text-[#C45151] border-[#F2D1D1]',
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
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${isAir
          ? 'bg-[#EDF2F7] text-[#354C63] border-[#D3DBE4]'
          : isLand
            ? 'bg-[#FBF2E2] text-[#A87527] border-[#F1DFC0]'
            : 'bg-[#F0EAF5] text-[#806394] border-[#E3D8EC]'
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

function PricingTable({
  pricingList = [],
  onViewPricing,
  onEditPricing,
  onCreatePricing,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">

          {/* Table Header */}
          <thead>
            <tr className="bg-[#354C63] border-b border-[#354C63]">
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Pricing ID
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Enquiry Number
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Customer Name
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Shipment Mode
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Total Buying Cost
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Selling Price
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#E2E7ED]">
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
                    className={`transition-colors hover:bg-[#EEF2F6] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F9FB]'
                      }`}
                  >

                    {/* Pricing ID */}
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-[#354C63] text-xs">
                      {pricingId}
                    </td>

                    {/* Enquiry Number */}
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-[#596673] text-xs">
                      {enqNo}
                    </td>

                    {/* Customer Name */}
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-[#242A31]">
                      {customer}
                    </td>

                    {/* Shipment Mode */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <ModeBadge mode={mode} />
                    </td>

                    {/* Total Buying Cost */}
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-[#596673]">
                      {buyingCost}
                    </td>

                    {/* Selling Price */}
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-[#16845B]">
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
                          className="p-1.5 text-[#74808C] hover:text-[#354C63] hover:bg-[#EDF2F7] rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditPricing && onEditPricing(item)}
                          title="Edit Pricing"
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
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">

                    <div className="w-14 h-14 rounded-2xl bg-[#F7F9FB] border border-[#E2E7ED] flex items-center justify-center text-[#74808C] mb-3.5">
                      <FileX size={26} />
                    </div>

                    <h3 className="text-base font-semibold text-[#242A31]">
                      No Pricing Records Found
                    </h3>

                    <p className="text-sm text-[#74808C] mt-1 mb-5">
                      Calculate buying cost markups and build customer selling prices for pending enquiries.
                    </p>

                    <button
                      type="button"
                      onClick={onCreatePricing}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#354C63] hover:bg-[#293D52] text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
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
