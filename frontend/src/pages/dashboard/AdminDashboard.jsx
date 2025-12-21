import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
import { Activity, Users, Shield, Globe, MoreVertical, AlertTriangle } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { api } from '../../services/api';

import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);
    const [agents, setAgents] = useState([]);
    const [pendingAgents, setPendingAgents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.dashboard.admin();

                const t = res.tickets || {};
                const a = res.agents || {};
                console.log(res);

                // Construct stats for the grid
                const newStats = [
                    { label: "Total Tickets", value: t.total || 0, change: "All Time" },
                    { label: "Open Tickets", value: t.open || 0, change: "Requires Attention" },
                    { label: "Active Agents", value: (a.total || 0) - (a.pending || 0), change: "Online" },
                    { label: "Pending Approvals", value: a.pending || 0, change: "Action Needed" }
                ];

                setStats(newStats);

                // Process Lists
                const list = res.agentsList || [];
                setAgents(list.filter(agent => agent.approved));
                setPendingAgents(list.filter(agent => !agent.approved));

                if (res.isFallback) setIsFallback(true);
            } catch (err) {
                console.error("Admin Dashboard Fail", err);
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
                setAgents(prev => [...prev, { ...agent, status: 'active', approved: true }]);
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
        <div className="space-y-8">
            {/* Banner for Fallback Mode */}
            {isFallback && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                    <Activity size={16} />
                    <span>System running in offline/demo mode.</span>
                </div>
            )}

            <div className="flex items-center justify-between border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">System Overview</h1>
                    <p className="text-gray-400 text-sm">Welcome back, {user?.name}. Real-time platform monitoring</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-900/50">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE
                </div>
            </div>

            {/* Detailed Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-brand-card border border-gray-800 p-6 rounded-lg relative overflow-hidden group hover:border-brand-purple/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <Activity size={20} className="text-brand-purple" />
                        </div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">{stat.value}</span>
                            <span className="text-xs text-green-400">{stat.change}</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1 mt-4 rounded-full overflow-hidden">
                            <div className="bg-brand-purple h-full" style={{ width: '70%' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending Approvals Section */}
            {pendingAgents.length > 0 && (
                <div className="bg-brand-card border border-gray-800 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-gray-800 bg-amber-500/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="text-amber-500" size={18} />
                            <h3 className="font-semibold text-white">Pending Approvals</h3>
                            <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-medium">{pendingAgents.length}</div>
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
                </div>
            )}

            {/* All Agents List */}
            <div className="bg-brand-card border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <Users size={18} className="text-brand-purple" />
                        All Agents
                    </h3>
                    <div className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-xs font-medium">{agents.length}</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Active Tickets</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {agents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{agent.name}</td>
                                    <td className="px-6 py-4 text-gray-400">{agent.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex px-2 py-0.5 rounded border border-brand-purple/50 text-brand-purple text-xs font-medium">
                                            {agent.role || 'AGENT'}
                                        </div>
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
