import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Info } from 'lucide-react';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Loader } from '../../components/common/Loader';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CreateTicketModal } from './CreateTicketModal';
import { SystemInfo } from '../../components/dashboard/SystemInfo';

export const CustomerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);
    const [showCreateTicket, setShowCreateTicket] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.dashboard.customer(); // 13) GET /api/dashboard/customer
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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">
                    Welcome back, <span className="text-emerald-400">{user?.name?.split(' ')[0]}</span>
                </h1>

                {user?.role == "CUSTOMER" && (
                    <PrimaryButton
                        onClick={() => setShowCreateTicket(true)}
                        className="gap-2"
                    >
                        <Plus size={20} />
                        Create New Ticket
                    </PrimaryButton>
                )}
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
            {showCreateTicket && (
                <CreateTicketModal
                    onClose={() => setShowCreateTicket(false)}
                    onCreated={() => window.location.reload()}
                />
            )}
            <SystemInfo />
        </div>
    );
};
