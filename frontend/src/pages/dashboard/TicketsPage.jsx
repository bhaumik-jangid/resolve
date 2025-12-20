import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TicketCard } from '../../components/tickets/TicketCard';
import { EmptyState } from '../../components/common/EmptyState';

// Mock Data
const MOCK_TICKETS = [
    { id: 'T-2401', subject: 'Cannot access production database', preview: 'I keep getting a 403 error when trying to connect via VPN...', status: 'open', priority: 'high', updated: '10m ago', messages: 2 },
    { id: 'T-2398', subject: 'Requesting new license key', preview: 'Our team has expanded and we need 5 more seats...', status: 'in-progress', priority: 'medium', updated: '2h ago', messages: 5 },
    { id: 'T-2342', subject: 'UI Glitch on Safari Mobile', preview: 'The navigation bar overlaps with the content on iOS 17...', status: 'closed', priority: 'low', updated: '1d ago', messages: 12 },
    { id: 'T-2340', subject: 'Billing invoice discrepancy', preview: 'The total amount does not match the usage report...', status: 'open', priority: 'high', updated: '2d ago', messages: 3 },
];

export const TicketsPage = () => {
    const [filter, setFilter] = useState('all');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tickets</h1>
                    <p className="text-gray-400">Manage support requests</p>
                </div>
                <PrimaryButton className="gap-2">
                    <Plus size={18} />
                    New Ticket
                </PrimaryButton>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        className="w-full bg-brand-dark border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-brand-purple focus:outline-none transition-colors"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {['all', 'open', 'closed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${filter === f ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {MOCK_TICKETS.length > 0 ? (
                    MOCK_TICKETS.map((ticket, i) => (
                        <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <TicketCard ticket={ticket} onClick={() => { }} />
                        </motion.div>
                    ))
                ) : (
                    <EmptyState
                        icon={Ticket}
                        title="No tickets found"
                        description="Try adjusting your filters or create a new ticket."
                    />
                )}
            </div>
        </div>
    );
};
