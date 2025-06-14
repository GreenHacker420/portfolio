import { NextRequest, NextResponse } from 'next/server';
import { searchFAQs, getFAQsByCategory, getFAQCategories, getPopularFAQs } from '@/services/chatbotService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const action = searchParams.get('action');

    // Get FAQ categories
    if (action === 'categories') {
      const categories = await getFAQCategories();
      return NextResponse.json({
        success: true,
        categories
      });
    }

    // Get popular FAQs
    if (action === 'popular') {
      const limit = parseInt(searchParams.get('limit') || '5');
      const faqs = await getPopularFAQs(limit);
      return NextResponse.json({
        success: true,
        faqs
      });
    }

    // Search FAQs
    if (query) {
      const faqs = await searchFAQs(query, category || undefined);
      return NextResponse.json({
        success: true,
        faqs,
        query,
        category
      });
    }

    // Get FAQs by category
    if (category && category !== 'all') {
      const faqs = await getFAQsByCategory(category);
      return NextResponse.json({
        success: true,
        faqs,
        category
      });
    }

    // Get all popular FAQs if no specific query
    const faqs = await getPopularFAQs(10);
    return NextResponse.json({
      success: true,
      faqs
    });

  } catch (error) {
    console.error('FAQ API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}
