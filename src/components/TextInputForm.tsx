"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { CorrectionStyle } from "@/types";

interface TextInputFormProps {
  onSubmit: (text: string) => Promise<void>;
  onStyleChange: (style: CorrectionStyle) => void;
  isLoading: boolean;
  defaultText: string;
  style: CorrectionStyle;
  hasGeneratedBefore: boolean;
}

export function TextInputForm({ 
  onSubmit, 
  onStyleChange,
  isLoading, 
  defaultText, 
  style,
  hasGeneratedBefore 
}: TextInputFormProps) {
  const [text, setText] = useState(defaultText);

  // Update text when defaultText changes
  useEffect(() => {
    setText(defaultText);
  }, [defaultText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length === 0) return;
    await onSubmit(text);
  };

  const styleOptions = [
    { value: 'formal', label: 'Formal' },
    { value: 'natural', label: 'Natural' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="text">Text to correct</Label>
        <Textarea
          id="text"
          placeholder="Enter your text here (max 2000 characters)..."
          value={text}
          onChange={(e) => !hasGeneratedBefore && setText(e.target.value.slice(0, 2000))}
          className={`min-h-[200px] ${hasGeneratedBefore ? "bg-muted" : ""}`}
          required
          disabled={isLoading || hasGeneratedBefore}
        />
        <p className="text-sm text-gray-500">
          {text.length}/2000 characters
          {hasGeneratedBefore && (
            <span className="ml-2 text-muted-foreground">(locked after first generation)</span>
          )}
        </p>
      </div>

      <div className="flex justify-center">
        <SegmentedControl
          value={style}
          onValueChange={(value) => onStyleChange(value as CorrectionStyle)}
          options={styleOptions}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-center">
        <Button 
          type="submit" 
          disabled={isLoading || text.trim().length === 0}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              <span>Generating correction...</span>
            </div>
          ) : hasGeneratedBefore ? (
            "Regenerate correction"
          ) : (
            "Generate correction"
          )}
        </Button>
      </div>
    </form>
  );
} 