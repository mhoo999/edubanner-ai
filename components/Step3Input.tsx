import React, { useState } from 'react';
import { ThemeRecommendation } from '@/lib/claude';

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
  const [imageFileName, setImageFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLayout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 배너 크기 검증
      const finalWidth = width >= 100 && width <= 5000 ? width : 1200;
      const finalHeight = height >= 100 && height <= 5000 ? height : 628;
      
      if (finalWidth !== width || finalHeight !== height) {
        setWidth(finalWidth);
        setHeight(finalHeight);
      }
      
      const textLines = textContent.split('\n').filter(line => line.trim() !== '');
      
      // 타임아웃 설정 (60초)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            theme: selectedTheme,
            size: { width: finalWidth, height: finalHeight },
            textLines,
            hasImage,
            imageType: hasImage ? (imageType || imageFileName || '참고 이미지') : '',
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
          throw new Error(errorData.error || '레이아웃 생성에 실패했습니다.');
        }

        const data = await response.json();
        onLayoutGenerate(data.layout);
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
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="w-full p-5 mb-6 border-2 border-green-300 rounded-xl bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-bold text-green-900 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            선택된 디자인 가이드
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-sm cursor-pointer"
          >
            ← 변경하기
          </button>
        </div>
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">{selectedTheme.concept}</p>

        {/* 색상 팔레트 미리보기 */}
        <div className="flex gap-2 flex-wrap">
          {[
            { color: selectedTheme.colors.primary, label: 'Primary' },
            { color: selectedTheme.colors.secondary, label: 'Secondary' },
            { color: selectedTheme.colors.accent, label: 'Accent' },
            { color: selectedTheme.colors.background, label: 'Background' },
            { color: selectedTheme.colors.text, label: 'Text' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(item.color);
                  // 간단한 피드백 (선택사항)
                } catch (err) {
                  // 클립보드 복사 실패 시 무시
                }
              }}
              className="group relative flex flex-col items-center"
            >
              <div
                className="w-10 h-10 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: item.color }}
                title={`${item.label}: ${item.color} (클릭하여 복사)`}
              ></div>
              <span className="mt-1 text-[10px] text-gray-600 group-hover:text-blue-600 transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-bold text-gray-900 text-center">배너 상세 정보 입력</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 배너 크기 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            배너 크기 (px)
          </label>
          {/* 배너 크기 프리셋 */}
          <div className="mb-2 flex flex-wrap gap-2">
            {[
              { label: '웹용', w: 1920, h: 500 },
              { label: '모바일용', w: 750, h: 750 },
              { label: 'Facebook', w: 1200, h: 628 },
              { label: 'Instagram', w: 1080, h: 1080 },
              { label: 'Twitter', w: 1200, h: 675 },
              { label: 'LinkedIn', w: 1200, h: 627 },
              { label: 'YouTube', w: 2560, h: 1440 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setWidth(preset.w);
                  setHeight(preset.h);
                }}
                className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="100"
              max="5000"
              step="1"
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={width || ''}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                if (isNaN(val) || val < 0) return;
                setWidth(val);
              }}
              onBlur={(e) => {
                const val = Number(e.target.value);
                if (isNaN(val) || val < 100) {
                  setWidth(1200);
                } else if (val > 5000) {
                  setWidth(5000);
                }
              }}
              placeholder="1200"
            />
            <span className="text-gray-500 font-medium">×</span>
            <input
              type="number"
              min="100"
              max="5000"
              step="1"
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={height || ''}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                if (isNaN(val) || val < 0) return;
                setHeight(val);
              }}
              onBlur={(e) => {
                const val = Number(e.target.value);
                if (isNaN(val) || val < 100) {
                  setHeight(628);
                } else if (val > 5000) {
                  setHeight(5000);
                }
              }}
              placeholder="628"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">권장: 1200×628 (Facebook), 1080×1080 (Instagram)</p>
        </div>

        {/* 참고 이미지 */}
        <div>
          <label htmlFor="imageUpload" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            참고 이미지 (선택)
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setHasImage(true);
                setImageFileName(file.name);
                
                // 파일 타입에 따라 이미지 타입 판단
                const fileName = file.name.toLowerCase();
                let detectedType = '참고 이미지';
                if (fileName.includes('logo') || fileName.includes('로고')) {
                  detectedType = '로고';
                } else if (fileName.includes('icon') || fileName.includes('아이콘')) {
                  detectedType = '아이콘';
                } else if (file.type.startsWith('image/')) {
                  detectedType = '참고 이미지';
                }
                setImageType(detectedType);
              } else {
                setHasImage(false);
                setImageFileName('');
                setImageType('');
              }
            }}
          />
          {imageFileName && (
            <p className="mt-2 text-xs text-blue-600 font-medium">
              선택된 파일: {imageFileName}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">로고, 아이콘 등의 레퍼런스 이미지를 업로드하세요</p>
        </div>
      </div>

      {/* 텍스트 내용 */}
      <div className="w-full mb-6">
        <label htmlFor="textContent" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          텍스트 내용
        </label>
        <textarea
          id="textContent"
          rows={6}
          className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="2026년 1학기 1기수
2025년 12월 4일 개강반
신청기간: 25년 11월 01일(토) ~ 12월 03일(수)
수강료: 500,000원
선착순 30명 한정"
        />
        <p className="mt-2 text-xs text-gray-500">
          각 줄마다 다른 텍스트를 입력하세요. AI가 자동으로 제목, 부제, 본문을 판단합니다.
        </p>
      </div>

      {/* 생성 버튼 */}
      <button
        onClick={handleGenerateLayout}
        className="w-full px-6 py-4 text-white text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        disabled={isLoading || !textContent.trim()}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            AI가 레이아웃 생성 중...
          </span>
        ) : (
          '✨ 레이아웃 생성하기'
        )}
      </button>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default Step3Input;
