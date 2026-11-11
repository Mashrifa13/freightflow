
import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  BarChart2,
  FileText,
  Clock,
  Award,
  CheckCircle2,
  ShieldAlert,
  Save,
  X,
  Info,
  Layers,
  TrendingDown,
  SkipForward,
  Hourglass,
  ArrowRight,
} from 'lucide-react';

function RateComparisonForm({
  initialData = null,
  enquiries = [],
  rateRequests = [],
  quotations = [],
  comparisons = [],
  onCancel,
  onSave,
  onNavigateToPricing,
}) {
  const isEditMode = Boolean(
    initialData && (initialData.id || initialData.comparison_id)
  );

  // Form State - now selected by Enquiry
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(
    initialData?.enquiry_id || initialData?.enquiry_no || ''
  );

  const [selectedAgentId, setSelectedAgentId] = useState(
    initialData?.selected_agent_id || ''
  );

  const [selectionRemarks, setSelectionRemarks] = useState(
    initialData?.remarks || initialData?.selection_remarks || ''
  );

  const [status, setStatus] = useState(
    initialData?.status || 'In Progress'
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Linked Enquiry object
  const selectedEnquiry = enquiries.find(
    (e) =>
      (e.id && String(e.id) === String(selectedEnquiryId)) ||
      (e.enquiry_no && String(e.enquiry_no) === String(selectedEnquiryId))
  );

  // All RFQs belonging to the selected Enquiry
  const linkedRfqs = useMemo(() => {
    if (!selectedEnquiryId) return [];

    return rateRequests.filter((r) => {
      const rEnqId = r.enquiry_id || r.enquiry_no;
      return (
        String(rEnqId) === String(selectedEnquiryId) ||
        (selectedEnquiry &&
          (rEnqId === selectedEnquiry.id || rEnqId === selectedEnquiry.enquiry_no))
      );
    });
  }, [selectedEnquiryId, selectedEnquiry, rateRequests]);

  // Set of RFQ identifiers linked to this enquiry
  const linkedRfqIdentifiers = useMemo(() => {
    const ids = new Set();
    linkedRfqs.forEach((r) => {
      if (r.id) ids.add(String(r.id));
      if (r.rfq_no) ids.add(String(r.rfq_no));
      if (r.rfq_id) ids.add(String(r.rfq_id));
    });
    return ids;
  }, [linkedRfqs]);

  // Automatically find all received Agent Quotations linked to this enquiry across all its RFQs
  const matchedQuotations = useMemo(() => {
    if (!selectedEnquiryId) return [];

    const foundQuotes = quotations.filter((q) => {
      // 1. Direct enquiry match
      const qEnqId = q.enquiry_id || q.enquiry_no;
      if (
        qEnqId &&
        (String(qEnqId) === String(selectedEnquiryId) ||
          (selectedEnquiry &&
            (qEnqId === selectedEnquiry.id || qEnqId === selectedEnquiry.enquiry_no)))
      ) {
        return true;
      }

      // 2. Match via linked RFQs
      const qRfqId = q.rfq_id || q.rfq_no;
      if (qRfqId && linkedRfqIdentifiers.has(String(qRfqId))) {
        return true;
      }

      return false;
    });

    // Merge saved quotation snapshots when editing
    if (initialData?.quotations && initialData.quotations.length > 0) {
      const existingIds = new Set(
        foundQuotes.map((q) => q.quotation_no || q.id)
      );

      initialData.quotations.forEach((iq) => {
        if (!existingIds.has(iq.quotation_no || iq.id)) {
          foundQuotes.push(iq);
        }
      });
    }

    return foundQuotes;
  }, [selectedEnquiryId, selectedEnquiry, quotations, linkedRfqIdentifiers, initialData]);

  // Determine Lowest Cost among received quotes
  const lowestCostQuote = useMemo(() => {
    if (matchedQuotations.length === 0) return null;

    return matchedQuotations.reduce((min, curr) => {
      const currAmt = Number(curr.total_buying_rate) || 0;
      const minAmt = Number(min.total_buying_rate) || 0;

      return currAmt < minAmt ? curr : min;
    }, matchedQuotations[0]);
  }, [matchedQuotations]);

  const currency =
    matchedQuotations[0]?.currency ||
    linkedRfqs[0]?.currency ||
    selectedEnquiry?.currency ||
    'USD';

  // Fallback shipment details from Enquiry or linked RFQs
  const shipmentDetails = {
    customer_name:
      selectedEnquiry?.customer ||
      selectedEnquiry?.customer_name ||
      linkedRfqs[0]?.customer_name ||
      initialData?.customer_name ||
      '—',
    pol:
      selectedEnquiry?.pol ||
      linkedRfqs[0]?.pol ||
      initialData?.pol ||
      '—',
    pod:
      selectedEnquiry?.pod ||
      linkedRfqs[0]?.pod ||
      initialData?.pod ||
      '—',
    shipment_mode:
      selectedEnquiry?.mode ||
      selectedEnquiry?.shipment_mode ||
      linkedRfqs[0]?.shipment_mode ||
      initialData?.shipment_mode ||
      'Sea',
    commodity:
      selectedEnquiry?.commodity ||
      linkedRfqs[0]?.commodity ||
      initialData?.commodity ||
      '—',
  };

  // Check if an existing comparison exists for this enquiry (one comparison per enquiry)
  const existingComparisonForEnquiry = useMemo(() => {
    if (!selectedEnquiryId || isEditMode) return null;
    return comparisons.find(
      (c) =>
        String(c.enquiry_id) === String(selectedEnquiryId) ||
        String(c.enquiry_no) === String(selectedEnquiryId) ||
        (selectedEnquiry &&
          (c.enquiry_no === selectedEnquiry.id ||
           c.enquiry_no === selectedEnquiry.enquiry_no ||
           c.enquiry_id === selectedEnquiry.id))
    );
  }, [selectedEnquiryId, selectedEnquiry, comparisons, isEditMode]);

  // Validation
  const validate = () => {
    const errs = {};

    if (!selectedEnquiryId) {
      errs.enquiry = 'Please select an existing Enquiry to compare.';
    } else if (existingComparisonForEnquiry && !isEditMode) {
      errs.enquiry = `A Rate Comparison (${
        existingComparisonForEnquiry.comparison_id || existingComparisonForEnquiry.id
      }) already exists for this Enquiry. Only one comparison per enquiry is allowed.`;
    }

    if (matchedQuotations.length === 0) {
      errs.quotes =
        'This Enquiry has no agent quotations recorded. Submit quotes in Agent Quotations for RFQs linked to this enquiry.';
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const existingId =
      initialData?.comparison_id ||
      initialData?.id ||
      existingComparisonForEnquiry?.comparison_id ||
      existingComparisonForEnquiry?.id;

    const comparisonId = existingId || null;

    const chosenQuote = matchedQuotations.find(
      (q) =>
        (q.agent_id && q.agent_id === selectedAgentId) ||
        (q.agent_name && q.agent_name === selectedAgentId)
    );

    const lowestCostVal = lowestCostQuote
      ? Number(lowestCostQuote.total_buying_rate)
      : null;

    const selectedBuyingCost = chosenQuote
      ? Number(chosenQuote.total_buying_rate)
      : null;

    const selectedCurrency = chosenQuote?.currency || currency;

    const representativeRfqNo =
      linkedRfqs[0]?.rfq_no ||
      linkedRfqs[0]?.id ||
      initialData?.rfq_no ||
      (linkedRfqs.length > 0 ? linkedRfqs.map((r) => r.rfq_no || r.id).join(', ') : '—');

    const representativeRfqId =
      linkedRfqs[0]?.id || linkedRfqs[0]?.rfq_no || initialData?.rfq_id || null;

    const payload = {
      id: comparisonId,
      comparison_id: comparisonId,
      enquiry_id: selectedEnquiryId,
      enquiry_no:
        selectedEnquiry?.id ||
        selectedEnquiry?.enquiry_no ||
        selectedEnquiryId,
      rfq_id: representativeRfqId,
      rfq_no: representativeRfqNo,
      rfq_count: linkedRfqs.length,
      customer_name: shipmentDetails.customer_name,
      pol: shipmentDetails.pol,
      pod: shipmentDetails.pod,
      shipment_mode: shipmentDetails.shipment_mode,
      commodity: shipmentDetails.commodity,
      currency: currency,
      agent_count: matchedQuotations.length,
      lowest_cost: lowestCostVal,
      selected_agent_id: selectedAgentId || null,
      selected_agent_name: chosenQuote
        ? chosenQuote.agent_name
        : initialData?.selected_agent_name || null,
      selected_quotation_no: chosenQuote
        ? chosenQuote.quotation_no || chosenQuote.id
        : null,
      remarks: selectionRemarks,
      selection_remarks: selectionRemarks,
      status: selectedAgentId
        ? status === 'In Progress'
          ? 'Agent Selected'
          : status
        : status,
      quotations: matchedQuotations,
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      selected_total_cost: selectedBuyingCost,
      selected_currency: selectedCurrency,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSave) onSave(payload);
    }, 350);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-6xl mx-auto pb-12"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#E2E7ED] gap-4">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74808C] hover:text-[#354C63] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Rate Comparisons
          </button>

          <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
            {isEditMode
              ? 'Edit Rate Comparison'
              : 'Create Rate Comparison'}
          </h2>

          <p className="text-xs text-[#74808C] mt-0.5">
            {isEditMode
              ? `Reviewing quotes and selection for ${initialData?.comparison_id || initialData?.id}.`
              : 'Select an Enquiry to analyze and compare all received agent buying rates across linked RFQs side-by-side.'}
          </p>
        </div>

        {onNavigateToPricing && (
          <button
            type="button"
            onClick={onNavigateToPricing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#354C63] text-[#354C63] hover:bg-[#F1F4F7] text-xs font-semibold rounded-xl transition-all cursor-pointer self-start sm:self-auto"
            title="Skip comparison and proceed directly to Pricing"
          >
            <SkipForward size={14} />
            <span>Skip Comparison & Proceed to Pricing</span>
          </button>
        )}
      </div>

      {/* 1. Enquiry Selector Card */}
      <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#E2E7ED]">
          <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
            <FileText size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              1. Select Enquiry for Comparison
            </h3>

            <p className="text-xs text-[#74808C]">
              Choose an enquiry; all agent quotations linked across all its RFQs will
              populate automatically
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#596673] mb-1.5">
              Select Enquiry <span className="text-[#C45151]">*</span>
            </label>

            <select
              value={selectedEnquiryId}
              disabled={isEditMode}
              onChange={(e) => {
                setSelectedEnquiryId(e.target.value);
                setSelectedAgentId('');

                if (errors.enquiry) {
                  setErrors((prev) => ({ ...prev, enquiry: '' }));
                }

                if (errors.quotes) {
                  setErrors((prev) => ({ ...prev, quotes: '' }));
                }
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border rounded-xl text-[#242A31] focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${errors.enquiry
                  ? 'border-[#C45151] bg-[#FCEEEE]'
                  : 'border-[#D3DBE4]'
                }`}
            >
              <option value="">
                {enquiries.length === 0
                  ? 'No Enquiries Available'
                  : '— Select an Enquiry —'}
              </option>

              {enquiries.map((enq) => {
                const id = enq.enquiry_no || enq.id;
                const cust = enq.customer || enq.customer_name || 'Customer';
                const route = `${enq.pol || 'POL'} → ${enq.pod || 'POD'}`;
                const hasExisting = comparisons.some(
                  (c) =>
                    !isEditMode &&
                    (String(c.enquiry_id) === String(id) ||
                     String(c.enquiry_no) === String(id))
                );

                return (
                  <option key={id} value={id}>
                    {id} — {cust} ({route}){hasExisting ? ' [Comparison exists]' : ''}
                  </option>
                );
              })}
            </select>

            {errors.enquiry && (
              <p className="text-xs text-[#C45151] mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.enquiry}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#596673] mb-1.5">
              Comparison Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl text-[#242A31] focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all"
            >
              <option value="In Progress">In Progress</option>
              <option value="Agent Selected">Agent Selected</option>
              <option value="Finalized">Finalized</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Selected Enquiry Route & Specs Banner */}
        {selectedEnquiryId && (
          <div className="mt-4 p-4 bg-[#EDF2F7] rounded-xl border border-[#D3DBE4] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[#74808C] block font-medium">
                Customer
              </span>
              <span className="font-bold text-[#242A31]">
                {shipmentDetails.customer_name}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">
                Route
              </span>
              <span className="font-bold text-[#354C63]">
                {shipmentDetails.pol} → {shipmentDetails.pod}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">
                Shipment Mode
              </span>
              <span className="font-bold text-[#242A31]">
                {shipmentDetails.shipment_mode}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">
                Linked RFQs
              </span>
              <span className="font-bold text-[#354C63]">
                {linkedRfqs.length > 0
                  ? linkedRfqs.map((r) => r.rfq_no || r.id).join(', ')
                  : 'No RFQ records'}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* 2. Side-by-Side Comparison Matrix */}
      <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E2E7ED]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
              <BarChart2 size={19} />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#242A31]">
                2. Side-by-Side Agent Quotation Matrix ({currency})
              </h3>

              <p className="text-xs text-[#74808C]">
                Direct comparison of freight, origin, destination, additional
                charges, and transit times across all RFQs for this enquiry
              </p>
            </div>
          </div>

          {matchedQuotations.length > 0 && lowestCostQuote && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5EF] border border-[#C5E6D5] rounded-xl text-xs text-[#16845B] font-semibold self-start sm:self-auto">
              <TrendingDown size={14} />
              <span>
                Lowest Quote: {currency}{' '}
                {Number(lowestCostQuote.total_buying_rate).toFixed(2)} (
                {lowestCostQuote.agent_name})
              </span>
            </div>
          )}
        </div>

        {errors.quotes && (
          <div className="p-3 bg-[#FBF2E2] border border-[#EBD8B5] rounded-xl flex items-center gap-2 text-xs text-[#A87525]">
            <Info size={14} className="flex-shrink-0" />
            <span>{errors.quotes}</span>
          </div>
        )}

        {/* Informational banner when exactly 1 quotation is found */}
        {matchedQuotations.length === 1 && (
          <div className="p-4 bg-[#E8F5EF] border border-[#C8E7D8] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#16845B]">
              <CheckCircle2 size={17} className="flex-shrink-0" />
              <span>
                <strong>1 Quotation Received:</strong> Rate comparison is optional for single quotations. You can proceed directly to Pricing without comparison.
              </span>
            </div>
            {onNavigateToPricing && (
              <button
                type="button"
                onClick={onNavigateToPricing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16845B] hover:bg-[#126b4a] text-white font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <span>Proceed to Pricing</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        )}

        {matchedQuotations.length === 0 ? (
          <div className="p-12 text-center bg-[#F7F9FB] rounded-xl border border-[#E2E7ED]">
            <div className="w-12 h-12 rounded-2xl bg-[#EDF2F7] border border-[#D3DBE4] flex items-center justify-center text-[#354C63] mx-auto mb-3">
              {selectedEnquiryId ? <Hourglass size={24} className="text-[#A87525] animate-pulse" /> : <Layers size={24} />}
            </div>

            <h4 className="text-sm font-semibold text-[#242A31]">
              {selectedEnquiryId
                ? 'Waiting for Agent Responses'
                : 'Select an Enquiry to View Quotations'}
            </h4>

            <p className="text-xs text-[#74808C] mt-1 max-w-md mx-auto">
              {selectedEnquiryId
                ? 'No agent quotations have been logged for the RFQs of this Enquiry yet. Waiting for overseas agent submissions.'
                : 'Select an Enquiry above to preview quotation comparison and agent rates.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E7ED]">
                  <th className="py-3 px-4 bg-[#EDF2F7] font-bold text-[#354C63] uppercase tracking-wider w-44">
                    Comparison Metric
                  </th>

                  {matchedQuotations.map((quote) => {
                    const isLowest =
                      lowestCostQuote &&
                      (quote.quotation_no || quote.id) ===
                      (lowestCostQuote.quotation_no ||
                        lowestCostQuote.id);

                    const isSelected =
                      selectedAgentId ===
                      (quote.agent_id || quote.agent_name);

                    return (
                      <th
                        key={quote.quotation_no || quote.id}
                        className={`py-3 px-4 text-center min-w-[200px] transition-all ${isSelected
                            ? 'bg-[#EDF2F7] border-x-2 border-t-2 border-[#354C63] rounded-t-xl'
                            : isLowest
                              ? 'bg-[#E8F5EF] border-x border-t border-[#C5E6D5] rounded-t-xl'
                              : 'bg-[#F7F9FB]'
                          }`}
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-sm text-[#242A31] block">
                            {quote.agent_name}
                          </span>

                          <span className="text-[11px] font-medium text-[#74808C] block">
                            {quote.quotation_no || quote.id}
                          </span>

                          {isLowest && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5EF] text-[#16845B]">
                              <TrendingDown size={11} />
                              Lowest Cost
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E7ED]">
                {/* 1. Base Freight */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    A. Freight Charges
                  </td>

                  {matchedQuotations.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center font-semibold text-[#242A31]"
                    >
                      {currency} {Number(q.total_freight || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* 2. Origin Charges */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    B. Origin Charges
                  </td>

                  {matchedQuotations.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center font-semibold text-[#242A31]"
                    >
                      {currency} {Number(q.total_origin || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* 3. Destination Charges */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    C. Destination Charges
                  </td>

                  {matchedQuotations.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center font-semibold text-[#242A31]"
                    >
                      {currency} {Number(q.total_destination || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* 4. Other Charges */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    D. Other Charges
                  </td>

                  {matchedQuotations.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center font-semibold text-[#242A31]"
                    >
                      {currency} {Number(q.total_other || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Total Buying Rate Highlight */}
                <tr className="bg-[#EDF2F7] border-y-2 border-[#D3DBE4]">
                  <td className="py-3.5 px-4 font-bold text-[#242A31] text-sm">
                    Total Landed Cost
                  </td>

                  {matchedQuotations.map((q) => {
                    const isLowest =
                      lowestCostQuote &&
                      (q.quotation_no || q.id) ===
                      (lowestCostQuote.quotation_no ||
                        lowestCostQuote.id);

                    return (
                      <td
                        key={q.quotation_no || q.id}
                        className={`py-3.5 px-4 text-center font-black text-sm ${isLowest
                            ? 'text-[#16845B] bg-[#E8F5EF]'
                            : 'text-[#354C63]'
                          }`}
                      >
                        {currency}{' '}
                        {Number(q.total_buying_rate || 0).toFixed(2)}
                      </td>
                    );
                  })}
                </tr>

                {/* Quotation Validity */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    Rate Validity Date
                  </td>

                  {matchedQuotations.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center text-[#596673] font-medium"
                    >
                      <div className="flex items-center justify-center gap-1 text-[#A87525]">
                        <Clock size={12} />
                        <span>{q.validity_date || '—'}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Transit Time & Remarks */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#354C63] bg-[#F7F9FB]">
                    Transit Time & Terms
                  </td>

                  {matchedQuotations.map((q) => (
                    <td
                      key={q.quotation_no || q.id}
                      className="py-3 px-4 text-center text-[#596673]"
                    >
                      <span className="block italic text-[11px] line-clamp-2">
                        {q.remarks || 'Standard terms'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Preferred Agent Selection */}
                <tr className="border-t-2 border-[#D3DBE4] bg-[#F7F9FB]">
                  <td className="py-4 px-4 font-bold text-[#242A31]">
                    Select Preferred Agent
                  </td>

                  {matchedQuotations.map((q) => {
                    const agId = q.agent_id || q.agent_name;
                    const isSelected = selectedAgentId === agId;

                    return (
                      <td
                        key={q.quotation_no || q.id}
                        className="py-4 px-4 text-center"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedAgentId(agId)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${isSelected
                              ? 'bg-[#354C63] text-white shadow-sm ring-2 ring-[#647E96]/30'
                              : 'bg-white border border-[#D3DBE4] text-[#596673] hover:border-[#647E96] hover:bg-[#EDF2F7]'
                            }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 size={14} />
                              <span>Selected</span>
                            </>
                          ) : (
                            <span>Award Partner</span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 3. Selection Decision & Remarks */}
      <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#E2E7ED]">
          <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
            <Award size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              3. Selection Decision & Justification
            </h3>

            <p className="text-xs text-[#74808C]">
              Document reasons for preferred agent award (cost, transit speed,
              carrier reliability, free detention days)
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#596673] mb-1.5">
            Internal Selection Remarks
          </label>

          <textarea
            rows={3}
            value={selectionRemarks}
            onChange={(e) => setSelectionRemarks(e.target.value)}
            placeholder="e.g. Selected Ocean Express Logistics due to optimal balance of lowest freight rate and 14 days free time at discharge port."
            className="w-full px-3.5 py-2 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl text-[#242A31] placeholder:text-[#74808C] focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all resize-none"
          />
        </div>
      </section>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          {onNavigateToPricing && (
            <button
              type="button"
              onClick={onNavigateToPricing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#354C63] text-[#354C63] hover:bg-[#F1F4F7] text-sm font-semibold rounded-xl transition-all cursor-pointer"
              title="Skip comparison and proceed directly to Pricing"
            >
              <SkipForward size={15} />
              <span>Skip Comparison & Proceed to Pricing</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#D3DBE4] text-[#596673] hover:bg-[#F1F4F7] hover:text-[#354C63] text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            <X size={15} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#354C63] hover:bg-[#293D52] active:bg-[#223448] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={15} />
            <span>
              {isSubmitting
                ? 'Saving...'
                : isEditMode
                  ? 'Save Changes'
                  : 'Save Comparison'}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default RateComparisonForm;
