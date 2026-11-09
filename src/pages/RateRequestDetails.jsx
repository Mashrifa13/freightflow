import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Ship,
  Plane,
  Truck,
  Building2,
  Mail,
  Phone,
  FileText,
  Users,
  Edit,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const statusConfig = {
  Draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  Sent: {
    label: 'Sent',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'Partially Responded': {
    label: 'Partially Responded',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  'Responses Received': {
    label: 'Responses Received',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Closed: {
    label: 'Closed',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  Cancelled: {
    label: 'Cancelled',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

const agentResponseStatusConfig = {
  Draft: {
    label: 'Draft',
    icon: Clock3,
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  Pending: {
    label: 'Pending Response',
    icon: Clock3,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  Quoted: {
    label: 'Quoted',
    icon: CheckCircle2,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Received: {
    label: 'Quoted',
    icon: CheckCircle2,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Declined: {
    label: 'Declined',
    icon: XCircle,
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  Expired: {
    label: 'Expired',
    icon: AlertCircle,
    className: 'bg-gray-100 text-gray-500 border-gray-200',
  },
};

function AgentResponseBadge({ status }) {
  const config = agentResponseStatusConfig[status] || agentResponseStatusConfig.Pending;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      <Icon size={13} />
      <span>{config.label}</span>
    </span>
  );
}

function RateRequestDetails({ rateRequest, onBack, onEdit }) {
  if (!rateRequest) return null;

  const mode = rateRequest.shipment_mode || rateRequest.mode || 'Sea';
  const stConfig = statusConfig[rateRequest.status] || statusConfig.Draft;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-gray-100 gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Rate Requests
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {rateRequest.rfq_no || rateRequest.id}
            </h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stConfig.className}`}
            >
              {stConfig.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Created on {rateRequest.request_date || '—'} • Linked to Enquiry{' '}
            <span className="font-semibold text-blue-700">
              {rateRequest.enquiry_no || rateRequest.enquiry_id || '—'}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(rateRequest)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Edit size={14} />
          <span>Edit Rate Request</span>
        </button>
      </div>

      {/* 1. Overview & Timeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Customer</span>
          <span className="text-sm font-bold text-gray-800 mt-1 block truncate">
            {rateRequest.customer_name || '—'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Shipment Mode & Route</span>
          <span className="text-sm font-bold text-blue-700 mt-1 block truncate">
            {mode} : {rateRequest.pol || '—'} → {rateRequest.pod || '—'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Response Deadline</span>
          <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-amber-700">
            <Clock size={15} className="text-amber-500" />
            <span>{rateRequest.response_deadline || '—'}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 font-medium block">Responses Summary</span>
          <span className="text-sm font-bold text-emerald-700 mt-1 block">
            {rateRequest.agents?.filter((a) => a.response_status === 'Quoted' || a.response_status === 'Received').length || 0}{' '}
            of {rateRequest.agents?.length || 0} Agents Quoted
          </span>
        </div>
      </div>

      {/* 2. Complete Enquiry & Cargo Information */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Shipment & Cargo Details
            </h3>
            <p className="text-xs text-gray-400">
              Complete specifications forwarded to overseas agents
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-gray-400 block font-medium">Incoterms</span>
            <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
              {rateRequest.incoterms || '—'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block font-medium">Expected Shipping Date</span>
            <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
              {rateRequest.expected_shipping_date || '—'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block font-medium">Commodity</span>
            <span className="font-semibold text-gray-800 text-sm mt-0.5 block truncate">
              {rateRequest.commodity || '—'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block font-medium">Gross Weight / Volume</span>
            <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
              {rateRequest.gross_weight ? `${rateRequest.gross_weight} ${rateRequest.gross_weight_unit || 'kg'}` : '—'} /{' '}
              {rateRequest.volume_cbm ? `${rateRequest.volume_cbm} CBM` : '—'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block font-medium">Packages</span>
            <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
              {rateRequest.no_of_packages ? `${rateRequest.no_of_packages} pkgs` : '—'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block font-medium">Shipment Type</span>
            <span className="font-semibold text-gray-800 text-sm mt-0.5 block">
              {rateRequest.shipment_type || '—'}
            </span>
          </div>
        </div>

        {rateRequest.containers && rateRequest.containers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500">Containers:</span>
            {rateRequest.containers.map((c, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800"
              >
                {c.quantity} × {c.containerType}
              </span>
            ))}
          </div>
        )}

        {rateRequest.cargo_description && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs">
            <span className="font-semibold text-gray-500 block mb-1">Cargo Description:</span>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
              {rateRequest.cargo_description}
            </p>
          </div>
        )}

        {rateRequest.special_instructions && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs">
            <span className="font-semibold text-gray-500 block mb-1">
              Special Instructions to Agents:
            </span>
            <p className="text-gray-700 bg-amber-50/50 border border-amber-200/50 p-3 rounded-xl">
              {rateRequest.special_instructions}
            </p>
          </div>
        )}
      </section>

      {/* 3. Selected Overseas Agents & Response Status Tracking */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users size={19} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Overseas Agents & Response Status Tracking
            </h3>
            <p className="text-xs text-gray-400">
              Monitor individual agent quotations, response timestamps, and rate submissions
            </p>
          </div>
        </div>

        {rateRequest.agents && rateRequest.agents.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {rateRequest.agents.map((agent, index) => (
              <div
                key={agent.agent_id || agent.id || index}
                className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-800">
                        {agent.agent_name || agent.name}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                        {agent.country || 'Global'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-gray-400" />
                        {agent.email || '—'}
                      </span>
                      <span>•</span>
                      <span>Contact: {agent.contact_person || 'Representative'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  {agent.quoted_rate != null ? (
                    <div className="text-right">
                      <span className="text-[11px] text-gray-400 block font-medium">Quoted Rate</span>
                      <span className="text-sm font-bold text-emerald-600">
                        {agent.currency || 'USD'} {agent.quoted_rate}
                      </span>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-[11px] text-gray-400 block font-medium">Quoted Rate</span>
                      <span className="text-xs text-gray-400 italic">Not submitted</span>
                    </div>
                  )}

                  <AgentResponseBadge status={agent.response_status || 'Pending'} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic text-center py-6">
            No agents linked to this rate request.
          </p>
        )}
      </section>

      {/* 4. RFQ Email Preview */}
      {rateRequest.email_subject && rateRequest.email_body && (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Mail size={19} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  RFQ Email Preview
                </h3>
                <p className="text-xs text-gray-400">
                  Email sent to selected overseas agents
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {rateRequest.status === 'Sent' ? 'Sent' : rateRequest.status}
            </span>
          </div>

          {/* Recipients */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-gray-500 block mb-2">
              To
            </span>

            <div className="flex flex-wrap gap-2">
              {rateRequest.agents?.map((agent, index) => (
                <span
                  key={agent.agent_id || agent.id || index}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700"
                >
                  {agent.agent_name || agent.name} ({agent.email})
                </span>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-gray-500 block mb-1">
              Subject
            </span>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800">
              {rateRequest.email_subject}
            </div>
          </div>

          {/* Email Body */}
          <div>
            <span className="text-xs font-semibold text-gray-500 block mb-1">
              Email Message
            </span>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-4">
              {rateRequest.email_body}
            </pre>
          </div>

          {/* Individual Email Status */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500 block mb-3">
              Recipient Status
            </span>

            <div className="space-y-2">
              {rateRequest.agents?.map((agent, index) => (
                <div
                  key={agent.agent_id || agent.id || index}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-600">
                    {agent.agent_name || agent.name}
                  </span>

                  <span className={`font-semibold ${agent.email_status === 'Sent'
                      ? 'text-emerald-600'
                      : 'text-gray-500'
                    }`}>
                    {agent.email_status || 'Not available'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

export default RateRequestDetails;

