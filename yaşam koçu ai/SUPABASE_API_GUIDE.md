# Supabase Veri API'si - Tam Rehber

## 📍 API URL NEREDE?

### ✅ Doğru Yer: Supabase Dashboard

1. **https://supabase.com** aç, login yap
2. Sol tarafta senin projeni seç (ör: "ai-coach")
3. Sol menüde **Settings** → **API** tıkla

**BURADA GÖRECEKSİN:**
```
┌─────────────────────────────────────────┐
│ Project API Keys                        │
├─────────────────────────────────────────┤
│ Project URL (REST API Endpoint):        │
│                                         │
│ 📋 https://xxxxxx.supabase.co          │ ← BUNU KOPYALA
│                                         │
│ Anon Key (client-side):                │
│ eyJhbGc...                             │ ← BUNU DA KOPYALA
│                                         │
│ Service Role Key (server-side):        │
│ eyJhbGc...                             │ ← BUNU DA KOPYALA
└─────────────────────────────────────────┘
```

---

## 🔑 SUPABASE'DEN ALMACAĞIN 3 ŞEYET

### 1️⃣ PROJECT URL (REST API Endpoint)
```
https://xxxxxxxxxxxxxx.supabase.co
```
**Bu ne?** → Veritabanı API'sine erişim adresin
**Nereye yazılır?** → `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
```

### 2️⃣ ANON KEY (Public Client Key)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...
```
**Bu ne?** → Browser'dan (frontend'den) veri okuma için
**Nereye yazılır?** → `.env.local`
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 3️⃣ SERVICE ROLE KEY (Secret Server Key)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...
```
**Bu ne?** → Server'dan (backend'den) veri yazma/silme için
**Nereye yazılır?** → `.env.local`
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## 🧪 API URL'sini TEST ET

### Adım 1: Project URL'ini Kopyala
Supabase Settings → API → Project URL'i kopyala

### Adım 2: Terminal'de Test Et
```bash
curl -X GET "https://SENIN-URL.supabase.co/rest/v1/goals?select=*" \
  -H "apikey: SENIN-ANON-KEY"
```

**Cevap gelirse başarılı:**
```json
[]
```

### Adım 3: Veri Ekle ve Tekrar Test Et
```bash
curl -X POST "https://SENIN-URL.supabase.co/rest/v1/goals" \
  -H "apikey: SENIN-ANON-KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Spor Yap",
    "category": "health",
    "priority": "high"
  }'
```

---

## 🔗 SUPABASE API ENDPOINTS (Otomatik Oluşturuldu)

Şu tablalarımız için şu endpoints var:

### Goals
```
GET    /rest/v1/goals              → Tüm hedefleri getir
POST   /rest/v1/goals              → Yeni hedef ekle
PATCH  /rest/v1/goals?id=...       → Hedefi güncelle
DELETE /rest/v1/goals?id=...       → Hedefi sil
```

### Habits
```
GET    /rest/v1/habits             → Tüm alışkanlıkları getir
POST   /rest/v1/habits             → Yeni alışkanlık ekle
PATCH  /rest/v1/habits?id=...      → Alışkanlığı güncelle
DELETE /rest/v1/habits?id=...      → Alışkanlığı sil
```

### Coaching Sessions
```
GET    /rest/v1/coaching_sessions  → Seansları getir
POST   /rest/v1/coaching_sessions  → Seans ekle
```

### Daily Check-ins
```
GET    /rest/v1/daily_checkins     → Check-in'leri getir
POST   /rest/v1/daily_checkins     → Check-in ekle
```

### Chat Messages
```
GET    /rest/v1/chat_messages      → Mesajları getir
POST   /rest/v1/chat_messages      → Mesaj ekle
```

---

## 💻 JAVASCRIPT'TE NASIL KULLANILIR?

### Client-Side (Browser)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xxx.supabase.co',
  'ANON_KEY'
)

// Hedef getir
const { data, error } = await supabase
  .from('goals')
  .select('*')

// Hedef ekle
const { data, error } = await supabase
  .from('goals')
  .insert({
    user_id: 'xxx',
    title: 'Spor Yap',
    category: 'health'
  })

// Hedef güncelle
const { data, error } = await supabase
  .from('goals')
  .update({ progress_percentage: 50 })
  .eq('id', 'goal-id')

// Hedef sil
const { data, error } = await supabase
  .from('goals')
  .delete()
  .eq('id', 'goal-id')
```

### Server-Side (Next.js API)
```typescript
// lib/supabase/server.ts kullanarak
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()

// Herhangi bir user'a ait verileri getir (admin yetkisi)
const { data } = await supabase
  .from('goals')
  .select('*')
  .eq('user_id', 'any-user-id')
```

---

## 📊 SUPABASE DASHBOARD'DA VERI KONTROL ET

### Adım 1: Supabase Dashboard'a Git
https://supabase.com → Projeni seç

### Adım 2: SQL Editor'a Git
Sol menü → **SQL Editor**

### Adım 3: Veri Sorgula
```sql
SELECT * FROM goals;
SELECT * FROM habits;
SELECT * FROM coaching_sessions;
```

### Adım 4: Veri Tablosunu Görüntüle
Sol menü → **Table Editor** → Tabloyu seç

---

## 🔒 GÜVENLİK NOTLARI

### ✅ Doğru:
- `.env.local` → `NEXT_PUBLIC_SUPABASE_URL` (public)
- `.env.local` → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public, sadece okuma)
- `.env.local` → `SUPABASE_SERVICE_ROLE_KEY` (SECRET, server-only)

### ❌ YAPMA:
- `ANON_KEY`'i backend'te (server) kullanma
- `SERVICE_ROLE_KEY`'i frontend'e (browser) gösterme
- Keys'i GitHub'a commit etme

---

## 🔧 REAL-TIME SUBSCRIPTIONS (Bonus)

Veri değişince otomatik bildirim al:

```javascript
const subscription = supabase
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'goals' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

---

## 📚 SUPABASE DOCS

Detaylı docs: https://supabase.com/docs/guides/api

**Önemli sayfallar:**
- REST API: https://supabase.com/docs/guides/api/rest/overview
- Authentication: https://supabase.com/docs/guides/auth
- Realtime: https://supabase.com/docs/guides/realtime

---

## ✅ KONTROL LİSTESİ

- [ ] Supabase Dashboard'da Settings → API açtın
- [ ] Project URL kopyaladın (https://xxx.supabase.co)
- [ ] Anon Key kopyaladın
- [ ] Service Role Key kopyaladın
- [ ] `.env.local`'e yapıştırdın
- [ ] Terminal'de curl testi yaptın
- [ ] Veri eklediğin ve aldığını doğruladın
- [ ] Supabase Dashboard Table Editor'da verileri gördün

Hepsini yaptığında Supabase API ready! 🚀
