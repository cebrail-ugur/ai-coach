import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const CreateHabitSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'custom']),
  icon: z.string().default('💪'),
  color: z.string().default('blue'),
});

const DEMO_USER_ID = 'demo-user-123';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', DEMO_USER_ID)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
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

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('habits')
      .insert([
        {
          user_id: DEMO_USER_ID,
          title: habit.title,
          description: habit.description || null,
          frequency: habit.frequency,
          icon: habit.icon,
          color: habit.color,
          current_streak: 0,
          best_streak: 0,
          total_completions: 0,
          last_completed_at: null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        data,
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, current_streak, best_streak, total_completions } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Habit ID required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('habits')
      .update({
        current_streak: current_streak ?? undefined,
        best_streak: best_streak ?? undefined,
        total_completions: total_completions ?? undefined,
        last_completed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', DEMO_USER_ID)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Update habit error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update habit' },
      { status: 500 }
    );
  }
}
