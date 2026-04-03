'use client';

import { useState, useEffect } from 'react';

interface Analytics {
  goals: {
    total: number;
    completed: number;
    active: number;
    avgProgress: number;
  };
  habits: {
    total: number;
    totalStreak: number;
    bestHabit: { title: string; bestStreak: number } | null;
  };
  checkins: {
    total: number;
    avgMood: number;
    avgEnergy: number;
    avgStress: number;
    last7Days: any[];
  };
  sessions: {
    total: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const result = await response.json();
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error('Analytics yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="section-title">📊 Analytics</h1>
        <p className="text-gray-400">Veriler yükleniyor...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <h1 className="section-title">📊 Analytics</h1>
        <p className="text-gray-400">Veri yüklenemedi</p>
      </div>
    );
  }

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😕', '😐', '🙂', '😄'];
    return emojis[Math.min(mood - 1, 4)];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">📊 Genel Bakış</h1>
        <p className="section-subtitle">
          Senin ilerleme, istatistikler ve insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Goals Stats */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Hedefler</p>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-3xl font-bold">{analytics.goals.total}</p>
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p>✅ {analytics.goals.completed} tamamlandı</p>
            <p>⏳ {analytics.goals.active} aktif</p>
          </div>
        </div>

        {/* Habits Stats */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Alışkanlıklar</p>
            <span className="text-2xl">💪</span>
          </div>
          <p className="text-3xl font-bold">{analytics.habits.total}</p>
          <div className="text-xs text-gray-500 mt-2">
            🔥 {analytics.habits.totalStreak} toplam seri
          </div>
        </div>

        {/* Check-ins Stats */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Check-in'ler</p>
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-3xl font-bold">{analytics.checkins.total}</p>
          <div className="text-xs text-gray-500 mt-2">
            📅 Son kayıtlar
          </div>
        </div>

        {/* Sessions Stats */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Seanslar</p>
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-3xl font-bold">{analytics.sessions.total}</p>
          <div className="text-xs text-gray-500 mt-2">
            🤖 AI Koç
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">🎯 Hedef İlerlemesi</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Ortalama İlerleme</span>
              <span className="font-semibold">{analytics.goals.avgProgress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${analytics.goals.avgProgress}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mt-4">
            <div>
              <p>Tamamlanan</p>
              <p className="text-2xl font-bold text-green-500">
                {analytics.goals.completed}
              </p>
            </div>
            <div>
              <p>Aktif</p>
              <p className="text-2xl font-bold text-yellow-500">
                {analytics.goals.active}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Habit Info */}
      {analytics.habits.bestHabit && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">🏆 En İyi Alışkanlık</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg">{analytics.habits.bestHabit.title}</p>
              <p className="text-sm text-gray-400">
                {analytics.habits.bestHabit.bestStreak} günlük en iyi seri
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-yellow-500">
                {analytics.habits.bestHabit.bestStreak}
              </p>
              <p className="text-xs text-gray-400">🔥</p>
            </div>
          </div>
        </div>
      )}

      {/* Mood Trend */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">📈 Son 7 Gün Ruh Hali</h2>

        <div className="space-y-4">
          {/* Mood, Energy, Stress Averages */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl mb-1">{getMoodEmoji(analytics.checkins.avgMood)}</p>
              <p className="text-sm text-gray-400">Ortalama Ruh</p>
              <p className="text-lg font-bold">{analytics.checkins.avgMood}/5</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1">⚡</p>
              <p className="text-sm text-gray-400">Ortalama Enerji</p>
              <p className="text-lg font-bold">{analytics.checkins.avgEnergy}/5</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1">😰</p>
              <p className="text-sm text-gray-400">Ortalama Stres</p>
              <p className="text-lg font-bold">{analytics.checkins.avgStress}/5</p>
            </div>
          </div>

          {/* Chart simulation */}
          {analytics.checkins.last7Days.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3">Ruh Hali Trendi</p>
              <div className="flex items-end gap-2 h-24">
                {analytics.checkins.last7Days.map((checkin, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t"
                      style={{
                        height: `${(checkin.mood / 5) * 100}%`,
                      }}
                      title={`${checkin.mood}/5`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(checkin.checkin_date).getDate()}.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="card border-l-4 border-green-500">
        <h2 className="text-xl font-bold mb-3">💡 Özet</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>✅ {analytics.goals.completed} hedefi başarıyla tamamladın</li>
          <li>💪 {analytics.habits.total} alışkanlığı takip ediyor</li>
          <li>📊 {analytics.checkins.total} defa check-in kaydettin</li>
          <li>
            🎯 Hedeflerinde ortalama {analytics.goals.avgProgress}% ilerleme
            yaptın
          </li>
        </ul>
      </div>
    </div>
  );
}
