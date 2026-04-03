import Anthropic from '@anthropic-ai/sdk';
import type { CoachContext, ChatMessage } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export function buildSystemPrompt(
  context: CoachContext,
  knowledgeBase: string
): string {
  const {
    profile,
    activeGoals,
    recentSessions,
    activeHabits,
    lastCheckin,
    assessmentSummary,
  } = context;

  const goalsSummary =
    activeGoals.length > 0
      ? activeGoals
          .map(
            (g) =>
              `- ${g.title} (${g.category}, %${g.progress_percentage} tamamlandı, öncelik: ${g.priority})`
          )
          .join('\n')
      : 'Henüz aktif hedef bulunmuyor.';

  const habitsSummary =
    activeHabits.length > 0
      ? activeHabits
          .map(
            (h) =>
              `- ${h.icon} ${h.title} (${h.current_streak} günlük seri, ${h.frequency})`
          )
          .join('\n')
      : 'Henüz aktif alışkanlık bulunmuyor.';

  const recentContext =
    recentSessions.length > 0
      ? recentSessions
          .slice(0, 3)
          .map((s, i) => `Seans ${i + 1}: ${s.summary}`)
          .join('\n\n')
      : 'İlk seans.';

  const checkinContext = lastCheckin
    ? `Son check-in (${lastCheckin.checkin_date}): Ruh hali ${lastCheckin.mood}/5, Enerji ${lastCheckin.energy}/5, Stres ${lastCheckin.stress}/5`
    : 'Henüz günlük check-in yok.';

  return `Sen, aşağıdaki metodoloji ve yaklaşımla çalışan uzman bir yaşam & performans koçusun. Kullanıcıya kişisel koç gibi davranırsın — samimi, motive edici, dürüst ve çözüm odaklı.

# KOÇ METODOLOJİSİ VE YAKLAŞIM
${knowledgeBase}

# ÇALIŞMA PRENSİPLERİN
1. Her zaman aktif dinle, yargılamadan yaklaş
2. Güçlü sorular sor — "neden" yerine "nasıl" ve "ne" kullan
3. Kullanıcının kendi cevabını bulmasına yardım et, cevabı verme
4. Somut, uygulanabilir adımlar öner
5. İlerlemeyi kutla, küçük kazanımları gözden kaçırma
6. Zorlu gerçekleri nazikçe ama dürüstçe söyle
7. Hedeflerle tutarlı kal, odağı koru
8. Türkçe veya İngilizce konuş — kullanıcının diline uyum sağla

# KULLANICI PROFİLİ
İsim: ${profile.full_name || 'Kullanıcı'}
Koçluk tarzı tercihi: ${profile.coaching_style || 'belirlenmemiş'}
Birincil odak alanı: ${profile.primary_focus || 'belirlenmemiş'}
${assessmentSummary ? `Değerlendirme özeti: ${assessmentSummary}` : ''}

# AKTİF HEDEFLER
${goalsSummary}

# AKTİF ALIŞKANLIKLAR
${habitsSummary}

# SON SEANS ÖZETLERİ
${recentContext}

# SON DURUM (CHECK-IN)
${checkinContext}

# KOÇLUK KURALLARI
- Mesajların kısa ve etkili olsun (çok uzun cevap verme, 3-4 paragraf max)
- Her cevapta bir sonraki adımı netleştir
- Kullanıcı bir şey paylaşırsa önce onu duy, sonra yönlendir
- İstatistik ve sayıları kullan (seri günleri, tamamlama oranı vb.)
- Markdown kullanabilirsin ama aşırı teknik olma
- Eğer acil yardım gerektiren bir durum varsa (kriz, ciddi sağlık sorunu vb.) profesyonel destek almalarını yönlendir`;
}

export const DEFAULT_KNOWLEDGE_BASE = `
## TEMEL KOÇLUK YAKLAŞIMI

### 1. Farkındalık → Karar → Eylem Döngüsü
Her koçluk seansı bu üç aşamayı içerir:
- **Farkındalık**: Kullanıcının mevcut durumunu, inançlarını ve kalıplarını keşfet
- **Karar**: Hangi değişimi yapmak istediğini netleştir
- **Eylem**: Somut, ölçülebilir ilk adımı belirle

### 2. Değerler Temelli Hedefler
Hedefler değerlerle hizalı olmadığında sürdürülebilir olmaz.
Her hedefi şu sorularla sorgula:
- "Bu hedef sana neden önemli?"
- "Bu hedefi başardığında hayatın nasıl değişir?"
- "Bu hedefin arkasında ne var?"

### 3. Engel Anatomisi
Üç tür engel vardır:
- **Bilgi eksikliği**: Ne yapacağını bilmiyorsun → Bilgi kaynağı yönlendir
- **Beceri eksikliği**: Nasıl yapacağını bilmiyorsun → Pratik adımlar ver
- **Motivasyon/İnanç engeli**: Yapabileceğine inanmıyorsun → Köklere in

### 4. Güçlü Sorular Bankası
- "Eğer başarısız olma ihtimalin olmasaydı ne yapardın?"
- "Bu durumda kontrolünde olan ne?"
- "En iyi versiyonun bu durumda ne yapardı?"
- "Bu inancın sana maliyeti nedir?"
- "5 yıl sonra geriye baksan, bugün ne yapmış olmak isterdin?"

### 5. İlerleme ve Kutlama
Her ilerleme görünür hale getirilmeli:
- Seri günleri ve streak takibi
- Tamamlanan hedefleri kutla
- Küçük kazanımları büyük başarılarla aynı değerde gör
- Geri gitmek başarısızlık değil, öğrenme fırsatı

### 6. Sorumluluk ve Hesap Verebilirlik
- Her seans sonunda net bir eylem maddesi belirle
- Bir sonraki seansa kadar ne yapacak?
- Taahhüt cümlesini kullanıcının kendi ağzından al
- Başarısız olunursa yargılama — nedeni birlikte keşfet
`;

