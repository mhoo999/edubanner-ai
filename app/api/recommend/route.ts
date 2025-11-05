import { getThemeRecommendations } from '@/lib/claude';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { purpose, keywords, mood, existingThemes } = await request.json();

    if (!purpose || !keywords || !mood) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const themes = await getThemeRecommendations(purpose, keywords, mood, existingThemes || []);

    if (!themes || themes.length === 0) {
      console.error('getThemeRecommendations returned empty array')
      return NextResponse.json(
        { error: '테마 추천 결과가 없습니다. 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ themes });
  } catch (error) {
    console.error('Error in /api/recommend:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    // API 키 관련 에러인 경우 명확한 메시지 제공
    if (errorMessage.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `테마 추천 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}
