
import React from 'react';

function QuotationReportTable({ quotations = [] }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-800">
                    Quotation Reports
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Overview of quotations received from forwarding agents.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Quotation No.
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                RFQ Number
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Agent Name
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Quote Date
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Validity Date
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Buying Rate
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {quotations.length > 0 ? (
                            quotations.map((quote, index) => (
                                <tr key={quote.quotation_no || quote.id || index}
                                    className="hover:bg-gray-50">
                                    <td className="px-5 py-4 font-semibold text-blue-700">
                                        {quote.quotation_no || quote.id || '—'}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">
                                        {quote.rfq_no || quote.rfq_id || '—'}
                                    </td>
                                    <td className="px-5 py-4 text-gray-800">
                                        {quote.agent_name || quote.agent || '—'}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">
                                        {quote.quotation_date || quote.date || '—'}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">
                                        {quote.validity_date || '—'}
                                    </td>
                                    <td className="px-5 py-4 font-semibold text-emerald-600">
                                        {quote.currency || 'USD'}{' '}
                                        {Number(quote.total_buying_rate || 0).toLocaleString(
                                            'en-US',
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-gray-700">
                                        {quote.status || '—'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                                    No quotation records available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QuotationReportTable;
