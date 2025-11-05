import React, { useState } from 'react';

interface ThemeRecommendation {
  name: string;
  score: number;
  concept: string;
  colors: string;
}

interface Step2RecommendProps {
  onThemeSelect: (theme: ThemeRecommendation) => void;
  onBack: () => void;
}

const Step2Recommend: React.FC<Step2RecommendProps> = ({ onThemeSelect, onBack }) => {
  const [purpose, setPurpose] = useState('');
  const [keywords, setKeywords] = useState('');
  const [mood, setMood] = useState('');
  const [recommendedThemes, setRecommendedThemes] = useState<ThemeRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRecommendThemes = async () => {
    setIsLoading(true);
    // TODO: Call API to get theme recommendations
    // For now, using mock data
    const mockThemes: ThemeRecommendation[] = [
      {
        name: "모던 테크",
        score: 85,
        concept: "기술 혁신, 전문성",
        colors: "다크블루 + 시안",
      },
      {
        name: "신뢰감 블루",
        score: 78,
        concept: "안정감, 교육 전문성",
        colors: "진파랑 + 화이트",
      },
      {
        name: "다크 엘레강스",
        score: 72,
        concept: "고급스러움, 프리미엄",
        colors: "블랙 + 골드",
      },
    ];
    setRecommendedThemes(mockThemes);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-96">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">테마 추천</h2>

      <div className="w-full mb-4">
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">용도:</label>
        <select
          id="purpose"
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="">선택</option>
          <option value="강좌 홍보">강좌 홍보</option>
          <option value="이벤트">이벤트</option>
          <option value="신제품">신제품</option>
        </select>
      </div>

      <div className="w-full mb-4">
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">주제:</label>
        <input
          type="text"
          id="keywords"
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="AWS 클라우드"
        />
      </div>

      <div className="w-full mb-6">
        <label htmlFor="mood" className="block text-sm font-medium text-gray-700">분위기:</label>
        <select
          id="mood"
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="">선택</option>
          <option value="전문적">전문적</option>
          <option value="활기찬">활기찬</option>
          <option value="고급스러운">고급스러운</option>
        </select>
      </div>

      <button
        onClick={handleRecommendThemes}
        className="w-full px-4 py-2 mb-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        disabled={isLoading}
      >
        {isLoading ? '추천 중...' : '테마 추천받기'}
      </button>

      {recommendedThemes.length > 0 && (
        <div className="w-full mt-4 space-y-4">
          {recommendedThemes.map((theme, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900">{index + 1}. {theme.name} ({theme.score}%)</h3>
                <button
                  onClick={() => onThemeSelect(theme)}
                  className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  선택
                </button>
              </div>
              <p className="text-sm text-gray-600">컨셉: {theme.concept}</p>
              <p className="text-sm text-gray-600">색상: {theme.colors}</p>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={onBack}
        className="w-full px-4 py-2 mt-4 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        뒤로 가기
      </button>
    </div>
  );
};

export default Step2Recommend;