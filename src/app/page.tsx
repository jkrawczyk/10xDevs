"use client";

import { TextInputForm } from "@/components/TextInputForm";
import { ResultsSection } from "@/components/ResultsSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import type { CorrectionViewModel } from "@/types/viewModels";
import type { CorrectionStyle } from "@/types";

export default function TextInputPage() {
  const [selectedStyle, setSelectedStyle] = useState<CorrectionStyle>("formal");
  const [isLoading, setIsLoading] = useState(false);
  const [correctionData, setCorrectionData] = useState<{
    originalText: string;
    proposedText?: string;
    educationalComment?: string;
    error?: string;
  }>({
    originalText: "",
  });

  const handleStyleChange = (style: CorrectionStyle) => {
    setSelectedStyle(style);
  };

  const handleSubmit = async (originalText: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/corrections/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_text: originalText,
          correction_style: selectedStyle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate correction");
      }

      const data = await response.json();
      setCorrectionData({
        originalText,
        proposedText: data.proposed_text,
        educationalComment: data.educational_comment,
      });
    } catch (error) {
      setCorrectionData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 space-y-8">
      
      <TextInputForm 
        onSubmit={handleSubmit} 
        onStyleChange={handleStyleChange}
        isLoading={isLoading}
        defaultText={correctionData.originalText}
        style={selectedStyle}
        hasGeneratedBefore={Boolean(correctionData.proposedText)}
      />

      {correctionData.proposedText && (
        <div className="animate-in slide-in-from-bottom duration-500">
          <ResultsSection
            correctionData={{
              ...correctionData,
              correctionStyle: selectedStyle,
              isLoading,
            }}
          />
        </div>
      )}

      {correctionData.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            {correctionData.error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
