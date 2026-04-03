import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateHabitSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'custom']),
  icon: z.string().default('💪'),
  color: z.string().default('blue'),
});

export async function GET(_request: NextRequest) {
  try {
    // In production, fetch from database
    // const supabase = await createClient();
    // const { data } = await supabase.from('habits').select('*');

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error('Get habits error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch habits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const habit = CreateHabitSchema.parse(body);

    // In production:
    // 1. Get user ID from session
    // 2. Store in Supabase
    // 3. Return created habit

    return NextResponse.json(
      {
        success: true,
        data: {
          id: '1',
          ...habit,
          current_streak: 0,
          best_streak: 0,
          total_completions: 0,
          last_completed_at: null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create habit error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create habit' },
      { status: 500 }
    );
  }
}
