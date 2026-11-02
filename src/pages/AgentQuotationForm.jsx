import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  FileCheck,
  FileText,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  ShieldAlert,
  Save,
  X,
  Calculator,
} from 'lucide-react';

const CHARGE_CATEGORIES = [
  { id: 'freight', name: 'Freight Charges', description: 'Base Ocean/Air/Land freight rates and basic freight surcharges' },
  { id: 'origin', name: 'Origin Charges', description: 'Pickup, CFS handling, customs export clearance, documentation' },
  { id: 'destination', name: 'Destination Charges', description: 'Delivery order (DO), import clearance, terminal handling (THC)' },
  { id: 'other', name: 'Other Charges', description: 'Inspection, fumigation, insurance, detention/demurrage contingencies' },
];

function AgentQuotationForm({
  initialData = null,
  rateRequests = [],
  agents = [],
  onCancel,
  onSave,
}) {
  const isEditMode = Boolean(initialData);

  // 1. Basic Linking
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

  // 2. Charges state: arrays of { id, description, amount }
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

  // Find linked RFQ
  const selectedRfq = rateRequests.find(
    (r) => (r.id && r.id === selectedRfqId) || (r.rfq_no && r.rfq_no === selectedRfqId)
  );

  // Available agents: agents specifically requested in the selected RFQ, or fallback to all agents
  const availableAgents = useMemo(() => {
    if (selectedRfq && selectedRfq.agents && selectedRfq.agents.length > 0) {
      return selectedRfq.agents.map((ag) => {
        const id = ag.agent_id || ag.id || ag.agent_code;
        return {
          id: id,
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

  // Charge section operations
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

  // Calculations
  const sumAmounts = (list) =>
    list.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const totalFreight = sumAmounts(freightCharges);
  const totalOrigin = sumAmounts(originCharges);
  const totalDestination = sumAmounts(destinationCharges);
  const totalOther = sumAmounts(otherCharges);

  const totalBuyingRate = totalFreight + totalOrigin + totalDestination + totalOther;

  // Validation
  const validate = () => {
    const errs = {};
    if (!selectedRfqId) errs.rfq = 'Please select an existing RFQ';
    if (!selectedAgentId) errs.agent = 'Please select an responding agent';
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

    const year = new Date().getFullYear();
    const randSuffix = String(Math.floor(100 + Math.random() * 900));
    const quoteNumber = isEditMode
      ? initialData.quotation_no || initialData.id
      : `QUO-${year}-${randSuffix}`;

    const chosenAgent = availableAgents.find((a) => a.id === selectedAgentId);

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
      currency: currency,
      freight_charges: freightCharges.filter((c) => c.description && c.amount !== ''),
      origin_charges: originCharges.filter((c) => c.description && c.amount !== ''),
      destination_charges: destinationCharges.filter((c) => c.description && c.amount !== ''),
      other_charges: otherCharges.filter((c) => c.description && c.amount !== ''),
      total_freight: totalFreight,
      total_origin: totalOrigin,
      total_destination: totalDestination,
      total_other: totalOther,
      total_buying_rate: totalBuyingRate,
      status: status,
      remarks: remarks,
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log(
      `DRF Payload for ${isEditMode ? 'PUT /api/agent-quotations/' + quoteNumber + '/' : 'POST /api/agent-quotations/'}:`,
      payload
    );

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSave) onSave(payload);
    }, 350);
  };

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
          Back to Agent Quotations
        </button>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          {isEditMode ? 'Edit Agent Quotation' : 'Add Agent Quotation'}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {isEditMode
            ? `Editing rate submission ${initialData?.quotation_no || initialData?.id}.`
            : 'Record incoming buying rates from overseas agent for RFQ comparison and margin calculation.'}
        </p>
      </div>

      {/* 1. Basic Linking & Identification */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              1. RFQ & Agent Selection
            </h3>
            <p className="text-xs text-gray-400">
              Match quote to the original rate request and identify the bidding agent
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Select RFQ */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Select RFQ <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedRfqId}
              onChange={(e) => {
                setSelectedRfqId(e.target.value);
                if (errors.rfq) setErrors((prev) => ({ ...prev, rfq: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all ${
                errors.rfq ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
              }`}
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
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.rfq}
              </p>
            )}
          </div>

          {/* Select Agent */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Responding Agent <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedAgentId}
              onChange={(e) => {
                setSelectedAgentId(e.target.value);
                if (errors.agent) setErrors((prev) => ({ ...prev, agent: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all ${
                errors.agent ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
              }`}
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
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.agent}
              </p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Quotation Currency <span className="text-red-500">*</span>
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            >
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
              <option value="AED">AED (AED - UAE Dirham)</option>
            </select>
          </div>

          {/* Quote Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Quotation Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={quotationDate}
              onChange={(e) => setQuotationDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Validity Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Rate Validity Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={validityDate}
              onChange={(e) => {
                setValidityDate(e.target.value);
                if (errors.validityDate) setErrors((prev) => ({ ...prev, validityDate: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all ${
                errors.validityDate ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
              }`}
            />
            {errors.validityDate && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} />
                {errors.validityDate}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Quotation Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            >
              <option value="Pending Review">Pending Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Selected RFQ Route Banner */}
        {selectedRfq && (
          <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
            <span className="text-gray-600">
              Shipment Route:{' '}
              <span className="font-bold text-blue-700">
                {selectedRfq.pol} → {selectedRfq.pod}
              </span>{' '}
              ({selectedRfq.shipment_mode || 'Sea'})
            </span>
            <span className="text-gray-500">
              Commodity: <span className="font-semibold text-gray-700">{selectedRfq.commodity || '—'}</span>
            </span>
          </div>
        )}
      </section>

      {/* 2. Charges Breakdown (Freight, Origin, Destination, Other) */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Calculator size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              2. Cost Breakdown & Buying Charges ({currency})
            </h3>
            <p className="text-xs text-gray-400">
              Itemize ocean/air freight, origin charges, destination fees and extra costs
            </p>
          </div>
        </div>

        {errors.total && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>{errors.total}</span>
          </div>
        )}

        {/* Category: Freight Charges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                A. Freight Charges
              </h4>
              <p className="text-[11px] text-gray-400">
                Basic ocean/air freight rate, BAF/FAF, war risk, etc.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAddCharge(setFreightCharges, 'Freight Surcharge')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <Plus size={13} /> Add Item
            </button>
          </div>

          <div className="space-y-2">
            {freightCharges.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Charge Description (e.g. Ocean Freight 40HC)"
                  value={item.description}
                  onChange={(e) =>
                    handleChargeChange(setFreightCharges, idx, 'description', e.target.value)
                  }
                  className="flex-1 px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
                <div className="w-40 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                    {currency}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={item.amount}
                    onChange={(e) =>
                      handleChargeChange(setFreightCharges, idx, 'amount', e.target.value)
                    }
                    className="w-full pl-12 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-semibold text-gray-800"
                  />
                </div>
                {freightCharges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCharge(setFreightCharges, idx)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="text-right text-xs text-gray-500">
            Subtotal Freight:{' '}
            <span className="font-bold text-gray-800">
              {currency} {totalFreight.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Category: Origin Charges */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                B. Origin Charges
              </h4>
              <p className="text-[11px] text-gray-400">
                Origin CFS, export customs clearance, export doc fees, pickup
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAddCharge(setOriginCharges, 'Origin Handling')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <Plus size={13} /> Add Item
            </button>
          </div>

          <div className="space-y-2">
            {originCharges.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Charge Description (e.g. Origin THC / Export Customs)"
                  value={item.description}
                  onChange={(e) =>
                    handleChargeChange(setOriginCharges, idx, 'description', e.target.value)
                  }
                  className="flex-1 px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
                <div className="w-40 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                    {currency}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={item.amount}
                    onChange={(e) =>
                      handleChargeChange(setOriginCharges, idx, 'amount', e.target.value)
                    }
                    className="w-full pl-12 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-semibold text-gray-800"
                  />
                </div>
                {originCharges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCharge(setOriginCharges, idx)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="text-right text-xs text-gray-500">
            Subtotal Origin:{' '}
            <span className="font-bold text-gray-800">
              {currency} {totalOrigin.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Category: Destination Charges */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                C. Destination Charges
              </h4>
              <p className="text-[11px] text-gray-400">
                Delivery Order (DO), port terminal handling, import clearance
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAddCharge(setDestinationCharges, 'Destination THC')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <Plus size={13} /> Add Item
            </button>
          </div>

          <div className="space-y-2">
            {destinationCharges.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Charge Description (e.g. Delivery Order Fee, DTHC)"
                  value={item.description}
                  onChange={(e) =>
                    handleChargeChange(setDestinationCharges, idx, 'description', e.target.value)
                  }
                  className="flex-1 px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
                <div className="w-40 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                    {currency}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={item.amount}
                    onChange={(e) =>
                      handleChargeChange(setDestinationCharges, idx, 'amount', e.target.value)
                    }
                    className="w-full pl-12 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-semibold text-gray-800"
                  />
                </div>
                {destinationCharges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCharge(setDestinationCharges, idx)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="text-right text-xs text-gray-500">
            Subtotal Destination:{' '}
            <span className="font-bold text-gray-800">
              {currency} {totalDestination.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Category: Other Charges */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                D. Other / Contingency Charges
              </h4>
              <p className="text-[11px] text-gray-400">
                Fumigation, insurance, palletization, or specific line items
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAddCharge(setOtherCharges, 'Other Charge')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <Plus size={13} /> Add Item
            </button>
          </div>

          {otherCharges.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-2">
              No extra charges added. Click "+ Add Item" if applicable.
            </p>
          ) : (
            <div className="space-y-2">
              {otherCharges.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Charge Description"
                    value={item.description}
                    onChange={(e) =>
                      handleChargeChange(setOtherCharges, idx, 'description', e.target.value)
                    }
                    className="flex-1 px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  />
                  <div className="w-40 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                      {currency}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={item.amount}
                      onChange={(e) =>
                        handleChargeChange(setOtherCharges, idx, 'amount', e.target.value)
                      }
                      className="w-full pl-12 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-semibold text-gray-800"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCharge(setOtherCharges, idx)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {otherCharges.length > 0 && (
            <div className="text-right text-xs text-gray-500">
              Subtotal Other:{' '}
              <span className="font-bold text-gray-800">
                {currency} {totalOther.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* 3. Automatic Total Buying Rate Card */}
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50/40 rounded-2xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
              Total Buying Cost (Calculated Automatically)
            </span>
            <span className="text-xs text-blue-700/80 mt-0.5 block">
              Freight ({totalFreight.toFixed(2)}) + Origin ({totalOrigin.toFixed(2)}) + Destination ({totalDestination.toFixed(2)}) + Other ({totalOther.toFixed(2)})
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-blue-700 tracking-tight">
              {currency} {totalBuyingRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Remarks / Terms */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Agent Remarks & Terms (Free Days, Transit Time, Routing)
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. 14 days free detention at POD, transshipment via Singapore, estimated transit time 22 days."
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
          <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save Quotation'}</span>
        </button>
      </div>
    </form>
  );
}

export default AgentQuotationForm;

