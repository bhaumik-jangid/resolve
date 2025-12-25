import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { HeaderBar } from './HeaderBar';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

import { FluidBackground } from '../components/common/FluidBackground';

export const AppLayout = () => {
    const { user, loading } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    if (loading) return null; // Or a full page loader

    if (!user) {
        return <Navigate to="/auth" />;
    }

    return (
        <div className="min-h-screen bg-brand-darker text-white flex relative isolate">
            <FluidBackground />

            {/* Sidebar */}
            <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            {/* Main Content Wrapper */}
            <div
                className={cn(
                    "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                    sidebarCollapsed ? "ml-20" : "ml-[260px]" // Match sidebar width states
                )}
            >
                <HeaderBar />

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
