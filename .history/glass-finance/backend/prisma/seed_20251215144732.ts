import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);

    const user = await prisma.user.upsert({
        where: { email: 'demo@glassfinance.com' },
        update: {},
        create: {
            email: 'demo@glassfinance.com',
            name: 'Demo User',
            password: hashedPassword,
        },
    });

    console.log('✅ Created demo user:', user.email);

    // Create categories
    const categories = [
        { name: 'Salary', icon: '💰', color: '#10b981', type: 'income' },
        { name: 'Freelance', icon: '💼', color: '#3b82f6', type: 'income' },
        { name: 'Investment', icon: '📈', color: '#8b5cf6', type: 'income' },
        { name: 'Food & Dining', icon: '🍔', color: '#ef4444', type: 'expense' },
        { name: 'Transportation', icon: '🚗', color: '#f59e0b', type: 'expense' },
        { name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
        { name: 'Entertainment', icon: '🎮', color: '#6366f1', type: 'expense' },
        { name: 'Bills & Utilities', icon: '💡', color: '#14b8a6', type: 'expense' },
        { name: 'Healthcare', icon: '🏥', color: '#f43f5e', type: 'expense' },
        { name: 'Education', icon: '📚', color: '#0ea5e9', type: 'expense' },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: {
                id: `${user.id}-${category.name.toLowerCase().replace(/\s+/g, '-')}`
            },
            update: {},
            create: {
                ...category,
                userId: user.id,
            },
        });
    }

    console.log('✅ Created categories');

    // Create sample transactions
    const createdCategories = await prisma.category.findMany({
        where: { userId: user.id },
    });

    const transactions = [
        {
            amount: 5000,
            description: 'Monthly salary',
            type: 'income',
            date: new Date('2024-01-01'),
            categoryId: createdCategories.find(c => c.name === 'Salary')?.id || '',
        },
        {
            amount: 1500,
            description: 'Freelance project',
            type: 'income',
            date: new Date('2024-01-05'),
            categoryId: createdCategories.find(c => c.name === 'Freelance')?.id || '',
        },
        {
            amount: 150,
            description: 'Grocery shopping',
            type: 'expense',
            date: new Date('2024-01-03'),
            categoryId: createdCategories.find(c => c.name === 'Food & Dining')?.id || '',
        },
        {
            amount: 50,
            description: 'Gas station',
            type: 'expense',
            date: new Date('2024-01-04'),
            categoryId: createdCategories.find(c => c.name === 'Transportation')?.id || '',
        },
        {
            amount: 200,
            description: 'New shoes',
            type: 'expense',
            date: new Date('2024-01-06'),
            categoryId: createdCategories.find(c => c.name === 'Shopping')?.id || '',
        },
    ];

    for (const transaction of transactions) {
        await prisma.transaction.create({
            data: {
                ...transaction,
                userId: user.id,
            },
        });
    }

    console.log('✅ Created sample transactions');

    // Create sample budget
    await prisma.budget.create({
        data: {
            amount: 2000,
            period: 'monthly',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31'),
            categoryId: createdCategories.find(c => c.name === 'Food & Dining')?.id,
            userId: user.id,
        },
    });

    console.log('✅ Created sample budget');
    console.log('🎉 Database seeding completed!');
    console.log('\n📝 Demo credentials:');
    console.log('   Email: demo@glassfinance.com');
    console.log('   Password: demo123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
