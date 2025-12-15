# GlassFinance Backend API

## 🚀 Authentication & User Management API

### Base URL
```
http://localhost:5000/api/v1
```

---

## 📋 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123",
  "currency": "VND",
  "language": "vi"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "username": "johndoe",
      "currency": "VND",
      "language": "vi"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 2. Login
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "demo@glassfinance.com",
  "password": "demo123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "demo@glassfinance.com",
      "username": "demo_user",
      "avatar": null,
      "currency": "VND",
      "language": "vi"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 3. Refresh Token
**POST** `/auth/refresh`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 4. Logout
**POST** `/auth/logout`

Logout user (client should remove tokens).

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 5. Forgot Password
**POST** `/auth/forgot-password`

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent",
  "resetToken": "eyJhbGciOiJIUzI1NiIs..." // Only in development
}
```

---

### 6. Reset Password
**POST** `/auth/reset-password`

Reset password using reset token.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "newPassword": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 7. Verify Email
**GET** `/auth/verify-email?token=xxx`

Verify email address.

**Query Parameters:**
- `token` (string, required): Email verification token

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

## 👤 User Management Endpoints

**All user endpoints require authentication. Include the access token in the Authorization header:**
```
Authorization: Bearer <access_token>
```

---

### 8. Get Profile
**GET** `/users/profile`

Get current user profile.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "email": "demo@glassfinance.com",
    "username": "demo_user",
    "avatar": null,
    "currency": "VND",
    "language": "vi",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 9. Update Profile
**PUT** `/users/profile`

Update user profile information.

**Request Body:**
```json
{
  "username": "new_username",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "clxxx...",
    "email": "demo@glassfinance.com",
    "username": "new_username",
    "avatar": "https://example.com/avatar.jpg",
    "currency": "VND",
    "language": "vi",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 10. Update Preferences
**PUT** `/users/preferences`

Update user preferences (currency, language).

**Request Body:**
```json
{
  "currency": "USD",
  "language": "en"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "id": "clxxx...",
    "email": "demo@glassfinance.com",
    "username": "demo_user",
    "avatar": null,
    "currency": "USD",
    "language": "en",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 11. Get User Statistics
**GET** `/users/stats`

Get user statistics (total transactions, categories, etc.).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalTransactions": 120,
    "totalCategories": 17,
    "totalBudgets": 4,
    "totalGoals": 3
  }
}
```

---

### 12. Delete Account
**DELETE** `/users/account`

Delete user account (irreversible).

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 🔐 Authentication Flow

### Initial Login
1. User calls `/auth/login` with credentials
2. Server returns `accessToken` (15min) and `refreshToken` (7 days)
3. Client stores both tokens

### Making Authenticated Requests
1. Include `Authorization: Bearer <accessToken>` header
2. If token expired (401 with code `TOKEN_EXPIRED`):
   - Call `/auth/refresh` with `refreshToken`
   - Get new `accessToken` and `refreshToken`
   - Retry original request

### Logout
1. Call `/auth/logout`
2. Remove tokens from client storage

---

## ⚠️ Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "error": "Invalid token",
  "code": "INVALID_TOKEN"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "User not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@glassfinance.com",
    "password": "demo123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📦 Demo Credentials

```
Email: demo@glassfinance.com
Password: demo123
```

---

## 🛡️ Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT with short-lived access tokens (15min)
- ✅ Refresh token rotation
- ✅ Input validation with Zod
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting ready
- ✅ SQL injection protection (Prisma ORM)

---

## 📝 Notes

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Password must be at least 8 characters
- Email verification is mocked in development
- Password reset tokens are sent via console in development
