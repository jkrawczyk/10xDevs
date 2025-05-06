import { createClient } from '@/lib/supabase/server';
import { GenerateCorrectionProposalCommand, GenerateCorrectionProposalResponseDTO, CorrectionDTO } from '@/types';
import { OpenRouterService } from '@/lib/openrouter.service';

export class CorrectionService {
  private static openRouterService: OpenRouterService;

  private static getOpenRouterService(): OpenRouterService {
    if (!this.openRouterService) {
      if (!process.env.OPENROUTER_API_KEY) {
        throw new Error('OPENROUTER_API_KEY environment variable is not set');
      }

      this.openRouterService = new OpenRouterService({
        apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
        apiKey: process.env.OPENROUTER_API_KEY,
        modelName: 'openai/gpt-4o-mini',
        defaultOptions: {
          temperature: 0.7,
          max_tokens: 1000
        }
      });
    }
    return this.openRouterService;
  }

  static async generateCorrectionProposal(
    originalText: string,
    correctionStyle: GenerateCorrectionProposalCommand['correction_style'],
    deniedProposedText: string | undefined
  ): Promise<GenerateCorrectionProposalResponseDTO> {
    try {
      const openRouter = this.getOpenRouterService();
      
      // Construct the prompt based on correction style and context
      const promptParts = [
        'As a language correction assistant, please correct into English the following text, it can be in Polish or English, other languages are not allowed.',
        `Style: ${correctionStyle}`,
        `Original text: "${originalText}"`
      ];

      // If there was a previously denied correction, include it for context
      if (deniedProposedText) {
        promptParts.push(
          `Previously proposed (but rejected) correction: "${deniedProposedText}"`,
          'Please provide a different correction approach.'
        );
      }

      // Add response format instructions
      promptParts.push(
        'Provide your response in the following JSON format:',
        '{',
        '  "proposed_text": "your corrected version",',
        '  "educational_comment": "your explanation of the changes in Polish"',
        '}'
      );

      const prompt = promptParts.join('\n');
      const response = await openRouter.sendChatMessage(prompt);
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response.text);
      } catch (e) {
        console.error('Failed to parse OpenRouter response:', e);
        throw new Error('Invalid response format from AI model');
      }

      return {
        original_text: originalText,
        proposed_text: parsedResponse.proposed_text,
        correction_style: correctionStyle,
        educational_comment: parsedResponse.educational_comment,
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