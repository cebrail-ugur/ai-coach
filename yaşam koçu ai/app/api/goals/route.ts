import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

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

const DEMO_USER_ID = 'demo-user-123'; // Mock user ID for demo

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', DEMO_USER_ID)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
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

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('goals')
      .insert([
        {
          user_id: DEMO_USER_ID,
          title: goal.title,
          description: goal.description || null,
          category: goal.category,
          priority: goal.priority,
          status: 'active',
          progress_percentage: 0,
          target_date: goal.targetDate || null,
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, progress_percentage, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Goal ID required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('goals')
      .update({
        progress_percentage: progress_percentage ?? undefined,
        status: status ?? undefined,
        updated_at: new Date().toISOString(),
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
    console.error('Update goal error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}