export async function streamCoachingResponse(
  messages: ChatMessage[],
  context: CoachContext,
  knowledgeBase: string = DEFAULT_KNOWLEDGE_BASE
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = buildSystemPrompt(context, knowledgeBase);
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = await anthropic.messages.stream({
          model: 'claude-opus-4-6',
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            const data = JSON.stringify({
              type: 'delta',
              content: chunk.delta.text,
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }

        const finalMessage = await stream.finalMessage();
        const doneData = JSON.stringify({
          type: 'done',
          usage: finalMessage.usage,
        });
        controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
        controller.close();
      } catch (error) {
        const errData = JSON.stringify({
          type: 'error',
          error: String(error),
        });
        controller.enqueue(encoder.encode(`data: ${errData}\n\n`));
        controller.close();
      }
    },
  });
}

export async function generateCompletion(
  prompt: string,
  systemPrompt?: string,
  maxTokens: number = 500
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('');
}

export async function summarizeSession(
  messages: ChatMessage[]
): Promise<{
  title: string;
  summary: string;
  key_insights: string[];
  action_items: Array<{ id: string; text: string; completed: boolean }>;
  topics_covered: string[];
}> {
  const conversation = messages
    .map((m) =>
      `${m.role === 'user' ? 'Kullanıcı' : 'Koç'}: ${m.content}`
    )
    .join('\n\n');

  const prompt = `Aşağıdaki koçluk seansını analiz et ve JSON formatında özetle:

SEANS:
${conversation}

Şu formatta JSON döndür (başka hiçbir şey yazma):
{
  "title": "Seans için kısa başlık (max 50 karakter)",
  "summary": "Seansın 2-3 cümlelik özeti",
  "key_insights": ["Öngörü 1", "Öngörü 2", "Öngörü 3"],
  "action_items": [
    {"id": "1", "text": "Yapılacak eylem", "completed": false}
  ],
  "topics_covered": ["Konu 1", "Konu 2"]
}`;

  const raw = await generateCompletion(prompt, undefined, 800);

  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return {
      title: 'Koçluk Seansı',
      summary: 'Seans tamamlandı.',
      key_insights: [],
      action_items: [],
      topics_covered: [],
    };
  }
}

export async function generateGoalBreakdown(
  goalTitle: string,
  goalDescription: string,
  category: string,
  userProfile: CoachContext['profile']
): Promise<{
  why_it_matters: string;
  key_challenges: string[];
  success_metrics: string[];
  weekly_actions: string[];
  resources: string[];
  estimated_timeline: string;
}> {
  const prompt = `Sen bir yaşam koçusun. Kullanıcı şu hedefi belirledi:

Hedef: ${goalTitle}
Açıklama: ${goalDescription || 'Yok'}
Kategori: ${category}
Kullanıcı profili: ${JSON.stringify(userProfile)}

Bu hedef için detaylı bir eylem planı oluştur. JSON formatında döndür:
{
  "why_it_matters": "Bu hedefin neden önemli olduğu",
  "key_challenges": ["Olası engel 1", "Olası engel 2"],
  "success_metrics": ["Başarı ölçütü 1", "Başarı ölçütü 2"],
  "weekly_actions": ["Haftalık eylem 1", "Haftalık eylem 2", "Haftalık eylem 3"],
  "resources": ["Kaynak/araç önerisi 1", "Kaynak/araç önerisi 2"],
  "estimated_timeline": "Tahmini süre"
}`;

  const raw = await generateCompletion(prompt, undefined, 600);

  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return {
      why_it_matters: 'Bu hedef kişisel gelişimin için önemli.',
      key_challenges: ['Tutarlılık', 'Zaman yönetimi'],
      success_metrics: ['Düzenli ilerleme', 'Hedef tarihinde tamamlama'],
      weekly_actions: ['Haftalık hedef revizyonu', 'Günlük küçük adım'],
      resources: [],
      estimated_timeline: 'Belirtilmedi',
    };
  }
}

export async function generateDailyMessage(
  context: CoachContext
): Promise<string> {
  const { profile, activeGoals, activeHabits, lastCheckin } = context;

  const prompt = `Sen bir yaşam koçusun. ${profile.full_name || 'Kullanıcı'} için bugünkü kişisel koçluk mesajını yaz.

Bilgiler:
- Aktif hedefler: ${activeGoals.map((g) => g.title).join(', ') || 'Yok'}
- Alışkanlıklar: ${activeHabits.map((h) => `${h.title} (${h.current_streak} gün seri)`).join(', ') || 'Yok'}
- Dün check-in: ${lastCheckin ? `Ruh hali ${lastCheckin.mood}/5, Enerji ${lastCheckin.energy}/5` : 'Yok'}

Kısa (2-3 cümle), motive edici, kişisel bir mesaj yaz. Sıcak ve samimi ol.`;

  return generateCompletion(prompt, undefined, 200);
}

export async function generateJournalInsights(
  content: string,
  mood: number | null
): Promise<string> {
  const prompt = `Kullanıcı şu journal kaydını yazmış:

"${content}"
Ruh hali: ${mood ? `${mood}/5` : 'Belirtilmemiş'}

Koç olarak kısa (2-3 cümle), farkındalık artırıcı bir yorum yaz. Yargılamadan, merakla yaklaş.`;

  return generateCompletion(prompt, undefined, 300);
}
