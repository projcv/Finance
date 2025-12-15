import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';

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
app.get('/api/v1/health', (req, res) => {
    res.json({
        success: true,
        message: 'GlassFinance API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.get('/api/v1', (req, res) => {
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
        },
    });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
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
});

export default app;
