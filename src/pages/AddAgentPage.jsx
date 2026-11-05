
import React from 'react';
import AddAgentForm from '../components/AddAgentForm';

const generateAgentId = (agents = []) => {
  const lastNumber = agents.reduce((max, agent) => {
    const existingId =
      agent.agent_code ||
      agent.agent_id ||
      agent.id ||
      '';

    const match = String(existingId).match(/^AGT-\d{4}-(\d+)$/i);

    if (!match) return max;

    return Math.max(max, Number(match[1]));
  }, 0);

  const year = new Date().getFullYear();

  return `AGT-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
};

function AddAgentPage({
  initialData = null,
  agents = [],
  onNavigateToList,
  onAgentSaved,
}) {
  const handleCancel = () => {
    onNavigateToList?.();
  };

  const handleSuccess = (agentPayload) => {
    const existingId =
      initialData?.agent_code ||
      initialData?.agent_id ||
      initialData?.id;

    const agentCode = existingId || generateAgentId(agents);

    const updatedPayload = {
      ...agentPayload,
      id: agentCode,
      agent_id: agentCode,
      agent_code: agentCode,
    };

    onAgentSaved?.(updatedPayload);
    onNavigateToList?.();
  };

  return (
    <div className="w-full">
      <AddAgentForm
        initialData={initialData}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default AddAgentPage;
