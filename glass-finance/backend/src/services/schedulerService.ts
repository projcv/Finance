import { PrismaClient } from '@prisma/client';
import { getBudgetProgress } from './budgetService';

const prisma = new PrismaClient();

/**
 * Check budgets and create notifications
 */
export async function checkBudgetsAndNotify() {
    try {
        console.log('[Scheduler] Checking budgets for notifications...');

        // Get all active budgets with notifications enabled
        const now = new Date();
        const budgets = await prisma.budget.findMany({
            where: {
                notificationsEnabled: true,
                startDate: { lte: now },
                OR: [
                    { endDate: null },
                    { endDate: { gte: now } }
                ]
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    }
                },
                category: {
                    select: {
                        name: true,
                    }
                }
            }
        });

        console.log(`[Scheduler] Found ${budgets.length} active budgets to check`);

        let notificationsCreated = 0;

        for (const budget of budgets) {
            try {
                // Get budget progress
                const progress = await getBudgetProgress(budget.userId, budget.id);

                // Determine if notification is needed
                let shouldNotify = false;
                let notificationType = 'budget_alert';
                let title = '';
                let message = '';

                if (progress.status === 'exceeded') {
                    shouldNotify = true;
                    title = 'Budget Exceeded!';
                    message = budget.categoryId
                        ? `Your budget for "${budget.category?.name}" has been exceeded. You've spent ${progress.spent.toLocaleString()} out of ${budget.amount.toLocaleString()}.`
                        : `Your overall budget has been exceeded. You've spent ${progress.spent.toLocaleString()} out of ${budget.amount.toLocaleString()}.`;
                } else if (progress.status === 'warning' && progress.percentage >= 90) {
                    shouldNotify = true;
                    title = 'Budget Warning';
                    message = budget.categoryId
                        ? `You've used ${Math.round(progress.percentage)}% of your budget for "${budget.category?.name}". Only ${progress.remaining.toLocaleString()} remaining.`
                        : `You've used ${Math.round(progress.percentage)}% of your overall budget. Only ${progress.remaining.toLocaleString()} remaining.`;
                }

                if (shouldNotify) {
                    // Check if we already sent a notification recently (within last 24 hours)
                    const recentNotification = await prisma.notification.findFirst({
                        where: {
                            userId: budget.userId,
                            type: notificationType,
                            createdAt: {
                                gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                            },
                            message: {
                                contains: budget.categoryId ? budget.category?.name : 'overall budget'
                            }
                        }
                    });

                    if (!recentNotification) {
                        // Create notification
                        await prisma.notification.create({
                            data: {
                                userId: budget.userId,
                                type: notificationType,
                                title,
                                message,
                                status: 'unread',
                                data: JSON.stringify({
                                    budgetId: budget.id,
                                    categoryId: budget.categoryId,
                                    spent: progress.spent,
                                    limit: budget.amount,
                                    percentage: progress.percentage,
                                })
                            }
                        });

                        notificationsCreated++;
                        console.log(`[Scheduler] Created notification for user ${budget.user.username}: ${title}`);
                    }
                }
            } catch (error) {
                console.error(`[Scheduler] Error checking budget ${budget.id}:`, error);
            }
        }

        console.log(`[Scheduler] Budget check complete. Created ${notificationsCreated} notifications.`);
        return notificationsCreated;
    } catch (error) {
        console.error('[Scheduler] Error in budget notification scheduler:', error);
        throw error;
    }
}

/**
 * Check recurring bills and create reminders
 */
export async function checkRecurringBillsAndNotify() {
    try {
        console.log('[Scheduler] Checking recurring bills for reminders...');

        const now = new Date();
        const reminderWindow = new Date();
        reminderWindow.setDate(reminderWindow.getDate() + 7); // Check bills due in next 7 days

        const bills = await prisma.recurringBill.findMany({
            where: {
                isActive: true,
                nextDueDate: {
                    gte: now,
                    lte: reminderWindow,
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            }
        });

        console.log(`[Scheduler] Found ${bills.length} upcoming bills`);

        let notificationsCreated = 0;

        for (const bill of bills) {
            try {
                const daysUntilDue = Math.ceil(
                    (new Date(bill.nextDueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                );

                // Only notify if within reminder days
                if (daysUntilDue <= bill.reminderDays) {
                    // Check if we already sent a notification for this bill recently
                    const recentNotification = await prisma.notification.findFirst({
                        where: {
                            userId: bill.userId,
                            type: 'bill_reminder',
                            createdAt: {
                                gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                            },
                            message: {
                                contains: bill.name
                            }
                        }
                    });

                    if (!recentNotification) {
                        const title = 'Bill Reminder';
                        const message = `Your bill "${bill.name}" of ${bill.amount.toLocaleString()} is due in ${daysUntilDue} day(s).`;

                        await prisma.notification.create({
                            data: {
                                userId: bill.userId,
                                type: 'bill_reminder',
                                title,
                                message,
                                status: 'unread',
                                data: JSON.stringify({
                                    billId: bill.id,
                                    amount: bill.amount,
                                    dueDate: bill.nextDueDate,
                                    daysUntilDue,
                                })
                            }
                        });

                        notificationsCreated++;
                        console.log(`[Scheduler] Created bill reminder for user ${bill.user.username}: ${bill.name}`);
                    }
                }
            } catch (error) {
                console.error(`[Scheduler] Error checking bill ${bill.id}:`, error);
            }
        }

        console.log(`[Scheduler] Bill check complete. Created ${notificationsCreated} notifications.`);
        return notificationsCreated;
    } catch (error) {
        console.error('[Scheduler] Error in bill reminder scheduler:', error);
        throw error;
    }
}

/**
 * Start scheduled jobs
 */
export function startScheduledJobs() {
    console.log('[Scheduler] Starting scheduled jobs...');

    // Check budgets every hour
    setInterval(async () => {
        try {
            await checkBudgetsAndNotify();
        } catch (error) {
            console.error('[Scheduler] Budget check failed:', error);
        }
    }, 60 * 60 * 1000); // Every hour

    // Check bills every 6 hours
    setInterval(async () => {
        try {
            await checkRecurringBillsAndNotify();
        } catch (error) {
            console.error('[Scheduler] Bill check failed:', error);
        }
    }, 6 * 60 * 60 * 1000); // Every 6 hours

    // Run initial checks after 1 minute
    setTimeout(async () => {
        try {
            await checkBudgetsAndNotify();
            await checkRecurringBillsAndNotify();
        } catch (error) {
            console.error('[Scheduler] Initial check failed:', error);
        }
    }, 60 * 1000);

    console.log('[Scheduler] Scheduled jobs started successfully');
}
