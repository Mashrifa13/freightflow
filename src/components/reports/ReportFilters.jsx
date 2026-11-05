
import React from 'react';

function ReportFilters({
    filters,
    setFilters,
    customers = [],
    agents = [],
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReset = () => {
        setFilters({
            fromDate: '',
            toDate: '',
            customer: '',
            agent: '',
            shipmentMode: '',
            status: '',
        });
    };

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-800">
                    Report Filters
                </h2>

                <button
                    type="button"
                    onClick={handleReset}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Reset Filters
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        From Date
                    </label>
                    <input
                        type="date"
                        name="fromDate"
                        value={filters.fromDate}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        To Date
                    </label>
                    <input
                        type="date"
                        name="toDate"
                        value={filters.toDate}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Customer
                    </label>
                    <select
                        name="customer"
                        value={filters.customer}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">All Customers</option>
                        {customers.map((customer) => (
                            <option
                                key={customer.id || customer.customer_id || customer.customer_code}
                                value={customer.customer_name || customer.customerName || customer.name}
                            >
                                {customer.customer_name || customer.customerName || customer.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Agent
                    </label>
                    <select
                        name="agent"
                        value={filters.agent}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">All Agents</option>
                        {agents.map((agent) => (
                            <option
                                key={agent.id || agent.agent_id || agent.agent_code}
                                value={agent.agent_name || agent.agentName || agent.name}
                            >
                                {agent.agent_name || agent.agentName || agent.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Shipment Mode
                    </label>
                    <select
                        name="shipmentMode"
                        value={filters.shipmentMode}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
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
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
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
