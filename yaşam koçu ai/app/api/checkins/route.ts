import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const CreateCheckInSchema = z.object({
  mood: z.number().min(1).max(5),
  energy: z.number().min(1).max(5),
  stress: z.number().min(1).max(5),
  notes: z.string().optional(),
});

const DEMO_USER_ID = 'demo-user-123';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', DEMO_USER_ID)
      .order('checkin_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Get checkins error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch check-ins' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const checkin = CreateCheckInSchema.parse(body);

    const supabase = await createClient();

    // Check if today's checkin exists
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from('daily_checkins')
      .select('id')
      .eq('user_id', DEMO_USER_ID)
      .eq('checkin_date', today)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('daily_checkins')
        .update({
          mood: checkin.mood,
          energy: checkin.energy,
          stress: checkin.stress,
          notes: checkin.notes || null,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        message: 'Check-in güncellendi',
      });
    }

    // Create new
    const { data, error } = await supabase
      .from('daily_checkins')
      .insert([
        {
          user_id: DEMO_USER_ID,
          mood: checkin.mood,
          energy: checkin.energy,
          stress: checkin.stress,
          notes: checkin.notes || null,
          checkin_date: today,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Check-in kaydedildi ✅',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create checkin error:', error);

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
      { success: false, error: 'Failed to create check-in' },
      { status: 500 }
    );
  }
}
