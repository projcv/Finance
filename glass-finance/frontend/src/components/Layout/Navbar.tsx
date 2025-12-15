import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { IconButton } from '@/components/UI/Button';
import {
    Bell,
    Search,
    Menu,
    User,
    Settings,
    LogOut,
    ChevronDown,
} from 'lucide-react';

interface NavbarProps {
    onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                        <IconButton
                            icon={<Menu size={20} />}
                            variant="glass"
                            size="md"
                            onClick={onMenuClick}
                            className="lg:hidden"
                        />

                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                            <span className="hidden sm:block text-xl font-bold gradient-text">
                                GlassFinance
                            </span>
                        </Link>
                    </div>

                    {/* Center Section - Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                            <input
                                type="text"
                                placeholder="Search transactions, budgets..."
                                className="glass-input w-full pl-10"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        {/* Search Icon (Mobile) */}
                        <IconButton
                            icon={<Search size={20} />}
                            variant="glass"
                            size="md"
                            className="md:hidden"
                        />

                        {/* Notifications */}
                        <div className="relative">
                            <IconButton
                                icon={<Bell size={20} />}
                                variant="glass"
                                size="md"
                                onClick={() => setShowNotifications(!showNotifications)}
                            />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full ring-2 ring-white/20" />

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowNotifications(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-80 glass-card p-4 z-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-white">Notifications</h3>
                                            <button className="text-sm text-primary-400 hover:text-primary-300">
                                                Mark all read
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                                                <p className="text-sm text-white font-medium">Budget Alert</p>
                                                <p className="text-xs text-white/70 mt-1">
                                                    You've spent 80% of your Food budget
                                                </p>
                                                <p className="text-xs text-white/50 mt-1">2 hours ago</p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                                                <p className="text-sm text-white font-medium">New Transaction</p>
                                                <p className="text-xs text-white/70 mt-1">
                                                    Payment of $50.00 added
                                                </p>
                                                <p className="text-xs text-white/50 mt-1">5 hours ago</p>
                                            </div>
                                        </div>
                                        <Link
                                            to="/notifications"
                                            className="block text-center text-sm text-primary-400 hover:text-primary-300 mt-4 pt-3 border-t border-white/10"
                                        >
                                            View all notifications
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 glass-button py-2 px-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User size={18} className="text-white" />
                                    )}
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-white">
                                    {user?.username || 'User'}
                                </span>
                                <ChevronDown size={16} className="text-white/70" />
                            </button>

                            {/* User Dropdown */}
                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 glass-card p-2 z-50">
                                        <div className="px-3 py-2 border-b border-white/10 mb-2">
                                            <p className="text-sm font-medium text-white">{user?.username}</p>
                                            <p className="text-xs text-white/70">{user?.email}</p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User size={18} className="text-white/70" />
                                            <span className="text-sm text-white">Profile</span>
                                        </Link>

                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings size={18} className="text-white/70" />
                                            <span className="text-sm text-white">Settings</span>
                                        </Link>

                                        <div className="my-2 h-px bg-white/10" />

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-error-500/20 transition-colors text-error-400"
                                        >
                                            <LogOut size={18} />
                                            <span className="text-sm">Logout</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
