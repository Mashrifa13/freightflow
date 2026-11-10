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
    Active: 'bg-[#E8F5EF] text-[#16845B] border-[#D1EEDB]',
    Pending: 'bg-[#FBF2E2] text-[#B17A25] border-[#F4E1BE]',
    Inactive: 'bg-[#F1F3F5] text-[#74808C] border-[#DDE2E7]',
    Suspended: 'bg-[#FCEEEE] text-[#C45151] border-[#F6CACA]',
  };

  const agentId = agent.agent_code || agent.agent_id || agent.id || '—';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-[#E2E7ED] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E2E7ED] bg-[#F7F9FB] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center font-bold text-sm">
              <Users size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#242A31] leading-tight">
                  {agent.name || agent.agent_name}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[agent.status] || 'bg-[#F1F3F5] text-[#74808C] border-[#DDE2E7]'
                    }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
                  {agent.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-[#74808C] mt-0.5">
                Agent ID:{' '}
                <span className="text-[#354C63] font-mono font-semibold">{agentId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#74808C] hover:text-[#242A31] hover:bg-[#EAF0F5] rounded-lg transition-colors cursor-pointer"
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
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#242A31] uppercase tracking-wider">
              <Users size={15} className="text-[#354C63]" />
              <span>1. Basic Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#F7F9FB] p-4.5 rounded-xl border border-[#E2E7ED]">
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Agent Name</span>
                <span className="text-sm font-semibold text-[#242A31]">{agent.name || agent.agent_name || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Agent Code</span>
                <span className="text-sm font-mono font-semibold text-[#354C63]">{agentId}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Agent Type</span>
                <span className="text-sm text-[#242A31]">{agent.agent_type || agent.type || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Company Registration</span>
                <span className="text-sm text-[#242A31]">{agent.company_registration_number || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Tax / VAT Number</span>
                <span className="text-sm text-[#242A31]">{agent.tax_vat_number || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Website</span>
                {agent.website ? (
                  <a
                    href={agent.website.startsWith('http') ? agent.website : `https://${agent.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#354C63] hover:text-[#293D52] hover:underline flex items-center gap-1.5 truncate text-sm"
                  >
                    <Globe size={13} className="flex-shrink-0" />
                    <span className="truncate">{agent.website}</span>
                  </a>
                ) : (
                  <span className="text-sm text-[#74808C]">—</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Contact Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#242A31] uppercase tracking-wider">
              <PhoneCall size={15} className="text-[#354C63]" />
              <span>2. Contact Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#F7F9FB] p-4.5 rounded-xl border border-[#E2E7ED]">
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Contact Person</span>
                <span className="text-sm text-[#242A31] flex items-center gap-1.5">
                  <User size={13} className="text-[#74808C]" />
                  {agent.contact_person || '—'}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Email Address</span>
                <span className="text-sm text-[#242A31] flex items-center gap-1.5 truncate">
                  <Mail size={13} className="text-[#74808C] flex-shrink-0" />
                  <span className="truncate">{agent.email || '—'}</span>
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Phone</span>
                <span className="text-sm text-[#242A31] block">{agent.phone || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Alternate Phone</span>
                <span className="text-sm text-[#242A31] block">{agent.alternate_phone || '—'}</span>
              </div>
            </div>
          </div>

          {/* 3. Address Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#242A31] uppercase tracking-wider">
              <MapPin size={15} className="text-[#354C63]" />
              <span>3. Address Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#F7F9FB] p-4.5 rounded-xl border border-[#E2E7ED]">
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Country</span>
                <span className="text-sm font-semibold text-[#242A31]">{agent.country || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">State / Province</span>
                <span className="text-sm text-[#242A31]">{agent.state || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">City</span>
                <span className="text-sm text-[#242A31]">{agent.city || '—'}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Postal / ZIP Code</span>
                <span className="text-sm text-[#242A31]">{agent.postal_code || '—'}</span>
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Street Address</span>
                <span className="text-sm text-[#242A31]">{agent.address || '—'}</span>
              </div>
            </div>
          </div>

          {/* 4. Financial Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#242A31] uppercase tracking-wider">
              <CreditCard size={15} className="text-[#354C63]" />
              <span>4. Financial Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F7F9FB] p-4.5 rounded-xl border border-[#E2E7ED] max-w-xl">
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Credit Limit</span>
                <span className="text-sm font-bold text-[#242A31]">
                  {agent.credit_limit != null && agent.credit_limit !== ''
                    ? `₹ ${Number(agent.credit_limit).toLocaleString('en-IN')}`
                    : '₹ 0.00'}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-[#74808C] block mb-0.5">Credit Terms</span>
                <span className="text-sm font-bold text-[#242A31]">
                  {agent.credit_days != null && agent.credit_days !== ''
                    ? `${agent.credit_days} days`
                    : 'Net 0 days'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-[#E2E7ED] bg-[#F7F9FB] flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#D3DBE4] text-[#596673] hover:bg-[#EEF2F6] text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgentDetailsModal;

