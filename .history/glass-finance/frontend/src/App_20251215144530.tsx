import { BrowserRouter as Router } from 'react-router-dom'
import { motion } from 'framer-motion'

function App() {
    return (
        <Router>
            <div className="min-h-screen relative overflow-hidden">
                {/* Animated background elements */}
                <div className="fixed inset-0 -z-10">
                    <motion.div
                        className="absolute top-20 left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-20 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.5, 0.3, 0.5],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                {/* Main content */}
                <div className="relative z-10">
                    <header className="container mx-auto px-4 py-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="glass-card p-6"
                        >
                            <h1 className="text-4xl font-bold text-gradient">
                                💎 GlassFinance
                            </h1>
                            <p className="text-white/70 mt-2">
                                Modern Personal Finance Management
                            </p>
                        </motion.div>
                    </header>

                    <main className="container mx-auto px-4 py-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="glass-card p-8 text-center"
                        >
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Welcome to GlassFinance
                            </h2>
                            <p className="text-white/80 mb-6">
                                Your journey to financial clarity starts here.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button className="glass-btn-primary">
                                    Get Started
                                </button>
                                <button className="glass-btn">
                                    Learn More
                                </button>
                            </div>
                        </motion.div>

                        {/* Feature cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            {[
                                { icon: '💰', title: 'Track Expenses', desc: 'Monitor your spending effortlessly' },
                                { icon: '📊', title: 'Visual Analytics', desc: 'Beautiful charts and insights' },
                                { icon: '🎯', title: 'Budget Goals', desc: 'Set and achieve financial targets' },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                    className="glass-card p-6 hover:scale-105 transition-transform"
                                >
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-white/70">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </Router>
    )
}

export default App
