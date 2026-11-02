import React from 'react';
import EnquiryForm from '../components/EnquiryForm';

/**
 * EnquiryFormPage
 * Thin page wrapper that connects EnquiryForm to App-level state and navigation.
 *
 * Props:
 *   initialData        – null for create, existing enquiry object for edit
 *   customers          – customer list from App.jsx state (for dropdown)
 *   onNavigateToList   – callback: go back to Enquiry List (cancel)
 *   onEnquirySaved     – callback(payload): upsert into App enquiries state
 */
function EnquiryFormPage({ initialData = null, customers = [], onNavigateToList, onEnquirySaved }) {
  return (
    <EnquiryForm
      initialData={initialData}
      customers={customers}
      onCancel={onNavigateToList}
      onSave={onEnquirySaved}
    />
  );
}

export default EnquiryFormPage;

