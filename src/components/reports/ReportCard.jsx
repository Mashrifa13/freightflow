function ReportCard({ title, value, icon: Icon }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{title}</p>
                {Icon && <Icon size={20} className="text-blue-600" />}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-3">
                {value}
            </h2>
        </div>
    );
}

export default ReportCard;