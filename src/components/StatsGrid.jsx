
import {
  FileText,
  Clock,
  Users,
  FileCheck,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const iconComponents = { FileText, Clock, Users, FileCheck };

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
  },
};

function StatCard({ stat }) {
  const IconComp = iconComponents[stat.iconName];
  const colors = colorMap[stat.color] || colorMap.blue;
  const isIncrease = stat.changeType === 'increase';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          {IconComp && <IconComp size={21} className={colors.icon} />}
        </div>

        {stat.change && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isIncrease
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-red-50 text-red-600'
            }`}>
            {isIncrease ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {stat.change}
          </span>
        )}
      </div>

      <div>
        <p className="text-3xl font-bold text-gray-800 leading-none">
          {stat.value}
        </p>
        <p className="text-sm font-medium text-gray-500 mt-1">
          {stat.label}
        </p>
      </div>

      <p className="text-xs text-gray-400 border-t border-gray-50 pt-3">
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
      value: rateRequests.filter((item) =>
        ['Pending', 'Sent', 'Pending Response'].includes(item.status)
      ).length,
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
