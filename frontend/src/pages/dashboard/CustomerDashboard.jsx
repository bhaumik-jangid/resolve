import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Ticket, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/common/Loader';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const CustomerDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.dashboard.customer(); // 13) GET /api/dashboard/customer
                setData(res.data.recentTickets || []);
                setStats(res.data.stats || []);
                if (res.isFallback) setIsFallback(true);
            } catch (err) {
                console.error("Dashboard Load Failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Banner for Fallback Mode */}
            {isFallback && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                    <Info size={16} />
                    <span>We are currently displaying sample data due to a network issue.</span>
                </motion.div>
            )}

            {/* Hero / Welcome */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {user?.name.split(' ')[0]}</h1>
                    <p className="text-gray-400 mt-2 text-lg">Everything looks good. You have {data.length} active tickets.</p>
                </div>
                <PrimaryButton className="gap-2 shadow-xl shadow-brand-purple/20">
                    <Plus size={20} />
                    Create New Ticket
                </PrimaryButton>
            </div>

            {/* Minimal Stats */}
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-brand-card/50 border border-gray-800 p-6 rounded-2xl"
                    >
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                        <p className="text-4xl font-bold text-white mt-2">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Ticket List (Simplified for Customer) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Your Recent Activity</h3>
                    <button className="text-brand-purple hover:text-brand-orchid transition-colors flex items-center gap-1 text-sm font-medium">
                        View History <ArrowRight size={16} />
                    </button>
                </div>

                <div className="bg-brand-card/30 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
                    {data.map((ticket) => (
                        <div key={ticket.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ticket.status === 'open' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                                    <Ticket size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-white group-hover:text-brand-light transition-colors">{ticket.subject}</h4>
                                    <p className="text-sm text-gray-500">Updated {ticket.updated}</p>
                                </div>
                            </div>
                            <Badge variant={ticket.status === 'open' ? 'blue' : 'default'} className="px-3 py-1">
                                {ticket.status}
                            </Badge>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No active tickets.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
