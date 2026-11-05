import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  Tag,
  DollarSign,
  TrendingUp,
  Edit,
  Ship,
  Plane,
  Truck,
  FileText,
} from 'lucide-react';

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

function PricingDetails({ pricing, onBack, onEdit }) {
  if (!pricing) return null;

  const stConfig = statusConfig[pricing.status] || statusConfig.Draft;
  const currency = pricing.currency || 'USD';
  const buying = Number(pricing.total_buying_cost) || 0;
  const selling = Number(pricing.selling_price) || 0;
  const profit = selling - buying;
  const profitMargin = buying > 0 ? ((profit / buying) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-gray-100 gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Pricing List
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {pricing.pricing_id || pricing.id}
            </h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stConfig.className}`}
            >
              {stConfig.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Enquiry: <span className="font-semibold text-blue-700">{pricing.enquiry_no}</span> • Customer:{' '}
            <span className="font-semibold text-gray-700">{pricing.customer_name}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(pricing)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Edit size={14} />
          <span>Edit Pricing</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Shipment Mode</span>
          <span className="text-sm font-bold text-gray-800 mt-1 block">
            {pricing.shipment_mode || 'Sea'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Total Buying Cost</span>
          <span className="text-sm font-bold text-gray-700 mt-1 block">
            {currency}{' '}
            {buying.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Customer Selling Price</span>
          <span className="text-sm font-bold text-emerald-600 mt-1 block">
            {currency}{' '}
            {selling.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <span className="text-xs text-emerald-800 font-bold block uppercase tracking-wider">
            Gross Margin
          </span>
          <span className="text-sm font-black text-emerald-700 mt-1 block">
            {currency} {profit.toFixed(2)} ({profitMargin}%)
          </span>
        </div>
      </div>

      {/* Details Box */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Pricing Specification & Calculation
            </h3>
            <p className="text-xs text-gray-400">
              Breakdown of buying cost baseline and margin policy
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-400 block font-medium">Margin Formulation</span>
            <span className="font-semibold text-gray-800 mt-0.5 block">
              {pricing.margin_type === 'percentage'
                ? `${pricing.margin_value}% Markup on Buying Cost`
                : `${currency} ${pricing.margin_value} Fixed Markup`}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-400 block font-medium">Record Creation Date</span>
            <span className="font-semibold text-gray-800 mt-0.5 block">
              {pricing.created_at ? new Date(pricing.created_at).toLocaleDateString() : '—'}
            </span>
          </div>
        </div>

        {pricing.notes && (
          <div className="pt-2 text-xs">
            <span className="font-semibold text-gray-600 block mb-1">
              Internal Notes & Terms:
            </span>
            <p className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-700">
              {pricing.notes}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default PricingDetails;

