

export const enquiriesData = [];

export const recentActivities = [
  {
    id: 1,
    description: 'Agent A submitted a quotation for ENQ-2026-001.',
    timestamp: '2026-10-30T10:45:00+05:30',
    type: 'quotation',
    iconName: 'FileCheck',
  },
  {
    id: 2,
    description: 'Rate request sent to Agent B for ENQ-2026-002.',
    timestamp: '2026-10-30T09:30:00+05:30',
    type: 'request',
    iconName: 'Send',
  },
  {
    id: 3,
    description: 'Pricing completed for ENQ-2026-003.',
    timestamp: '2026-10-30T08:15:00+05:30',
    type: 'completed',
    iconName: 'CheckCircle',
  },
  {
    id: 4,
    description: 'Customer quotation generated for ENQ-2026-004.',
    timestamp: '2026-10-29T17:00:00+05:30',
    type: 'generated',
    iconName: 'FilePlus',
  },
];


export const sidebarNavItems = [
  { id: 'dashboard', label: 'Dashboard', iconName: 'LayoutDashboard', active: true, path: '/' },
  { id: 'agents', label: 'Agent Management', iconName: 'Users', active: false, path: '#' },
  { id: 'customers', label: 'Customer Management', iconName: 'UserCircle', active: false, path: '#' },
  { id: 'enquiries', label: 'Enquiries', iconName: 'FileText', active: false, path: '#' },
  { id: 'rate-requests', label: 'Rate Requests', iconName: 'ClipboardList', active: false, path: '#' },
  { id: 'agent-quotations', label: 'Agent Quotations', iconName: 'FileCheck', active: false, path: '#' },
  { id: 'pricing', label: 'Pricing', iconName: 'Tag', active: false, path: '#' },
  { id: 'customer-quotations', label: 'Customer Quotations', iconName: 'FilePlus', active: false, path: '#' },
  { id: 'reports', label: 'Reports', iconName: 'TrendingUp', active: false, path: '#' },
];

