'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Step2Recommend from '@/components/Step2Recommend';
import Step3Input from '@/components/Step3Input';
import Step4Result from '@/components/Step4Result';
import { ThemeRecommendation } from '@/lib/claude';

enum Step {
  ThemeRecommend,
  DetailInput,
  Result,
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.ThemeRecommend);
  const [selectedTheme, setSelectedTheme] = useState<ThemeRecommendation | null>(null);
  const [generatedLayout, setGeneratedLayout] = useState<string>('');
  const [platform, setPlatform] = useState<string>('web');

  const handleThemeSelected = (theme: ThemeRecommendation) => {
    setSelectedTheme(theme);
    setCurrentStep(Step.DetailInput);
  };

  const handleLayoutGenerate = (layout: string, platform: string) => {
    setGeneratedLayout(layout);
    setPlatform(platform);
    setCurrentStep(Step.Result);
  };

  const handleReset = () => {
    setCurrentStep(Step.ThemeRecommend);
    setSelectedTheme(null);
    setGeneratedLayout('');
  };

  const renderStep = () => {
    switch (currentStep) {
      case Step.ThemeRecommend:
        return (
          <Step2Recommend
            onThemeSelected={handleThemeSelected}
          />
        );
      case Step.DetailInput:
        if (selectedTheme) {
          return (
            <Step3Input
              selectedTheme={selectedTheme}
              onLayoutGenerate={handleLayoutGenerate}
              onBack={() => setCurrentStep(Step.ThemeRecommend)}
            />
          );
        }
        // Fallback in case theme is null
        handleReset();
        return null;
      case Step.Result:
        return (
          <Step4Result 
            generatedLayout={generatedLayout} 
            platform={platform}
            onReset={handleReset}
            onEdit={() => setCurrentStep(Step.DetailInput)}
          />
        );
      default:
        return (
          <Step2Recommend
            onThemeSelected={handleThemeSelected}
          />
        );
    }
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case Step.ThemeRecommend:
        return { number: 1, title: '디자인 가이드 선택', total: 3 };
      case Step.DetailInput:
        return { number: 2, title: '배너 정보 입력', total: 3 };
      case Step.Result:
        return { number: 3, title: '레이아웃 결과', total: 3 };
      default:
        return { number: 1, title: '디자인 가이드 선택', total: 3 };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentStep(Step.ThemeRecommend);
                setSelectedTheme(null);
                setGeneratedLayout('');
              }}
              className="text-left hover:opacity-80 transition-opacity cursor-pointer"
            >
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                EduBanner AI
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                AI 기반 교육 배너 디자인 어시스턴트
              </p>
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-blue-900">Powered by Claude AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300
                    ${
                      step < stepInfo.number
                        ? 'bg-green-500 text-white'
                        : step === stepInfo.number
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {step < stepInfo.number ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium
                    ${step === stepInfo.number ? 'text-blue-900' : 'text-gray-500'}
                  `}
                >
                  {step === 1 ? '테마' : step === 2 ? '정보' : '결과'}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`
                    w-12 h-1 rounded-full mb-6 transition-all duration-300
                    ${step < stepInfo.number ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Current Step Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{stepInfo.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Step {stepInfo.number} of {stepInfo.total}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex justify-center">
          {renderStep()}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500 mb-2">
            © 2025 EduBanner AI. Designed for Megazone Education Division Design Team.
          </p>
          <Link
            href="/privacy"
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            개인정보처리방침
          </Link>
        </div>
      </footer>
    </div>
  );
}
