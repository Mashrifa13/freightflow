
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
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm text-gray-500">Accepted Quotations</p>
                    <h3 className="text-2xl font-bold text-emerald-600 mt-2">
                        {acceptedCount}
                    </h3>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-sm text-gray-500">Accepted Quotation Value</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-2">
                        {totalSalesValue.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Sum of accepted selling prices; currencies are not converted.
                    </p>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800">
                        Sales Reports
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Customer quotation status and accepted quotation values.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Quotation No.</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Enquiry No.</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Shipment Mode</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Quotation Date</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Selling Price</th>
                                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {customerQuotations.length > 0 ? (
                                customerQuotations.map((quote, index) => (
                                    <tr
                                        key={quote.quotation_no || quote.id || index}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4 font-semibold text-blue-700">
                                            {quote.quotation_no || quote.id || '—'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {quote.enquiry_no || quote.enquiry_id || '—'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-800">
                                            {quote.customer_name || quote.customer || '—'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {quote.shipment_mode || quote.mode || 'Sea'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {quote.quotation_date || quote.date || '—'}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-emerald-600">
                                            {quote.selling_price != null
                                                ? `${quote.currency || 'USD'} ${Number(
                                                    quote.selling_price
                                                ).toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}`
                                                : '—'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-700">
                                            {quote.status || '—'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
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
