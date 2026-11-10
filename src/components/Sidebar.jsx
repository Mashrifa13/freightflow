
import React, { useEffect, useRef } from 'react';

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
  LogOut,
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

function Sidebar({ collapsed, onToggle, activePage, onNavigate, onLogout }) {
  const sidebarRef = useRef(null);

  // Collapse sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !collapsed
      ) {
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [collapsed, onToggle]);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-64'
        }`}
      style={{ backgroundColor: '#100F0E' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-white/10 flex-shrink-0">
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-white font-bold text-xl leading-none tracking-tight">
              FreightFlow
            </span>

            <p className="text-[10px] text-white/40 tracking-[2px] mt-1.5 uppercase">
              Pricing Management
            </p>
          </div>
        )}

        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-[#354C63] flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">F</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-3">

        {!collapsed && (
          <p className="text-[10px] font-semibold text-white/35 uppercase tracking-[1.8px] px-3 mb-3">
            Main Menu
          </p>
        )}

        <ul className="space-y-1.5">
          {sidebarNavItems.map((item) => {
            const IconComp = iconComponents[item.iconName];
            const isActive = activePage === item.id;

            const isClickable =
              item.id === 'dashboard' ||
              item.id === 'customers' ||
              item.id === 'agents' ||
              item.id === 'enquiries' ||
              item.id === 'rate-requests' ||
              item.id === 'agent-quotations' ||
              item.id === 'rate-comparison' ||
              item.id === 'pricing' ||
              item.id === 'customer-quotations' ||
              item.id === 'reports';

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (isClickable) {
                      onNavigate(item.id);
                    }
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                      ? 'bg-[#354C63] text-white shadow-sm'
                      : isClickable
                        ? 'text-white/65 hover:bg-white/10 hover:text-white cursor-pointer'
                        : 'text-white/40 cursor-default'
                    } ${collapsed ? 'justify-center' : ''}`}
                >
                  {IconComp && (
                    <span
                      className={`flex-shrink-0 transition-colors ${isActive
                          ? 'text-white'
                          : 'text-white/55 group-hover:text-white'
                        }`}
                    >
                      <IconComp size={18} strokeWidth={1.8} />
                    </span>
                  )}

                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}

                  {!collapsed && isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="flex-shrink-0 p-3 border-t border-white/10 space-y-2">

        {/* Logout */}
        <button
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${collapsed ? 'justify-center' : ''
            }`}
        >
          <LogOut size={18} strokeWidth={1.8} />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm ${collapsed ? 'justify-center' : ''
            }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}

          {!collapsed && (
            <span className="text-xs font-medium">Collapse sidebar</span>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
