import React, { useMemo, useState } from 'react';
import {
    ArrowLeft,
    Copy,
    Check,
    Mail,
    Phone,
    Pencil,
    Save,
    X,
    Lock,
    CircleCheck,
    Eye,
    EyeOff,
    KeyRound,
    LifeBuoy,
} from 'lucide-react';

// Replace with the real logged-in user (AuthContext / props) later
const defaultUser = {
    name: 'Pricing Executive',
    employeeId: 'FF-0042',
    designation: 'Pricing Executive',
    email: 'pricing.executive@company.com',
    phone: '',
    extension: '',
    department: 'Pricing',
    branch: 'Kochi',
    manager: 'Pricing Manager',
    role: 'Pricing Executive',
    status: 'Active',
    joinedOn: '2024-04-01',
    lastLogin: new Date().toISOString(),
    lastPasswordChange: '2026-08-15',
    permissions: [
        'dashboard',
        'customers',
        'agents',
        'enquiries',
        'rate-requests',
        'agent-quotations',
        'rate-comparison',
        'pricing',
        'customer-quotations',
        'reports',
    ],
};

const allModules = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'customers', label: 'Customers' },
    { id: 'agents', label: 'Agents' },
    { id: 'enquiries', label: 'Enquiries' },
    { id: 'rate-requests', label: 'Rate Requests' },
    { id: 'agent-quotations', label: 'Agent Quotations' },
    { id: 'rate-comparison', label: 'Rate Comparison' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'customer-quotations', label: 'Customer Quotations' },
    { id: 'reports', label: 'Reports' },
    { id: 'user-management', label: 'User Management' },
];

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : '-';

const formatDateTime = (value) =>
    value
        ? new Date(value).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '-';

/* ---------- Small helpers ---------- */

