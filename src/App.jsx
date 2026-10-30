import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CustomerList from './pages/CustomerList';
import AddCustomerPage from './pages/AddCustomerPage';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleToggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const handleNavigate = (pageId) => {
    if (pageId !== 'add-customer' && pageId !== 'edit-customer') {
      setEditingCustomer(null);
    }
    setActivePage(pageId);
  };

  const handleNavigateToAddCustomer = () => {
    setEditingCustomer(null);
    setActivePage('add-customer');
  };

  const handleStartEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setActivePage('edit-customer');
  };

  const handleCustomerSaved = (savedCustomer) => {
    setCustomers((prev) => {
      const existingIndex = prev.findIndex(
        (c) =>
          (c.customer_code && c.customer_code === savedCustomer.customer_code) ||
          (c.customer_id && c.customer_id === savedCustomer.customer_id) ||
          (c.id && c.id === savedCustomer.id)
      );

      if (existingIndex >= 0) {
        // Update existing record
        const updated = [...prev];
        updated[existingIndex] = savedCustomer;
        return updated;
      } else {
        // Add new record at beginning
        return [savedCustomer, ...prev];
      }
    });

    setEditingCustomer(null);
    setActivePage('customers');
  };

  const handleDeleteCustomer = (customerToDelete) => {
    setCustomers((prev) =>
      prev.filter(
        (c) =>
          (c.customer_code && c.customer_code !== customerToDelete.customer_code) ||
          (c.customer_id && c.customer_id !== customerToDelete.customer_id) ||
          (c.id && c.id !== customerToDelete.id)
      )
    );
  };

  const handleCancelForm = () => {
    setEditingCustomer(null);
    setActivePage('customers');
  };

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
    'edit-customer': {
      title: 'Edit Customer',
      breadcrumbs: [
        'Home',
        'Customers',
        editingCustomer?.name || editingCustomer?.customer_name || 'Edit Customer',
      ],
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
        activePage={
          activePage === 'add-customer' || activePage === 'edit-customer'
            ? 'customers'
            : activePage
        }
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
            <CustomerList
              customers={customers}
              setCustomers={setCustomers}
              onNavigateToAddCustomer={handleNavigateToAddCustomer}
              onEditCustomer={handleStartEditCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}
          {(activePage === 'add-customer' || activePage === 'edit-customer') && (
            <AddCustomerPage
              initialData={editingCustomer}
              onNavigateToList={handleCancelForm}
              onCustomerSaved={handleCustomerSaved}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
