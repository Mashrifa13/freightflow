import {
  FileText,
  Clock,
  Users,
  FileCheck,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { statsData } from '../data/dashboardData';

const iconComponents = { FileText, Clock, Users, FileCheck };

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    ring: 'bg-blue-100',
    badge: 'bg-blue-600',
    border: 'border-blue-100',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    ring: 'bg-orange-100',
    badge: 'bg-orange-500',
    border: 'border-orange-100',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    ring: 'bg-emerald-100',
    badge: 'bg-emerald-500',
    border: 'border-emerald-100',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    ring: 'bg-purple-100',
    badge: 'bg-purple-500',
    border: 'border-purple-100',
  },
};

function StatCard({ stat }) {
  const IconComp = iconComponents[stat.iconName];
  const colors = colorMap[stat.color] || colorMap.blue;
  const isIncrease = stat.changeType === 'increase';

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col gap-4`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}
        >
          {IconComp && <IconComp size={21} className={colors.icon} />}
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isIncrease
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {isIncrease ? (
            <TrendingUp size={11} />
          ) : (
            <TrendingDown size={11} />
          )}
          {stat.change}
        </span>
      </div>

      {/* Number & Label */}
      <div>
        <p className="text-3xl font-bold text-gray-800 leading-none">{stat.value}</p>
        <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 border-t border-gray-50 pt-3">{stat.comparison}</p>
    </div>
  );
}

function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statsData.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

export default StatsGrid;
