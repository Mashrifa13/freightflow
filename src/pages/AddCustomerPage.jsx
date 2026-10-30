import React from 'react';
import AddCustomerForm from '../components/AddCustomerForm';

/**
 * AddCustomerPage
 * Container page rendering the Add Customer form and handling navigation back to list
 */
function AddCustomerPage({ initialData = null, onNavigateToList, onCustomerSaved }) {
  const handleCancel = () => {
    if (onNavigateToList) {
      onNavigateToList();
    }
  };

  const handleSuccess = (customerPayload) => {
    if (onCustomerSaved) {
      onCustomerSaved(customerPayload);
    }
    if (onNavigateToList) {
      onNavigateToList();
    }
  };

  return (
    <div className="w-full">
      <AddCustomerForm
        initialData={initialData}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default AddCustomerPage;
