import React from 'react';
import AddAgentForm from '../components/AddAgentForm';

/**
 * AddAgentPage
 * Container page rendering the Add/Edit Agent form and handling navigation back to list
 */
function AddAgentPage({ initialData = null, onNavigateToList, onAgentSaved }) {
  const handleCancel = () => {
    if (onNavigateToList) {
      onNavigateToList();
    }
  };

  const handleSuccess = (agentPayload) => {
    if (onAgentSaved) {
      onAgentSaved(agentPayload);
    }
    if (onNavigateToList) {
      onNavigateToList();
    }
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

