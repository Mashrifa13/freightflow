import React from 'react';
import { Eye, Edit, FileX, Plus, Calendar, Clock, DollarSign, Building2 } from 'lucide-react';

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

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig['Pending Review'];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Quotation No.
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                RFQ Number
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Agent Name
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Quote Date
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Validity Date
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Total Buying Rate
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
                    className={`hover:bg-blue-50/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-blue-700 text-xs">
                      {quoteNo}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-700 text-xs">
                      {rfqNo}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-gray-800">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={14} className="text-gray-400" />
                        <span>{agentName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        <span>{quoteDate}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                        <Clock size={13} className="text-amber-500" />
                        <span>{validityDate}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-emerald-600">
                      {currency} {totalRate}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={quote.status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewQuotation && onViewQuotation(quote)}
                          title="View Quotation Details"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditQuotation && onEditQuotation(quote)}
                          title="Edit Quotation"
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
                      No Agent Quotations Found
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-5">
                      Record quotes received from overseas forwarding agents against your RFQs.
                    </p>
                    <button
                      type="button"
                      onClick={onCreateQuotation}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
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

