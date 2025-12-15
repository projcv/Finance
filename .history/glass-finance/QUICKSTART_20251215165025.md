# 🚀 Quick Start Guide - GlassFinance

## ✅ Tất cả lỗi đã được sửa!

Dependencies đã được cài đặt. Bây giờ chỉ cần setup database và chạy server.

---

## 📋 Các Bước Tiếp Theo

### Bước 1: Setup Database
```powershell
cd backend
npm run prisma:migrate
```

### Bước 2: Seed Database với dữ liệu mẫu
```powershell
npm run prisma:seed
```

### Bước 3: Chạy Backend Server
```powershell
npm run dev
```
✅ Backend sẽ chạy tại: **http://localhost:5000**

### Bước 4: Mở Terminal mới và chạy Frontend
```powershell
cd frontend
npm run dev
```
✅ Frontend sẽ chạy tại: **http://localhost:3000**

---

## 🎯 Truy Cập Ứng Dụng

Mở trình duyệt và truy cập:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/v1
- **Health Check:** http://localhost:5000/api/v1/health

---

## 👤 Demo Account

Sau khi seed database, đăng nhập với:
- **Email:** demo@glassfinance.com
- **Password:** demo123

---

## 🛠️ Các Lệnh Hữu Ích

### Backend
```powershell
cd backend

# Chạy dev server
npm run dev

# Build production
npm run build

# Chạy production
npm start

# Prisma Studio (Database GUI)
npm run prisma:studio

# Type check
npm run type-check
```

### Frontend
```powershell
cd frontend

# Chạy dev server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 📁 Files Đã Sửa

1. ✅ `shared/src/types/index.ts` - MỚI
2. ✅ `shared/tsconfig.json` - MỚI
3. ✅ `shared/package.json` - CẬP NHẬT
4. ✅ `frontend/src/main.tsx` - SỬA
5. ✅ `frontend/vite.config.ts` - SỬA
6. ✅ `frontend/tsconfig.json` - SỬA

---

## 🎉 Tất Cả Đã Sẵn Sàng!

Chỉ cần chạy 4 lệnh trên là bạn có thể sử dụng GlassFinance ngay!
