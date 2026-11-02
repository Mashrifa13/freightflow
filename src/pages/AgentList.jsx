import React, { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import AgentFilters from '../components/AgentFilters';
import AgentTable from '../components/AgentTable';
import AgentDetailsModal from '../components/AgentDetailsModal';

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
  const [internalAgents, setInternalAgents] = useState([]);
  const agents = externalAgents !== undefined ? externalAgents : internalAgents;
  const setAgents = externalSetAgents || setInternalAgents;

  // Selected agent for View Modal
  const [viewingAgent, setViewingAgent] = useState(null);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [agentType, setAgentType] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');

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
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <Users className="text-blue-600" size={24} />
            Agent Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your network of freight forwarding agents, overseas partners, and brokers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddAgent}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer self-start sm:self-auto"
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
      />

      {/* Agents Table / Empty State */}
      <AgentTable
        agents={paginatedAgents}
        onViewAgent={handleViewAgent}
        onEditAgent={handleEditAgent}
        onDeleteAgent={handleDeleteAgent}
        onAddAgent={handleAddAgent}
      />

      {/* Pagination Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          {totalCount === 0 ? (
            <span>Showing 0 of 0 agents</span>
          ) : (
            <span>
              Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(startIndex + pageSize, totalCount)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{totalCount}</span> agents
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1 || totalCount === 0}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="px-3 py-1 font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages || totalCount === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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

