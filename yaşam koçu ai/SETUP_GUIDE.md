# Adım Adım Kurulum Rehberi

## 1️⃣ SUPABASE KURULUMU (Database)

### Adım 1: Supabase Hesabı Oluştur
1. https://supabase.com adresine git
2. **"Sign Up"** butonuna tıkla
3. **GitHub** ile giriş yap (en kolay yol)
4. Email doğrulaması yap

### Adım 2: Yeni Project Oluştur
1. Dashboard'da **"New Project"** tıkla
2. Ayarları şu şekilde yap:
   - **Project Name**: `ai-coach` (istediğin isim)
   - **Database Password**: Güçlü bir şifre gir ve **KÖPYELEYİP SAKLA**
   - **Region**: `Istanbul` (varsa) veya `Europe - Frankfurt`
   - **Pricing Plan**: `Free` seç
3. **"Create new project"** tıkla (2-3 dakika bekle)

### Adım 3: Gerekli Keys'i Al
1. Dashboard'da sol tarafta **"Settings"** > **"API"** tıkla
2. Şu bilgileri KÖPYELEYİP NOT AL:
   ```
   Project URL: https://xxx.supabase.co
   anon key: eyJxxx...
   service_role key: eyJyyy...
   ```

### Adım 4: Database Schema Oluştur
1. Sol menüde **"SQL Editor"** tıkla
2. **"New Query"** tıkla
3. Aşağıdaki kodu kopyala ve yapıştır:

```sql
-- Users Profile
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  coaching_style TEXT,
  primary_focus TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'active',
  progress_percentage INTEGER DEFAULT 0,
  target_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habits
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL,
  icon TEXT DEFAULT '💪',
  color TEXT DEFAULT 'blue',
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  last_completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Coaching Sessions
CREATE TABLE coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  summary TEXT,
  duration_minutes INTEGER,
  key_insights JSONB DEFAULT '[]'::jsonb,
  action_items JSONB DEFAULT '[]'::jsonb,
  topics_covered JSONB DEFAULT '[]'::jsonb,
  mood_before INTEGER,
  mood_after INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Daily Check-in
CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood INTEGER NOT NULL,
  energy INTEGER NOT NULL,
  stress INTEGER NOT NULL,
  notes TEXT,
  checkin_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat History
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES coaching_sessions(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Stripe Customers
CREATE TABLE stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  subscription_status TEXT DEFAULT 'inactive',
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Her kullanıcı sadece kendi verilerini görebilsin)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own sessions" ON coaching_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own checkins" ON daily_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own stripe customer" ON stripe_customers
  FOR SELECT USING (auth.uid() = user_id);
```

4. **"Run"** butonuna tıkla
5. ✅ Başarıyı gösteren mesaj çıkacak

---

## 2️⃣ ANTHROPIC API KEY (Claude AI)

### Adım 1: Anthropic Hesabı Oluştur
1. https://console.anthropic.com adresine git
2. **Sign up** tıkla
3. Email ile kayıt ol ve doğrula

### Adım 2: API Key Al
1. Dashboard'da **"API Keys"** bölümüne git
2. **"Create Key"** tıkla
3. Adını yaz: `ai-coach-dev`
4. **Kopyala ve SAKLA** (tekrar göremeyeceksin!)

---

## 3️⃣ STRIPE (Opsiyonel - Ödeme için)

Şimdilik atla, ileriye doğru ekleyebilirsin.

---

## 4️⃣ .ENV.LOCAL DOSYASINI DOLDUR

### Adım 1: Dosyayı Aç
VS Code'da `Desktop/yaşam koçu ai/.env.local` dosyasını aç

### Adım 2: Supabase Bilgilerini Gir
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJyyy...
```
(Adım 1.3'ten kopyaladığın bilgileri yapıştır)

### Adım 3: Anthropic API Key'ini Gir
```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxx
```
(Adım 2.2'den kopyaladığın key'i yapıştır)

### Adım 4: Stripe Keys (Şimdilik Boş Bırak)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Adım 5: App URL
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**SONUÇ**: `.env.local` dosyan şöyle görünmeli:
```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 5️⃣ DEV SERVER'I BAŞLAT

Terminal'de:
```bash
cd "Desktop/yaşam koçu ai"
npm run dev
```

Beklenti:
```
✓ Ready in 1.4s
- Local: http://localhost:3000
```

Tarayıcıda aç: **http://localhost:3000**

---

## 6️⃣ TEST ET

### Landing Page
- ✅ "Başla" butonu görünüyor mu?
- ✅ 3 kart (Sohbet, Hedefler, Alışkanlıklar) var mı?

### Dashboard
- `/dashboard/chat` adresine git
- Bir mesaj yaz: "Merhaba"
- Koçtan cevap almalısın (Claude AI)

### API'yi Test Et
Terminal'de curl ile test et:
```bash
curl -X POST http://localhost:3000/api/goals \
  -H "Content-Type: application/json" \
  -d '{"title":"Spor Yap","category":"health","priority":"high"}'
```

Cevap şöyle geliyorsa başarılı:
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Spor Yap"
  }
}
```

---

## 🔧 SORUN GIDERME

### Hata: "Cannot find module @supabase/ssr"
```bash
cd "Desktop/yaşam koçu ai"
npm install
npm run dev
```

### Hata: "API key is invalid"
1. `.env.local` dosyasını kontrol et
2. Boş değer var mı diye bak
3. Supabase'den tekrar kopyala (boşluk olmadığından emin ol)

### Hata: "Supabase connection failed"
1. İnternet bağlantısı var mı kontrol et
2. `NEXT_PUBLIC_SUPABASE_URL` doğru mu?
3. Supabase'de project aktif mi?

### Hata: "Claude API error"
1. `ANTHROPIC_API_KEY` doğru mu?
2. API key'in başında `sk-ant-` var mı?
3. Anthropic hesabında paraya ihtiyaç var mı kontrol et

---

## ✅ BAŞARILI SETUP İŞARETLERİ

- [ ] Supabase project oluşturuldu
- [ ] Database schema'sı yüklendi
- [ ] Anthropic API key alındı
- [ ] `.env.local` dolduruldu
- [ ] `npm run dev` başarıyla çalışıyor
- [ ] http://localhost:3000 açılıyor
- [ ] Chat endpoint cevap veriyor

Hepsini yaptığında **"You're all set! 🚀"** yazabilirsin.

---

## 📝 ÖNEMLI NOTLAR

1. **API Keys'i SAKLA**: GitHub'a commit etme!
2. **`.env.local` Gitignore'da**: Otomatik korunuyor
3. **Supabase Şifresi**: Başında belirtilen şifreyi sakla
4. **Free Plan Yeterli**: Geliştirme ve test için
5. **Authentication**: Şimdilik kaldırıldı, ileriye doğru eklenecek

---

Sorunda varsa sor! 🤝
