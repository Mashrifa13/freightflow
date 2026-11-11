
import React, { useMemo, useState } from 'react';
import {
    BookOpen,
    Ticket,
    Search,
    ChevronDown,
    CircleHelp,
    Printer,
    FileDown,
    Mail,
    ThumbsUp,
    ThumbsDown,
    AlertCircle,
    Plus,
    Eye,
    X,
    Paperclip,
    Send,
    Calendar,
} from 'lucide-react';

const supportArticles = [
    // Login & Access
    {
        id: 1,
        category: 'Login & Access',
        title: 'Unable to log in to FreightFlow',
        problem: 'You cannot access your FreightFlow account.',
        cause: 'Incorrect credentials, an expired session or an account access issue.',
        solution: [
            'Check that your username and password are correct.',
            'Check whether Caps Lock is enabled.',
            'Refresh the page and try logging in again.',
            'If your password is incorrect, contact the administrator for assistance.',
        ],
    },
    {
        id: 2,
        category: 'Login & Access',
        title: 'Session expired or automatically logged out',
        problem: 'FreightFlow logs you out while you are working.',
        cause: 'Your login session may have expired.',
        solution: [
            'Log in to FreightFlow again.',
            'Avoid leaving the application inactive for long periods.',
            'If the issue happens frequently, contact the IT team.',
        ],
    },

    // Dashboard
    {
        id: 3,
        category: 'Dashboard',
        title: 'Dashboard data is not updating',
        problem: 'New records are not reflected in the dashboard.',
        cause: 'The page may contain outdated information or the record may not have been saved.',
        solution: [
            'Refresh the dashboard.',
            'Open the relevant module and verify that the record exists.',
            'Check whether the record has the expected status.',
            'If the dashboard still does not update, raise a ticket.',
        ],
    },

    // Customers
    {
        id: 4,
        category: 'Customers',
        title: 'Unable to create a customer',
        problem: 'You cannot save a new customer record.',
        cause: 'Required fields may be missing or the customer information may be invalid.',
        solution: [
            'Open Customer Management.',
            'Click Add Customer.',
            'Complete all required fields.',
            'Check the email address and contact details.',
            'Click Save again.',
        ],
    },
    {
        id: 5,
        category: 'Customers',
        title: 'Unable to edit or delete a customer',
        problem: 'The customer record cannot be updated or deleted.',
        cause: 'The record may be linked to existing enquiries or you may not have permission.',
        solution: [
            'Open Customer Management.',
            'Search for the required customer.',
            'Open the record and try editing it.',
            'Check whether the customer is linked to existing transactions.',
            'Contact the administrator if the action is restricted.',
        ],
    },

    // Agents
    {
        id: 6,
        category: 'Agents',
        title: 'Agent is not appearing in the selection list',
        problem: 'An agent is missing when creating a rate request.',
        cause: 'The agent may not have been saved or may be inactive.',
        solution: [
            'Open Agent Management.',
            'Search for the agent.',
            'Check whether the agent record exists and is active.',
            'Refresh the rate request form.',
            'Try selecting the agent again.',
        ],
    },
    {
        id: 7,
        category: 'Agents',
        title: 'Unable to save agent details',
        problem: 'Changes to agent information are not being saved.',
        cause: 'Required information may be missing or invalid.',
        solution: [
            'Open the agent record.',
            'Check all required fields.',
            'Verify the contact and email details.',
            'Click Save again.',
        ],
    },

    // Enquiries
    {
        id: 8,
        category: 'Enquiries',
        title: 'Unable to create or save an enquiry',
        problem: 'The enquiry form does not save successfully.',
        cause: 'Required customer, shipment or cargo information may be missing.',
        solution: [
            'Open Enquiries and click Create Enquiry.',
            'Select a customer.',
            'Complete the shipment mode and route details.',
            'Enter the required cargo information.',
            'Check all mandatory fields and save again.',
        ],
    },
    {
        id: 9,
        category: 'Enquiries',
        title: 'Enquiry is missing from the list',
        problem: 'A recently created enquiry is not visible.',
        cause: 'The enquiry may not have been saved or a filter may be hiding it.',
        solution: [
            'Refresh the Enquiries page.',
            'Clear the search field.',
            'Reset the status and date filters.',
            'Search using the enquiry number.',
            'If it is still missing, raise a ticket.',
        ],
    },
    {
        id: 10,
        category: 'Enquiries',
        title: 'Enquiry status is not updating',
        problem: 'The enquiry continues to show an old status.',
        cause: 'The related rate request, pricing or quotation action may not have updated the enquiry.',
        solution: [
            'Refresh the Enquiries page.',
            'Open the enquiry and check its related records.',
            'Verify the latest rate request or quotation status.',
            'If the status remains incorrect, contact the IT team.',
        ],
    },

    // Rate Requests
    {
        id: 11,
        category: 'Rate Requests',
        title: 'Unable to select an enquiry in Rate Request',
        problem: 'The enquiry does not appear in the selection dropdown.',
        cause: 'The enquiry may already be unavailable for selection or the list may be outdated.',
        solution: [
            'Verify that the enquiry exists in Enquiries.',
            'Check whether the enquiry has the required status.',
            'Refresh the Rate Request form.',
            'Try searching using the enquiry number.',
            'Raise a ticket if the enquiry is still missing.',
        ],
    },
    {
        id: 12,
        category: 'Rate Requests',
        title: 'Unable to select agents in Rate Request',
        problem: 'You cannot find or select the required agents.',
        cause: 'The agent may be inactive or missing from Agent Management.',
        solution: [
            'Check the agent in Agent Management.',
            'Verify that the agent is active.',
            'Refresh the Rate Request form.',
            'Search for the agent again.',
        ],
    },
    {
        id: 13,
        category: 'Rate Requests',
        title: 'Rate Request is not saving',
        problem: 'The rate request cannot be submitted.',
        cause: 'Required enquiry, agent or deadline information may be missing.',
        solution: [
            'Select a valid enquiry.',
            'Select at least one agent.',
            'Check the response deadline.',
            'Complete all required fields.',
            'Submit the request again.',
        ],
    },

    // Agent Quotations
    {
        id: 14,
        category: 'Agent Quotations',
        title: 'Unable to add an agent quotation',
        problem: 'You cannot create a quotation against a rate request.',
        cause: 'The rate request or agent selection may be invalid.',
        solution: [
            'Open Agent Quotations.',
            'Click Add Agent Quotation.',
            'Select the correct rate request.',
            'Select the corresponding agent.',
            'Enter the required charge details.',
            'Save the quotation.',
        ],
    },
    {
        id: 15,
        category: 'Agent Quotations',
        title: 'Agent quotation is not appearing in Pricing',
        problem: 'A saved agent quotation is missing when creating pricing.',
        cause: 'The quotation may be linked to a different enquiry or may not have been saved correctly.',
        solution: [
            'Open Agent Quotations.',
            'Search for the quotation number.',
            'Verify its enquiry number and status.',
            'Open Pricing and select the same enquiry.',
            'Refresh the form and check the quotation list.',
        ],
    },
    {
        id: 16,
        category: 'Agent Quotations',
        title: 'Incorrect quotation total',
        problem: 'The total buying rate does not match the entered charges.',
        cause: 'One or more charge amounts may be incorrect or missing.',
        solution: [
            'Open the agent quotation.',
            'Review freight charges.',
            'Review origin and destination charges.',
            'Check other charges and their amounts.',
            'Verify the currency and total calculation.',
            'Save the corrected quotation.',
        ],
    },

    // Rate Comparison
    {
        id: 17,
        category: 'Rate Comparison',
        title: 'Unable to select an enquiry in Rate Comparison',
        problem: 'The enquiry does not appear when creating a comparison.',
        cause: 'The enquiry may not have any agent quotations available.',
        solution: [
            'Verify that the enquiry exists.',
            'Check whether agent quotations have been received for that enquiry.',
            'Ensure the quotations are linked to the correct enquiry.',
            'Refresh the comparison form.',
            'If the enquiry is still unavailable, raise a ticket.',
        ],
    },
    {
        id: 18,
        category: 'Rate Comparison',
        title: 'Agent quotations are missing from comparison',
        problem: 'One or more agent quotations are not displayed.',
        cause: 'The quotations may belong to a different enquiry or may not have been saved.',
        solution: [
            'Open Agent Quotations.',
            'Verify the enquiry number on each quotation.',
            'Check that the quotations are saved.',
            'Return to Rate Comparison and select the correct enquiry.',
            'Refresh the comparison form.',
        ],
    },

    // Pricing
    {
        id: 19,
        category: 'Pricing',
        title: 'Unable to select an agent quotation in Pricing',
        problem: 'The required agent quotation is not available.',
        cause: 'The quotation may not be linked to the selected enquiry.',
        solution: [
            'Verify the selected enquiry.',
            'Open Agent Quotations and check the quotation number.',
            'Confirm that the quotation belongs to the same enquiry.',
            'Refresh the Pricing form.',
            'Select the quotation again.',
        ],
    },
    {
        id: 20,
        category: 'Pricing',
        title: 'Selling price is incorrect',
        problem: 'The calculated selling price is not as expected.',
        cause: 'The buying cost, margin or additional charges may be incorrect.',
        solution: [
            'Open the pricing record.',
            'Review the selected agent quotation.',
            'Check all buying charges.',
            'Verify the margin entered.',
            'Review the final selling price before saving.',
        ],
    },
    {
        id: 21,
        category: 'Pricing',
        title: 'Unable to save a pricing record',
        problem: 'The pricing form cannot be saved.',
        cause: 'Required enquiry, quotation or selling price information may be missing.',
        solution: [
            'Select the correct enquiry.',
            'Verify the selected quotation if applicable.',
            'Check the selling price and margin.',
            'Complete all required fields.',
            'Try saving again.',
        ],
    },

    // Customer Quotations
    {
        id: 22,
        category: 'Customer Quotations',
        title: 'Unable to create a customer quotation',
        problem: 'The customer quotation cannot be created.',
        cause: 'The pricing record may be missing or incomplete.',
        solution: [
            'Open Customer Quotations.',
            'Click Create Customer Quotation.',
            'Select the correct pricing record.',
            'Verify the customer and shipment details.',
            'Review the quotation charges and save.',
        ],
    },
    {
        id: 23,
        category: 'Customer Quotations',
        title: 'Customer quotation details are incorrect',
        problem: 'The quotation displays incorrect customer, shipment or charge information.',
        cause: 'The linked pricing record may contain incorrect information.',
        solution: [
            'Open the customer quotation.',
            'Verify the customer and enquiry details.',
            'Review the linked pricing record.',
            'Check the charge descriptions and amounts.',
            'Correct the details if editing is available.',
        ],
    },

    // Printing & PDF
    {
        id: 24,
        category: 'Printing & PDF',
        title: 'Unable to print a customer quotation',
        problem: 'Clicking the Print button does not open the print window.',
        cause: 'Browser pop-up settings, print settings or a page error may prevent printing.',
        solution: [
            'Open Customer Quotations.',
            'Open the required quotation.',
            'Click the Print button.',
            'Allow pop-ups for FreightFlow if your browser blocks them.',
            'Check whether the browser print preview opens.',
            'Select the correct printer and try again.',
            'If printing still fails, raise a support ticket.',
        ],
    },
    {
        id: 25,
        category: 'Printing & PDF',
        title: 'Print preview is blank or missing quotation details',
        problem: 'The print preview opens, but the quotation content is missing.',
        cause: 'The print layout or quotation data may not be loading correctly.',
        solution: [
            'Close the print preview.',
            'Refresh the quotation details page.',
            'Verify that all quotation information is visible on screen.',
            'Click Print again.',
            'If the preview is still blank, raise a ticket with the quotation number.',
        ],
    },
    {
        id: 26,
        category: 'Printing & PDF',
        title: 'Unable to download quotation as PDF',
        problem: 'The quotation PDF does not download.',
        cause: 'Browser download permissions or PDF generation issues may be responsible.',
        solution: [
            'Open the required customer quotation.',
            'Try the PDF download option again.',
            'Check your browser downloads folder.',
            'Allow downloads for FreightFlow if blocked.',
            'Try another browser if the problem continues.',
            'Raise a ticket if the PDF still cannot be generated.',
        ],
    },
    {
        id: 27,
        category: 'Printing & PDF',
        title: 'Quotation print layout is incorrect',
        problem: 'The printed quotation has cut-off text, missing sections or incorrect page breaks.',
        cause: 'The print layout or browser page settings may be incorrect.',
        solution: [
            'Open the quotation print preview.',
            'Check the paper size and orientation.',
            'Try adjusting the scale to fit the page.',
            'Verify that the margins are appropriate.',
            'If the layout remains incorrect, raise a ticket.',
        ],
    },

    // Email
    {
        id: 28,
        category: 'Email',
        title: 'Unable to send a customer quotation by email',
        problem: 'The quotation email cannot be sent.',
        cause: 'The recipient address may be invalid or the email service may be unavailable.',
        solution: [
            'Open the customer quotation.',
            'Verify the customer email address.',
            'Check the email subject and message.',
            'Try sending the quotation again.',
            'If sending fails, contact the IT team.',
        ],
    },
    {
        id: 29,
        category: 'Email',
        title: 'Email preview is not displaying correctly',
        problem: 'The email preview is blank or the quotation details are missing.',
        cause: 'The email template or quotation information may not have loaded.',
        solution: [
            'Close the email preview.',
            'Refresh the quotation details page.',
            'Open the email preview again.',
            'Verify the recipient and quotation details.',
            'Raise a ticket if the issue continues.',
        ],
    },

    // Reports
    {
        id: 30,
        category: 'Reports',
        title: 'Report filters are not working',
        problem: 'Selecting filters does not update the report.',
        cause: 'The filter selection or report data may not have refreshed.',
        solution: [
            'Open the relevant report.',
            'Clear all existing filters.',
            'Select the required date range and other filters again.',
            'Click Apply or Search if available.',
            'Refresh the report and check the results.',
        ],
    },
    {
        id: 31,
        category: 'Reports',
        title: 'Report data is incorrect or missing',
        problem: 'The report does not show the expected records.',
        cause: 'The selected date range, status or other filters may exclude records.',
        solution: [
            'Clear the report filters.',
            'Check the selected date range.',
            'Verify the record in its original module.',
            'Apply the filters again.',
            'Raise a ticket if the report still shows incorrect data.',
        ],
    },

    // General Technical Issues
    {
        id: 32,
        category: 'General Technical Issues',
        title: 'FreightFlow page is not loading',
        problem: 'A page remains blank, frozen or takes too long to load.',
        cause: 'An internet connection, browser or application issue may be responsible.',
        solution: [
            'Check your internet connection.',
            'Refresh the page.',
            'Try opening FreightFlow in another browser tab.',
            'Close unnecessary browser tabs.',
            'If the issue continues, raise a support ticket.',
        ],
    },
    {
        id: 33,
        category: 'General Technical Issues',
        title: 'Changes are not saved after refreshing',
        problem: 'Your recent changes disappear after refreshing the page.',
        cause: 'The save action may not have completed successfully.',
        solution: [
            'Open the relevant module again.',
            'Check whether the updated record is available.',
            'Make the changes again if necessary.',
            'Wait for the save operation to complete before leaving the page.',
            'Raise a ticket if changes continue to disappear.',
        ],
    },
    {
        id: 34,
        category: 'General Technical Issues',
        title: 'Search or dropdown selection is not working',
        problem: 'You cannot search for or select an item from a dropdown.',
        cause: 'The list may not have loaded or the selected item may not be available.',
        solution: [
            'Clear the search text.',
            'Refresh the form.',
            'Check whether the required record exists in its module.',
            'Try searching using a different part of its name or ID.',
            'Raise a ticket if the dropdown remains unresponsive.',
        ],
    },
];

