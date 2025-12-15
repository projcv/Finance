import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Wallet,
    TrendingUp,
    PieChart,
    Target,
    CreditCard,
    Settings,
    HelpCircle,
    X,
} from 'lucide-react';
import { IconButton } from '@/components/UI/Button';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Transactions',
        href: '/transactions',
        icon: Wallet,
    },
    {
        name: 'Analytics',
        href: '/analytics',
        icon: TrendingUp,
    },
    {
        name: 'Budgets',
        href: '/budgets',
        icon: PieChart,
    },
    {
        name: 'Goals',
        href: '/goals',
        icon: Target,
    },
    {
        name: 'Bills',
        href: '/bills',
        icon: CreditCard,
    },
];

const bottomNavigation = [
    {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
    },
    {
        name: 'Help',
        href: '/help',
        icon: HelpCircle,
    },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const location = useLocation();
    const pathname = location.pathname;

    const NavLink = ({ item }: { item: typeof navigation[0] }) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
            <Link
                to={item.href}
                onClick={onClose}
                className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                    'group relative overflow-hidden',
                    isActive
                        ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 shadow-glow-sm'
                        : 'hover:bg-white/10 border border-transparent'
                )}
            >
                {/* Active Indicator */}
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r-full" />
                )}

                <Icon
                    size={20}
                    className={cn(
                        'transition-colors',
                        isActive ? 'text-primary-400' : 'text-white/70 group-hover:text-white'
                    )}
                />
                <span
                    className={cn(
                        'font-medium transition-colors',
                        isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                    )}
                >
                    {item.name}
                </span>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed lg:sticky top-0 left-0 z-50',
                    'h-screen w-64',
                    'backdrop-blur-xl bg-white/5',
                    'border-r border-white/10',
                    'flex flex-col',
                    'transition-transform duration-300',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
                            <span className="text-white font-bold text-xl">G</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold gradient-text">GlassFinance</h1>
                            <p className="text-xs text-white/50">Personal Finance</p>
                        </div>
                    </Link>

                    <IconButton
                        icon={<X size={20} />}
                        variant="glass"
                        size="sm"
                        onClick={onClose}
                        className="lg:hidden"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                    <div className="space-y-1">
                        {navigation.map((item) => (
                            <NavLink key={item.name} item={item} />
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="my-6 divider" />

                    {/* Quick Stats */}
                    <div className="glass-card p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">
                            Quick Stats
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/70">This Month</span>
                                <span className="text-sm font-semibold text-white">$2,450</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/70">Budget Left</span>
                                <span className="text-sm font-semibold text-success-400">$1,550</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/70">Savings</span>
                                <span className="text-sm font-semibold text-primary-400">$5,200</span>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Bottom Navigation */}
                <div className="p-4 border-t border-white/10 space-y-1">
                    {bottomNavigation.map((item) => (
                        <NavLink key={item.name} item={item} />
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                    <div className="glass-card p-3 text-center">
                        <p className="text-xs text-white/50">
                            © 2025 GlassFinance
                        </p>
                        <p className="text-xs text-white/30 mt-1">
                            v1.0.0
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
