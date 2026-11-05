import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  FileCheck,
  FileText,
  DollarSign,
  Edit,
  Tag,
  Ship,
  Plane,
  Truck,
} from 'lucide-react';

const statusConfig = {
  'Pending Review': {
    label: 'Pending Review',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  Accepted: {
    label: 'Accepted',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  Expired: {
    label: 'Expired',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
};

function AgentQuotationDetails({ quotation, onBack, onEdit }) {
  if (!quotation) return null;

  const stConfig = statusConfig[quotation.status] || statusConfig['Pending Review'];
  const currency = quotation.currency || 'USD';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-gray-100 gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Agent Quotations
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {quotation.quotation_no || quotation.id}
            </h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stConfig.className}`}
            >
              {stConfig.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Received from <span className="font-semibold text-gray-700">{quotation.agent_name}</span> for{' '}
            <span className="font-semibold text-blue-700">{quotation.rfq_no}</span> on{' '}
            {quotation.quotation_date || '—'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(quotation)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Edit size={14} />
          <span>Edit Quotation</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Responding Agent</span>
          <span className="text-sm font-bold text-gray-800 mt-1 block truncate">
            {quotation.agent_name || '—'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Route</span>
          <span className="text-sm font-bold text-blue-700 mt-1 block truncate">
            {quotation.pol || '—'} → {quotation.pod || '—'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Rate Validity</span>
          <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-amber-700">
            <Clock size={15} className="text-amber-500" />
            <span>{quotation.validity_date || '—'}</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <span className="text-xs text-emerald-800 font-bold block uppercase tracking-wider">
            Total Buying Rate
          </span>
          <span className="text-lg font-black text-emerald-700 mt-0.5 block">
            {currency}{' '}
            {Number(quotation.total_buying_rate || 0).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* Charge Breakdown Sections */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <DollarSign size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Detailed Charge Breakdown
            </h3>
            <p className="text-xs text-gray-400">
              Itemized breakdown of freight, origin, destination and extra buying rates
            </p>
          </div>
        </div>

        {/* 1. Freight Charges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              A. Freight Charges
            </h4>
            <span className="text-xs font-bold text-gray-800">
              Subtotal: {currency} {Number(quotation.total_freight || 0).toFixed(2)}
            </span>
          </div>
          <div className="bg-gray-50/60 rounded-xl border border-gray-100 divide-y divide-gray-100 text-xs">
            {quotation.freight_charges && quotation.freight_charges.length > 0 ? (
              quotation.freight_charges.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <span className="font-medium text-gray-700">{item.description}</span>
                  <span className="font-bold text-gray-800">
                    {currency} {Number(item.amount || 0).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-3 text-gray-400 italic">No freight charges specified.</p>
            )}
          </div>
        </div>

        {/* 2. Origin Charges */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              B. Origin Charges
            </h4>
            <span className="text-xs font-bold text-gray-800">
              Subtotal: {currency} {Number(quotation.total_origin || 0).toFixed(2)}
            </span>
          </div>
          <div className="bg-gray-50/60 rounded-xl border border-gray-100 divide-y divide-gray-100 text-xs">
            {quotation.origin_charges && quotation.origin_charges.length > 0 ? (
              quotation.origin_charges.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <span className="font-medium text-gray-700">{item.description}</span>
                  <span className="font-bold text-gray-800">
                    {currency} {Number(item.amount || 0).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-3 text-gray-400 italic">No origin charges specified.</p>
            )}
          </div>
        </div>

        {/* 3. Destination Charges */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              C. Destination Charges
            </h4>
            <span className="text-xs font-bold text-gray-800">
              Subtotal: {currency} {Number(quotation.total_destination || 0).toFixed(2)}
            </span>
          </div>
          <div className="bg-gray-50/60 rounded-xl border border-gray-100 divide-y divide-gray-100 text-xs">
            {quotation.destination_charges && quotation.destination_charges.length > 0 ? (
              quotation.destination_charges.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <span className="font-medium text-gray-700">{item.description}</span>
                  <span className="font-bold text-gray-800">
                    {currency} {Number(item.amount || 0).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-3 text-gray-400 italic">No destination charges specified.</p>
            )}
          </div>
        </div>

        {/* 4. Other Charges */}
        {quotation.other_charges && quotation.other_charges.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                D. Other / Contingency Charges
              </h4>
              <span className="text-xs font-bold text-gray-800">
                Subtotal: {currency} {Number(quotation.total_other || 0).toFixed(2)}
              </span>
            </div>
            <div className="bg-gray-50/60 rounded-xl border border-gray-100 divide-y divide-gray-100 text-xs">
              {quotation.other_charges.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <span className="font-medium text-gray-700">{item.description}</span>
                  <span className="font-bold text-gray-800">
                    {currency} {Number(item.amount || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Summary Row */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
          <span className="text-sm font-bold text-blue-900">
            Total Landed Buying Cost
          </span>
          <span className="text-xl font-black text-blue-700">
            {currency}{' '}
            {Number(quotation.total_buying_rate || 0).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Remarks / Terms */}
        {quotation.remarks && (
          <div className="pt-2 text-xs">
            <span className="font-semibold text-gray-600 block mb-1">
              Remarks, Free Time & Conditions:
            </span>
            <p className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-700">
              {quotation.remarks}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default AgentQuotationDetails;

