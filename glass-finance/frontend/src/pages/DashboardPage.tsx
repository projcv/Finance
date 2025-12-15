import { GlassStatCard, GlassPanel } from '@/components/Layout/GlassCard';
import { Button } from '@/components/UI/Button';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Plus,
} from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back! 👋
                    </h1>
                    <p className="text-white/70">
                        Here's what's happening with your finances today
                    </p>
                </div>
                <Button variant="primary" leftIcon={<Plus size={18} />}>
                    Add Transaction
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassStatCard
                    label="Total Balance"
                    value="$12,450"
                    icon={<Wallet size={24} className="text-primary-400" />}
                    trend={{ value: 12.5, isPositive: true }}
                />
                <GlassStatCard
                    label="Income"
                    value="$8,200"
                    icon={<TrendingUp size={24} className="text-success-400" />}
                    trend={{ value: 8.2, isPositive: true }}
                />
                <GlassStatCard
                    label="Expenses"
                    value="$3,450"
                    icon={<TrendingDown size={24} className="text-error-400" />}
                    trend={{ value: 3.1, isPositive: false }}
                />
                <GlassStatCard
                    label="Savings"
                    value="$4,800"
                    icon={<DollarSign size={24} className="text-secondary-400" />}
                    trend={{ value: 15.3, isPositive: true }}
                />
            </div>

            {/* Charts and Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Spending Chart */}
                <GlassPanel
                    title="Spending Overview"
                    subtitle="Last 30 days"
                    className="lg:col-span-2"
                >
                    <div className="h-64 flex items-center justify-center text-white/50">
                        Chart will be here
                    </div>
                </GlassPanel>

                {/* Quick Actions */}
                <GlassPanel title="Quick Actions">
                    <div className="space-y-3">
                        <button className="w-full glass-button justify-start">
                            <Plus size={18} />
                            <span>Add Transaction</span>
                        </button>
                        <button className="w-full glass-button justify-start">
                            <TrendingUp size={18} />
                            <span>View Analytics</span>
                        </button>
                        <button className="w-full glass-button justify-start">
                            <DollarSign size={18} />
                            <span>Set Budget</span>
                        </button>
                    </div>
                </GlassPanel>
            </div>

            {/* Recent Transactions */}
            <GlassPanel title="Recent Transactions" subtitle="Your latest activity">
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                    <Wallet size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Grocery Shopping</p>
                                    <p className="text-sm text-white/50">Food & Dining</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-error-400">-$125.50</p>
                                <p className="text-sm text-white/50">Today</p>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassPanel>
        </div>
    );
}
