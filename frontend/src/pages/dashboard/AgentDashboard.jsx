import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Clock, CheckCircle, BarChart2 } from 'lucide-react';
// import { Badge } from '../../components/ui/Badge';

export const AgentDashboard = () => {
    // Mock Agent Data
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Agent Workspace</h1>
                    <p className="text-gray-400">Good afternoon, ready to resolve some tickets?</p>
                </div>
            </div>

            {/* Workload Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Assigned', value: '8', icon: Inbox, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Pending Reply', value: '3', icon: Clock, color: 'text-brand-salmon', bg: 'bg-brand-salmon/10' },
                    { label: 'Resolved Today', value: '14', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Avg. Response', value: '12m', icon: BarChart2, color: 'text-brand-orchid', bg: 'bg-brand-orchid/10' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-brand-card border border-gray-800 p-5 rounded-xl flex items-center justify-between"
                    >
                        <div>
                            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Priority Inbox */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-brand-card border border-gray-800 rounded-xl overflow-hidden flex flex-col h-96"
                >
                    <div className="p-6 border-b border-gray-800">
                        <h3 className="font-semibold text-white">Priority Inbox</h3>
                    </div>
                    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                        <div className="bg-gray-800/50 p-4 rounded-full mb-4">
                            <CheckCircle size={32} className="text-gray-600" />
                        </div>
                        <p className="text-gray-400">All high priority tickets resolved!</p>
                    </div>
                </motion.div>

                {/* Performance Chart Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-brand-card border border-gray-800 rounded-xl overflow-hidden flex flex-col h-96"
                >
                    <div className="p-6 border-b border-gray-800">
                        <h3 className="font-semibold text-white">Performance Trend</h3>
                    </div>
                    <div className="flex-1 flex items-end justify-center p-6 gap-2">
                        {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 0.6 + (i * 0.05), duration: 0.5 }}
                                className="w-8 bg-brand-purple/20 rounded-t-md relative hover:bg-brand-purple/40 transition-colors group"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs text-white bg-gray-900 px-2 py-1 rounded">
                                    {h}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
