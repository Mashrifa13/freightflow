import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CustomerList from './pages/CustomerList';
import AddCustomerPage from './pages/AddCustomerPage';
import AgentList from './pages/AgentList';
import AddAgentPage from './pages/AddAgentPage';
import EnquiryList from './pages/EnquiryList';
import { enquiriesData as initialEnquiriesData } from './data/dashboardData';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Default to 'dashboard' so the home dashboard opens when the app loads
  const [activePage, setActivePage] = useState('dashboard');

  // Customer Management state
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Agent Management state
  const [agents, setAgents] = useState([]);
  const [editingAgent, setEditingAgent] = useState(null);

  // Enquiry Management state
  const [enquiries, setEnquiries] = useState(initialEnquiriesData);

  const handleToggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const handleNavigate = (pageId) => {
    if (pageId !== 'add-customer' && pageId !== 'edit-customer') {
      setEditingCustomer(null);
    }
    if (pageId !== 'add-agent' && pageId !== 'edit-agent') {
      setEditingAgent(null);
    }
    setActivePage(pageId);
  };

  // Customer handlers
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
        const updated = [...prev];
        updated[existingIndex] = savedCustomer;
        return updated;
      } else {
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

  const handleCancelCustomerForm = () => {
    setEditingCustomer(null);
    setActivePage('customers');
  };

  // Agent handlers
  const handleNavigateToAddAgent = () => {
    setEditingAgent(null);
    setActivePage('add-agent');
  };

  const handleStartEditAgent = (agent) => {
    setEditingAgent(agent);
    setActivePage('edit-agent');
  };

  const handleAgentSaved = (savedAgent) => {
    setAgents((prev) => {
      const existingIndex = prev.findIndex(
        (a) =>
          (a.agent_code && a.agent_code === savedAgent.agent_code) ||
          (a.agent_id && a.agent_id === savedAgent.agent_id) ||
          (a.id && a.id === savedAgent.id)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = savedAgent;
        return updated;
      } else {
        return [savedAgent, ...prev];
      }
    });

    setEditingAgent(null);
    setActivePage('agents');
  };

  const handleDeleteAgent = (agentToDelete) => {
    setAgents((prev) =>
      prev.filter(
        (a) =>
          (a.agent_code && a.agent_code !== agentToDelete.agent_code) ||
          (a.agent_id && a.agent_id !== agentToDelete.agent_id) ||
          (a.id && a.id !== agentToDelete.id)
      )
    );
  };

  const handleCancelAgentForm = () => {
    setEditingAgent(null);
    setActivePage('agents');
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
    agents: {
      title: 'Agent Management',
      breadcrumbs: ['Home', 'Agents'],
    },
    'add-agent': {
      title: 'Add Agent',
      breadcrumbs: ['Home', 'Agents', 'New Agent'],
    },
    'edit-agent': {
      title: 'Edit Agent',
      breadcrumbs: [
        'Home',
        'Agents',
        editingAgent?.name || editingAgent?.agent_name || 'Edit Agent',
      ],
    },
    enquiries: {
      title: 'Freight Enquiries',
      breadcrumbs: ['Home', 'Enquiries'],
    },
    'create-enquiry': {
      title: 'Create Enquiry',
      breadcrumbs: ['Home', 'Enquiries', 'New Enquiry'],
    },
  };

  const currentMeta = pageMeta[activePage] || {
    title: 'Dashboard',
    breadcrumbs: ['Home', 'Dashboard'],
  };

  // Determine active sidebar item
  let sidebarActiveItem = activePage;
  if (activePage === 'add-customer' || activePage === 'edit-customer') {
    sidebarActiveItem = 'customers';
  } else if (activePage === 'add-agent' || activePage === 'edit-agent') {
    sidebarActiveItem = 'agents';
  } else if (activePage === 'create-enquiry') {
    sidebarActiveItem = 'enquiries';
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        activePage={sidebarActiveItem}
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
          {activePage === 'dashboard' && (
            <DashboardPage onNavigateToEnquiries={() => setActivePage('enquiries')} />
          )}

          {/* Customers Section */}
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
              onNavigateToList={handleCancelCustomerForm}
              onCustomerSaved={handleCustomerSaved}
            />
          )}

          {/* Agents Section */}
          {activePage === 'agents' && (
            <AgentList
              agents={agents}
              setAgents={setAgents}
              onNavigateToAddAgent={handleNavigateToAddAgent}
              onEditAgent={handleStartEditAgent}
              onDeleteAgent={handleDeleteAgent}
            />
          )}
          {(activePage === 'add-agent' || activePage === 'edit-agent') && (
            <AddAgentPage
              initialData={editingAgent}
              onNavigateToList={handleCancelAgentForm}
              onAgentSaved={handleAgentSaved}
            />
          )}

          {/* Enquiries Section */}
          {activePage === 'enquiries' && (
            <EnquiryList
              enquiries={enquiries}
              setEnquiries={setEnquiries}
              onCreateEnquiry={() => setActivePage('create-enquiry')}
            />
          )}
          {activePage === 'create-enquiry' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">+</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Create Freight Enquiry</h3>
              <p className="text-xs text-gray-500 mt-2 mb-6">
                This route placeholder is prepared for the next step when the Enquiry Form is developed.
              </p>
              <button
                type="button"
                onClick={() => setActivePage('enquiries')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Back to Enquiry List
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
