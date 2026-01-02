import { TicketCard } from '../../components/tickets/TicketCard';
import { X, Activity, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Loader } from '../../components/common/Loader';
import { useEffect, useState } from 'react';


export const AdminDashboard = () => {
    // ... existing setup ...
    const { user } = useAuth();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(false);
    const [agents, setAgents] = useState([]);
    const [pendingAgents, setPendingAgents] = useState([]);

    // New State for Tickets & Assignment
    const [tickets, setTickets] = useState([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedAgentId, setSelectedAgentId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [dashRes, ticketsRes] = await Promise.all([
                    api.dashboard.admin(),
                    api.tickets.list()
                ]);
                // 1. Process Stats
                const t = dashRes.stats || {};
                const a = ticketsRes || {};

                const newStats = [
                    { label: "Total Tickets", value: t.total || 0, change: "All Time" },
                    { label: "Open Tickets", value: t.open || 0, change: "Requires Attention" },
                    { label: "Active Agents", value: (t.total || 0) - (a.pending || 0), change: "Online" },
                    { label: "Pending Approvals", value: t.pending || 0, change: "Action Needed" }
                ];
                setStats(newStats);

                // 2. Process Lists
                const list = dashRes.meta.agentList || [];
                setAgents(list.filter(agent => agent.agentStatus?.approved));
                setPendingAgents(list.filter(agent => agent.agentStatus?.approved === false));

                // 3. Process Tickets
                setTickets(ticketsRes);

                if (dashRes.isFallback) setIsFallback(true);
            } catch (err) {
                console.error("Admin Dashboard Fail", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ... handleApprove / handleReject ...
    const handleApprove = async (id) => {
        try {
            await api.admin.agents.approve(id);

            setPendingAgents(prev =>
                prev.filter(agent => agent._id !== id)
            );

            setAgents(prev => {
                const approvedAgent = pendingAgents.find(a => a._id === id);
                return approvedAgent
                    ? [...prev, { ...approvedAgent, agentStatus: { approved: true } }]
                    : prev;
            });

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

    // New Assignment Logic
    const openAssignModal = (ticket) => {
        setSelectedTicket(ticket);
        setIsAssignModalOpen(true);
        setSelectedAgentId('');
    };

    const closeAssignModal = () => {
        setIsAssignModalOpen(false);
        setSelectedTicket(null);
    };

    const confirmAssign = async () => {
        if (!selectedAgentId || !selectedTicket) return;

        try {
            await api.tickets.assign(selectedTicket.id || selectedTicket._id, selectedAgentId);

            // Optimistic Update or Refresh
            const updatedTickets = await api.tickets.list();
            setTickets(updatedTickets);

            // Also refresh stats/agents active counts if possible, but optional for now
            closeAssignModal();
        } catch (err) {
            console.error("Assignment failed", err);
        }
    };

    const openTickets = tickets.filter(t => t.status === 'open');

    // Helper to normalize
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
        <div className="space-y-8 relative">
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
                    <p className="text-gray-400 text-sm">Welcome back, <span className="text-brand-purple font-medium">{user?.name?.split(' ')[0]}</span>. Real-time platform monitoring</p>
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
            <div className="bg-brand-card border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-amber-500/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" size={18} />
                        <h3 className="font-semibold text-white">Pending Approvals</h3>
                        <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-medium">{pendingAgents.length}</div>
                    </div>
                </div>
                {pendingAgents.length > 0 ? (
                    <div className="divide-y divide-gray-800">
                        {pendingAgents.map((agent) => (
                            <div key={agent._id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">{agent.name}</p>
                                    <p className="text-sm text-gray-400">{agent.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApprove(agent._id)}
                                        className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(agent._id)}
                                        className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No pending approvals.
                    </div>
                )}

            </div>

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
                                <tr key={agent._id} className="hover:bg-gray-800/30 transition-colors">
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

            {/* Assignment Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-brand-card border border-gray-700 rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="font-semibold text-white">Assign Ticket</h3>
                            <button onClick={closeAssignModal} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Ticket</label>
                                <div className="p-3 bg-gray-800/50 rounded border border-gray-700 text-white text-sm">
                                    <span className="text-gray-500 font-mono mr-2">#{selectedTicket?.id || selectedTicket?._id}</span>
                                    {selectedTicket?.subject}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Select Agent</label>
                                <select
                                    className="w-full bg-brand-dark border border-gray-700 text-white rounded p-2.5 focus:border-brand-purple focus:outline-none"
                                    value={selectedAgentId}
                                    onChange={(e) => setSelectedAgentId(e.target.value)}
                                >
                                    <option value="">-- Choose an agent --</option>
                                    {agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.name} ({agent.activeTicketCount || 0} active)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-900/50 flex justify-end gap-3">
                            <button
                                onClick={closeAssignModal}
                                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAssign}
                                disabled={!selectedAgentId}
                                className="px-4 py-2 text-sm font-medium bg-brand-purple hover:bg-brand-purple/90 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

