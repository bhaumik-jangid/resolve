import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, AlertCircle, X } from 'lucide-react';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TicketCard } from '../../components/tickets/TicketCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Loader } from '../../components/common/Loader';
import { api } from '../../services/api';
import { UIError } from '../../components/common/UIError';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../../context/TicketsContext';

export const TicketsPage = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uiError, setUiError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFallback, setIsFallback] = useState(false);
    const navigate = useNavigate();
    const { upsertTickets } = useTickets();

    // Assignment Modal State
    const [agents, setAgents] = useState([]); // All agents
    const [activeAgents, setActiveAgents] = useState([]); // Approved agents
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedAgentId, setSelectedAgentId] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    // Fetch Agents for Admin
    useEffect(() => {
        if (user?.role === 'ADMIN') {
            const fetchAgents = async () => {
                try {
                    const res = await api.admin.agents.list();
                    // Based on user request: "filter out the approved agents"
                    // api.admin.agents.list() likely returns all.
                    const approved = res.filter(a => a.agentStatus.approved === true || a.status === 'active');
                    setAgents(res);
                    setActiveAgents(approved);
                } catch (err) {
                    console.error("Failed to load agents", err);
                }
            };
            fetchAgents();
        }
    }, [user]);

    useEffect(() => {
        console.log(user);
        const fetchTickets = async () => {
            if (!user) return;

            if (user.role === 'AGENT' && user.agentApproved === false) {
                setUiError("Your account is pending admin approval.");
            } else {
                setUiError(null);
            }


            setLoading(true);
            try {
                const res = await api.tickets.list();
                const normalized = res.map(normalizeTicket);
                setTickets(normalized);
                upsertTickets(normalized);
                setIsFallback(false);
            } catch (err) {
                if (err.response?.status === 403 &&
                    err.response.data?.code === "AGENT_NOT_APPROVED") {

                    setUiError("Your account is pending admin approval.");
                    return;
                }

                setUiError("Failed to load tickets. Try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [user]);

    const filteredTickets = tickets.filter(t => {
        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesId = t.id.toLowerCase().includes(query);
            const matchesSubject = t.subject.toLowerCase().includes(query);
            if (!matchesId && !matchesSubject) return false;
        }

        // CUSTOMER: hide assigned completely
        // if (user.role === 'CUSTOMER') {
        //     if (t.status === 'assigned') return false;
        // }

        if (filter === 'all') return true;
        if (filter === 'open') return t.status === 'open';
        if (filter === 'in-progress') return t.status === 'assigned';
        if (filter === 'resolved') return t.status === 'resolved';
        if (filter === 'closed') return t.status === 'closed';

        return true;
    });

    const filters =
        user?.role === 'CUSTOMER' || user?.role === 'ADMIN'
            ? ['all', 'open', 'in-progress', 'resolved', 'closed']
            : ['all', 'open', 'in-progress', 'resolved', 'closed'];


    const normalizeTicket = (t) => ({
        id: t._id,
        subject: t.subject,
        requester: t.customerId?.name || "Unknown",
        agent: t.agentId?.name || null,
        agentId: t.agentId?._id || t.agentId || null, // Ensure ID is available
        status: t.status.toLowerCase(),
        priority: t.priority.toLowerCase(),
        updated: new Date(t.updatedAt).toLocaleDateString(),
        messages: t.messages?.length || 0, // Add message count if available
        raw: t
    });

    const handleAccept = async (ticket) => {
        try {
            await api.tickets.accept(ticket.id);
            // Refresh list
            const res = await api.tickets.list();
            setTickets(res.map(normalizeTicket));
        } catch (err) {
            console.error("Failed to accept ticket", err);
        }
    };

    const handleChat = (ticket) => {
        navigate(`/dashboard/chat?ticketId=${ticket.id}`);
    };

    const openAssignModal = (ticket) => {
        setSelectedTicket(ticket);
        setSelectedAgentId(ticket.agentId || ''); // Pre-select if already assigned
        setIsAssignModalOpen(true);
    };

    const closeAssignModal = () => {
        setIsAssignModalOpen(false);
        setSelectedTicket(null);
        setSelectedAgentId('');
    };

    const confirmAssign = async () => {
        if (!selectedAgentId || !selectedTicket) return;
        setIsAssigning(true);
        try {
            const res = await api.tickets.assign(selectedTicket.id, selectedAgentId);
            console.log(res);
            // Refetch list to ensure consistency and avoid optimistic update errors
            const res2 = await api.tickets.list();
            const normalized = res2.map(normalizeTicket);
            setTickets(normalized);
            upsertTickets(normalized);

            setUiError(null);

            closeAssignModal();
        } catch (err) {
            console.error("Assignment failed", err);
            setUiError("Failed to assign ticket. Please try again.");
        } finally {
            setIsAssigning(false);
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {user?.role === 'CUSTOMER' ? 'My Tickets' : user?.role === 'ADMIN' ? 'All System Tickets' : 'Assigned Tickets'}
                    </h1>
                    <p className="text-gray-400">
                        {user?.role === 'CUSTOMER' ? 'Track your support requests' : 'Manage your ticket queue'}
                    </p>
                </div>
                {user?.role === 'CUSTOMER' && (
                    <PrimaryButton
                        className="gap-2"
                        onClick={() => navigate('/dashboard/new-ticket')}
                    >
                        <Plus size={18} />
                        New Ticket
                    </PrimaryButton>
                )}
            </div>
            {/* Error Message */}
            <UIError message={uiError} />

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by subject or ID..."
                        className="w-full bg-brand-dark border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-brand-purple focus:outline-none transition-colors"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap border
                            ${filter === f
                                    ? 'bg-brand-purple border-brand-purple text-white'
                                    : 'bg-gray-800 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                                }`}
                        >
                            {f === 'in-progress' ? 'In Progress' : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pb-4">
                <AnimatePresence mode="popLayout">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map((ticket, i) => (
                            <motion.div
                                key={ticket.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <TicketCard
                                    ticket={ticket}
                                    onClick={() => handleChat(ticket)}
                                    dense={user?.role === 'AGENT' || user?.role === 'ADMIN'}
                                    role={user?.role}
                                    onAccept={handleAccept}
                                    onAssign={openAssignModal}
                                    onChat={handleChat}
                                    isAssignedToMe={ticket.agentId === user?.id}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <EmptyState
                                icon={AlertCircle}
                                title={
                                    user.role === 'CUSTOMER'
                                        ? "No tickets found"
                                        : "No assigned tickets"
                                }
                                description={
                                    user.role === 'CUSTOMER'
                                        ? "Create a new ticket to get help."
                                        : "Tickets will appear here once assigned."
                                }
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* Assignment Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-brand-card border border-gray-700 rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="font-semibold text-white">Assign Ticket</h3>
                            <button onClick={closeAssignModal} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Ticket</label>
                                <div className="p-3 bg-gray-800/50 rounded border border-gray-700 text-white text-sm">
                                    <span className="text-gray-500 font-mono mr-2">#{selectedTicket?.id}</span>
                                    {selectedTicket?.subject}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Select Agent</label>
                                <select
                                    className="w-full bg-brand-dark border border-gray-700 text-white rounded p-2.5 focus:border-brand-purple focus:outline-none"
                                    value={selectedAgentId}
                                    onChange={(e) => setSelectedAgentId(e.target.value)}
                                >
                                    <option value="">-- Choose an agent --</option>
                                    {activeAgents.map(agent => (
                                        <option key={agent.id || agent._id} value={agent.id || agent._id}>
                                            {agent.name} {agent.activeTicketCount ? `(${agent.activeTicketCount} active)` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-900/50 flex justify-end gap-3">
                            <button
                                onClick={closeAssignModal}
                                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAssign}
                                disabled={!selectedAgentId || isAssigning}
                                className="px-4 py-2 text-sm font-medium bg-brand-purple hover:bg-brand-purple/90 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
