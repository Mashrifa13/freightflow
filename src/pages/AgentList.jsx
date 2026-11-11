import React, { useState, useMemo } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  Building2,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import AgentFilters from '../components/AgentFilters';
import AgentTable from '../components/AgentTable';
import AgentDetailsModal from '../components/AgentDetailsModal';
import { loadFromLocalStorage } from '../utils/storage';

/**
 * AgentList Page Component
 * Handles the state management for filters, search, pagination, viewing, and editing agents.
 */
function AgentList({
  agents: externalAgents,
  setAgents: externalSetAgents,
  onNavigateToAddAgent,
  onEditAgent: externalOnEditAgent,
  onDeleteAgent: externalOnDeleteAgent,
}) {
  const [internalAgents, setInternalAgents] = useState(() => loadFromLocalStorage('ff_agents', []));
  const agents = externalAgents !== undefined ? externalAgents : internalAgents;
  const setAgents = externalSetAgents || setInternalAgents;

  // Selected agent for View Modal
  const [viewingAgent, setViewingAgent] = useState(null);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [agentType, setAgentType] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');
  const [viewMode, setViewMode] = useState('table');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Handlers
  const handleResetFilters = () => {
    setSearchTerm('');
    setAgentType('');
    setCountry('');
    setStatus('');
    setCurrentPage(1);
  };

  const handleAddAgent = () => {
    if (onNavigateToAddAgent) {
      onNavigateToAddAgent();
    }
  };

  const handleViewAgent = (agent) => {
    setViewingAgent(agent);
  };

  const handleCloseModal = () => {
    setViewingAgent(null);
  };

  const handleEditAgent = (agent) => {
    if (externalOnEditAgent) {
      externalOnEditAgent(agent);
    }
  };

  const handleDeleteAgent = (agent) => {
    if (externalOnDeleteAgent) {
      externalOnDeleteAgent(agent);
    } else {
      setAgents((prev) =>
        prev.filter(
          (a) =>
            (a.agent_code && a.agent_code !== agent.agent_code) ||
            (a.agent_id && a.agent_id !== agent.agent_id) ||
            (a.id && a.id !== agent.id)
        )
      );
    }
  };

  // Filter application logic
  const filteredAgents = useMemo(() => {
    return agents.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.agent_name && item.agent_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.agent_code && item.agent_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.agent_id && item.agent_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.id && String(item.id).toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = !agentType || item.agent_type === agentType || item.type === agentType;
      const matchesCountry = !country || item.country === country;
      const matchesStatus = !status || item.status === status;

      return matchesSearch && matchesType && matchesCountry && matchesStatus;
    });
  }, [agents, searchTerm, agentType, country, status]);

  const totalCount = filteredAgents.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAgents = filteredAgents.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-5">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center flex-shrink-0">
            <Users size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
              Agent Management
            </h2>
            <p className="text-xs text-[#74808C] mt-0.5">
              Manage your network of freight forwarding agents, overseas partners, and brokers.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddAgent}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#354C63] hover:bg-[#293D52] active:bg-[#203042] text-white text-sm font-medium rounded-xl shadow-xs hover:shadow transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Agent</span>
        </button>
      </div>

      {/* Filters Section */}
      <AgentFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        agentType={agentType}
        onAgentTypeChange={(val) => {
          setAgentType(val);
          setCurrentPage(1);
        }}
        country={country}
        onCountryChange={(val) => {
          setCountry(val);
          setCurrentPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Agents Table / Grid View */}

      {/* Agent Grid / Table View */}
      {viewMode === 'table' ? (
        <AgentTable
          agents={paginatedAgents}
          onViewAgent={handleViewAgent}
          onEditAgent={handleEditAgent}
          onDeleteAgent={handleDeleteAgent}
          onAddAgent={handleAddAgent}
        />
      ) : (
        <div>
          {paginatedAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedAgents.map((agent) => (
                <div
                  key={agent.id || agent.agent_code || agent.agent_id}
                  className="bg-white border border-[#E2E7ED] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#C5D0DC] transition-all duration-200"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#EAF0F5] flex items-center justify-center flex-shrink-0">
                        <Building2 size={21} className="text-[#354C63]" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#242A31] truncate">
                          {agent.name || agent.agent_name || 'Unnamed Agent'}
                        </h3>

                        <p className="text-xs text-[#74808C] mt-1">
                          {agent.agent_code || agent.agent_id || agent.id}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${agent.status === 'Active'
                        ? 'bg-green-50 text-green-700'
                        : agent.status === 'Inactive'
                          ? 'bg-gray-100 text-gray-600'
                          : agent.status === 'Suspended'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                    >
                      {agent.status || 'Not specified'}
                    </span>
                  </div>

                  {/* Agent Information */}
                  <div className="mt-5 space-y-3 text-sm">

                    <div className="flex items-center gap-3 text-[#64707D]">
                      <Building2 size={16} className="flex-shrink-0" />
                      <span className="truncate">
                        {agent.agent_type || agent.type || 'No agent type'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[#64707D]">
                      <Mail size={16} className="flex-shrink-0" />
                      <span className="truncate">
                        {agent.email || 'No email'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[#64707D]">
                      <Phone size={16} className="flex-shrink-0" />
                      <span className="truncate">
                        {agent.phone || 'No phone number'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[#64707D]">
                      <MapPin size={16} className="flex-shrink-0" />
                      <span className="truncate">
                        {agent.country || 'No country specified'}
                      </span>
                    </div>

                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-[#E2E7ED]">

                    <button
                      type="button"
                      onClick={() => handleViewAgent(agent)}
                      className="flex items-center gap-1.5 text-sm font-medium text-[#354C63] hover:text-[#647E96] transition-colors"
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditAgent(agent)}
                        title="Edit Agent"
                        className="p-2 rounded-lg text-[#647E96] hover:bg-[#EEF2F6] transition-colors"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAgent(agent)}
                        title="Delete Agent"
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#E2E7ED] rounded-xl py-12 text-center">
              <Building2 size={32} className="mx-auto text-[#AAB3BD] mb-3" />
              <p className="font-medium text-[#424B55]">
                No agents found
              </p>
              <p className="text-sm text-[#74808C] mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      )}


      {/* Pagination Area */}
      <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-xs px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#74808C]">
        <div>
          {totalCount === 0 ? (
            <span>Showing 0 of 0 agents</span>
          ) : (
            <span>
              Showing <span className="font-semibold text-[#242A31]">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-[#242A31]">
                {Math.min(startIndex + pageSize, totalCount)}
              </span>{' '}
              of <span className="font-semibold text-[#242A31]">{totalCount}</span> agents
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1 || totalCount === 0}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-[#D3DBE4] text-[#596673] hover:bg-[#F7F9FB] hover:text-[#242A31] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-3 py-1 font-medium text-[#242A31] bg-[#F7F9FB] border border-[#E2E7ED] rounded-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages || totalCount === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-[#D3DBE4] text-[#596673] hover:bg-[#F7F9FB] hover:text-[#242A31] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* View Agent Details Modal */}
      {viewingAgent && (
        <AgentDetailsModal
          agent={viewingAgent}
          onClose={handleCloseModal}
          onEdit={(agent) => {
            handleCloseModal();
            handleEditAgent(agent);
          }}
        />
      )}
    </div>
  );
}

export default AgentList;

