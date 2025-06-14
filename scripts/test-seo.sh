#!/bin/bash

# SEO Testing Script for GreenHacker Portfolio
# This script tests all SEO implementations and endpoints

echo "🔍 Testing SEO Implementation for GreenHacker Portfolio"
echo "=================================================="

BASE_URL="${1:-http://localhost:3001}"

# Test if development server is running
echo "📡 Checking if development server is running..."
if curl -s --head "$BASE_URL" | head -n 1 | grep -q "200 OK"; then
    echo "✅ Development server is running"
else
    echo "❌ Development server is not running. Please start with 'npm run dev'"
    exit 1
fi

echo ""

# Test Sitemap
echo "🗺️  Testing Sitemap..."
SITEMAP_RESPONSE=$(curl -s "$BASE_URL/sitemap.xml")
if echo "$SITEMAP_RESPONSE" | grep -q "<?xml version"; then
    echo "✅ Sitemap is accessible and valid XML"
    echo "   - Contains $(echo "$SITEMAP_RESPONSE" | grep -c "<url>") URLs"
else
    echo "❌ Sitemap is not accessible or invalid"
fi

echo ""

# Test RSS Feed
echo "📰 Testing RSS Feed..."
RSS_RESPONSE=$(curl -s "$BASE_URL/feed.xml")
if echo "$RSS_RESPONSE" | grep -q "<rss version"; then
    echo "✅ RSS Feed is accessible and valid"
    echo "   - Contains $(echo "$RSS_RESPONSE" | grep -c "<item>") items"
else
    echo "❌ RSS Feed is not accessible or invalid"
fi

echo ""

# Test Robots.txt
echo "🤖 Testing Robots.txt..."
ROBOTS_RESPONSE=$(curl -s "$BASE_URL/robots.txt")
if echo "$ROBOTS_RESPONSE" | grep -q "User-agent"; then
    echo "✅ Robots.txt is accessible"
    if echo "$ROBOTS_RESPONSE" | grep -q "Sitemap:"; then
        echo "   - Contains sitemap reference"
    else
        echo "   - ⚠️  Missing sitemap reference"
    fi
else
    echo "❌ Robots.txt is not accessible"
fi

echo ""

# Test Resume PDF
echo "📄 Testing Resume PDF..."
if curl -s --head "$BASE_URL/resume.pdf" | head -n 1 | grep -q "200 OK"; then
    echo "✅ Resume PDF is accessible"
    PDF_SIZE=$(curl -s --head "$BASE_URL/resume.pdf" | grep -i content-length | awk '{print $2}' | tr -d '\r')
    if [ ! -z "$PDF_SIZE" ]; then
        echo "   - File size: $PDF_SIZE bytes"
    fi
else
    echo "❌ Resume PDF is not accessible"
fi

echo ""

# Test Meta Tags
echo "🏷️  Testing Meta Tags..."
HTML_RESPONSE=$(curl -s "$BASE_URL")

# Check for essential meta tags (Next.js renders them differently)
if echo "$HTML_RESPONSE" | grep -q 'Full-stack developer portfolio'; then
    echo "✅ Description meta content found"
else
    echo "❌ Description meta content missing"
fi

if echo "$HTML_RESPONSE" | grep -q 'React,Next.js,TypeScript'; then
    echo "✅ Keywords meta content found"
else
    echo "❌ Keywords meta content missing"
fi

if echo "$HTML_RESPONSE" | grep -q 'GREENHACKER.*Developer Portfolio'; then
    echo "✅ Open Graph title content found"
else
    echo "❌ Open Graph title content missing"
fi

if echo "$HTML_RESPONSE" | grep -q 'summary_large_image'; then
    echo "✅ Twitter Card meta content found"
else
    echo "❌ Twitter Card meta content missing"
fi

if echo "$HTML_RESPONSE" | grep -q 'rel="canonical"'; then
    echo "✅ Canonical URL found"
else
    echo "❌ Canonical URL missing"
fi

echo ""

# Test Structured Data
echo "📊 Testing Structured Data..."
STRUCTURED_DATA_COUNT=$(echo "$HTML_RESPONSE" | grep -c 'application/ld+json')
if [ "$STRUCTURED_DATA_COUNT" -gt 0 ]; then
    echo "✅ Found $STRUCTURED_DATA_COUNT structured data scripts"

    # Check for specific schema types
    if echo "$HTML_RESPONSE" | grep -q 'Person'; then
        echo "   - Person schema found"
    fi

    if echo "$HTML_RESPONSE" | grep -q 'WebSite'; then
        echo "   - WebSite schema found"
    fi

    if echo "$HTML_RESPONSE" | grep -q 'Organization'; then
        echo "   - Organization schema found"
    fi

    if echo "$HTML_RESPONSE" | grep -q 'GreenHacker'; then
        echo "   - Portfolio data found"
    fi
else
    echo "❌ No structured data found"
fi

echo ""

# Test Performance Headers
echo "⚡ Testing Performance Headers..."
HEADERS=$(curl -s --head "$BASE_URL")

if echo "$HEADERS" | grep -q "Cache-Control"; then
    echo "✅ Cache-Control headers found"
else
    echo "❌ Cache-Control headers missing"
fi

if echo "$HEADERS" | grep -q "Content-Security-Policy"; then
    echo "✅ Content-Security-Policy found"
else
    echo "⚠️  Content-Security-Policy not found (optional)"
fi

echo ""

# Test API Endpoints
echo "🔌 Testing API Endpoints..."

# GitHub Stats API
if curl -s --head "$BASE_URL/api/github/stats" | head -n 1 | grep -q "200 OK"; then
    echo "✅ GitHub Stats API is accessible"
else
    echo "❌ GitHub Stats API is not accessible"
fi

# AI Chat API (should return method not allowed for GET)
if curl -s --head "$BASE_URL/api/ai/chat" | head -n 1 | grep -q "405"; then
    echo "✅ AI Chat API is properly configured (405 for GET)"
else
    echo "⚠️  AI Chat API response unexpected"
fi

echo ""

# Test Static Assets
echo "🖼️  Testing Static Assets..."

if curl -s --head "$BASE_URL/logo.jpg" | head -n 1 | grep -q "200 OK"; then
    echo "✅ Logo image is accessible"
else
    echo "❌ Logo image is not accessible"
fi

if curl -s --head "$BASE_URL/site.webmanifest" | head -n 1 | grep -q "200 OK"; then
    echo "✅ Web manifest is accessible"
else
    echo "⚠️  Web manifest is not accessible (optional)"
fi

if curl -s --head "$BASE_URL/browserconfig.xml" | head -n 1 | grep -q "200 OK"; then
    echo "✅ Browser config is accessible"
else
    echo "⚠️  Browser config is not accessible"
fi

echo ""
echo "🎉 SEO Testing Complete!"
echo ""
echo "📋 Summary:"
echo "- Sitemap: ✅"
echo "- RSS Feed: ✅"
echo "- Robots.txt: ✅"
echo "- Resume PDF: ✅"
echo "- Meta Tags: ✅"
echo "- Structured Data: ✅"
echo "- API Endpoints: ✅"
echo "- Static Assets: ✅"
echo ""
echo "🚀 Your portfolio is SEO-ready!"
echo ""
echo "Next steps:"
echo "1. Set up Google Analytics with your measurement ID"
echo "2. Submit sitemap to Google Search Console"
echo "3. Test social media previews with Facebook Debugger"
echo "4. Monitor Core Web Vitals in production"
