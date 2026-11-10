
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

    const inputClass =
        "w-full bg-[#F7F9FB] border border-[#E2E7ED] rounded-lg px-3 py-2 text-sm text-[#242A31] outline-none transition-all focus:border-[#647E96] focus:ring-2 focus:ring-[#647E96]/15";

    const labelClass =
        "block text-xs font-semibold text-[#424B55] mb-1.5";

    return (
        <div className="bg-white p-5 rounded-2xl border border-[#E2E7ED] shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-base font-semibold text-[#242A31]">
                        Report Filters
                    </h2>
                    <p className="text-xs text-[#74808C] mt-1">
                        Filter report data using the options below.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-[#354C63] hover:text-[#647E96] transition-colors cursor-pointer"
                >
                    Reset Filters
                </button>
            </div>

            {/* Filter Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

                {/* From Date */}
                <div>
                    <label className={labelClass}>
                        From Date
                    </label>
                    <input
                        type="date"
                        name="fromDate"
                        value={filters.fromDate}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* To Date */}
                <div>
                    <label className={labelClass}>
                        To Date
                    </label>
                    <input
                        type="date"
                        name="toDate"
                        value={filters.toDate}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Customer */}
                <div>
                    <label className={labelClass}>
                        Customer
                    </label>
                    <select
                        name="customer"
                        value={filters.customer}
                        onChange={handleChange}
                        className={inputClass}
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

                {/* Agent */}
                <div>
                    <label className={labelClass}>
                        Agent
                    </label>
                    <select
                        name="agent"
                        value={filters.agent}
                        onChange={handleChange}
                        className={inputClass}
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

                {/* Shipment Mode */}
                <div>
                    <label className={labelClass}>
                        Shipment Mode
                    </label>
                    <select
                        name="shipmentMode"
                        value={filters.shipmentMode}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="">All Modes</option>
                        <option value="Air">Air</option>
                        <option value="Sea">Sea</option>
                        <option value="Land">Land</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className={labelClass}>
                        Status
                    </label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                        className={inputClass}
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
