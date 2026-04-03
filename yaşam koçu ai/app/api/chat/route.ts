import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { streamCoachingResponse } from '@/lib/anthropic/coach';
import type { ChatMessage, CoachContext } from '@/types';

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
});

/**
 * Builds a mock coaching context for demonstration
 * In production, this would fetch from database based on user ID
 */
function getMockCoachContext(): CoachContext {
  return {
    profile: {
      id: '1',
      full_name: 'Kullanıcı',
      email: 'user@example.com',
      avatar_url: null,
      coaching_style: 'empathetic',
      primary_focus: 'personal-growth',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    activeGoals: [],
    activeHabits: [],
    recentSessions: [],
    lastCheckin: null,
    assessmentSummary: null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = ChatRequestSchema.parse(body);

    if (messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No messages provided' },
        { status: 400 }
      );
    }

    const coachContext = getMockCoachContext();
    const typedMessages: ChatMessage[] = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const stream = await streamCoachingResponse(
      typedMessages,
      coachContext
    );

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
