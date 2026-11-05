import React from 'react';
import { useState } from 'react';
import {
    FileText,
    Users,
    FileCheck,
    TrendingUp,
} from 'lucide-react';

import ReportCard from '../components/reports/ReportCard';
import ReportFilters from '../components/reports/ReportFilters';
import ReportTabs from '../components/reports/ReportTabs';
import EnquiryReportTable from '../components/reports/EnquiryReportTable';
import AgentPerformanceReport from '../components/reports/AgentPerformanceReport';
import QuotationReportTable from '../components/reports/QuotationReportTable';
import PricingReportTable from '../components/reports/PricingReportTable';
import SalesReportTable from '../components/reports/SalesReportTable';

function Reports({
    enquiries = [],
    rateRequests = [],
    quotations = [],
    pricingList = [],
    customerQuotations = [],
}) {
    const [activeTab, setActiveTab] = useState('Enquiry Reports');
    // Summary card calculations
    const totalEnquiries = enquiries.length;

    const totalCustomerQuotations = customerQuotations.length;

    const acceptedQuotations = customerQuotations.filter(
        (quotation) => quotation.status === 'Accepted'
    ).length;

    // Calculate expected profit from pricing records
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
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Reports
                </h1>
                <p className="text-sm text-gray-500">
                    View business performance and analytics.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <ReportFilters />
            <ReportTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {activeTab === 'Enquiry Reports' && (
                <EnquiryReportTable enquiries={enquiries} />
            )}

            {activeTab === 'Agent Performance' && (
                <AgentPerformanceReport
                    rateRequests={rateRequests}
                    quotations={quotations}
                />
            )}

            {activeTab === 'Quotation Reports' && (
                <QuotationReportTable quotations={quotations} />
            )}

            {activeTab === 'Pricing Reports' && (
                <PricingReportTable pricingList={pricingList} />
            )}

            {activeTab === 'Sales Reports' && (
                <SalesReportTable customerQuotations={customerQuotations} />
            )}
        </div>
    );
}

export default Reports;