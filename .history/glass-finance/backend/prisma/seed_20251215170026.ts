import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper function to generate random date within range
function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to get random item from array
function randomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

async function main() {
    console.log('🌱 Starting database seeding...');

    // ============================================
    // 1. CREATE DEMO USERS
    // ============================================
    console.log('👤 Creating users...');

    const hashedPassword = await bcrypt.hash('demo123', 10);

    const user1 = await prisma.user.upsert({
        where: { email: 'demo@glassfinance.com' },
        update: {},
        create: {
            email: 'demo@glassfinance.com',
            username: 'demo_user',
            passwordHash: hashedPassword,
            currency: 'VND',
            language: 'vi',
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'john@glassfinance.com' },
        update: {},
        create: {
            email: 'john@glassfinance.com',
            username: 'john_doe',
            passwordHash: hashedPassword,
            currency: 'USD',
            language: 'en',
        },
    });

    console.log('✅ Created users:', user1.email, user2.email);

    // ============================================
    // 2. CREATE CATEGORIES
    // ============================================
    console.log('📁 Creating categories...');

    const incomeCategories = [
        { name: 'Lương', icon: '💰', color: '#10b981', type: CategoryType.income },
        { name: 'Thưởng', icon: '🎁', color: '#3b82f6', type: CategoryType.income },
        { name: 'Freelance', icon: '💼', color: '#8b5cf6', type: CategoryType.income },
        { name: 'Đầu tư', icon: '📈', color: '#06b6d4', type: CategoryType.income },
        { name: 'Thu nhập khác', icon: '💵', color: '#14b8a6', type: CategoryType.income },
    ];

    const expenseCategories = [
        { name: 'Ăn uống', icon: '🍔', color: '#ef4444', type: CategoryType.expense },
        { name: 'Di chuyển', icon: '🚗', color: '#f59e0b', type: CategoryType.expense },
        { name: 'Mua sắm', icon: '🛍️', color: '#ec4899', type: CategoryType.expense },
        { name: 'Giải trí', icon: '🎮', color: '#6366f1', type: CategoryType.expense },
        { name: 'Hóa đơn', icon: '💡', color: '#14b8a6', type: CategoryType.expense },
        { name: 'Y tế', icon: '🏥', color: '#f43f5e', type: CategoryType.expense },
        { name: 'Giáo dục', icon: '📚', color: '#0ea5e9', type: CategoryType.expense },
        { name: 'Nhà cửa', icon: '🏠', color: '#84cc16', type: CategoryType.expense },
        { name: 'Quần áo', icon: '👔', color: '#a855f7', type: CategoryType.expense },
        { name: 'Làm đẹp', icon: '💄', color: '#d946ef', type: CategoryType.expense },
        { name: 'Thể thao', icon: '⚽', color: '#22c55e', type: CategoryType.expense },
        { name: 'Du lịch', icon: '✈️', color: '#06b6d4', type: CategoryType.expense },
    ];

    const createdIncomeCategories = [];
    for (const cat of incomeCategories) {
        const created = await prisma.category.create({
            data: {
                ...cat,
                userId: user1.id,
            },
        });
        createdIncomeCategories.push(created);
    }

    const createdExpenseCategories = [];
    for (const cat of expenseCategories) {
        const created = await prisma.category.create({
            data: {
                ...cat,
                userId: user1.id,
            },
        });
        createdExpenseCategories.push(created);
    }

    console.log('✅ Created', createdIncomeCategories.length + createdExpenseCategories.length, 'categories');

    // ============================================
    // 3. CREATE 100+ TRANSACTIONS
    // ============================================
    console.log('💸 Creating 100+ transactions...');

    const transactionTemplates = {
        income: [
            { description: 'Lương tháng', amounts: [15000000, 20000000, 25000000, 30000000] },
            { description: 'Thưởng dự án', amounts: [5000000, 10000000, 15000000] },
            { description: 'Freelance website', amounts: [3000000, 5000000, 8000000] },
            { description: 'Cổ tức đầu tư', amounts: [2000000, 3000000, 5000000] },
            { description: 'Bán đồ cũ', amounts: [500000, 1000000, 2000000] },
        ],
        expense: [
            { description: 'Ăn sáng', amounts: [30000, 50000, 70000] },
            { description: 'Ăn trưa', amounts: [50000, 80000, 120000] },
            { description: 'Ăn tối', amounts: [80000, 150000, 200000] },
            { description: 'Cà phê', amounts: [40000, 60000, 80000] },
            { description: 'Xăng xe', amounts: [200000, 300000, 500000] },
            { description: 'Grab/Taxi', amounts: [50000, 100000, 150000] },
            { description: 'Mua quần áo', amounts: [300000, 500000, 1000000] },
            { description: 'Mua giày', amounts: [500000, 800000, 1500000] },
            { description: 'Xem phim', amounts: [100000, 150000, 200000] },
            { description: 'Tiền điện', amounts: [500000, 800000, 1200000] },
            { description: 'Tiền nước', amounts: [100000, 150000, 200000] },
            { description: 'Tiền internet', amounts: [200000, 300000, 400000] },
            { description: 'Khám bệnh', amounts: [200000, 500000, 1000000] },
            { description: 'Mua thuốc', amounts: [100000, 200000, 500000] },
            { description: 'Mua sách', amounts: [100000, 200000, 300000] },
            { description: 'Khóa học online', amounts: [500000, 1000000, 2000000] },
            { description: 'Gym', amounts: [500000, 800000, 1200000] },
            { description: 'Siêu thị', amounts: [300000, 500000, 800000] },
        ],
    };

    const paymentMethods = ['Tiền mặt', 'Thẻ tín dụng', 'Chuyển khoản', 'Ví điện tử', 'MoMo', 'ZaloPay'];
    const locations = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];

    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');

    // Create 100+ transactions
    for (let i = 0; i < 120; i++) {
        const isIncome = Math.random() < 0.2; // 20% income, 80% expense
        const type = isIncome ? TransactionType.income : TransactionType.expense;

        const templates = isIncome ? transactionTemplates.income : transactionTemplates.expense;
        const template = randomItem(templates);
        const amount = randomItem(template.amounts);

        const categories = isIncome ? createdIncomeCategories : createdExpenseCategories;
        const category = randomItem(categories);

        await prisma.transaction.create({
            data: {
                userId: user1.id,
                amount,
                categoryId: category.id,
                description: template.description,
                date: randomDate(startDate, endDate),
                type,
                paymentMethod: randomItem(paymentMethods),
                location: Math.random() > 0.5 ? randomItem(locations) : null,
            },
        });
    }

    console.log('✅ Created 120 transactions');

    // ============================================
    // 4. CREATE BUDGETS
    // ============================================
    console.log('💰 Creating budgets...');

    const budgets = [
        {
            categoryId: createdExpenseCategories.find(c => c.name === 'Ăn uống')?.id,
            amount: 5000000,
            period: BudgetPeriod.monthly,
        },
        {
            categoryId: createdExpenseCategories.find(c => c.name === 'Di chuyển')?.id,
            amount: 2000000,
            period: BudgetPeriod.monthly,
        },
        {
            categoryId: createdExpenseCategories.find(c => c.name === 'Giải trí')?.id,
            amount: 1500000,
            period: BudgetPeriod.monthly,
        },
        {
            categoryId: null, // Overall budget
            amount: 15000000,
            period: BudgetPeriod.monthly,
        },
    ];

    for (const budget of budgets) {
        await prisma.budget.create({
            data: {
                userId: user1.id,
                ...budget,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
            },
        });
    }

    console.log('✅ Created', budgets.length, 'budgets');

    // ============================================
    // 5. CREATE SAVINGS GOALS
    // ============================================
    console.log('🎯 Creating savings goals...');

    const savingsGoals = [
        {
            name: 'Mua laptop mới',
            targetAmount: 30000000,
            currentAmount: 15000000,
            deadline: new Date('2024-12-31'),
            icon: '💻',
            color: '#3b82f6',
            description: 'MacBook Pro M3',
        },
        {
            name: 'Du lịch Nhật Bản',
            targetAmount: 50000000,
            currentAmount: 20000000,
            deadline: new Date('2025-06-30'),
            icon: '🗾',
            color: '#ec4899',
            description: 'Chuyến du lịch 7 ngày',
        },
        {
            name: 'Quỹ khẩn cấp',
            targetAmount: 100000000,
            currentAmount: 45000000,
            deadline: null,
            icon: '🏦',
            color: '#10b981',
            description: 'Dự phòng 6 tháng lương',
        },
    ];

    for (const goal of savingsGoals) {
        await prisma.savingsGoal.create({
            data: {
                userId: user1.id,
                ...goal,
            },
        });
    }

    console.log('✅ Created', savingsGoals.length, 'savings goals');

    // ============================================
    // 6. CREATE RECURRING BILLS
    // ============================================
    console.log('📅 Creating recurring bills...');

    const recurringBills = [
        {
            name: 'Tiền thuê nhà',
            amount: 5000000,
            frequency: RecurringFrequency.monthly,
            nextDueDate: new Date('2024-01-05'),
            reminderDays: 3,
        },
        {
            name: 'Tiền điện',
            amount: 800000,
            frequency: RecurringFrequency.monthly,
            nextDueDate: new Date('2024-01-10'),
            reminderDays: 5,
        },
        {
            name: 'Tiền internet',
            amount: 300000,
            frequency: RecurringFrequency.monthly,
            nextDueDate: new Date('2024-01-15'),
            reminderDays: 3,
        },
        {
            name: 'Netflix',
            amount: 260000,
            frequency: RecurringFrequency.monthly,
            nextDueDate: new Date('2024-01-20'),
            reminderDays: 2,
        },
        {
            name: 'Spotify',
            amount: 59000,
            frequency: RecurringFrequency.monthly,
            nextDueDate: new Date('2024-01-25'),
            reminderDays: 2,
        },
    ];

    for (const bill of recurringBills) {
        await prisma.recurringBill.create({
            data: {
                userId: user1.id,
                ...bill,
            },
        });
    }

    console.log('✅ Created', recurringBills.length, 'recurring bills');

    // ============================================
    // 7. CREATE NOTIFICATIONS
    // ============================================
    console.log('🔔 Creating notifications...');

    const notifications = [
        {
            type: NotificationType.budget_alert,
            title: 'Cảnh báo ngân sách',
            message: 'Bạn đã sử dụng 80% ngân sách "Ăn uống" tháng này',
        },
        {
            type: NotificationType.bill_reminder,
            title: 'Nhắc nhở hóa đơn',
            message: 'Tiền thuê nhà sẽ đến hạn trong 3 ngày nữa',
        },
        {
            type: NotificationType.goal_achieved,
            title: 'Chúc mừng!',
            message: 'Bạn đã đạt được mục tiêu tiết kiệm "Mua laptop mới"',
        },
    ];

    for (const notif of notifications) {
        await prisma.notification.create({
            data: {
                userId: user1.id,
                ...notif,
            },
        });
    }

    console.log('✅ Created', notifications.length, 'notifications');

    // ============================================
    // 8. CREATE FAMILY GROUP
    // ============================================
    console.log('👨‍👩‍👧‍👦 Creating family group...');

    const familyGroup = await prisma.familyGroup.create({
        data: {
            name: 'Gia đình Demo',
            description: 'Quản lý tài chính gia đình',
            ownerId: user1.id,
            currency: 'VND',
        },
    });

    await prisma.familyMembership.create({
        data: {
            groupId: familyGroup.id,
            userId: user1.id,
            role: 'owner',
        },
    });

    await prisma.familyMembership.create({
        data: {
            groupId: familyGroup.id,
            userId: user2.id,
            role: 'member',
        },
    });

    console.log('✅ Created family group with 2 members');

    // ============================================
    // 9. CREATE INVESTMENT PORTFOLIOS
    // ============================================
    console.log('📊 Creating investment portfolios...');

    const investments = [
        {
            name: 'Apple Inc.',
            type: InvestmentType.stocks,
            symbol: 'AAPL',
            quantity: 10,
            purchasePrice: 150,
            currentPrice: 180,
            purchaseDate: new Date('2024-01-15'),
        },
        {
            name: 'Bitcoin',
            type: InvestmentType.crypto,
            symbol: 'BTC',
            quantity: 0.5,
            purchasePrice: 40000,
            currentPrice: 45000,
            purchaseDate: new Date('2024-02-20'),
        },
        {
            name: 'Quỹ VNM ETF',
            type: InvestmentType.mutual_funds,
            symbol: 'VNM',
            quantity: 100,
            purchasePrice: 25000,
            currentPrice: 28000,
            purchaseDate: new Date('2024-03-10'),
        },
    ];

    for (const investment of investments) {
        await prisma.investmentPortfolio.create({
            data: {
                userId: user1.id,
                ...investment,
            },
        });
    }

    console.log('✅ Created', investments.length, 'investment portfolios');

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n🎉 Database seeding completed!');
    console.log('\n📝 Summary:');
    console.log('   👤 Users: 2');
    console.log('   📁 Categories:', createdIncomeCategories.length + createdExpenseCategories.length);
    console.log('   💸 Transactions: 120');
    console.log('   💰 Budgets:', budgets.length);
    console.log('   🎯 Savings Goals:', savingsGoals.length);
    console.log('   📅 Recurring Bills:', recurringBills.length);
    console.log('   🔔 Notifications:', notifications.length);
    console.log('   👨‍👩‍👧‍👦 Family Groups: 1');
    console.log('   📊 Investments:', investments.length);
    console.log('\n🔑 Demo credentials:');
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
