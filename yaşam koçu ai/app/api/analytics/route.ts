import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const DEMO_USER_ID = 'demo-user-123';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get all data
    const [goalsRes, habitsRes, checkinsRes, sessionsRes] = await Promise.all([
      supabase
        .from('goals')
        .select('*')
        .eq('user_id', DEMO_USER_ID),
      supabase
        .from('habits')
        .select('*')
        .eq('user_id', DEMO_USER_ID),
      supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .order('checkin_date', { ascending: false }),
      supabase
        .from('coaching_sessions')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .order('created_at', { ascending: false }),
    ]);

    const goals = goalsRes.data || [];
    const habits = habitsRes.data || [];
    const checkins = checkinsRes.data || [];
    const sessions = sessionsRes.data || [];

    // Calculate analytics
    const completedGoals = goals.filter((g: any) => g.status === 'completed').length;
    const activeGoals = goals.filter((g: any) => g.status === 'active').length;
    const avgGoalProgress =
      goals.length > 0
        ? Math.round(
            goals.reduce((sum: number, g: any) => sum + g.progress_percentage, 0) /
              goals.length
          )
        : 0;

    const totalHabits = habits.length;
    const totalStreak = habits.reduce((sum: number, h: any) => sum + h.current_streak, 0);
    const bestHabit = habits.length > 0
      ? habits.reduce((best: any, h: any) =>
          h.best_streak > best.best_streak ? h : best
        )
      : null;

    const avgMood =
      checkins.length > 0
        ? Math.round(
            checkins.reduce((sum: number, c: any) => sum + c.mood, 0) / checkins.length
          )
        : 0;

    const avgEnergy =
      checkins.length > 0
        ? Math.round(
            checkins.reduce((sum: number, c: any) => sum + c.energy, 0) / checkins.length
          )
        : 0;

    const avgStress =
      checkins.length > 0
        ? Math.round(
            checkins.reduce((sum: number, c: any) => sum + c.stress, 0) / checkins.length
          )
        : 0;

    // Mood trend (last 7 days)
    const last7Days = checkins.slice(0, 7).reverse();

    return NextResponse.json({
      success: true,
      data: {
        goals: {
          total: goals.length,
          completed: completedGoals,
          active: activeGoals,
          avgProgress: avgGoalProgress,
        },
        habits: {
          total: totalHabits,
          totalStreak,
          bestHabit: bestHabit ? {
            title: bestHabit.title,
            bestStreak: bestHabit.best_streak,
          } : null,
        },
        checkins: {
          total: checkins.length,
          avgMood,
          avgEnergy,
          avgStress,
          last7Days,
        },
        sessions: {
          total: sessions.length,
        },
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
