# GlassFinance - Setup Script
# This script installs all dependencies for the project

Write-Host "🚀 GlassFinance - Installing Dependencies..." -ForegroundColor Cyan
Write-Host ""

# Get the root directory
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
Set-Location $rootDir
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Root dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install root dependencies!" -ForegroundColor Red
        exit 1
    }
}

# Install frontend dependencies
Write-Host ""
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "$rootDir\frontend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install frontend dependencies!" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host ""
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "$rootDir\backend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install backend dependencies!" -ForegroundColor Red
    exit 1
}

# Install shared dependencies (if needed)
Write-Host ""
Write-Host "📦 Installing shared dependencies..." -ForegroundColor Yellow
Set-Location "$rootDir\shared"
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Shared dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install shared dependencies!" -ForegroundColor Red
        exit 1
    }
}

# Generate Prisma Client
Write-Host ""
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Yellow
Set-Location "$rootDir\backend"
npm run prisma:generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client generated successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma Client!" -ForegroundColor Red
    exit 1
}

# Return to root directory
Set-Location $rootDir

Write-Host ""
Write-Host "🎉 All dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run database migration: cd backend && npm run prisma:migrate" -ForegroundColor White
Write-Host "  2. Seed the database: cd backend && npm run prisma:seed" -ForegroundColor White
Write-Host "  3. Start backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "  4. Start frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
