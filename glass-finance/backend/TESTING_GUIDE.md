# 🎉 Budget & Analytics API - Testing Guide

## ✅ Build Status: SUCCESS

The backend has been successfully built and is ready for testing!

---

## 📋 Quick Start

### 1. Start the Development Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3000` and automatically:
- Initialize scheduled jobs for budget notifications
- Set up the cache service
- Connect to the database

---

## 🧪 Testing Endpoints

### Prerequisites

1. **Get an Access Token**
   First, you need to register and login to get a JWT token:

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response.

2. **Create a Category** (needed for budgets)

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Food & Dining",
    "icon": "🍔",
    "color": "#FF6B6B",
    "type": "expense"
  }'
```

Save the category `id` from the response.

---

## 🎯 Budget Endpoints Testing

### 1. Create a Budget

```bash
curl -X POST http://localhost:3000/api/v1/budgets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000000,
    "period": "monthly",
    "startDate": "2025-01-01",
    "categoryId": "YOUR_CATEGORY_ID",
    "notificationsEnabled": true
  }'
```

### 2. Get All Budgets

```bash
curl -X GET http://localhost:3000/api/v1/budgets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Get Budget Progress

```bash
curl -X GET http://localhost:3000/api/v1/budgets/YOUR_BUDGET_ID/progress \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Get Budget Insights

```bash
curl -X GET http://localhost:3000/api/v1/budgets/insights \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Update Budget

```bash
curl -X PUT http://localhost:3000/api/v1/budgets/YOUR_BUDGET_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 6000000
  }'
```

### 6. Delete Budget

```bash
curl -X DELETE http://localhost:3000/api/v1/budgets/YOUR_BUDGET_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 Analytics Endpoints Testing

### 1. Get Overview

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/overview?startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Get Monthly Analytics

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/monthly?year=2025&month=0" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Get Category Analytics

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/category?startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Get Spending Trends

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/trends?period=monthly&limit=12" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Compare Periods

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/comparison?period1Start=2025-01-01&period1End=2025-01-31&period2Start=2024-12-01&period2End=2024-12-31" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 6. Get Forecast

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/forecast?months=3" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7. Get Custom Report

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/reports?groupBy=category&includeIncome=true&includeExpense=true" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔧 Testing with Postman/Thunder Client

### Import Collection

Create a new collection with these settings:

**Base URL**: `http://localhost:3000/api/v1`

**Authorization**: Bearer Token
- Add `{{accessToken}}` variable

### Environment Variables

```json
{
  "baseUrl": "http://localhost:3000/api/v1",
  "accessToken": "YOUR_JWT_TOKEN",
  "categoryId": "YOUR_CATEGORY_ID",
  "budgetId": "YOUR_BUDGET_ID"
}
```

---

## 📝 Test Data Setup

To properly test analytics, you need some transactions. Here's a script to create test data:

```bash
# Create multiple transactions
for i in {1..20}; do
  curl -X POST http://localhost:3000/api/v1/transactions \
    -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"amount\": $((RANDOM % 500000 + 100000)),
      \"categoryId\": \"YOUR_CATEGORY_ID\",
      \"type\": \"expense\",
      \"date\": \"2025-01-$(printf %02d $((RANDOM % 28 + 1)))\",
      \"description\": \"Test transaction $i\",
      \"paymentMethod\": \"Credit Card\"
    }"
  sleep 0.5
done
```

---

## 🎯 Expected Results

### Budget Progress Response
```json
{
  "success": true,
  "data": {
    "budget": {
      "id": "...",
      "amount": 5000000,
      "period": "monthly"
    },
    "spent": 3500000,
    "remaining": 1500000,
    "percentage": 70,
    "status": "warning",
    "transactionCount": 45
  }
}
```

### Analytics Overview Response
```json
{
  "success": true,
  "data": {
    "summary": {
      "income": 30000000,
      "expenses": 20000000,
      "balance": 10000000
    },
    "topCategories": [...],
    "comparison": {
      "incomeChange": 5.5,
      "expenseChange": -3.2
    }
  }
}
```

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" Error
**Solution**: Make sure you're including the Bearer token in the Authorization header.

### Issue: "Budget not found"
**Solution**: Verify the budget ID is correct and belongs to your user.

### Issue: "Category not found"
**Solution**: Create a category first before creating a budget.

### Issue: No data in analytics
**Solution**: Create some transactions first to see analytics data.

---

## 📊 Scheduler Testing

The scheduler runs automatically:
- **Budget checks**: Every hour
- **Bill reminders**: Every 6 hours
- **Initial check**: After 1 minute of server start

To test notifications:
1. Create a budget with a low amount
2. Create transactions that exceed the budget
3. Wait for the next scheduled check (or restart the server)
4. Check notifications endpoint:

```bash
curl -X GET http://localhost:3000/api/v1/users/notifications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## ✅ Validation Testing

All endpoints have validation. Test with invalid data:

### Invalid Budget Amount
```bash
curl -X POST http://localhost:3000/api/v1/budgets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": -1000,
    "period": "monthly",
    "startDate": "2025-01-01"
  }'
```

Expected: `400 Bad Request` with validation errors

### Invalid Date Format
```bash
curl -X GET "http://localhost:3000/api/v1/analytics/overview?startDate=invalid-date" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Expected: `400 Bad Request` with validation errors

---

## 🎨 Performance Testing

### Cache Testing

The analytics endpoints are cached. Test by:

1. Call an analytics endpoint and note the response time
2. Call the same endpoint again immediately
3. The second call should be much faster (served from cache)

Cache TTL: 5 minutes (300 seconds)

---

## 📈 Load Testing (Optional)

Use Apache Bench or similar tools:

```bash
# Test analytics overview endpoint
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/analytics/overview"
```

---

## 🎯 Success Criteria

✅ All endpoints return 200/201 for valid requests
✅ All endpoints return 400 for invalid data
✅ All endpoints return 401 without authentication
✅ Budget progress calculates correctly
✅ Analytics data aggregates properly
✅ Forecasting provides reasonable predictions
✅ Scheduler creates notifications
✅ Cache improves performance

---

## 📚 Additional Resources

- **API Documentation**: `BUDGET_ANALYTICS_API.md`
- **Implementation Summary**: `BUDGET_ANALYTICS_IMPLEMENTATION.md`
- **Architecture**: `ARCHITECTURE.md`

---

## 🚀 Next Steps

1. ✅ Test all endpoints manually
2. ✅ Verify validation works
3. ✅ Check scheduler functionality
4. ✅ Test with real data
5. ⏭️ Write unit tests
6. ⏭️ Write integration tests
7. ⏭️ Deploy to staging
8. ⏭️ Performance optimization

---

**Happy Testing! 🎉**
