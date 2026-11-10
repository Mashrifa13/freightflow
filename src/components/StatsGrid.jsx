
import {
  FileText,
  Clock,
  Users,
  FileCheck,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const iconComponents = {
  FileText,
  Clock,
  Users,
  FileCheck,
};

const colorMap = {
  blue: {
    bg: 'bg-[#EDF2F7]',
    icon: 'text-[#354C63]',
  },
  orange: {
    bg: 'bg-[#FBF2E2]',
    icon: 'text-[#C28A35]',
  },
  green: {
    bg: 'bg-[#E8F5EF]',
    icon: 'text-[#16845B]',
  },
  purple: {
    bg: 'bg-[#F0EAF5]',
    icon: 'text-[#806394]',
  },
};

function StatCard({ stat }) {
  const IconComp = iconComponents[stat.iconName];
  const colors = colorMap[stat.color] || colorMap.blue;
  const isIncrease = stat.changeType === 'increase';

  return (
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col gap-4">

      <div className="flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}
        >
          {IconComp && (
            <IconComp size={21} className={colors.icon} />
          )}
        </div>

        {stat.change && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isIncrease
                ? 'bg-[#E8F5EF] text-[#16845B]'
                : 'bg-[#FCEEEE] text-[#C45151]'
              }`}
          >
            {isIncrease ? (
              <TrendingUp size={11} />
            ) : (
              <TrendingDown size={11} />
            )}
            {stat.change}
          </span>
        )}
      </div>

      <div>
        <p className="text-3xl font-bold text-[#242A31] leading-none">
          {stat.value}
        </p>

        <p className="text-sm font-medium text-[#596673] mt-1">
          {stat.label}
        </p>
      </div>

      <p className="text-xs text-[#74808C] border-t border-[#E2E7ED] pt-3">
        {stat.comparison}
      </p>
    </div>
  );
}

function StatsGrid({
  enquiries = [],
  rateRequests = [],
  quotations = [],
  customerQuotations = [],
}) {
  const stats = [
    {
      id: 1,
      label: 'Total Enquiries',
      value: enquiries.length,
      iconName: 'FileText',
      color: 'blue',
      comparison: 'All enquiries',
    },

    {
      id: 2,
      label: 'Pending Rate Requests',
      value: rateRequests.filter((item) => {
        // Only count RFQs that have been sent
        if (item.status === 'Draft' || item.status === 'Cancelled') {
          return false;
        }

        // Check whether any selected agent is still pending
        const agents = item.agents || [];

        return agents.some(
          (agent) =>
            !['Quoted', 'Received'].includes(agent.response_status)
        );
      }).length,
      iconName: 'Clock',
      color: 'orange',
      comparison: 'Awaiting agent response',
    },

    {
      id: 3,
      label: 'Agent Responses',
      value: quotations.length,
      iconName: 'Users',
      color: 'green',
      comparison: 'Agent quotations received',
    },

    {
      id: 4,
      label: 'Pending Quotations',
      value: customerQuotations.filter((item) =>
        ['Draft', 'Sent'].includes(item.status)
      ).length,
      iconName: 'FileCheck',
      color: 'purple',
      comparison: 'Awaiting customer decision',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

export default StatsGrid;
