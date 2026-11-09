import StatsGrid from '../components/StatsGrid';
import EnquiryTable from '../components/EnquiryTable';
import RecentActivities from '../components/RecentActivities';
import { Ship, TrendingUp, AlertCircle } from 'lucide-react';

function QuickInsightCard({ icon: Icon, title, value, sub, color }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${color}`}>
      <div className="flex-shrink-0 mt-0.5">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{title}</p>
        <p className="text-lg font-bold mt-0.5 leading-tight">{value}</p>
        <p className="text-xs opacity-60 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}


function buildRecentActivities({
  enquiries,
  rateRequests,
  quotations,
  customerQuotations,
}) {
  const activities = [];

  const addActivity = (id, description, type, iconName, timestamp) => {
    if (!timestamp || Number.isNaN(new Date(timestamp).getTime())) return;

    activities.push({
      id: `${id}-${timestamp}-${type}`,
      description,
      type,
      iconName,
      timestamp,
    });
  };

  // Enquiries created
  enquiries.forEach((enquiry) => {
    addActivity(
      `enquiry-${enquiry.id || enquiry.enquiry_no}`,
      `New enquiry created: ${enquiry.enquiry_no || enquiry.id}`,
      'generated',
      'FilePlus',
      enquiry.created_at
    );
  });

  // Rate requests sent
  rateRequests.forEach((rfq) => {
    if (rfq.status !== 'Draft') {
      addActivity(
        `rfq-${rfq.id || rfq.rfq_no}`,
        `Rate request sent: ${rfq.rfq_no || rfq.id}`,
        'request',
        'Send',
        rfq.created_at
      );
    }
  });

  // Agent quotations received and reviewed
  quotations.forEach((quote) => {
    const reference = quote.quotation_no || quote.id;

    addActivity(
      `agent-quote-${quote.id}`,
      `Agent quotation received: ${reference}`,
      'quotation',
      'FileCheck',
      quote.created_at
    );

    if (
      quote.status === 'Accepted' ||
      quote.status === 'Rejected'
    ) {
      if (
        quote.updated_at &&
        quote.updated_at !== quote.created_at
      ) {
        addActivity(
          `agent-quote-status-${quote.id}`,
          `Agent quotation ${quote.status.toLowerCase()}: ${reference}`,
          quote.status === 'Accepted' ? 'completed' : 'request',
          'CheckCircle',
          quote.updated_at
        );
      }
    }
  });

  // Customer quotations created and their latest decisions
  customerQuotations.forEach((quote) => {
    const reference = quote.quotation_no || quote.id;

    addActivity(
      `customer-quote-${quote.id}`,
      `Customer quotation generated: ${reference}`,
      'generated',
      'FilePlus',
      quote.created_at
    );

    if (
      (quote.status === 'Accepted' || quote.status === 'Rejected') &&
      quote.updated_at &&
      quote.updated_at !== quote.created_at
    ) {
      addActivity(
        `customer-quote-status-${quote.id}`,
        `Customer quotation ${quote.status.toLowerCase()}: ${reference}`,
        quote.status === 'Accepted' ? 'completed' : 'request',
        'CheckCircle',
        quote.updated_at
      );
    }
  });

  return activities.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}


function DashboardPage({
  enquiries = [],
  rateRequests = [],
  quotations = [],
  customerQuotations = [],
  pricingList = [],
  onNavigateToEnquiries,
}) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const activities = buildRecentActivities({
    enquiries,
    rateRequests,
    quotations,
    customerQuotations,
  });

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}

      {/* Dashboard Page Heading */}
      {/* Dashboard Page Heading */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back!
          </p>
        </div>

        {/* Pricing Executive Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-blue-600
      flex items-center justify-center text-white
      font-semibold text-sm flex-shrink-0">
            PE
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Pricing Executive
            </p>
            <p className="text-xs text-gray-400">
              {today}
            </p>
          </div>
        </div>
      </div>


      {/* Stats Cards */}
      <StatsGrid
        enquiries={enquiries}
        rateRequests={rateRequests}
        quotations={quotations}
        customerQuotations={customerQuotations}
      />

      {/* Lower Section: Table + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Enquiry Table — takes 2/3 width on xl */}
        <div className="xl:col-span-2">
          <EnquiryTable
            enquiries={enquiries}
            onViewAll={onNavigateToEnquiries}
          />
        </div>

        {/* Recent Activities — takes 1/3 width on xl */}
        <div className="xl:col-span-1">
          <RecentActivities activities={activities} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
