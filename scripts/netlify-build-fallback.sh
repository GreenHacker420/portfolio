#!/bin/bash

# Fallback Netlify Build Script
# This script provides a simpler build process as a fallback

set -e

echo "🔄 Running fallback build process..."

# Set basic environment variables
export NEXT_TELEMETRY_DISABLED=1
export SKIP_TYPE_CHECK=true
export CHECKPOINT_DISABLE=1
export NPM_CONFIG_PRODUCTION=false

# Install dependencies including dev dependencies
echo "📦 Installing all dependencies..."
npm ci --legacy-peer-deps

# Ensure critical packages are available
echo "🔧 Ensuring critical packages are installed..."
npm install prisma tailwindcss autoprefixer postcss --legacy-peer-deps --save-dev || echo "⚠️ Package installation failed, continuing..."

# Try Prisma generation
echo "🗄️ Attempting Prisma generation..."
npx prisma generate --no-engine || npx prisma generate || echo "⚠️ Prisma generation failed, continuing..."

# Build with Next.js
echo "🏗️ Building with Next.js..."
SKIP_TYPE_CHECK=true npx next build

echo "✅ Fallback build completed!"
