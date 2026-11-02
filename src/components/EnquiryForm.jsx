import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  Package,
  Ship,
  Info,
  Paperclip,
  Plus,
  Trash2,
  ShieldAlert,
  Save,
  X,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const INCOTERMS = ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF'];

const CONTAINER_TYPES = [
  "20'GP", "40'GP", "40'HC", "20'RF", "40'RF", "20'OT", "40'OT", "45'HC",
];

// ─── Small reusable pieces ─────────────────────────────────────────────────────

function FieldLabel({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-gray-600 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <ShieldAlert size={12} />
      {message}
    </p>
  );
}

function inputCls(hasError) {
  return `w-full px-3.5 py-2 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all ${
    hasError ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
  }`;
}

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all">
      <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

// ─── Default state ────────────────────────────────────────────────────────────

function buildInitialState(data) {
  return {
    enquiryDate: data?.enquiry_date || new Date().toISOString().slice(0, 10),
    customerId: data?.customer_id || '',
    customerName: data?.customer || data?.customer_name || '',
    contactPerson: data?.contact_person || '',

    shipmentMode: data?.shipment_mode || data?.mode || '',
    shipmentType: data?.shipment_type || '',
    pol: data?.pol || '',
    pod: data?.pod || '',
    incoterms: data?.incoterms || '',
    expectedShippingDate: data?.expected_shipping_date || '',

    commodity: data?.commodity || '',
    cargoDescription: data?.cargo_description || '',
    numberOfPackages: data?.no_of_packages != null ? String(data.no_of_packages) : '',
    grossWeight: data?.gross_weight != null ? String(data.gross_weight) : '',
    grossWeightUnit: data?.gross_weight_unit || 'kg',
    volume: data?.volume_cbm != null ? String(data.volume_cbm) : '',
    containers: data?.containers?.length
      ? data.containers
      : [{ containerType: '', quantity: '' }],

    specialInstructions: data?.special_instructions || '',
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * EnquiryForm
 * Reusable create/edit form for freight enquiries.
 *
 * Props:
 *   initialData   – existing enquiry object for edit mode (null for create)
 *   customers     – array of customer objects from App-level state
 *   onCancel      – callback to navigate back without saving
 *   onSave        – callback(payload) called with DRF-ready payload on submit
 */
function EnquiryForm({ initialData = null, customers = [], onCancel, onSave }) {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState(() => buildInitialState(initialData));
  const [attachments, setAttachments] = useState([]); // File objects — not serialised
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Auto-fill contactPerson when customer changes ──────────────────────────
  useEffect(() => {
    if (!formData.customerId) return;
    const cust = customers.find(
      (c) =>
        (c.id && c.id === formData.customerId) ||
        (c.customer_id && c.customer_id === formData.customerId) ||
        (c.customer_code && c.customer_code === formData.customerId)
    );
    if (cust && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        contactPerson: cust.contact_person || prev.contactPerson,
      }));
    }
  }, [formData.customerId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Field change handlers ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCustomerChange = (e) => {
    const selectedId = e.target.value;
    const cust = customers.find(
      (c) =>
        (c.id && c.id === selectedId) ||
        (c.customer_id && c.customer_id === selectedId) ||
        (c.customer_code && c.customer_code === selectedId)
    );
    setFormData((prev) => ({
      ...prev,
      customerId: selectedId,
      customerName: cust ? (cust.name || cust.customer_name || '') : '',
      contactPerson: cust ? (cust.contact_person || prev.contactPerson) : prev.contactPerson,
    }));
    if (errors.customerId) setErrors((prev) => ({ ...prev, customerId: '' }));
  };

  // ── Container rows ─────────────────────────────────────────────────────────
  const handleContainerChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.containers];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, containers: updated };
    });
  };

  const addContainerRow = () => {
    setFormData((prev) => ({
      ...prev,
      containers: [...prev.containers, { containerType: '', quantity: '' }],
    }));
  };

  const removeContainerRow = (idx) => {
    setFormData((prev) => ({
      ...prev,
      containers: prev.containers.filter((_, i) => i !== idx),
    }));
  };

  // ── File attachments ───────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    // reset input so same file can be re-added after removal
    e.target.value = '';
  };

  const removeAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!formData.enquiryDate) newErrors.enquiryDate = 'Enquiry date is required';
    if (!formData.customerId) newErrors.customerId = 'Please select a customer';
    if (!formData.shipmentMode) newErrors.shipmentMode = 'Please select a shipment mode';
    if (!formData.pol.trim()) newErrors.pol = 'Port of Loading is required';
    if (!formData.pod.trim()) newErrors.pod = 'Port of Discharge is required';
    if (!formData.commodity.trim()) newErrors.commodity = 'Commodity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Build DRF-ready payload (snake_case)
    const year = new Date().getFullYear();
    const randSuffix = String(Math.floor(100 + Math.random() * 900));
    const newId = isEditMode
      ? (initialData.id || initialData.enquiry_no)
      : `ENQ-${year}-${randSuffix}`;

    const payload = {
      id: newId,
      enquiry_no: newId,
      customer_id: formData.customerId,
      customer: formData.customerName,
      customer_name: formData.customerName,
      contact_person: formData.contactPerson,
      enquiry_date: formData.enquiryDate,

      shipment_mode: formData.shipmentMode,
      mode: formData.shipmentMode, // backward-compat with table/modal
      shipment_type: formData.shipmentType,
      pol: formData.pol,
      pod: formData.pod,
      incoterms: formData.incoterms,
      expected_shipping_date: formData.expectedShippingDate,

      commodity: formData.commodity,
      cargo_description: formData.cargoDescription,
      no_of_packages: formData.numberOfPackages ? parseInt(formData.numberOfPackages, 10) : null,
      gross_weight: formData.grossWeight ? parseFloat(formData.grossWeight) : null,
      gross_weight_unit: formData.grossWeightUnit,
      volume_cbm: formData.volume ? parseFloat(formData.volume) : null,
      containers:
        formData.shipmentMode === 'Sea' && formData.shipmentType === 'FCL'
          ? formData.containers.filter((c) => c.containerType || c.quantity)
          : [],

      special_instructions: formData.specialInstructions,
      // attachments are File objects — upload separately when API is ready

      status: initialData?.status || 'Pending',
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log(
      `DRF payload (${isEditMode ? 'PUT /api/enquiries/' + newId + '/' : 'POST /api/enquiries/'}):`,
      payload
    );

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSave) onSave(payload);
    }, 400);
  };

  // ── Derived flags ──────────────────────────────────────────────────────────
  const isSea = formData.shipmentMode === 'Sea';
  const isFCL = isSea && formData.shipmentType === 'FCL';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">

      {/* ── Top breadcrumb / title ─────────────────────────────────────────── */}
      <div className="pb-2 border-b border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Enquiries
        </button>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          {isEditMode ? 'Edit Enquiry' : 'Add New Enquiry'}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {isEditMode
            ? `Updating details for enquiry ${initialData?.id || initialData?.enquiry_no}.`
            : 'Create a new freight pricing enquiry for a customer shipment.'}
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — Basic Information
      ══════════════════════════════════════════════════════════════════════ */}
      <SectionCard
        icon={<FileText size={19} />}
        title="1. Basic Information"
        subtitle="Enquiry date, customer selection, and contact details"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Enquiry Date */}
          <div>
            <FieldLabel htmlFor="enquiryDate" required>Enquiry Date</FieldLabel>
            <input
              type="date"
              id="enquiryDate"
              name="enquiryDate"
              value={formData.enquiryDate}
              onChange={handleChange}
              className={inputCls(!!errors.enquiryDate)}
            />
            <FieldError message={errors.enquiryDate} />
          </div>

          {/* Customer */}
          <div>
            <FieldLabel htmlFor="customerId" required>Customer</FieldLabel>
            <select
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleCustomerChange}
              className={inputCls(!!errors.customerId)}
            >
              <option value="">
                {customers.length === 0 ? 'No customers added yet' : '— Select Customer —'}
              </option>
              {customers.map((c) => {
                const id = c.customer_code || c.customer_id || c.id;
                const label = c.name || c.customer_name;
                return (
                  <option key={id} value={id}>
                    {label}
                  </option>
                );
              })}
            </select>
            <FieldError message={errors.customerId} />
          </div>

          {/* Contact Person */}
          <div>
            <FieldLabel htmlFor="contactPerson">Contact Person</FieldLabel>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="e.g. John Smith"
              className={inputCls(false)}
            />
          </div>
        </div>
      </SectionCard>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — Shipment Information
      ══════════════════════════════════════════════════════════════════════ */}
      <SectionCard
        icon={<Ship size={19} />}
        title="2. Shipment Information"
        subtitle="Mode, ports, Incoterms, and expected shipping window"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Shipment Mode */}
          <div>
            <FieldLabel htmlFor="shipmentMode" required>Shipment Mode</FieldLabel>
            <select
              id="shipmentMode"
              name="shipmentMode"
              value={formData.shipmentMode}
              onChange={(e) => {
                handleChange(e);
                // Reset FCL-specific data when mode changes away from Sea
                if (e.target.value !== 'Sea') {
                  setFormData((prev) => ({
                    ...prev,
                    shipmentMode: e.target.value,
                    shipmentType: '',
                    containers: [{ containerType: '', quantity: '' }],
                  }));
                } else {
                  setFormData((prev) => ({ ...prev, shipmentMode: e.target.value }));
                }
                if (errors.shipmentMode) setErrors((prev) => ({ ...prev, shipmentMode: '' }));
              }}
              className={inputCls(!!errors.shipmentMode)}
            >
              <option value="">— Select Mode —</option>
              <option value="Air">Air</option>
              <option value="Sea">Sea</option>
              <option value="Land">Land</option>
            </select>
            <FieldError message={errors.shipmentMode} />
          </div>

          {/* Shipment Type — only for Sea */}
          {isSea && (
            <div>
              <FieldLabel htmlFor="shipmentType">Shipment Type</FieldLabel>
              <select
                id="shipmentType"
                name="shipmentType"
                value={formData.shipmentType}
                onChange={handleChange}
                className={inputCls(false)}
              >
                <option value="">— Select Type —</option>
                <option value="FCL">FCL (Full Container Load)</option>
                <option value="LCL">LCL (Less than Container Load)</option>
              </select>
            </div>
          )}

          {/* POL */}
          <div>
            <FieldLabel htmlFor="pol" required>POL (Port of Loading)</FieldLabel>
            <input
              type="text"
              id="pol"
              name="pol"
              value={formData.pol}
              onChange={handleChange}
              placeholder="e.g. Nhava Sheva, Mumbai"
              className={inputCls(!!errors.pol)}
            />
            <FieldError message={errors.pol} />
          </div>

          {/* POD */}
          <div>
            <FieldLabel htmlFor="pod" required>POD (Port of Discharge)</FieldLabel>
            <input
              type="text"
              id="pod"
              name="pod"
              value={formData.pod}
              onChange={handleChange}
              placeholder="e.g. Jebel Ali, Dubai"
              className={inputCls(!!errors.pod)}
            />
            <FieldError message={errors.pod} />
          </div>

          {/* Incoterms */}
          <div>
            <FieldLabel htmlFor="incoterms">Incoterms</FieldLabel>
            <select
              id="incoterms"
              name="incoterms"
              value={formData.incoterms}
              onChange={handleChange}
              className={inputCls(false)}
            >
              <option value="">— Select Incoterms —</option>
              {INCOTERMS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Expected Shipping Date */}
          <div>
            <FieldLabel htmlFor="expectedShippingDate">Expected Shipping Date</FieldLabel>
            <input
              type="date"
              id="expectedShippingDate"
              name="expectedShippingDate"
              value={formData.expectedShippingDate}
              onChange={handleChange}
              className={inputCls(false)}
            />
          </div>
        </div>
      </SectionCard>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — Cargo Information
      ══════════════════════════════════════════════════════════════════════ */}
      <SectionCard
        icon={<Package size={19} />}
        title="3. Cargo Information"
        subtitle="Commodity, weight, volume, and container details"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Commodity */}
          <div>
            <FieldLabel htmlFor="commodity" required>Commodity</FieldLabel>
            <input
              type="text"
              id="commodity"
              name="commodity"
              value={formData.commodity}
              onChange={handleChange}
              placeholder="e.g. Electronic Goods"
              className={inputCls(!!errors.commodity)}
            />
            <FieldError message={errors.commodity} />
          </div>

          {/* Number of Packages */}
          <div>
            <FieldLabel htmlFor="numberOfPackages">Number of Packages</FieldLabel>
            <input
              type="number"
              id="numberOfPackages"
              name="numberOfPackages"
              value={formData.numberOfPackages}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 100"
              className={inputCls(false)}
            />
          </div>

          {/* Gross Weight + unit */}
          <div>
            <FieldLabel htmlFor="grossWeight">Gross Weight</FieldLabel>
            <div className="flex gap-2">
              <input
                type="number"
                id="grossWeight"
                name="grossWeight"
                value={formData.grossWeight}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="e.g. 500"
                className={`${inputCls(false)} flex-1`}
              />
              <select
                name="grossWeightUnit"
                value={formData.grossWeightUnit}
                onChange={handleChange}
                className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all w-20"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>

          {/* Volume */}
          <div>
            <FieldLabel htmlFor="volume">Volume (CBM)</FieldLabel>
            <input
              type="number"
              id="volume"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              min="0"
              step="0.001"
              placeholder="e.g. 12.5"
              className={inputCls(false)}
            />
          </div>

          {/* Cargo Description — spans 2 cols */}
          <div className="md:col-span-2">
            <FieldLabel htmlFor="cargoDescription">Cargo Description</FieldLabel>
            <textarea
              id="cargoDescription"
              name="cargoDescription"
              value={formData.cargoDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the cargo: nature, packing, hazardous info, etc."
              className={`${inputCls(false)} resize-none`}
            />
          </div>
        </div>

        {/* ── Container Rows (FCL only) ─────────────────────────────────────── */}
        {isFCL && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-600">Container Type &amp; Quantity</p>
              <button
                type="button"
                onClick={addContainerRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all cursor-pointer"
              >
                <Plus size={13} /> Add Container
              </button>
            </div>
            <div className="space-y-2">
              {formData.containers.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <select
                    value={row.containerType}
                    onChange={(e) => handleContainerChange(idx, 'containerType', e.target.value)}
                    className="flex-1 px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  >
                    <option value="">— Container Type —</option>
                    {CONTAINER_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) => handleContainerChange(idx, 'quantity', e.target.value)}
                    min="1"
                    placeholder="Qty"
                    className="w-24 px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  />
                  {formData.containers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContainerRow(idx)}
                      title="Remove row"
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — Additional Information
      ══════════════════════════════════════════════════════════════════════ */}
      <SectionCard
        icon={<Info size={19} />}
        title="4. Additional Information"
        subtitle="Special handling instructions and supporting documents"
      >
        <div className="space-y-5">

          {/* Special Instructions */}
          <div>
            <FieldLabel htmlFor="specialInstructions">Special Instructions</FieldLabel>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows={3}
              placeholder="Any special requirements: temperature control, hazardous handling, delivery window, etc."
              className={`${inputCls(false)} resize-none`}
            />
          </div>

          {/* Attachments */}
          <div>
            <FieldLabel htmlFor="attachments">Attachments</FieldLabel>
            <label
              htmlFor="attachments"
              className="flex items-center gap-2 px-4 py-3 w-full border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-blue-50/40 hover:border-blue-300 cursor-pointer transition-all group"
            >
              <Paperclip size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                Click to attach documents (packing list, BL, invoices…)
              </span>
              <input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {attachments.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {attachments.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-700"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Paperclip size={11} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-gray-400 flex-shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="ml-2 p-0.5 text-gray-400 hover:text-red-500 rounded transition-colors cursor-pointer flex-shrink-0"
                    >
                      <X size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ── Bottom Action Bar ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          <X size={15} />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={15} />
          {isSubmitting
            ? 'Saving…'
            : isEditMode
            ? 'Save Changes'
            : 'Create Enquiry'}
        </button>
      </div>
    </form>
  );
}

export default EnquiryForm;

