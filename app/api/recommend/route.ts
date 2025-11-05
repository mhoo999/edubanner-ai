import { getThemeRecommendations } from '@/lib/claude';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { purpose, keywords, mood } = await request.json();

    if (!purpose || !keywords || !mood) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const themes = await getThemeRecommendations(purpose, keywords, mood);

    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Error in /api/recommend:', error);
    return NextResponse.json({ error: 'Failed to get theme recommendations' }, { status: 500 });
  }
}
