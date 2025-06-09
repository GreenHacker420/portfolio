#!/bin/bash

# Netlify Build Script for GreenHacker Portfolio
# This script handles the build process with proper error handling and fallbacks

set -e  # Exit on any error

echo "🚀 Starting Netlify build process..."

# Check Node.js version
echo "📋 Node.js version: $(node --version)"
echo "📋 NPM version: $(npm --version)"

# Set environment variables for build optimization
export NEXT_TELEMETRY_DISABLED=1
export SKIP_TYPE_CHECK=true
export CHECKPOINT_DISABLE=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Clean any existing build artifacts
echo "🧹 Cleaning previous build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies with legacy peer deps flag
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps --prefer-offline --no-audit

# Verify critical packages are installed
echo "🔍 Verifying critical packages..."
if [ ! -d "node_modules/prisma" ]; then
    echo "⚠️ Prisma not found in node_modules, installing..."
    npm install prisma --legacy-peer-deps
fi

if [ ! -d "node_modules/tailwindcss" ]; then
    echo "⚠️ TailwindCSS not found in node_modules, installing..."
    npm install tailwindcss autoprefixer postcss --legacy-peer-deps
fi

# Verify Prisma CLI is available
echo "🔍 Checking Prisma CLI availability..."
if ! npx prisma --version; then
    echo "❌ Prisma CLI not available, installing globally..."
    npm install -g prisma
fi

# Generate Prisma client for Netlify environment
echo "🗄️ Generating Prisma client..."
if ! npx prisma generate --no-engine; then
    echo "⚠️ Prisma generation with --no-engine failed, trying without flag..."
    if ! npx prisma generate; then
        echo "❌ Prisma generation failed completely, continuing without database..."
    fi
fi

# Build the Next.js application
echo "🏗️ Building Next.js application..."
if ! npm run build; then
    echo "❌ Build failed with npm run build, trying alternative build..."
    if ! SKIP_TYPE_CHECK=true npx next build; then
        echo "❌ All build attempts failed!"
        exit 1
    fi
fi

echo "✅ Build completed successfully!"

# Verify build output
if [ -d ".next" ]; then
    echo "✅ .next directory created successfully"
    echo "📊 Build size:"
    du -sh .next
else
    echo "❌ .next directory not found!"
    exit 1
fi

echo "🎉 Netlify build process completed!"
