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
  ChevronLeft,
  ChevronRight,
  Package2,
} from 'lucide-react';
import { sidebarNavItems } from '../data/dashboardData';

const iconComponents = {
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
};

function Sidebar({ collapsed, onToggle, activePage, onNavigate }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ backgroundColor: '#14243A' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 flex-shrink-0">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
          <Package2 size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-white font-bold text-lg leading-none tracking-tight">FreightFlow</span>
            <p className="text-blue-300 text-xs mt-0.5 font-medium">Logistics Suite</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {!collapsed && (
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest px-3 mb-2">
            Main Menu
          </p>
        )}
        <ul className="space-y-1">
          {sidebarNavItems.map((item) => {
            const IconComp = iconComponents[item.iconName];
            const isActive = activePage === item.id;
            const isClickable = item.id === 'dashboard';

            return (
              <li key={item.id}>
                <button
                  onClick={() => isClickable && onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : isClickable
                      ? 'text-white/60 hover:bg-white/10 hover:text-white cursor-pointer'
                      : 'text-white/40 cursor-default'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  {IconComp && (
                    <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                      <IconComp size={18} />
                    </span>
                  )}
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {!collapsed && isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="flex-shrink-0 p-3 border-t border-white/10">
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150 text-sm ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-xs font-medium">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
