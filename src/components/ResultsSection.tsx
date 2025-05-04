"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { CorrectionViewModel } from "@/types/viewModels";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ResultsSectionProps {
  correctionData: CorrectionViewModel;
}

export function ResultsSection({ correctionData }: ResultsSectionProps) {
  const { originalText, proposedText, educationalComment, correctionStyle } = correctionData;
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const handleAccept = async () => {
    if (!proposedText || isSaved) return;

    try {
      setIsSaving(true);
      const response = await fetch("/api/corrections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_text: originalText,
          approved_text: proposedText,
          correction_style: correctionStyle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save correction");
      }

      setIsSaved(true);
      toast.success("Correction saved successfully");
    } catch (err) {
      console.error("Error saving correction:", err);
      toast.error("Failed to save correction");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Corrected Text</CardTitle>
          <CardDescription>Suggested improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p className="whitespace-pre-wrap">{proposedText}</p>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCopy(proposedText || "")}
              >
                Copy text
              </Button>
              <Button 
                size="sm"
                onClick={handleAccept}
                disabled={isSaving || isSaved}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner />
                    <span>Saving...</span>
                  </div>
                ) : isSaved ? (
                  "Correction saved"
                ) : (
                  "Accept correction"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {educationalComment && (
        <Card>
          <CardHeader>
            <CardTitle>Educational Notes</CardTitle>
            <CardDescription>Learn from the corrections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <p className="whitespace-pre-wrap">{educationalComment}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="self-end"
                onClick={() => handleCopy(educationalComment)}
              >
                Copy notes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 