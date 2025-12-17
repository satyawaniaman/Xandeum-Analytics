#!/bin/bash
# Xandeum Analytics Backend Deployment Script
# Run this on your DigitalOcean VM to deploy the latest changes

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd "$(dirname "$0")"

echo "📥 Pulling latest changes from main..."
git pull origin main

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔨 Building project..."
pnpm build

echo "🗄️ Running database migrations..."
pnpm migrate

echo "🔄 Restarting PM2 process..."
pm2 restart xandeum-analytics || pm2 start dist/index.js --name xandeum-analytics

echo "✅ Deployment complete!"
pm2 status
