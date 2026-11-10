
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  DollarSign,
  ShieldAlert,
  Save,
  X,
  Plus,
  Trash2,
  Building2,
  Info,
} from 'lucide-react';

const DEFAULT_TERMS = `1. Rates are valid until the specified validity date and subject to equipment availability.
2. Ocean / Air freight is subject to carrier GRI, PSS, or emergency surcharges if applicable at time of shipment.
3. Destination customs duties, taxes, storage, detention, and demurrage are for the consignee's account unless explicitly agreed.
4. Standard free time: 14 days detention at destination port for containerized shipments.`;

function CustomerQuotationForm({
  initialData = null,
  pricingList = [],
  enquiries = [],
  onCancel,
  onSave,
}) {
  const isEditMode = Boolean(initialData);

  // Form State
  const [selectedPricingId, setSelectedPricingId] = useState(
    initialData?.pricing_id || ''
  );
  const [quotationDate, setQuotationDate] = useState(
    initialData?.quotation_date || new Date().toISOString().slice(0, 10)
  );
  const [validityDate, setValidityDate] = useState(
    initialData?.validity_date || ''
  );
  const [currency, setCurrency] = useState(initialData?.currency || 'USD');
  const [status, setStatus] = useState(initialData?.status || 'Draft');

  const [sellingCharges, setSellingCharges] = useState(
    initialData?.selling_charges?.length > 0
      ? initialData.selling_charges
      : [{ description: 'All-in Freight & Handling Rate', amount: '' }]
  );

  const [termsAndConditions, setTermsAndConditions] = useState(
    initialData?.terms_and_conditions != null
      ? initialData.terms_and_conditions
      : DEFAULT_TERMS
  );
  const [remarks, setRemarks] = useState(initialData?.remarks || '');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Matched Pricing record
  const selectedPricing = pricingList.find(
    (p) =>
      (p.pricing_id && p.pricing_id === selectedPricingId) ||
      (p.id && p.id === selectedPricingId)
  );

  // Matched Enquiry record
  const enquiryKey =
    selectedPricing?.enquiry_no ||
    selectedPricing?.enquiry_id ||
    initialData?.enquiry_no;

  const matchedEnquiry = enquiries.find(
    (e) =>
      (e.id && e.id === enquiryKey) ||
      (e.enquiry_no && e.enquiry_no === enquiryKey)
  );

  // Auto-fill when a Pricing record is selected in Create mode
  useEffect(() => {
    if (isEditMode || !selectedPricing) return;

    if (selectedPricing.currency) {
      setCurrency(selectedPricing.currency);
    }

    if (selectedPricing.selling_price != null) {
      setSellingCharges([
        {
          description: `All-in ${selectedPricing.shipment_mode || 'Freight'} Selling Rate`,
          amount: String(selectedPricing.selling_price),
        },
      ]);
    }

    if (!validityDate) {
      const v = new Date();
      v.setDate(v.getDate() + 14);
      setValidityDate(v.toISOString().slice(0, 10));
    }
  }, [selectedPricing, isEditMode]);

  // Charge row operations
  const handleChargeChange = (index, field, value) => {
    setSellingCharges((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddCharge = () => {
    setSellingCharges((prev) => [
      ...prev,
      { description: 'Additional Service / Surcharge', amount: '' },
    ]);
  };

  const handleRemoveCharge = (index) => {
    setSellingCharges((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculated final selling price
  const totalSellingPrice = sellingCharges.reduce(
    (sum, c) => sum + (parseFloat(c.amount) || 0),
    0
  );

  const validate = () => {
    const errs = {};

    if (!selectedPricingId && !isEditMode) {
      errs.pricing = 'Please select an approved Pricing record.';
    }

    if (!quotationDate) {
      errs.quotationDate = 'Quotation date is required.';
    }

    if (!validityDate) {
      errs.validityDate = 'Quotation validity date is required.';
    }

    if (totalSellingPrice <= 0) {
      errs.charges = 'Please enter at least one selling charge with a valid amount.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const existingId =
      initialData?.quotation_no ||
      initialData?.id;

    const quoteNo = existingId || null;

    const customerName =
      selectedPricing?.customer_name ||
      matchedEnquiry?.customer ||
      matchedEnquiry?.customer_name ||
      initialData?.customer_name ||
      '—';

    const enquiryNo =
      selectedPricing?.enquiry_no ||
      matchedEnquiry?.id ||
      matchedEnquiry?.enquiry_no ||
      initialData?.enquiry_no ||
      '—';

    const mode =
      selectedPricing?.shipment_mode ||
      matchedEnquiry?.shipment_mode ||
      matchedEnquiry?.mode ||
      initialData?.shipment_mode ||
      'Sea';

    const pol = matchedEnquiry?.pol || initialData?.pol || '—';
    const pod = matchedEnquiry?.pod || initialData?.pod || '—';

    // Client-facing payload: no buying costs or margins
    const payload = {
      id: quoteNo,
      quotation_no: quoteNo,
      pricing_id: selectedPricingId || initialData?.pricing_id || null,
      enquiry_id: matchedEnquiry?.id || matchedEnquiry?.enquiry_no || enquiryNo,
      enquiry_no: matchedEnquiry?.enquiry_no || enquiryNo,
      customer_name: customerName,
      shipment_mode: mode,
      mode: mode,
      pol: pol,
      pod: pod,
      shipment_type: matchedEnquiry?.shipment_type || initialData?.shipment_type || '—',
      incoterms: matchedEnquiry?.incoterms || initialData?.incoterms || '—',
      expected_shipping_date: matchedEnquiry?.expected_shipping_date || initialData?.expected_shipping_date || '—',
      commodity: matchedEnquiry?.commodity || initialData?.commodity || '—',
      cargo_description: matchedEnquiry?.cargo_description || initialData?.cargo_description || '—',
      no_of_packages: matchedEnquiry?.no_of_packages || initialData?.no_of_packages || null,
      gross_weight: matchedEnquiry?.gross_weight || initialData?.gross_weight || null,
      gross_weight_unit: matchedEnquiry?.gross_weight_unit || initialData?.gross_weight_unit || 'kg',
      volume_cbm: matchedEnquiry?.volume_cbm || initialData?.volume_cbm || null,
      containers: matchedEnquiry?.containers || initialData?.containers || [],
      quotation_date: quotationDate,
      validity_date: validityDate,
      currency: currency,
      selling_charges: sellingCharges.filter(
        (c) => c.description && c.amount !== ''
      ),
      selling_price: totalSellingPrice,
      terms_and_conditions: termsAndConditions,
      remarks: remarks,
      status: status,
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log(`Submitting Customer Quotation: ${quoteNo}`, payload);

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSave) onSave(payload);
    }, 300);
  };

  const mode =
    selectedPricing?.shipment_mode || matchedEnquiry?.mode || 'Sea';

  // Shared styling
  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-lg text-[#242A31] placeholder:text-[#9AA4AE] focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all';

  const labelClass =
    'block text-xs font-semibold text-[#424B55] mb-1.5';

  const sectionClass =
    'bg-white rounded-xl border border-[#E2E7ED] shadow-sm p-5 sm:p-6';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">

      {/* Page Header */}
      <div className="pb-4 border-b border-[#E2E7ED]">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74808C] hover:text-[#354C63] transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft size={15} />
          Back to Customer Quotations
        </button>

        <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
          {isEditMode ? 'Edit Customer Quotation' : 'Create Customer Quotation'}
        </h2>

        <p className="text-sm text-[#74808C] mt-1">
          {isEditMode
            ? `Updating customer quotation details for ${initialData?.quotation_no || initialData?.id}.`
            : 'Select an existing Pricing calculation to generate an official client freight quotation.'}
        </p>
      </div>

      {/* 1. Pricing Record Selection & Shipment Details */}
      <section className={sectionClass}>

        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#E2E7ED]">
          <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
            <FileText size={20} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              1. Base Pricing Record Selection
            </h3>
            <p className="text-xs text-[#74808C] mt-0.5">
              Choose an approved pricing calculation to auto-fetch enquiry, customer, and selling rate.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          <div className="md:col-span-2">
            <label className={labelClass}>
              Select Pricing Record <span className="text-[#C45151]">*</span>
            </label>

            <select
              value={selectedPricingId}
              disabled={isEditMode}
              onChange={(e) => {
                setSelectedPricingId(e.target.value);
                if (errors.pricing) {
                  setErrors((prev) => ({ ...prev, pricing: '' }));
                }
              }}
              className={`${inputClass} ${errors.pricing ? 'border-[#C45151] bg-[#FCEEEE]' : ''
                } ${isEditMode ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <option value="">
                {pricingList.length === 0
                  ? 'No Pricing Records Available'
                  : '— Select a Pricing Record —'}
              </option>

              {pricingList.map((p) => {
                const id = p.pricing_id || p.id;
                const sellingFormatted = `${p.currency || 'USD'} ${Number(
                  p.selling_price || 0
                ).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}`;

                return (
                  <option key={id} value={id}>
                    {id} — Enquiry: {p.enquiry_no} ({p.customer_name} | {sellingFormatted})
                  </option>
                );
              })}
            </select>

            {errors.pricing && (
              <p className="text-xs text-[#C45151] mt-1.5 flex items-center gap-1">
                <ShieldAlert size={13} />
                {errors.pricing}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Quotation Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent to Customer</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Auto-populated Shipment & Cargo Card */}
        {(selectedPricing || matchedEnquiry || isEditMode) && (
          <div className="mt-5 p-4 bg-[#EDF2F7] rounded-xl border border-[#D3DFEA] text-xs space-y-4">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#D3DFEA] pb-3">
              <span className="font-bold text-[#242A31] text-sm flex items-center gap-2">
                <Building2 size={16} className="text-[#354C63]" />
                {selectedPricing?.customer_name ||
                  matchedEnquiry?.customer ||
                  initialData?.customer_name ||
                  'Customer'}
              </span>

              <span className="font-semibold text-[#354C63] bg-white px-3 py-1.5 rounded-lg border border-[#D3DFEA]">
                Enquiry: {selectedPricing?.enquiry_no ||
                  matchedEnquiry?.id ||
                  initialData?.enquiry_no ||
                  '—'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[#424B55]">

              <div>
                <span className="text-[#74808C] block font-medium mb-1">Route</span>
                <span className="font-bold text-[#242A31]">
                  {matchedEnquiry?.pol || initialData?.pol || '—'} → {matchedEnquiry?.pod || initialData?.pod || '—'}
                </span>
              </div>

              <div>
                <span className="text-[#74808C] block font-medium mb-1">Shipment Mode</span>
                <span className="font-bold text-[#242A31]">
                  {mode} {matchedEnquiry?.shipment_type ? `(${matchedEnquiry.shipment_type})` : ''}
                </span>
              </div>

              <div>
                <span className="text-[#74808C] block font-medium mb-1">Incoterms</span>
                <span className="font-bold text-[#242A31]">
                  {matchedEnquiry?.incoterms || initialData?.incoterms || '—'}
                </span>
              </div>

              <div>
                <span className="text-[#74808C] block font-medium mb-1">Commodity</span>
                <span className="font-bold text-[#242A31] block truncate">
                  {matchedEnquiry?.commodity || initialData?.commodity || '—'}
                </span>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* 2. Selling Charges Breakdown */}
      <section className={`${sectionClass} space-y-5`}>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E2E7ED]">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
              <DollarSign size={20} />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#242A31]">
                2. Customer-Facing Selling Charges ({currency})
              </h3>
              <p className="text-xs text-[#74808C] mt-0.5">
                Itemize quotation line items presented on the client proposal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddCharge}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#354C63] bg-[#EDF2F7] hover:bg-[#DCE5EE] rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>Add Line Item</span>
          </button>
        </div>

        {errors.charges && (
          <div className="p-3 bg-[#FCEEEE] border border-[#F3D3D3] rounded-lg flex items-center gap-2 text-xs text-[#C45151]">
            <ShieldAlert size={15} className="flex-shrink-0" />
            <span>{errors.charges}</span>
          </div>
        )}

        {/* Currency, Quotation Date & Validity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2">

          <div>
            <label className={labelClass}>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`${inputClass} font-semibold`}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED (AED)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Quotation Date <span className="text-[#C45151]">*</span>
            </label>
            <input
              type="date"
              value={quotationDate}
              onChange={(e) => {
                setQuotationDate(e.target.value);
                if (errors.quotationDate) {
                  setErrors((prev) => ({ ...prev, quotationDate: '' }));
                }
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Validity Date <span className="text-[#C45151]">*</span>
            </label>
            <input
              type="date"
              value={validityDate}
              onChange={(e) => {
                setValidityDate(e.target.value);
                if (errors.validityDate) {
                  setErrors((prev) => ({ ...prev, validityDate: '' }));
                }
              }}
              className={`${inputClass} ${errors.validityDate ? 'border-[#C45151] bg-[#FCEEEE]' : ''
                }`}
            />

            {errors.validityDate && (
              <p className="text-xs text-[#C45151] mt-1.5 flex items-center gap-1">
                <ShieldAlert size={13} />
                {errors.validityDate}
              </p>
            )}
          </div>

        </div>

        {/* Dynamic Line Items */}
        <div className="space-y-3">

          {sellingCharges.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-[#F7F9FB] border border-[#E2E7ED] rounded-xl"
            >

              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-[#74808C] mb-1">
                  Charge Description
                </label>

                <input
                  type="text"
                  placeholder="e.g. Ocean Freight 40'HC, Origin CFS, Terminal Handling"
                  value={item.description}
                  onChange={(e) =>
                    handleChargeChange(idx, 'description', e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div className="w-full sm:w-48">
                <label className="block text-[11px] font-semibold text-[#74808C] mb-1">
                  Amount ({currency})
                </label>

                <div className="relative">
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
                      handleChargeChange(idx, 'amount', e.target.value)
                    }
                    className={`${inputClass} pl-14 font-bold`}
                  />
                </div>
              </div>

              {sellingCharges.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCharge(idx)}
                  title="Remove Charge"
                  className="self-end sm:self-center p-2.5 text-[#74808C] hover:text-[#C45151] hover:bg-[#FCEEEE] rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 size={17} />
                </button>
              )}

            </div>
          ))}

        </div>

        {/* Final Selling Price */}
        <div className="p-5 bg-[#EDF2F7] rounded-xl border border-[#D3DFEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div>
            <span className="text-xs font-bold text-[#354C63] uppercase tracking-wider block">
              Total Customer Selling Price
            </span>
            <span className="text-xs text-[#647E96] mt-1 block">
              Sum of all customer-facing selling charge items.
            </span>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-2xl font-bold text-[#16845B] tracking-tight">
              {currency}{' '}
              {totalSellingPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

        </div>
      </section>

      {/* 3. Terms & Conditions and Remarks */}
      <section className={`${sectionClass} space-y-5`}>

        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E7ED]">
          <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
            <Info size={20} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              3. Terms, Conditions & Remarks
            </h3>
            <p className="text-xs text-[#74808C] mt-0.5">
              Define customer validity terms, demurrage conditions, and special notes.
            </p>
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Quotation Terms & Conditions
          </label>

          <textarea
            rows={4}
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            className={`${inputClass} text-xs font-mono leading-relaxed resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>
            Special Remarks for Customer
          </label>

          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Rate includes 14 days free time at discharge port. Space confirmed on direct vessel service."
            className={`${inputClass} resize-none`}
          />
        </div>

      </section>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl border border-[#E2E7ED] shadow-sm p-4 sm:p-5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#D3DBE4] text-[#424B55] hover:bg-[#F1F4F7] text-sm font-semibold rounded-lg transition-all cursor-pointer"
        >
          <X size={16} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#354C63] hover:bg-[#293D52] active:bg-[#243548] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          <span>
            {isSubmitting
              ? 'Saving...'
              : isEditMode
                ? 'Save Changes'
                : 'Generate Quotation'}
          </span>
        </button>

      </div>
    </form>
  );
}

export default CustomerQuotationForm;
