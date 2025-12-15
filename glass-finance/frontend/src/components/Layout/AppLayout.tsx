import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
}

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export function AppLayout({ children }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const pathname = location.pathname;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    if (isPublicRoute) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar */}
                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="backdrop-blur-xl bg-white/5 border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-center md:text-left">
                                <p className="text-sm text-white/70">
                                    © 2025 GlassFinance. All rights reserved.
                                </p>
                            </div>
                            <div className="flex items-center gap-6">
                                <a
                                    href="/privacy"
                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="/terms"
                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </a>
                                <a
                                    href="/help"
                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    Help Center
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default AppLayout;
