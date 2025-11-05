import React from 'react';

interface Step1ThemeProps {
  onThemeSelect: (hasTheme: boolean) => void;
}

const Step1Theme: React.FC<Step1ThemeProps> = ({ onThemeSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md w-96">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">컨텐츠팀에서 지정한 테마가 있나요?</h2>
      <div className="flex space-x-4">
        <button
          onClick={() => onThemeSelect(true)}
          className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          예
        </button>
        <button
          onClick={() => onThemeSelect(false)}
          className="px-6 py-3 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          아니오
        </button>
      </div>
    </div>
  );
};

export default Step1Theme;