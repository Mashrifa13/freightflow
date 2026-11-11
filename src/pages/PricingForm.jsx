
import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  FileText,
  ShieldAlert,
  Save,
  X,
  Calculator,
  Plus,
  Trash2,
  Hourglass,
  CheckCircle2,
  Award,
  Layers,
} from 'lucide-react';

function PricingForm({
  initialData = null,
  enquiries = [],
  comparisons = [],
  quotations = [],
  rateRequests = [],
  onCancel,
  onSave,
}) {
  const isEditMode = Boolean(
    initialData && (initialData.pricing_id || initialData.id)
  );

  // Form State
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(
    initialData?.enquiry_id || initialData?.enquiry_no || ''
  );

  const [selectedQuotationNo, setSelectedQuotationNo] = useState(
    initialData?.selected_quotation_no || ''
  );

  const [currency, setCurrency] = useState(
    initialData?.currency || 'USD'
  );

  // Restore existing breakdown or preserve legacy buying cost
  const [freightCharges, setFreightCharges] = useState(
    initialData?.freight_charges?.length > 0
      ? initialData.freight_charges
      : initialData?.total_buying_cost != null
        ? [{
          description: 'Existing Buying Cost',
          amount: String(initialData.total_buying_cost),
        }]
        : [{ description: 'Base Freight', amount: '' }]
  );

  const [originCharges, setOriginCharges] = useState(
    initialData?.origin_charges?.length > 0
      ? initialData.origin_charges
      : []
  );

  const [destinationCharges, setDestinationCharges] = useState(
    initialData?.destination_charges?.length > 0
      ? initialData.destination_charges
      : []
  );

  const [otherCharges, setOtherCharges] = useState(
    initialData?.other_charges?.length > 0
      ? initialData.other_charges
      : []
  );

  const [marginType, setMarginType] = useState(
    initialData?.margin_type || 'percentage'
  );

  const [marginValue, setMarginValue] = useState(
    initialData?.margin_value != null
      ? String(initialData.margin_value)
      : '15'
  );

  const [sellingPrice, setSellingPrice] = useState(
    initialData?.selling_price != null
      ? String(initialData.selling_price)
      : ''
  );

  const [status, setStatus] = useState(
    initialData?.status || 'Draft'
  );

  const [notes, setNotes] = useState(
    initialData?.notes || ''
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find linked enquiry
  const selectedEnquiry = enquiries.find(
    (e) =>
      (e.id && String(e.id) === String(selectedEnquiryId)) ||
      (e.enquiry_no && String(e.enquiry_no) === String(selectedEnquiryId))
  );

  // Set of RFQ identifiers linked to this enquiry
  const linkedRfqs = useMemo(() => {
    if (!selectedEnquiryId) return [];
    return rateRequests.filter((r) => {
      const rEnqId = r.enquiry_id || r.enquiry_no;
      return (
        String(rEnqId) === String(selectedEnquiryId) ||
        (selectedEnquiry &&
          (String(rEnqId) === String(selectedEnquiry.id) ||
            String(rEnqId) === String(selectedEnquiry.enquiry_no)))
      );
    });
  }, [selectedEnquiryId, selectedEnquiry, rateRequests]);

  const linkedRfqIds = useMemo(() => {
    const set = new Set();
    linkedRfqs.forEach((r) => {
      if (r.id) set.add(String(r.id));
      if (r.rfq_no) set.add(String(r.rfq_no));
      if (r.rfq_id) set.add(String(r.rfq_id));
    });
    return set;
  }, [linkedRfqs]);

  // All received agent quotations matching this enquiry directly or via linked RFQs
  const matchedQuotations = useMemo(() => {
    if (!selectedEnquiryId) return [];

    const foundQuotes = quotations.filter((q) => {
      const qEnqId = q.enquiry_id || q.enquiry_no;
      if (
        qEnqId &&
        (String(qEnqId) === String(selectedEnquiryId) ||
          (selectedEnquiry &&
            (String(qEnqId) === String(selectedEnquiry.id) ||
              String(qEnqId) === String(selectedEnquiry.enquiry_no))))
      ) {
        return true;
      }

      if (
        (q.rfq_id && linkedRfqIds.has(String(q.rfq_id))) ||
        (q.rfq_no && linkedRfqIds.has(String(q.rfq_no)))
      ) {
        return true;
      }

      return false;
    });

    return foundQuotes;
  }, [selectedEnquiryId, selectedEnquiry, quotations, linkedRfqIds]);

  // Find the Rate Comparison associated with the selected enquiry
  const selectedComparison = comparisons.find(
    (comparison) =>
      String(comparison.enquiry_no) ===
        String(selectedEnquiry?.enquiry_no || selectedEnquiryId) ||
      String(comparison.enquiry_id) === String(selectedEnquiryId)
  );

  const isComparisonFinalized =
    selectedComparison &&
    (selectedComparison.status === 'Finalized' ||
      selectedComparison.status === 'Agent Selected');

  // Quotation auto-selection logic based on business rules
  useEffect(() => {
    if (isEditMode) return;
    if (!selectedEnquiryId) {
      setSelectedQuotationNo('');
      return;
    }

    // Rule 2: If a finalized Rate Comparison exists, use its selected_quotation_no
    if (isComparisonFinalized && selectedComparison?.selected_quotation_no) {
      setSelectedQuotationNo(String(selectedComparison.selected_quotation_no));
      return;
    }

    // Rule 1: If an enquiry has one agent quotation, automatically select it
    if (matchedQuotations.length === 1) {
      const singleQuote = matchedQuotations[0];
      const qNo = singleQuote.quotation_no || singleQuote.id;
      setSelectedQuotationNo(String(qNo));
      return;
    }

    // Rule 3: If multiple quotations exist without a finalized comparison
    if (matchedQuotations.length > 1) {
      // If current selection is still in matched quotations, keep it; otherwise default to empty or first
      const exists = matchedQuotations.some(
        (q) => String(q.quotation_no || q.id) === String(selectedQuotationNo)
      );
      if (!exists) {
        setSelectedQuotationNo('');
      }
      return;
    }

    // Rule 4: If no quotations exist
    if (matchedQuotations.length === 0) {
      setSelectedQuotationNo('');
    }
  }, [
    selectedEnquiryId,
    isEditMode,
    isComparisonFinalized,
    selectedComparison,
    matchedQuotations,
  ]);

  // Active quotation object resolved from selectedQuotationNo
  const activeQuotation = useMemo(() => {
    if (!selectedQuotationNo) return null;

    return (
      matchedQuotations.find(
        (q) => String(q.quotation_no || q.id) === String(selectedQuotationNo)
      ) ||
      quotations.find(
        (q) => String(q.quotation_no || q.id) === String(selectedQuotationNo)
      ) ||
      selectedComparison?.quotations?.find(
        (q) => String(q.quotation_no || q.id) === String(selectedQuotationNo)
      ) ||
      null
    );
  }, [selectedQuotationNo, matchedQuotations, quotations, selectedComparison]);

  // Auto-populate charge arrays, totals, currency, and agent details when active quotation changes
  useEffect(() => {
    if (isEditMode || !selectedEnquiryId) return;

    if (activeQuotation) {
      setFreightCharges(
        activeQuotation.freight_charges?.length > 0
          ? activeQuotation.freight_charges
          : activeQuotation.total_freight != null
          ? [
              {
                description: 'Ocean / Air Freight',
                amount: String(activeQuotation.total_freight),
              },
            ]
          : activeQuotation.total_buying_rate != null
          ? [
              {
                description: 'Base Freight',
                amount: String(activeQuotation.total_buying_rate),
              },
            ]
          : [{ description: 'Base Freight', amount: '' }]
      );

      setOriginCharges(activeQuotation.origin_charges || []);
      setDestinationCharges(activeQuotation.destination_charges || []);
      setOtherCharges(activeQuotation.other_charges || []);

      if (activeQuotation.currency) {
        setCurrency(activeQuotation.currency);
      }
      return;
    }

    // Fallback: if comparison exists without quote object
    if (selectedComparison && isComparisonFinalized) {
      const fallbackCost =
        selectedComparison.selected_total_cost ??
        selectedComparison.lowest_cost;

      if (fallbackCost != null) {
        setFreightCharges([
          {
            description: 'Quoted Buying Cost',
            amount: String(fallbackCost),
          },
        ]);
        setOriginCharges([]);
        setDestinationCharges([]);
        setOtherCharges([]);
      }

      setCurrency(
        selectedComparison.selected_currency ||
          selectedComparison.currency ||
          'USD'
      );
    }
  }, [
    activeQuotation,
    selectedComparison,
    isComparisonFinalized,
    selectedEnquiryId,
    isEditMode,
  ]);

  // Charge handlers (same structure as Agent Quotation)
  const handleChargeChange = (setter, index, field, value) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddCharge = (
    setter,
    defaultDesc = 'Additional Charge'
  ) => {
    setter((prev) => [
      ...prev,
      { description: defaultDesc, amount: '' },
    ]);
  };

  const handleRemoveCharge = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate charge subtotals
  const sumAmounts = (list) =>
    list.reduce(
      (acc, curr) => acc + (parseFloat(curr.amount) || 0),
      0
    );

  const totalFreight = sumAmounts(freightCharges);
  const totalOrigin = sumAmounts(originCharges);
  const totalDestination = sumAmounts(destinationCharges);
  const totalOther = sumAmounts(otherCharges);

  const totalBuyingRate =
    totalFreight +
    totalOrigin +
    totalDestination +
    totalOther;

  // Automatically calculate selling price
  useEffect(() => {
    const cost = totalBuyingRate;
    const margin = parseFloat(marginValue) || 0;

    if (cost > 0) {
      const calculatedSelling =
        marginType === 'percentage'
          ? cost + (cost * margin) / 100
          : cost + margin;

      setSellingPrice(calculatedSelling.toFixed(2));
    } else {
      setSellingPrice('');
    }
  }, [totalBuyingRate, marginType, marginValue]);

  // Validation
  const validate = () => {
    const errs = {};

    if (!selectedEnquiryId) {
      errs.enquiry = 'Please select an enquiry.';
    }

    if (totalBuyingRate <= 0) {
      errs.total = 'Please specify at least one charge item with a valid amount.';
    }

    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      errs.sellingPrice = 'Please provide a valid selling price.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save Pricing
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const existingId =
      initialData?.pricing_id ||
      initialData?.id;

    const pricingId = existingId || null;

    const costNum = totalBuyingRate;
    const priceNum = parseFloat(sellingPrice) || 0;

    const profitMargin = priceNum - costNum;

    const profitPercentage =
      costNum > 0
        ? (profitMargin / costNum) * 100
        : 0;

    // Remove incomplete charge rows before saving
    const cleanCharges = (charges) =>
      charges.filter(
        (c) =>
          c.description?.trim() &&
          c.amount !== '' &&
          Number(c.amount) >= 0
      );

    const payload = {
      id: pricingId,
      pricing_id: pricingId,

      enquiry_id: selectedEnquiryId,

      enquiry_no:
        selectedEnquiry?.enquiry_no ||
        selectedEnquiry?.id ||
        selectedEnquiryId,

      customer_name:
        selectedEnquiry?.customer ||
        selectedEnquiry?.customer_name ||
        initialData?.customer_name ||
        '—',

      shipment_mode:
        selectedEnquiry?.shipment_mode ||
        selectedEnquiry?.mode ||
        initialData?.shipment_mode ||
        'Sea',

      currency,

      // Reference to the selected Agent Quotation
      selected_quotation_no:
        selectedQuotationNo ||
        activeQuotation?.quotation_no ||
        activeQuotation?.id ||
        selectedComparison?.selected_quotation_no ||
        null,

      selected_agent_id:
        activeQuotation?.agent_id ||
        selectedComparison?.selected_agent_id ||
        null,

      selected_agent_name:
        activeQuotation?.agent_name ||
        selectedComparison?.selected_agent_name ||
        null,

      // Detailed buying charge breakdown
      freight_charges: cleanCharges(freightCharges),
      origin_charges: cleanCharges(originCharges),
      destination_charges: cleanCharges(destinationCharges),
      other_charges: cleanCharges(otherCharges),

      // Charge subtotals
      total_freight: totalFreight,
      total_origin: totalOrigin,
      total_destination: totalDestination,
      total_other: totalOther,

      // Total buying cost
      total_buying_cost: costNum,

      // Selling price and margin
      selling_price: priceNum,
      profit_margin: profitMargin,
      profit_percentage: profitPercentage,
      margin_type: marginType,
      margin_value: parseFloat(marginValue) || 0,

      status,
      notes,

      created_at:
        initialData?.created_at || new Date().toISOString(),

      updated_at: new Date().toISOString(),
    };

    console.log(
      `DRF Payload for ${isEditMode
        ? 'PUT /api/pricing/' + pricingId + '/'
        : 'POST /api/pricing/'
      }:`,
      payload
    );

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSave) onSave(payload);
    }, 350);
  };

  // Styling
  const inputClass = (hasError = false) =>
    `w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border rounded-xl text-[#242A31]
    placeholder:text-[#9AA4AE] focus:outline-none focus:ring-2
    focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all ${hasError
      ? 'border-[#C45151] bg-[#FCEEEE]/50'
      : 'border-[#D3DBE4]'
    }`;

  const labelClass =
    'block text-xs font-semibold text-[#424B55] mb-1.5';

  const sectionClass =
    'bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6';

  // Reusable charge section (same as Agent Quotation)
  const renderChargeSection = ({
    title,
    description,
    charges,
    setter,
    defaultDescription,
    subtotal,
    placeholder,
    allowEmpty = false,
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-[#242A31] uppercase tracking-wider">
            {title}
          </h4>

          <p className="text-[11px] text-[#74808C] mt-1">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            handleAddCharge(setter, defaultDescription)
          }
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#354C63] hover:text-[#35271F] transition-colors cursor-pointer shrink-0"
        >
          <Plus size={13} />
          Add Item
        </button>
      </div>

      {charges.length === 0 && allowEmpty ? (
        <p className="text-xs text-[#74808C] italic py-3 px-3 bg-[#F7F9FB] rounded-xl">
          No extra charges added. Click "+ Add Item" if applicable.
        </p>
      ) : (
        <div className="space-y-2">
          {charges.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <input
                type="text"
                placeholder={placeholder}
                value={item.description}
                onChange={(e) =>
                  handleChargeChange(
                    setter,
                    idx,
                    'description',
                    e.target.value
                  )
                }
                className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all"
              />

              <div className="w-full sm:w-40 relative shrink-0">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#74808C] font-semibold">
                  {currency}
                </span>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={item.amount}
                  onChange={(e) =>
                    handleChargeChange(
                      setter,
                      idx,
                      'amount',
                      e.target.value
                    )
                  }
                  className="w-full pl-12 pr-3 py-2.5 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all font-semibold text-[#242A31]"
                />
              </div>

              {(allowEmpty || charges.length > 1) && (
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveCharge(setter, idx)
                  }
                  className="self-end sm:self-auto p-2 text-[#74808C] hover:text-[#C45151] rounded-lg hover:bg-[#FCEEEE] transition-colors"
                  title="Remove charge"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {charges.length > 0 && (
        <div className="text-right text-xs text-[#74808C] pt-1">
          Subtotal:{' '}
          <span className="font-bold text-[#242A31]">
            {currency}{' '}
            {subtotal.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-5xl mx-auto pb-12"
    >
      {/* Header */}
      <div className="pb-3 border-b border-[#E2E7ED]">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74808C] hover:text-[#354C63] transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Pricing List
        </button>

        <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
          {isEditMode
            ? 'Edit Pricing'
            : 'Create Pricing Calculation'}
        </h2>

        <p className="text-xs text-[#74808C] mt-1">
          {isEditMode
            ? `Editing rate calculation for ${initialData?.pricing_id || initialData?.id}.`
            : 'Select an enquiry, itemize buying charges, configure margin markup, and determine selling prices.'}
        </p>
      </div>

      {/* 1. Enquiry Selection */}
      <section className={sectionClass}>
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#E2E7ED]">
          <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center shrink-0">
            <FileText size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              1. Select Enquiry
            </h3>

            <p className="text-xs text-[#74808C]">
              Pick an enquiry to associate pricing calculations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              Select Enquiry <span className="text-[#C45151]">*</span>
            </label>

            <select
              value={selectedEnquiryId}
              onChange={(e) => {
                setSelectedEnquiryId(e.target.value);

                if (errors.enquiry) {
                  setErrors((prev) => ({
                    ...prev,
                    enquiry: '',
                  }));
                }
              }}
              className={inputClass(Boolean(errors.enquiry))}
            >
              <option value="">
                {enquiries.length === 0
                  ? 'No Enquiries Available'
                  : '— Select Enquiry —'}
              </option>

              {enquiries.map((enq) => {
                const id = enq.id || enq.enquiry_no;
                const cust =
                  enq.customer || enq.customer_name || 'Customer';
                const mode = enq.mode || enq.shipment_mode || 'Sea';

                return (
                  <option key={id} value={id}>
                    {id} — {cust} ({mode})
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
            <label className={labelClass}>Pricing Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass()}
            >
              <option value="Draft">Draft</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Quoted">Quoted to Customer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {selectedEnquiry && (
          <div className="mt-4 p-3 bg-[#EDF2F7] rounded-xl border border-[#D3DBE4] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-[#596673]">
              Customer:{' '}
              <span className="font-bold text-[#242A31]">
                {selectedEnquiry.customer ||
                  selectedEnquiry.customer_name}
              </span>
            </span>

            <span className="text-[#354C63] font-semibold">
              Route: {selectedEnquiry.pol} → {selectedEnquiry.pod} (
              {selectedEnquiry.mode ||
                selectedEnquiry.shipment_mode ||
                'Sea'}
              )
            </span>
          </div>
        )}

        {/* Quotation Connection & Selection Banner */}
        {selectedEnquiry && (
          <div className="mt-5 pt-5 border-t border-[#E2E7ED] space-y-3">
            {/* Scenario 4: No agent quotations exist */}
            {matchedQuotations.length === 0 && (
              <div className="p-4 bg-[#FBF2E2] border border-[#EEDBB8] rounded-xl flex items-start gap-3 text-xs text-[#A87527]">
                <Hourglass size={18} className="shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="font-bold text-[#242A31]">
                    Waiting for Agent Responses
                  </h4>
                  <p className="mt-0.5 text-[#596673]">
                    No agent quotations have been logged for this enquiry yet. You can manually enter buying charges below, or await agent quotations.
                  </p>
                </div>
              </div>
            )}

            {/* Scenario 2: Finalized Rate Comparison exists */}
            {isComparisonFinalized && (
              <div className="p-4 bg-[#EDF2F7] border border-[#D3DBE4] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#354C63] text-white flex items-center justify-center shrink-0">
                    <Award size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#242A31]">
                        Finalized Rate Comparison Used
                      </span>
                      <span className="px-2 py-0.5 bg-[#E8F5EF] text-[#16845B] border border-[#C8E7D8] rounded-full text-[10px] font-semibold">
                        {selectedComparison.status}
                      </span>
                    </div>
                    <p className="text-[#596673] mt-0.5">
                      Auto-selected winning quotation{' '}
                      <span className="font-semibold text-[#354C63]">
                        {selectedComparison.selected_quotation_no || selectedQuotationNo}
                      </span>
                      {selectedComparison.selected_agent_name && (
                        <span> ({selectedComparison.selected_agent_name})</span>
                      )}
                    </p>
                  </div>
                </div>

                {activeQuotation && (
                  <div className="text-right text-xs">
                    <span className="text-[#74808C] block text-[11px]">Total Landed Rate</span>
                    <span className="font-bold text-[#16845B]">
                      {activeQuotation.currency || currency} {Number(activeQuotation.total_buying_rate || 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Scenario 1: Exactly 1 agent quotation exists (and not a finalized comparison) */}
            {!isComparisonFinalized && matchedQuotations.length === 1 && (
              <div className="p-4 bg-[#E8F5EF] border border-[#C8E7D8] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#16845B]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <div>
                    <span className="font-bold text-[#242A31] block">
                      Single Agent Quotation Automatically Selected
                    </span>
                    <span className="text-[#596673]">
                      Quote #{matchedQuotations[0].quotation_no || matchedQuotations[0].id} from{' '}
                      <span className="font-semibold text-[#242A31]">{matchedQuotations[0].agent_name}</span>{' '}
                      ({matchedQuotations[0].currency || 'USD'} {Number(matchedQuotations[0].total_buying_rate || 0).toFixed(2)})
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-white border border-[#C8E7D8] rounded-lg text-[11px] font-semibold text-[#16845B] shrink-0 self-start sm:self-auto">
                  Comparison Not Required
                </span>
              </div>
            )}

            {/* Scenario 3: Multiple quotations exist without a finalized comparison -> allow manual selection */}
            {!isComparisonFinalized && matchedQuotations.length > 1 && (
              <div className="p-4 bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-[#354C63]" />
                    <span className="text-xs font-bold text-[#242A31]">
                      Select Agent Quotation ({matchedQuotations.length} available)
                    </span>
                  </div>
                  <span className="text-[11px] text-[#74808C]">
                    No finalized comparison exists; choose which agent quote to base pricing on
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {matchedQuotations.map((quote) => {
                    const qId = String(quote.quotation_no || quote.id);
                    const isSelected = selectedQuotationNo === qId;

                    return (
                      <button
                        key={qId}
                        type="button"
                        onClick={() => setSelectedQuotationNo(qId)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#354C63] ring-2 ring-[#354C63]/20 shadow-sm'
                            : 'bg-white border-[#E2E7ED] hover:border-[#CBD5E1]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-[#242A31] truncate">
                            {quote.agent_name}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#16845B]" />
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#74808C] mt-1.5">
                          <span>{qId}</span>
                          <span className="font-bold text-[#16845B]">
                            {quote.currency || 'USD'} {Number(quote.total_buying_rate || 0).toFixed(2)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 2. Cost Breakdown */}
      <section className={`${sectionClass} space-y-6`}>
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E7ED]">
          <div className="w-9 h-9 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center shrink-0">
            <Calculator size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              2. Cost Breakdown & Buying Charges ({currency})
            </h3>

            <p className="text-xs text-[#74808C] mt-0.5">
              Itemize freight, origin charges, destination fees and additional costs
            </p>
          </div>
        </div>

        {errors.total && (
          <div className="p-3 bg-[#FCEEEE] border border-[#F2D0D0] rounded-xl flex items-center gap-2 text-xs text-[#C45151]">
            <ShieldAlert size={14} className="shrink-0" />
            <span>{errors.total}</span>
          </div>
        )}

        {renderChargeSection({
          title: 'A. Freight Charges',
          description: 'Basic ocean/air freight rate, BAF/FAF, war risk, etc.',
          charges: freightCharges,
          setter: setFreightCharges,
          defaultDescription: 'Freight Surcharge',
          subtotal: totalFreight,
          placeholder: 'Charge Description (e.g. Ocean Freight 40HC)',
        })}

        <div className="border-t border-[#E2E7ED] pt-5">
          {renderChargeSection({
            title: 'B. Origin Charges',
            description: 'Origin CFS, export customs clearance, export documentation, pickup',
            charges: originCharges,
            setter: setOriginCharges,
            defaultDescription: 'Origin Handling',
            subtotal: totalOrigin,
            placeholder: 'Charge Description (e.g. Origin THC / Export Customs)',
          })}
        </div>

        <div className="border-t border-[#E2E7ED] pt-5">
          {renderChargeSection({
            title: 'C. Destination Charges',
            description: 'Delivery Order, port terminal handling, import clearance',
            charges: destinationCharges,
            setter: setDestinationCharges,
            defaultDescription: 'Destination THC',
            subtotal: totalDestination,
            placeholder: 'Charge Description (e.g. Delivery Order Fee, DTHC)',
          })}
        </div>

        <div className="border-t border-[#E2E7ED] pt-5">
          {renderChargeSection({
            title: 'D. Other / Contingency Charges',
            description: 'Fumigation, insurance, palletization, or additional costs',
            charges: otherCharges,
            setter: setOtherCharges,
            defaultDescription: 'Other Charge',
            subtotal: totalOther,
            placeholder: 'Charge Description',
            allowEmpty: true,
          })}
        </div>

        {/* Total Buying Cost */}
        <div className="p-5 bg-[#EDF2F7] rounded-2xl border border-[#D3DBE4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#354C63] uppercase tracking-wider block">
              Total Buying Cost (Calculated Automatically)
            </span>

            <span className="text-xs text-[#74808C] mt-1 block">
              Freight ({totalFreight.toFixed(2)}) + Origin ({totalOrigin.toFixed(2)}) + Destination ({totalDestination.toFixed(2)}) + Other ({totalOther.toFixed(2)})
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-[#354C63] tracking-tight">
              {currency}{' '}
              {totalBuyingRate.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Margin Configuration */}
      <section className={`${sectionClass} space-y-5`}>
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E7ED]">
          <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center shrink-0">
            <Calculator size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              3. Selling Price & Margin Configuration
            </h3>

            <p className="text-xs text-[#74808C]">
              Apply a percentage markup or fixed amount to calculate the customer selling price
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Currency */}
          <div>
            <label className={labelClass}>Currency</label>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputClass()}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED (AED)</option>
            </select>
          </div>

          {/* Margin Type */}
          <div>
            <label className={labelClass}>Markup / Margin Type</label>

            <select
              value={marginType}
              onChange={(e) => setMarginType(e.target.value)}
              className={inputClass()}
            >
              <option value="percentage">Percentage Markup (%)</option>
              <option value="flat">Fixed / Flat Amount</option>
            </select>
          </div>

          {/* Margin Value */}
          <div>
            <label className={labelClass}>
              Markup Value ({marginType === 'percentage' ? '%' : currency})
            </label>

            <input
              type="number"
              step="0.1"
              min="0"
              value={marginValue}
              onChange={(e) => setMarginValue(e.target.value)}
              className={`${inputClass()} font-semibold`}
            />
          </div>
        </div>

        {/* Calculated Selling Price */}
        <div className="p-5 bg-[#EDF2F7] rounded-2xl border border-[#D3DBE4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#354C63] uppercase tracking-wider block">
              Calculated Customer Selling Price
            </span>

            <span className="text-xs text-[#596673] mt-1 block">
              Estimated Gross Margin: {currency}{' '}
              {(parseFloat(sellingPrice) - totalBuyingRate || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#354C63]">
              {currency} {sellingPrice || '0.00'}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Internal Pricing Notes</label>

          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Standard 15% markup applied over selected agent buying rate. Valid for 14 days."
            className={`${inputClass()} resize-none`}
          />
        </div>
      </section>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-4 sm:p-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#D3DBE4] text-[#596673] hover:bg-[#F7F9FB] hover:text-[#242A31] text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          <X size={15} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#354C63] hover:bg-[#293D52] active:bg-[#223447] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
        >
          <Save size={15} />

          <span>
            {isSubmitting
              ? 'Saving...'
              : isEditMode
                ? 'Save Changes'
                : 'Save Pricing'}
          </span>
        </button>
      </div>
    </form>
  );
}

export default PricingForm;
