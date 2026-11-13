import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import CustomerList from './pages/CustomerList';
import AddCustomerPage from './pages/AddCustomerPage';
import AgentList from './pages/AgentList';
import AddAgentPage from './pages/AddAgentPage';
import EnquiryList from './pages/EnquiryList';
import EnquiryFormPage from './pages/EnquiryFormPage';
import { enquiriesData as initialEnquiriesData } from './data/dashboardData';
import Reports from './pages/Reports';
import ContactSupport from './components/ContactSupport';
import ProfilePage from './pages/ProfilePage';

// Storage utility
import { loadFromLocalStorage, saveToLocalStorage } from './utils/storage';

// Rate Request (RFQ) Modules
import RateRequestList from './pages/RateRequestList';
import RateRequestForm from './pages/RateRequestForm';
import RateRequestDetails from './pages/RateRequestDetails';

// Agent Quotation Modules
import AgentQuotationList from './pages/AgentQuotationList';
import AgentQuotationForm from './pages/AgentQuotationForm';
import AgentQuotationDetails from './pages/AgentQuotationDetails';

// Rate Comparison Modules
import RateComparisonList from './pages/RateComparisonList';
import RateComparisonForm from './pages/RateComparisonForm';
import RateComparisonDetails from './pages/RateComparisonDetails';

// Pricing Modules
import PricingList from './pages/PricingList';
import PricingForm from './pages/PricingForm';
import PricingDetails from './pages/PricingDetails';

// Customer Quotation Modules
import CustomerQuotationList from './pages/CustomerQuotationList';
import CustomerQuotationForm from './pages/CustomerQuotationForm';
import CustomerQuotationDetails from './pages/CustomerQuotationDetails';


import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthContext';


