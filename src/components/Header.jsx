
import React from 'react';
import { Bell, Search } from 'lucide-react';

function Header({ sidebarCollapsed, title = 'Dashboard' }) {
  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white border-b border-gray-200
      flex items-center px-6 z-30 transition-all duration-300"
      style={{ left: sidebarCollapsed ? '4rem' : '16rem' }}
    >
      {/* Left: Page Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-gray-800">
          {title}
        </h1>
      </div>

      {/* Right: Search, Notifications & Profile */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50
          border border-gray-200 rounded-lg px-3 py-2 w-64
          focus-within:border-blue-400 transition-all">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-700
            outline-none placeholder-gray-400 w-full"
          />
        </div>

        {/* Notifications */}
        <button
          id="notifications-btn"
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-lg flex items-center
          justify-center text-gray-500 hover:bg-gray-100
          hover:text-blue-600 transition-colors"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2
            rounded-full bg-red-500 border-2 border-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-blue-600
            flex items-center justify-center text-white
            font-semibold text-sm flex-shrink-0">
            PE
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              Pricing Executive
            </p>
            <p className="text-xs text-gray-400">
              Pricing Department
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;
