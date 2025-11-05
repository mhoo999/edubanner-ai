import React from 'react';

interface Step4ResultProps {
  generatedLayout: string;
  onReset: () => void;
}

const Step4Result: React.FC<Step4ResultProps> = ({ generatedLayout, onReset }) => {
  const handleCopyLayout = () => {
    navigator.clipboard.writeText(generatedLayout);
    alert('레이아웃이 클립보드에 복사되었습니다!');
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-96">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">레이아웃 생성 완료!</h2>

      <div className="w-full p-4 mb-6 overflow-auto bg-gray-50 border border-gray-200 rounded-md max-h-80">
        <pre className="text-sm text-gray-800 whitespace-pre-wrap">{generatedLayout}</pre>
      </div>

      <div className="flex w-full space-x-4">
        <button
          onClick={handleCopyLayout}
          className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          📋 전체 복사
        </button>
        <button
          onClick={onReset}
          className="flex-1 px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          🔄 다시 만들기
        </button>
      </div>
    </div>
  );
};

export default Step4Result;