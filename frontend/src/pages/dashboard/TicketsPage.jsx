import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, AlertCircle } from 'lucide-react';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TicketCard } from '../../components/tickets/TicketCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Loader } from '../../components/common/Loader';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const TicketsPage = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const res = await api.tickets.list(user?.role || 'customer'); // 4) GET /api/tickets
                setTickets(res.data);
                // Handle fallback notice if needed
            } catch (err) {
                console.error("Tickets Load Fail", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchTickets();
    }, [user]);

    const filteredTickets = tickets.filter(t => {
        if (filter === 'all') return true;
        return t.status === filter;
    });

    if (loading) return <div className="h-full flex items-center justify-center"><Loader /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {user?.role === 'customer' ? 'My Tickets' : user?.role === 'admin' ? 'All System Tickets' : 'Assigned Tickets'}
                    </h1>
                    <p className="text-gray-400">
                        {user?.role === 'customer' ? 'Track your support requests' : 'Manage your ticket queue'}
                    </p>
                </div>
                <PrimaryButton className="gap-2">
                    <Plus size={18} />
                    <span className="hidden sm:inline">New Ticket</span>
                    <span className="sm:hidden">New</span>
                </PrimaryButton>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by subject or ID..."
                        className="w-full bg-brand-dark border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-brand-purple focus:outline-none transition-colors"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {['all', 'open', 'in-progress', 'closed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap border ${filter === f ? 'bg-brand-purple border-brand-purple text-white' : 'bg-gray-800 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}`}
                        >
                            {f}
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
                                    onClick={() => { }}
                                    // Prop to control density of card based on role
                                    dense={user?.role === 'agent' || user?.role === 'admin'}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <EmptyState
                                icon={AlertCircle}
                                title="No tickets found"
                                description="Try adjusting your filters."
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
