import React from 'react';

function ReportFilters() {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
                Report Filters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        From Date
                    </label>
                    <input
                        type="date"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        To Date
                    </label>
                    <input
                        type="date"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Customer
                    </label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option value="">All Customers</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Agent
                    </label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option value="">All Agents</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Shipment Mode
                    </label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option value="">All Modes</option>
                        <option value="Air">Air</option>
                        <option value="Sea">Sea</option>
                        <option value="Land">Land</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Status
                    </label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option value="">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Expired">Expired</option>
                    </select>
                </div>

            </div>
        </div>
    );
}

export default ReportFilters;