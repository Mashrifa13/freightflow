
import React from 'react';
import {
  ArrowLeft,
  Clock,
  Edit,
  DollarSign,
} from 'lucide-react';

const statusConfig = {
  'Pending Review': {
    label: 'Pending Review',
    className: 'bg-[#FBF2E2] text-[#A87525] border-[#F0DFC0]',
  },
  Accepted: {
    label: 'Accepted',
    className: 'bg-[#E8F5EF] text-[#16845B] border-[#CDE8DA]',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-[#FCEEEE] text-[#C45151] border-[#F3D5D5]',
  },
  Expired: {
    label: 'Expired',
    className: 'bg-[#F1F4F7] text-[#596673] border-[#E2E7ED]',
  },
};

function AgentQuotationDetails({ quotation, onBack, onEdit }) {
  if (!quotation) return null;

  const stConfig =
    statusConfig[quotation.status] || statusConfig['Pending Review'];

  const currency = quotation.currency || 'USD';

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const chargeSectionClass =
    'bg-[#F7F9FB] rounded-xl border border-[#E2E7ED] divide-y divide-[#E2E7ED] text-xs';

  const chargeItemClass =
    'p-3.5 flex items-center justify-between gap-4';

  const renderCharges = (charges, emptyMessage) => (
    <div className={chargeSectionClass}>
      {charges && charges.length > 0 ? (
        charges.map((item, idx) => (
          <div key={idx} className={chargeItemClass}>
            <span className="font-medium text-[#596673]">
              {item.description}
            </span>

            <span className="font-bold text-[#242A31] whitespace-nowrap">
              {currency} {formatAmount(item.amount)}
            </span>
          </div>
        ))
      ) : (
        <p className="p-3.5 text-[#74808C] italic">
          {emptyMessage}
        </p>
      )}
    </div>
  );

  const renderChargeSection = (title, charges, total, emptyMessage) => (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h4 className="text-xs font-bold text-[#354C63] uppercase tracking-wider">
          {title}
        </h4>

        <span className="text-xs font-bold text-[#242A31]">
          Subtotal: {currency} {formatAmount(total)}
        </span>
      </div>

      {renderCharges(charges, emptyMessage)}
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#E2E7ED] gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74808C] hover:text-[#354C63] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Agent Quotations
          </button>

          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
              {quotation.quotation_no || quotation.id}
            </h2>

            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${stConfig.className}`}
            >
              {stConfig.label}
            </span>
          </div>

          <p className="text-xs text-[#74808C] mt-1">
            Received from{' '}
            <span className="font-semibold text-[#242A31]">
              {quotation.agent_name || '—'}
            </span>{' '}
            for{' '}
            <span className="font-semibold text-[#354C63]">
              {quotation.rfq_no || '—'}
            </span>{' '}
            on {quotation.quotation_date || '—'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(quotation)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#354C63] hover:bg-[#293D52] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Edit size={14} />
          <span>Edit Quotation</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Agent */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
          <span className="text-xs text-[#74808C] font-medium block">
            Responding Agent
          </span>

          <span className="text-sm font-bold text-[#242A31] mt-1 block truncate">
            {quotation.agent_name || '—'}
          </span>
        </div>

        {/* Route */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
          <span className="text-xs text-[#74808C] font-medium block">
            Route
          </span>

          <span className="text-sm font-bold text-[#354C63] mt-1 block truncate">
            {quotation.pol || '—'} → {quotation.pod || '—'}
          </span>
        </div>

        {/* Validity */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
          <span className="text-xs text-[#74808C] font-medium block">
            Rate Validity
          </span>

          <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-[#A87525]">
            <Clock size={15} className="text-[#C28A35]" />
            <span>{quotation.validity_date || '—'}</span>
          </div>
        </div>

        {/* Total Buying Rate */}
        <div className="bg-[#E8F5EF] p-4 rounded-2xl border border-[#CDE8DA] shadow-sm">
          <span className="text-xs text-[#16845B] font-bold block uppercase tracking-wider">
            Total Buying Rate
          </span>

          <span className="text-lg font-black text-[#16845B] mt-1 block">
            {currency} {formatAmount(quotation.total_buying_rate)}
          </span>
        </div>
      </div>

      {/* Charge Breakdown */}
      <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-5 sm:p-6 space-y-6">

        {/* Section Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E7ED]">
          <div className="w-10 h-10 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center flex-shrink-0">
            <DollarSign size={19} />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#242A31]">
              Detailed Charge Breakdown
            </h3>

            <p className="text-xs text-[#74808C] mt-0.5">
              Itemized breakdown of freight, origin, destination and extra buying rates
            </p>
          </div>
        </div>

        {/* A. Freight Charges */}
        {renderChargeSection(
          'A. Freight Charges',
          quotation.freight_charges,
          quotation.total_freight,
          'No freight charges specified.'
        )}

        {/* B. Origin Charges */}
        {renderChargeSection(
          'B. Origin Charges',
          quotation.origin_charges,
          quotation.total_origin,
          'No origin charges specified.'
        )}

        {/* C. Destination Charges */}
        {renderChargeSection(
          'C. Destination Charges',
          quotation.destination_charges,
          quotation.total_destination,
          'No destination charges specified.'
        )}

        {/* D. Other Charges */}
        {quotation.other_charges && quotation.other_charges.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-[#354C63] uppercase tracking-wider">
                D. Other / Contingency Charges
              </h4>

              <span className="text-xs font-bold text-[#242A31]">
                Subtotal: {currency} {formatAmount(quotation.total_other)}
              </span>
            </div>

            {renderCharges(
              quotation.other_charges,
              'No other charges specified.'
            )}
          </div>
        )}

        {/* Total Summary */}
        <div className="p-4 bg-[#EDF2F7] rounded-xl border border-[#D3DBE4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-sm font-bold text-[#354C63]">
            Total Landed Buying Cost
          </span>

          <span className="text-xl font-black text-[#354C63]">
            {currency} {formatAmount(quotation.total_buying_rate)}
          </span>
        </div>

        {/* Remarks / Terms */}
        {quotation.remarks && (
          <div className="pt-2 text-xs">
            <span className="font-semibold text-[#596673] block mb-2">
              Remarks, Free Time & Conditions:
            </span>

            <p className="p-3.5 bg-[#F7F9FB] rounded-xl border border-[#E2E7ED] text-[#596673] leading-relaxed">
              {quotation.remarks}
            </p>
          </div>
        )}

      </section>
    </div>
  );
}

export default AgentQuotationDetails;
