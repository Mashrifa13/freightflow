import React from 'react';
import {
  X,
  Users,
  PhoneCall,
  MapPin,
  CreditCard,
  Edit,
  Globe,
  Mail,
  User,
} from 'lucide-react';

/**
 * AgentDetailsModal
 * Modal displaying comprehensive agent profile details with Edit and Close actions.
 */
function AgentDetailsModal({ agent, onClose, onEdit }) {
  if (!agent) return null;

  const statusStyles = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-orange-50 text-orange-700 border-orange-200',
    Inactive: 'bg-gray-100 text-gray-600 border-gray-200',
    Suspended: 'bg-red-50 text-red-600 border-red-200',
  };

  const agentId = agent.agent_code || agent.agent_id || agent.id || '—';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <Users size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {agent.name || agent.agent_name}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    statusStyles[agent.status] || 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                  {agent.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Agent ID:{' '}
                <span className="text-blue-700 font-semibold">{agentId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(agent);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* 1. Basic Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <Users size={15} className="text-blue-600" />
              <span>1. Basic Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50/70 p-4.5 rounded-xl border border-gray-100">
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Agent Name</span>
                <span className="text-sm font-semibold text-gray-900">{agent.name || agent.agent_name || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Agent Code</span>
                <span className="text-sm font-semibold text-blue-700">{agentId}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Agent Type</span>
                <span className="text-sm text-gray-800">{agent.agent_type || agent.type || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Company Registration</span>
                <span className="text-sm text-gray-800">{agent.company_registration_number || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Tax / VAT Number</span>
                <span className="text-sm text-gray-800">{agent.tax_vat_number || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Website</span>
                {agent.website ? (
                  <a
                    href={agent.website.startsWith('http') ? agent.website : `https://${agent.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 truncate text-sm"
                  >
                    <Globe size={13} className="flex-shrink-0" />
                    <span className="truncate">{agent.website}</span>
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Contact Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <PhoneCall size={15} className="text-purple-600" />
              <span>2. Contact Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50/70 p-4.5 rounded-xl border border-gray-100">
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Contact Person</span>
                <span className="text-sm text-gray-800 flex items-center gap-1.5">
                  <User size={13} className="text-gray-400" />
                  {agent.contact_person || '—'}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Email Address</span>
                <span className="text-sm text-gray-800 flex items-center gap-1.5 truncate">
                  <Mail size={13} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{agent.email || '—'}</span>
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Phone</span>
                <span className="text-sm text-gray-800 block">{agent.phone || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Alternate Phone</span>
                <span className="text-sm text-gray-800 block">{agent.alternate_phone || '—'}</span>
              </div>
            </div>
          </div>

          {/* 3. Address Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <MapPin size={15} className="text-emerald-600" />
              <span>3. Address Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50/70 p-4.5 rounded-xl border border-gray-100">
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Country</span>
                <span className="text-sm font-semibold text-gray-800">{agent.country || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">State / Province</span>
                <span className="text-sm text-gray-800">{agent.state || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">City</span>
                <span className="text-sm text-gray-800">{agent.city || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Postal / ZIP Code</span>
                <span className="text-sm text-gray-800">{agent.postal_code || '—'}</span>
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Street Address</span>
                <span className="text-sm text-gray-800">{agent.address || '—'}</span>
              </div>
            </div>
          </div>

          {/* 4. Financial Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <CreditCard size={15} className="text-orange-600" />
              <span>4. Financial Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-4.5 rounded-xl border border-gray-100 max-w-xl">
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Credit Limit</span>
                <span className="text-sm font-bold text-gray-900">
                  {agent.credit_limit != null && agent.credit_limit !== ''
                    ? `₹ ${Number(agent.credit_limit).toLocaleString('en-IN')}`
                    : '₹ 0.00'}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 block mb-0.5">Credit Terms</span>
                <span className="text-sm font-bold text-gray-900">
                  {agent.credit_days != null && agent.credit_days !== ''
                    ? `${agent.credit_days} days`
                    : 'Net 0 days'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onEdit) onEdit(agent);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Edit size={13} />
            <span>Edit Agent</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgentDetailsModal;

