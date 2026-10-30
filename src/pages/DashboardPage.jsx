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

function DashboardPage() {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #14243A 0%, #1e3a5f 50%, #2563EB 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 right-20 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-4 right-32 w-16 h-16 rounded-full bg-blue-400/10" />

        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium">{today}</p>
              <h2 className="text-xl font-bold mt-1">Welcome back, Pricing Executive! 👋</h2>
              <p className="text-blue-100/70 text-sm mt-1">
                You have <span className="text-white font-semibold">24 pending rate requests</span> and{' '}
                <span className="text-white font-semibold">18 quotations</span> awaiting action.
              </p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Ship size={24} className="text-white" />
            </div>
          </div>

          {/* Quick insight pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <QuickInsightCard
              icon={TrendingUp}
              title="Revenue Pipeline"
              value="₹14.2L"
              sub="Active quotations value"
              color="bg-white/10 border-white/20 text-white"
            />
            <QuickInsightCard
              icon={AlertCircle}
              title="SLA Breaching"
              value="3 Enquiries"
              sub="Response due within 2 hrs"
              color="bg-orange-400/20 border-orange-400/30 text-orange-100"
            />
            <QuickInsightCard
              icon={Ship}
              title="Active Shipments"
              value="42 Lanes"
              sub="FCL · LCL · Air"
              color="bg-emerald-400/20 border-emerald-400/30 text-emerald-100"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsGrid />

      {/* Lower Section: Table + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Enquiry Table — takes 2/3 width on xl */}
        <div className="xl:col-span-2">
          <EnquiryTable />
        </div>

        {/* Recent Activities — takes 1/3 width on xl */}
        <div className="xl:col-span-1">
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
