import React from 'react';

const reportTabs = [
    'Enquiry Reports',
    'Agent Performance',
    'Quotation Reports',
    'Pricing Reports',
    'Sales Reports',
];

function ReportTabs({ activeTab, setActiveTab }) {
    const reportTabs = [
        'Enquiry Reports',
        'Agent Performance',
        'Quotation Reports',
        'Pricing Reports',
        'Sales Reports',
    ];

    return (
        <div className="flex gap-2 overflow-x-auto border-b border-gray-200">
            {reportTabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${activeTab === tab
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}

export default ReportTabs;