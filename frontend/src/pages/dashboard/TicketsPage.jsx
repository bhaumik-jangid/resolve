import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, AlertCircle } from 'lucide-react';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TicketCard } from '../../components/tickets/TicketCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Loader } from '../../components/common/Loader';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../../context/TicketsContext';

export const TicketsPage = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFallback, setIsFallback] = useState(false);
    const navigate = useNavigate();
    const { upsertTickets } = useTickets();

    useEffect(() => {
        const fetchTickets = async () => {
            if (!user) return;

            setLoading(true);
            try {
                const res = await api.tickets.list();
                const normalized = res.map(normalizeTicket);
                setTickets(normalized);
                upsertTickets(normalized);
                setIsFallback(false);
            } catch (err) {
                console.error("Failed to load tickets", err);
                setIsFallback(true);
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
            : ['all', 'in-progress', 'resolved', 'closed'];


    const normalizeTicket = (t) => ({
        id: t._id,
        subject: t.subject,
        requester: t.customerId?.name || "Unknown",
        agent: t.agentId?.name || null,
        status: t.status.toLowerCase(),
        priority: t.priority.toLowerCase(),
        updated: new Date(t.updatedAt).toLocaleDateString(),
        raw: t
    });

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
                                    onClick={() => navigate(`/dashboard/chat?ticketId=${ticket.id}`)}
                                    // Prop to control density of card based on role
                                    dense={user?.role === 'AGENT' || user?.role === 'ADMIN'}
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
        </div>
    );
};
