'use client';

import { useState } from 'react';

export default function HabitsPage() {
  const [habits] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

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
        <div className="card space-y-4">
          <input
            type="text"
            placeholder="Alışkanlık adı"
            className="input-base"
          />
          <select className="input-base">
            <option value="daily">Her Gün</option>
            <option value="weekly">Haftalık</option>
            <option value="custom">Özel</option>
          </select>
          <div className="flex gap-4">
            <button className="btn-primary flex-1 py-2">Oluştur</button>
            <button
              onClick={() => setShowForm(false)}
              className="btn-secondary flex-1 py-2"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {habits.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">
            Henüz alışkanlık ekledin. Pozitif alışkanlık oluşturmaya başla! 💪
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => (
            <div key={habit.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{habit.title}</h3>
                  <p className="text-gray-400">
                    {habit.current_streak} günlük seri 🔥
                  </p>
                </div>
                <button className="btn-primary px-4 py-2">Bugün Yap</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
