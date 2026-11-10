
import React from 'react';
import {
  ArrowLeft,
  Clock,
  BarChart2,
  Edit,
  Award,
  TrendingDown,
} from 'lucide-react';

const statusConfig = {
  'In Progress': {
    label: 'In Progress',
    className: 'bg-[#FBF2E2] text-[#A87525] border-[#EBD8B5]',
  },
  'Agent Selected': {
    label: 'Agent Selected',
    className: 'bg-[#EDF2F7] text-[#354C63] border-[#D3DBE4]',
  },
  Finalized: {
    label: 'Finalized',
    className: 'bg-[#E8F5EF] text-[#16845B] border-[#C5E6D5]',
  },
  Archived: {
    label: 'Archived',
    className: 'bg-[#F1F4F7] text-[#74808C] border-[#E2E7ED]',
  },
};

function RateComparisonDetails({ comparison, onBack, onEdit }) {
  if (!comparison) return null;

  const stConfig =
    statusConfig[comparison.status] || statusConfig['In Progress'];

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#E2E7ED] gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74808C] hover:text-[#354C63] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Rate Comparisons
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
              {comparison.comparison_id || comparison.id}
            </h2>

            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stConfig.className}`}
            >
              {stConfig.label}
            </span>
          </div>

          <p className="text-xs text-[#74808C] mt-1">
            Comparison for RFQ{' '}
            <span className="font-semibold text-[#354C63]">
              {comparison.rfq_no}
            </span>
            {' '}• Customer:{' '}
            <span className="font-semibold text-[#242A31]">
              {comparison.customer_name}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(comparison)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#354C63] hover:bg-[#293D52] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Edit size={14} />
          <span>Edit Comparison</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Route */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
          <span className="text-xs text-[#74808C] font-medium block">
            Route
          </span>
          <span className="text-sm font-bold text-[#242A31] mt-1 block truncate">
            {comparison.pol || '—'} → {comparison.pod || '—'}
          </span>
        </div>

        {/* Quotes Compared */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
          <span className="text-xs text-[#74808C] font-medium block">
            Quotes Compared
          </span>
          <span className="text-sm font-bold text-[#242A31] mt-1 block">
            {quotes.length} Overseas Agents
          </span>
        </div>

        {/* Lowest Cost */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
          <span className="text-xs text-[#74808C] font-medium block">
            Lowest Landed Cost
          </span>
          <span className="text-sm font-bold text-[#16845B] mt-1 block">
            {comparison.lowest_cost != null
              ? `${currency} ${Number(comparison.lowest_cost).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
              : '—'}
          </span>
        </div>

        {/* Selected Winner */}
        <div className="bg-[#EDF2F7] p-4 rounded-2xl border border-[#D3DBE4] shadow-sm">
          <span className="text-xs text-[#354C63] font-bold block uppercase tracking-wider">
            Selected Winner
          </span>
          <span className="text-sm font-black text-[#354C63] mt-1 block truncate">
            {comparison.selected_agent_name || 'None Awarded Yet'}
          </span>
        </div>
      </div>

      {/* Matrix Detailed View */}
      <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6 space-y-5">

        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E7ED]">
          <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
            <BarChart2 size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              Quotation Comparison Matrix ({currency})
            </h3>
            <p className="text-xs text-[#74808C]">
              Full breakdown across freight, origin, destination, and other charges
            </p>
          </div>
        </div>

        {quotes.length === 0 ? (
          <p className="text-xs text-[#74808C] italic py-6 text-center">
            No quotations included in this comparison record.
          </p>
        ) : (
          <div className="overflow-x-auto pb-2">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E7ED]">
                  <th className="py-3 px-4 bg-[#354C63] font-bold text-white uppercase tracking-wider w-48">
                    Component
                  </th>

                  {quotes.map((q) => {
                    const isSelected =
                      comparison.selected_agent_name === q.agent_name ||
                      comparison.selected_agent_id ===
                      (q.agent_id || q.agent_name);

                    const isLowest =
                      lowestCostQuote &&
                      (q.quotation_no || q.id) ===
                      (lowestCostQuote.quotation_no ||
                        lowestCostQuote.id);

                    return (
                      <th
                        key={q.quotation_no || q.id}
                        className={`py-3 px-4 text-center min-w-[210px] ${isSelected
                            ? 'bg-[#EDF2F7] border-x-2 border-t-2 border-[#354C63] rounded-t-xl'
                            : isLowest
                              ? 'bg-[#E8F5EF] border-x border-t border-[#C5E6D5] rounded-t-xl'
                              : 'bg-[#F7F9FB]'
                          }`}
                      >
                        <span className="font-bold text-sm text-[#242A31] block">
                          {q.agent_name}
                        </span>

                        <span className="text-[11px] font-medium text-[#74808C] block mt-0.5">
                          {q.quotation_no || q.id}
                        </span>

                        {isSelected && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#354C63] text-white">
                            <Award size={11} />
                            Awarded Partner
                          </span>
                        )}

                        {!isSelected && isLowest && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5EF] text-[#16845B]">
                            <TrendingDown size={11} />
                            Lowest Cost
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E7ED]">

                {/* Freight */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    A. Freight Charges
                  </td>

                  {quotes.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center font-medium text-[#242A31]"
                    >
                      {currency} {Number(q.total_freight || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Origin */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    B. Origin Charges
                  </td>

                  {quotes.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center font-medium text-[#242A31]"
                    >
                      {currency} {Number(q.total_origin || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Destination */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    C. Destination Charges
                  </td>

                  {quotes.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center font-medium text-[#242A31]"
                    >
                      {currency} {Number(q.total_destination || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Other */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    D. Other Charges
                  </td>

                  {quotes.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center font-medium text-[#242A31]"
                    >
                      {currency} {Number(q.total_other || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Total Landed Cost */}
                <tr className="bg-[#EDF2F7] border-y-2 border-[#D3DBE4]">
                  <td className="py-3.5 px-4 font-bold text-[#242A31] text-sm">
                    Total Buying Rate
                  </td>

                  {quotes.map((q) => {
                    const isLowest =
                      lowestCostQuote &&
                      (q.quotation_no || q.id) ===
                      (lowestCostQuote.quotation_no ||
                        lowestCostQuote.id);

                    return (
                      <td
                        key={q.quotation_no || q.id}
                        className={`py-3.5 px-4 text-center font-black text-sm ${isLowest
                            ? 'text-[#16845B] bg-[#E8F5EF]'
                            : 'text-[#354C63]'
                          }`}
                      >
                        {currency} {Number(q.total_buying_rate || 0).toFixed(2)}
                      </td>
                    );
                  })}
                </tr>

                {/* Rate Validity */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    Rate Validity
                  </td>

                  {quotes.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center text-[#596673]"
                    >
                      <div className="flex items-center justify-center gap-1 text-[#A87525] font-medium">
                        <Clock size={12} />
                        <span>{q.validity_date || '—'}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Remarks & Transit Conditions */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    Transit Time & Terms
                  </td>

                  {quotes.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center text-[#596673]"
                    >
                      <p className="italic text-[11px]">
                        {q.remarks || 'Standard forwarding terms'}
                      </p>
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
            <span className="font-semibold text-[#596673] block mb-1">
              Internal Award Justification & Remarks:
            </span>

            <p className="p-3.5 bg-[#F7F9FB] rounded-xl border border-[#E2E7ED] text-[#354C63]">
              {comparison.remarks}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default RateComparisonDetails;
