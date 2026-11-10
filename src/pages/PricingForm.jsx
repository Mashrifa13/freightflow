
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  ShieldAlert,
  Save,
  X,
  Calculator,
} from 'lucide-react';

function PricingForm({
  initialData = null,
  enquiries = [],
  comparisons = [],
  quotations = [],
  onCancel,
  onSave,
}) {
  const isEditMode = Boolean(initialData);

  // Form State
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(
    initialData?.enquiry_id || initialData?.enquiry_no || ''
  );
  const [currency, setCurrency] = useState(initialData?.currency || 'USD');
  const [buyingCost, setBuyingCost] = useState(
    initialData?.total_buying_cost != null
      ? String(initialData.total_buying_cost)
      : ''
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
  const [status, setStatus] = useState(initialData?.status || 'Draft');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find linked enquiry
  const selectedEnquiry = enquiries.find(
    (e) =>
      (e.id && e.id === selectedEnquiryId) ||
      (e.enquiry_no && e.enquiry_no === selectedEnquiryId)
  );

  // Auto-fill buying cost if comparison or quotation exists for this enquiry
  useEffect(() => {
    if (!selectedEnquiryId) return;

    const enquiryKey =
      selectedEnquiry?.enquiry_no ||
      selectedEnquiry?.id ||
      selectedEnquiryId;

    const matchedComp = comparisons.find(
      (c) => String(c.enquiry_no) === String(enquiryKey)
    );

    if (!matchedComp) return;

    const updatedCost =
      matchedComp.selected_total_cost ?? matchedComp.lowest_cost;

    if (updatedCost != null) {
      setBuyingCost(String(updatedCost));
    }

    const updatedCurrency =
      matchedComp.selected_currency || matchedComp.currency;

    if (updatedCurrency) {
      setCurrency(updatedCurrency);
    }
  }, [selectedEnquiryId, selectedEnquiry, comparisons]);

  // Automatically recalculate Selling Price
  useEffect(() => {
    const cost = parseFloat(buyingCost) || 0;
    const margin = parseFloat(marginValue) || 0;

    if (cost > 0) {
      if (marginType === 'percentage') {
        const calculatedSelling = cost + (cost * margin) / 100;
        setSellingPrice(calculatedSelling.toFixed(2));
      } else {
        const calculatedSelling = cost + margin;
        setSellingPrice(calculatedSelling.toFixed(2));
      }
    }
  }, [buyingCost, marginType, marginValue]);

  const validate = () => {
    const errs = {};

    if (!selectedEnquiryId) {
      errs.enquiry = 'Please select an enquiry.';
    }

    if (!buyingCost || parseFloat(buyingCost) <= 0) {
      errs.buyingCost = 'Please provide a valid total buying cost.';
    }

    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      errs.sellingPrice = 'Please provide a valid selling price.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const existingId =
      initialData?.pricing_id ||
      initialData?.id;

    const pricingId = existingId || null;

    const costNum = parseFloat(buyingCost) || 0;
    const priceNum = parseFloat(sellingPrice) || 0;
    const profitMargin = priceNum - costNum;
    const profitPercentage =
      costNum > 0 ? (profitMargin / costNum) * 100 : 0;

    const payload = {
      id: pricingId,
      pricing_id: pricingId,
      enquiry_id: selectedEnquiryId,
      enquiry_no:
        selectedEnquiry?.id ||
        selectedEnquiry?.enquiry_no ||
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
      currency: currency,
      total_buying_cost: costNum,
      selling_price: priceNum,
      profit_margin: profitMargin,
      profit_percentage: profitPercentage,
      margin_type: marginType,
      margin_value: parseFloat(marginValue) || 0,
      status: status,
      notes: notes,
      created_at: initialData?.created_at || new Date().toISOString(),
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

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl text-[#242A31] placeholder:text-[#9AA4AE] focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all';

  const labelClass =
    'block text-xs font-semibold text-[#424B55] mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">

      {/* Top Header */}
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
          {isEditMode ? 'Edit Pricing' : 'Create Pricing Calculation'}
        </h2>

        <p className="text-xs text-[#74808C] mt-1">
          {isEditMode
            ? `Editing rate calculation for ${initialData?.pricing_id || initialData?.id}.`
            : 'Select an enquiry, input buying costs, configure margin markup, and determine selling prices.'}
        </p>
      </div>

      {/* 1. Enquiry Selection */}
      <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6">

        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#E2E7ED]">
          <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
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
              Select Enquiry <span className="text-red-500">*</span>
            </label>

            <select
              value={selectedEnquiryId}
              onChange={(e) => {
                setSelectedEnquiryId(e.target.value);
                if (errors.enquiry) {
                  setErrors((prev) => ({ ...prev, enquiry: '' }));
                }
              }}
              className={`${inputClass} ${errors.enquiry ? 'border-red-300 bg-red-50/30' : ''
                }`}
            >
              <option value="">
                {enquiries.length === 0
                  ? 'No Enquiries Available'
                  : '— Select Enquiry —'}
              </option>

              {enquiries.map((enq) => {
                const id = enq.id || enq.enquiry_no;
                const cust = enq.customer || enq.customer_name || 'Customer';
                const m = enq.mode || enq.shipment_mode || 'Sea';

                return (
                  <option key={id} value={id}>
                    {id} — {cust} ({m})
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
            <label className={labelClass}>Pricing Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
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
                {selectedEnquiry.customer || selectedEnquiry.customer_name}
              </span>
            </span>

            <span className="text-[#354C63] font-semibold">
              Route: {selectedEnquiry.pol} → {selectedEnquiry.pod} (
              {selectedEnquiry.mode || 'Sea'})
            </span>
          </div>
        )}
      </section>

      {/* 2. Buying Cost & Margin Configuration */}
      <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6 space-y-5">

        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E7ED]">
          <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
            <Calculator size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              2. Cost & Margin Setup
            </h3>
            <p className="text-xs text-[#74808C]">
              Enter total buying cost and apply target profit margin to calculate customer selling price
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Currency */}
          <div>
            <label className={labelClass}>Currency</label>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputClass}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED (AED)</option>
            </select>
          </div>

          {/* Total Buying Cost */}
          <div>
            <label className={labelClass}>
              Total Buying Cost <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={buyingCost}
              onChange={(e) => {
                setBuyingCost(e.target.value);
                if (errors.buyingCost) {
                  setErrors((prev) => ({ ...prev, buyingCost: '' }));
                }
              }}
              className={`${inputClass} font-semibold ${errors.buyingCost ? 'border-red-300 bg-red-50/30' : ''
                }`}
            />

            {errors.buyingCost && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.buyingCost}
              </p>
            )}
          </div>

          {/* Margin Type */}
          <div>
            <label className={labelClass}>Markup / Margin Type</label>

            <select
              value={marginType}
              onChange={(e) => setMarginType(e.target.value)}
              className={inputClass}
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
              className={`${inputClass} font-semibold`}
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
              {Math.max(
                0,
                (parseFloat(sellingPrice) || 0) -
                (parseFloat(buyingCost) || 0)
              ).toFixed(2)}
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
            placeholder="e.g. Standard 15% markup applied over Ocean Express buying rate. Valid for 14 days."
            className={`${inputClass} resize-none`}
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
