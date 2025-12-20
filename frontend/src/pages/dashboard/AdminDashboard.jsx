import React from 'react';
import { motion } from 'framer-motion';
import { Users, Ticket, AlertCircle, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">System Overview</h1>
                <p className="text-gray-400">Platform status and performance metrics</p>
            </div>

            {/* Admin Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Total Users', value: '2,845', change: '+12%', icon: Users, color: 'text-indigo-400' },
                    { title: 'Active Tickets', value: '142', change: '-5%', icon: Ticket, color: 'text-brand-pink' },
                    { title: 'System Health', value: '98%', change: 'Stable', icon: TrendingUp, color: 'text-emerald-400' },
                    { title: 'Critical Issues', value: '3', change: 'Action Req', icon: AlertCircle, color: 'text-brand-salmon' },
                ].map((widget, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-brand-card border border-gray-800 p-6 rounded-xl hover:shadow-lg hover:shadow-brand-purple/5 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 bg-gray-800/50 rounded-lg ${widget.color}`}>
                                <widget.icon size={20} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${widget.change.includes('+') ? 'bg-emerald-500/10 text-emerald-400' : widget.change.includes('-') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-brand-salmon/10 text-brand-salmon'}`}>
                                {widget.change}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">{widget.title}</p>
                        <p className="text-2xl font-bold text-white mt-1">{widget.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity Feed Mock */}
            <div className="bg-brand-card border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-6">System Activity</h3>
                <div className="space-y-6">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-brand-purple ring-4 ring-brand-purple/10"></div>
                                {i !== 2 && <div className="w-0.5 h-full bg-gray-800 my-2"></div>}
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">New agent <span className="text-white font-medium">Sarah Miller</span> was onboarded.</p>
                                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
