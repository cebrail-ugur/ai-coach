'use client';

import { useState } from 'react';

export default function GoalsPage() {
  const [goals] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'health', priority: 'medium' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ title: '', category: 'health', priority: 'medium' });
        setShowForm(false);
        // Yenile
      }
    } catch (error) {
      console.error('Hedef oluşturma hatası:', error);
    }
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
            placeholder="Hedef başlığı"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-base"
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-base"
          >
            <option value="health">Sağlık</option>
            <option value="career">Kariyer</option>
            <option value="personal">Kişisel</option>
            <option value="finance">Finans</option>
            <option value="relationships">İlişkiler</option>
          </select>
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

      {goals.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">Henüz hedef eklemedin. İlk hedefini ekleyerek başla! 🚀</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => (
            <div key={goal.id} className="card">
              <h3 className="font-bold text-lg">{goal.title}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">İlerleme</span>
                  <span className="font-semibold">{goal.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${goal.progress_percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
