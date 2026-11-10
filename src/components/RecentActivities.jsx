
import {
  FileCheck,
  Send,
  CheckCircle,
  FilePlus,
  Activity,
} from 'lucide-react';

const activityIconMap = {
  FileCheck,
  Send,
  CheckCircle,
  FilePlus,
};

const activityColors = {
  quotation: {
    bg: 'bg-[#F0EAF5]',
    icon: 'text-[#806394]',
    dot: 'bg-[#806394]',
  },
  request: {
    bg: 'bg-[#FBF2E2]',
    icon: 'text-[#C28A35]',
    dot: 'bg-[#C28A35]',
  },
  completed: {
    bg: 'bg-[#E8F5EF]',
    icon: 'text-[#16845B]',
    dot: 'bg-[#16845B]',
  },
  generated: {
    bg: 'bg-[#EDF2F7]',
    icon: 'text-[#354C63]',
    dot: 'bg-[#647E96]',
  },
};

function formatRelativeTime(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return `${diffDays}d ago`;
}

function formatAbsoluteTime(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function ActivityItem({ activity, isLast }) {
  const IconComp = activityIconMap[activity.iconName] || FilePlus;
  const colors = activityColors[activity.type] || activityColors.generated;

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center mt-0.5`}
        >
          <IconComp size={16} className={colors.icon} />
        </div>

        {!isLast && (
          <div className="w-px flex-1 bg-[#E2E7ED] mt-2" />
        )}
      </div>

      <div className="flex-1 pb-5">
        <p className="text-sm text-[#424B55] font-medium leading-snug group-hover:text-[#242A31] transition-colors">
          {activity.description}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />

          <span className="text-xs text-[#74808C]">
            {formatAbsoluteTime(activity.timestamp)}
          </span>

          <span className="text-xs text-[#C5CDD5]">·</span>

          <span className="text-xs text-[#74808C]">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}

function RecentActivities({ activities = [] }) {
  const sortedActivities = [...activities]
    .filter((activity) => activity.timestamp)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E7ED]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EDF2F7] flex items-center justify-center">
            <Activity size={15} className="text-[#354C63]" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#242A31]">
              Recent Activities
            </h2>

            <p className="text-xs text-[#74808C]">
              Latest pricing operations
            </p>
          </div>
        </div>

        <span className="text-xs font-medium text-[#647E96] bg-[#F7F9FB] border border-[#E2E7ED] px-2.5 py-1 rounded-full">
          Latest 5
        </span>
      </div>

      {/* Activity List */}
      <div className="px-6 pt-5 pb-2">
        {sortedActivities.length > 0 ? (
          sortedActivities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isLast={index === sortedActivities.length - 1}
            />
          ))
        ) : (
          <p className="text-sm text-[#74808C] text-center py-8">
            No activities yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default RecentActivities;
