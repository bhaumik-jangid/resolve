import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Ticket,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const Sidebar = ({ collapsed, setCollapsed }) => {
    const { user, logout } = useAuth();

    // Define menu items based on roles
    const menus = {
        customer: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/overview' },
            { label: 'My Tickets', icon: Ticket, path: '/dashboard/tickets' },
            { label: 'Chat Support', icon: MessageSquare, path: '/dashboard/chat' },
            { label: 'Profile', icon: Settings, path: '/dashboard/profile' },
        ],
        agent: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/overview' },
            { label: 'Assigned Tickets', icon: Ticket, path: '/dashboard/tickets' },
            { label: 'Chat', icon: MessageSquare, path: '/dashboard/chat' },
            { label: 'Profile', icon: Settings, path: '/dashboard/profile' },
        ],
        admin: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/overview' },
            { label: 'All Tickets', icon: Ticket, path: '/dashboard/tickets' },
            { label: 'Chats', icon: MessageSquare, path: '/dashboard/chat' },
            { label: 'Agents', icon: Users, path: '/dashboard/agents' },
            { label: 'Profile', icon: Settings, path: '/dashboard/profile' },
        ]
    };

    const currentMenu = user ? menus[user.role] || menus.customer : [];

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 260 }}
            className="h-screen bg-brand-darker border-r border-gray-800 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out"
        >
            {/* Brand Header */}
            <div className="h-16 flex items-center justify-center border-b border-gray-800 relative">
                <div className="flex items-center gap-3 overflow-hidden px-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orchid to-brand-purple flex-shrink-0 flex items-center justify-center font-bold text-white">
                        R
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-bold text-xl text-white whitespace-nowrap"
                            >
                                Resolve
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-lg hover:bg-brand-orchid transition-colors",
                        "hidden md:flex" // Hide toggle on mobile
                    )}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {currentMenu.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                            isActive
                                ? "bg-brand-purple/10 text-brand-light"
                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute left-0 top-0 w-1 h-full bg-brand-orchid"
                                    />
                                )}
                                <item.icon size={20} className={cn("flex-shrink-0 transition-colors", isActive && "text-brand-orchid")} />
                                {!collapsed && (
                                    <span className="whitespace-nowrap font-medium">{item.label}</span>
                                )}

                                {/* Tooltip for collapsed state */}
                                {collapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                                        {item.label}
                                    </div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-gray-800">
                <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                    <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium flex-shrink-0">
                        {user?.name?.[0] || 'U'}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
                        </div>
                    )}
                    {!collapsed && (
                        <button
                            onClick={logout}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};
