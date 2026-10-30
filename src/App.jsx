import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CustomerList from './pages/CustomerList';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('customers');

  const handleToggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const handleNavigate = (pageId) => setActivePage(pageId);

  // Dynamic header meta based on active page
  const pageMeta = {
    dashboard: {
      title: 'Dashboard',
      breadcrumbs: ['Home', 'Dashboard'],
    },
    customers: {
      title: 'Customer Management',
      breadcrumbs: ['Home', 'Customers'],
    },
    'add-customer': {
      title: 'Add Customer',
      breadcrumbs: ['Home', 'Customers', 'New Customer'],
    },
  };

  const currentMeta = pageMeta[activePage] || {
    title: 'Dashboard',
    breadcrumbs: ['Home', 'Dashboard'],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        activePage={activePage === 'add-customer' ? 'customers' : activePage}
        onNavigate={handleNavigate}
      />

      {/* Main wrapper — offset by sidebar width */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '4rem' : '16rem' }}
      >
        {/* Sticky Header */}
        <Header
          sidebarCollapsed={sidebarCollapsed}
          title={currentMeta.title}
          breadcrumbs={currentMeta.breadcrumbs}
        />

        {/* Page Content */}
        <main className="flex-1 mt-16 p-6">
          {activePage === 'dashboard' && <DashboardPage />}
          {activePage === 'customers' && (
            <CustomerList onNavigateToAddCustomer={() => setActivePage('add-customer')} />
          )}
          {activePage === 'add-customer' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-lg mx-auto">
              <h3 className="text-lg font-semibold text-gray-800">Add Customer Form</h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">
                This route placeholder is prepared for Step 2 of the customer module.
              </p>
              <button
                type="button"
                onClick={() => setActivePage('customers')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all cursor-pointer"
              >
                Back to Customer List
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
