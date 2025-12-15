# Budget & Analytics API Documentation

## Overview
This document describes the Budget and Analytics API endpoints for the GlassFinance application.

## Base URL
```
http://localhost:3000/api/v1
```

All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Budget Endpoints

### 1. GET /budgets
Get all budgets for the authenticated user with optional filters.

**Query Parameters:**
- `period` (optional): Filter by period - `daily`, `weekly`, `monthly`, `yearly`
- `categoryId` (optional): Filter by category ID
- `active` (optional): Filter active budgets - `true` or `false`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "budget_id",
      "userId": "user_id",
      "categoryId": "category_id",
      "amount": 5000000,
      "period": "monthly",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": null,
      "notificationsEnabled": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "category": {
        "id": "category_id",
        "name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B"
      }
    }
  ]
}
```

### 2. POST /budgets
Create a new budget.

**Request Body:**
```json
{
  "amount": 5000000,
  "period": "monthly",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "categoryId": "category_id",
  "notificationsEnabled": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Budget created successfully",
  "data": {
    "id": "budget_id",
    "userId": "user_id",
    "categoryId": "category_id",
    "amount": 5000000,
    "period": "monthly",
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-12-31T23:59:59.999Z",
    "notificationsEnabled": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "category": {
      "id": "category_id",
      "name": "Food & Dining",
      "icon": "🍔",
      "color": "#FF6B6B"
    }
  }
}
```

### 3. PUT /budgets/:id
Update an existing budget.

**URL Parameters:**
- `id`: Budget ID

**Request Body:**
```json
{
  "amount": 6000000,
  "notificationsEnabled": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Budget updated successfully",
  "data": {
    "id": "budget_id",
    "userId": "user_id",
    "amount": 6000000,
    "notificationsEnabled": false,
    ...
  }
}
```

### 4. DELETE /budgets/:id
Delete a budget.

**URL Parameters:**
- `id`: Budget ID

**Response:**
```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

### 5. GET /budgets/:id/progress
Get budget progress and spending status.

**URL Parameters:**
- `id`: Budget ID

**Response:**
```json
{
  "success": true,
  "data": {
    "budget": {
      "id": "budget_id",
      "amount": 5000000,
      "period": "monthly",
      ...
    },
    "period": {
      "start": "2025-01-01T00:00:00.000Z",
      "end": "2025-01-31T23:59:59.999Z"
    },
    "spent": 3500000,
    "remaining": 1500000,
    "percentage": 70,
    "status": "warning",
    "transactionCount": 45
  }
}
```

**Status Values:**
- `safe`: Less than 80% spent
- `warning`: 80-99% spent
- `exceeded`: 100% or more spent

### 6. GET /budgets/insights
Get budget insights and recommendations.

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBudgets": 5,
      "totalBudget": 20000000,
      "totalSpent": 15000000,
      "totalRemaining": 5000000,
      "overBudgetCount": 1,
      "warningCount": 2,
      "safeCount": 2
    },
    "budgets": [
      {
        "budget": {...},
        "spent": 3500000,
        "remaining": 1500000,
        "percentage": 70,
        "status": "warning"
      }
    ],
    "recommendations": [
      "You have 1 budget(s) that have been exceeded. Consider reviewing your spending.",
      "Your highest spending is in \"Food & Dining\" with 3,500,000 spent.",
      "Consider creating budgets for: Transportation, Entertainment"
    ]
  }
}
```

---

## Analytics Endpoints

### 1. GET /analytics/overview
Get spending overview for a period.

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601 format)
- `endDate` (optional): End date (ISO 8601 format)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-01-01T00:00:00.000Z",
      "end": "2025-01-31T23:59:59.999Z"
    },
    "summary": {
      "income": 30000000,
      "expenses": 20000000,
      "balance": 10000000,
      "incomeCount": 5,
      "expenseCount": 120,
      "totalTransactions": 125,
      "avgIncome": 6000000,
      "avgExpense": 166667
    },
    "comparison": {
      "incomeChange": 5.5,
      "expenseChange": -3.2,
      "previousPeriod": {
        "income": 28500000,
        "expenses": 20660000
      }
    },
    "topCategories": [
      {
        "categoryId": "cat_id",
        "name": "Food & Dining",
        "amount": 5000000,
        "count": 45,
        "icon": "🍔",
        "color": "#FF6B6B"
      }
    ]
  }
}
```

### 2. GET /analytics/monthly
Get detailed monthly analytics.

**Query Parameters:**
- `year` (optional): Year (default: current year)
- `month` (optional): Month (0-11, default: current month)

**Response:**
```json
{
  "success": true,
  "data": {
    "month": 1,
    "year": 2025,
    "period": {
      "start": "2025-01-01T00:00:00.000Z",
      "end": "2025-01-31T23:59:59.999Z"
    },
    "summary": {
      "totalIncome": 30000000,
      "totalExpenses": 20000000,
      "transactionCount": 125
    },
    "dailyData": [
      {
        "date": "2025-01-01",
        "income": 1000000,
        "expenses": 500000,
        "balance": 500000,
        "transactionCount": 5
      }
    ],
    "categories": [
      {
        "id": "cat_id",
        "name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B",
        "income": 0,
        "expenses": 5000000,
        "count": 45
      }
    ],
    "paymentMethods": [
      {
        "method": "Credit Card",
        "income": 0,
        "expenses": 8000000,
        "count": 60
      }
    ]
  }
}
```

