import React, { useState } from 'react';
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

/**
 * AddCustomerForm component
 * Form sections:
 * 1. Basic Information (Customer Name, Customer Type, Company Registration Number, Tax/VAT Number, Website)
 * 2. Contact Information (Contact Person, Email, Phone, Alternate Phone)
 * 3. Address Information (Country, State, City, Postal Code, Address)
 * 4. Financial Information (Credit Limit, Credit Days)
 * 5. Actions (Save Customer, Cancel)
 */
function AddCustomerForm({ initialData = null, onCancel, onSuccess }) {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    // 1. Basic Information
    customerName: initialData?.name || initialData?.customer_name || '',
    customerType: initialData?.customer_type || initialData?.type || '',
    registrationNumber: initialData?.company_registration_number || '',
    taxVatNumber: initialData?.tax_vat_number || '',
    website: initialData?.website || '',

    // 2. Contact Information
    contactPerson: initialData?.contact_person || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    alternatePhone: initialData?.alternate_phone || '',

    // 3. Address Information
    country: initialData?.country || '',
    state: initialData?.state || '',
    city: initialData?.city || '',
    postalCode: initialData?.postal_code || '',
    address: initialData?.address || '',

    // 4. Financial Information
    creditLimit: initialData?.credit_limit != null ? String(initialData.credit_limit) : '',
    creditDays: initialData?.credit_days != null ? String(initialData.credit_days) : '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on field edit
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
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const el = document.getElementById(firstErrorKey);
        if (el) el.focus();
      }
      return;
    }

    setIsSubmitting(true);

    // Ready for future Django REST Framework POST/PUT request
    const existingId = initialData?.customer_code || initialData?.customer_id || initialData?.id;
    const customerIdNum = Math.floor(100 + Math.random() * 900);
    const generatedCode = existingId || `CUST-2026-${String(customerIdNum).padStart(3, '0')}`;

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
      credit_limit: formData.creditLimit ? parseFloat(formData.creditLimit) : null,
      credit_days: formData.creditDays ? parseInt(formData.creditDays, 10) : null,
      status: initialData?.status || 'Active',
      updated_at: new Date().toISOString(),
      created_at: initialData?.created_at || new Date().toISOString(),
    };

    console.log(`Submitted Payload ready for DRF endpoint (${isEditMode ? 'PUT /api/customers/:id/' : 'POST /api/customers/'}):`, payload);

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess(payload);
      }
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header / Breadcrumb Action */}
      <div className="pb-2 border-b border-gray-100">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Customers
          </button>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            {isEditMode ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEditMode
              ? `Updating profile and billing terms for ${initialData?.name || initialData?.customer_name || 'customer'}.`
              : 'Create a customer profile for shipping enquiries, rate calculations, and invoicing.'}
          </p>
        </div>
      </div>

      {/* 1. Basic Information */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Building2 size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">1. Basic Information</h3>
            <p className="text-xs text-gray-400">Company identity, business registration, and classification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Customer Name */}
          <div className="md:col-span-2">
            <label htmlFor="customerName" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="e.g. Apex Global Logistics Ltd."
              className={`w-full px-3.5 py-2 text-sm bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none transition-all ${
                errors.customerName
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {errors.customerName && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.customerName}
              </p>
            )}
          </div>

          {/* Customer Type */}
          <div>
            <label htmlFor="customerType" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Customer Type <span className="text-red-500">*</span>
            </label>
            <select
              id="customerType"
              name="customerType"
              value={formData.customerType}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 text-sm bg-gray-50 border rounded-xl text-gray-800 focus:bg-white focus:outline-none transition-all cursor-pointer ${
                errors.customerType
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            >
              <option value="">Select Customer Type</option>
              <option value="Shipper">Shipper</option>
              <option value="Consignee">Consignee</option>
              <option value="Freight Forwarder">Freight Forwarder</option>
              <option value="Customs Broker">Customs Broker</option>
              <option value="Third Party Logistics (3PL)">Third Party Logistics (3PL)</option>
            </select>
            {errors.customerType && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.customerType}
              </p>
            )}
          </div>

          {/* Company Registration Number */}
          <div>
            <label htmlFor="registrationNumber" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Company Registration Number
            </label>
            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="e.g. CIN / CR / UEN Number"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Tax/VAT Number */}
          <div>
            <label htmlFor="taxVatNumber" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Tax / VAT / GST Number
            </label>
            <input
              id="taxVatNumber"
              name="taxVatNumber"
              type="text"
              value={formData.taxVatNumber}
              onChange={handleChange}
              placeholder="e.g. GSTIN / VAT ID"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Website */}
          <div className="lg:col-span-3">
            <label htmlFor="website" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Website
            </label>
            <div className="relative">
              <Globe size={15} className="absolute left-3.5 top-2.5 text-gray-400" />
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.company.com"
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Contact Information */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <PhoneCall size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">2. Contact Information</h3>
            <p className="text-xs text-gray-400">Primary point of contact, emails, and direct phone lines</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Contact Person */}
          <div>
            <label htmlFor="contactPerson" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-2.5 text-gray-400" />
              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Full Name (e.g. Rahul Sharma)"
                className={`w-full pl-10 pr-3.5 py-2 text-sm bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none transition-all ${
                  errors.contactPerson
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
            {errors.contactPerson && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.contactPerson}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-2.5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. logistics@company.com"
                className={`w-full pl-10 pr-3.5 py-2 text-sm bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none transition-all ${
                  errors.email
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className={`w-full px-3.5 py-2 text-sm bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none transition-all ${
                errors.phone
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.phone}
              </p>
            )}
          </div>

          {/* Alternate Phone */}
          <div>
            <label htmlFor="alternatePhone" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Alternate Phone
            </label>
            <input
              id="alternatePhone"
              name="alternatePhone"
              type="tel"
              value={formData.alternatePhone}
              onChange={handleChange}
              placeholder="e.g. +91 22 2345 6789 (Landline/Secondary)"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>
      </section>

      {/* 3. Address Information */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <MapPin size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">3. Address Information</h3>
            <p className="text-xs text-gray-400">Registered business location, billing, and origin/destination hub</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Country */}
          <div className="sm:col-span-2">
            <label htmlFor="country" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 text-sm bg-gray-50 border rounded-xl text-gray-800 focus:bg-white focus:outline-none transition-all cursor-pointer ${
                errors.country
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="China">China</option>
              <option value="Singapore">Singapore</option>
              <option value="Germany">Germany</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Malaysia">Malaysia</option>
            </select>
            {errors.country && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <ShieldAlert size={12} /> {errors.country}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-xs font-semibold text-gray-600 mb-1.5">
              State / Province
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Maharashtra"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-xs font-semibold text-gray-600 mb-1.5">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="postalCode" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Postal / ZIP Code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="e.g. 400001"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Address Line */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="address" className="block text-xs font-semibold text-gray-600 mb-1.5">
              Street Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Suite 402, Trade Center, Nariman Point"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>
        </div>
      </section>

      {/* 4. Financial Information */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
            <CreditCard size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">4. Financial Information</h3>
            <p className="text-xs text-gray-400">Credit limits and payment terms for freight bookings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
          {/* Credit Limit */}
          <div>
            <label htmlFor="creditLimit" className="block text-xs font-semibold text-gray-600 mb-1.5">
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
                className="w-full pl-10 pr-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <span className="absolute left-3.5 top-2 text-xs font-semibold text-gray-400">
                ₹
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Maximum approved credit amount for bookings</p>
          </div>

          {/* Credit Days */}
          <div>
            <label htmlFor="creditDays" className="block text-xs font-semibold text-gray-600 mb-1.5">
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
                className="w-full pr-12 pl-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <span className="absolute right-3.5 top-2 text-xs font-medium text-gray-400">
                days
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Payment term window from invoice issue date</p>
          </div>
        </div>
      </section>

      {/* 5. Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 transition-all">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          <X size={16} />
          <span>Cancel</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
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
