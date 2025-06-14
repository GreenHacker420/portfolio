import { NextRequest, NextResponse } from 'next/server';
import { updateFAQViewCount, rateFAQ } from '@/services/chatbotService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, isHelpful } = body;

    if (action === 'view') {
      await updateFAQViewCount(params.id);
      return NextResponse.json({ success: true });
    }

    if (action === 'rate' && typeof isHelpful === 'boolean') {
      await rateFAQ(params.id, isHelpful);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('FAQ action error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process action' },
      { status: 500 }
    );
  }
}
