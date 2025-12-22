import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const HeaderBar = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const title = pathSegments[pathSegments.length - 1] || 'Dashboard';

    return (
        <header className="h-16 bg-brand-darker/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Page Title / Breadcrumbs */}
            <div>
                <h2 className="text-lg font-semibold text-white capitalize">{title}</h2>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Search Mock */}
                <div className="relative hidden md:block">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-brand-dark text-sm text-white pl-9 pr-4 py-2 rounded-full border border-gray-700 focus:outline-none focus:border-brand-purple w-64 transition-all"
                    />
                </div>
            </div>
        </header>
    );
};
