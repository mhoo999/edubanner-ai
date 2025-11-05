import { generateLayout } from '@/lib/claude';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { theme, size, textLines, hasImage, imageType } = await request.json();

    if (!theme || !size || !textLines || !Array.isArray(textLines) || textLines.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const layout = await generateLayout(theme, size, textLines, hasImage, imageType);

    return NextResponse.json({ layout });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to generate layout: ${errorMessage}` }, { status: 500 });
  }
}
