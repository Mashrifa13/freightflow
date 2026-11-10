
import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  FileText,
  Calculator,
  Plus,
  Trash2,
  ShieldAlert,
  Save,
  X,
} from 'lucide-react';

const generateAgentQuotationId = (quotations = []) => {
  const year = new Date().getFullYear();

  const lastNumber = quotations.reduce((max, quotation) => {
    const existingId = quotation.quotation_no || quotation.id || '';
    const match = String(existingId).match(
      new RegExp(`^QUO-${year}-(\\d+)$`, 'i')
    );

    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  return `QUO-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
};

function AgentQuotationForm({
  initialData,
  rateRequests,
  agents,
  quotations = [],
  onCancel,
  onSave,
}) {
  const isEditMode = Boolean(initialData);

  const [selectedRfqId, setSelectedRfqId] = useState(
    initialData?.rfq_id || initialData?.rfq_no || ''
  );
  const [selectedAgentId, setSelectedAgentId] = useState(
    initialData?.agent_id || initialData?.agent_code || ''
  );
  const [quotationDate, setQuotationDate] = useState(
    initialData?.quotation_date || new Date().toISOString().slice(0, 10)
  );
  const [validityDate, setValidityDate] = useState(
    initialData?.validity_date || ''
  );
  const [currency, setCurrency] = useState(initialData?.currency || 'USD');
  const [status, setStatus] = useState(initialData?.status || 'Pending Review');
  const [remarks, setRemarks] = useState(initialData?.remarks || '');

  const [freightCharges, setFreightCharges] = useState(
    initialData?.freight_charges?.length > 0
      ? initialData.freight_charges
      : [{ description: 'Base Freight', amount: '' }]
  );
  const [originCharges, setOriginCharges] = useState(
    initialData?.origin_charges?.length > 0
      ? initialData.origin_charges
      : [{ description: 'Origin Handling / Doc Fee', amount: '' }]
  );
  const [destinationCharges, setDestinationCharges] = useState(
    initialData?.destination_charges?.length > 0
      ? initialData.destination_charges
      : [{ description: 'Destination DO / Port Fee', amount: '' }]
  );
  const [otherCharges, setOtherCharges] = useState(
    initialData?.other_charges?.length > 0
      ? initialData.other_charges
      : []
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRfq = rateRequests.find(
    (r) =>
      (r.id && r.id === selectedRfqId) ||
      (r.rfq_no && r.rfq_no === selectedRfqId)
  );

  const availableAgents = useMemo(() => {
    if (selectedRfq && selectedRfq.agents && selectedRfq.agents.length > 0) {
      return selectedRfq.agents.map((ag) => {
        const id = ag.agent_id || ag.id || ag.agent_code;

        return {
          id,
          agent_code: id,
          name: ag.agent_name || ag.name || id,
          country: ag.country || 'Global',
        };
      });
    }

    return agents.map((a) => ({
      id: a.id || a.agent_code || a.agent_id,
      agent_code: a.agent_code || a.id,
      name: a.name || a.agent_name,
      country: a.country || 'Global',
    }));
  }, [selectedRfq, agents]);

  const handleChargeChange = (setter, index, field, value) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddCharge = (setter, defaultDesc = 'Additional Charge') => {
    setter((prev) => [...prev, { description: defaultDesc, amount: '' }]);
  };

  const handleRemoveCharge = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const sumAmounts = (list) =>
    list.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const totalFreight = sumAmounts(freightCharges);
  const totalOrigin = sumAmounts(originCharges);
  const totalDestination = sumAmounts(destinationCharges);
  const totalOther = sumAmounts(otherCharges);

  const totalBuyingRate =
    totalFreight + totalOrigin + totalDestination + totalOther;

  const validate = () => {
    const errs = {};

    if (!selectedRfqId) errs.rfq = 'Please select an existing RFQ';
    if (!selectedAgentId) errs.agent = 'Please select a responding agent';
    if (!validityDate) errs.validityDate = 'Validity date is required';

    if (totalBuyingRate <= 0) {
      errs.total = 'Please specify at least one charge item with an amount';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const existingId = initialData?.quotation_no || initialData?.id;
    const quoteNumber = existingId || null;

    const chosenAgent = availableAgents.find(
      (a) => a.id === selectedAgentId
    );

    const payload = {
      id: quoteNumber,
      quotation_no: quoteNumber,
      rfq_id: selectedRfqId,
      rfq_no: selectedRfq?.rfq_no || selectedRfq?.id || selectedRfqId,
      enquiry_no: selectedRfq?.enquiry_no || initialData?.enquiry_no || '—',
      customer_name: selectedRfq?.customer_name || initialData?.customer_name || '—',
      pol: selectedRfq?.pol || initialData?.pol || '—',
      pod: selectedRfq?.pod || initialData?.pod || '—',
      shipment_mode: selectedRfq?.shipment_mode || initialData?.shipment_mode || 'Sea',
      agent_id: selectedAgentId,
      agent_name: chosenAgent?.name || initialData?.agent_name || selectedAgentId,
      quotation_date: quotationDate,
      validity_date: validityDate,
      currency,
      freight_charges: freightCharges.filter(
        (c) => c.description && c.amount !== ''
      ),
      origin_charges: originCharges.filter(
        (c) => c.description && c.amount !== ''
      ),
      destination_charges: destinationCharges.filter(
        (c) => c.description && c.amount !== ''
      ),
      other_charges: otherCharges.filter(
        (c) => c.description && c.amount !== ''
      ),
      total_freight: totalFreight,
      total_origin: totalOrigin,
      total_destination: totalDestination,
      total_other: totalOther,
      total_buying_rate: totalBuyingRate,
      status,
      remarks,
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log(
      `DRF Payload for ${isEditMode
        ? 'PUT /api/agent-quotations/' + quoteNumber + '/'
        : 'POST /api/agent-quotations/'
      }:`,
      payload
    );

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSave) onSave(payload);
    }, 350);
  };

  const inputClass = (hasError = false) =>
    `w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border rounded-xl 
    focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 
    focus:border-[#647E96] transition-all ${hasError
      ? 'border-[#C45151] bg-[#FCEEEE]/50'
      : 'border-[#D3DBE4]'
    }`;

  const sectionClass =
    'bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6';

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
          onClick={() => handleAddCharge(setter, defaultDescription)}
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
                  onClick={() => handleRemoveCharge(setter, idx)}
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
            {currency} {subtotal.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-3 border-b border-[#E2E7ED]">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74808C] hover:text-[#354C63] transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Agent Quotations
        </button>

        <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
          {isEditMode ? 'Edit Agent Quotation' : 'Add Agent Quotation'}
        </h2>

        <p className="text-xs text-[#74808C] mt-1">
          {isEditMode
            ? `Editing rate submission ${initialData?.quotation_no || initialData?.id}.`
            : 'Record incoming buying rates from overseas agent for RFQ comparison and margin calculation.'}
        </p>
      </div>

      {/* 1. RFQ & Agent Selection */}
      <section className={sectionClass}>
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#E2E7ED]">
          <div className="w-9 h-9 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center shrink-0">
            <FileText size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              1. RFQ & Agent Selection
            </h3>
            <p className="text-xs text-[#74808C] mt-0.5">
              Match quote to the original rate request and identify the bidding agent
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* RFQ */}
          <div>
            <label className="block text-xs font-semibold text-[#596673] mb-1.5">
              Select RFQ <span className="text-[#C45151]">*</span>
            </label>

            <select
              value={selectedRfqId}
              onChange={(e) => {
                setSelectedRfqId(e.target.value);
                if (errors.rfq) setErrors((prev) => ({ ...prev, rfq: '' }));
              }}
              className={inputClass(Boolean(errors.rfq))}
            >
              <option value="">
                {rateRequests.length === 0 ? 'No RFQs Available' : '— Choose an RFQ —'}
              </option>

              {rateRequests.map((r) => {
                const id = r.rfq_no || r.id;
                const route = `${r.pol || 'POL'} → ${r.pod || 'POD'}`;

                return (
                  <option key={id} value={id}>
                    {id} ({route} - {r.customer_name})
                  </option>
                );
              })}
            </select>

            {errors.rfq && (
              <p className="text-xs text-[#C45151] mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.rfq}
              </p>
            )}
          </div>

          {/* Agent */}
          <div>
            <label className="block text-xs font-semibold text-[#596673] mb-1.5">
              Responding Agent <span className="text-[#C45151]">*</span>
            </label>

            <select
              value={selectedAgentId}
              onChange={(e) => {
                setSelectedAgentId(e.target.value);
                if (errors.agent) setErrors((prev) => ({ ...prev, agent: '' }));
              }}
              className={inputClass(Boolean(errors.agent))}
            >
              <option value="">
                {availableAgents.length === 0 ? 'No Agents Available' : '— Select Agent —'}
              </option>

              {availableAgents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.country})
                </option>
              ))}
            </select>

            {errors.agent && (
              <p className="text-xs text-[#C45151] mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.agent}
              </p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-semibold text-[#596673] mb-1.5">
              Quotation Currency <span className="text-[#C45151]">*</span>
            </label>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputClass()}
            >
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
              <option value="AED">AED (AED - UAE Dirham)</option>
            </select>
          </div>

          {/* Quotation Date */}
          <div>
            <label className="block text-xs font-semibold text-[#596673] mb-1.5">
              Quotation Date <span className="text-[#C45151]">*</span>
            </label>

            <input
              type="date"
              value={quotationDate}
              onChange={(e) => setQuotationDate(e.target.value)}
              className={inputClass()}
            />
          </div>

          {/* Validity */}
          <div>
            <label className="block text-xs font-semibold text-[#596673] mb-1.5">
              Rate Validity Date <span className="text-[#C45151]">*</span>
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
              className={inputClass(Boolean(errors.validityDate))}
            />

            {errors.validityDate && (
              <p className="text-xs text-[#C45151] mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.validityDate}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-[#596673] mb-1.5">
              Quotation Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass()}
            >
              <option value="Pending Review">Pending Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {selectedRfq && (
          <div className="mt-4 p-3 bg-[#EDF2F7] rounded-xl border border-[#D3DBE4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
            <span className="text-[#596673]">
              Shipment Route:{' '}
              <span className="font-bold text-[#354C63]">
                {selectedRfq.pol} → {selectedRfq.pod}
              </span>{' '}
              ({selectedRfq.shipment_mode || 'Sea'})
            </span>

            <span className="text-[#74808C]">
              Commodity:{' '}
              <span className="font-semibold text-[#242A31]">
                {selectedRfq.commodity || '—'}
              </span>
            </span>
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
              Itemize ocean/air freight, origin charges, destination fees and extra costs
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
            description: 'Origin CFS, export customs clearance, export doc fees, pickup',
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
            description: 'Delivery Order (DO), port terminal handling, import clearance',
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
            description: 'Fumigation, insurance, palletization, or specific line items',
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

        {/* Remarks */}
        <div>
          <label className="block text-xs font-semibold text-[#596673] mb-1.5">
            Agent Remarks & Terms (Free Days, Transit Time, Routing)
          </label>

          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. 14 days free detention at POD, transshipment via Singapore, estimated transit time 22 days."
            className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all resize-none"
          />
        </div>
      </section>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-4 sm:p-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#D3DBE4] text-[#596673] hover:bg-[#F7F9FB] hover:text-[#35271F] text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          <X size={15} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#354C63] hover:bg-[#293D52] active:bg-[#243649] text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Save size={15} />
          <span>
            {isSubmitting
              ? 'Saving...'
              : isEditMode
                ? 'Save Changes'
                : 'Save Quotation'}
          </span>
        </button>
      </div>
    </form>
  );
}

export default AgentQuotationForm;
