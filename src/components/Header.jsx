import { Bell, Search } from 'lucide-react';

function Header({ sidebarCollapsed }) {
  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center px-6 z-30 transition-all duration-300 shadow-sm`}
      style={{ left: sidebarCollapsed ? '4rem' : '16rem' }}
    >
      {/* Left: Page Title & Breadcrumb */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-gray-800 leading-tight">Dashboard</h1>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
          <span>Home</span>
          <span>/</span>
          <span className="text-blue-600 font-medium">Dashboard</span>
        </nav>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-64 mx-4 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
        <Search size={15} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search enquiries, customers..."
          className="bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400 w-full"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <button
          id="notifications-btn"
          className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
          <div
            id="user-avatar"
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0"
          >
            PE
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">Pricing Executive</p>
            <p className="text-xs text-gray-400 leading-tight">Pricing Department</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
