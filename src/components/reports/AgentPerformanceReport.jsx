
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-800">
                    Agent Performance
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    RFQ assignments and quotation response statistics.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Agent Name
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Total RFQs
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Responses
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Pending
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                Response Rate
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {agentPerformance.length > 0 ? (
                            agentPerformance.map((agent) => {
                                const responseRate =
                                    agent.totalRFQs > 0
                                        ? (agent.responses / agent.totalRFQs) * 100
                                        : 0;

                                return (
                                    <tr key={agent.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4 font-semibold text-gray-800">
                                            {agent.name}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {agent.totalRFQs}
                                        </td>
                                        <td className="px-5 py-4 font-medium text-emerald-600">
                                            {agent.responses}
                                        </td>
                                        <td className="px-5 py-4 font-medium text-amber-600">
                                            {agent.pending}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${responseRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700">
                                                    {responseRate.toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400">
                                    No agent performance records available.
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
