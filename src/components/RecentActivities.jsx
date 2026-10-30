import { FileCheck, Send, CheckCircle, FilePlus, Activity } from 'lucide-react';
import { recentActivities } from '../data/dashboardData';

const activityIconMap = { FileCheck, Send, CheckCircle, FilePlus };

const activityColors = {
  quotation: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    dot: 'bg-purple-500',
  },
  request: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    dot: 'bg-orange-500',
  },
  completed: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    dot: 'bg-emerald-500',
  },
  generated: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    dot: 'bg-blue-500',
  },
};

function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatAbsoluteTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function ActivityItem({ activity, isLast }) {
  const IconComp = activityIconMap[activity.iconName];
  const colors = activityColors[activity.type] || activityColors.generated;

  return (
    <div className="flex gap-4 group">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center mt-0.5`}
        >
          {IconComp && <IconComp size={16} className={colors.icon} />}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gray-100 mt-2 mb-0" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-5 ${isLast ? '' : ''}`}>
        <p className="text-sm text-gray-700 font-medium leading-snug group-hover:text-gray-900 transition-colors">
          {activity.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          <span className="text-xs text-gray-400">{formatAbsoluteTime(activity.timestamp)}</span>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">{formatRelativeTime(activity.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

function RecentActivities() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Activity size={15} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800">Recent Activities</h2>
            <p className="text-xs text-gray-400">Latest pricing operations</p>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
          Today
        </span>
      </div>

      {/* Activity Feed */}
      <div className="px-6 pt-5 pb-2">
        {recentActivities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isLast={index === recentActivities.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export default RecentActivities;
