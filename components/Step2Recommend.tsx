import React, { useState } from 'react';
import { ThemeRecommendation } from '@/lib/claude';

interface Step2RecommendProps {
  onThemeSelected: (theme: ThemeRecommendation) => void;
}

const Step2Recommend: React.FC<Step2RecommendProps> = ({ onThemeSelected }) => {
  const [purpose, setPurpose] = useState('');
  const [keywords, setKeywords] = useState('');
  const [mood, setMood] = useState('');
  const [recommendedThemes, setRecommendedThemes] = useState<ThemeRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const handleRecommendThemes = async (loadMore = false) => {
    if (loadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setRecommendedThemes([]);
    }
    setError(null);
    try {
      // 타임아웃 설정 (60초)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
      try {
        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            purpose, 
            keywords, 
            mood,
            existingThemes: loadMore ? recommendedThemes : []
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            throw new Error(`서버 오류 (${response.status})`);
          }
          throw new Error(errorData.error || '테마 추천에 실패했습니다.');
        }

        const data = await response.json();
        if (loadMore) {
          setRecommendedThemes([...recommendedThemes, ...data.themes]);
        } else {
          setRecommendedThemes(data.themes);
        }
        setHasMore(data.themes.length >= 5); // 5개 이상이면 더 보기 가능
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
        }
        throw fetchError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 text-center">AI 디자인 가이드 추천</h2>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="purpose" className="block text-sm font-semibold text-gray-700 mb-2">용도</label>
          <select
            id="purpose"
            className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            <option value="">선택하세요</option>
            <option value="온라인 강의 모집">온라인 강의 모집</option>
            <option value="수강안내">수강안내</option>
            <option value="웨비나/세미나 홍보">웨비나/세미나 홍보</option>
            <option value="교재/도서 출간 안내">교재/도서 출간 안내</option>
            <option value="합격/수강 후기 이벤트">합격/수강 후기 이벤트</option>
            <option value="특별 할인 프로모션">특별 할인 프로모션</option>
          </select>
        </div>
        <div>
          <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-2">주제</label>
          <input
            type="text"
            id="keywords"
            className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="예: AWS 클라우드"
          />
        </div>
        <div>
          <label htmlFor="mood" className="block text-sm font-semibold text-gray-700 mb-2">분위기</label>
          <select
            id="mood"
            className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="">선택하세요</option>
            <option value="신뢰감을 주는">신뢰감을 주는</option>
            <option value="정보가 명확한">정보가 명확한</option>
            <option value="활기차고 동기부여하는">활기차고 동기부여하는</option>
            <option value="차분하고 학구적인">차분하고 학구적인</option>
            <option value="세련되고 현대적인">세련되고 현대적인</option>
          </select>
        </div>
      </div>
      <button
        onClick={() => handleRecommendThemes(false)}
        className="w-full px-6 py-4 mb-6 text-white text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        disabled={isLoading || !purpose || !keywords || !mood}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            AI가 분석 중...
          </span>
        ) : (
          '✨ 디자인 가이드 추천받기'
        )}
      </button>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}
      {recommendedThemes.length > 0 && (
        <div className="w-full mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            추천 디자인 가이드
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recommendedThemes.map((theme, index) => (
            <div
              key={index}
              className="flex flex-col p-6 border-2 border-gray-200 rounded-xl shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 bg-white"
            >
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full">
                    #{index + 1}
                  </span>
                  <span className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-50 rounded-full">
                    매칭도 {theme.score}%
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">{theme.concept}</p>
              </div>

              {/* 색상 팔레트 */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                  </svg>
                  색상
                </p>
                <div className="flex gap-1.5">
                  <div className="flex-1 flex flex-col items-center group">
                    <div
                      className="w-full h-10 rounded-lg border-2 border-gray-300 shadow-sm group-hover:scale-110 transition-transform cursor-pointer"
                      style={{backgroundColor: theme.colors.primary}}
                      title={theme.colors.primary}
                    ></div>
                    <span className="text-[10px] text-gray-500 mt-1 font-medium">Main</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center group">
                    <div
                      className="w-full h-10 rounded-lg border-2 border-gray-300 shadow-sm group-hover:scale-110 transition-transform cursor-pointer"
                      style={{backgroundColor: theme.colors.secondary}}
                      title={theme.colors.secondary}
                    ></div>
                    <span className="text-[10px] text-gray-500 mt-1 font-medium">Sub</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center group">
                    <div
                      className="w-full h-10 rounded-lg border-2 border-gray-300 shadow-sm group-hover:scale-110 transition-transform cursor-pointer"
                      style={{backgroundColor: theme.colors.accent}}
                      title={theme.colors.accent}
                    ></div>
                    <span className="text-[10px] text-gray-500 mt-1 font-medium">Point</span>
                  </div>
                </div>
              </div>

              {/* 타이포그래피 & 레이아웃 */}
              <div className="flex-1 space-y-3 mb-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    폰트
                  </p>
                  <p className="text-gray-600">
                    {theme.typography.title.font} {theme.typography.title.size}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    무드
                  </p>
                  <p className="text-gray-600 line-clamp-2">{theme.mood}</p>
                </div>
              </div>

              {/* 선택 버튼 */}
              <button
                onClick={() => onThemeSelected(theme)}
                className="w-full mt-auto px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                이 가이드 선택 →
              </button>
            </div>
          ))}
        </div>
        </div>
      )}
      
      {/* 더 보기 버튼 */}
      {recommendedThemes.length > 0 && hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => handleRecommendThemes(true)}
            disabled={isLoadingMore}
            className="px-6 py-3 text-blue-700 text-base font-semibold bg-blue-50 border-2 border-blue-300 rounded-lg hover:bg-blue-100 hover:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
          >
            {isLoadingMore ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                더 많은 가이드 로딩 중...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                더 많은 디자인 가이드 보기
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Step2Recommend;
