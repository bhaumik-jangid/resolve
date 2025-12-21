import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Shield, Globe, MoreVertical } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { api } from '../../services/api';

import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);

    const [agents, setAgents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [dashRes, agentsRes] = await Promise.all([
                    api.dashboard.admin(),
                    api.admin.agents.list()
                ]);
                setStats(dashRes.data.stats || []);
                setAgents(agentsRes.data || []);
                if (dashRes.isFallback || agentsRes.isFallback) setIsFallback(true);
            } catch (err) {
                console.error("Admin Dashboard Fail", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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

            {/* Administration Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Management */}
                <div className="lg:col-span-2 bg-brand-card border border-gray-800 rounded-lg overflow-hidden">
                    <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Users size={18} /> User Management
                        </h3>
                        <button className="text-gray-400 hover:text-white"><MoreVertical size={16} /></button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {agents.map(agent => (
                                <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-xs text-white/50">
                                            {agent.id}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{agent.name}</p>
                                            <p className="text-xs text-gray-500">{agent.email}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${agent.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                        {agent.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Security Log */}
                <div className="bg-brand-card border border-gray-800 rounded-lg overflow-hidden">
                    <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <Shield size={18} /> Security Log
                        </h3>
                    </div>
                    <div className="p-6 text-sm text-gray-400 space-y-4 font-mono">
                        <p><span className="text-blue-400">10:42:01</span> [AUTH] Valid login from 192.168.1.1</p>
                        <p><span className="text-orange-400">10:41:55</span> [WARN] Failed attempt details...</p>
                        <p><span className="text-blue-400">10:40:12</span> [SYS] Backup completed.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
