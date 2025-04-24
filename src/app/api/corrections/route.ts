import { NextResponse } from 'next/server';
import { CorrectionService } from '@/lib/services/correction.service';
import { DEFAULT_USER_ID } from '@/lib/supabase/server';
import { z } from 'zod';

const createCorrectionSchema = z.object({
  original_text: z.string().max(2000),
  approved_text: z.string(),
  correction_style: z.enum(['formal', 'natural'])
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createCorrectionSchema.parse(body);

    const correction = await CorrectionService.saveCorrection(
      validatedData.original_text,
      validatedData.approved_text,
      validatedData.correction_style,
      DEFAULT_USER_ID // TODO: Replace with actual user ID from auth
    );

    return NextResponse.json(correction, { status: 201 });
  } catch (error) {
    console.error('Error creating correction:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create correction' },
      { status: 500 }
    );
  }
} 