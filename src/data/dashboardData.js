// Dashboard sample data for FreightFlow Pricing Management System

export const statsData = [
  {
    id: 1,
    label: 'Total Enquiries',
    value: 128,
    change: '+12%',
    changeType: 'increase',
    comparison: 'vs last month (114)',
    color: 'blue',
    iconName: 'FileText',
  },
  {
    id: 2,
    label: 'Pending Rate Requests',
    value: 24,
    change: '-8%',
    changeType: 'decrease',
    comparison: 'vs last month (26)',
    color: 'orange',
    iconName: 'Clock',
  },
  {
    id: 3,
    label: 'Agent Responses',
    value: 56,
    change: '+18%',
    changeType: 'increase',
    comparison: 'vs last month (47)',
    color: 'green',
    iconName: 'Users',
  },
  {
    id: 4,
    label: 'Pending Quotations',
    value: 18,
    change: '+5%',
    changeType: 'increase',
    comparison: 'vs last month (17)',
    color: 'purple',
    iconName: 'FileCheck',
  },
];

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
  { id: 'rate-comparison', label: 'Rate Comparison', iconName: 'BarChart2', active: false, path: '#' },
  { id: 'pricing', label: 'Pricing', iconName: 'Tag', active: false, path: '#' },
  { id: 'customer-quotations', label: 'Customer Quotations', iconName: 'FilePlus', active: false, path: '#' },
  { id: 'reports', label: 'Reports', iconName: 'TrendingUp', active: false, path: '#' },


];
