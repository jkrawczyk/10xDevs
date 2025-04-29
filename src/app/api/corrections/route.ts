import { NextResponse } from 'next/server';
import { CorrectionService } from '@/lib/services/correction.service';
import { createClient, DEFAULT_USER_ID } from '@/lib/supabase/server';
import { z } from 'zod';
import { CorrectionDTO, GetCorrectionsResponseDTO } from '@/types';

const createCorrectionSchema = z.object({
  original_text: z.string().max(2000),
  approved_text: z.string(),
  correction_style: z.enum(['formal', 'natural'])
});

// Validation schema for query parameters
const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  sort: z.enum(['created_at', '-created_at']).optional().default('-created_at'),
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

export async function GET(request: Request) {
  try {
    // Initialize Supabase client using our helper
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const searchParams = Object.fromEntries(new URL(request.url).searchParams);
    const { page, limit, sort } = querySchema.parse(searchParams);

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Query corrections with pagination and sorting
    const { data: corrections, error: dbError } = await supabase
      .from('corrections')
      .select('*')
      .eq('user_id', user.id)
      .order(sort.startsWith('-') ? sort.slice(1) : sort, {
        ascending: !sort.startsWith('-')
      })
      .range(offset, offset + limit - 1);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // Transform and return the response
    const response: GetCorrectionsResponseDTO = corrections as CorrectionDTO[];
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error processing request:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 