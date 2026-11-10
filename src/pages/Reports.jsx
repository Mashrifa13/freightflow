
import React, { useState } from 'react';
import {
    FileText,
    Users,
    FileCheck,
    TrendingUp,
    FileBarChart
} from 'lucide-react';

import ReportCard from '../components/reports/ReportCard';
import ReportFilters from '../components/reports/ReportFilters';
import ReportTabs from '../components/reports/ReportTabs';
import EnquiryReportTable from '../components/reports/EnquiryReportTable';
import AgentPerformanceReport from '../components/reports/AgentPerformanceReport';
import QuotationReportTable from '../components/reports/QuotationReportTable';
import PricingReportTable from '../components/reports/PricingReportTable';
import SalesReportTable from '../components/reports/SalesReportTable';

const initialFilters = {
    fromDate: '',
    toDate: '',
    customer: '',
    agent: '',
    shipmentMode: '',
    status: '',
};

const getValue = (item, fields) => {
    for (const field of fields) {
        if (item?.[field] !== undefined && item?.[field] !== null) {
            return item[field];
        }
    }
    return '';
};

function filterRecords(records, filters) {
    return records.filter((item) => {
        const customer = String(getValue(item, [
            'customer',
            'customer_name',
            'customer_id',
            'customer_code'
        ]));

        const agent = String(getValue(item, [
            'agent',
            'agent_name',
            'agent_id',
            'agent_code',
            'assigned_agent'
        ]));

        const mode = String(getValue(item, [
            'shipment_mode',
            'mode'
        ]));

        const status = String(getValue(item, ['status']));

        const date = String(getValue(item, [
            'enquiry_date',
            'quotation_date',
            'pricing_date',
            'date',
            'created_at'
        ])).slice(0, 10);

        if (filters.customer && customer !== filters.customer) {
            return false;
        }

        if (filters.agent && agent !== filters.agent) {
            return false;
        }

        if (
            filters.shipmentMode &&
            mode.toLowerCase() !== filters.shipmentMode.toLowerCase()
        ) {
            return false;
        }

        if (
            filters.status &&
            status.toLowerCase() !== filters.status.toLowerCase()
        ) {
            return false;
        }

        if (filters.fromDate && (!date || date < filters.fromDate)) {
            return false;
        }

        if (filters.toDate && (!date || date > filters.toDate)) {
            return false;
        }

        return true;
    });
}

function Reports({
    enquiries = [],
    rateRequests = [],
    quotations = [],
    pricingList = [],
    customerQuotations = [],
    customers = [],
    agents = [],
}) {
    const [activeTab, setActiveTab] = useState('Enquiry Reports');
    const [filters, setFilters] = useState(initialFilters);

    // Filter report data
    const filteredEnquiries = filterRecords(enquiries, filters);
    const filteredRateRequests = filterRecords(rateRequests, filters);
    const filteredQuotations = filterRecords(quotations, filters);
    const filteredPricing = filterRecords(pricingList, filters);
    const filteredCustomerQuotations = filterRecords(
        customerQuotations,
        filters
    );

    // Summary calculations
    const totalEnquiries = enquiries.length;
    const totalCustomerQuotations = customerQuotations.length;

    const acceptedQuotations = customerQuotations.filter(
        (quotation) => quotation.status === 'Accepted'
    ).length;

    const profitRecords = pricingList.filter(
        (item) =>
            item.selling_price !== '' &&
            item.selling_price != null &&
            item.total_buying_cost !== '' &&
            item.total_buying_cost != null &&
            Number.isFinite(Number(item.selling_price)) &&
            Number.isFinite(Number(item.total_buying_cost))
    );

    const currencies = [
        ...new Set(profitRecords.map((item) => item.currency || 'USD')),
    ];

    const totalExpectedProfit = profitRecords.reduce(
        (total, item) =>
            total +
            (Number(item.selling_price) - Number(item.total_buying_cost)),
        0
    );

    const expectedProfit =
        profitRecords.length === 0
            ? '—'
            : currencies.length > 1
                ? 'Multiple currencies'
                : `${currencies[0]} ${totalExpectedProfit.toFixed(2)}`;

    return (
        <div className="space-y-6">

            {/* Page Heading */}
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#242A31] tracking-tight flex items-center gap-2">
                        <FileBarChart className="text-[#354C63]" size={24} />
                        Reports & Analytics
                    </h2>

                    <p className="text-xs text-[#74808C] mt-0.5">
                        View business performance and operational reports.
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <ReportCard
                    title="Total Enquiries"
                    value={totalEnquiries}
                    icon={FileText}
                />

                <ReportCard
                    title="Customer Quotations"
                    value={totalCustomerQuotations}
                    icon={FileCheck}
                />

                <ReportCard
                    title="Accepted Quotations"
                    value={acceptedQuotations}
                    icon={Users}
                />

                <ReportCard
                    title="Expected Profit"
                    value={expectedProfit}
                    icon={TrendingUp}
                />
            </div>

            {/* Report Filters */}
            <div className="bg-white border border-[#E2E7ED] rounded-xl shadow-sm overflow-hidden">



                <ReportFilters
                    filters={filters}
                    setFilters={setFilters}
                    customers={customers}
                    agents={agents}
                />

            </div>

            {/* Report Tabs and Content */}
            <div className="bg-white border border-[#E2E7ED] rounded-xl shadow-sm overflow-hidden">

                <div className="px-4 pt-4 border-b border-[#E2E7ED]">
                    <ReportTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>

                <div className="p-4">
                    {activeTab === 'Enquiry Reports' && (
                        <EnquiryReportTable
                            enquiries={filteredEnquiries}
                        />
                    )}

                    {activeTab === 'Agent Performance' && (
                        <AgentPerformanceReport
                            rateRequests={filteredRateRequests}
                            quotations={filteredQuotations}
                        />
                    )}

                    {activeTab === 'Quotation Reports' && (
                        <QuotationReportTable
                            quotations={filteredQuotations}
                        />
                    )}

                    {activeTab === 'Pricing Reports' && (
                        <PricingReportTable
                            pricingList={filteredPricing}
                        />
                    )}

                    {activeTab === 'Sales Reports' && (
                        <SalesReportTable
                            customerQuotations={filteredCustomerQuotations}
                        />
                    )}
                </div>
            </div>

        </div>
    );
}

export default Reports;
