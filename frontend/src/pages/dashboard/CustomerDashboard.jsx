import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Info, Ticket, AlertCircle, Clock, CheckCircle2, Archive } from 'lucide-react';
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
    const [agents, setAgents] = useState(null);

    useEffect(() => {
        if (!user?.role) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                let res;

                switch (user.role) {
                    case "CUSTOMER":
                        res = await api.dashboard.customer();
                        break;

                    case "AGENT":
                        res = await api.dashboard.agent();
                        break;

                    case "ADMIN":
                        res = await api.dashboard.admin();
                        break;

                    default:
                        throw new Error("Invalid user role");
                }

                const s = res.stats;

                const formattedStats = [
                    { label: "Total Tickets", value: s.total, icon: Ticket, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Open", value: s.open, icon: AlertCircle, color: "text-brand-salmon", bg: "bg-brand-salmon/10" },
                    { label: "Assigned", value: s.assigned, icon: Clock, color: "text-brand-purple", bg: "bg-brand-purple/10" },
                    { label: "Resolved", value: s.resolved, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { label: "Closed", value: s.closed, icon: Archive, color: "text-gray-400", bg: "bg-gray-400/10" }
                ];

                setStats(formattedStats);

                // Optional: admin-only extras
                if (user.role === "ADMIN" && res.meta) {
                    setAgents(res.meta.agents);
                }

            } catch (err) {
                console.error("Dashboard Load Failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);


    if (loading) return (
        <div className="h-[80vh] flex items-center justify-center">
            <Loader size={60} className="text-brand-orchid" />
        </div>
    );

    const AdminStatCard = ({ label, value, color, bg }) => (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-brand-dark/40 border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-lg"
        >
            <div className={`absolute inset-0 opacity-30 ${bg}`} />

            <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-light/50 mb-2">
                    {label}
                </p>
                <p className={`text-4xl font-bold ${color} font-mono`}>
                    {value}
                </p>
            </div>
        </motion.div>
    );


    return (
        <div className="relative max-w-6xl mx-auto pb-12">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-0 dark:opacity-100 bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none -z-10 transition-opacity duration-500" />

            {/* Banner for Fallback Mode */}
            {isFallback && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-md bg-amber-500/5 border border-amber-500/20 text-amber-500 px-6 py-4 rounded-2xl flex items-center gap-3 text-sm shadow-lg shadow-amber-900/10"
                >
                    <Info size={18} />
                    <span className="font-medium">Displaying sample data due to network connection issues.</span>
                </motion.div>
            )}

            {/* Hero / Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className='flrx flex-col'>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight"
                    >
                        Welcome back, &nbsp;
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-pink via-brand-orchid to-brand-purple">
                            {user?.name?.split(' ')[0]}
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 dark:text-brand-light/60 mt-2 text-lg mb-6"
                    >
                        Here's what's happening with your tickets today.
                    </motion.p>
                </div>

                {user?.role === "CUSTOMER" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <PrimaryButton
                            onClick={() => setShowCreateTicket(true)}
                            className="h-14 px-8 text-lg gap-3 shadow-xl shadow-brand-purple/20 hover:shadow-brand-purple/40 transition-shadow"
                        >
                            <Plus size={24} />
                            Create Ticket
                        </PrimaryButton>
                    </motion.div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 + 0.4 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`relative overflow-hidden group backdrop-blur-xl bg-white/80 dark:bg-brand-dark/40 border border-slate-200 dark:border-white/5 p-6 rounded-3xl hover:border-slate-300 dark:hover:border-white/10 transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-none`}
                    >
                        {/* Card Glow Effect on Hover */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${stat.bg.replace("bg-", "from-").replace("/10", "/5")} to-transparent pointer-events-none`} />

                        <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                {/* Subtle graph line or decoration could go here */}
                            </div>

                            <div>
                                <p className="text-brand-light/50 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                                <p className={`text-4xl font-bold ${stat.color} font-mono tracking-tight`}>
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ADMIN EXTRA DETAILS */}
            {user?.role === "ADMIN" && agents && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-12 space-y-6"
                >
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Overview</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* TOTAL */}
                        <AdminStatCard
                            label="Total Agents"
                            value={agents.total}
                            color="text-blue-400"
                            bg="bg-blue-400/10"
                        />

                        {/* APPROVED */}
                        <AdminStatCard
                            label="Approved Agents"
                            value={agents.approved}
                            color="text-emerald-400"
                            bg="bg-emerald-400/10"
                        />

                        {/* PENDING */}
                        <AdminStatCard
                            label="Pending Approval"
                            value={agents.pending}
                            color="text-amber-400"
                            bg="bg-amber-400/10"
                        />
                    </div>
                </motion.div>
            )}

            {/* Activity Section Placeholder - Can be expanded */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12"
            >
                <SystemInfo />
            </motion.div>

            {showCreateTicket && (
                <CreateTicketModal
                    onClose={() => setShowCreateTicket(false)}
                    onCreated={() => window.location.reload()}
                />
            )}
        </div>
    );
};