function Card({ title, subtitle, action, children }) {
    return (
        <div className="bg-white rounded-xl border border-[#E2E7ED]">
            <div className="flex items-start justify-between gap-3 p-5 border-b border-[#E2E7ED]">
                <div>
                    <h3 className="font-semibold text-[#242A31]">{title}</h3>
                    {subtitle && (
                        <p className="text-xs text-[#74808C] mt-1">{subtitle}</p>
                    )}
                </div>
                {action}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function Field({ label, value, locked = false }) {
    return (
        <div>
            <p className="text-xs text-[#74808C] mb-1 flex items-center gap-1">
                {label}
                {locked && <Lock size={11} className="text-[#AAB3BD]" />}
            </p>
            <p className="text-sm font-medium text-[#242A31] break-words">
                {value || '-'}
            </p>
        </div>
    );
}

// Decorative barcode drawn from the employee ID
function Barcode({ value }) {
    const bars = useMemo(() => {
        const widths = [];
        const source = `${value}-FF`;
        for (let i = 0; i < source.length; i++) {
            const code = source.charCodeAt(i);
            widths.push((code % 3) + 1, ((code >> 2) % 3) + 1);
        }
        return widths;
    }, [value]);

    return (
        <div className="flex items-stretch justify-center h-10 gap-[2px]" aria-hidden="true">
            {bars.map((w, i) => (
                <span
                    key={i}
                    className={i % 2 === 0 ? 'bg-[#242A31]' : 'bg-transparent'}
                    style={{ width: `${w * 1.5}px` }}
                />
            ))}
        </div>
    );
}

/* ---------- Page ---------- */

function ProfilePage({ user: userProp, onNavigate, onUpdateUser }) {
    const [user, setUser] = useState({ ...defaultUser, ...userProp });
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState('');

    // Contact edit
    const [editingContact, setEditingContact] = useState(false);
    const [contactForm, setContactForm] = useState({
        phone: user.phone,
        extension: user.extension,
    });
    const [contactError, setContactError] = useState('');

    // Password
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [pwError, setPwError] = useState('');

    const initials = user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(''), 3000);
    };

    const copyEmployeeId = async () => {
        try {
            await navigator.clipboard.writeText(user.employeeId);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard not available */
        }
    };

    /* Contact save */
    const saveContact = () => {
        const phone = contactForm.phone.trim();
        if (phone && !/^[0-9+\-\s()]{7,15}$/.test(phone)) {
            setContactError('Enter a valid phone number, for example +91 98765 43210.');
            return;
        }
        const updated = {
            ...user,
            phone,
            extension: contactForm.extension.trim(),
        };
        setUser(updated);
        onUpdateUser?.(updated);
        setEditingContact(false);
        setContactError('');
        showToast('Contact details updated.');
    };

    const cancelContact = () => {
        setContactForm({ phone: user.phone, extension: user.extension });
        setContactError('');
        setEditingContact(false);
    };

    /* Password */
    const passwordChecks = [
        { label: 'At least 8 characters', ok: pwForm.next.length >= 8 },
        { label: 'One number', ok: /\d/.test(pwForm.next) },
        { label: 'One uppercase letter', ok: /[A-Z]/.test(pwForm.next) },
    ];

    const submitPassword = (e) => {
        e.preventDefault();
        if (!pwForm.current) {
            setPwError('Enter your current password.');
            return;
        }
        if (!passwordChecks.every((c) => c.ok)) {
            setPwError('The new password does not meet all the requirements below.');
            return;
        }
        if (pwForm.next !== pwForm.confirm) {
            setPwError('The new password and confirmation do not match.');
            return;
        }
        // TODO: call the real change-password API here
        setPwForm({ current: '', next: '', confirm: '' });
        setPwError('');
        setUser((prev) => ({
            ...prev,
            lastPasswordChange: new Date().toISOString(),
        }));
        showToast('Password changed.');
    };

    const inputClass =
        'w-full border border-[#E2E7ED] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#647E96]';

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <button
                    onClick={() => onNavigate?.('dashboard')}
                    className="flex items-center gap-2 text-sm font-medium text-[#354C63] hover:underline mb-3"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </button>
                <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                <p className="text-sm text-gray-500 mt-1">
                    View your details and manage your account.
                </p>
            </div>

            {/* Toast */}
            {toast && (
                <div
                    role="status"
                    className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-[#14243A] text-white text-sm px-4 py-3 rounded-lg shadow-lg"
                >
                    <CircleCheck size={17} className="text-green-400" />
                    {toast}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* ================= LEFT: Badge + Account ================= */}
                <div className="space-y-5">

                    {/* Employee Badge */}
                    <div className="mx-auto w-full max-w-[300px] bg-white rounded-2xl border border-[#E2E7ED] shadow-md overflow-hidden">

                        {/* Header band */}
                        <div className="relative bg-[#14243A] px-5 pt-7 pb-14 text-center">
                            {/* Lanyard slot */}
                            <span className="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-white/25" />
                            <p className="text-white font-bold text-lg tracking-tight">
                                FreightFlow
                            </p>
                            <p className="text-white/50 text-xs mt-0.5">Employee ID Card</p>
                        </div>

                        {/* Avatar overlapping the band */}
                        <div className="relative -mt-10 flex justify-center">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-[#354C63] border-4 border-white flex items-center justify-center text-white text-2xl font-semibold">
                                    {initials}
                                </div>
                                <span
                                    title={user.status}
                                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="px-5 pt-3 pb-5 text-center">
                            <h3 className="text-lg font-bold text-[#242A31]">{user.name}</h3>
                            <p className="text-sm text-[#74808C]">{user.designation}</p>



                            {/* Employee ID */}
                            <div className="mt-3 flex items-center justify-center gap-2">
                                <span className="font-mono text-base font-semibold tracking-wider text-[#242A31]">
                                    {user.employeeId}
                                </span>
                                <button
                                    onClick={copyEmployeeId}
                                    title="Copy employee ID"
                                    aria-label="Copy employee ID"
                                    className="p-1.5 rounded-md text-[#74808C] hover:bg-[#F1F4F7]"
                                >
                                    {copied ? (
                                        <Check size={15} className="text-green-600" />
                                    ) : (
                                        <Copy size={15} />
                                    )}
                                </button>
                            </div>

                            {/* Department / Branch */}
                            <div className="mt-4 grid grid-cols-2 gap-3 text-left border-t border-[#E2E7ED] pt-4">
                                <div>
                                    <p className="text-xs text-[#74808C]">Department</p>
                                    <p className="text-sm font-medium text-[#242A31]">
                                        {user.department}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#74808C]">Branch</p>
                                    <p className="text-sm font-medium text-[#242A31]">
                                        {user.branch}
                                    </p>
                                </div>
                            </div>

                            {/* Barcode */}
                            <div className="mt-5 pt-4 border-t border-dashed border-[#D3DBE4]">
                                <Barcode value={user.employeeId} />
                            </div>
                        </div>
                    </div>

                    {/* Account */}
                    <Card title="Account">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Member since" value={formatDate(user.joinedOn)} />
                            <Field label="Status" value={user.status} />
                            <div className="col-span-2">
                                <Field label="Last login" value={formatDateTime(user.lastLogin)} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ================= RIGHT: Details ================= */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Personal Information */}
                    <Card
                        title="Personal Information"
                        subtitle="Your name and email are set by the administrator."
                        action={
                            !editingContact && (
                                <button
                                    onClick={() => setEditingContact(true)}
                                    className="flex items-center gap-1.5 text-sm font-medium text-[#354C63] hover:underline"
                                >
                                    <Pencil size={14} />
                                    Edit contact
                                </button>
                            )
                        }
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Full name" value={user.name} locked />
                            <Field label="Employee ID" value={user.employeeId} locked />
                            <div className="sm:col-span-2">
                                <p className="text-xs text-[#74808C] mb-1 flex items-center gap-1">
                                    <Mail size={12} /> Work email
                                    <Lock size={11} className="text-[#AAB3BD]" />
                                </p>
                                <p className="text-sm font-medium text-[#242A31]">
                                    {user.email}
                                </p>
                            </div>

                            {editingContact ? (
                                <>
                                    <div>
                                        <label className="block text-xs text-[#74808C] mb-1">
                                            Phone number
                                        </label>
                                        <input
                                            type="tel"
                                            value={contactForm.phone}
                                            onChange={(e) =>
                                                setContactForm((p) => ({ ...p, phone: e.target.value }))
                                            }
                                            placeholder="+91 98765 43210"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#74808C] mb-1">
                                            Extension
                                        </label>
                                        <input
                                            type="text"
                                            value={contactForm.extension}
                                            onChange={(e) =>
                                                setContactForm((p) => ({
                                                    ...p,
                                                    extension: e.target.value,
                                                }))
                                            }
                                            placeholder="e.g. 204"
                                            className={inputClass}
                                        />
                                    </div>

                                    {contactError && (
                                        <p className="sm:col-span-2 text-xs text-red-600">
                                            {contactError}
                                        </p>
                                    )}

                                    <div className="sm:col-span-2 flex justify-end gap-3 pt-2 border-t border-[#E2E7ED]">
                                        <button
                                            onClick={cancelContact}
                                            className="flex items-center gap-1.5 px-4 py-2 border border-[#E2E7ED] rounded-lg text-sm text-[#64707D] hover:bg-[#F7F9FB]"
                                        >
                                            <X size={15} />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={saveContact}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-[#354C63] text-white rounded-lg text-sm font-medium hover:bg-[#293D52]"
                                        >
                                            <Save size={15} />
                                            Save changes
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <p className="text-xs text-[#74808C] mb-1 flex items-center gap-1">
                                            <Phone size={12} /> Phone number
                                        </p>
                                        <p className="text-sm font-medium text-[#242A31]">
                                            {user.phone || 'Not added'}
                                        </p>
                                    </div>
                                    <Field label="Extension" value={user.extension || 'Not added'} />
                                </>
                            )}
                        </div>
                    </Card>

                    {/* Work Details */}
                    <Card
                        title="Work Details"
                        subtitle="Set by the administrator. Raise a ticket if something is wrong."
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Department" value={user.department} locked />
                            <Field label="Branch" value={user.branch} locked />
                            <Field label="Designation" value={user.designation} locked />
                            <Field label="Reporting manager" value={user.manager} locked />
                            <Field label="Role" value={user.role} locked />
                        </div>
                    </Card>

                    {/* My Access */}
                    <Card
                        title="My Access"
                        subtitle="The modules you can open in FreightFlow."
                        action={
                            <button
                                onClick={() => onNavigate?.('contact-support')}
                                className="flex items-center gap-1.5 text-sm font-medium text-[#354C63] hover:underline whitespace-nowrap"
                            >
                                <LifeBuoy size={15} />
                                Need more access?
                            </button>
                        }
                    >
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {allModules.map((module) => {
                                const hasAccess = user.permissions.includes(module.id);
                                return (
                                    <li
                                        key={module.id}
                                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border text-sm ${hasAccess
                                            ? 'border-[#E2E7ED] text-[#242A31]'
                                            : 'border-[#E2E7ED] bg-[#F7F9FB] text-[#AAB3BD]'
                                            }`}
                                    >
                                        <span>{module.label}</span>
                                        {hasAccess ? (
                                            <CircleCheck size={17} className="text-green-600" />
                                        ) : (
                                            <Lock size={15} />
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </Card>

                    {/* Security */}
                    <Card
                        title="Security"
                        subtitle={`Last password change: ${formatDate(user.lastPasswordChange)}`}
                    >
                        <form onSubmit={submitPassword} className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-[#424B55] mb-1.5">
                                    Current password
                                </label>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={pwForm.current}
                                    onChange={(e) =>
                                        setPwForm((p) => ({ ...p, current: e.target.value }))
                                    }
                                    autoComplete="current-password"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#424B55] mb-1.5">
                                    New password
                                </label>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={pwForm.next}
                                    onChange={(e) =>
                                        setPwForm((p) => ({ ...p, next: e.target.value }))
                                    }
                                    autoComplete="new-password"
                                    className={inputClass}
                                />
                                <ul className="mt-2 space-y-1">
                                    {passwordChecks.map((check) => (
                                        <li
                                            key={check.label}
                                            className={`flex items-center gap-2 text-xs ${check.ok ? 'text-green-700' : 'text-[#74808C]'
                                                }`}
                                        >
                                            <CircleCheck
                                                size={13}
                                                className={check.ok ? 'text-green-600' : 'text-[#D3DBE4]'}
                                            />
                                            {check.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#424B55] mb-1.5">
                                    Confirm new password
                                </label>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={pwForm.confirm}
                                    onChange={(e) =>
                                        setPwForm((p) => ({ ...p, confirm: e.target.value }))
                                    }
                                    autoComplete="new-password"
                                    className={inputClass}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowPw((s) => !s)}
                                className="flex items-center gap-2 text-xs font-medium text-[#64707D] hover:text-[#354C63]"
                            >
                                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                {showPw ? 'Hide passwords' : 'Show passwords'}
                            </button>

                            {pwError && <p className="text-xs text-red-600">{pwError}</p>}

                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#354C63] text-white rounded-lg text-sm font-medium hover:bg-[#293D52]"
                            >
                                <KeyRound size={16} />
                                Change password
                            </button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;