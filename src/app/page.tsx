"use client";

import { TextInputForm } from "@/components/TextInputForm";
import { ResultsSection } from "@/components/ResultsSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import type { CorrectionViewModel } from "@/types/viewModels";

export default function TextInputPage() {
  const [correctionData, setCorrectionData] = useState<CorrectionViewModel>({
    originalText: "",
    correctionStyle: "formal",
    isLoading: false,
  });

  const handleSubmit = async (originalText: string, correctionStyle: "formal" | "natural") => {
    try {
      setCorrectionData((prev) => ({ 
        ...prev, 
        originalText,
        correctionStyle,
        isLoading: true, 
        error: undefined 
      }));
      
      const response = await fetch("/api/corrections/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_text: originalText,
          correction_style: correctionStyle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate correction");
      }

      const data = await response.json();
      setCorrectionData((prev) => ({
        ...prev,
        proposedText: data.proposed_text,
        educationalComment: data.educational_comment,
        isLoading: false,
      }));
    } catch (error) {
      setCorrectionData((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        isLoading: false,
      }));
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Text Correction</h1>
      
      <TextInputForm 
        onSubmit={handleSubmit} 
        isLoading={correctionData.isLoading}
        defaultText={correctionData.originalText}
        defaultStyle={correctionData.correctionStyle}
        hasGeneratedBefore={Boolean(correctionData.proposedText)}
      />

      {correctionData.proposedText && (
        <div className="animate-in slide-in-from-bottom duration-500">
          <ResultsSection
            correctionData={correctionData}
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
    </main>
  );
}
