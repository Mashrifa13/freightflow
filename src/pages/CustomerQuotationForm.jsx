import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FilePlus,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  ShieldAlert,
  Save,
  X,
  Plus,
  Trash2,
  Ship,
  Plane,
  Truck,
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

  // Customer-facing Selling Charges
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
    (p) => (p.pricing_id && p.pricing_id === selectedPricingId) || (p.id && p.id === selectedPricingId)
  );

  // Matched Enquiry record
  const enquiryKey = selectedPricing?.enquiry_no || selectedPricing?.enquiry_id || initialData?.enquiry_no;
  const matchedEnquiry = enquiries.find(
    (e) => (e.id && e.id === enquiryKey) || (e.enquiry_no && e.enquiry_no === enquiryKey)
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

    // Default validity to 14 days from today if not set
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
    setSellingCharges((prev) => [...prev, { description: 'Additional Service / Surcharge', amount: '' }]);
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

    // Strictly client-facing payload (ZERO buying costs or margins included)
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
      selling_charges: sellingCharges.filter((c) => c.description && c.amount !== ''),
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

  const mode = selectedPricing?.shipment_mode || matchedEnquiry?.mode || 'Sea';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="pb-2 border-b border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Customer Quotations
        </button>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          {isEditMode ? 'Edit Customer Quotation' : 'Create Customer Quotation'}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {isEditMode
            ? `Updating customer quotation details for ${initialData?.quotation_no || initialData?.id}.`
            : 'Select an existing Pricing calculation to generate an official client freight quotation.'}
        </p>
      </div>

      {/* 1. Pricing Record Selector & Shipment Details */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              1. Base Pricing Record Selection
            </h3>
            <p className="text-xs text-gray-400">
              Choose an approved pricing calculation to auto-fetch enquiry, customer, and selling rate
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Select Pricing Record <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedPricingId}
              disabled={isEditMode}
              onChange={(e) => {
                setSelectedPricingId(e.target.value);
                if (errors.pricing) setErrors((prev) => ({ ...prev, pricing: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all ${errors.pricing ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                } ${isEditMode ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <option value="">
                {pricingList.length === 0 ? 'No Pricing Records Available' : '— Select a Pricing Record —'}
              </option>
              {pricingList.map((p) => {
                const id = p.pricing_id || p.id;
                const sellingFormatted = `${p.currency || 'USD'} ${Number(p.selling_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                return (
                  <option key={id} value={id}>
                    {id} — Enquiry: {p.enquiry_no} ({p.customer_name} | {sellingFormatted})
                  </option>
                );
              })}
            </select>
            {errors.pricing && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.pricing}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Quotation Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
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
          <div className="mt-5 p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 rounded-xl border border-blue-100 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-blue-200/50 pb-2.5">
              <span className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <Building2 size={15} className="text-blue-600" />
                {selectedPricing?.customer_name || matchedEnquiry?.customer || initialData?.customer_name || 'Customer'}
              </span>
              <span className="font-semibold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                Enquiry: {selectedPricing?.enquiry_no || matchedEnquiry?.id || initialData?.enquiry_no || '—'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-700">
              <div>
                <span className="text-gray-400 block font-medium">Route</span>
                <span className="font-bold text-gray-800 mt-0.5 block">
                  {matchedEnquiry?.pol || initialData?.pol || '—'} → {matchedEnquiry?.pod || initialData?.pod || '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Shipment Mode</span>
                <span className="font-bold text-gray-800 mt-0.5 block">
                  {mode} {matchedEnquiry?.shipment_type ? `(${matchedEnquiry.shipment_type})` : ''}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Incoterms</span>
                <span className="font-bold text-gray-800 mt-0.5 block">
                  {matchedEnquiry?.incoterms || initialData?.incoterms || '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Commodity</span>
                <span className="font-bold text-gray-800 mt-0.5 block truncate">
                  {matchedEnquiry?.commodity || initialData?.commodity || '—'}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Selling Charges Breakdown */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <DollarSign size={19} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                2. Customer-Facing Selling Charges ({currency})
              </h3>
              <p className="text-xs text-gray-400">
                Itemize quotation line items presented on the client proposal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddCharge}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus size={13} />
            <span>Add Line Item</span>
          </button>
        </div>

        {errors.charges && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>{errors.charges}</span>
          </div>
        )}

        {/* Currency selection & validity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-semibold"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED (AED)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Quotation Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={quotationDate}
              onChange={(e) => {
                setQuotationDate(e.target.value);
                if (errors.quotationDate) setErrors((prev) => ({ ...prev, quotationDate: '' }));
              }}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Validity Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={validityDate}
              onChange={(e) => {
                setValidityDate(e.target.value);
                if (errors.validityDate) setErrors((prev) => ({ ...prev, validityDate: '' }));
              }}
              className={`w-full px-3.5 py-2 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all ${errors.validityDate ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                }`}
            />
            {errors.validityDate && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.validityDate}
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Line Items */}
        <div className="space-y-2.5">
          {sellingCharges.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Charge Description (e.g. Ocean Freight 40'HC, Origin CFS, Terminal Handling)"
                value={item.description}
                onChange={(e) => handleChargeChange(idx, 'description', e.target.value)}
                className="flex-1 px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
              <div className="w-48 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                  {currency}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={item.amount}
                  onChange={(e) => handleChargeChange(idx, 'amount', e.target.value)}
                  className="w-full pl-14 pr-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold text-gray-800"
                />
              </div>
              {sellingCharges.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCharge(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Final Selling Price Display */}
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
              Total Customer Selling Price
            </span>
            <span className="text-xs text-emerald-700 mt-0.5 block">
              Sum of all customer-facing selling charge items
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-emerald-700 tracking-tight">
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
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Info size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              3. Terms, Conditions & Remarks
            </h3>
            <p className="text-xs text-gray-400">
              Define customer validity terms, demurrage conditions, and special notes
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Quotation Terms & Conditions
          </label>
          <textarea
            rows={4}
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-mono leading-relaxed resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Special Remarks for Customer
          </label>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Rate includes 14 days free time at discharge port. Space confirmed on direct vessel service."
            className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
          />
        </div>
      </section>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          <X size={15} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
        >
          <Save size={15} />
          <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Generate Quotation'}</span>
        </button>
      </div>
    </form>
  );
}

export default CustomerQuotationForm;

