
import React from 'react';

const reportTabs = [
    'Enquiry Reports',
    'Agent Performance',
    'Quotation Reports',
    'Pricing Reports',
    'Sales Reports',
];

function ReportTabs({ activeTab, setActiveTab }) {
    return (
        <div className="flex gap-2 overflow-x-auto border-b border-[#E2E7ED]">
            {reportTabs.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${activeTab === tab
                            ? 'border-[#354C63] text-[#354C63]'
                            : 'border-transparent text-[#74808C] hover:text-[#242A31] hover:border-[#D3DBE4]'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}

export default ReportTabs;
