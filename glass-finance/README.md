# 💎 GlassFinance

A modern personal finance management application with stunning glassmorphism UI.

## 🌟 Features

- ✨ **Beautiful Glassmorphism UI** - Modern, transparent design with blur effects
- 💰 **Transaction Management** - Track income and expenses effortlessly
- 📊 **Visual Analytics** - Interactive charts and statistics
- 🎯 **Budget Planning** - Set and monitor budgets by category
- 🏷️ **Custom Categories** - Organize transactions with custom categories
- 🔐 **Secure Authentication** - JWT-based authentication
- 📱 **Responsive Design** - Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe development
- **Prisma ORM** - Database toolkit
- **SQLite** - Lightweight database
- **JWT** - Authentication

## 📁 Project Structure

```
glass-finance/
├── frontend/          # React frontend application
├── backend/           # Express backend API
├── shared/            # Shared types between frontend and backend
├── docker/            # Docker configuration files
└── docker-compose.yml # Docker Compose configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd glass-finance
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Backend:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Frontend:
```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

4. **Initialize database**
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Start development servers**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🐳 Docker Deployment

### Build and run with Docker Compose

```bash
# Build images
npm run docker:build

# Start containers
npm run docker:up

# View logs
npm run docker:logs

# Stop containers
npm run docker:down
```

The application will be available at:
- Frontend: http://localhost
- Backend: http://localhost:5000

## 📝 Available Scripts

### Root workspace
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend
- `npm run docker:build` - Build Docker images
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers

### Frontend
- `npm run dev --workspace=frontend` - Start frontend dev server
- `npm run build --workspace=frontend` - Build frontend for production
- `npm run preview --workspace=frontend` - Preview production build

### Backend
- `npm run dev --workspace=backend` - Start backend dev server
- `npm run build --workspace=backend` - Build backend for production
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🎨 Design System

The application uses a custom glassmorphism design system with:
- **Glass Cards** - Transparent cards with backdrop blur
- **Glass Buttons** - Interactive buttons with glass effect
- **Glass Inputs** - Form inputs with glassmorphism styling
- **Gradient Backgrounds** - Beautiful gradient overlays
- **Smooth Animations** - Framer Motion powered animations

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Helmet.js security headers
- Input validation with express-validator

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Design inspiration from modern glassmorphism trends
- Built with love using modern web technologies

---

Made with 💎 by GlassFinance Team
