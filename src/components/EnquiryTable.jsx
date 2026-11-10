
import { Ship, Plane } from 'lucide-react';

const statusConfig = {
  Pricing: {
    label: 'Pricing',
    className: 'bg-[#EDF2F7] text-[#354C63] border border-[#D6E0E9]',
  },
  Pending: {
    label: 'Pending',
    className: 'bg-[#FBF2E2] text-[#A87527] border border-[#F0DDB8]',
  },
  Quoted: {
    label: 'Quoted',
    className: 'bg-[#F0ECF5] text-[#745A91] border border-[#E1D7EC]',
  },
  Completed: {
    label: 'Completed',
    className: 'bg-[#E8F5EF] text-[#16845B] border border-[#C8E8D7]',
  },
  Rejected: {
    label: 'Rejected',
    className: 'bg-[#FCEEEE] text-[#C45151] border border-[#F3D0D0]',
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status || 'Pending',
    className: 'bg-[#F1F4F7] text-[#74808C] border border-[#E2E7ED]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  );
}

function ModeBadge({ mode }) {
  if (!mode) {
    return <span className="text-[#A0AAB4]">-</span>;
  }

  const isAir = mode.toLowerCase() === 'air';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${isAir
        ? 'bg-[#EDF2F7] text-[#647E96] border border-[#D6E0E9]'
        : 'bg-[#F0ECF5] text-[#745A91] border border-[#E1D7EC]'
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
    <div className="bg-white rounded-xl border border-[#E2E7ED] shadow-sm overflow-hidden">

      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E7ED]">
        <div>
          <h2 className="text-base font-semibold text-[#242A31]">
            Enquiry Overview
          </h2>

          <p className="text-xs text-[#74808C] mt-0.5">
            Recent freight enquiries and their current status
          </p>
        </div>

        <button
          id="view-all-enquiries-btn"
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-[#354C63] hover:text-white bg-[#EDF2F7] hover:bg-[#354C63] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Enquiry Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="bg-[#354C63]">
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
                  className="text-left px-6 py-3 text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E7ED]">
            {recentEnquiries.length > 0 ? (
              recentEnquiries.map((enq, index) => (
                <tr
                  key={enq.id || enq.enquiry_no || index}
                  className={`hover:bg-[#EEF2F6] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F7F9FB]'
                    }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-[#354C63] text-xs font-mono">
                      {getDisplayValue(enq.enquiry_no || enq.id)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-[#242A31] font-medium">
                      {getDisplayValue(enq.customer_name || enq.customer)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-[#596673]">
                    {getDisplayValue(enq.pol || enq.port_of_loading)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-[#596673]">
                    {getDisplayValue(enq.pod || enq.port_of_discharge)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <ModeBadge
                      mode={getDisplayValue(enq.mode || enq.transport_mode)}
                    />
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
                  className="px-6 py-10 text-center text-sm text-[#74808C]"
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
