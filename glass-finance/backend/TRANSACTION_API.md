# Transaction & Category API Documentation

## 📦 Transaction Endpoints

### 1. Get All Transactions
**GET** `/api/v1/transactions`

Get all transactions with filtering and pagination.

**Query Parameters:**
- `type` (optional): Filter by type (`income` | `expense`)
- `categoryId` (optional): Filter by category ID
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)
- `minAmount` (optional): Minimum amount
- `maxAmount` (optional): Maximum amount
- `search` (optional): Search in description
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page
- `sortBy` (optional, default: date): Sort field (`date` | `amount` | `createdAt`)
- `sortOrder` (optional, default: desc): Sort order (`asc` | `desc`)

**Example:**
```bash
GET /api/v1/transactions?type=expense&page=1&limit=10&sortBy=date&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 120,
      "totalPages": 12
    }
  }
}
```

---

### 2. Get Transaction by ID
**GET** `/api/v1/transactions/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "amount": 50000,
    "categoryId": "clyyy...",
    "description": "Ăn trưa",
    "date": "2024-01-15T00:00:00.000Z",
    "type": "expense",
    "paymentMethod": "Tiền mặt",
    "location": "Hà Nội",
    "category": {
      "id": "clyyy...",
      "name": "Ăn uống",
      "icon": "🍔",
      "color": "#ef4444"
    }
  }
}
```

---

### 3. Create Transaction
**POST** `/api/v1/transactions`

**Request Body:**
```json
{
  "amount": 50000,
  "categoryId": "clyyy...",
  "description": "Ăn trưa",
  "date": "2024-01-15T00:00:00.000Z",
  "type": "expense",
  "paymentMethod": "Tiền mặt",
  "location": "Hà Nội"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": { ... }
}
```

---

### 4. Update Transaction
**PUT** `/api/v1/transactions/:id`

**Request Body:** (all fields optional)
```json
{
  "amount": 60000,
  "description": "Ăn tối"
}
```

---

### 5. Delete Transaction
**DELETE** `/api/v1/transactions/:id`

**Response:**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

---

### 6. Bulk Create Transactions
**POST** `/api/v1/transactions/bulk`

**Request Body:**
```json
{
  "transactions": [
    {
      "amount": 50000,
      "categoryId": "clyyy...",
      "description": "Ăn trưa",
      "date": "2024-01-15T00:00:00.000Z",
      "type": "expense"
    },
    ...
  ]
}
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "message": "10 transactions created successfully"
}
```

---

### 7. Bulk Delete Transactions
**DELETE** `/api/v1/transactions/bulk`

**Request Body:**
```json
{
  "ids": ["clxxx1...", "clxxx2...", "clxxx3..."]
}
```

---

### 8. Get Transaction Statistics
**GET** `/api/v1/transactions/stats`

**Query Parameters:**
- `startDate` (optional): From date
- `endDate` (optional): To date

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000000,
    "totalExpense": 30000000,
    "balance": 20000000,
    "transactionCount": 120,
    "categoryStats": [
      {
        "categoryId": "clyyy...",
        "categoryName": "Ăn uống",
        "categoryIcon": "🍔",
        "categoryColor": "#ef4444",
        "type": "expense",
        "total": 5000000,
        "count": 45
      }
    ]
  }
}
```

---

### 9. Export Transactions to CSV
**GET** `/api/v1/transactions/export`

**Query Parameters:**
- `startDate` (optional)
- `endDate` (optional)
- `type` (optional)

**Response:** CSV file download

---

### 10. Import Transactions (Coming Soon)
**POST** `/api/v1/transactions/import`

---

## 📁 Category Endpoints

### 1. Get All Categories
**GET** `/api/v1/categories`

**Query Parameters:**
- `type` (optional): Filter by type (`income` | `expense` | `both`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clyyy...",
      "name": "Ăn uống",
      "icon": "🍔",
      "color": "#ef4444",
      "type": "expense",
      "parentId": null,
      "parent": null,
      "children": [],
      "_count": {
        "transactions": 45
      }
    }
  ]
}
```

---

### 2. Get Category by ID
**GET** `/api/v1/categories/:id`

---

### 3. Create Category
**POST** `/api/v1/categories`

**Request Body:**
```json
{
  "name": "Ăn uống",
  "icon": "🍔",
  "color": "#ef4444",
  "type": "expense",
  "parentId": null
}
```

**Validation:**
- `name`: 1-50 characters, unique per user
- `icon`: Required
- `color`: Hex color format (#RRGGBB)
- `type`: `income` | `expense` | `both`

---

### 4. Update Category
**PUT** `/api/v1/categories/:id`

**Request Body:** (all fields optional)
```json
{
  "name": "Ăn uống mới",
  "color": "#ff0000"
}
```

---

### 5. Delete Category
**DELETE** `/api/v1/categories/:id`

**Note:** Cannot delete if:
- Category has transactions
- Category has subcategories

**Error Response:**
```json
{
  "success": false,
  "error": "Cannot delete category with 45 transactions. Please reassign or delete them first."
}
```

---

### 6. Get Category Statistics
**GET** `/api/v1/categories/:id/stats`

**Query Parameters:**
- `startDate` (optional)
- `endDate` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "category": { ... },
    "totalAmount": 5000000,
    "transactionCount": 45,
    "recentTransactions": [...]
  }
}
```

---

## 🔐 Authentication

All endpoints require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## 📊 Advanced Filtering Examples

### Filter by date range and category
```bash
GET /api/v1/transactions?startDate=2024-01-01&endDate=2024-01-31&categoryId=clyyy...
```

### Search transactions
```bash
GET /api/v1/transactions?search=coffee
```

### Filter by amount range
```bash
GET /api/v1/transactions?minAmount=100000&maxAmount=500000
```

### Combine multiple filters
```bash
GET /api/v1/transactions?type=expense&startDate=2024-01-01&search=lunch&page=1&limit=20
```

---

## ⚠️ Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be positive"
    }
  ]
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Transaction not found"
}
```

### Cannot Delete (400)
```json
{
  "success": false,
  "error": "Cannot delete category with 45 transactions. Please reassign or delete them first."
}
```

---

## 🧪 Testing Examples

### Create a transaction
```bash
curl -X POST http://localhost:5000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "categoryId": "YOUR_CATEGORY_ID",
    "description": "Lunch",
    "date": "2024-01-15T00:00:00.000Z",
    "type": "expense",
    "paymentMethod": "Cash"
  }'
```

### Get transactions with filters
```bash
curl -X GET "http://localhost:5000/api/v1/transactions?type=expense&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get statistics
```bash
curl -X GET "http://localhost:5000/api/v1/transactions/stats?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
