
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
  LogOut,
  ChevronLeft,
  LifeBuoy,
  ChevronRight,
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
  LifeBuoy,
  TrendingUp,
  Settings,
};

function Sidebar({ collapsed, onToggle, activePage, onNavigate, onLogout }) {
  const sidebarRef = useRef(null);

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
      className={`fixed top-0 left-0 h-screen flex flex-col z-40
        transition-[width] duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}`}
      style={{ backgroundColor: '#14243A' }}
    >
      {/* Logo */}
      <div
        className={`relative flex items-center h-[73px] border-b border-white/10 flex-shrink-0
          transition-all duration-300
          ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'}`}
      >
        <span
          className={`text-white font-bold text-lg tracking-tight whitespace-nowrap
            transition-all duration-300 ease-in-out
            ${collapsed
              ? 'opacity-0 -translate-x-3 w-0 overflow-hidden'
              : 'opacity-100 translate-x-0 w-auto'
            }`}
        >
          FreightFlow
        </span>

        {/* Optional collapsed logo */}
        <span
          className={`absolute left-1/2 -translate-x-1/2 text-white font-bold text-xl
            transition-all duration-300
            ${collapsed
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-75 pointer-events-none'
            }`}
        >
          F
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <p
          className={`text-xs font-semibold text-white/30 uppercase tracking-widest
            px-3 mb-2 whitespace-nowrap overflow-hidden
            transition-all duration-200
            ${collapsed
              ? 'opacity-0 h-0 mb-0'
              : 'opacity-100 h-auto'
            }`}
        >
          Main Menu
        </p>

        <ul className="space-y-1">
          {sidebarNavItems.map((item) => {
            const IconComp = iconComponents[item.iconName];
            const isActive = activePage === item.id;

            const isClickable = [
              'dashboard',
              'customers',
              'agents',
              'enquiries',
              'rate-requests',
              'agent-quotations',
              'rate-comparison',
              'pricing',
              'customer-quotations',
              'reports',
              'contact-support',
            ].includes(item.id);

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (isClickable) onNavigate(item.id);
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl py-2.5
  text-sm font-medium group transition-all duration-300 ease-in-out
  ${collapsed
                      ? 'justify-center px-0'
                      : 'justify-start gap-3 px-3'
                    }
  ${isActive
                      ? 'bg-[#354C63] text-white shadow-md'
                      : isClickable
                        ? 'text-white/60 hover:bg-white/10 hover:text-white cursor-pointer'
                        : 'text-white/40 cursor-default'
                    }`}
                >
                  {/* Icon */}
                  {IconComp && (
                    <span
                      className={`w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center
    transition-colors duration-300
    ${isActive
                          ? 'text-white'
                          : 'text-white/60 group-hover:text-white'
                        }`}
                    >
                      <IconComp size={18} />
                    </span>
                  )}

                  {/* Animated label */}
                  {!collapsed && (
                    <span className="flex-1 min-w-0 truncate text-left animate-in fade-in slide-in-from-left-2 duration-300">
                      {item.label}
                    </span>
                  )}

                  {/* Active indicator */}
                  {!collapsed && isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0" />
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
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl
            text-white/50 hover:text-white hover:bg-white/10
            transition-all duration-300 text-sm
            ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="transition-transform duration-300">
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </span>

          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300
              ${collapsed
                ? 'max-w-0 opacity-0'
                : 'max-w-20 opacity-100'
              }`}
          >
            Collapse
          </span>
        </button>
      </div>
      {/* Logout */}
      <div className="flex-shrink-0 px-3 pb-4">
        <button
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center py-2.5 rounded-xl
      text-sm font-medium text-red-300
      hover:bg-red-500/10 hover:text-red-200
      transition-all duration-300
      ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'}`}
        >
          <span className="w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center">
            <LogOut size={18} />
          </span>

          {!collapsed && (
            <span className="whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
