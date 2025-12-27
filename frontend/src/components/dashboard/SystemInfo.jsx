import { motion } from 'framer-motion';
import { MessageSquare, Ticket, Lock, Shuffle, Database, Cpu, Globe, Key, ChevronsRight, CheckCircle2 } from 'lucide-react';

export const SystemInfo = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-12 py-8 mt-8 border-t border-slate-200 dark:border-gray-800/50">
            {/* SECTION 1: System Capabilities */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-brand-purple rounded-full"></div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Capabilities</h2>
                        <p className="text-slate-500 dark:text-gray-400 text-sm">Core features powering the platform</p>
                    </div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <FeatureCard
                        icon={MessageSquare}
                        title="Real-Time Chat"
                        desc="Instant messaging powered by WebSockets"
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                        border="border-blue-500/20"
                    />
                    <FeatureCard
                        icon={Ticket}
                        title="Lifecycle Management"
                        desc="Open → Assigned → In Progress → Closed"
                        color="text-green-400"
                        bg="bg-green-500/10"
                        border="border-green-500/20"
                    />
                    <FeatureCard
                        icon={Lock}
                        title="Role-Based Access"
                        desc="Secure flows for Admin, Agent, Customer"
                        color="text-brand-purple"
                        bg="bg-brand-purple/10"
                        border="border-brand-purple/20"
                    />
                    <FeatureCard
                        icon={Shuffle}
                        title="Flexible Assignment"
                        desc="Admin assignment or Agent acceptance"
                        color="text-amber-400"
                        bg="bg-amber-500/10"
                        border="border-amber-500/20"
                    />
                </motion.div>
            </div>

            {/* SECTION 2: Workflow Visualization */}
            <div className="bg-white/80 dark:bg-brand-card/50 border border-slate-200 dark:border-gray-800 rounded-xl p-8 overflow-hidden relative shadow-lg shadow-slate-200/50 dark:shadow-none">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Database size={120} />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-8 text-center">How the System Works</h3>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative z-10">
                    <Step title="Customer Creates Ticket" />
                    <Arrow />
                    <Step title="Admin Assigns / Agent Accepts" />
                    <Arrow />
                    <Step title="Real-Time Chat" highlight />
                    <Arrow />
                    <Step title="Ticket Resolved & Closed" />
                </div>
            </div>

            {/* SECTION 3: Tech Stack */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
                <TechBadge icon={Cpu} label="React (SPA)" />
                <TechBadge icon={Database} label="Node.js + Express" />
                <TechBadge icon={Globe} label="MongoDB" />
                <TechBadge icon={MessageSquare} label="Socket.IO" />
                <TechBadge icon={Key} label="JWT Auth" />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, color, bg, border }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -4 }}
        className={`p-6 rounded-lg border ${border} ${bg} backdrop-blur-sm transition-all duration-300`}
    >
        <div className={`mb-4 w-10 h-10 rounded-lg flex items-center justify-center ${bg} border ${border}`}>
            <Icon size={20} className={color} />
        </div>
        <h3 className={`font-semibold text-slate-900 dark:text-white mb-2`}>{title}</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400">{desc}</p>
    </motion.div>
);

const Step = ({ title, highlight }) => (
    <div className={`
        relative px-6 py-4 rounded-lg border text-center w-full md:w-auto
        ${highlight
            ? 'bg-brand-purple/10 border-brand-purple/30 text-brand-purple dark:text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]'
            : 'bg-slate-100 dark:bg-gray-800/50 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300'}
    `}>
        <p className={`text-sm font-medium ${highlight ? 'text-brand-purple' : 'text-slate-600 dark:text-gray-300'}`}>{title}</p>
    </div>
);

const Arrow = () => (
    <div className="hidden md:flex text-gray-600">
        <ChevronsRight size={20} />
    </div>
);

const TechBadge = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 text-xs font-medium hover:border-slate-300 dark:hover:border-gray-600 hover:text-slate-700 dark:hover:text-gray-300 transition-colors cursor-default">
        <Icon size={12} />
        <span>{label}</span>
    </div>
);
