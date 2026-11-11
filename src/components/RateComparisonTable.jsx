
import React from 'react';
import { Eye, Edit, FileX, Plus, Award, Users } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-[#354C63] border-b border-[#354C63]">
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Comparison ID
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Enquiry No.
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Customer
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap text-center">
                Agent Count
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Lowest Cost
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Selected Agent
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E7ED]">
            {comparisons && comparisons.length > 0 ? (
              comparisons.map((comp, idx) => {
                const compId = comp.comparison_id || comp.id;
                const enquiryNo = comp.enquiry_no || comp.enquiry_id || comp.rfq_no || '—';
                const customer = comp.customer_name || '—';

                const agentCount =
                  comp.agent_count != null
                    ? comp.agent_count
                    : (comp.quotations?.length || 0);

                const currency = comp.currency || 'USD';

                const lowestCost =
                  comp.lowest_cost != null
                    ? `${currency} ${Number(comp.lowest_cost).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                    : '—';

                const selectedAgent =
                  comp.selected_agent_name || comp.selected_agent || null;

                return (
                  <tr
                    key={compId || idx}
                    className={`transition-colors hover:bg-[#EEF2F6] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F9FB]'
                      }`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-[#354C63] text-xs">
                      {compId}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap font-medium text-[#596673] text-xs">
                      {enquiryNo}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-[#242A31]">
                      {customer}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDF2F7] text-[#354C63]">
                        <Users size={12} className="text-[#74808C]" />
                        <span>{agentCount} Quotes</span>
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap font-bold text-[#16845B]">
                      {lowestCost}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {selectedAgent ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#EDF2F7] border border-[#D3DBE4] text-[#354C63] text-xs font-bold">
                          <Award size={13} className="text-[#647E96] flex-shrink-0" />
                          <span>{selectedAgent}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#74808C] italic">
                          None Selected
                        </span>
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
                          className="p-1.5 text-[#74808C] hover:text-[#354C63] hover:bg-[#EDF2F7] rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditComparison && onEditComparison(comp)}
                          title="Edit Comparison / Change Agent"
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
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#F7F9FB] border border-[#E2E7ED] flex items-center justify-center mb-3.5 shadow-sm">
                      <FileX size={26} className="text-[#74808C]" />
                    </div>

                    <h3 className="text-base font-semibold text-[#242A31]">
                      No Rate Comparisons Found
                    </h3>

                    <p className="text-sm text-[#74808C] mt-1 mb-5">
                      Select an active RFQ to compare side-by-side agent quotations and award the best partner.
                    </p>

                    <button
                      type="button"
                      onClick={onCreateComparison}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#354C63] hover:bg-[#293D52] text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
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
