#!/bin/bash

# Fallback Netlify Build Script
# This script provides a simpler build process as a fallback

set -e

echo "🔄 Running fallback build process..."

# Set basic environment variables
export NEXT_TELEMETRY_DISABLED=1
export SKIP_TYPE_CHECK=true
export CHECKPOINT_DISABLE=1

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Try Prisma generation
echo "🗄️ Attempting Prisma generation..."
npx prisma generate --no-engine || echo "⚠️ Prisma generation failed, continuing..."

# Build with Next.js
echo "🏗️ Building with Next.js..."
SKIP_TYPE_CHECK=true npx next build

echo "✅ Fallback build completed!"