const categories = [
    'All',
    'Login & Access',
    'Dashboard',
    'Customers',
    'Agents',
    'Enquiries',
    'Rate Requests',
    'Agent Quotations',
    'Rate Comparison',
    'Pricing',
    'Customer Quotations',
    'Printing & PDF',
    'Email',
    'Reports',
    'General Technical Issues',
];

function ContactSupport() {
    const [activeTab, setActiveTab] = useState('self-service');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedArticle, setExpandedArticle] = useState(null);
    const [feedback, setFeedback] = useState({});
    const [tickets, setTickets] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('ff_support_tickets')) || [];
        } catch {
            return [];
        }
    });

    const [ticketForm, setTicketForm] = useState({
        subject: '',
        category: '',
        module: '',
        priority: 'Medium',
        description: '',
        attachment: '',
    });

    const [viewingTicket, setViewingTicket] = useState(null);
    const [showTicketForm, setShowTicketForm] = useState(false);

    const filteredArticles = useMemo(() => {
        return supportArticles.filter((article) => {
            const matchesCategory =
                selectedCategory === 'All' ||
                article.category === selectedCategory;

            const searchableText = [
                article.title,
                article.category,
                article.problem,
                article.cause,
                ...article.solution,
            ].join(' ').toLowerCase();

            const matchesSearch = searchableText.includes(
                searchTerm.trim().toLowerCase()
            );

            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedCategory]);

    const handleRaiseTicket = () => {
        setActiveTab('raise-ticket');
    };

    React.useEffect(() => {
        localStorage.setItem('ff_support_tickets', JSON.stringify(tickets));
    }, [tickets]);

    const handleTicketChange = (e) => {
        const { name, value } = e.target;

        setTicketForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const generateTicketId = () => {
        const year = new Date().getFullYear();

        const lastNumber = tickets.reduce((max, ticket) => {
            const match = ticket.ticket_no?.match(
                new RegExp(`^TKT-${year}-(\\d+)$`)
            );

            return match ? Math.max(max, Number(match[1])) : max;
        }, 0);

        return `TKT-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
    };

    const handleTicketSubmit = (e) => {
        e.preventDefault();

        const newTicket = {
            id: Date.now(),
            ticket_no: generateTicketId(),
            ...ticketForm,
            status: 'Open',
            created_at: new Date().toISOString(),
            assigned_to: 'Unassigned',
        };

        setTickets((prev) => [newTicket, ...prev]);

        setTicketForm({
            subject: '',
            category: '',
            module: '',
            priority: 'Medium',
            description: '',
            attachment: '',
        });

        setShowTicketForm(false);
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div>
                <h2 className="text-xl font-bold text-[#242A31] tracking-tight flex items-center gap-2">
                    <CircleHelp className="text-[#354C63]" size={24} />
                    Contact Support
                </h2>
                <p className="text-xs text-[#74808C] mt-0.5">
                    Find solutions or get assistance from the IT team.
                </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-[#E2E7ED] p-2 flex gap-2">
                <button
                    onClick={() => setActiveTab('self-service')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'self-service'
                        ? 'bg-[#354C63] text-white shadow-sm'
                        : 'text-[#74808C] hover:bg-[#F1F4F7]'
                        }`}
                >
                    <BookOpen size={18} />
                    Self-Service
                </button>

                <button
                    onClick={() => setActiveTab('raise-ticket')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'raise-ticket'
                        ? 'bg-[#354C63] text-white shadow-sm'
                        : 'text-[#74808C] hover:bg-[#F1F4F7]'
                        }`}
                >
                    <Ticket size={18} />
                    Raise a Ticket
                </button>
            </div>

            {/* Self-Service Tab */}
            {activeTab === 'self-service' && (
                <div key="self-service" className="space-y-6 tab-content-animation">



                    {/* Categories */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#424B55] mb-3">
                            Browse by Category
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setExpandedArticle(null);
                                    }}
                                    className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-200 ${selectedCategory === category
                                        ? 'bg-[#354C63] text-white border-[#354C63]'
                                        : 'bg-white text-[#64707D] border-[#E2E7ED] hover:bg-[#F1F4F7]'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Article List */}
                    <div className="bg-white rounded-xl border border-[#E2E7ED] p-6">
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div>
                                <h3 className="text-base font-semibold text-[#242A31]">
                                    Troubleshooting Articles
                                </h3>
                                <p className="text-xs text-[#74808C] mt-1">
                                    Find step-by-step solutions to common problems.
                                </p>
                            </div>

                            <span className="text-xs text-[#74808C] whitespace-nowrap">
                                {filteredArticles.length} found
                            </span>
                        </div>

                        <div className="space-y-3">
                            {filteredArticles.map((article) => {
                                const isExpanded = expandedArticle === article.id;

                                return (
                                    <div
                                        key={article.id}
                                        className="border border-[#E2E7ED] rounded-xl overflow-hidden"
                                    >
                                        {/* Article Heading */}
                                        <button
                                            onClick={() =>
                                                setExpandedArticle(
                                                    isExpanded ? null : article.id
                                                )
                                            }
                                            className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-[#F7F9FB] transition-colors"
                                        >
                                            <div className="min-w-0">
                                                <span className="text-xs font-medium text-[#647E96]">
                                                    {article.category}
                                                </span>

                                                <h4 className="text-sm font-semibold text-[#242A31] mt-1">
                                                    {article.title}
                                                </h4>
                                            </div>

                                            <ChevronDown
                                                size={19}
                                                className={`text-[#74808C] flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>

                                        {/* Article Details */}
                                        {isExpanded && (
                                            <div className="px-4 pb-5 border-t border-[#E2E7ED]">

                                                {/* Problem */}
                                                <div className="mt-4">
                                                    <h5 className="text-sm font-semibold text-[#424B55] mb-2">
                                                        Problem
                                                    </h5>
                                                    <p className="text-sm text-[#74808C] leading-6">
                                                        {article.problem}
                                                    </p>
                                                </div>

                                                {/* Possible Cause */}
                                                <div className="mt-4">
                                                    <h5 className="text-sm font-semibold text-[#424B55] mb-2">
                                                        Possible Cause
                                                    </h5>
                                                    <div className="flex items-start gap-2 bg-[#F7F9FB] rounded-lg p-3">
                                                        <AlertCircle
                                                            size={17}
                                                            className="text-[#647E96] flex-shrink-0 mt-0.5"
                                                        />
                                                        <p className="text-sm text-[#64707D] leading-6">
                                                            {article.cause}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Solution */}
                                                <div className="mt-4">
                                                    <h5 className="text-sm font-semibold text-[#424B55] mb-3">
                                                        Solution Steps
                                                    </h5>

                                                    <ol className="space-y-3">
                                                        {article.solution.map((step, index) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-start gap-3 text-sm text-[#64707D]"
                                                            >
                                                                <span className="w-6 h-6 rounded-full bg-[#354C63]/10 text-[#354C63] flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                                                    {index + 1}
                                                                </span>

                                                                <span className="pt-1 leading-5">
                                                                    {step}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>

                                                {/* Feedback */}
                                                <div className="mt-5 pt-4 border-t border-[#E2E7ED]">
                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        <p className="text-sm font-medium text-[#424B55]">
                                                            Was this article helpful?
                                                        </p>

                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    setFeedback((prev) => ({
                                                                        ...prev,
                                                                        [article.id]: 'yes',
                                                                    }))
                                                                }
                                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${feedback[article.id] === 'yes'
                                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                                    : 'border-[#E2E7ED] text-[#64707D] hover:bg-[#F7F9FB]'
                                                                    }`}
                                                            >
                                                                <ThumbsUp size={14} />
                                                                Yes
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    setFeedback((prev) => ({
                                                                        ...prev,
                                                                        [article.id]: 'no',
                                                                    }))
                                                                }
                                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${feedback[article.id] === 'no'
                                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                                    : 'border-[#E2E7ED] text-[#64707D] hover:bg-[#F7F9FB]'
                                                                    }`}
                                                            >
                                                                <ThumbsDown size={14} />
                                                                No
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {feedback[article.id] && (
                                                        <p className="text-xs text-[#16845B] mt-2">
                                                            Thank you for your feedback!
                                                        </p>
                                                    )}

                                                    <div className="mt-4 flex justify-end">
                                                        <button
                                                            onClick={handleRaiseTicket}
                                                            className="flex items-center gap-2 text-sm font-semibold text-[#354C63] hover:underline"
                                                        >
                                                            <Ticket size={16} />
                                                            Still need help? Raise a Ticket
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Empty State */}
                            {filteredArticles.length === 0 && (
                                <div className="text-center py-12">
                                    <Search
                                        size={32}
                                        className="mx-auto text-[#AAB3BD] mb-3"
                                    />

                                    <p className="text-sm font-semibold text-[#424B55]">
                                        No articles found
                                    </p>

                                    <p className="text-sm text-[#74808C] mt-1">
                                        Try a different search term or category.
                                    </p>

                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('All');
                                        }}
                                        className="mt-4 text-sm font-semibold text-[#354C63] hover:underline"
                                    >
                                        Clear Search
                                    </button>

                                    <div>
                                        <button
                                            onClick={handleRaiseTicket}
                                            className="mt-3 text-sm font-semibold text-[#354C63] hover:underline"
                                        >
                                            Raise a Support Ticket
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* Raise Ticket Tab */}
            {activeTab === 'raise-ticket' && (
                <div key="raise-ticket" className="space-y-6 tab-content-animation">

                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-[#242A31]">
                                Support Tickets
                            </h2>
                            <p className="text-sm text-[#74808C] mt-1">
                                Submit an issue and track its progress.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setViewingTicket(null);
                                setShowTicketForm(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#354C63] text-white rounded-lg text-sm font-medium hover:bg-[#293D52] transition"
                        >
                            <Plus size={17} />
                            Raise New Ticket
                        </button>
                    </div>

                    {/* Ticket Form */}
                    {showTicketForm && (
                        <form
                            onSubmit={handleTicketSubmit}
                            className="bg-white border border-[#E2E7ED] rounded-xl p-6 space-y-5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-[#242A31]">
                                        Create Support Ticket
                                    </h3>
                                    <p className="text-sm text-[#74808C] mt-1">
                                        Provide details about the issue you are experiencing.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowTicketForm(false)}
                                    className="text-[#74808C] hover:text-red-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-[#424B55] mb-2">
                                    Subject <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={ticketForm.subject}
                                    onChange={handleTicketChange}
                                    required
                                    placeholder="Briefly describe your issue"
                                    className="w-full border border-[#E2E7ED] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#647E96]"
                                />
                            </div>

                            {/* Category and Module */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-[#424B55] mb-2">
                                        Issue Category <span className="text-red-500">*</span>
                                    </label>

                                    <select
                                        name="category"
                                        value={ticketForm.category}
                                        onChange={handleTicketChange}
                                        required
                                        className="w-full border border-[#E2E7ED] rounded-lg px-4 py-3 text-sm bg-white outline-none focus:border-[#647E96]"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Bug">Bug / Error</option>
                                        <option value="Technical">Technical Issue</option>
                                        <option value="Access">Login / Access</option>
                                        <option value="Feature Request">Feature Request</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#424B55] mb-2">
                                        Related Module <span className="text-red-500">*</span>
                                    </label>

                                    <select
                                        name="module"
                                        value={ticketForm.module}
                                        onChange={handleTicketChange}
                                        required
                                        className="w-full border border-[#E2E7ED] rounded-lg px-4 py-3 text-sm bg-white outline-none focus:border-[#647E96]"
                                    >
                                        <option value="">Select Module</option>
                                        {[
                                            'Login & Access',
                                            'Dashboard',
                                            'Customers',
                                            'Agents',
                                            'Enquiries',
                                            'Rate Requests',
                                            'Agent Quotations',
                                            'Rate Comparison',
                                            'Pricing',
                                            'Customer Quotations',
                                            'Printing & PDF',
                                            'Email',
                                            'Reports',
                                            'General',
                                        ].map((module) => (
                                            <option key={module} value={module}>
                                                {module}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-[#424B55] mb-2">
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={ticketForm.priority}
                                    onChange={handleTicketChange}
                                    className="w-full md:w-1/2 border border-[#E2E7ED] rounded-lg px-4 py-3 text-sm bg-white outline-none focus:border-[#647E96]"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-[#424B55] mb-2">
                                    Issue Description <span className="text-red-500">*</span>
                                </label>

                                <textarea
                                    name="description"
                                    value={ticketForm.description}
                                    onChange={handleTicketChange}
                                    required
                                    rows={5}
                                    placeholder="Explain the issue, steps to reproduce it and any error message..."
                                    className="w-full border border-[#E2E7ED] rounded-lg px-4 py-3 text-sm outline-none resize-y focus:border-[#647E96]"
                                />
                            </div>

                            {/* Attachment */}
                            <div>
                                <label className="block text-sm font-medium text-[#424B55] mb-2">
                                    Attachment
                                </label>

                                <label className="flex items-center gap-2 w-fit px-4 py-3 border border-dashed border-[#D3DBE4] rounded-lg cursor-pointer hover:bg-[#F7F9FB] text-sm text-[#64707D]">
                                    <Paperclip size={17} />
                                    Choose File

                                    <input
                                        type="file"
                                        accept="image/*,.pdf,.doc,.docx"
                                        className="hidden"
                                        onChange={(e) =>
                                            setTicketForm((prev) => ({
                                                ...prev,
                                                attachment: e.target.files?.[0]?.name || '',
                                            }))
                                        }
                                    />
                                </label>

                                {ticketForm.attachment && (
                                    <p className="text-xs text-[#74808C] mt-2">
                                        Selected: {ticketForm.attachment}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E7ED]">
                                <button
                                    type="button"
                                    onClick={() => setShowTicketForm(false)}
                                    className="px-5 py-2.5 border border-[#E2E7ED] rounded-lg text-sm text-[#64707D] hover:bg-[#F7F9FB]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#354C63] text-white rounded-lg text-sm font-medium hover:bg-[#293D52]"
                                >
                                    <Send size={16} />
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    )}

                    {/* My Tickets */}
                    <div className="bg-white border border-[#E2E7ED] rounded-xl overflow-hidden">
                        <div className="p-5 border-b border-[#E2E7ED]">
                            <h3 className="font-semibold text-[#242A31]">
                                My Tickets
                            </h3>
                            <p className="text-sm text-[#74808C] mt-1">
                                View and track your submitted support requests.
                            </p>
                        </div>

                        {tickets.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-[#354C63] text-white">
                                        <tr>
                                            <th className="px-5 py-3 font-medium">Ticket ID</th>
                                            <th className="px-5 py-3 font-medium">Subject</th>
                                            <th className="px-5 py-3 font-medium">Module</th>
                                            <th className="px-5 py-3 font-medium">Priority</th>
                                            <th className="px-5 py-3 font-medium">Created</th>
                                            <th className="px-5 py-3 font-medium">Status</th>
                                            <th className="px-5 py-3 font-medium text-center">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#E2E7ED]">
                                        {tickets.map((ticket) => (
                                            <tr key={ticket.id} className="hover:bg-[#F7F9FB]">
                                                <td className="px-5 py-4 font-medium text-[#354C63] whitespace-nowrap">
                                                    {ticket.ticket_no}
                                                </td>

                                                <td className="px-5 py-4 text-[#424B55] min-w-[180px]">
                                                    {ticket.subject}
                                                </td>

                                                <td className="px-5 py-4 text-[#64707D] whitespace-nowrap">
                                                    {ticket.module}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ticket.priority === 'Critical'
                                                        ? 'bg-red-50 text-red-700'
                                                        : ticket.priority === 'High'
                                                            ? 'bg-orange-50 text-orange-700'
                                                            : ticket.priority === 'Medium'
                                                                ? 'bg-yellow-50 text-yellow-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {ticket.priority}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-[#64707D] whitespace-nowrap">
                                                    {new Date(ticket.created_at).toLocaleDateString()}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ticket.status === 'Resolved'
                                                        ? 'bg-green-50 text-green-700'
                                                        : ticket.status === 'In Progress'
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : ticket.status === 'Closed'
                                                                ? 'bg-gray-100 text-gray-700'
                                                                : 'bg-yellow-50 text-yellow-700'
                                                        }`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-center">
                                                    <button
                                                        onClick={() => setViewingTicket(ticket)}
                                                        className="p-2 rounded-lg text-[#647E96] hover:bg-[#F1F4F7]"
                                                        title="View Ticket"
                                                    >
                                                        <Eye size={17} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Ticket
                                    size={34}
                                    className="mx-auto text-[#AAB3BD] mb-3"
                                />
                                <p className="text-sm font-semibold text-[#424B55]">
                                    No tickets submitted yet
                                </p>
                                <p className="text-sm text-[#74808C] mt-1">
                                    Your support tickets will appear here.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Ticket Details Modal */}
                    {viewingTicket && (
                        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                                <div className="flex items-center justify-between p-5 border-b border-[#E2E7ED]">
                                    <div>
                                        <h3 className="font-semibold text-[#242A31]">
                                            Ticket Details
                                        </h3>
                                        <p className="text-xs text-[#74808C] mt-1">
                                            {viewingTicket.ticket_no}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setViewingTicket(null)}
                                        className="p-2 text-[#74808C] hover:bg-[#F1F4F7] rounded-lg"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-5">
                                    <div>
                                        <p className="text-xs text-[#74808C] mb-1">Subject</p>
                                        <p className="text-sm font-semibold text-[#242A31]">
                                            {viewingTicket.subject}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <p className="text-xs text-[#74808C] mb-1">Category</p>
                                            <p className="text-sm text-[#424B55]">
                                                {viewingTicket.category}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-[#74808C] mb-1">Module</p>
                                            <p className="text-sm text-[#424B55]">
                                                {viewingTicket.module}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-[#74808C] mb-1">Priority</p>
                                            <p className="text-sm text-[#424B55]">
                                                {viewingTicket.priority}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-[#74808C] mb-1">Status</p>
                                            <p className="text-sm text-[#424B55]">
                                                {viewingTicket.status}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-[#74808C] mb-1">Created Date</p>
                                            <p className="text-sm text-[#424B55]">
                                                {new Date(viewingTicket.created_at).toLocaleString()}
                                            </p>
                                        </div>


                                    </div>

                                    <div>
                                        <p className="text-xs text-[#74808C] mb-2">
                                            Description
                                        </p>
                                        <div className="bg-[#F7F9FB] rounded-lg p-4 text-sm text-[#424B55] whitespace-pre-wrap">
                                            {viewingTicket.description}
                                        </div>
                                    </div>

                                    {viewingTicket.attachment && (
                                        <div>
                                            <p className="text-xs text-[#74808C] mb-2">
                                                Attachment
                                            </p>
                                            <p className="text-sm text-[#354C63]">
                                                <Paperclip size={15} className="inline mr-1" />
                                                {viewingTicket.attachment}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 border-t border-[#E2E7ED] flex justify-end">
                                    <button
                                        onClick={() => setViewingTicket(null)}
                                        className="px-5 py-2.5 bg-[#354C63] text-white rounded-lg text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

export default ContactSupport;
