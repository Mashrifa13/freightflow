import { Ship, Plane } from 'lucide-react';
import { enquiriesData } from '../data/dashboardData';

const statusConfig = {
  Pricing: {
    label: 'Pricing',
    className: 'bg-blue-50 text-blue-700 border border-blue-100',
  },
  Pending: {
    label: 'Pending',
    className: 'bg-orange-50 text-orange-700 border border-orange-100',
  },
  Quoted: {
    label: 'Quoted',
    className: 'bg-purple-50 text-purple-700 border border-purple-100',
  },
  Completed: {
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-600 border border-red-100',
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  );
}

function ModeBadge({ mode }) {
  const isAir = mode === 'Air';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isAir
          ? 'bg-sky-50 text-sky-600 border border-sky-100'
          : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
      }`}
    >
      {isAir ? <Plane size={11} /> : <Ship size={11} />}
      {mode}
    </span>
  );
}

function EnquiryTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Enquiry Overview</h2>
          <p className="text-xs text-gray-400 mt-0.5">Recent freight enquiries and their current status</p>
        </div>
        <button
          id="view-all-enquiries-btn"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          View All
        </button>
      </div>

      {/* Table (scrollable on mobile) */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Enquiry No.
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                POL
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                POD
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Mode
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {enquiriesData.map((enq, index) => (
              <tr
                key={enq.id}
                className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold text-blue-700 text-xs font-mono">{enq.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-700 font-medium">{enq.customer}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{enq.pol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{enq.pod}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ModeBadge mode={enq.mode} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={enq.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnquiryTable;
