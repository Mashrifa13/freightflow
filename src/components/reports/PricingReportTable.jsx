
import React from 'react';

function PricingReportTable({ pricingList = [] }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-800">
                    Pricing Reports
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Overview of buying costs and customer selling prices.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Pricing ID</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Enquiry Number</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Shipment Mode</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Buying Cost</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Selling Price</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Profit</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
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
                                    <tr key={item.pricing_id || item.id || index}
                                        className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-semibold text-blue-700">
                                            {item.pricing_id || item.id || '—'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {item.enquiry_no || item.enquiry_id || '—'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-800">
                                            {item.customer_name || item.customer || '—'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {item.shipment_mode || item.mode || 'Sea'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-700">
                                            {hasAmounts ? formatAmount(buyingCost) : '—'}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-emerald-600">
                                            {hasAmounts ? formatAmount(sellingPrice) : '—'}
                                        </td>
                                        <td className={`px-5 py-4 font-semibold ${profit != null && profit >= 0
                                            ? 'text-emerald-600'
                                            : 'text-rose-600'
                                            }`}>
                                            {profit != null ? formatAmount(profit) : '—'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-700">
                                            {item.status || '—'}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                                    No pricing records available.
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
