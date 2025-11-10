import React, { useState, useEffect } from 'react'

interface Step4ResultProps {
  generatedLayout: string
  platform: string
  onReset: () => void
  onEdit?: () => void
}

const Step4Result: React.FC<Step4ResultProps> = ({
  generatedLayout,
  platform,
  onReset,
  onEdit,
}) => {
  const [copySuccess, setCopySuccess] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [pinterestImages, setPinterestImages] = useState<string[]>([])
  const [isPinterestLoading, setIsPinterestLoading] = useState(true)
  const [pinterestError, setPinterestError] = useState<string | null>(null)

  // Pinterest 이미지 검색 함수
  const fetchPinterestImages = async (query: string) => {
    setIsPinterestLoading(true)
    setPinterestError(null)
    try {
      const response = await fetch('/api/pinterest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Pinterest 이미지를 불러오지 못했습니다.')
      }
      const data = await response.json()
      setPinterestImages(data.imageUrls || [])
    } catch (err) {
      setPinterestError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      )
      setPinterestImages([])
    } finally {
      setIsPinterestLoading(false)
    }
  }

  // generatedLayout이 변경될 때 Pinterest 이미지 검색 실행
  useEffect(() => {
    // 마크다운에서 '디자인 컨셉' 섹션의 내용을 검색어로 추출
    const conceptMatch = generatedLayout.match(/## 디자인 컨셉\s*([\s\S]*?)\s*(?:###|##|$)/)
    const query = conceptMatch ? conceptMatch[1].trim().replace(/\s+/g, ' ') : '교육 배너 디자인'
    
    fetchPinterestImages(query)
  }, [generatedLayout])

  const handleCopyLayout = async () => {
    try {
      await navigator.clipboard.writeText(generatedLayout)
      setCopySuccess(true)
      setCopyError(false)
      setTimeout(() => setCopySuccess(false), 3000)
    } catch {
      setCopyError(true)
      setCopySuccess(false)
      setTimeout(() => setCopyError(false), 3000)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedLayout], {
      type: 'text/plain;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `banner-layout-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Renders a line of text, converting hex codes to color chips
  const renderLineWithColorChips = (line: string) => {
    const hexRegex = /(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})/g
    const parts = line.split(hexRegex)

    return parts.map((part, index) => {
      if (part.match(hexRegex)) {
        return (
          <button
            key={index}
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(part)
              } catch {
                // 클립보드 복사 실패 시 무시
              }
            }}
            className="inline-flex items-center hover:bg-blue-50 px-1 py-0.5 rounded transition-colors group cursor-pointer"
            title={`${part} 클릭하여 복사`}
          >
            <span
              className="w-4 h-4 mr-2 border border-gray-300 rounded-sm group-hover:scale-110 transition-transform"
              style={{ backgroundColor: part }}
            ></span>
            <span className="font-mono text-sm">{part}</span>
          </button>
        )
      }
      return part
    })
  }

  // Renders the full markdown layout with basic styling and color chips
  const renderFormattedLayout = (markdown: string) => {
    return markdown.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="mt-4 mb-2 text-xl font-bold">
            {line.substring(3)}
          </h2>
        )
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="mt-3 mb-2 text-lg font-semibold">
            {line.substring(4)}
          </h3>
        )
      }
      if (line.startsWith('**')) {
        return (
          <p key={index} className="font-bold mt-2">
            {renderLineWithColorChips(line.replace(/\*\*/g, ''))}
          </p>
        )
      }
      if (line.startsWith('- ')) {
        return (
          <p key={index} className="ml-4 text-gray-700">
            {renderLineWithColorChips(line.substring(2))}
          </p>
        )
      }
      return (
        <p key={index} className="text-gray-700">
          {renderLineWithColorChips(line)}
        </p>
      )
    })
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      {/* Success Banner */}
      <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              레이아웃 생성 완료!
            </h2>
            <p className="text-sm text-gray-600">
              아래 레이아웃을 복사하여 디자인 작업에 활용하세요.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Padding */}
      <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              권장 여백 사이즈
            </h3>
            <p className="text-sm text-gray-600">
              선택하신 플랫폼 <span className="font-bold text-blue-700">{platform === 'web' ? '웹' : '모바일'}</span>에 적절한 여백은 <span className="font-bold text-blue-700">{platform === 'web' ? '40px' : '20px'}</span> 입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Copy Success Toast */}
      {copySuccess && (
        <div className="fixed top-8 right-8 z-50 p-4 bg-green-600 text-white rounded-lg shadow-xl flex items-center gap-3 animate-slide-in">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-semibold">클립보드에 복사되었습니다!</span>
        </div>
      )}
      {/* Copy Error Toast */}
      {copyError && (
        <div className="fixed top-8 right-8 z-50 p-4 bg-red-600 text-white rounded-lg shadow-xl flex items-center gap-3 animate-slide-in">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="font-semibold">
            복사에 실패했습니다. 직접 선택하여 복사해주세요.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Layout Display */}
        <div className="w-full mb-6 p-6 overflow-auto bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl max-h-[600px] shadow-inner">
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {renderFormattedLayout(generatedLayout)}
          </div>
        </div>

        {/* Pinterest Image Section */}
        <div className="w-full mb-6 p-6 bg-gray-50 border-2 border-gray-200 rounded-xl max-h-[600px] overflow-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.383 0 0 5.383 0 12.017c0 5.078 3.115 9.42 7.54 11.16.028-.437.04-.93.12-1.403.155-.94.98-4.158.98-4.158s-.25-.5-.25-1.23c0-1.158.67-2.028 1.5-2.028.708 0 1.046.53 1.046 1.174 0 .71-.452 1.77-1.074 2.75-.516.82-.98 1.84.216 1.84 1.554 0 2.57-2.04 2.57-4.43 0-2.125-1.43-3.63-3.8-3.63-2.58 0-4.15 1.91-4.15 3.92 0 .75.28 1.56.63 2.04.19.26.216.35.15.585-.07.28-.23.92-.28 1.11-.06.21-.28.28-.5.15-1.2-.7-1.95-2.42-1.95-4.03 0-3.15 2.3-5.85 6.25-5.85 3.28 0 5.6 2.35 5.6 5.25 0 3.2-1.95 5.7-4.72 5.7-1.32 0-2.57-.68-3-.15 0 0-.63 2.5-.78 3.1-.27.95-.98 2.17-1.45 2.8.93.28 1.9.43 2.9.43 6.63 0 12-5.37 12-12S18.647 0 12.017 0z" />
            </svg>
            디자인 레퍼런스 (Pinterest)
          </h3>
          {isPinterestLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          )}
          {pinterestError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{pinterestError}</p>
            </div>
          )}
          {!isPinterestLoading && !pinterestError && pinterestImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {pinterestImages.map((url, index) => (
                <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="block group">
                  <img
                    src={url}
                    alt={`Pinterest Reference ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all"
                  />
                </a>
              ))}
            </div>
          )}
          {!isPinterestLoading && !pinterestError && pinterestImages.length === 0 && (
            <p className="text-sm text-gray-500">관련 이미지를 찾을 수 없습니다.</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <button
          onClick={handleCopyLayout}
          className="px-6 py-4 text-white text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          전체 복사
        </button>
        <button
          onClick={handleDownload}
          className="px-6 py-4 text-white text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          다운로드
        </button>
        {onEdit ? (
          <button
            onClick={onEdit}
            className="px-6 py-4 text-gray-700 text-lg font-semibold bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            수정하기
          </button>
        ) : (
          <button
            onClick={onReset}
            className="px-6 py-4 text-gray-700 text-lg font-semibold bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            새로 만들기
          </button>
        )}
      </div>
    </div>
  )
}

export default Step4Result
