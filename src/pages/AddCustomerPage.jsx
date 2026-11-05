
import React from 'react';
import AddCustomerForm from '../components/AddCustomerForm';

function AddCustomerPage({
  initialData = null,
  customers = [],
  onNavigateToList,
  onCustomerSaved,
}) {
  const handleCancel = () => {
    onNavigateToList?.();
  };

  // Generate the next sequential customer ID
  const generateCustomerId = () => {
    const lastNumber = customers.reduce((max, customer) => {
      const existingCode =
        customer.customer_code ||
        customer.customer_id ||
        customer.id ||
        '';

      const match = String(existingCode).match(/^CUST-\d{4}-(\d+)$/i);

      if (!match) return max;

      return Math.max(max, Number(match[1]));
    }, 0);

    const year = new Date().getFullYear();

    return `CUST-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
  };

  const handleSuccess = (customerPayload) => {
    const existingId =
      initialData?.customer_code ||
      initialData?.customer_id ||
      initialData?.id;

    const customerCode = existingId || generateCustomerId();

    const updatedPayload = {
      ...customerPayload,
      id: customerCode,
      customer_id: customerCode,
      customer_code: customerCode,
    };

    onCustomerSaved?.(updatedPayload);
    onNavigateToList?.();
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
