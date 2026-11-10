
import React from 'react';

function PricingReportTable({ pricingList = [] }) {
    return (
        <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#E2E7ED]">
                <h3 className="text-base font-semibold text-[#242A31]">
                    Pricing Reports
                </h3>
                <p className="text-xs text-[#74808C] mt-1">
                    Overview of buying costs and customer selling prices.
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-[#354C63]">
                            {[
                                'Pricing ID',
                                'Enquiry Number',
                                'Customer',
                                'Shipment Mode',
                                'Buying Cost',
                                'Selling Price',
                                'Profit',
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
                        {pricingList.length > 0 ? (
                            pricingList.map((item, index) => {
                                const currency = item.currency || 'USD';
                                const buyingCost = Number(item.total_buying_cost);
                                const sellingPrice = Number(item.selling_price);

                                const hasAmounts =
                                    item.total_buying_cost != null &&
                                    item.selling_price != null &&
                                    Number.isFinite(buyingCost) &&
                                    Number.isFinite(sellingPrice);

                                const profit = hasAmounts
                                    ? sellingPrice - buyingCost
                                    : null;

                                const formatAmount = (amount) =>
                                    `${currency} ${amount.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`;

                                return (
                                    <tr
                                        key={item.pricing_id || item.id || index}
                                        className={`transition-colors hover:bg-[#EEF2F6] ${index % 2 === 0
                                                ? 'bg-white'
                                                : 'bg-[#F7F9FB]'
                                            }`}
                                    >
                                        <td className="px-5 py-4 font-semibold text-[#354C63] whitespace-nowrap">
                                            {item.pricing_id || item.id || '—'}
                                        </td>

                                        <td className="px-5 py-4 text-[#424B55] whitespace-nowrap">
                                            {item.enquiry_no || item.enquiry_id || '—'}
                                        </td>

                                        <td className="px-5 py-4 font-medium text-[#242A31] whitespace-nowrap">
                                            {item.customer_name || item.customer || '—'}
                                        </td>

                                        <td className="px-5 py-4 text-[#424B55] whitespace-nowrap">
                                            {item.shipment_mode || item.mode || 'Sea'}
                                        </td>

                                        <td className="px-5 py-4 text-[#424B55] whitespace-nowrap">
                                            {hasAmounts ? formatAmount(buyingCost) : '—'}
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-[#16845B] whitespace-nowrap">
                                            {hasAmounts ? formatAmount(sellingPrice) : '—'}
                                        </td>

                                        <td
                                            className={`px-5 py-4 font-semibold whitespace-nowrap ${profit != null && profit >= 0
                                                    ? 'text-[#16845B]'
                                                    : 'text-[#C45151]'
                                                }`}
                                        >
                                            {profit != null ? formatAmount(profit) : '—'}
                                        </td>

                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EDF2F7] border border-[#D3DBE4] text-[#354C63] text-xs font-semibold">
                                                {item.status || '—'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-5 py-12 text-center"
                                >
                                    <p className="text-sm font-medium text-[#424B55]">
                                        No pricing records available.
                                    </p>
                                    <p className="text-xs text-[#74808C] mt-1">
                                        Pricing records will appear here when available.
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

export default PricingReportTable;
