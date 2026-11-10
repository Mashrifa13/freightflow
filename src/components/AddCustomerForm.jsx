
import React, { useState } from 'react';
import SearchableCountrySelect from './SearchableCountrySelect';
import {
  Building2,
  PhoneCall,
  MapPin,
  CreditCard,
  Save,
  X,
  ArrowLeft,
  Globe,
  Mail,
  User,
  ShieldAlert,
} from 'lucide-react';

function AddCustomerForm({ initialData = null, onCancel, onSuccess }) {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    customerName: initialData?.name || initialData?.customer_name || '',
    customerType: initialData?.customer_type || initialData?.type || '',
    registrationNumber: initialData?.company_registration_number || '',
    taxVatNumber: initialData?.tax_vat_number || '',
    website: initialData?.website || '',

    contactPerson: initialData?.contact_person || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    alternatePhone: initialData?.alternate_phone || '',

    country: initialData?.country || '',
    state: initialData?.state || '',
    city: initialData?.city || '',
    postalCode: initialData?.postal_code || '',
    address: initialData?.address || '',

    creditLimit: initialData?.credit_limit != null
      ? String(initialData.credit_limit)
      : '',
    creditDays: initialData?.credit_days != null
      ? String(initialData.credit_days)
      : '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shared styling
  const labelClass =
    'block text-xs font-semibold text-[#596673] mb-1.5';

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-[#D3DBE4] rounded-xl text-[#242A31] placeholder-[#929DA8] focus:bg-white focus:outline-none focus:border-[#354C63] focus:ring-2 focus:ring-[#354C63]/10 transition-all';

  const sectionClass =
    'bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-5 sm:p-6';

  const sectionHeaderClass =
    'flex items-center gap-3 pb-4 mb-5 border-b border-[#E2E7ED]';

  const sectionIconClass =
    'w-10 h-10 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center flex-shrink-0';

  const errorClass =
    'text-xs text-[#C45151] mt-1.5 flex items-center gap-1';

  const getInputClass = (error) =>
    `${inputClass} ${error
      ? 'border-[#C45151] focus:border-[#C45151] focus:ring-[#C45151]/10'
      : ''
    }`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer Name is required';
    }

    if (!formData.customerType) {
      newErrors.customerType = 'Please select a Customer Type';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact Person is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.country) {
      newErrors.country = 'Please select a Country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];

      if (firstErrorKey) {
        const el = document.getElementById(firstErrorKey);
        if (el) el.focus();
      }

      return;
    }

    setIsSubmitting(true);

    const existingId =
      initialData?.customer_code ||
      initialData?.customer_id ||
      initialData?.id;

    const generatedCode = existingId || null;

    const payload = {
      ...initialData,
      id: generatedCode,
      customer_id: generatedCode,
      customer_code: generatedCode,
      name: formData.customerName,
      customer_name: formData.customerName,
      customer_type: formData.customerType,
      type: formData.customerType,
      company_registration_number: formData.registrationNumber,
      tax_vat_number: formData.taxVatNumber,
      website: formData.website,
      contact_person: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      alternate_phone: formData.alternatePhone,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      postal_code: formData.postalCode,
      address: formData.address,
      credit_limit: formData.creditLimit
        ? parseFloat(formData.creditLimit)
        : null,
      credit_days: formData.creditDays
        ? parseInt(formData.creditDays, 10)
        : null,
      status: initialData?.status || 'Active',
      updated_at: new Date().toISOString(),
      created_at: initialData?.created_at || new Date().toISOString(),
    };

    console.log(
      `Submitted Payload ready for DRF endpoint (${isEditMode ? 'PUT /api/customers/:id/' : 'POST /api/customers/'
      }):`,
      payload
    );

    setTimeout(() => {
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess(payload);
      }
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">

      {/* Page Header */}
      <div className="pb-4 border-b border-[#E2E7ED]">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74808C] hover:text-[#354C63] transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Customers
        </button>

        <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
          {isEditMode ? 'Edit Customer' : 'Add New Customer'}
        </h2>

        <p className="text-xs text-[#74808C] mt-1">
          {isEditMode
            ? `Updating profile and billing terms for ${initialData?.name ||
            initialData?.customer_name ||
            'customer'
            }.`
            : 'Create a customer profile for shipping enquiries, rate calculations, and invoicing.'}
        </p>
      </div>

      {/* 1. Basic Information */}
      <section className={sectionClass}>
        <div className={sectionHeaderClass}>
          <div className={sectionIconClass}>
            <Building2 size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              1. Basic Information
            </h3>
            <p className="text-xs text-[#74808C] mt-0.5">
              Company identity, business registration, and classification
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Customer Name */}
          <div className="md:col-span-2">
            <label htmlFor="customerName" className={labelClass}>
              Customer Name <span className="text-[#C45151]">*</span>
            </label>

            <input
              id="customerName"
              name="customerName"
              type="text"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="e.g. Apex Global Logistics Ltd."
              className={getInputClass(errors.customerName)}
            />

            {errors.customerName && (
              <p className={errorClass}>
                <ShieldAlert size={12} />
                {errors.customerName}
              </p>
            )}
          </div>

          {/* Customer Type */}
          <div>
            <label htmlFor="customerType" className={labelClass}>
              Customer Type <span className="text-[#C45151]">*</span>
            </label>

            <select
              id="customerType"
              name="customerType"
              value={formData.customerType}
              onChange={handleChange}
              className={`${getInputClass(errors.customerType)} cursor-pointer`}
            >
              <option value="">Select Customer Type</option>
              <option value="Shipper">Shipper</option>
              <option value="Consignee">Consignee</option>
              <option value="Freight Forwarder">Freight Forwarder</option>
              <option value="Customs Broker">Customs Broker</option>
              <option value="Third Party Logistics (3PL)">
                Third Party Logistics (3PL)
              </option>
            </select>

            {errors.customerType && (
              <p className={errorClass}>
                <ShieldAlert size={12} />
                {errors.customerType}
              </p>
            )}
          </div>

          {/* Registration Number */}
          <div>
            <label htmlFor="registrationNumber" className={labelClass}>
              Company Registration Number
            </label>

            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="e.g. CIN / CR / UEN Number"
              className={inputClass}
            />
          </div>

          {/* Tax/VAT Number */}
          <div>
            <label htmlFor="taxVatNumber" className={labelClass}>
              Tax / VAT / GST Number
            </label>

            <input
              id="taxVatNumber"
              name="taxVatNumber"
              type="text"
              value={formData.taxVatNumber}
              onChange={handleChange}
              placeholder="e.g. GSTIN / VAT ID"
              className={inputClass}
            />
          </div>

          {/* Website */}
          <div className="lg:col-span-3">
            <label htmlFor="website" className={labelClass}>
              Website
            </label>

            <div className="relative">
              <Globe
                size={15}
                className="absolute left-3.5 top-3 text-[#74808C]"
              />

              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.company.com"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Contact Information */}
      <section className={sectionClass}>
        <div className={sectionHeaderClass}>
          <div className={sectionIconClass}>
            <PhoneCall size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              2. Contact Information
            </h3>
            <p className="text-xs text-[#74808C] mt-0.5">
              Primary point of contact, emails, and direct phone lines
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Contact Person */}
          <div>
            <label htmlFor="contactPerson" className={labelClass}>
              Contact Person <span className="text-[#C45151]">*</span>
            </label>

            <div className="relative">
              <User
                size={15}
                className="absolute left-3.5 top-3 text-[#74808C]"
              />

              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Full Name (e.g. Rahul Sharma)"
                className={`${getInputClass(errors.contactPerson)} pl-10`}
              />
            </div>

            {errors.contactPerson && (
              <p className={errorClass}>
                <ShieldAlert size={12} />
                {errors.contactPerson}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address <span className="text-[#C45151]">*</span>
            </label>

            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-3 text-[#74808C]"
              />

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. logistics@company.com"
                className={`${getInputClass(errors.email)} pl-10`}
              />
            </div>

            {errors.email && (
              <p className={errorClass}>
                <ShieldAlert size={12} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone Number <span className="text-[#C45151]">*</span>
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className={getInputClass(errors.phone)}
            />

            {errors.phone && (
              <p className={errorClass}>
                <ShieldAlert size={12} />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Alternate Phone */}
          <div>
            <label htmlFor="alternatePhone" className={labelClass}>
              Alternate Phone
            </label>

            <input
              id="alternatePhone"
              name="alternatePhone"
              type="tel"
              value={formData.alternatePhone}
              onChange={handleChange}
              placeholder="e.g. +91 22 2345 6789 (Landline/Secondary)"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* 3. Address Information */}
      <section className={sectionClass}>
        <div className={sectionHeaderClass}>
          <div className={sectionIconClass}>
            <MapPin size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              3. Address Information
            </h3>
            <p className="text-xs text-[#74808C] mt-0.5">
              Registered business location, billing, and origin/destination hub
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Country */}
          <div className="sm:col-span-2">
            <label htmlFor="country" className={labelClass}>
              Country <span className="text-[#C45151]">*</span>
            </label>

            <SearchableCountrySelect
              id="country"
              value={formData.country}
              onChange={(countryVal) => {
                setFormData((prev) => ({
                  ...prev,
                  country: countryVal,
                }));

                if (errors.country) {
                  setErrors((prev) => ({
                    ...prev,
                    country: '',
                  }));
                }
              }}
              placeholder="Search or select country..."
              hasError={Boolean(errors.country)}
            />

            {errors.country && (
              <p className={errorClass}>
                <ShieldAlert size={12} />
                {errors.country}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className={labelClass}>
              State / Province
            </label>

            <input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Maharashtra"
              className={inputClass}
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className={labelClass}>
              City
            </label>

            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
              className={inputClass}
            />
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="postalCode" className={labelClass}>
              Postal / ZIP Code
            </label>

            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="e.g. 400001"
              className={inputClass}
            />
          </div>

          {/* Street Address */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="address" className={labelClass}>
              Street Address
            </label>

            <textarea
              id="address"
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Suite 402, Trade Center, Nariman Point"
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </section>

      {/* 4. Financial Information */}
      <section className={sectionClass}>
        <div className={sectionHeaderClass}>
          <div className={sectionIconClass}>
            <CreditCard size={19} />
          </div>

          <div>
            <h3 className="text-base font-semibold text-[#242A31]">
              4. Financial Information
            </h3>
            <p className="text-xs text-[#74808C] mt-0.5">
              Credit limits and payment terms for freight bookings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">

          {/* Credit Limit */}
          <div>
            <label htmlFor="creditLimit" className={labelClass}>
              Credit Limit
            </label>

            <div className="relative">
              <input
                id="creditLimit"
                name="creditLimit"
                type="number"
                min="0"
                step="1000"
                value={formData.creditLimit}
                onChange={handleChange}
                placeholder="0.00"
                className={`${inputClass} pl-10`}
              />

              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-[#74808C]">
                ₹
              </span>
            </div>

            <p className="text-[11px] text-[#929DA8] mt-1.5">
              Maximum approved credit amount for bookings
            </p>
          </div>

          {/* Credit Days */}
          <div>
            <label htmlFor="creditDays" className={labelClass}>
              Credit Days
            </label>

            <div className="relative">
              <input
                id="creditDays"
                name="creditDays"
                type="number"
                min="0"
                max="365"
                value={formData.creditDays}
                onChange={handleChange}
                placeholder="e.g. 30"
                className={`${inputClass} pr-12`}
              />

              <span className="absolute right-3.5 top-2.5 text-xs font-medium text-[#74808C]">
                days
              </span>
            </div>

            <p className="text-[11px] text-[#929DA8] mt-1.5">
              Payment term window from invoice issue date
            </p>
          </div>
        </div>
      </section>

      {/* 5. Actions */}
      <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-4 sm:p-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#D3DBE4] text-[#596673] hover:bg-[#F1F4F7] text-sm font-medium rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          <X size={16} />
          <span>Cancel</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#354C63] hover:bg-[#293D52] active:bg-[#243648] text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
        >
          <Save size={16} />

          <span>
            {isSubmitting
              ? isEditMode
                ? 'Updating Customer...'
                : 'Saving Customer...'
              : isEditMode
                ? 'Update Customer'
                : 'Save Customer'}
          </span>
        </button>
      </div>
    </form>
  );
}

export default AddCustomerForm;