const generateEnquiryId = (enquiries = []) => {
  const year = new Date().getFullYear();

  const lastNumber = enquiries.reduce((max, enquiry) => {
    const existingId =
      enquiry.enquiry_no ||
      enquiry.enquiry_id ||
      enquiry.id ||
      '';

    const match = String(existingId).match(
      new RegExp(`^ENQ-${year}-(\\d+)$`, 'i')
    );

    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  return `ENQ-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
};

const generateRfqId = (rateRequests = []) => {
  const year = new Date().getFullYear();

  const lastNumber = rateRequests.reduce((max, request) => {
    const existingId =
      request.rfq_no ||
      request.rfq_id ||
      request.id ||
      '';

    const match = String(existingId).match(
      new RegExp(`^RFQ-${year}-(\\d+)$`, 'i')
    );

    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  return `RFQ-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
};

function App() {
  const { isAuthenticated, login, logout } = useAuth();

  const [currentUser, setCurrentUser] = useState({
    name: 'Alex',
    employeeId: 'FF-0042',
    designation: 'Pricing Executive',
    email: 'pricing.executive@company.com',
    role: 'Pricing Executive',
    department: 'Pricing',
    branch: 'India',
    manager: 'Pricing Manager',
    status: 'Active',
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Default to 'dashboard' so the home dashboard opens when the app loads
  const [activePage, setActivePage] = useState('dashboard');

  // ── Customer Management state ──────────────────────────────────────────────
  const [customers, setCustomers] = useState(() =>
    loadFromLocalStorage('ff_customers', [])
  );
  const [editingCustomer, setEditingCustomer] = useState(null);

  // ── Agent Management state ─────────────────────────────────────────────────
  const [agents, setAgents] = useState(() =>
    loadFromLocalStorage('ff_agents', [])
  );
  const [editingAgent, setEditingAgent] = useState(null);

  // ── Enquiry Management state ───────────────────────────────────────────────
  const [enquiries, setEnquiries] = useState(() =>
    loadFromLocalStorage('ff_enquiries', initialEnquiriesData)
  );
  const [editingEnquiry, setEditingEnquiry] = useState(null);

  // ── Rate Request (RFQ) Management state ────────────────────────────────────
  const [rateRequests, setRateRequests] = useState(() =>
    loadFromLocalStorage('ff_rate_requests', [])
  );
  const [editingRateRequest, setEditingRateRequest] = useState(null);
  const [viewingRateRequest, setViewingRateRequest] = useState(null);

  // ── Agent Quotations state ────────────────────────────────────────────────
  const [quotations, setQuotations] = useState(() =>
    loadFromLocalStorage('ff_agent_quotations', [])
  );
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [viewingQuotation, setViewingQuotation] = useState(null);

  // ── Rate Comparison state ─────────────────────────────────────────────────
  const [comparisons, setComparisons] = useState(() =>
    loadFromLocalStorage('ff_rate_comparisons', [])
  );
  const [editingComparison, setEditingComparison] = useState(null);
  const [viewingComparison, setViewingComparison] = useState(null);

  // ── Pricing Management state ──────────────────────────────────────────────
  const [pricingList, setPricingList] = useState(() =>
    loadFromLocalStorage('ff_pricing_list', [])
  );
  const [editingPricing, setEditingPricing] = useState(null);
  const [viewingPricing, setViewingPricing] = useState(null);

  // ── Customer Quotations state ──────────────────────────────────────────
  const [customerQuotations, setCustomerQuotations] = useState(() =>
    loadFromLocalStorage('ff_customer_quotations', [])
  );
  const [editingCustomerQuotation, setEditingCustomerQuotation] = useState(null);
  const [viewingCustomerQuotation, setViewingCustomerQuotation] = useState(null);

  // ── LocalStorage Synchronizers ─────────────────────────────────────────────
  useEffect(() => {
    saveToLocalStorage('ff_customers', customers);
  }, [customers]);

  useEffect(() => {
    saveToLocalStorage('ff_agents', agents);
  }, [agents]);

  useEffect(() => {
    saveToLocalStorage('ff_enquiries', enquiries);
  }, [enquiries]);

  useEffect(() => {
    saveToLocalStorage('ff_rate_requests', rateRequests);
  }, [rateRequests]);

  useEffect(() => {
    saveToLocalStorage('ff_agent_quotations', quotations);
  }, [quotations]);

  useEffect(() => {
    saveToLocalStorage('ff_rate_comparisons', comparisons);
  }, [comparisons]);

  useEffect(() => {
    saveToLocalStorage('ff_pricing_list', pricingList);
  }, [pricingList]);

  useEffect(() => {
    saveToLocalStorage('ff_customer_quotations', customerQuotations);
  }, [customerQuotations]);

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
    if (pageId !== 'add-agent-quotation' && pageId !== 'edit-agent-quotation' && pageId !== 'agent-quotation-details') {
      setEditingQuotation(null);
      setViewingQuotation(null);
    }
    if (pageId !== 'create-rate-comparison' && pageId !== 'edit-rate-comparison' && pageId !== 'rate-comparison-details') {
      setEditingComparison(null);
      setViewingComparison(null);
    }
    if (pageId !== 'create-pricing' && pageId !== 'edit-pricing' && pageId !== 'pricing-details') {
      setEditingPricing(null);
      setViewingPricing(null);
    }
    if (pageId !== 'create-customer-quotation' && pageId !== 'edit-customer-quotation' && pageId !== 'customer-quotation-details') {
      setEditingCustomerQuotation(null);
      setViewingCustomerQuotation(null);
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
    const existingId =
      savedEnquiry.enquiry_no ||
      savedEnquiry.enquiry_id ||
      savedEnquiry.id;

    // Generate a sequential ID only for new enquiries
    const enquiryCode =
      existingId || generateEnquiryId(enquiries);

    const updatedEnquiry = {
      ...savedEnquiry,
      id: enquiryCode,
      enquiry_id: enquiryCode,
      enquiry_no: enquiryCode,
    };

    setEnquiries((prev) => {
      const existingIndex = prev.findIndex(
        (e) =>
          (e.id && e.id === existingId) ||
          (e.enquiry_no && e.enquiry_no === existingId)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedEnquiry;
        return updated;
      }

      return [updatedEnquiry, ...prev];
    });

    setEditingEnquiry(null);
    setActivePage('enquiries');
  };

  const handleCancelEnquiryForm = () => {
    setEditingEnquiry(null);
    setActivePage('enquiries');
  };

  const handleEnquiryStatusChange = (enquiryId, newStatus) => {
    setEnquiries((prev) =>
      prev.map((enq) =>
        enq.id === enquiryId || enq.enquiry_no === enquiryId
          ? { ...enq, status: newStatus }
          : enq
      )
    );
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

  // ── Agent Quotation Handlers ──────────────────────────────────────────────
  const handleNavigateToAddQuotation = () => {
    setEditingQuotation(null);
    setActivePage('add-agent-quotation');
  };

  const handleStartEditQuotation = (quotation) => {
    setEditingQuotation(quotation);
    setActivePage('edit-agent-quotation');
  };

  const handleViewQuotation = (quotation) => {
    setViewingQuotation(quotation);
    setActivePage('agent-quotation-details');
  };

  const handleQuotationSaved = (savedQuote) => {
    setQuotations((prev) => {
      const existingId =
        savedQuote.quotation_no ||
        savedQuote.id;

      // Editing an existing quotation
      if (existingId) {
        const existingIndex = prev.findIndex(
          (q) =>
            q.quotation_no === existingId ||
            q.id === existingId
        );

        const updatedQuote = {
          ...savedQuote,
          id: existingId,
          quotation_no: existingId,
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = updatedQuote;
          return updated;
        }

        return [updatedQuote, ...prev];
      }

      // Generate sequential ID for a new quotation
      const year = new Date().getFullYear();

      const lastNumber = prev.reduce((max, quotation) => {
        const id = quotation.quotation_no || quotation.id || '';

        const match = String(id).match(
          new RegExp(`^QUO-${year}-(\\d+)$`, 'i')
        );

        return match
          ? Math.max(max, Number(match[1]))
          : max;
      }, 0);

      const newId = `QUO-${year}-${String(lastNumber + 1).padStart(3, '0')}`;

      const newQuote = {
        ...savedQuote,
        id: newId,
        quotation_no: newId,
      };

      return [newQuote, ...prev];
    });
    setEditingQuotation(null);
    setActivePage('agent-quotations');
  };

  const handleCancelQuotationForm = () => {
    setEditingQuotation(null);
    setActivePage('agent-quotations');
  };

  // ── Rate Comparison Handlers ──────────────────────────────────────────────
  const handleNavigateToCreateComparison = (prefill = null) => {
    setEditingComparison(prefill);
    setActivePage('create-rate-comparison');
  };

  const handleStartEditComparison = (comparison) => {
    setEditingComparison(comparison);
    setActivePage('edit-rate-comparison');
  };

  const handleViewComparison = (comparison) => {
    setViewingComparison(comparison);
    setActivePage('rate-comparison-details');
  };

  const handleComparisonSaved = (savedComparison) => {
    setComparisons((prev) => {
      const existingId =
        savedComparison.comparison_id ||
        savedComparison.id;

      // Preserve existing ID when editing
      if (existingId) {
        const existingIndex = prev.findIndex(
          (c) =>
            c.comparison_id === existingId ||
            c.id === existingId
        );

        const updatedComparison = {
          ...savedComparison,
          id: existingId,
          comparison_id: existingId,
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = updatedComparison;
          return updated;
        }

        return [updatedComparison, ...prev];
      }

      // Check if a comparison already exists for this enquiry (one comparison per enquiry)
      const existingEnquiryCompIndex = prev.findIndex(
        (c) =>
          savedComparison.enquiry_id &&
          (c.enquiry_id === savedComparison.enquiry_id ||
            c.enquiry_no === savedComparison.enquiry_id ||
            c.enquiry_no === savedComparison.enquiry_no)
      );

      if (existingEnquiryCompIndex >= 0) {
        const targetId =
          prev[existingEnquiryCompIndex].comparison_id ||
          prev[existingEnquiryCompIndex].id;
        const updated = [...prev];
        updated[existingEnquiryCompIndex] = {
          ...savedComparison,
          id: targetId,
          comparison_id: targetId,
        };
        return updated;
      }

      // Generate sequential ID for a new comparison
      const year = new Date().getFullYear();

      const lastNumber = prev.reduce((max, comparison) => {
        const id =
          comparison.comparison_id ||
          comparison.id ||
          '';

        const match = String(id).match(
          new RegExp(`^CMP-${year}-(\\d+)$`, 'i')
        );

        return match
          ? Math.max(max, Number(match[1]))
          : max;
      }, 0);

      const newId = `CMP-${year}-${String(lastNumber + 1).padStart(3, '0')}`;

      return [
        {
          ...savedComparison,
          id: newId,
          comparison_id: newId,
        },
        ...prev,
      ];
    });

    setEditingComparison(null);
    setActivePage('rate-comparison');
  };

  const handleCancelComparisonForm = () => {
    setEditingComparison(null);
    setActivePage('rate-comparison');
  };

  // ── Pricing Handlers ──────────────────────────────────────────────────────
  const handleNavigateToCreatePricing = () => {
    setEditingPricing(null);
    setActivePage('create-pricing');
  };

  const handleStartEditPricing = (pricing) => {
    setEditingPricing(pricing);
    setActivePage('edit-pricing');
  };

  const handleViewPricing = (pricing) => {
    setViewingPricing(pricing);
    setActivePage('pricing-details');
  };

  const handlePricingSaved = (savedPricing) => {
    setPricingList((prev) => {
      const existingId =
        savedPricing.pricing_id ||
        savedPricing.id;

      // Preserve existing ID when editing
      if (existingId) {
        const existingIndex = prev.findIndex(
          (p) =>
            p.pricing_id === existingId ||
            p.id === existingId
        );

        const updatedPricing = {
          ...savedPricing,
          id: existingId,
          pricing_id: existingId,
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = updatedPricing;
          return updated;
        }

        return [updatedPricing, ...prev];
      }

      // Generate sequential ID for new pricing
      const year = new Date().getFullYear();

      const lastNumber = prev.reduce((max, pricing) => {
        const id = pricing.pricing_id || pricing.id || '';

        const match = String(id).match(
          new RegExp(`^PRC-${year}-(\\d+)$`, 'i')
        );

        return match
          ? Math.max(max, Number(match[1]))
          : max;
      }, 0);

      const newId = `PRC-${year}-${String(lastNumber + 1).padStart(3, '0')}`;

      return [
        {
          ...savedPricing,
          id: newId,
          pricing_id: newId,
        },
        ...prev,
      ];
    });

    setEditingPricing(null);
    setActivePage('pricing');
  };

  const handleCancelPricingForm = () => {
    setEditingPricing(null);
    setActivePage('pricing');
  };

  // ── Customer Quotation Handlers ──────────────────────────────────────────
  const handleNavigateToCreateCustomerQuotation = () => {
    setEditingCustomerQuotation(null);
    setActivePage('create-customer-quotation');
  };

  const handleStartEditCustomerQuotation = (quotation) => {
    setEditingCustomerQuotation(quotation);
    setActivePage('edit-customer-quotation');
  };

  const handleViewCustomerQuotation = (quotation) => {
    setViewingCustomerQuotation(quotation);
    setActivePage('customer-quotation-details');
  };



  const handleCustomerQuotationSaved = (savedQuote) => {
    let updatedQuote = savedQuote;

    setCustomerQuotations((prev) => {
      const existingId =
        savedQuote.quotation_no ||
        savedQuote.id;

      // Preserve ID when editing
      if (existingId) {
        const existingIndex = prev.findIndex(
          (q) =>
            q.quotation_no === existingId ||
            q.id === existingId
        );

        updatedQuote = {
          ...savedQuote,
          id: existingId,
          quotation_no: existingId,
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = updatedQuote;
          return updated;
        }

        return [updatedQuote, ...prev];
      }

      // Generate sequential ID for new customer quotation
      const year = new Date().getFullYear();

      const lastNumber = prev.reduce((max, quotation) => {
        const id = quotation.quotation_no || quotation.id || '';

        const match = String(id).match(
          new RegExp(`^QTN-${year}-(\\d+)$`, 'i')
        );

        return match
          ? Math.max(max, Number(match[1]))
          : max;
      }, 0);

      const newId = `QTN-${year}-${String(lastNumber + 1).padStart(3, '0')}`;

      updatedQuote = {
        ...savedQuote,
        id: newId,
        quotation_no: newId,
      };

      return [updatedQuote, ...prev];
    });

    // Update linked enquiry status
    if (savedQuote.enquiry_id || savedQuote.enquiry_no) {
      const enquiryStatus =
        savedQuote.status === 'Accepted'
          ? 'Completed'
          : savedQuote.status === 'Rejected'
            ? 'Rejected'
            : 'Quoted';

      setEnquiries((prev) =>
        prev.map((enq) =>
          enq.id === savedQuote.enquiry_id ||
            enq.enquiry_no === savedQuote.enquiry_id ||
            enq.enquiry_no === savedQuote.enquiry_no
            ? { ...enq, status: enquiryStatus }
            : enq
        )
      );
    }

    setEditingCustomerQuotation(null);
    setActivePage('customer-quotations');
  };



  const handleDeleteCustomerQuotation = (quoteToDelete) => {
    setCustomerQuotations((prev) =>
      prev.filter(
        (q) =>
          (q.quotation_no && q.quotation_no !== quoteToDelete.quotation_no) ||
          (q.id && q.id !== quoteToDelete.id)
      )
    );
  };

  const handleCancelCustomerQuotationForm = () => {
    setEditingCustomerQuotation(null);
    setActivePage('customer-quotations');
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
    'agent-quotations': {
      title: 'Agent Quotations',
      breadcrumbs: ['Home', 'Agent Quotations'],
    },
    'add-agent-quotation': {
      title: 'Add Agent Quotation',
      breadcrumbs: ['Home', 'Agent Quotations', 'New Quotation'],
    },
    'edit-agent-quotation': {
      title: 'Edit Agent Quotation',
      breadcrumbs: [
        'Home',
        'Agent Quotations',
        editingQuotation?.quotation_no || editingQuotation?.id || 'Edit Quotation',
      ],
    },
    'agent-quotation-details': {
      title: 'Quotation Details',
      breadcrumbs: [
        'Home',
        'Agent Quotations',
        viewingQuotation?.quotation_no || viewingQuotation?.id || 'Details',
      ],
    },
    'rate-comparison': {
      title: 'Rate Comparison',
      breadcrumbs: ['Home', 'Rate Requests (RFQ)', 'Rate Comparison'],
    },
    'create-rate-comparison': {
      title: 'Create Rate Comparison',
      breadcrumbs: ['Home', 'Rate Requests (RFQ)', 'Rate Comparison', 'New Comparison'],
    },
    'edit-rate-comparison': {
      title: 'Edit Rate Comparison',
      breadcrumbs: [
        'Home',
        'Rate Requests (RFQ)',
        'Rate Comparison',
        editingComparison?.comparison_id || editingComparison?.id || 'Edit Comparison',
      ],
    },
    'rate-comparison-details': {
      title: 'Comparison Details',
      breadcrumbs: [
        'Home',
        'Rate Requests (RFQ)',
        'Rate Comparison',
        viewingComparison?.comparison_id || viewingComparison?.id || 'Details',
      ],
    },
    pricing: {
      title: 'Pricing Management',
      breadcrumbs: ['Home', 'Pricing'],
    },
    'create-pricing': {
      title: 'Create Pricing',
      breadcrumbs: ['Home', 'Pricing', 'New Pricing'],
    },
    'edit-pricing': {
      title: 'Edit Pricing',
      breadcrumbs: [
        'Home',
        'Pricing',
        editingPricing?.pricing_id || editingPricing?.id || 'Edit Pricing',
      ],
    },
    'pricing-details': {
      title: 'Pricing Details',
      breadcrumbs: [
        'Home',
        'Pricing',
        viewingPricing?.pricing_id || viewingPricing?.id || 'Details',
      ],
    },
    'customer-quotations': {
      title: 'Customer Quotations',
      breadcrumbs: ['Home', 'Customer Quotations'],
    },
    'create-customer-quotation': {
      title: 'Create Customer Quotation',
      breadcrumbs: ['Home', 'Customer Quotations', 'New Quotation'],
    },
    'edit-customer-quotation': {
      title: 'Edit Customer Quotation',
      breadcrumbs: [
        'Home',
        'Customer Quotations',
        editingCustomerQuotation?.quotation_no || editingCustomerQuotation?.id || 'Edit Quotation',
      ],
    },
    'customer-quotation-details': {
      title: 'Quotation Details',
      breadcrumbs: [
        'Home',
        'Customer Quotations',
        viewingCustomerQuotation?.quotation_no || viewingCustomerQuotation?.id || 'Details',
      ],
    },
    reports: {
      title: 'Reports',
      breadcrumbs: ['Home', 'Reports'],
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
    activePage === 'rate-request-details' ||
    activePage === 'rate-comparison' ||
    activePage === 'create-rate-comparison' ||
    activePage === 'edit-rate-comparison' ||
    activePage === 'rate-comparison-details'
  ) {
    sidebarActiveItem = 'rate-requests';
  } else if (
    activePage === 'agent-quotations' ||
    activePage === 'add-agent-quotation' ||
    activePage === 'edit-agent-quotation' ||
    activePage === 'agent-quotation-details'
  ) {
    sidebarActiveItem = 'agent-quotations';
  } else if (
    activePage === 'pricing' ||
    activePage === 'create-pricing' ||
    activePage === 'edit-pricing' ||
    activePage === 'pricing-details'
  ) {
    sidebarActiveItem = 'pricing';
  } else if (
    activePage === 'customer-quotations' ||
    activePage === 'create-customer-quotation' ||
    activePage === 'edit-customer-quotation' ||
    activePage === 'customer-quotation-details'
  ) {
    sidebarActiveItem = 'customer-quotations';
  }
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }
  // ── Render ─────────────────────────────────────────────────────────────────
  return (

    <div className="min-h-screen w-full bg-[#F1F4F7] flex">

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={logout}
        user={currentUser}
      />

      {/* Main wrapper */}
      <div
        className={`flex-1 min-w-0 transition-[margin] duration-300 ease-in-out ${sidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
      >


        {/* Page Content */}
        <main className="w-full min-w-0 p-6 lg:p-8">
          <div key={activePage} className="page-enter">

            {activePage === 'dashboard' && (
              <DashboardPage
                enquiries={enquiries}
                rateRequests={rateRequests}
                quotations={quotations}
                customerQuotations={customerQuotations}
                pricingList={pricingList}
                onNavigateToEnquiries={() => setActivePage('enquiries')}
              />
            )}

            {activePage === 'profile' && (
              <ProfilePage
                user={currentUser}
                onNavigate={setActivePage}
                onUpdateUser={setCurrentUser}
              />
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
                customers={customers}
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
                agents={agents}
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
                comparisons={comparisons}
                onCreateComparison={handleNavigateToCreateComparison}
                onViewComparison={handleViewComparison}
                onEditComparison={handleStartEditComparison}
                onNavigateToPricing={() => setActivePage('pricing')}
                activeTab="rfq-list"
                onTabChange={(tab) => {
                  if (tab === 'rate-comparison') {
                    setActivePage('rate-comparison');
                  }
                }}
              />
            )}
            {(activePage === 'create-rate-request' || activePage === 'edit-rate-request') && (
              <RateRequestForm
                initialData={editingRateRequest}
                enquiries={enquiries}
                agents={agents}
                rateRequests={rateRequests}
                onCancel={handleCancelRateRequestForm}
                onSave={handleRateRequestSaved}
                onEnquiryStatusChange={handleEnquiryStatusChange}
              />
            )}
            {activePage === 'rate-request-details' && (
              <RateRequestDetails
                rateRequest={viewingRateRequest}
                onBack={() => setActivePage('rate-requests')}
                onEdit={handleStartEditRateRequest}
                quotations={quotations}
                comparisons={comparisons}
                onCreateComparison={handleNavigateToCreateComparison}
                onViewComparison={handleViewComparison}
                onNavigateToPricing={() => setActivePage('pricing')}
              />
            )}

            {/* ── Agent Quotations Section ───────────────────────────────────── */}
            {activePage === 'agent-quotations' && (
              <AgentQuotationList
                quotations={quotations}
                onCreateQuotation={handleNavigateToAddQuotation}
                onViewQuotation={handleViewQuotation}
                onEditQuotation={handleStartEditQuotation}
              />
            )}
            {(activePage === 'add-agent-quotation' || activePage === 'edit-agent-quotation') && (
              <AgentQuotationForm
                initialData={editingQuotation}
                rateRequests={rateRequests}
                agents={agents}
                quotations={quotations}
                onCancel={handleCancelQuotationForm}
                onSave={handleQuotationSaved}
              />
            )}
            {activePage === 'agent-quotation-details' && (
              <AgentQuotationDetails
                quotation={viewingQuotation}
                onBack={() => setActivePage('agent-quotations')}
                onEdit={handleStartEditQuotation}
              />
            )}

            {/* ── Rate Comparison Section ────────────────────────────────────── */}
            {activePage === 'rate-comparison' && (
              <RateRequestList
                rateRequests={rateRequests}
                onCreateRateRequest={handleNavigateToCreateRateRequest}
                onViewRateRequest={handleViewRateRequest}
                onEditRateRequest={handleStartEditRateRequest}
                comparisons={comparisons}
                onCreateComparison={handleNavigateToCreateComparison}
                onViewComparison={handleViewComparison}
                onEditComparison={handleStartEditComparison}
                onNavigateToPricing={() => setActivePage('pricing')}
                activeTab="rate-comparison"
                onTabChange={(tab) => {
                  if (tab === 'rfq-list') {
                    setActivePage('rate-requests');
                  }
                }}
              />
            )}
            {(activePage === 'create-rate-comparison' || activePage === 'edit-rate-comparison') && (
              <RateComparisonForm
                initialData={editingComparison}
                enquiries={enquiries}
                rateRequests={rateRequests}
                quotations={quotations}
                comparisons={comparisons}
                onCancel={handleCancelComparisonForm}
                onSave={handleComparisonSaved}
                onNavigateToPricing={() => setActivePage('pricing')}
              />
            )}
            {activePage === 'rate-comparison-details' && (
              <RateComparisonDetails
                comparison={viewingComparison}
                onBack={() => setActivePage('rate-comparison')}
                onEdit={handleStartEditComparison}
                onNavigateToPricing={() => setActivePage('pricing')}
              />
            )}

            {/* ── Pricing Section ────────────────────────────────────────────── */}
            {activePage === 'pricing' && (
              <PricingList
                pricingList={pricingList}
                onCreatePricing={handleNavigateToCreatePricing}
                onViewPricing={handleViewPricing}
                onEditPricing={handleStartEditPricing}
              />
            )}
            {(activePage === 'create-pricing' || activePage === 'edit-pricing') && (
              <PricingForm
                initialData={editingPricing}
                enquiries={enquiries}
                comparisons={comparisons}
                quotations={quotations}
                rateRequests={rateRequests}
                onCancel={handleCancelPricingForm}
                onSave={handlePricingSaved}
              />
            )}
            {activePage === 'pricing-details' && (
              <PricingDetails
                pricing={viewingPricing}
                onBack={() => setActivePage('pricing')}
                onEdit={handleStartEditPricing}
              />
            )}

            {/* ── Customer Quotations Section ─────────────────────────────────── */}
            {activePage === 'customer-quotations' && (
              <CustomerQuotationList
                quotations={customerQuotations}
                onCreateQuotation={handleNavigateToCreateCustomerQuotation}
                onViewQuotation={handleViewCustomerQuotation}
                onEditQuotation={handleStartEditCustomerQuotation}
                onDeleteQuotation={handleDeleteCustomerQuotation}
              />
            )}
            {(activePage === 'create-customer-quotation' || activePage === 'edit-customer-quotation') && (
              <CustomerQuotationForm
                initialData={editingCustomerQuotation}
                pricingList={pricingList}
                enquiries={enquiries}
                onCancel={handleCancelCustomerQuotationForm}
                onSave={handleCustomerQuotationSaved}
              />
            )}
            {activePage === 'customer-quotation-details' && (
              <CustomerQuotationDetails
                quotation={viewingCustomerQuotation}
                onBack={() => setActivePage('customer-quotations')}
                onEdit={handleStartEditCustomerQuotation}
              />
            )}
            {activePage === 'reports' && (
              <Reports
                enquiries={enquiries}
                rateRequests={rateRequests}
                quotations={quotations}
                pricingList={pricingList}
                customerQuotations={customerQuotations}
                customers={customers}
                agents={agents}
              />
            )}

            {activePage === 'contact-support' && <ContactSupport />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
