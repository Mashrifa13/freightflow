
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
} from 'lucide-react';

function RateComparisonForm({
  initialData = null,
  rateRequests = [],
  quotations = [],
  onCancel,
  onSave,
}) {
  const isEditMode = Boolean(initialData);

  // Form State
  const [selectedRfqId, setSelectedRfqId] = useState(
    initialData?.rfq_id || initialData?.rfq_no || ''
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

  // Linked RFQ object
  const selectedRfq = rateRequests.find(
    (r) =>
      (r.id && r.id === selectedRfqId) ||
      (r.rfq_no && r.rfq_no === selectedRfqId)
  );

  // Automatically find all received quotations for this selected RFQ
  const matchedQuotations = useMemo(() => {
    if (!selectedRfqId) return [];

    const foundQuotes = quotations.filter((q) => {
      const qRfqId = q.rfq_id || q.rfq_no;

      return (
        qRfqId === selectedRfqId ||
        (selectedRfq && qRfqId === selectedRfq.rfq_no)
      );
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
  }, [selectedRfqId, selectedRfq, quotations, initialData]);

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
    matchedQuotations[0]?.currency || selectedRfq?.currency || 'USD';

  // Validation
  const validate = () => {
    const errs = {};

    if (!selectedRfqId) {
      errs.rfq = 'Please select an existing RFQ to compare.';
    }

    if (matchedQuotations.length === 0) {
      errs.quotes =
        'This RFQ has no agent quotations recorded. Add at least one quote in Agent Quotation Management.';
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const existingId =
      initialData?.comparison_id || initialData?.id;

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

    const payload = {
      id: comparisonId,
      comparison_id: comparisonId,
      rfq_id: selectedRfqId,
      rfq_no: selectedRfq?.rfq_no || selectedRfq?.id || selectedRfqId,
      enquiry_no: selectedRfq?.enquiry_no || initialData?.enquiry_no || '—',
      customer_name:
        selectedRfq?.customer_name || initialData?.customer_name || '—',
      pol: selectedRfq?.pol || initialData?.pol || '—',
      pod: selectedRfq?.pod || initialData?.pod || '—',
      shipment_mode:
        selectedRfq?.shipment_mode || initialData?.shipment_mode || 'Sea',
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
      <div className="pb-3 border-b border-[#E2E7ED]">
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
            : 'Select an RFQ to analyze and compare received agent buying rates side-by-side.'}
        </p>
      </div>

      {/* 1. RFQ Selector Card */}
      <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#E2E7ED]">
          <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
            <FileText size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              1. Select RFQ for Comparison
            </h3>

            <p className="text-xs text-[#74808C]">
              Choose an active RFQ; all associated agent quotations will
              populate automatically
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#596673] mb-1.5">
              Select RFQ <span className="text-[#C45151]">*</span>
            </label>

            <select
              value={selectedRfqId}
              onChange={(e) => {
                setSelectedRfqId(e.target.value);
                setSelectedAgentId('');

                if (errors.rfq) {
                  setErrors((prev) => ({ ...prev, rfq: '' }));
                }

                if (errors.quotes) {
                  setErrors((prev) => ({ ...prev, quotes: '' }));
                }
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border rounded-xl text-[#242A31] focus:outline-none focus:ring-2 focus:ring-[#647E96]/20 focus:border-[#647E96] transition-all ${errors.rfq
                  ? 'border-[#C45151] bg-[#FCEEEE]'
                  : 'border-[#D3DBE4]'
                }`}
            >
              <option value="">
                {rateRequests.length === 0
                  ? 'No RFQs Available'
                  : '— Select an RFQ —'}
              </option>

              {rateRequests.map((r) => {
                const id = r.rfq_no || r.id;
                const route = `${r.pol || 'POL'} → ${r.pod || 'POD'}`;

                return (
                  <option key={id} value={id}>
                    {id} — {r.customer_name} ({route})
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

        {/* Selected RFQ Route & Specs Banner */}
        {selectedRfq && (
          <div className="mt-4 p-4 bg-[#EDF2F7] rounded-xl border border-[#D3DBE4] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[#74808C] block font-medium">
                Customer
              </span>
              <span className="font-bold text-[#242A31]">
                {selectedRfq.customer_name || '—'}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">
                Route
              </span>
              <span className="font-bold text-[#354C63]">
                {selectedRfq.pol} → {selectedRfq.pod}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">
                Shipment Mode
              </span>
              <span className="font-bold text-[#242A31]">
                {selectedRfq.shipment_mode || 'Sea'}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">
                Commodity
              </span>
              <span className="font-bold text-[#242A31] truncate block">
                {selectedRfq.commodity || '—'}
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
                charges, and transit times
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

        {matchedQuotations.length === 0 ? (
          <div className="p-12 text-center bg-[#F7F9FB] rounded-xl border border-[#E2E7ED]">
            <Layers size={36} className="mx-auto text-[#AAB5C0] mb-2" />

            <h4 className="text-sm font-semibold text-[#242A31]">
              No Quotations Found For This RFQ
            </h4>

            <p className="text-xs text-[#74808C] mt-1 max-w-md mx-auto">
              {selectedRfqId
                ? 'No agent quotations are logged for this RFQ yet. Go to Agent Quotations to submit responses.'
                : 'Select an RFQ above to preview quotation comparison.'}
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
      <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-4 sm:p-5 flex items-center justify-end gap-3">
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
    </form>
  );
}

export default RateComparisonForm;
