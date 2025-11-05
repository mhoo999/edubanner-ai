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

interface Step3InputProps {
  selectedTheme: ThemeRecommendation;
  onLayoutGenerate: (layout: string) => void;
  onBack: () => void;
}

const Step3Input: React.FC<Step3InputProps> = ({ selectedTheme, onLayoutGenerate, onBack }) => {
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(628);
  const [textContent, setTextContent] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [imageType, setImageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLayout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const textLines = textContent.split('\n').filter(line => line.trim() !== '');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: selectedTheme, // Pass entire theme object
          size: { width, height },
          textLines,
          hasImage,
          imageType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate layout');
      }

      const data = await response.json();
      onLayoutGenerate(data.layout);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-96">
      <div className="w-full p-4 mb-4 border-2 border-blue-300 rounded-lg bg-blue-50">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-blue-900">✓ 선택된 디자인 가이드</p>
          <button
            onClick={onBack}
            className="px-3 py-1 text-xs font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            변경
          </button>
        </div>
        <p className="text-xs text-gray-700 mb-3 leading-relaxed">{selectedTheme.concept}</p>

        {/* 색상 팔레트 미리보기 */}
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded border border-gray-300" style={{backgroundColor: selectedTheme.colors.primary}} title="Primary"></div>
          <div className="w-8 h-8 rounded border border-gray-300" style={{backgroundColor: selectedTheme.colors.secondary}} title="Secondary"></div>
          <div className="w-8 h-8 rounded border border-gray-300" style={{backgroundColor: selectedTheme.colors.accent}} title="Accent"></div>
          <div className="w-8 h-8 rounded border border-gray-300" style={{backgroundColor: selectedTheme.colors.background}} title="Background"></div>
          <div className="w-8 h-8 rounded border border-gray-300" style={{backgroundColor: selectedTheme.colors.text}} title="Text"></div>
        </div>
      </div>

      <h2 className="mb-6 text-xl font-semibold text-gray-800">배너 상세 정보</h2>

      <div className="w-full mb-4">
        <label className="block text-sm font-medium text-gray-700">크기:</label>
        <div className="flex items-center mt-1 space-x-2">
          <input type="number" className="block w-1/2 p-2 border border-gray-300 rounded-md" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
          <span>x</span>
          <input type="number" className="block w-1/2 p-2 border border-gray-300 rounded-md" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          <span>px</span>
        </div>
      </div>

      <div className="w-full mb-4">
        <label htmlFor="textContent" className="block text-sm font-medium text-gray-700">텍스트 내용 (줄바꿈으로 구분):</label>
        <textarea
          id="textContent"
          rows={5}
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="2026년 1학기 1기수
2025년 12월 4일 개강반
신청기간: 25년 11월 01일(토) ~ 12월 03일(수)"
        />
      </div>

      <div className="w-full mb-6">
        <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">참고 이미지 (선택):</label>
        <input
          type="file"
          id="imageUpload"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => {
            setHasImage(e.target.files && e.target.files.length > 0);
            setImageType(e.target.files && e.target.files.length > 0 ? '로고 또는 아이콘' : '');
          }}
        />
      </div>

      <button onClick={handleGenerateLayout} className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? '생성 중...' : '레이아웃 생성'}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Step3Input;
