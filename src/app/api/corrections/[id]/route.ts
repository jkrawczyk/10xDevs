import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DeleteCorrectionResponseDTO } from '@/types';

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Get and validate the ID parameter
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'Missing correction ID' },
        { status: 400 }
      );
    }

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

    // First check if the correction exists and belongs to the user
    const { data: correction, error: fetchError } = await supabase
      .from('corrections')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !correction) {
      return NextResponse.json(
        { error: 'Correction not found' },
        { status: 404 }
      );
    }

    // Delete the correction
    const { error: deleteError } = await supabase
      .from('corrections')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    const response: DeleteCorrectionResponseDTO = {
      message: 'Correction deleted successfully.'
    };
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 