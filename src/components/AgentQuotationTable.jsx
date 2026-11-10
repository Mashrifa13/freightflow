
import React from 'react';
import {
  Eye,
  Edit,
  FileX,
  Plus,
  Calendar,
  Clock,
  Building2,
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

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig['Pending Review'];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  );
}

function AgentQuotationTable({
  quotations = [],
  onViewQuotation,
  onEditQuotation,
  onCreateQuotation,
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">

          {/* Table Header */}
          <thead>
            <tr className="bg-[#354C63] border-b border-[#293D52]">
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Quotation No.
              </th>

              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                RFQ Number
              </th>

              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Agent Name
              </th>

              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Quote Date
              </th>

              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Validity Date
              </th>

              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Total Buying Rate
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

            {quotations && quotations.length > 0 ? (
              quotations.map((quote, idx) => {
                const quoteNo = quote.quotation_no || quote.id;
                const rfqNo = quote.rfq_no || quote.rfq_id || '—';
                const agentName = quote.agent_name || quote.agent || '—';
                const quoteDate = quote.quotation_date || quote.date || '—';
                const validityDate = quote.validity_date || '—';
                const currency = quote.currency || 'USD';

                const totalRate =
                  quote.total_buying_rate != null
                    ? Number(quote.total_buying_rate).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    : '0.00';

                return (
                  <tr
                    key={quoteNo || idx}
                    className={`transition-colors hover:bg-[#EEF2F6] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F9FB]'
                      }`}
                  >
                    {/* Quotation Number */}
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-[#354C63] text-xs">
                      {quoteNo}
                    </td>

                    {/* RFQ Number */}
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-[#596673] text-xs">
                      {rfqNo}
                    </td>

                    {/* Agent Name */}
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-[#242A31]">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={14} className="text-[#74808C]" />
                        <span>{agentName}</span>
                      </div>
                    </td>

                    {/* Quote Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-[#596673]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#74808C]" />
                        <span>{quoteDate}</span>
                      </div>
                    </td>

                    {/* Validity Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5 text-[#A87525] font-medium">
                        <Clock size={13} className="text-[#C28A35]" />
                        <span>{validityDate}</span>
                      </div>
                    </td>

                    {/* Total Buying Rate */}
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-[#16845B]">
                      {currency} {totalRate}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={quote.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">

                        <button
                          type="button"
                          onClick={() => onViewQuotation && onViewQuotation(quote)}
                          title="View Quotation Details"
                          className="p-1.5 text-[#74808C] hover:text-[#354C63] hover:bg-[#EAF0F5] rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditQuotation && onEditQuotation(quote)}
                          title="Edit Quotation"
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

                    <div className="w-14 h-14 rounded-2xl bg-[#F1F4F7] border border-[#E2E7ED] flex items-center justify-center text-[#74808C] mb-3.5 shadow-sm">
                      <FileX size={26} />
                    </div>

                    <h3 className="text-base font-semibold text-[#242A31]">
                      No Agent Quotations Found
                    </h3>

                    <p className="text-sm text-[#74808C] mt-1 mb-5">
                      Record quotes received from overseas forwarding agents against your RFQs.
                    </p>

                    <button
                      type="button"
                      onClick={onCreateQuotation}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#354C63] hover:bg-[#293D52] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Add Agent Quotation</span>
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

export default AgentQuotationTable;
