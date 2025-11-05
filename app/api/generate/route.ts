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
    
    // API 키 관련 에러인 경우 명확한 메시지 제공
    if (errorMessage.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `레이아웃 생성 실패: ${errorMessage}` },
      { status: 500 }
    );
  }
}
