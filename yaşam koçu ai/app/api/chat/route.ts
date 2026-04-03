import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCompletion, buildSystemPrompt, DEFAULT_KNOWLEDGE_BASE } from '@/lib/anthropic/coach';
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

    // Get the last user message
    const lastUserMessage = typedMessages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) {
      return NextResponse.json(
        { success: false, error: 'No user message found' },
        { status: 400 }
      );
    }

    try {
      // Build system prompt with context
      const systemPrompt = buildSystemPrompt(coachContext, DEFAULT_KNOWLEDGE_BASE);

      // Generate response
      const response = await generateCompletion(
        lastUserMessage.content,
        systemPrompt,
        1000
      );

      return NextResponse.json(
        { success: true, message: response },
        { status: 200 }
      );
    } catch (apiError: any) {
      // If API fails due to credits, use mock response
      console.log('API failed, using mock response:', apiError.message);

      const mockResponses = [
        "Harika bir başlangıç! Spor yapmaya başlamak çok güzel bir karar. Hangi tür spor seni cezbediyor? Fitness, futbol, yoga, yüzme...? Bunu bilince daha iyi bir plan yapabiliriz.",
        "Şu soruları kendine sor: Bu hedefi neden istiyorsun? Sağlığın mı, stres atmak mı, yoksa sosyalleşmek mi? Cevaplar hedefi başarmanın anahtarı.",
        "İlk adım olarak haftada 3 gün, günde 30 dakika spor yapmayı hedefleme. Tutarlılık her şeyden önemli. Minik adımlar büyük başarıları getirir!",
        "Spor başlama motivasyonu harika! Ama sabırlı ol. İlk 2 hafta zor olabilir, ama 3. haftada alışkanlık oluşmaya başlayacak. Devam et! 💪",
        "Başlamak için en iyi zaman bugün! Başlamak için en iyi yer ise ev veya yakın bir spor alanı. Karmaşık şeyler yapma, basit başla."
      ];

      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      return NextResponse.json(
        { success: true, message: randomResponse, isMock: true },
        { status: 200 }
      );
    }
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
