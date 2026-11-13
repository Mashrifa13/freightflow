
import React from 'react';
import {
  ArrowLeft,
  Clock,
  FileText,
  DollarSign,
  Edit,
  Printer,
} from 'lucide-react';

const statusConfig = {
  Draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  Sent: {
    label: 'Sent to Customer',
    className: 'bg-[#EDF2F7] text-[#354C63] border-[#D3DBE4]',
  },
  Accepted: {
    label: 'Accepted by Customer',
    className: 'bg-[#E8F5EF] text-[#16845B] border-[#BDE4D0]',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-[#FCEEEE] text-[#C45151] border-[#F2CCCC]',
  },
  Expired: {
    label: 'Expired',
    className: 'bg-[#FBF2E2] text-[#A87325] border-[#EBD9B8]',
  },
};

function CustomerQuotationDetails({ quotation, onBack, onEdit }) {
  if (!quotation) return null;

  const stConfig = statusConfig[quotation.status] || statusConfig.Draft;
  const currency = quotation.currency || 'USD';
  const charges = quotation.selling_charges || [];

  const formattedPrice = (amount) =>
    Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6">
      <div id="quotation-print" className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E7ED]">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="no-print inline-flex items-center gap-1.5 text-xs font-semibold text-[#74808C] hover:text-[#354C63] transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to Customer Quotations
            </button>

            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
                {quotation.quotation_no || quotation.id}
              </h2>

              <span
                className={`no-print inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${stConfig.className}`}
              >
                {stConfig.label}
              </span>
            </div>

            <p className="text-xs text-[#74808C] mt-1">
              Issued to{' '}
              <span className="font-semibold text-[#424B55]">
                {quotation.customer_name}
              </span>{' '}
              for Enquiry{' '}
              <span className="font-semibold text-[#354C63]">
                {quotation.enquiry_no}
              </span>{' '}
              on {quotation.quotation_date || '—'}
            </p>
          </div>

          <div className="no-print flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 
border border-[#D3DBE4] text-[#424B55] 
bg-white hover:bg-[#EDF2F7] hover:border-[#354C63] 
hover:text-[#354C63] hover:shadow-sm hover:-translate-y-0.5
active:translate-y-0 active:shadow-none
text-xs font-semibold rounded-xl 
transition-all duration-200 ease-in-out cursor-pointer"            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>





          </div>

        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
            <span className="text-xs text-[#74808C] font-medium block">
              Client
            </span>
            <span className="text-sm font-bold text-[#242A31] mt-1 block truncate">
              {quotation.customer_name || '—'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
            <span className="text-xs text-[#74808C] font-medium block">
              Route & Mode
            </span>
            <span className="text-sm font-bold text-[#354C63] mt-1 block truncate">
              {quotation.pol || '—'} → {quotation.pod || '—'} (
              {quotation.shipment_mode || 'Sea'})
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E7ED] shadow-sm">
            <span className="text-xs text-[#74808C] font-medium block">
              Quote Validity
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-[#A87325]">
              <Clock size={15} />
              <span>{quotation.validity_date || '—'}</span>
            </div>
          </div>

          <div className="bg-[#E8F5EF] p-4 rounded-2xl border border-[#BDE4D0] shadow-sm">
            <span className="text-xs text-[#16845B] font-bold block uppercase tracking-wider">
              Total Selling Price
            </span>
            <span className="text-lg font-black text-[#16845B] mt-0.5 block">
              {currency} {formattedPrice(quotation.selling_price)}
            </span>
          </div>
        </div>

        {/* Shipment Specifications */}
        <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E2E7ED]">
            <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
              <FileText size={19} />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#242A31]">
                Shipment Specifications
              </h3>
              <p className="text-xs text-[#74808C]">
                Customer cargo terms and parameters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#74808C] block font-medium">
                Incoterms
              </span>
              <span className="font-semibold text-[#242A31] text-sm mt-1 block">
                {quotation.incoterms || '—'}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">
                Commodity
              </span>
              <span className="font-semibold text-[#242A31] text-sm mt-1 block truncate">
                {quotation.commodity || '—'}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">
                Weight / Volume
              </span>
              <span className="font-semibold text-[#242A31] text-sm mt-1 block">
                {quotation.gross_weight
                  ? `${quotation.gross_weight} ${quotation.gross_weight_unit || 'kg'}`
                  : '—'}{' '}
                / {quotation.volume_cbm ? `${quotation.volume_cbm} CBM` : '—'}
              </span>
            </div>

            <div>
              <span className="text-[#74808C] block font-medium">
                Shipment Type
              </span>
              <span className="font-semibold text-[#242A31] text-sm mt-1 block">
                {quotation.shipment_type || '—'}
              </span>
            </div>
          </div>

          {quotation.containers && quotation.containers.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#E2E7ED] flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#424B55]">
                Containers:
              </span>

              {quotation.containers.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[#EDF2F7] border border-[#D3DBE4] rounded-lg text-xs font-semibold text-[#354C63]"
                >
                  {c.quantity} × {c.containerType}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Itemized Selling Charges */}
        <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E2E7ED]">
            <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#354C63] flex items-center justify-center flex-shrink-0">
              <DollarSign size={19} />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#242A31]">
                Itemized Quotation Charges
              </h3>
              <p className="text-xs text-[#74808C]">
                Clear, transparent selling charges provided to customer
              </p>
            </div>
          </div>

          <div className="border border-[#E2E7ED] rounded-xl overflow-hidden divide-y divide-[#E2E7ED] text-xs">
            {charges.length > 0 ? (
              charges.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 flex items-center justify-between gap-4 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F9FB]'
                    }`}
                >
                  <span className="font-semibold text-[#424B55]">
                    {item.description}
                  </span>

                  <span className="font-bold text-[#242A31] text-sm whitespace-nowrap">
                    {currency} {formattedPrice(item.amount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-4 text-[#74808C] italic">
                No charges itemized.
              </p>
            )}
          </div>

          <div className="p-4 bg-[#E8F5EF] border border-[#BDE4D0] rounded-xl flex items-center justify-between gap-4">
            <span className="font-bold text-[#166B4C] text-sm">
              Total Quotation Value
            </span>

            <span className="font-black text-[#16845B] text-xl whitespace-nowrap">
              {currency} {formattedPrice(quotation.selling_price)}
            </span>
          </div>
        </section>

        {/* Terms & Remarks */}
        {(quotation.terms_and_conditions || quotation.remarks) && (
          <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6 space-y-4 text-xs">
            {quotation.remarks && (
              <div>
                <span className="font-bold text-[#242A31] block mb-2">
                  Special Remarks:
                </span>

                <p className="p-3 bg-[#F7F9FB] rounded-xl border border-[#E2E7ED] text-[#424B55] leading-relaxed">
                  {quotation.remarks}
                </p>
              </div>
            )}

            {quotation.terms_and_conditions && (
              <div>
                <span className="font-bold text-[#242A31] block mb-2">
                  Terms and Conditions:
                </span>

                <pre className="p-3.5 bg-[#F7F9FB] rounded-xl border border-[#E2E7ED] text-[#424B55] font-sans whitespace-pre-wrap leading-relaxed">
                  {quotation.terms_and_conditions}
                </pre>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default CustomerQuotationDetails;
