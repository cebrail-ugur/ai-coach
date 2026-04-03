'use client';

import { useState, useEffect } from 'react';

interface DailyCheckin {
  id: string;
  mood: number;
  energy: number;
  stress: number;
  notes: string | null;
  checkin_date: string;
}

export default function CheckinPage() {
  const [checkins, setCheckins] = useState<DailyCheckin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    mood: 3,
    energy: 3,
    stress: 3,
    notes: '',
  });

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    try {
      const response = await fetch('/api/checkins');
      const result = await response.json();
      if (result.success) {
        setCheckins(result.data);

        // Bugünün check-in'i varsa form'u doldur
        const today = new Date().toISOString().split('T')[0];
        const todayCheckin = result.data.find(
          (c: DailyCheckin) => c.checkin_date === today
        );
        if (todayCheckin) {
          setFormData({
            mood: todayCheckin.mood,
            energy: todayCheckin.energy,
            stress: todayCheckin.stress,
            notes: todayCheckin.notes || '',
          });
        }
      }
    } catch (error) {
      console.error('Check-in yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchCheckins();
        alert(result.message || 'Check-in kaydedildi! ✅');
      } else {
        alert(`Hata: ${result.error}`);
      }
    } catch (error) {
      console.error('Check-in kaydetme hatası:', error);
      alert('Hata: Check-in kaydedilemedi');
    }
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😕', '😐', '🙂', '😄'];
    return emojis[mood - 1];
  };

  const getEnergyEmoji = (energy: number) => {
    const emojis = ['🪫', '⚡', '⚡⚡', '⚡⚡⚡', '🔋'];
    return emojis[energy - 1];
  };

  const getStressEmoji = (stress: number) => {
    const emojis = ['😌', '😐', '😟', '😰', '🤯'];
    return emojis[stress - 1];
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="section-title">📝 Günlük Check-in</h1>
      <p className="text-gray-400">
        Bugünün ruh halinizi kaydederek ilerlemenizi takip edin.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Mood */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold">Ruh Halim</label>
            <span className="text-4xl">{getMoodEmoji(formData.mood)}</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.mood}
            onChange={(e) =>
              setFormData({ ...formData, mood: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Çok Kötü</span>
            <span>Kötü</span>
            <span>Normal</span>
            <span>İyi</span>
            <span>Çok İyi</span>
          </div>
        </div>

        {/* Energy */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold">Enerji Seviyem</label>
            <span className="text-2xl">{getEnergyEmoji(formData.energy)}</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.energy}
            onChange={(e) =>
              setFormData({ ...formData, energy: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Çok Düşük</span>
            <span>Düşük</span>
            <span>Normal</span>
            <span>Yüksek</span>
            <span>Çok Yüksek</span>
          </div>
        </div>

        {/* Stress */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold">Stres Seviyem</label>
            <span className="text-2xl">{getStressEmoji(formData.stress)}</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.stress}
            onChange={(e) =>
              setFormData({ ...formData, stress: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Stresli Değilim</span>
            <span>Az</span>
            <span>Orta</span>
            <span>Yüksek</span>
            <span>Çok Yüksek</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-lg font-semibold mb-2 block">
            Notlar (Opsiyonel)
          </label>
          <textarea
            placeholder="Bugün nasıl bir gün geçirdin? Neler hissettin?"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input-base"
            rows={4}
          />
        </div>

        <button type="submit" className="btn-primary w-full py-3 text-lg">
          Kaydetti 💾
        </button>
      </form>

      {/* History */}
      {!isLoading && checkins.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">📊 Geçmiş Check-in'ler</h2>

          <div className="grid gap-4">
            {checkins.slice(0, 7).map((checkin) => (
              <div key={checkin.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-400">
                    {new Date(checkin.checkin_date).toLocaleDateString('tr-TR')}
                  </p>
                  <div className="flex gap-3 text-2xl">
                    <span>{getMoodEmoji(checkin.mood)}</span>
                    <span>{getEnergyEmoji(checkin.energy)}</span>
                    <span>{getStressEmoji(checkin.stress)}</span>
                  </div>
                </div>

                {checkin.notes && (
                  <p className="text-gray-300 text-sm">{checkin.notes}</p>
                )}

                <div className="flex gap-6 text-xs text-gray-400 mt-3">
                  <div>
                    <p className="font-semibold">Ruh Hali</p>
                    <p>{checkin.mood}/5</p>
                  </div>
                  <div>
                    <p className="font-semibold">Enerji</p>
                    <p>{checkin.energy}/5</p>
                  </div>
                  <div>
                    <p className="font-semibold">Stres</p>
                    <p>{checkin.stress}/5</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
