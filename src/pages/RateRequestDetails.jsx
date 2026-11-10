
import React from 'react';
import {
  ArrowLeft,
  Clock,
  Users,
  Mail,
  FileText,
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const statusConfig = {
  Draft: {
    label: 'Draft',
    className: 'bg-[#F1F4F7] text-[#596673] border-[#D3DBE4]',
  },
  Sent: {
    label: 'Sent',
    className: 'bg-[#EDF2F7] text-[#354C63] border-[#D3DBE4]',
  },
  'Partially Responded': {
    label: 'Partially Responded',
    className: 'bg-[#FBF2E2] text-[#A87527] border-[#EEDBB8]',
  },
  'Responses Received': {
    label: 'Responses Received',
    className: 'bg-[#E8F5EF] text-[#16845B] border-[#C8E7D8]',
  },
  Closed: {
    label: 'Closed',
    className: 'bg-[#F1F4F7] text-[#596673] border-[#D3DBE4]',
  },
  Cancelled: {
    label: 'Cancelled',
    className: 'bg-[#FCEEEE] text-[#C45151] border-[#F2D0D0]',
  },
};

const agentResponseStatusConfig = {
  Draft: {
    label: 'Draft',
    icon: Clock3,
    className: 'bg-[#F1F4F7] text-[#596673] border-[#D3DBE4]',
  },
  Pending: {
    label: 'Pending Response',
    icon: Clock3,
    className: 'bg-[#FBF2E2] text-[#A87527] border-[#EEDBB8]',
  },
  Quoted: {
    label: 'Quoted',
    icon: CheckCircle2,
    className: 'bg-[#E8F5EF] text-[#16845B] border-[#C8E7D8]',
  },
  Received: {
    label: 'Quoted',
    icon: CheckCircle2,
    className: 'bg-[#E8F5EF] text-[#16845B] border-[#C8E7D8]',
  },
  Declined: {
    label: 'Declined',
    icon: XCircle,
    className: 'bg-[#FCEEEE] text-[#C45151] border-[#F2D0D0]',
  },
  Expired: {
    label: 'Expired',
    icon: AlertCircle,
    className: 'bg-[#F1F4F7] text-[#74808C] border-[#D3DBE4]',
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Draft;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function AgentResponseBadge({ status }) {
  const config =
    agentResponseStatusConfig[status] ||
    agentResponseStatusConfig.Pending;

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

function DetailCard({ label, children, highlight = false }) {
  return (
    <div className="bg-[#F7F9FB] p-3.5 rounded-xl border border-[#E2E7ED] min-w-0">
      <span className="text-xs text-[#74808C] font-medium block">
        {label}
      </span>

      <div
        className={`text-sm font-semibold mt-1 break-words ${highlight ? 'text-[#354C63]' : 'text-[#242A31]'
          }`}
      >
        {children}
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description, rightContent }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-5 border-b border-[#E2E7ED]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#EAF0F5] text-[#354C63] flex items-center justify-center flex-shrink-0">
          <Icon size={19} />
        </div>

        <div>
          <h3 className="text-base font-semibold text-[#242A31]">
            {title}
          </h3>

          {description && (
            <p className="text-xs text-[#74808C] mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {rightContent}
    </div>
  );
}

function RateRequestDetails({ rateRequest, onBack, onEdit }) {
  if (!rateRequest) return null;

  const mode =
    rateRequest.shipment_mode ||
    rateRequest.mode ||
    'Sea';

  const stConfig =
    statusConfig[rateRequest.status] ||
    statusConfig.Draft;

  const quotedCount =
    rateRequest.agents?.filter(
      (a) =>
        a.response_status === 'Quoted' ||
        a.response_status === 'Received'
    ).length || 0;

  const totalAgents = rateRequest.agents?.length || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#E2E7ED] gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74808C] hover:text-[#35271F] transition-colors mb-3 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Rate Requests
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-[#242A31] tracking-tight">
              {rateRequest.rfq_no || rateRequest.id}
            </h2>

            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${stConfig.className}`}
            >
              {stConfig.label}
            </span>
          </div>

          <p className="text-xs text-[#74808C] mt-1">
            Created on {rateRequest.request_date || '—'} • Linked to Enquiry{' '}
            <span className="font-semibold text-[#354C63]">
              {rateRequest.enquiry_no || rateRequest.enquiry_id || '—'}
            </span>
          </p>
        </div>

        {onEdit && rateRequest.status !== 'Cancelled' && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#354C63] hover:bg-[#293D52] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <FileText size={15} />
            Edit Rate Request
          </button>
        )}
      </div>

      {/* 1. Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DetailCard label="Customer">
          {rateRequest.customer_name || '—'}
        </DetailCard>

        <DetailCard label="Shipment Mode & Route" highlight>
          {mode} : {rateRequest.pol || '—'} → {rateRequest.pod || '—'}
        </DetailCard>

        <DetailCard label="Response Deadline">
          <div className="flex items-center gap-1.5">
            <Clock size={15} className="text-[#C28A35]" />
            <span>{rateRequest.response_deadline || '—'}</span>
          </div>
        </DetailCard>

        <DetailCard label="Responses Summary">
          <span className="text-[#16845B]">
            {quotedCount} of {totalAgents} Agents Quoted
          </span>
        </DetailCard>
      </div>

      {/* 2. Shipment & Cargo Details */}
      <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6">
        <SectionHeader
          icon={FileText}
          title="Shipment & Cargo Details"
          description="Complete specifications forwarded to overseas agents"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <DetailCard label="Incoterms">
            {rateRequest.incoterms || '—'}
          </DetailCard>

          <DetailCard label="Expected Shipping Date">
            {rateRequest.expected_shipping_date || '—'}
          </DetailCard>

          <DetailCard label="Commodity">
            {rateRequest.commodity || '—'}
          </DetailCard>

          <DetailCard label="Gross Weight / Volume">
            {rateRequest.gross_weight
              ? `${rateRequest.gross_weight} ${rateRequest.gross_weight_unit || 'kg'}`
              : '—'}{' '}
            /{' '}
            {rateRequest.volume_cbm
              ? `${rateRequest.volume_cbm} CBM`
              : '—'}
          </DetailCard>

          <DetailCard label="Packages">
            {rateRequest.no_of_packages
              ? `${rateRequest.no_of_packages} pkgs`
              : '—'}
          </DetailCard>

          <DetailCard label="Shipment Type">
            {rateRequest.shipment_type || '—'}
          </DetailCard>
        </div>

        {/* Containers */}
        {rateRequest.containers &&
          rateRequest.containers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#E2E7ED] flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#596673]">
                Containers:
              </span>

              {rateRequest.containers.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[#EDF2F7] border border-[#D3DBE4] rounded-lg text-xs font-semibold text-[#354C63]"
                >
                  {c.quantity} × {c.containerType}
                </span>
              ))}
            </div>
          )}

        {/* Cargo Description */}
        {rateRequest.cargo_description && (
          <div className="mt-4 pt-4 border-t border-[#E2E7ED] text-xs">
            <span className="font-semibold text-[#596673] block mb-2">
              Cargo Description
            </span>

            <p className="text-[#4B5563] bg-[#F7F9FB] p-3 rounded-xl border border-[#E2E7ED]">
              {rateRequest.cargo_description}
            </p>
          </div>
        )}

        {/* Special Instructions */}
        {rateRequest.special_instructions && (
          <div className="mt-4 pt-4 border-t border-[#E2E7ED] text-xs">
            <span className="font-semibold text-[#596673] block mb-2">
              Special Instructions to Agents
            </span>

            <p className="text-[#8A642A] bg-[#FBF2E2] border border-[#EEDBB8] p-3 rounded-xl">
              {rateRequest.special_instructions}
            </p>
          </div>
        )}
      </section>

      {/* 3. Overseas Agents */}
      <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6">
        <SectionHeader
          icon={Users}
          title="Overseas Agents & Response Status Tracking"
          description="Monitor individual agent quotations, response timestamps, and rate submissions"
        />

        {rateRequest.agents && rateRequest.agents.length > 0 ? (
          <div className="divide-y divide-[#E2E7ED]">
            {rateRequest.agents.map((agent, index) => (
              <div
                key={agent.agent_id || agent.id || index}
                className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Agent Information */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#F1F4F7] border border-[#E2E7ED] flex items-center justify-center text-[#354C63] flex-shrink-0">
                    <Building2 size={18} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-[#242A31]">
                        {agent.agent_name || agent.name}
                      </h4>

                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#F1F4F7] text-[#596673] rounded-full">
                        {agent.country || 'Global'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#74808C] mt-1">
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-[#9AA4AF]" />
                        {agent.email || '—'}
                      </span>

                      <span>•</span>

                      <span>
                        Contact: {agent.contact_person || 'Representative'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quoted Rate and Response Status */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-[11px] text-[#74808C] block font-medium">
                      Quoted Rate
                    </span>

                    {agent.quoted_rate != null ? (
                      <span className="text-sm font-bold text-[#16845B]">
                        {agent.currency || 'USD'} {agent.quoted_rate}
                      </span>
                    ) : (
                      <span className="text-xs text-[#9AA4AF] italic">
                        Not submitted
                      </span>
                    )}
                  </div>

                  <AgentResponseBadge
                    status={agent.response_status || 'Pending'}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#9AA4AF] italic text-center py-6">
            No agents linked to this rate request.
          </p>
        )}
      </section>

      {/* 4. RFQ Email Preview */}
      {rateRequest.email_subject && rateRequest.email_body && (
        <section className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm p-6">
          <SectionHeader
            icon={Mail}
            title="RFQ Email Preview"
            description="Email sent to selected overseas agents"
            rightContent={
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8F5EF] text-[#16845B] border border-[#C8E7D8]">
                {rateRequest.status === 'Sent'
                  ? 'Sent'
                  : rateRequest.status}
              </span>
            }
          />

          {/* Recipients */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-[#596673] block mb-2">
              To
            </span>

            <div className="flex flex-wrap gap-2">
              {rateRequest.agents?.map((agent, index) => (
                <span
                  key={agent.agent_id || agent.id || index}
                  className="px-3 py-1.5 bg-[#F7F9FB] border border-[#E2E7ED] rounded-lg text-xs text-[#596673]"
                >
                  {agent.agent_name || agent.name} ({agent.email})
                </span>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-[#596673] block mb-2">
              Subject
            </span>

            <div className="bg-[#F7F9FB] border border-[#E2E7ED] rounded-xl px-4 py-3 text-sm font-medium text-[#242A31]">
              {rateRequest.email_subject}
            </div>
          </div>

          {/* Email Body */}
          <div>
            <span className="text-xs font-semibold text-[#596673] block mb-2">
              Email Message
            </span>

            <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-[#4B5563] bg-[#F7F9FB] border border-[#E2E7ED] rounded-xl p-4">
              {rateRequest.email_body}
            </pre>
          </div>

          {/* Individual Email Status */}
          <div className="mt-4 pt-4 border-t border-[#E2E7ED]">
            <span className="text-xs font-semibold text-[#596673] block mb-3">
              Recipient Status
            </span>

            <div className="space-y-2">
              {rateRequest.agents?.map((agent, index) => (
                <div
                  key={agent.agent_id || agent.id || index}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <span className="text-[#596673]">
                    {agent.agent_name || agent.name}
                  </span>

                  <span
                    className={`font-semibold ${agent.email_status === 'Sent'
                        ? 'text-[#16845B]'
                        : agent.email_status === 'Failed'
                          ? 'text-[#C45151]'
                          : 'text-[#74808C]'
                      }`}
                  >
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
