'use client';

import React, { useState } from 'react';
import Step2Recommend from '@/components/Step2Recommend';
import Step3Input from '@/components/Step3Input';
import Step4Result from '@/components/Step4Result';

enum Step {
  ThemeRecommend,
  DetailInput,
  Result,
}

interface ThemeRecommendation {
  name: string;
  score: number;
  concept: string;
  colors: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.ThemeRecommend);
  const [selectedTheme, setSelectedTheme] = useState<ThemeRecommendation | null>(null);
  const [generatedLayout, setGeneratedLayout] = useState<string>('');

  const handleThemeSelected = (theme: ThemeRecommendation) => {
    setSelectedTheme(theme);
    setCurrentStep(Step.DetailInput);
  };

  const handleLayoutGenerate = (layout: string) => {
    setGeneratedLayout(layout);
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
          <Step4Result generatedLayout={generatedLayout} onReset={handleReset} />
        );
      default:
        return (
          <Step2Recommend
            onThemeSelected={handleThemeSelected}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {renderStep()}
    </div>
  );
}
