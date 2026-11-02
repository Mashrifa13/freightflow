import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  BarChart2,
  DollarSign,
  Edit,
  Award,
  TrendingDown,
  Layers,
  FileText,
  CheckCircle2,
} from 'lucide-react';

const statusConfig = {
  'In Progress': {
    label: 'In Progress',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  'Agent Selected': {
    label: 'Agent Selected',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  Finalized: {
    label: 'Finalized',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Archived: {
    label: 'Archived',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
};

function RateComparisonDetails({ comparison, onBack, onEdit }) {
  if (!comparison) return null;

  const stConfig = statusConfig[comparison.status] || statusConfig['In Progress'];
  const currency = comparison.currency || 'USD';
  const quotes = comparison.quotations || [];

  // Lowest quote
  const lowestCostQuote =
    quotes.length > 0
      ? quotes.reduce((min, curr) => {
          const currAmt = Number(curr.total_buying_rate) || 0;
          const minAmt = Number(min.total_buying_rate) || 0;
          return currAmt < minAmt ? curr : min;
        }, quotes[0])
      : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-gray-100 gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Rate Comparisons
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {comparison.comparison_id || comparison.id}
            </h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stConfig.className}`}
            >
              {stConfig.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Comparison for RFQ <span className="font-semibold text-blue-700">{comparison.rfq_no}</span> • Customer:{' '}
            <span className="font-semibold text-gray-700">{comparison.customer_name}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(comparison)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Edit size={14} />
          <span>Edit Comparison</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Route</span>
          <span className="text-sm font-bold text-gray-800 mt-1 block truncate">
            {comparison.pol || '—'} → {comparison.pod || '—'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Quotes Compared</span>
          <span className="text-sm font-bold text-gray-800 mt-1 block">
            {quotes.length} Overseas Agents
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Lowest Landed Cost</span>
          <span className="text-sm font-bold text-emerald-600 mt-1 block">
            {comparison.lowest_cost != null
              ? `${currency} ${Number(comparison.lowest_cost).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : '—'}
          </span>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-200 shadow-sm">
          <span className="text-xs text-blue-800 font-bold block uppercase tracking-wider">
            Selected Winner
          </span>
          <span className="text-sm font-black text-blue-700 mt-1 block truncate">
            {comparison.selected_agent_name || 'None Awarded Yet'}
          </span>
        </div>
      </div>

      {/* Matrix Detailed View */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <BarChart2 size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Quotation Comparison Matrix ({currency})
            </h3>
            <p className="text-xs text-gray-400">
              Full breakdown across freight, origin, destination, and other charges
            </p>
          </div>
        </div>

        {quotes.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-6 text-center">
            No quotations included in this comparison record.
          </p>
        ) : (
          <div className="overflow-x-auto pb-2">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 bg-gray-50/80 font-bold text-gray-500 uppercase tracking-wider w-48">
                    Component
                  </th>
                  {quotes.map((q) => {
                    const isSelected =
                      comparison.selected_agent_name === q.agent_name ||
                      comparison.selected_agent_id === (q.agent_id || q.agent_name);
                    const isLowest =
                      lowestCostQuote &&
                      (q.quotation_no || q.id) === (lowestCostQuote.quotation_no || lowestCostQuote.id);

                    return (
                      <th
                        key={q.quotation_no || q.id}
                        className={`py-3 px-4 text-center min-w-[210px] ${
                          isSelected
                            ? 'bg-blue-50/80 border-x-2 border-t-2 border-blue-500 rounded-t-xl'
                            : isLowest
                            ? 'bg-emerald-50/40 border-x border-t border-emerald-200 rounded-t-xl'
                            : 'bg-gray-50/50'
                        }`}
                      >
                        <span className="font-bold text-sm text-gray-800 block">
                          {q.agent_name}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400 block mt-0.5">
                          {q.quotation_no || q.id}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                            <Award size={11} /> Awarded Partner
                          </span>
                        )}
                        {!isSelected && isLowest && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <TrendingDown size={11} /> Lowest Cost
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {/* Freight */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50/30">
                    A. Freight Charges
                  </td>
                  {quotes.map((q) => (
                    <td key={q.quotation_no || q.id} className="py-3 px-4 text-center font-medium text-gray-800">
                      {currency} {Number(q.total_freight || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Origin */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50/30">
                    B. Origin Charges
                  </td>
                  {quotes.map((q) => (
                    <td key={q.quotation_no || q.id} className="py-3 px-4 text-center font-medium text-gray-800">
                      {currency} {Number(q.total_origin || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Destination */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50/30">
                    C. Destination Charges
                  </td>
                  {quotes.map((q) => (
                    <td key={q.quotation_no || q.id} className="py-3 px-4 text-center font-medium text-gray-800">
                      {currency} {Number(q.total_destination || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Other */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50/30">
                    D. Other Charges
                  </td>
                  {quotes.map((q) => (
                    <td key={q.quotation_no || q.id} className="py-3 px-4 text-center font-medium text-gray-800">
                      {currency} {Number(q.total_other || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Total Landed Cost */}
                <tr className="bg-gray-100/70 border-y-2 border-gray-200">
                  <td className="py-3.5 px-4 font-bold text-gray-900 text-sm">
                    Total Buying Rate
                  </td>
                  {quotes.map((q) => {
                    const isLowest =
                      lowestCostQuote &&
                      (q.quotation_no || q.id) === (lowestCostQuote.quotation_no || lowestCostQuote.id);
                    return (
                      <td
                        key={q.quotation_no || q.id}
                        className={`py-3.5 px-4 text-center font-black text-sm ${
                          isLowest ? 'text-emerald-600 bg-emerald-50/50' : 'text-blue-700'
                        }`}
                      >
                        {currency} {Number(q.total_buying_rate || 0).toFixed(2)}
                      </td>
                    );
                  })}
                </tr>

                {/* Rate Validity */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50/30">
                    Rate Validity
                  </td>
                  {quotes.map((q) => (
                    <td key={q.quotation_no || q.id} className="py-3 px-4 text-center text-gray-600">
                      <div className="flex items-center justify-center gap-1 text-amber-700 font-medium">
                        <Clock size={12} className="text-amber-500" />
                        <span>{q.validity_date || '—'}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Remarks & Transit Conditions */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-gray-700 bg-gray-50/30">
                    Transit Time & Terms
                  </td>
                  {quotes.map((q) => (
                    <td key={q.quotation_no || q.id} className="py-3 px-4 text-center text-gray-600">
                      <p className="italic text-[11px]">{q.remarks || 'Standard forwarding terms'}</p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Remarks / Evaluation Notes */}
        {comparison.remarks && (
          <div className="pt-3 text-xs">
            <span className="font-semibold text-gray-600 block mb-1">
              Internal Award Justification & Remarks:
            </span>
            <p className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-700">
              {comparison.remarks}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default RateComparisonDetails;

