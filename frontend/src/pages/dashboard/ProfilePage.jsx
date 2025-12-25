import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { RoleBadge } from '../../components/ui/RoleBadge';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage = () => {
    const { user } = useAuth(); // Fallback/Initial
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (loading) return <div className="h-full flex items-center justify-center"><Loader /></div>;

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-red-500 gap-2">
                <AlertCircle size={24} />
                <p>{error}</p>
            </div>
        );
    }

    if (!user) return null;

    // Generate initials
    const initials = user.name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const role = user.role?.toLowerCase() || 'customer';
    const isAgent = role === 'agent';
    const isAdmin = role === 'admin';
    const approved = user.agentApproved

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-8 py-10"
        >
            {/* Background decorative glow - Moving Fluid */}
            {/* Main Profile Card */}
            <div className="bg-brand-card border border-gray-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                {/* Background decorative glow */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-brand-purple/5 to-transparent pointer-events-none" />


                <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-brand-purple to-brand-orchid p-[2px] mb-4">
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl font-bold text-white tracking-wider">
                        {initials}
                    </div>
                </div>

                <div className="relative z-10 space-y-2">
                    <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
                        {user.name}
                    </h1>
                    <div className="flex justify-center">
                        <RoleBadge role={role} approved={approved} />
                    </div>
                </div>

                <div className="relative z-10 mt-6 space-y-3 w-full max-w-sm">
                    <div className="flex items-center gap-3 text-gray-400 bg-gray-800/30 px-4 py-3 rounded-lg border border-gray-800/50">
                        <Mail size={18} className="text-gray-500" />
                        <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 bg-gray-800/30 px-4 py-3 rounded-lg border border-gray-800/50">
                        <Calendar size={18} className="text-gray-500" />
                        <span className="text-sm">Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Role Specific Control Sections */}

            {/* ADMIN SECTION */}
            {
                isAdmin && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6 flex items-start gap-4"
                    >
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Administrator Access</h3>
                            <p className="text-gray-400 text-sm mt-1">
                                You have full access to manage users, agents, and system settings.
                            </p>
                        </div>
                    </motion.div>
                )
            }

            {/* AGENT SECTION */}
            {
                isAgent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`border rounded-xl p-6 flex items-start gap-4 ${approved ? 'bg-green-900/10 border-green-500/20' : 'bg-amber-900/10 border-amber-500/20'}`}
                    >
                        <div className={`p-3 rounded-lg ${approved ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {approved ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                {approved ? "Agent Status: Active" : "Approval Pending"}
                            </h3>
                            {approved ? (
                                <p className="text-gray-400 text-sm mt-1">
                                    You are authorized to accept and resolve support tickets.
                                </p>
                            ) : (
                                <p className="text-amber-500/80 text-sm mt-1">
                                    Your account is awaiting admin approval. Ticket access is currently restricted.
                                </p>
                            )}
                        </div>
                    </motion.div>
                )
            }

        </motion.div >
    );
};
