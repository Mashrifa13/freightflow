
import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Ship,
  Plane,
  Truck,
  Users,
  Clock,
  Info,
  ShieldAlert,
  Send,
  Save,
  X,
  CheckSquare,
  Square,
  Building2,
  Mail,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react';

const generateRfqId = (rateRequests = []) => {
  const year = new Date().getFullYear();

  const lastNumber = rateRequests.reduce((max, request) => {
    const existingId =
      request.rfq_no ||
      request.rfq_id ||
      request.id ||
      '';

    const match = String(existingId).match(
      new RegExp(`^RFQ-${year}-(\\d+)$`, 'i')
    );

    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  return `RFQ-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
};

function RateRequestForm({
  initialData,
  enquiries = [],
  agents = [],
  rateRequests = [],
  onCancel,
  onSave,
  onEnquiryStatusChange,
}) {
  const isEditMode = Boolean(initialData);

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

  const [agentSearch, setAgentSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  // Searchable Enquiry dropdown
  const [enquirySearch, setEnquirySearch] = useState('');
  const [isEnquiryDropdownOpen, setIsEnquiryDropdownOpen] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RFQ Email Preview
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Find selected enquiry
  const selectedEnquiry = enquiries.find(
    (e) =>
      (e.id && String(e.id) === String(selectedEnquiryId)) ||
      (e.enquiry_no && String(e.enquiry_no) === String(selectedEnquiryId))
  );

  // Filter enquiries by enquiry ID, customer name, POL, or POD
  const filteredEnquiries = enquiries.filter((enq) => {
    const searchText = enquirySearch.trim().toLowerCase();
    const enquiryId = String(enq.id || enq.enquiry_no || '').toLowerCase();
    const customerName = String(
      enq.customer || enq.customer_name || ''
    ).toLowerCase();
    const pol = String(enq.pol || '').toLowerCase();
    const pod = String(enq.pod || '').toLowerCase();

    return (
      enquiryId.includes(searchText) ||
      customerName.includes(searchText) ||
      pol.includes(searchText) ||
      pod.includes(searchText)
    );
  });

  const selectedEnquiryLabel = selectedEnquiry
    ? `${selectedEnquiry.id || selectedEnquiry.enquiry_no} | ${selectedEnquiry.customer || selectedEnquiry.customer_name || 'Customer'
    } (${selectedEnquiry.pol || 'POL'} → ${selectedEnquiry.pod || 'POD'})`
    : initialData
      ? `${initialData.enquiry_no || initialData.enquiry_id || ''} | ${initialData.customer_name || 'Customer'
      } (${initialData.pol || 'POL'} → ${initialData.pod || 'POD'})`
      : '';

  // Fallback enquiry details for edit mode
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

  // Get unique countries from registered agents
  const availableCountries = [
    ...new Set(
      agents
        .map((agent) => agent.country?.trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  // Filter agents by company name and country
  const filteredAgents = agents.filter((agent) => {
    const companyName = (
      agent.name || agent.agent_name || ''
    ).toLowerCase();

    const matchesSearch = companyName.includes(
      agentSearch.trim().toLowerCase()
    );

    const matchesCountry =
      !selectedCountry || agent.country?.trim() === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  const getAgentId = (agent) =>
    agent.id || agent.agent_code || agent.agent_id;

  const handleToggleAgent = (agentId) => {
    setSelectedAgentIds((prev) => {
      if (prev.includes(agentId)) {
        return prev.filter((id) => id !== agentId);
      }

      return [...prev, agentId];
    });

    if (errors.agents) {
      setErrors((prev) => ({ ...prev, agents: '' }));
    }
  };

  // Select or deselect only the currently filtered agents
  const handleSelectAllAgents = () => {
    const filteredAgentIds = filteredAgents.map(getAgentId);

    if (filteredAgentIds.length === 0) return;

    const allFilteredSelected = filteredAgentIds.every(
      (id) => selectedAgentIds.includes(id)
    );

    if (allFilteredSelected) {
      setSelectedAgentIds((prev) =>
        prev.filter((id) => !filteredAgentIds.includes(id))
      );
    } else {
      setSelectedAgentIds((prev) => [
        ...new Set([...prev, ...filteredAgentIds]),
      ]);
    }

    if (errors.agents) {
      setErrors((prev) => ({ ...prev, agents: '' }));
    }
  };

  const allFilteredSelected =
    filteredAgents.length > 0 &&
    filteredAgents.every((agent) =>
      selectedAgentIds.includes(getAgentId(agent))
    );

  const clearAgentFilters = () => {
    setAgentSearch('');
    setSelectedCountry('');
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
      errs.agents =
        'Please select at least one agent to receive this rate request.';
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const formatDate = (date) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handleSubmit = (actionType) => {
    if (!validate()) return;

    setIsSubmitting(true);

    const existingId =
      initialData?.rfq_no ||
      initialData?.rfq_id ||
      initialData?.id;

    const newId = existingId || generateRfqId(rateRequests);

    // Preserve existing agent response information
    const existingAgentMap = {};

    if (initialData?.agents) {
      initialData.agents.forEach((ag) => {
        const id = ag.agent_id || ag.id || ag.agent_code;
        existingAgentMap[id] = ag;
      });
    }

    // Compile selected agents
    const compiledAgents = selectedAgentIds.map((agId) => {
      const foundAgent = agents.find(
        (a) =>
          (a.id && a.id === agId) ||
          (a.agent_code && a.agent_code === agId) ||
          (a.agent_id && a.agent_id === agId)
      );

      const existingRecord = existingAgentMap[agId];

      return {
        agent_id: agId,
        id: agId,
        agent_name: foundAgent
          ? foundAgent.name || foundAgent.agent_name
          : existingRecord?.agent_name || agId,
        agent_code:
          foundAgent?.agent_code || existingRecord?.agent_code || agId,
        country: foundAgent?.country || existingRecord?.country || '—',
        email: foundAgent?.email || existingRecord?.email || '—',
        phone: foundAgent?.phone || existingRecord?.phone || '—',
        contact_person:
          foundAgent?.contact_person ||
          existingRecord?.contact_person ||
          '—',
        response_status:
          existingRecord?.response_status ||
          (actionType === 'Sent' ? 'Pending' : 'Draft'),
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

    // Payload for backend integration
    const payload = {
      id: newId,
      rfq_id: newId,
      rfq_no: newId,
      enquiry_id: selectedEnquiryId,
      enquiry_no:
        selectedEnquiry?.id ||
        selectedEnquiry?.enquiry_no ||
        selectedEnquiryId,
      customer_name:
        displayEnquiry?.customer ||
        displayEnquiry?.customer_name ||
        '—',
      pol: displayEnquiry?.pol || '—',
      pod: displayEnquiry?.pod || '—',
      shipment_mode:
        displayEnquiry?.shipment_mode ||
        displayEnquiry?.mode ||
        'Sea',
      mode:
        displayEnquiry?.shipment_mode ||
        displayEnquiry?.mode ||
        'Sea',
      shipment_type: displayEnquiry?.shipment_type || '—',
      incoterms: displayEnquiry?.incoterms || '—',
      expected_shipping_date:
        displayEnquiry?.expected_shipping_date || '—',
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
        (a) =>
          a.response_status === 'Quoted' ||
          a.response_status === 'Received'
      ).length,
      status,
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save draft directly
    if (actionType === 'Draft') {
      setTimeout(() => {
        setIsSubmitting(false);

        if (onSave) {
          onSave(payload);
        }
      }, 350);

      return;
    }

    // Prepare email preview
    const subject = `FreightFlow - Rate Request ${newId}`;

    const body = `Dear Agent,

We request your best quotation for the following shipment.

RFQ Number: ${newId}
Customer: ${payload.customer_name}
Shipment Mode: ${payload.shipment_mode}
Shipment Type: ${payload.shipment_type}
POL: ${payload.pol}
POD: ${payload.pod}
Incoterms: ${payload.incoterms}
Commodity: ${payload.commodity}
Gross Weight: ${payload.gross_weight || '—'} ${payload.gross_weight_unit}
Volume: ${payload.volume_cbm || '—'} CBM
Request Date: ${formatDate(payload.request_date)}
Response Deadline: ${formatDate(payload.response_deadline)}
Expected Shipping Date: ${formatDate(payload.expected_shipping_date)}

Special Instructions:
${specialInstructions || 'No special instructions.'}

Kindly provide your best freight rates and applicable charges.

Regards,
FreightFlow Pricing Team`;

    setPendingPayload(payload);
    setEmailSubject(subject);
    setEmailBody(body);
    setShowEmailPreview(true);
    setIsSubmitting(false);
  };

  const handleConfirmEmailSend = () => {
    if (!pendingPayload) return;

    setIsSubmitting(true);

    // Frontend simulation only; no real email is delivered.
    setTimeout(() => {
      const updatedAgents = pendingPayload.agents.map((agent) => {
        const validEmail =
          agent.email &&
          agent.email !== '—' &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agent.email);

        return {
          ...agent,
          email_status: validEmail ? 'Sent' : 'Failed',
          email_sent_at: validEmail ? new Date().toISOString() : null,
        };
      });

      const updatedPayload = {
        ...pendingPayload,
        agents: updatedAgents,
        email_subject: emailSubject,
        email_body: emailBody,
        status: 'Sent',
        updated_at: new Date().toISOString(),
      };

      setIsSubmitting(false);
      setShowEmailPreview(false);
      setPendingPayload(null);

      if (onSave) {
        onSave(updatedPayload);
      }

      if (onEnquiryStatusChange) {
        onEnquiryStatusChange(selectedEnquiryId, 'Pricing');
      }
    }, 500);
  };

  const mode =
    displayEnquiry?.shipment_mode ||
    displayEnquiry?.mode ||
    'Sea';

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl text-[#242A31] placeholder:text-[#9AA4AF] focus:outline-none focus:ring-2 focus:ring-[#354C63]/15 focus:border-[#354C63] transition-all';

  const labelClass =
    'block text-xs font-semibold text-[#596673] mb-1.5';

  const sectionClass =
    'bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6';

  const sectionHeaderClass =
    'flex items-center gap-3 pb-4 mb-5 border-b border-[#E2E7ED]';

  const iconTileClass =
    'w-9 h-9 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center flex-shrink-0';

  const headingClass =
    'text-base font-semibold text-[#242A31]';

  const descriptionClass =
    'text-xs text-[#74808C] mt-0.5';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">

      {/* Page Header */}
      <div className="pb-3 border-b border-[#E2E7ED]">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74808C] hover:text-[#35271F] transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Rate Requests
        </button>

        <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
          {isEditMode ? 'Edit Rate Request' : 'Create Rate Request (RFQ)'}
        </h2>

        <p className="text-xs text-[#74808C] mt-1">
          {isEditMode
            ? `Updating details for RFQ ${initialData?.rfq_no || initialData?.id}.`
            : 'Select an enquiry, verify cargo specifications, choose destination agents, and broadcast quotation request.'}
        </p>
      </div>

      {/* 1. Select Enquiry */}
      <section className={sectionClass}>
        <div className={sectionHeaderClass}>
          <div className={iconTileClass}>
            <FileText size={19} />
          </div>

          <div>
            <h3 className={headingClass}>1. Select Enquiry</h3>
            <p className={descriptionClass}>
              Pick an active enquiry to automatically populate shipment and cargo details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>
              Select Enquiry <span className="text-[#C45151]">*</span>
            </label>

            <div className="relative">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74808C] pointer-events-none"
                />

                <input
                  type="text"
                  value={
                    isEnquiryDropdownOpen
                      ? enquirySearch
                      : selectedEnquiryLabel
                  }
                  onFocus={() => {
                    setEnquirySearch('');
                    setIsEnquiryDropdownOpen(true);
                  }}
                  onChange={(e) => {
                    setEnquirySearch(e.target.value);
                    setSelectedEnquiryId('');
                    setIsEnquiryDropdownOpen(true);
                    if (errors.enquiry) {
                      setErrors((prev) => ({ ...prev, enquiry: '' }));
                    }
                  }}
                  onBlur={() => setIsEnquiryDropdownOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsEnquiryDropdownOpen(false);
                      setEnquirySearch('');
                    }
                  }}
                  placeholder={
                    enquiries.length === 0
                      ? 'No Enquiries Available'
                      : 'Search by enquiry ID, customer, POL or POD...'
                  }
                  disabled={enquiries.length === 0}
                  className={`${inputClass} pl-10 pr-11 ${errors.enquiry ? 'border-[#C45151] bg-[#FCEEEE]' : ''
                    }`}
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={isEnquiryDropdownOpen}
                  aria-controls="enquiry-search-options"
                  aria-autocomplete="list"
                />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (isEnquiryDropdownOpen) {
                      setIsEnquiryDropdownOpen(false);
                    } else {
                      setEnquirySearch('');
                      setIsEnquiryDropdownOpen(true);
                    }
                  }}
                  disabled={enquiries.length === 0}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74808C] hover:text-[#354C63] disabled:opacity-40"
                  aria-label="Toggle enquiry options"
                >
                  <ChevronDown
                    size={17}
                    className={`transition-transform ${isEnquiryDropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>
              </div>

              {isEnquiryDropdownOpen && enquiries.length > 0 && (
                <div
                  id="enquiry-search-options"
                  role="listbox"
                  className="absolute z-30 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-[#D3DBE4] bg-white shadow-xl"
                >
                  {filteredEnquiries.length > 0 ? (
                    filteredEnquiries.map((enq) => {
                      const enquiryId = enq.id || enq.enquiry_no;
                      const customerName =
                        enq.customer || enq.customer_name || 'Customer';
                      const route = `${enq.pol || 'POL'} → ${enq.pod || 'POD'}`;
                      const shipmentMode =
                        enq.mode || enq.shipment_mode || 'Sea';

                      return (
                        <button
                          key={enquiryId}
                          type="button"
                          role="option"
                          aria-selected={
                            String(selectedEnquiryId) === String(enquiryId)
                          }
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSelectedEnquiryId(String(enquiryId));
                            setEnquirySearch('');
                            setIsEnquiryDropdownOpen(false);
                            if (errors.enquiry) {
                              setErrors((prev) => ({
                                ...prev,
                                enquiry: '',
                              }));
                            }
                          }}
                          className={`w-full text-left px-4 py-3 border-b border-[#E2E7ED] last:border-b-0 hover:bg-[#F1F4F7] transition-colors ${String(selectedEnquiryId) === String(enquiryId)
                              ? 'bg-[#EDF2F7]'
                              : 'bg-white'
                            }`}
                        >
                          <span className="block text-xs font-semibold text-[#242A31]">
                            {enquiryId} | {customerName}
                          </span>
                          <span className="block mt-1 text-[11px] text-[#74808C]">
                            {route} · {shipmentMode}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-5 text-center">
                      <p className="text-xs font-semibold text-[#596673]">
                        No matching enquiries found
                      </p>
                      <p className="text-[11px] text-[#9AA4AF] mt-1">
                        Try searching with an enquiry ID, customer name, POL or POD.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {errors.enquiry && (
              <p className="text-xs text-[#C45151] mt-1.5 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.enquiry}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Request Date <span className="text-[#C45151]">*</span>
            </label>

            <input
              type="date"
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* 2. Shipment & Cargo Details */}
      {selectedEnquiryId && (
        <section className="bg-white rounded-2xl border border-[#D3DBE4] shadow-sm p-6">
          <div className={sectionHeaderClass}>
            <div className={iconTileClass}>
              {mode === 'Air' ? (
                <Plane size={19} />
              ) : mode === 'Land' ? (
                <Truck size={19} />
              ) : (
                <Ship size={19} />
              )}
            </div>

            <div>
              <h3 className={headingClass}>
                2. Shipment & Cargo Specifications
              </h3>
              <p className={descriptionClass}>
                Linked details from Enquiry {displayEnquiry?.id || selectedEnquiryId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            {[
              {
                label: 'Customer',
                value: displayEnquiry?.customer || displayEnquiry?.customer_name || '—',
              },
              {
                label: 'Route (POL → POD)',
                value: `${displayEnquiry?.pol || '—'} → ${displayEnquiry?.pod || '—'}`,
                highlight: true,
              },
              {
                label: 'Mode & Type',
                value: `${mode} ${displayEnquiry?.shipment_type ? `(${displayEnquiry.shipment_type})` : ''}`,
              },
              {
                label: 'Incoterms',
                value: displayEnquiry?.incoterms || '—',
              },
              {
                label: 'Expected Shipping Date',
                value: displayEnquiry?.expected_shipping_date || '—',
              },
              {
                label: 'Commodity',
                value: displayEnquiry?.commodity || '—',
              },
              {
                label: 'Gross Weight / Volume',
                value: `${displayEnquiry?.gross_weight
                  ? `${displayEnquiry.gross_weight} ${displayEnquiry.gross_weight_unit || 'kg'}`
                  : '—'
                  } / ${displayEnquiry?.volume_cbm
                    ? `${displayEnquiry.volume_cbm} CBM`
                    : '—'
                  }`,
              },
              {
                label: 'No. of Packages',
                value: displayEnquiry?.no_of_packages || '—',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#F7F9FB] p-3.5 rounded-xl border border-[#E2E7ED]"
              >
                <span className="text-[#74808C] block font-medium">
                  {item.label}
                </span>

                <span
                  className={`font-semibold text-sm mt-1 block ${item.highlight ? 'text-[#354C63]' : 'text-[#242A31]'
                    }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Container Details */}
          {displayEnquiry?.containers &&
            displayEnquiry.containers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#E2E7ED] flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#596673]">
                  Containers:
                </span>

                {displayEnquiry.containers.map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-[#EDF2F7] border border-[#D3DBE4] rounded-lg text-xs font-semibold text-[#354C63]"
                  >
                    {c.quantity} × {c.containerType}
                  </span>
                ))}
              </div>
            )}

          {displayEnquiry?.cargo_description && (
            <div className="mt-3 pt-3 border-t border-[#E2E7ED] text-xs">
              <span className="font-semibold text-[#596673]">
                Cargo Description:{' '}
              </span>
              <span className="text-[#4B5563]">
                {displayEnquiry.cargo_description}
              </span>
            </div>
          )}
        </section>
      )}

      {/* 3. Overseas Agents */}
      <section className={sectionClass}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-5 border-b border-[#E2E7ED] gap-2">
          <div className="flex items-center gap-3">
            <div className={iconTileClass}>
              <Users size={19} />
            </div>

            <div>
              <h3 className={headingClass}>
                3. Select Overseas Agents{' '}
                <span className="text-[#C45151]">*</span>
              </h3>

              <p className={descriptionClass}>
                Choose one or multiple network partners from Agent Management
              </p>
            </div>
          </div>

          {agents.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAllAgents}
              disabled={filteredAgents.length === 0}
              className="text-xs font-semibold text-[#354C63] hover:text-[#35271F] transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {allFilteredSelected
                ? 'Deselect Filtered Agents'
                : 'Select Filtered Agents'}
            </button>
          )}
        </div>

        {errors.agents && (
          <div className="mb-4 p-3 bg-[#FCEEEE] border border-[#F2D0D0] rounded-xl flex items-center gap-2 text-xs text-[#C45151]">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>{errors.agents}</span>
          </div>
        )}

        {/* Agent Search and Country Filter */}
        {agents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div>
              <label className={labelClass}>
                Search by Company Name
              </label>

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74808C] pointer-events-none"
                />

                <input
                  type="text"
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  placeholder="Search agent company..."
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Filter by Country
              </label>

              <div className="relative">
                <Filter
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74808C] pointer-events-none"
                />

                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className={`${inputClass} pl-10 cursor-pointer`}
                >
                  <option value="">All Countries</option>

                  {availableCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Agent Selection */}
        {agents.length === 0 ? (
          <div className="p-8 text-center bg-[#F7F9FB] rounded-xl border border-[#E2E7ED]">
            <Building2
              size={32}
              className="mx-auto text-[#9AA4AF] mb-2"
            />

            <p className="text-sm font-semibold text-[#242A31]">
              No Agents Registered
            </p>

            <p className="text-xs text-[#74808C] mt-1">
              Add agents in the Agent Management module to select them for rate requests.
            </p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="p-8 text-center bg-[#F7F9FB] rounded-xl border border-[#E2E7ED]">
            <Search
              size={30}
              className="mx-auto text-[#9AA4AF] mb-2"
            />

            <p className="text-sm font-semibold text-[#242A31]">
              No Matching Agents
            </p>

            <p className="text-xs text-[#74808C] mt-1">
              Try another company name or select a different country.
            </p>

            <button
              type="button"
              onClick={clearAgentFilters}
              className="mt-3 text-xs font-semibold text-[#354C63] hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAgents.map((ag) => {
              const agId = getAgentId(ag);
              const isSelected = selectedAgentIds.includes(agId);

              return (
                <div
                  key={agId}
                  onClick={() => handleToggleAgent(agId)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${isSelected
                      ? 'border-[#354C63] bg-[#EDF2F7] shadow-sm ring-1 ring-[#354C63]/15'
                      : 'border-[#E2E7ED] hover:border-[#AAB9C8] bg-white hover:bg-[#F7F9FB]'
                    }`}
                >
                  <div className="mt-0.5 text-[#354C63] flex-shrink-0">
                    {isSelected ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} className="text-[#AAB4BF]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#242A31] truncate">
                        {ag.name || ag.agent_name}
                      </h4>

                      <span className="text-[10px] font-medium px-1.5 py-0.5 bg-[#F1F4F7] text-[#596673] rounded">
                        {ag.country || 'Global'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#74808C] mt-1 flex items-center gap-1">
                      <Mail size={11} className="text-[#9AA4AF]" />
                      <span className="truncate">
                        {ag.email || 'No email registered'}
                      </span>
                    </p>

                    <p className="text-[11px] text-[#9AA4AF] mt-1">
                      Contact: {ag.contact_person || 'General Enquiry'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Agent Count */}
        <div className="mt-4 text-right">
          <span className="text-xs text-[#74808C]">
            Selected agents:{' '}
            <span className="font-semibold text-[#354C63]">
              {selectedAgentIds.length}
            </span>
          </span>
        </div>
      </section>

      {/* 4. Deadline & Instructions */}
      <section className={sectionClass}>
        <div className={sectionHeaderClass}>
          <div className={iconTileClass}>
            <Clock size={19} />
          </div>

          <div>
            <h3 className={headingClass}>
              4. Deadline & Instructions
            </h3>

            <p className={descriptionClass}>
              Set quote expiration deadline and specific handling guidelines for recipients
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>
              Response Deadline <span className="text-[#C45151]">*</span>
            </label>

            <input
              type="date"
              value={responseDeadline}
              onChange={(e) => {
                setResponseDeadline(e.target.value);

                if (errors.responseDeadline) {
                  setErrors((prev) => ({
                    ...prev,
                    responseDeadline: '',
                  }));
                }
              }}
              className={`${inputClass} ${errors.responseDeadline
                  ? 'border-[#C45151] bg-[#FCEEEE]'
                  : ''
                }`}
            />

            {errors.responseDeadline && (
              <p className="text-xs text-[#C45151] mt-1.5 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.responseDeadline}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Special Instructions for Agents
            </label>

            <textarea
              rows={3}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Please quote all-in ocean freight with 14 days free time at POD, specify terminal handling and documentation fees."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#D3DBE4] text-[#596673] hover:bg-[#F7F9FB] text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          <X size={15} />
          Cancel
        </button>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Draft')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F1F4F7] hover:bg-[#E5EAF0] text-[#354C63] text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={15} />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Sent')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#354C63] hover:bg-[#293D52] active:bg-[#223448] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Send size={15} />
            <span>
              {isSubmitting
                ? 'Processing...'
                : isEditMode
                  ? 'Save & Send'
                  : 'Send Request'}
            </span>
          </button>
        </div>
      </div>

      {/* RFQ Email Preview Modal */}
      {showEmailPreview && pendingPayload && (
        <div className="fixed inset-0 z-50 bg-[#100F0E]/55 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-[#E2E7ED]">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E2E7ED]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center">
                  <Mail size={20} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#242A31]">
                    RFQ Email Preview
                  </h3>

                  <p className="text-xs text-[#74808C]">
                    Review the email before confirming
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEmailPreview(false)}
                className="p-2 text-[#74808C] hover:text-[#242A31] hover:bg-[#F1F4F7] rounded-lg transition-colors"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* Recipients */}
              <div>
                <label className={labelClass}>
                  Recipients
                </label>

                <div className="border border-[#E2E7ED] rounded-xl p-3 space-y-3">
                  {pendingPayload.agents.map((agent) => {
                    const validEmail =
                      agent.email &&
                      agent.email !== '—' &&
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agent.email);

                    return (
                      <div
                        key={agent.agent_id}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-[#242A31]">
                            {agent.agent_name}
                          </p>

                          <p className="text-xs text-[#74808C] truncate">
                            {validEmail
                              ? agent.email
                              : 'No valid email address'}
                          </p>
                        </div>

                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-lg ${validEmail
                              ? 'bg-[#E8F5EF] text-[#16845B]'
                              : 'bg-[#FCEEEE] text-[#C45151]'
                            }`}
                        >
                          {validEmail ? 'Ready' : 'Missing email'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Email Subject */}
              <div>
                <label className={labelClass}>
                  Email Subject
                </label>

                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Email Body */}
              <div>
                <label className={labelClass}>
                  Email Message
                </label>

                <textarea
                  rows={14}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className={`${inputClass} resize-y`}
                />
              </div>

              {/* Information Notice */}
              <div className="bg-[#EDF2F7] border border-[#D3DBE4] rounded-xl p-3 flex gap-2">
                <Info
                  size={16}
                  className="text-[#354C63] flex-shrink-0 mt-0.5"
                />

                <p className="text-xs text-[#354C63]">
                  Frontend preview only. Confirming will simulate email
                  sending and save email statuses. No actual emails will
                  be delivered.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-5 border-t border-[#E2E7ED] bg-[#F7F9FB]">
              <button
                type="button"
                onClick={() => setShowEmailPreview(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-semibold text-[#596673] border border-[#D3DBE4] rounded-xl hover:bg-white transition-colors"
              >
                Back to RFQ
              </button>

              <button
                type="button"
                onClick={handleConfirmEmailSend}
                disabled={
                  isSubmitting ||
                  !emailSubject.trim() ||
                  !emailBody.trim() ||
                  !pendingPayload.agents.some(
                    (agent) =>
                      agent.email &&
                      agent.email !== '—' &&
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agent.email)
                  )
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#354C63] hover:bg-[#293D52] text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors"
              >
                <Send size={15} />
                {isSubmitting
                  ? 'Processing...'
                  : 'Confirm & Send RFQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RateRequestForm;
