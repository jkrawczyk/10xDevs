"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { CorrectionStyle } from "@/types";

interface TextInputFormProps {
  onSubmit: (text: string, style: CorrectionStyle) => Promise<void>;
  isLoading: boolean;
  defaultText: string;
  defaultStyle: CorrectionStyle;
  hasGeneratedBefore: boolean;
}

export function TextInputForm({ 
  onSubmit, 
  isLoading, 
  defaultText, 
  defaultStyle,
  hasGeneratedBefore 
}: TextInputFormProps) {
  const [text, setText] = useState(defaultText);
  const [style, setStyle] = useState<CorrectionStyle>(defaultStyle);

  // Update local state when props change
  useEffect(() => {
    setText(defaultText);
    setStyle(defaultStyle);
  }, [defaultText, defaultStyle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length === 0) return;
    await onSubmit(text, style);
  };

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

      <div className="space-y-2">
        <Label>Correction style</Label>
        <RadioGroup
          value={style}
          onValueChange={(value: CorrectionStyle) => setStyle(value)}
          className="flex flex-col space-y-2"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="formal" id="formal" />
            <Label htmlFor="formal">Formal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="natural" id="natural" />
            <Label htmlFor="natural">Natural</Label>
          </div>
        </RadioGroup>
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