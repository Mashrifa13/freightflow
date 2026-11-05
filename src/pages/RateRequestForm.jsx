import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ClipboardList,
  FileText,
  Ship,
  Plane,
  Truck,
  Users,
  Calendar,
  Clock,
  Info,
  ShieldAlert,
  Send,
  Save,
  X,
  CheckSquare,
  Square,
  Building2,
  MapPin,
  Mail,
} from 'lucide-react';

function RateRequestForm({
  initialData = null,
  enquiries = [],
  agents = [],
  onCancel,
  onSave,
  onEnquiryStatusChange,
}) {
  const isEditMode = Boolean(initialData);

  // Form State
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(
    initialData?.enquiry_id || initialData?.enquiry_no || ''
  );
  const [requestDate, setRequestDate] = useState(
    initialData?.request_date || new Date().toISOString().slice(0, 10)
  );
  const [responseDeadline, setResponseDeadline] = useState(
    initialData?.response_deadline || ''
  );
  const [specialInstructions, setSpecialInstructions] = useState(
    initialData?.special_instructions || ''
  );
  const [selectedAgentIds, setSelectedAgentIds] = useState(
    initialData?.selected_agent_ids ||
    initialData?.agents?.map((a) => a.agent_id || a.id || a.agent_code) ||
    []
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the enquiry details
  const selectedEnquiry = enquiries.find(
    (e) => (e.id && e.id === selectedEnquiryId) || (e.enquiry_no && e.enquiry_no === selectedEnquiryId)
  );

  // Pre-fill enquiry details if editing an existing rate request without matching enquiry in array
  const displayEnquiry = selectedEnquiry || {
    id: initialData?.enquiry_no,
    customer: initialData?.customer_name,
    customer_name: initialData?.customer_name,
    pol: initialData?.pol,
    pod: initialData?.pod,
    shipment_mode: initialData?.shipment_mode,
    mode: initialData?.shipment_mode,
    shipment_type: initialData?.shipment_type,
    incoterms: initialData?.incoterms,
    expected_shipping_date: initialData?.expected_shipping_date,
    commodity: initialData?.commodity,
    cargo_description: initialData?.cargo_description,
    no_of_packages: initialData?.no_of_packages,
    gross_weight: initialData?.gross_weight,
    gross_weight_unit: initialData?.gross_weight_unit || 'kg',
    volume_cbm: initialData?.volume_cbm,
    containers: initialData?.containers || [],
  };

  const handleToggleAgent = (agentId) => {
    setSelectedAgentIds((prev) => {
      if (prev.includes(agentId)) {
        return prev.filter((id) => id !== agentId);
      } else {
        return [...prev, agentId];
      }
    });

    if (errors.agents) {
      setErrors((prev) => ({ ...prev, agents: '' }));
    }
  };

  const handleSelectAllAgents = () => {
    if (selectedAgentIds.length === agents.length) {
      setSelectedAgentIds([]);
    } else {
      setSelectedAgentIds(agents.map((a) => a.id || a.agent_code || a.agent_id));
    }
    if (errors.agents) {
      setErrors((prev) => ({ ...prev, agents: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!selectedEnquiryId) {
      errs.enquiry = 'Please select an enquiry.';
    }
    if (!responseDeadline) {
      errs.responseDeadline = 'Please provide a response deadline.';
    }
    if (selectedAgentIds.length === 0) {
      errs.agents = 'Please select at least one agent to receive this rate request.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (actionType) => {
    if (!validate()) return;

    setIsSubmitting(true);

    const year = new Date().getFullYear();
    const randSuffix = String(Math.floor(100 + Math.random() * 900));
    const rfqNumber = isEditMode
      ? initialData.rfq_no || initialData.id
      : `RFQ-${year}-${randSuffix}`;

    // Map selected agents with response tracking
    const existingAgentMap = {};
    if (initialData?.agents) {
      initialData.agents.forEach((ag) => {
        const id = ag.agent_id || ag.id || ag.agent_code;
        existingAgentMap[id] = ag;
      });
    }

    const compiledAgents = selectedAgentIds.map((agId) => {
      const foundAgent = agents.find(
        (a) => (a.id && a.id === agId) || (a.agent_code && a.agent_code === agId) || (a.agent_id && a.agent_id === agId)
      );

      const existingRecord = existingAgentMap[agId];

      return {
        agent_id: agId,
        id: agId,
        agent_name: foundAgent ? foundAgent.name || foundAgent.agent_name : existingRecord?.agent_name || agId,
        agent_code: foundAgent?.agent_code || existingRecord?.agent_code || agId,
        country: foundAgent?.country || existingRecord?.country || '—',
        email: foundAgent?.email || existingRecord?.email || '—',
        phone: foundAgent?.phone || existingRecord?.phone || '—',
        contact_person: foundAgent?.contact_person || existingRecord?.contact_person || '—',
        response_status: existingRecord?.response_status || (actionType === 'Sent' ? 'Pending' : 'Draft'),
        quoted_rate: existingRecord?.quoted_rate || null,
        currency: existingRecord?.currency || 'USD',
        notes: existingRecord?.notes || '',
        responded_at: existingRecord?.responded_at || null,
      };
    });

    const status =
      actionType === 'Draft'
        ? 'Draft'
        : initialData?.status && initialData.status !== 'Draft'
          ? initialData.status
          : 'Sent';

    // Build payload ready for Django REST Framework
    const payload = {
      id: rfqNumber,
      rfq_no: rfqNumber,
      enquiry_id: selectedEnquiryId,
      enquiry_no: selectedEnquiry?.id || selectedEnquiry?.enquiry_no || selectedEnquiryId,
      customer_name: displayEnquiry?.customer || displayEnquiry?.customer_name || '—',
      pol: displayEnquiry?.pol || '—',
      pod: displayEnquiry?.pod || '—',
      shipment_mode: displayEnquiry?.shipment_mode || displayEnquiry?.mode || 'Sea',
      mode: displayEnquiry?.shipment_mode || displayEnquiry?.mode || 'Sea',
      shipment_type: displayEnquiry?.shipment_type || '—',
      incoterms: displayEnquiry?.incoterms || '—',
      expected_shipping_date: displayEnquiry?.expected_shipping_date || '—',
      commodity: displayEnquiry?.commodity || '—',
      cargo_description: displayEnquiry?.cargo_description || '—',
      no_of_packages: displayEnquiry?.no_of_packages || null,
      gross_weight: displayEnquiry?.gross_weight || null,
      gross_weight_unit: displayEnquiry?.gross_weight_unit || 'kg',
      volume_cbm: displayEnquiry?.volume_cbm || null,
      containers: displayEnquiry?.containers || [],
      request_date: requestDate,
      response_deadline: responseDeadline,
      special_instructions: specialInstructions,
      selected_agent_ids: selectedAgentIds,
      agents: compiledAgents,
      responses_received: compiledAgents.filter(
        (a) => a.response_status === 'Quoted' || a.response_status === 'Received'
      ).length,
      status: status,
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log(
      `DRF Payload for ${isEditMode ? 'PUT /api/rate-requests/' + rfqNumber + '/' : 'POST /api/rate-requests/'}:`,
      payload
    );

    setTimeout(() => {
      setIsSubmitting(false);

      if (onSave) {
        onSave(payload);
      }

      // Update enquiry status only when the rate request is sent
      if (actionType === 'Sent' && onEnquiryStatusChange) {
        onEnquiryStatusChange(selectedEnquiryId, 'Pricing');
      }
    }, 350);
  };

  const mode = displayEnquiry?.shipment_mode || displayEnquiry?.mode || 'Sea';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header / Breadcrumb Action */}
      <div className="pb-2 border-b border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Rate Requests
        </button>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          {isEditMode ? 'Edit Rate Request' : 'Create Rate Request (RFQ)'}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {isEditMode
            ? `Updating details for RFQ ${initialData?.rfq_no || initialData?.id}.`
            : 'Select an enquiry, verify cargo specifications, choose destination agents, and broadcast quotation request.'}
        </p>
      </div>

      {/* 1. Select Enquiry Section */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">1. Select Enquiry</h3>
            <p className="text-xs text-gray-400">
              Pick an active enquiry to automatically populate shipment and cargo details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Select Enquiry <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedEnquiryId}
              onChange={(e) => {
                setSelectedEnquiryId(e.target.value);
                if (errors.enquiry) setErrors((prev) => ({ ...prev, enquiry: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all ${errors.enquiry ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                }`}
            >
              <option value="">
                {enquiries.length === 0 ? 'No Enquiries Available' : '— Choose an Enquiry —'}
              </option>
              {enquiries.map((enq) => {
                const id = enq.id || enq.enquiry_no;
                const cust = enq.customer || enq.customer_name || 'Customer';
                const route = `${enq.pol || 'POL'} → ${enq.pod || 'POD'}`;
                const m = enq.mode || enq.shipment_mode || 'Sea';
                return (
                  <option key={id} value={id}>
                    {id} | {cust} ({route} - {m})
                  </option>
                );
              })}
            </select>
            {errors.enquiry && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.enquiry}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Request Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>
        </div>
      </section>

      {/* 2. Shipment & Cargo Details (Auto-displayed from Enquiry) */}
      {selectedEnquiryId && (
        <section className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 bg-gradient-to-b from-blue-50/20 to-white">
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
              {mode === 'Air' ? <Plane size={19} /> : mode === 'Land' ? <Truck size={19} /> : <Ship size={19} />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                2. Shipment & Cargo Specifications
              </h3>
              <p className="text-xs text-gray-400">
                Linked details from Enquiry {displayEnquiry?.id || selectedEnquiryId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-gray-400 block font-medium">Customer</span>
              <span className="font-semibold text-gray-800 text-sm mt-0.5 block truncate">
                {displayEnquiry?.customer || displayEnquiry?.customer_name || '—'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-gray-400 block font-medium">Route (POL → POD)</span>
              <span className="font-semibold text-blue-700 text-sm mt-0.5 block truncate">
                {displayEnquiry?.pol || '—'} → {displayEnquiry?.pod || '—'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-gray-400 block font-medium">Mode & Type</span>
              <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
                {mode} {displayEnquiry?.shipment_type ? `(${displayEnquiry.shipment_type})` : ''}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-gray-400 block font-medium">Incoterms</span>
              <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
                {displayEnquiry?.incoterms || '—'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-gray-400 block font-medium">Expected Shipping Date</span>
              <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
                {displayEnquiry?.expected_shipping_date || '—'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-gray-400 block font-medium">Commodity</span>
              <span className="font-semibold text-gray-800 text-sm mt-0.5 block truncate">
                {displayEnquiry?.commodity || '—'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-gray-400 block font-medium">Gross Weight / Volume</span>
              <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
                {displayEnquiry?.gross_weight
                  ? `${displayEnquiry.gross_weight} ${displayEnquiry.gross_weight_unit || 'kg'}`
                  : '—'}{' '}
                / {displayEnquiry?.volume_cbm ? `${displayEnquiry.volume_cbm} CBM` : '—'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-gray-400 block font-medium">No. of Packages</span>
              <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
                {displayEnquiry?.no_of_packages || '—'}
              </span>
            </div>
          </div>

          {/* Container rows if FCL */}
          {displayEnquiry?.containers && displayEnquiry.containers.length > 0 && (
            <div className="mt-4 pt-3 border-t border-blue-100/60 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-500">Containers:</span>
              {displayEnquiry.containers.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white border border-blue-200 rounded-lg text-xs font-semibold text-blue-800"
                >
                  {c.quantity} × {c.containerType}
                </span>
              ))}
            </div>
          )}

          {displayEnquiry?.cargo_description && (
            <div className="mt-3 pt-3 border-t border-blue-100/60 text-xs">
              <span className="font-semibold text-gray-500">Cargo Description: </span>
              <span className="text-gray-700">{displayEnquiry.cargo_description}</span>
            </div>
          )}
        </section>
      )}

      {/* 3. Overseas Agents Selection */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-5 border-b border-gray-100 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Users size={19} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                3. Select Overseas Agents <span className="text-red-500">*</span>
              </h3>
              <p className="text-xs text-gray-400">
                Choose one or multiple network partners from Agent Management
              </p>
            </div>
          </div>

          {agents.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAllAgents}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer self-start sm:self-auto"
            >
              {selectedAgentIds.length === agents.length ? 'Deselect All' : 'Select All Agents'}
            </button>
          )}
        </div>

        {errors.agents && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>{errors.agents}</span>
          </div>
        )}

        {agents.length === 0 ? (
          <div className="p-8 text-center bg-gray-50/70 rounded-xl border border-gray-100">
            <Building2 size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-700">No Agents Registered</p>
            <p className="text-xs text-gray-400 mt-1">
              Add agents in the Agent Management module to select them for rate requests.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {agents.map((ag) => {
              const agId = ag.id || ag.agent_code || ag.agent_id;
              const isSelected = selectedAgentIds.includes(agId);
              return (
                <div
                  key={agId}
                  onClick={() => handleToggleAgent(agId)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${isSelected
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/30'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <div className="mt-0.5 text-blue-600 flex-shrink-0">
                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-800 truncate">
                        {ag.name || ag.agent_name}
                      </h4>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {ag.country || 'Global'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                      <Mail size={11} className="text-gray-400" />
                      <span className="truncate">{ag.email || 'No email registered'}</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Contact: {ag.contact_person || 'General Enquiry'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-3 text-right">
          <span className="text-xs text-gray-500">
            Selected agents:{' '}
            <span className="font-semibold text-blue-700">{selectedAgentIds.length}</span>
          </span>
        </div>
      </section>

      {/* 4. Timeline & Special Instructions */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Clock size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              4. Deadline & Instructions
            </h3>
            <p className="text-xs text-gray-400">
              Set quote expiration deadline and specific handling guidelines for recipients
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Response Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={responseDeadline}
              onChange={(e) => {
                setResponseDeadline(e.target.value);
                if (errors.responseDeadline) setErrors((prev) => ({ ...prev, responseDeadline: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all ${errors.responseDeadline ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                }`}
            />
            {errors.responseDeadline && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.responseDeadline}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Special Instructions for Agents
            </label>
            <textarea
              rows={3}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Please quote all-in ocean freight with 14 days free time at POD, specify terminal handling and documentation fees."
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
            />
          </div>
        </div>
      </section>

      {/* Action Buttons Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          <X size={15} />
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {/* Save as Draft option */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Draft')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={15} />
            <span>Save as Draft</span>
          </button>

          {/* Send Request option */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Sent')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Send size={15} />
            <span>{isSubmitting ? 'Processing...' : isEditMode ? 'Save & Send' : 'Send Request'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RateRequestForm;

