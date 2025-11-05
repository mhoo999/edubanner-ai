import React, { useState } from 'react';

interface ThemeRecommendation {
  name: string;
  score: number;
  concept: string;
  colors: string;
}

interface Step3InputProps {
  selectedTheme: ThemeRecommendation;
  onLayoutGenerate: (data: { size: { width: number; height: number }; mainCopy: string; subCopies: string[]; hasImage: boolean; imageType: string }) => void;
  onThemeChange: () => void;
}

const Step3Input: React.FC<Step3InputProps> = ({ selectedTheme, onLayoutGenerate, onThemeChange }) => {
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(628);
  const [mainCopy, setMainCopy] = useState('');
  const [subCopies, setSubCopies] = useState<string>(''); // Changed to single string for simplicity, will split by newline
  const [hasImage, setHasImage] = useState(false);
  const [imageType, setImageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateLayout = () => {
    setIsLoading(true);
    const subCopiesArray = subCopies.split('\n').filter(copy => copy.trim() !== '');
    onLayoutGenerate({
      size: { width, height },
      mainCopy,
      subCopies: subCopiesArray,
      hasImage,
      imageType,
    });
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-96">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">상세 정보 입력</h2>

      <div className="w-full p-4 mb-4 border border-gray-200 rounded-md bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">✓ 테마: {selectedTheme.name}</p>
          <button
            onClick={onThemeChange}
            className="px-3 py-1 text-sm text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            변경
          </button>
        </div>
      </div>

      <div className="w-full mb-4">
        <label className="block text-sm font-medium text-gray-700">크기:</label>
        <div className="flex items-center mt-1 space-x-2">
          <input
            type="number"
            className="block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
          <span>x</span>
          <input
            type="number"
            className="block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
          <span>px</span>
        </div>
      </div>

      <div className="w-full mb-4">
        <label htmlFor="mainCopy" className="block text-sm font-medium text-gray-700">메인 카피:</label>
        <input
          type="text"
          id="mainCopy"
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={mainCopy}
          onChange={(e) => setMainCopy(e.target.value)}
          placeholder="AWS 실습 과정"
        />
      </div>

      <div className="w-full mb-4">
        <label htmlFor="subCopies" className="block text-sm font-medium text-gray-700">서브 카피 (줄바꿈으로 구분):</label>
        <textarea
          id="subCopies"
          rows={3}
          className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={subCopies}
          onChange={(e) => setSubCopies(e.target.value)}
          placeholder="12월 개강\n선착순 30명"
        />
      </div>

      <div className="w-full mb-6">
        <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">이미지:</label>
        <input
          type="file"
          id="imageUpload"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setHasImage(true);
              // For simplicity, just setting a generic type. In a real app, you'd parse file type.
              setImageType('로고'); 
            } else {
              setHasImage(false);
              setImageType('');
            }
          }}
        />
        {hasImage && <p className="mt-2 text-sm text-gray-500">이미지 업로드됨: {imageType}</p>}
      </div>

      <button
        onClick={handleGenerateLayout}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        disabled={isLoading}
      >
        {isLoading ? '생성 중...' : '레이아웃 생성'}
      </button>
    </div>
  );
};

export default Step3Input;
