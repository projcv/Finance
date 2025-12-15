import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';
import categoryRoutes from './routes/categoryRoutes';
import budgetRoutes from './routes/budgetRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import { startScheduledJobs } from './services/schedulerService';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/v1/health', (_req: express.Request, res: express.Response) => {
    res.json({
        success: true,
        message: 'GlassFinance API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.get('/api/v1', (_req: express.Request, res: express.Response) => {
    res.json({
        success: true,
        message: 'Welcome to GlassFinance API',
        version: '1.0.0',
        endpoints: {
            health: '/api/v1/health',
            auth: '/api/v1/auth',
            users: '/api/v1/users',
            transactions: '/api/v1/transactions',
            categories: '/api/v1/categories',
            budgets: '/api/v1/budgets',
            analytics: '/api/v1/analytics',
        },
    });
});

// Register routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((_req: express.Request, res: express.Response) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Environment: ${config.nodeEnv}`);
    console.log(`🔗 API: http://localhost:${PORT}/api/v1`);

    // Start scheduled jobs
    startScheduledJobs();
});

export default app;
