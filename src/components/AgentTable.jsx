import React, { useState } from 'react';
import { Eye, Edit, Trash2, UserX, Plus, AlertTriangle } from 'lucide-react';

/**
 * AgentTable component
 * Renders the tabular display of agents or an empty state when no agent records exist.
 * Includes View, Edit, and Cancel/Delete actions.
 */
function AgentTable({
  agents = [],
  onViewAgent,
  onEditAgent,
  onDeleteAgent,
  onAddAgent,
}) {
  const [agentToDelete, setAgentToDelete] = useState(null);

  const statusStyles = {
    Active: 'bg-[#E8F5EF] text-[#16845B] border-[#D1EEDB]',
    Pending: 'bg-[#FBF2E2] text-[#B17A25] border-[#F4E1BE]',
    Inactive: 'bg-[#F1F3F5] text-[#74808C] border-[#DDE2E7]',
    Suspended: 'bg-[#FCEEEE] text-[#C45151] border-[#F6CACA]',
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-[#354C63] border-b border-[#354C63]">
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Agent ID
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Agent Name
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Agent Type
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Country
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Email
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Phone
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E7ED]">
            {agents && agents.length > 0 ? (
              agents.map((agent, idx) => (
                <tr
                  key={agent.id || agent.agent_id || idx}
                  className={`hover:bg-[#EEF2F6] transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F9FB]'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono font-semibold text-[#354C63]">
                    {agent.agent_code || agent.agent_id || agent.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#242A31]">
                    {agent.name || agent.agent_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#596673]">
                    {agent.agent_type || agent.type || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#596673]">
                    {agent.country || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#596673] text-xs">
                    {agent.email || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#596673]">
                    {agent.phone || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        statusStyles[agent.status] || 'bg-[#F1F3F5] text-[#74808C] border-[#DDE2E7]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                      {agent.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewAgent && onViewAgent(agent)}
                        title="View Agent"
                        className="p-1.5 text-[#74808C] hover:text-[#354C63] hover:bg-[#EAF0F5] rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditAgent && onEditAgent(agent)}
                        title="Edit Agent"
                        className="p-1.5 text-[#74808C] hover:text-[#354C63] hover:bg-[#EAF0F5] rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAgentToDelete(agent)}
                        title="Cancel / Delete Agent"
                        className="p-1.5 text-[#74808C] hover:text-[#C45151] hover:bg-[#FCEEEE] rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#F7F9FB] border border-[#E2E7ED] flex items-center justify-center text-[#74808C] mb-3.5 shadow-xs">
                      <UserX size={26} className="text-[#74808C]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#242A31]">
                      No agents found
                    </h3>
                    <p className="text-sm text-[#74808C] mt-1 mb-5">
                      Add your first overseas or customs agent to get started.
                    </p>
                    <button
                      type="button"
                      onClick={onAddAgent}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#354C63] hover:bg-[#293D52] text-white text-sm font-medium rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Add Agent</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete / Cancel Confirmation Modal */}
      {agentToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={() => setAgentToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-[#E2E7ED] max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FCEEEE] text-[#C45151] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#242A31]">Cancel / Delete Agent</h4>
                <p className="text-xs text-[#74808C]">
                  {agentToDelete.agent_code || agentToDelete.agent_id || agentToDelete.id}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#596673] mb-6">
              Are you sure you want to cancel and remove agent{' '}
              <span className="font-semibold text-[#242A31]">
                "{agentToDelete.name || agentToDelete.agent_name}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAgentToDelete(null)}
                className="px-4 py-2 border border-[#D3DBE4] text-[#596673] hover:bg-[#F7F9FB] text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Keep Agent
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteAgent) {
                    onDeleteAgent(agentToDelete);
                  }
                  setAgentToDelete(null);
                }}
                className="px-4 py-2 bg-[#C45151] hover:bg-[#A83D3D] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentTable;