### 3. GET /analytics/category
Get category-based analytics.

**Query Parameters:**
- `startDate` (optional): Start date
- `endDate` (optional): End date
- `type` (optional): Transaction type - `income` or `expense`

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-01-01T00:00:00.000Z",
      "end": "2025-01-31T23:59:59.999Z"
    },
    "total": 20000000,
    "transactionCount": 120,
    "categoryCount": 8,
    "categories": [
      {
        "id": "cat_id",
        "name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B",
        "type": "expense",
        "total": 5000000,
        "count": 45,
        "avgAmount": 111111,
        "percentage": 25,
        "transactions": [
          {
            "id": "trans_id",
            "amount": 150000,
            "date": "2025-01-15T12:00:00.000Z",
            "description": "Lunch"
          }
        ]
      }
    ]
  }
}
```

### 4. GET /analytics/trends
Get spending trends over time.

**Query Parameters:**
- `period` (optional): Period type - `daily`, `weekly`, `monthly`, `yearly` (default: `monthly`)
- `limit` (optional): Number of periods to return (default: 12)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "monthly",
    "trends": [
      {
        "period": "Jan 2025",
        "date": "2025-01-01T00:00:00.000Z",
        "income": 30000000,
        "expenses": 20000000,
        "balance": 10000000,
        "transactionCount": 125
      }
    ],
    "analysis": {
      "direction": "increasing",
      "changePercentage": 5.5,
      "averageIncome": 28500000,
      "averageExpenses": 19000000
    }
  }
}
```

### 5. GET /analytics/comparison
Compare two time periods.

**Query Parameters (all required):**
- `period1Start`: Period 1 start date
- `period1End`: Period 1 end date
- `period2Start`: Period 2 start date
- `period2End`: Period 2 end date

**Response:**
```json
{
  "success": true,
  "data": {
    "period1": {
      "range": {
        "start": "2025-01-01T00:00:00.000Z",
        "end": "2025-01-31T23:59:59.999Z"
      },
      "stats": {
        "income": 30000000,
        "expenses": 20000000,
        "balance": 10000000,
        "transactionCount": 125,
        "avgTransaction": 240000,
        "topCategory": ["Food & Dining", 5000000]
      }
    },
    "period2": {
      "range": {...},
      "stats": {...}
    },
    "comparison": {
      "incomeChange": 5.5,
      "expenseChange": -3.2,
      "balanceChange": 15.8,
      "transactionCountChange": 8.7
    }
  }
}
```

### 6. GET /analytics/forecast
Get spending forecast for future months.

**Query Parameters:**
- `months` (optional): Number of months to forecast (1-12, default: 3)

**Response:**
```json
{
  "success": true,
  "data": {
    "historical": {
      "months": 6,
      "avgIncome": 28500000,
      "avgExpenses": 19000000,
      "trend": "increasing"
    },
    "forecast": [
      {
        "month": "Feb 2025",
        "date": "2025-02-01T00:00:00.000Z",
        "projectedIncome": 28500000,
        "projectedExpenses": 19500000,
        "projectedBalance": 9000000,
        "confidence": 0.9
      }
    ]
  }
}
```

### 7. GET /analytics/reports
Generate custom reports with flexible grouping.

**Query Parameters:**
- `startDate` (optional): Start date
- `endDate` (optional): End date
- `groupBy` (optional): Group by - `category`, `date`, `paymentMethod` (default: `category`)
- `includeIncome` (optional): Include income transactions (default: `true`)
- `includeExpense` (optional): Include expense transactions (default: `true`)
- `categories` (optional): Comma-separated category IDs to filter

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-01-01T00:00:00.000Z",
      "end": "2025-01-31T23:59:59.999Z"
    },
    "options": {
      "groupBy": "category",
      "includeIncome": true,
      "includeExpense": true
    },
    "summary": {
      "totalIncome": 30000000,
      "totalExpenses": 20000000,
      "balance": 10000000,
      "transactionCount": 125
    },
    "data": [
      {
        "id": "cat_id",
        "name": "Food & Dining",
        "icon": "🍔",
        "color": "#FF6B6B",
        "income": 0,
        "expenses": 5000000,
        "count": 45,
        "transactions": [...]
      }
    ]
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Notes

1. **Date Formats**: All dates should be in ISO 8601 format (e.g., `2025-01-01T00:00:00.000Z`)
2. **Currency**: All amounts are in the user's preferred currency (default: VND)
3. **Caching**: Analytics endpoints are cached for 5 minutes to improve performance
4. **Rate Limiting**: API calls are limited to prevent abuse
5. **Pagination**: Some endpoints support pagination (check individual endpoint docs)

---

## Examples

### Create a Monthly Food Budget
```bash
curl -X POST http://localhost:3000/api/v1/budgets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000000,
    "period": "monthly",
    "startDate": "2025-01-01",
    "categoryId": "food_category_id",
    "notificationsEnabled": true
  }'
```

### Get Monthly Analytics
```bash
curl -X GET "http://localhost:3000/api/v1/analytics/monthly?year=2025&month=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Spending Trends
```bash
curl -X GET "http://localhost:3000/api/v1/analytics/trends?period=monthly&limit=12" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Compare Two Months
```bash
curl -X GET "http://localhost:3000/api/v1/analytics/comparison?period1Start=2025-01-01&period1End=2025-01-31&period2Start=2024-12-01&period2End=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
