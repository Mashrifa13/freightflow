
import React, { useMemo } from 'react';

function AgentPerformanceReport({ rateRequests = [], quotations = [] }) {
    const agentPerformance = useMemo(() => {
        const agentsMap = new Map();

        rateRequests.forEach((rfq) => {
            // Ignore draft and cancelled RFQs
            if (['Draft', 'Cancelled'].includes(rfq.status)) return;

            (rfq.agents || []).forEach((agent) => {
                const agentId =
                    agent.agent_id || agent.id || agent.agent_code;

                if (!agentId) return;

                if (!agentsMap.has(agentId)) {
                    agentsMap.set(agentId, {
                        id: agentId,
                        name: agent.agent_name || agent.name || agentId,
                        totalRFQs: 0,
                        responses: 0,
                        pending: 0,
                    });
                }

                const performance = agentsMap.get(agentId);
                performance.totalRFQs += 1;

                const hasQuotation = quotations.some((quote) => {
                    const quoteAgentId = quote.agent_id || quote.agent;
                    const quoteRFQ = quote.rfq_no || quote.rfq_id;
                    const rfqNumber = rfq.rfq_no || rfq.id;

                    return (
                        String(quoteAgentId) === String(agentId) &&
                        String(quoteRFQ) === String(rfqNumber)
                    );
                });

                const hasResponded =
                    hasQuotation ||
                    ['Quoted', 'Received'].includes(agent.response_status);

                if (hasResponded) {
                    performance.responses += 1;
                } else {
                    performance.pending += 1;
                }
            });
        });

        return Array.from(agentsMap.values());
    }, [rateRequests, quotations]);

    return (
        <div className="bg-white rounded-2xl border border-[#E2E7ED] shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#E2E7ED]">
                <h3 className="text-base font-semibold text-[#242A31]">
                    Agent Performance
                </h3>
                <p className="text-xs text-[#74808C] mt-1">
                    RFQ assignments and quotation response statistics.
                </p>
            </div>

            {/* Performance Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-[#354C63]">
                            <th className="px-5 py-3 text-xs font-semibold text-white uppercase tracking-wide">
                                Agent Name
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-white uppercase tracking-wide">
                                Total RFQs
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-white uppercase tracking-wide">
                                Responses
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-white uppercase tracking-wide">
                                Pending
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-white uppercase tracking-wide">
                                Response Rate
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[#E2E7ED]">
                        {agentPerformance.length > 0 ? (
                            agentPerformance.map((agent, index) => {
                                const responseRate =
                                    agent.totalRFQs > 0
                                        ? (agent.responses / agent.totalRFQs) * 100
                                        : 0;

                                return (
                                    <tr
                                        key={agent.id}
                                        className={`transition-colors hover:bg-[#EEF2F6] ${index % 2 === 0
                                                ? 'bg-white'
                                                : 'bg-[#F7F9FB]'
                                            }`}
                                    >
                                        <td className="px-5 py-4 font-semibold text-[#242A31] whitespace-nowrap">
                                            {agent.name}
                                        </td>

                                        <td className="px-5 py-4 text-[#424B55]">
                                            {agent.totalRFQs}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#E8F5EF] text-[#16845B] font-semibold text-xs">
                                                {agent.responses}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#FBF2E2] text-[#A87325] font-semibold text-xs">
                                                {agent.pending}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-20 h-2 bg-[#E2E7ED] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#647E96] rounded-full transition-all"
                                                        style={{
                                                            width: `${responseRate}%`,
                                                        }}
                                                    />
                                                </div>

                                                <span className="text-xs font-semibold text-[#354C63] tabular-nums">
                                                    {responseRate.toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-5 py-12 text-center"
                                >
                                    <p className="text-sm font-medium text-[#424B55]">
                                        No agent performance records available.
                                    </p>
                                    <p className="text-xs text-[#74808C] mt-1">
                                        Agent performance will appear when RFQs are assigned.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AgentPerformanceReport;
