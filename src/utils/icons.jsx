import {
  LayoutDashboard,
  Users,
  UserCircle,
  FileText,
  ClipboardList,
  FileCheck,
  BarChart2,
  Tag,
  FilePlus,
  TrendingUp,
  Settings,
  Clock,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Users,
  UserCircle,
  FileText,
  ClipboardList,
  FileCheck,
  BarChart2,
  Tag,
  FilePlus,
  TrendingUp,
  Settings,
  Clock,
};

export function getIcon(name, props = {}) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
}

export default iconMap;
