
function EnquiryReportTable({ enquiries = [] }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-800">
                    Enquiry Report
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Overview of customer freight enquiries.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                'Enquiry No',
                                'Customer',
                                'POL',
                                'POD',
                                'Shipment Mode',
                                'Status',
                            ].map((heading) => (
                                <th
                                    key={heading}
                                    className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {enquiries.length > 0 ? (
                            enquiries.map((enq, index) => (
                                <tr
                                    key={enq.id || enq.enquiry_no || index}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4 font-medium text-blue-700 whitespace-nowrap">
                                        {enq.id || enq.enquiry_no || '—'}
                                    </td>
                                    <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                                        {enq.customer || enq.customer_name || '—'}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                        {enq.pol || '—'}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                        {enq.pod || '—'}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                        {enq.mode || enq.shipment_mode || '—'}
                                    </td>
                                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                        {enq.status || 'Pending'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-12 text-center text-sm text-gray-500"
                                >
                                    No enquiry records available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EnquiryReportTable;
