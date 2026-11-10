
import React from 'react';
import { Bell, Search } from 'lucide-react';

function Header({ sidebarCollapsed, title = 'Dashboard' }) {
  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white border-b border-[#E2E7ED]
      flex items-center px-6 z-30 transition-all duration-300"
      style={{ left: sidebarCollapsed ? '4rem' : '16rem' }}
    >
      {/* Left: Page Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-[#242A31]">
          {title}
        </h1>
      </div>

      {/* Right: Search, Notifications & Profile */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 bg-[#F7F9FB]
          border border-[#D3DBE4] rounded-lg px-3 py-2 w-64
          focus-within:border-[#647E96] transition-all"
        >
          <Search size={16} className="text-[#74808C]" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-[#242A31]
            outline-none placeholder:text-[#9AA4AE] w-full"
          />
        </div>

        {/* Notifications */}
        <button
          id="notifications-btn"
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-lg flex items-center
          justify-center text-[#74808C] hover:bg-[#EDF2F7]
          hover:text-[#354C63] transition-colors"
        >
          <Bell size={19} />

          <span
            className="absolute top-1.5 right-1.5 w-2 h-2
            rounded-full bg-[#C45151] border-2 border-white"
          />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#E2E7ED]">
          <div
            className="w-9 h-9 rounded-full bg-[#354C63]
            flex items-center justify-center text-white
            font-semibold text-sm flex-shrink-0"
          >
            PE
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#242A31]">
              Pricing Executive
            </p>

            <p className="text-xs text-[#74808C]">
              Pricing Department
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;
