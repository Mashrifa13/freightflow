import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import CustomerList from './pages/CustomerList';
import AddCustomerPage from './pages/AddCustomerPage';
import AgentList from './pages/AgentList';
import AddAgentPage from './pages/AddAgentPage';
import EnquiryList from './pages/EnquiryList';
import EnquiryFormPage from './pages/EnquiryFormPage';
import { enquiriesData as initialEnquiriesData } from './data/dashboardData';

// Rate Request (RFQ) Modules
import RateRequestList from './pages/RateRequestList';
import RateRequestForm from './pages/RateRequestForm';
import RateRequestDetails from './pages/RateRequestDetails';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Default to 'dashboard' so the home dashboard opens when the app loads
  const [activePage, setActivePage] = useState('dashboard');

  // ── Customer Management state ──────────────────────────────────────────────
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // ── Agent Management state ─────────────────────────────────────────────────
  const [agents, setAgents] = useState([]);
  const [editingAgent, setEditingAgent] = useState(null);

  // ── Enquiry Management state ───────────────────────────────────────────────
  const [enquiries, setEnquiries] = useState(initialEnquiriesData);
  const [editingEnquiry, setEditingEnquiry] = useState(null);

  // ── Rate Request (RFQ) Management state ────────────────────────────────────
  const [rateRequests, setRateRequests] = useState([]);
  const [editingRateRequest, setEditingRateRequest] = useState(null);
  const [viewingRateRequest, setViewingRateRequest] = useState(null);

  // ── Sidebar toggle ─────────────────────────────────────────────────────────
  const handleToggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  // ── Global navigate: clears stale editing state ───────────────────────────
  const handleNavigate = (pageId) => {
    if (pageId !== 'add-customer' && pageId !== 'edit-customer') {
      setEditingCustomer(null);
    }
    if (pageId !== 'add-agent' && pageId !== 'edit-agent') {
      setEditingAgent(null);
    }
    if (pageId !== 'create-enquiry' && pageId !== 'edit-enquiry') {
      setEditingEnquiry(null);
    }
    if (pageId !== 'create-rate-request' && pageId !== 'edit-rate-request' && pageId !== 'rate-request-details') {
      setEditingRateRequest(null);
      setViewingRateRequest(null);
    }
    setActivePage(pageId);
  };

  // ── Customer handlers ──────────────────────────────────────────────────────
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
      }
      return [savedCustomer, ...prev];
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

  // ── Agent handlers ─────────────────────────────────────────────────────────
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
      }
      return [savedAgent, ...prev];
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

  // ── Enquiry handlers ───────────────────────────────────────────────────────
  const handleStartEditEnquiry = (enquiry) => {
    setEditingEnquiry(enquiry);
    setActivePage('edit-enquiry');
  };

  const handleEnquirySaved = (savedEnquiry) => {
    setEnquiries((prev) => {
      const existingIndex = prev.findIndex(
        (e) =>
          (e.id && e.id === savedEnquiry.id) ||
          (e.enquiry_no && e.enquiry_no === savedEnquiry.enquiry_no)
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = savedEnquiry;
        return updated;
      }
      return [savedEnquiry, ...prev];
    });
    setEditingEnquiry(null);
    setActivePage('enquiries');
  };

  const handleCancelEnquiryForm = () => {
    setEditingEnquiry(null);
    setActivePage('enquiries');
  };

  // ── Rate Request (RFQ) Handlers ───────────────────────────────────────────
  const handleNavigateToCreateRateRequest = () => {
    setEditingRateRequest(null);
    setActivePage('create-rate-request');
  };

  const handleStartEditRateRequest = (rateRequest) => {
    setEditingRateRequest(rateRequest);
    setActivePage('edit-rate-request');
  };

  const handleViewRateRequest = (rateRequest) => {
    setViewingRateRequest(rateRequest);
    setActivePage('rate-request-details');
  };

  const handleRateRequestSaved = (savedRequest) => {
    setRateRequests((prev) => {
      const existingIndex = prev.findIndex(
        (r) =>
          (r.rfq_no && r.rfq_no === savedRequest.rfq_no) ||
          (r.id && r.id === savedRequest.id)
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = savedRequest;
        return updated;
      }
      return [savedRequest, ...prev];
    });
    setEditingRateRequest(null);
    setActivePage('rate-requests');
  };

  const handleCancelRateRequestForm = () => {
    setEditingRateRequest(null);
    setActivePage('rate-requests');
  };

  // ── Page meta (header title + breadcrumbs) ────────────────────────────────
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
    'edit-enquiry': {
      title: 'Edit Enquiry',
      breadcrumbs: [
        'Home',
        'Enquiries',
        editingEnquiry?.id || editingEnquiry?.enquiry_no || 'Edit Enquiry',
      ],
    },
    'rate-requests': {
      title: 'Rate Request Management',
      breadcrumbs: ['Home', 'Rate Requests'],
    },
    'create-rate-request': {
      title: 'Create Rate Request',
      breadcrumbs: ['Home', 'Rate Requests', 'New RFQ'],
    },
    'edit-rate-request': {
      title: 'Edit Rate Request',
      breadcrumbs: [
        'Home',
        'Rate Requests',
        editingRateRequest?.rfq_no || editingRateRequest?.id || 'Edit RFQ',
      ],
    },
    'rate-request-details': {
      title: 'Rate Request Details',
      breadcrumbs: [
        'Home',
        'Rate Requests',
        viewingRateRequest?.rfq_no || viewingRateRequest?.id || 'Details',
      ],
    },
  };

  const currentMeta = pageMeta[activePage] || {
    title: 'Dashboard',
    breadcrumbs: ['Home', 'Dashboard'],
  };

  // ── Sidebar active item (maps sub-pages back to parent) ───────────────────
  let sidebarActiveItem = activePage;
  if (activePage === 'add-customer' || activePage === 'edit-customer') {
    sidebarActiveItem = 'customers';
  } else if (activePage === 'add-agent' || activePage === 'edit-agent') {
    sidebarActiveItem = 'agents';
  } else if (activePage === 'create-enquiry' || activePage === 'edit-enquiry') {
    sidebarActiveItem = 'enquiries';
  } else if (
    activePage === 'rate-requests' ||
    activePage === 'create-rate-request' ||
    activePage === 'edit-rate-request' ||
    activePage === 'rate-request-details'
  ) {
    sidebarActiveItem = 'rate-requests';
  }

  // ── Render ─────────────────────────────────────────────────────────────────
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

          {/* ── Customers ──────────────────────────────────────────────────── */}
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

          {/* ── Agents ─────────────────────────────────────────────────────── */}
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

          {/* ── Enquiries ──────────────────────────────────────────────────── */}
          {activePage === 'enquiries' && (
            <EnquiryList
              enquiries={enquiries}
              setEnquiries={setEnquiries}
              onCreateEnquiry={() => setActivePage('create-enquiry')}
              onEditEnquiry={handleStartEditEnquiry}
            />
          )}
          {(activePage === 'create-enquiry' || activePage === 'edit-enquiry') && (
            <EnquiryFormPage
              initialData={editingEnquiry}
              customers={customers}
              onNavigateToList={handleCancelEnquiryForm}
              onEnquirySaved={handleEnquirySaved}
            />
          )}

          {/* ── Rate Request (RFQ) Section ─────────────────────────────────── */}
          {activePage === 'rate-requests' && (
            <RateRequestList
              rateRequests={rateRequests}
              onCreateRateRequest={handleNavigateToCreateRateRequest}
              onViewRateRequest={handleViewRateRequest}
              onEditRateRequest={handleStartEditRateRequest}
            />
          )}
          {(activePage === 'create-rate-request' || activePage === 'edit-rate-request') && (
            <RateRequestForm
              initialData={editingRateRequest}
              enquiries={enquiries}
              agents={agents}
              onCancel={handleCancelRateRequestForm}
              onSave={handleRateRequestSaved}
            />
          )}
          {activePage === 'rate-request-details' && (
            <RateRequestDetails
              rateRequest={viewingRateRequest}
              onBack={() => setActivePage('rate-requests')}
              onEdit={handleStartEditRateRequest}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
