import { useState, useEffect } from 'react';
import { TicketCard } from '../../components/tickets/TicketCard';
import { useNavigate } from 'react-router-dom';
import { SystemInfo } from '../../components/dashboard/SystemInfo';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/ui/Badge';
import { AlertTriangle, Inbox, Zap } from 'lucide-react';

export const AgentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);

    // ... (Keep existing stats fetch if desired, but user focused on tickets)
    // Actually, I'll keep the stats fetch but also fetch tickets.

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Parallel fetch
                const [dashRes, ticketsRes] = await Promise.all([
                    api.dashboard.admin(), // Using admin/agent dashboard endpoint for stats
                    api.tickets.list()
                ]);

                // 1. Process Stats (Keep existing logic or simplify)
                const t = dashRes.tickets || {};
                const newStats = [
                    { label: "Total Tickets", value: t.total || 0, change: "All Time" },
                    { label: "Open Tickets", value: t.open || 0, change: "Queue" },
                    { label: "Resolved", value: t.resolved || 0, change: "Completed" },
                    { label: "My Active", value: ticketsRes.filter(tk => tk.agentId?._id === user?.id && (tk.status === 'assigned' || tk.status === 'in progress')).length, change: "Your Queue" }
                ];
                setStats(newStats);

                // 2. Process Tickets
                setTickets(ticketsRes);

                if (dashRes.isFallback) setIsFallback(true);
            } catch (err) {
                console.error("Agent Dashboard Fail", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleAccept = async (ticket) => {
        try {
            await api.tickets.accept(ticket.id || ticket._id);
            // Refresh
            const res = await api.tickets.list();
            setTickets(res);
            // Optionally refresh stats too
        } catch (err) {
            console.error("Accept failed", err);
        }
    };

    const handleChat = (ticket) => {
        navigate(`/dashboard/chat?ticketId=${ticket.id || ticket._id}`);
    };

    // Filter Lists
    const availableTickets = tickets.filter(t => t.status === 'open');
    const myActiveTickets = tickets.filter(t =>
        (t.agentId?._id === user?.id || t.agentId === user?.id) &&
        (t.status === 'assigned' || t.status === 'in progress')
    );

    // Helper to normalize for card
    const normalize = (t) => ({
        id: t._id,
        subject: t.subject,
        status: t.status.toLowerCase(),
        priority: t.priority.toLowerCase(),
        updated: new Date(t.updatedAt).toLocaleDateString(),
        messages: t.messages?.length || 0,
        ...t
    });

    if (loading) return <div className="h-full flex items-center justify-center"><Loader /></div>;

    return (
        <div className="h-full flex flex-col gap-6 overflow-y-auto">
            {/* Banner for Fallback Mode */}
            {isFallback && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                    <AlertTriangle size={16} />
                    <span>Network unreachable. Showing cached/mock data.</span>
                </div>
            )}

            <div>
                <h1 className="text-2xl font-bold text-white">Agent Workspace</h1>
                <p className="text-gray-400">Welcome back, <span className="text-blue-400 font-medium">{user?.name?.split(' ')[0]}</span>. Ready to resolve some tickets?</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-brand-card border border-gray-800 p-4 rounded-lg flex flex-col justify-between"
                    >
                        <span className="text-xs text-gray-500 uppercase font-semibold">{stat.label}</span>
                        <div className="flex items-end justify-between mt-2">
                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                            <span className="text-xs text-gray-400">{stat.change}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Section A: Available Tickets */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Inbox className="text-blue-400" size={20} />
                    <h2 className="text-lg font-semibold text-white">Available Tickets</h2>
                    <Badge variant="secondary">{availableTickets.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableTickets.length > 0 ? availableTickets.map(t => (
                        <TicketCard
                            key={t._id}
                            ticket={normalize(t)}
                            role="AGENT"
                            onAccept={handleAccept}
                            dense
                        />
                    )) : (
                        <p className="text-gray-500 text-sm col-span-full">No open tickets available.</p>
                    )}
                </div>
            </div>

            {/* Section B: My Active Tickets */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Zap className="text-blue-400" size={20} />
                    <h2 className="text-lg font-semibold text-white">My Active Tickets</h2>
                    <Badge variant="secondary">{myActiveTickets.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myActiveTickets.length > 0 ? myActiveTickets.map(t => (
                        <TicketCard
                            key={t._id}
                            ticket={normalize(t)}
                            role="AGENT"
                            isAssignedToMe={true}
                            onChat={handleChat}
                            dense
                        />
                    )) : (
                        <p className="text-gray-500 text-sm col-span-full">You have no active tickets.</p>
                    )}
                </div>
            </div>

            <SystemInfo />
        </div>
    );
};
