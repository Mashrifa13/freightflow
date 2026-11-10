
import React from 'react';

function QuotationReportTable({ quotations = [] }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#E2E7ED]">
                <h3 className="text-base font-semibold text-[#242A31]">
                    Quotation Reports
                </h3>
                <p className="text-xs text-[#74808C] mt-1">
                    Overview of quotations received from forwarding agents.
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-[#354C63]">
                            {[
                                'Quotation No.',
                                'RFQ Number',
                                'Agent Name',
                                'Quote Date',
                                'Validity Date',
                                'Buying Rate',
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
                        {quotations.length > 0 ? (
                            quotations.map((quote, index) => (
                                <tr
                                    key={quote.quotation_no || quote.id || index}
                                    className={`transition-colors hover:bg-[#EEF2F6] ${index % 2 === 0
                                            ? 'bg-white'
                                            : 'bg-[#F7F9FB]'
                                        }`}
                                >
                                    <td className="px-5 py-4 font-semibold text-[#354C63] whitespace-nowrap">
                                        {quote.quotation_no || quote.id || '—'}
                                    </td>

                                    <td className="px-5 py-4 text-[#424B55] whitespace-nowrap">
                                        {quote.rfq_no || quote.rfq_id || '—'}
                                    </td>

                                    <td className="px-5 py-4 font-medium text-[#242A31] whitespace-nowrap">
                                        {quote.agent_name || quote.agent || '—'}
                                    </td>

                                    <td className="px-5 py-4 text-[#424B55] whitespace-nowrap">
                                        {quote.quotation_date || quote.date || '—'}
                                    </td>

                                    <td className="px-5 py-4 text-[#424B55] whitespace-nowrap">
                                        {quote.validity_date || '—'}
                                    </td>

                                    <td className="px-5 py-4 font-semibold text-[#16845B] whitespace-nowrap">
                                        {quote.currency || 'USD'}{' '}
                                        {Number(quote.total_buying_rate || 0).toLocaleString(
                                            'en-US',
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </td>

                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EDF2F7] border border-[#D3DBE4] text-[#354C63] text-xs font-semibold">
                                            {quote.status || '—'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-5 py-12 text-center"
                                >
                                    <p className="text-sm font-medium text-[#424B55]">
                                        No quotation records available.
                                    </p>
                                    <p className="text-xs text-[#74808C] mt-1">
                                        Agent quotations will appear here when available.
                                    </p>
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
