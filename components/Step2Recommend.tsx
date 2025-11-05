import React, { useState } from 'react';

interface ThemeRecommendation {
  concept: string;
  score: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    title: {
      font: string;
      size: string;
      letterSpacing: string;
      lineHeight: string;
    };
    subtitle: {
      font: string;
      size: string;
      letterSpacing: string;
    };
    body: {
      font: string;
      size: string;
    };
  };
  layout: {
    structure: string;
    padding: string;
    alignment: string;
  };
  visuals: {
    imageStyle: string;
    graphics: string;
    effects: string;
  };
  mood: string;
}

interface Step2RecommendProps {
  onThemeSelected: (theme: ThemeRecommendation) => void;
}

const Step2Recommend: React.FC<Step2RecommendProps> = ({ onThemeSelected }) => {
  const [purpose, setPurpose] = useState('');
  const [keywords, setKeywords] = useState('');
  const [mood, setMood] = useState('');
  const [recommendedThemes, setRecommendedThemes] = useState<ThemeRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecommendThemes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose, keywords, mood }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get theme recommendations');
      }
      const data = await response.json();
      setRecommendedThemes(data.themes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-96">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">AI 디자인 가이드 추천</h2>
      
      {/* ... (rest of the component is the same) ... */}
      <div className="w-full mb-4">
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">용도:</label>
        <select id="purpose" className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
          <option value="">선택</option>
          <option value="온라인 강의 모집">온라인 강의 모집</option>
          <option value="웨비나/세미나 홍보">웨비나/세미나 홍보</option>
          <option value="교재/도서 출간 안내">교재/도서 출간 안내</option>
          <option value="합격/수강 후기 이벤트">합격/수강 후기 이벤트</option>
          <option value="특별 할인 프로모션">특별 할인 프로모션</option>
        </select>
      </div>
      <div className="w-full mb-4">
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">주제:</label>
        <input type="text" id="keywords" className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="AWS 클라우드" />
      </div>
      <div className="w-full mb-6">
        <label htmlFor="mood" className="block text-sm font-medium text-gray-700">분위기:</label>
        <select id="mood" className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">선택</option>
          <option value="신뢰감을 주는">신뢰감을 주는</option>
          <option value="정보가 명확한">정보가 명확한</option>
          <option value="활기차고 동기부여하는">활기차고 동기부여하는</option>
          <option value="차분하고 학구적인">차분하고 학구적인</option>
          <option value="세련되고 현대적인">세련되고 현대적인</option>
        </select>
      </div>
      <button onClick={handleRecommendThemes} className="w-full px-4 py-2 mb-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" disabled={isLoading || !purpose || !keywords || !mood}>
        {isLoading ? '추천 중...' : '디자인 가이드 추천받기'}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {recommendedThemes.length > 0 && (
        <div className="w-full mt-4 space-y-6">
          {recommendedThemes.map((theme, index) => (
            <div key={index} className="p-5 border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded">#{index + 1}</span>
                    <span className="px-2 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded">매칭도: {theme.score}%</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 leading-relaxed">{theme.concept}</p>
                </div>
                <button
                  onClick={() => onThemeSelected(theme)}
                  className="ml-3 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  선택
                </button>
              </div>

              {/* 색상 팔레트 */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">색상 팔레트</p>
                <div className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-md border border-gray-300 shadow-sm" style={{backgroundColor: theme.colors.primary}}></div>
                    <span className="text-xs text-gray-500 mt-1">Primary</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-md border border-gray-300 shadow-sm" style={{backgroundColor: theme.colors.secondary}}></div>
                    <span className="text-xs text-gray-500 mt-1">Secondary</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-md border border-gray-300 shadow-sm" style={{backgroundColor: theme.colors.accent}}></div>
                    <span className="text-xs text-gray-500 mt-1">Accent</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-md border border-gray-300 shadow-sm" style={{backgroundColor: theme.colors.background}}></div>
                    <span className="text-xs text-gray-500 mt-1">BG</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-md border border-gray-300 shadow-sm" style={{backgroundColor: theme.colors.text}}></div>
                    <span className="text-xs text-gray-500 mt-1">Text</span>
                  </div>
                </div>
              </div>

              {/* 타이포그래피 */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">타이포그래피</p>
                <p className="text-xs text-gray-700">
                  제목: {theme.typography.title.font} {theme.typography.title.size} |
                  부제: {theme.typography.subtitle.font} {theme.typography.subtitle.size}
                </p>
              </div>

              {/* 레이아웃 & 무드 */}
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-semibold">레이아웃:</span> {theme.layout.structure}</p>
                <p><span className="font-semibold">무드:</span> {theme.mood}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Step2Recommend;
