import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Inbox, Zap, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/common/Loader';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AgentDashboard = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.dashboard.agent(); // 14) GET /api/dashboard/agent
                setTickets(res.data.queue || []);
                setStats(res.data.stats || []);
                if (res.isFallback) setIsFallback(true);
            } catch (err) {
                console.error("Agent Dashboard Fail", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-full flex items-center justify-center"><Loader /></div>;

    return (
        <div className="h-full flex flex-col gap-6">
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
            <div className="grid grid-cols-4 gap-4">
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

            {/* Main Board Area */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Ticket Queue List (Dense) */}
                <div className="flex-1 bg-brand-card border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                        <div className="flex items-center gap-2">
                            <Inbox size={18} className="text-brand-purple" />
                            <h3 className="font-semibold text-white">Assigned Queue</h3>
                            <Badge variant="purple" className="ml-2">{tickets.length}</Badge>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400"><Search size={16} /></button>
                            <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400"><Filter size={16} /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto w-full">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-800/30 text-xs text-gray-500 uppercase sticky top-0 backdrop-blur-md">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Priority</th>
                                    <th className="px-4 py-3 font-medium">Subject</th>
                                    <th className="px-4 py-3 font-medium">Requester</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium text-right">Updated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {tickets.map((t) => (
                                    <tr key={t.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                        <td className="px-4 py-3">
                                            {t.priority === 'critical' && <AlertTriangle size={16} className="text-red-500" />}
                                            {t.priority === 'high' && <span className="w-2 h-2 rounded-full bg-orange-500 block ml-1" />}
                                            {t.priority === 'medium' && <span className="w-2 h-2 rounded-full bg-yellow-500 block ml-1" />}
                                            {t.priority === 'low' && <span className="w-2 h-2 rounded-full bg-blue-500 block ml-1" />}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-200 group-hover:text-white truncate max-w-xs">{t.subject}</p>
                                            <p className="text-xs text-gray-500">{t.id}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-400">{t.requester}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={t.status === 'open' ? 'blue' : 'default'} className="text-[10px] py-0.5 h-auto uppercase">
                                                {t.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 text-right">{t.updated}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Sidebar: Quick Actions (Agent Specific) */}
                <div className="w-72 hidden xl:flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-brand-purple/20 to-brand-orchid/10 border border-brand-purple/20 p-5 rounded-xl">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                            <Zap size={18} className="text-brand-orchid" />
                            Quick Actions
                        </h4>
                        <div className="mt-4 space-y-2">
                            <button className="w-full text-left px-3 py-2 rounded bg-brand-purple/20 text-brand-light text-sm hover:bg-brand-purple/30 transition-colors">Resolve T-1024</button>
                            <button className="w-full text-left px-3 py-2 rounded bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors">Transfer Ticket</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
