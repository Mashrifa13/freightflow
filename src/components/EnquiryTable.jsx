
import { Ship, Plane } from 'lucide-react';

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
  const config = statusConfig[status] || {
    label: status || 'Pending',
    className: 'bg-gray-50 text-gray-600 border border-gray-100',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  );
}

function ModeBadge({ mode }) {
  if (!mode) return <span className="text-gray-400">-</span>;

  const isAir = mode.toLowerCase() === 'air';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${isAir
        ? 'bg-sky-50 text-sky-600 border border-sky-100'
        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
        }`}
    >
      {isAir ? <Plane size={11} /> : <Ship size={11} />}
      {mode}
    </span>
  );
}

function getDisplayValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (typeof value === 'object') {
    return value.name || value.customer_name || value.label || '-';
  }

  return value;
}

function EnquiryTable({ enquiries = [], onViewAll }) {
  // Display the five most recently added enquiries.
  const recentEnquiries = [...enquiries].reverse().slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Enquiry Overview
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Recent freight enquiries and their current status
          </p>
        </div>

        <button
          id="view-all-enquiries-btn"
          onClick={onViewAll}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Enquiry Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              {[
                'Enquiry No.',
                'Customer',
                'POL',
                'POD',
                'Mode',
                'Status',
              ].map((heading) => (
                <th
                  key={heading}
                  className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {recentEnquiries.length > 0 ? (
              recentEnquiries.map((enq, index) => (
                <tr
                  key={enq.id || enq.enquiry_no || index}
                  className={`hover:bg-blue-50/40 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-blue-700 text-xs font-mono">
                      {getDisplayValue(enq.enquiry_no || enq.id)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-700 font-medium">
                      {getDisplayValue(enq.customer_name || enq.customer)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {getDisplayValue(enq.pol || enq.port_of_loading)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {getDisplayValue(enq.pod || enq.port_of_discharge)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <ModeBadge mode={getDisplayValue(enq.mode || enq.transport_mode)} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={enq.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-sm text-gray-400"
                >
                  No enquiries found. Create an enquiry to see it here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnquiryTable;
