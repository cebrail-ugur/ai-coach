'use client';

import { useState, useEffect } from 'react';
import type { Goal } from '@/types';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'health' as const,
    priority: 'medium' as const,
    targetDate: '',
  });

  // Hedefleri yükle
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      const result = await response.json();
      if (result.success) {
        setGoals(result.data);
      }
    } catch (error) {
      console.error('Hedefler yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Hedef başlığını giriniz!');
      return;
    }

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || undefined,
          category: formData.category,
          priority: formData.priority,
          targetDate: formData.targetDate || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGoals((prev) => [result.data, ...prev]);
        setFormData({
          title: '',
          description: '',
          category: 'health',
          priority: 'medium',
          targetDate: '',
        });
        setShowForm(false);
        alert('Hedef başarıyla oluşturuldu! ✅');
      } else {
        alert(`Hata: ${result.error}`);
      }
    } catch (error) {
      console.error('Hedef oluşturma hatası:', error);
      alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };

  const updateGoalProgress = async (id: string, progress: number) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, progress_percentage: progress }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setGoals((prev) =>
            prev.map((g) => (g.id === id ? result.data : g))
          );
        }
      }
    } catch (error) {
      console.error('İlerleme güncelleme hatası:', error);
    }
  };

  const categoryLabels: Record<string, string> = {
    health: '🏥 Sağlık',
    career: '💼 Kariyer',
    personal: '🌟 Kişisel',
    finance: '💰 Finans',
    relationships: '❤️ İlişkiler',
  };

  const priorityLabels: Record<string, string> = {
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="section-title">🎯 Hedefler</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary px-4 py-2"
        >
          + Yeni Hedef
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <input
            type="text"
            placeholder="Hedef başlığı (örn: Spor yapmaya başla)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-base"
            required
          />
          <textarea
            placeholder="Açıklama (opsiyonel)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-base"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as any,
                })
              }
              className="input-base"
            >
              <option value="health">🏥 Sağlık</option>
              <option value="career">💼 Kariyer</option>
              <option value="personal">🌟 Kişisel</option>
              <option value="finance">💰 Finans</option>
              <option value="relationships">❤️ İlişkiler</option>
            </select>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as any,
                })
              }
              className="input-base"
            >
              <option value="low">Düşük Öncelik</option>
              <option value="medium">Orta Öncelik</option>
              <option value="high">Yüksek Öncelik</option>
            </select>
          </div>
          <input
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            className="input-base"
          />
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
          <p className="text-gray-400">Hedefler yükleniyor...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">Henüz hedef eklemedin. İlk hedefini ekleyerek başla! 🚀</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => (
            <div key={goal.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{goal.title}</h3>
                  <p className="text-sm text-gray-400">
                    {categoryLabels[goal.category]}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    priorityColors[goal.priority]
                  }`}
                >
                  {priorityLabels[goal.priority]}
                </span>
              </div>

              {goal.description && (
                <p className="text-gray-300 text-sm mb-4">{goal.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">İlerleme</span>
                  <span className="font-semibold">{goal.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress_percentage}%` }}
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  {[0, 25, 50, 75, 100].map((percent) => (
                    <button
                      key={percent}
                      onClick={() => updateGoalProgress(goal.id, percent)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        goal.progress_percentage === percent
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              {goal.target_date && (
                <p className="text-xs text-gray-500 mt-4">
                  Hedef: {new Date(goal.target_date).toLocaleDateString('tr-TR')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
