import { createClient } from '@/lib/supabase/server';
import { GenerateCorrectionProposalCommand, GenerateCorrectionProposalResponseDTO, CorrectionDTO } from '@/types';

export class CorrectionService {
  static async generateCorrectionProposal(
    originalText: string,
    correctionStyle: GenerateCorrectionProposalCommand['correction_style'],
    deniedProposedText: string | undefined,
    userId: string
  ): Promise<GenerateCorrectionProposalResponseDTO> {
    try {
      // TODO: Implement AI model integration (OpenRouter)
      // This will be implemented in the next phase

      // For now, return a placeholder response
      return {
        original_text: originalText,
        proposed_text: 'Placeholder corrected text',
        correction_style: correctionStyle,
        educational_comment: 'Placeholder educational comment explaining the corrections',
      };
    } catch (error) {
      console.error('Error in correction service:', error);
      throw new Error('Failed to generate correction proposal');
    }
  }

  static async saveCorrection(
    originalText: string,
    approvedText: string,
    correctionStyle: CorrectionDTO['correction_style'],
    userId: string
  ): Promise<CorrectionDTO> {
    try {
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from('corrections')
        .insert({
          user_id: userId,
          original_text: originalText,
          approved_text: approvedText,
          correction_style: correctionStyle,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      return data as CorrectionDTO;
    } catch (error) {
      console.error('Error saving correction:', error);
      throw new Error('Failed to save correction');
    }
  }
} 