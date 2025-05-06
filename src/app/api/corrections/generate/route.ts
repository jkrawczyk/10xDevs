import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GenerateCorrectionProposalCommand } from '@/types';
import { CorrectionService } from '@/lib/services/correction.service';

// Validation schema for the request body
const generateCorrectionSchema = z.object({
  original_text: z.string().max(2000, 'Text must not exceed 2000 characters'),
  correction_style: z.enum(['formal', 'natural'] as const),
  denied_proposed_text: z.string().optional(),
}) satisfies z.ZodType<GenerateCorrectionProposalCommand>;

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = generateCorrectionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const command = validationResult.data;

    // Generate correction proposal using the service
    const correctionProposal = await CorrectionService.generateCorrectionProposal(
      command.original_text,
      command.correction_style,
      command.denied_proposed_text
    );

    return NextResponse.json(correctionProposal, { status: 200 });
  } catch (error) {
    console.error('Error generating correction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 