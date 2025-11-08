import { NextResponse } from 'next/server'

// Pinterest API의 기본 URL
const PINTEREST_API_URL = 'https://api.pinterest.com/v5/search/pins'

export async function POST(request: Request) {
  // Pinterest API 키를 환경 변수에서 가져옵니다.
  const apiKey = process.env.PINTEREST_API_KEY

  // API 키가 설정되지 않은 경우 에러를 반환합니다.
  if (!apiKey) {
    console.error('Pinterest API key is not set in .env.local')
    return NextResponse.json(
      { error: 'Pinterest API 키가 설정되지 않았습니다.' },
      { status: 500 }
    )
  }

  try {
    // 클라이언트로부터 검색어(query)를 받습니다.
    const { query } = await request.json()
    if (!query) {
      return NextResponse.json(
        { error: '검색어가 필요합니다.' },
        { status: 400 }
      )
    }

    // Pinterest API에 검색을 요청합니다.
    // 검색어와 함께, 한국어 콘텐츠 및 이미지 크기 필터를 적용합니다.
    // bookmark 파라미터를 사용하여 공개 핀만 검색합니다.
    const response = await fetch(
      `${PINTEREST_API_URL}?query=${encodeURIComponent(
        query
      )}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Accept-Language': 'ko-KR', // 한국어 콘텐츠 우선 검색
        },
      }
    )

    // 응답이 성공적이지 않은 경우 에러를 처리합니다.
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Pinterest API Error:', errorData)
      throw new Error(
        `Pinterest API 오류: ${errorData.message || response.statusText}`
      )
    }

    const data = await response.json()

    // 검색 결과에서 이미지 URL만 추출하여 클라이언트에 반환합니다.
    const imageUrls = data.items.map((item: any) => item.media.images['474x'].url)
    return NextResponse.json({ imageUrls })
    
  } catch (error) {
    console.error('Error in /api/pinterest:', error)
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
