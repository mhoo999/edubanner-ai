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

  // Renders a line of text, converting hex codes to color chips
  const renderLineWithColorChips = (line: string) => {
    const hexRegex = /(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/g;
    const parts = line.split(hexRegex);

    return parts.map((part, index) => {
      if (part.match(hexRegex)) {
        return (
          <span key={index} className="inline-flex items-center">
            <span
              className="w-4 h-4 mr-2 border border-gray-300 rounded-sm"
              style={{ backgroundColor: part }}
            ></span>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Renders the full markdown layout with basic styling and color chips
  const renderFormattedLayout = (markdown: string) => {
    return markdown.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="mt-4 mb-2 text-xl font-bold">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="mt-3 mb-2 text-lg font-semibold">{line.substring(4)}</h3>;
      }
      if (line.startsWith('**')) {
        return <p key={index} className="font-bold mt-2">{renderLineWithColorChips(line.replace(/\*\*/g, ''))}</p>;
      }
      if (line.startsWith('- ')) {
        return <p key={index} className="ml-4 text-gray-700">{renderLineWithColorChips(line.substring(2))}</p>;
      }
      return <p key={index} className="text-gray-700">{renderLineWithColorChips(line)}</p>;
    });
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-[500px]">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">레이아웃 생성 완료!</h2>

      <div className="w-full p-4 mb-6 overflow-auto bg-gray-50 border border-gray-200 rounded-md max-h-96">
        <div className="text-sm whitespace-pre-wrap">
          {renderFormattedLayout(generatedLayout)}
        </div>
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
