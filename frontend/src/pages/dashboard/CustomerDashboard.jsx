import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Ticket, Clock, CheckCircle } from 'lucide-react';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Badge } from '../../components/ui/Badge';

// Mock Data
const stats = [
    { label: 'Open Tickets', value: '3', icon: Ticket, color: 'text-brand-orchid', bg: 'bg-brand-orchid/10' },
    { label: 'In Progress', value: '1', icon: Clock, color: 'text-brand-salmon', bg: 'bg-brand-salmon/10' },
    { label: 'Resolved', value: '12', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

const recentTickets = [
    { id: 'T-1024', subject: 'Login issue on mobile app', status: 'open', priority: 'high', updated: '2 hrs ago' },
    { id: 'T-1023', subject: 'Billing question', status: 'in-progress', priority: 'medium', updated: '1 day ago' },
    { id: 'T-1020', subject: 'Feature request: Dark mode', status: 'closed', priority: 'low', updated: '3 days ago' },
];

export const CustomerDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Support Dashboard</h1>
                    <p className="text-gray-400">Track and manage your support requests</p>
                </div>
                <div className="w-full sm:w-auto">
                    <PrimaryButton className="gap-2">
                        <Plus size={18} />
                        Create Ticket
                    </PrimaryButton>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-brand-card border border-gray-800 p-6 rounded-xl flex items-center gap-4 hover:border-gray-700 transition-colors"
                    >
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Tickets */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-brand-card border border-gray-800 rounded-xl overflow-hidden"
            >
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Recent Tickets</h3>
                    <button className="text-sm text-brand-purple hover:text-brand-orchid transition-colors">View All</button>
                </div>
                <div className="divide-y divide-gray-800">
                    {recentTickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                    <Ticket size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-white group-hover:text-brand-pink transition-colors">{ticket.subject}</p>
                                    <p className="text-xs text-gray-500">#{ticket.id} • Updated {ticket.updated}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant={ticket.priority === 'high' ? 'error' : ticket.priority === 'medium' ? 'warning' : 'default'}>
                                    {ticket.priority}
                                </Badge>
                                <Badge variant={ticket.status === 'open' ? 'blue' : ticket.status === 'closed' ? 'success' : 'purple'}>
                                    {ticket.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
