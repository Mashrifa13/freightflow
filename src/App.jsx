import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const handleToggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const handleNavigate = (pageId) => setActivePage(pageId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      {/* Main wrapper — offset by sidebar width */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '4rem' : '16rem' }}
      >
        {/* Sticky Header */}
        <Header sidebarCollapsed={sidebarCollapsed} />

        {/* Page Content */}
        <main className="flex-1 mt-16 p-6">
          {activePage === 'dashboard' && <DashboardPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
