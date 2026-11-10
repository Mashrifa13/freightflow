
import React from 'react';

function SalesReportTable({ customerQuotations = [] }) {
    const acceptedCount = customerQuotations.filter(
        (quote) => quote.status === 'Accepted'
    ).length;

    const totalSalesValue = customerQuotations
        .filter((quote) => quote.status === 'Accepted')
        .reduce(
            (total, quote) => total + (Number(quote.selling_price) || 0),
            0
        );

    return (
        <div className="space-y-5">
            {/* Sales Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-[#E2E7ED] shadow-sm p-5">
                    <p className="text-sm font-medium text-[#74808C]">
                        Accepted Quotations
                    </p>
                    <h3 className="text-2xl font-bold text-[#16845B] mt-2">
                        {acceptedCount}
                    </h3>
                </div>

                <div className="bg-white rounded-xl border border-[#E2E7ED] shadow-sm p-5">
                    <p className="text-sm font-medium text-[#74808C]">
                        Accepted Quotation Value
                    </p>
                    <h3 className="text-2xl font-bold text-[#354C63] mt-2">
                        {totalSalesValue.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h3>
                    <p className="text-xs text-[#74808C] mt-1">
                        Sum of accepted selling prices; currencies are not converted.
                    </p>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-xl border border-[#E2E7ED] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#E2E7ED]">
                    <h3 className="text-base font-semibold text-[#242A31]">
                        Sales Reports
                    </h3>
                    <p className="text-xs text-[#74808C] mt-1">
                        Customer quotation status and accepted quotation values.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="bg-[#354C63]">
                                {[
                                    'Quotation No.',
                                    'Enquiry No.',
                                    'Customer',
                                    'Shipment Mode',
                                    'Quotation Date',
                                    'Selling Price',
                                    'Status',
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="px-5 py-3 text-xs font-semibold text-white uppercase tracking-wide whitespace-nowrap"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E2E7ED]">
                            {customerQuotations.length > 0 ? (
                                customerQuotations.map((quote, index) => (
                                    <tr
                                        key={quote.quotation_no || quote.id || index}
                                        className="odd:bg-white even:bg-[#F7F9FB] hover:bg-[#EEF2F6] transition-colors"
                                    >
                                        <td className="px-5 py-4 font-semibold text-[#354C63] whitespace-nowrap">
                                            {quote.quotation_no || quote.id || '—'}
                                        </td>

                                        <td className="px-5 py-4 text-[#424B55] whitespace-nowrap">
                                            {quote.enquiry_no || quote.enquiry_id || '—'}
                                        </td>

                                        <td className="px-5 py-4 font-medium text-[#242A31]">
                                            {quote.customer_name || quote.customer || '—'}
                                        </td>

                                        <td className="px-5 py-4 text-[#424B55]">
                                            {quote.shipment_mode || quote.mode || 'Sea'}
                                        </td>

                                        <td className="px-5 py-4 text-[#424B55] whitespace-nowrap">
                                            {quote.quotation_date || quote.date || '—'}
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-[#16845B] whitespace-nowrap">
                                            {quote.selling_price != null
                                                ? `${quote.currency || 'USD'} ${Number(
                                                    quote.selling_price
                                                ).toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}`
                                                : '—'}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${quote.status === 'Accepted'
                                                        ? 'bg-[#E8F5EF] text-[#16845B]'
                                                        : quote.status === 'Rejected'
                                                            ? 'bg-[#FCEEEE] text-[#C45151]'
                                                            : quote.status === 'Sent'
                                                                ? 'bg-[#EDF2F7] text-[#354C63]'
                                                                : quote.status === 'Expired'
                                                                    ? 'bg-[#FBF2E2] text-[#A87525]'
                                                                    : 'bg-[#F1F4F7] text-[#74808C]'
                                                    }`}
                                            >
                                                {quote.status || '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-5 py-12 text-center text-[#74808C]"
                                    >
                                        No customer quotation records available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SalesReportTable;
