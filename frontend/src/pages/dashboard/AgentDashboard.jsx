import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Inbox, Zap, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/common/Loader';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AgentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);

    // Admin features
    const [agents, setAgents] = useState([]);
    const [pendingAgents, setPendingAgents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all data from single endpoint
                const res = await api.dashboard.admin();

                // 1. Process Stats
                const t = res.tickets || {};
                const a = res.agents || {};

                const newStats = [
                    { label: "Total Tickets", value: t.total || 0, change: "+0%" },
                    { label: "Open Tickets", value: t.open || 0, change: "+0%" },
                    { label: "Resolved", value: t.resolved || 0, change: "+0%" },
                    { label: "Pending Approvals", value: a.pending || 0, change: "+0%" }
                ];
                setStats(newStats);

                // 2. Process Lists
                const list = res.agentsList || [];
                setAgents(list.filter(agent => agent.approved));
                setPendingAgents(list.filter(agent => !agent.approved));

                if (res.isFallback) setIsFallback(true);
            } catch (err) {
                console.error("Agent Dashboard Fail", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApprove = async (id) => {
        try {
            await api.admin.agents.approve(id);
            // Move from pending to active
            const agent = pendingAgents.find(a => a.id === id);
            setPendingAgents(prev => prev.filter(p => p.id !== id));
            if (agent) {
                setAgents(prev => [...prev, { ...agent, status: 'active' }]);
            }
        } catch (err) {
            console.error("Approve failed", err);
        }
    };

    const handleReject = async (id) => {
        try {
            await api.admin.agents.reject(id);
            setPendingAgents(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Reject failed", err);
        }
    };

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
                <p className="text-gray-400">Welcome back, <span className="text-white font-medium">{user?.name}</span>. ready to resolve some tickets?</p>
            </div>

            {/* Top Operational Metrics Bar */}
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
                            <span className={`text-xs px-1.5 py-0.5 rounded ${stat.change.includes('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pending Approvals Section */}
            {pendingAgents.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-brand-card border border-gray-800 rounded-lg overflow-hidden"
                >
                    <div className="p-4 border-b border-gray-800 bg-amber-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="text-amber-500" size={18} />
                            <h3 className="font-semibold text-white">Pending Approvals</h3>
                            <Badge variant="warning">{pendingAgents.length}</Badge>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {pendingAgents.map((agent) => (
                            <div key={agent.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">{agent.name}</p>
                                    <p className="text-sm text-gray-400">{agent.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApprove(agent.id)}
                                        className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(agent.id)}
                                        className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* All Agents List */}
            <div className="bg-brand-card border border-gray-800 rounded-lg overflow-hidden flex-1">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <CheckCircle className="text-brand-purple" size={18} />
                        All Agents
                    </h3>
                    <Badge variant="secondary">{agents.length}</Badge>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3 text-center">Name</th>
                                <th className="px-6 py-3 text-center">Email</th>
                                <th className="px-6 py-3 text-center">Role</th>
                                <th className="px-6 py-3 text-center">Active Tickets</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {agents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 text-center text-white font-medium">{agent.name}</td>
                                    <td className="px-6 py-4 text-center text-gray-400">{agent.email}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant="outline" className="border-brand-purple text-brand-purple">
                                            {agent.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-center font-mono">
                                        {agent.activeTicketCount || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            <span className="text-sm text-gray-300">Active</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {agents.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No agents found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
