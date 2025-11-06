'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-left hover:opacity-80 transition-opacity cursor-pointer"
            >
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                EduBanner AI
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                AI 기반 교육 배너 디자인 어시스턴트
              </p>
            </Link>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-blue-900">Powered by Claude AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              개인정보처리방침
            </h1>
            <p className="text-sm text-gray-500">
              최종 수정일: 2025년 1월 1일
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                1. 개인정보의 수집 및 이용 목적
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-2">
                <p>
                  EduBanner AI는 서비스 제공을 위하여 최소한의 개인정보를 수집하고 있습니다.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>서비스 제공 및 개선</li>
                  <li>사용자 문의 응대</li>
                  <li>서비스 이용 기록 분석</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                2. 수집하는 개인정보 항목
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-2">
                <p className="font-semibold text-gray-900">필수 수집 항목:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>서비스 이용 기록 (접속 로그, 쿠키, IP 주소)</li>
                  <li>배너 생성 관련 입력 정보 (교육 과정명, 기관명 등)</li>
                </ul>
                <p className="mt-4 font-semibold text-gray-900">선택 수집 항목:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>사용자 피드백 및 문의 내용</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                3. 개인정보의 보유 및 이용 기간
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-2">
                <p>
                  회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>서비스 이용 기록: 3개월</li>
                  <li>배너 생성 기록: 즉시 삭제 (세션 종료 시)</li>
                </ul>
                <p className="mt-4">
                  단, 관련 법령에 따라 일정 기간 보관이 필요한 경우에는 해당 기간 동안 보관합니다.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                4. 개인정보의 제3자 제공
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-2">
                <p>
                  회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
                  다만, 다음의 경우에는 예외로 합니다:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>이용자가 사전에 동의한 경우</li>
                  <li>법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                5. 개인정보 처리 위탁
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-2">
                <p>
                  회사는 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 외부 전문업체에 위탁하고 있습니다:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>위탁업체: Anthropic (Claude AI)</li>
                  <li>위탁업무 내용: AI 기반 배너 디자인 가이드 생성</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                6. 이용자의 권리와 의무
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-2">
                <p>
                  이용자는 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>개인정보 열람 요구</li>
                  <li>개인정보 정정 요구</li>
                  <li>개인정보 삭제 요구</li>
                  <li>개인정보 처리정지 요구</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                7. 개인정보 보호책임자
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-2">
                <p>
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
                  정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900">개인정보 보호책임자</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>부서: 디자인팀</li>
                    <li>담당자: 메가존 교육사업부</li>
                    <li>이메일: education@megazone.com</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                8. 개인정보의 안전성 확보조치
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-2">
                <p>
                  회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>개인정보 취급 직원의 최소화 및 교육</li>
                  <li>개인정보에 대한 접근 제한</li>
                  <li>개인정보의 암호화</li>
                  <li>해킹 등에 대비한 기술적 대책</li>
                  <li>개인정보처리시스템 접근 기록의 보관 및 위변조 방지</li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                9. 쿠키(Cookie)의 운용
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-2">
                <p>
                  회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고
                  수시로 불러오는 '쿠키(cookie)'를 사용합니다.
                </p>
                <p className="mt-4">
                  쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 컴퓨터 브라우저에게
                  보내는 소량의 정보이며 이용자의 PC 컴퓨터 내의 하드디스크에 저장되기도 합니다.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                10. 개인정보처리방침의 변경
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-2">
                <p>
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의
                  추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여
                  고지할 것입니다.
                </p>
              </div>
            </section>
          </div>

          {/* Back to Home Button */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            © 2025 EduBanner AI. Designed for Megazone Education Division Design Team.
          </p>
        </div>
      </footer>
    </div>
  );
}
