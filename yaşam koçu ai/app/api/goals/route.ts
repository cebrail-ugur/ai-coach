import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateGoalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.enum([
    'health',
    'career',
    'personal',
    'finance',
    'relationships',
  ]),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  targetDate: z.string().optional(),
});

export async function GET(_request: NextRequest) {
  try {
    // In production, fetch from database
    // const supabase = await createClient();
    // const { data } = await supabase.from('goals').select('*');

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error('Get goals error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const goal = CreateGoalSchema.parse(body);

    // In production:
    // 1. Get user ID from session
    // 2. Generate goal breakdown using Claude
    // 3. Store in Supabase
    // 4. Return created goal

    return NextResponse.json(
      {
        success: true,
        data: {
          id: '1',
          ...goal,
          progress_percentage: 0,
          status: 'active',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create goal error:', error);

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
      { success: false, error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}
