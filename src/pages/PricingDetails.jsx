
import React from 'react';
import {
  ArrowLeft,
  FileText,
  Edit,
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

function PricingDetails({ pricing, onBack, onEdit }) {
  if (!pricing) return null;

  const stConfig = statusConfig[pricing.status] || statusConfig.Draft;
  const currency = pricing.currency || 'USD';
  const buying = Number(pricing.total_buying_cost) || 0;
  const selling = Number(pricing.selling_price) || 0;
  const profit = selling - buying;
  const profitMargin =
    buying > 0 ? ((profit / buying) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#E2E7ED] gap-4">

        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74808C] hover:text-[#354C63] transition-colors mb-3 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Pricing List
          </button>

          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
              {pricing.pricing_id || pricing.id}
            </h2>

            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stConfig.className}`}
            >
              {stConfig.label}
            </span>
          </div>

          <p className="text-xs text-[#74808C] mt-1.5">
            Enquiry:{' '}
            <span className="font-semibold text-[#354C63]">
              {pricing.enquiry_no}
            </span>
            {' '}• Customer:{' '}
            <span className="font-semibold text-[#424B55]">
              {pricing.customer_name}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(pricing)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#354C63] hover:bg-[#293D52] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Edit size={14} />
          <span>Edit Pricing</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Shipment Mode */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
          <span className="text-xs text-[#74808C] font-medium block">
            Shipment Mode
          </span>
          <span className="text-sm font-bold text-[#242A31] mt-1 block">
            {pricing.shipment_mode || 'Sea'}
          </span>
        </div>

        {/* Buying Cost */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
          <span className="text-xs text-[#74808C] font-medium block">
            Total Buying Cost
          </span>
          <span className="text-sm font-bold text-[#424B55] mt-1 block">
            {currency}{' '}
            {buying.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Selling Price */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
          <span className="text-xs text-[#74808C] font-medium block">
            Customer Selling Price
          </span>
          <span className="text-sm font-bold text-[#16845B] mt-1 block">
            {currency}{' '}
            {selling.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Gross Margin */}
        <div className="bg-[#EDF2F7] p-4 rounded-2xl border border-[#D3DBE4] shadow-sm">
          <span className="text-xs text-[#354C63] font-bold block uppercase tracking-wider">
            Gross Margin
          </span>
          <span className="text-sm font-black text-[#354C63] mt-1 block">
            {currency} {profit.toFixed(2)} ({profitMargin}%)
          </span>
        </div>
      </div>

      {/* Details Box */}
      <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6 space-y-4">

        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E7ED]">
          <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
            <FileText size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              Pricing Specification & Calculation
            </h3>
            <p className="text-xs text-[#74808C]">
              Breakdown of buying cost baseline and margin policy
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">

          {/* Margin Formulation */}
          <div className="p-3 bg-[#F7F9FB] rounded-xl border border-[#E2E7ED]">
            <span className="text-[#74808C] block font-medium">
              Margin Formulation
            </span>

            <span className="font-semibold text-[#242A31] mt-1 block">
              {pricing.margin_type === 'percentage'
                ? `${pricing.margin_value}% Markup on Buying Cost`
                : `${currency} ${pricing.margin_value} Fixed Markup`}
            </span>
          </div>

          {/* Creation Date */}
          <div className="p-3 bg-[#F7F9FB] rounded-xl border border-[#E2E7ED]">
            <span className="text-[#74808C] block font-medium">
              Record Creation Date
            </span>

            <span className="font-semibold text-[#242A31] mt-1 block">
              {pricing.created_at
                ? new Date(pricing.created_at).toLocaleDateString()
                : '—'}
            </span>
          </div>
        </div>

        {/* Internal Notes */}
        {pricing.notes && (
          <div className="pt-2 text-xs">
            <span className="font-semibold text-[#424B55] block mb-2">
              Internal Notes & Terms:
            </span>

            <p className="p-3.5 bg-[#F7F9FB] rounded-xl border border-[#E2E7ED] text-[#596673] leading-relaxed">
              {pricing.notes}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default PricingDetails;
