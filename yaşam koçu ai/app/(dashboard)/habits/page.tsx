'use client';

import { useState, useEffect } from 'react';
import type { Habit } from '@/types';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily' as const,
    icon: '💪',
    color: 'blue',
  });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      const result = await response.json();
      if (result.success) {
        setHabits(result.data);
      }
    } catch (error) {
      console.error('Alışkanlıklar yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Alışkanlık adını giriniz!');
      return;
    }

    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setHabits((prev) => [result.data, ...prev]);
        setFormData({
          title: '',
          description: '',
          frequency: 'daily',
          icon: '💪',
          color: 'blue',
        });
        setShowForm(false);
        alert('Alışkanlık başarıyla oluşturuldu! ✅');
      } else {
        alert(`Hata: ${result.error}`);
      }
    } catch (error) {
      console.error('Alışkanlık oluşturma hatası:', error);
      alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };

  const completeHabit = async (habit: Habit) => {
    try {
      const newStreak = habit.current_streak + 1;
      const newBest = Math.max(habit.best_streak, newStreak);

      const response = await fetch('/api/habits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: habit.id,
          current_streak: newStreak,
          best_streak: newBest,
          total_completions: habit.total_completions + 1,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setHabits((prev) =>
          prev.map((h) => (h.id === habit.id ? result.data : h))
        );
        alert('Tebrikler! 🎉 Bugünün alışkanlığını tamamladın!');
      }
    } catch (error) {
      console.error('Alışkanlık güncelleme hatası:', error);
      alert('Hata: Alışkanlık güncellenemedi');
    }
  };

  const frequencyLabels: Record<string, string> = {
    daily: 'Her Gün',
    weekly: 'Haftalık',
    custom: 'Özel',
  };

  const icons = ['💪', '🏃', '📚', '🧘', '🥗', '💧', '😴', '🚴', '⚽', '🏋️'];
  const colors = ['blue', 'red', 'green', 'purple', 'yellow', 'pink', 'orange'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="section-title">📊 Alışkanlıklar</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary px-4 py-2"
        >
          + Yeni Alışkanlık
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <input
            type="text"
            placeholder="Alışkanlık adı (örn: Her gün 30 dakika spor yap)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-base"
            required
          />

          <textarea
            placeholder="Açıklama (opsiyonel)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="input-base"
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Sıklık</label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    frequency: e.target.value as any,
                  })
                }
                className="input-base"
              >
                <option value="daily">Her Gün</option>
                <option value="weekly">Haftalık</option>
                <option value="custom">Özel</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">İkon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="input-base"
              >
                {icons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1 py-2">
              Oluştur
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary flex-1 py-2"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">Alışkanlıklar yükleniyor...</p>
        </div>
      ) : habits.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">
            Henüz alışkanlık ekledin. Pozitif alışkanlık oluşturmaya başla! 💪
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => (
            <div key={habit.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{habit.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{habit.title}</h3>
                    {habit.description && (
                      <p className="text-sm text-gray-400">{habit.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {frequencyLabels[habit.frequency]}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => completeHabit(habit)}
                  className="btn-primary px-4 py-2 text-sm whitespace-nowrap"
                >
                  ✓ Bugün Yap
                </button>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">
                      {habit.current_streak}
                    </p>
                    <p className="text-xs text-gray-400">Günlük Seri</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-500">
                      {habit.best_streak}
                    </p>
                    <p className="text-xs text-gray-400">En İyi Seri</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">
                      {habit.total_completions}
                    </p>
                    <p className="text-xs text-gray-400">Toplam</p>
                  </div>
                </div>

                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((habit.current_streak / 30) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  30 günlük seri hedefine doğru ilerleme
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
