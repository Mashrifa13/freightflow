
function ReportCard({ title, value, icon: Icon }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-[#E2E7ED] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center gap-3">
                <p className="text-sm font-medium text-[#74808C]">
                    {title}
                </p>

                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] flex items-center justify-center">
                        <Icon size={20} className="text-[#354C63]" />
                    </div>
                )}
            </div>

            <h2 className="text-2xl font-bold text-[#242A31] mt-3">
                {value}
            </h2>
        </div>
    );
}

export default ReportCard;
