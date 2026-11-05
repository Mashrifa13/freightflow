import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  FileText,
  DollarSign,
  Edit,
  Ship,
  Plane,
  Truck,
  Printer,
  FileCheck2,
  Layers,
} from 'lucide-react';

const statusConfig = {
  Draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  Sent: {
    label: 'Sent to Customer',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  Accepted: {
    label: 'Accepted by Customer',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  Expired: {
    label: 'Expired',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

function CustomerQuotationDetails({ quotation, onBack, onEdit }) {
  if (!quotation) return null;

  const stConfig = statusConfig[quotation.status] || statusConfig.Draft;
  const currency = quotation.currency || 'USD';
  const charges = quotation.selling_charges || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div id="quotation-print" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-gray-100 gap-4">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="no-print inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to Customer Quotations
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                {quotation.quotation_no || quotation.id}
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stConfig.className}`}
              >
                {stConfig.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Issued to <span className="font-semibold text-gray-700">{quotation.customer_name}</span> for Enquiry{' '}
              <span className="font-semibold text-blue-700">{quotation.enquiry_no}</span> on{' '}
              {quotation.quotation_date || '—'}
            </p>
          </div>

          <div className="no-print flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => onEdit(quotation)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Edit size={14} />
              <span>Edit Quotation</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs text-gray-400 font-medium block">Client</span>
            <span className="text-sm font-bold text-gray-800 mt-1 block truncate">
              {quotation.customer_name || '—'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs text-gray-400 font-medium block">Route & Mode</span>
            <span className="text-sm font-bold text-blue-700 mt-1 block truncate">
              {quotation.pol || '—'} → {quotation.pod || '—'} ({quotation.shipment_mode || 'Sea'})
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-xs text-gray-400 font-medium block">Quote Validity</span>
            <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-amber-700">
              <Clock size={15} className="text-amber-500" />
              <span>{quotation.validity_date || '—'}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
            <span className="text-xs text-emerald-800 font-bold block uppercase tracking-wider">
              Total Selling Price
            </span>
            <span className="text-lg font-black text-emerald-700 mt-0.5 block">
              {currency}{' '}
              {Number(quotation.selling_price || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Shipment & Cargo Specifications */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FileText size={19} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Shipment Specifications
              </h3>
              <p className="text-xs text-gray-400">
                Customer cargo terms and parameters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Incoterms</span>
              <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
                {quotation.incoterms || '—'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Commodity</span>
              <span className="font-semibold text-gray-800 text-sm mt-0.5 block truncate">
                {quotation.commodity || '—'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Weight / Volume</span>
              <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
                {quotation.gross_weight ? `${quotation.gross_weight} ${quotation.gross_weight_unit || 'kg'}` : '—'} /{' '}
                {quotation.volume_cbm ? `${quotation.volume_cbm} CBM` : '—'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Shipment Type</span>
              <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
                {quotation.shipment_type || '—'}
              </span>
            </div>
          </div>

          {quotation.containers && quotation.containers.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-500">Containers:</span>
              {quotation.containers.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800"
                >
                  {c.quantity} × {c.containerType}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Itemized Selling Charges Table */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <DollarSign size={19} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Itemized Quotation Charges
              </h3>
              <p className="text-xs text-gray-400">
                Clear, transparent selling charges provided to customer
              </p>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
            {charges && charges.length > 0 ? (
              charges.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-700">{item.description}</span>
                  <span className="font-bold text-gray-800 text-sm">
                    {currency} {Number(item.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-400 italic">No charges itemized.</p>
            )}
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <span className="font-bold text-emerald-900 text-sm">
              Total Quotation Value
            </span>
            <span className="font-black text-emerald-700 text-xl">
              {currency} {Number(quotation.selling_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </section>

        {/* Terms & Remarks */}
        {(quotation.terms_and_conditions || quotation.remarks) && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 text-xs">
            {quotation.remarks && (
              <div>
                <span className="font-bold text-gray-700 block mb-1">
                  Special Remarks:
                </span>
                <p className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700">
                  {quotation.remarks}
                </p>
              </div>
            )}

            {quotation.terms_and_conditions && (
              <div>
                <span className="font-bold text-gray-700 block mb-1">
                  Terms and Conditions:
                </span>
                <pre className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-600 font-sans whitespace-pre-wrap leading-relaxed">
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

