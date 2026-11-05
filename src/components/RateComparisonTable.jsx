import React from 'react';
import { Eye, Edit, FileX, Plus, Building2, Award, Users } from 'lucide-react';

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

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig['In Progress'];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  );
}

function RateComparisonTable({
  comparisons = [],
  onViewComparison,
  onEditComparison,
  onCreateComparison,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Comparison ID
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                RFQ Number
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap text-center">
                Agent Count
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Lowest Cost
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Selected Agent
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
            {comparisons && comparisons.length > 0 ? (
              comparisons.map((comp, idx) => {
                const compId = comp.comparison_id || comp.id;
                const rfqNo = comp.rfq_no || '—';
                const customer = comp.customer_name || '—';
                const agentCount = comp.agent_count != null ? comp.agent_count : (comp.quotations?.length || 0);
                const currency = comp.currency || 'USD';
                const lowestCost =
                  comp.lowest_cost != null
                    ? `${currency} ${Number(comp.lowest_cost).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : '—';
                const selectedAgent = comp.selected_agent_name || comp.selected_agent || null;

                return (
                  <tr
                    key={compId || idx}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-blue-700 text-xs">
                      {compId}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-700 text-xs">
                      {rfqNo}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-gray-800">
                      {customer}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        <Users size={12} className="text-gray-400" />
                        <span>{agentCount} Quotes</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-emerald-600">
                      {lowestCost}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {selectedAgent ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                          <Award size={13} className="text-blue-600 flex-shrink-0" />
                          <span>{selectedAgent}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">None Selected</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={comp.status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewComparison && onViewComparison(comp)}
                          title="View Comparison Matrix"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditComparison && onEditComparison(comp)}
                          title="Edit Comparison / Change Agent"
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
                      No Rate Comparisons Found
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-5">
                      Select an active RFQ to compare side-by-side agent quotations and award the best partner.
                    </p>
                    <button
                      type="button"
                      onClick={onCreateComparison}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Create Rate Comparison</span>
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

export default RateComparisonTable;

