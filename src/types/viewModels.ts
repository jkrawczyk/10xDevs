import { CorrectionStyle } from "@/types";

export interface CorrectionViewModel {
  originalText: string;
  proposedText?: string;
  correctionStyle: CorrectionStyle;
  educationalComment?: string;
  error?: string;
  isLoading: boolean;
} 