import type { Habit } from '@/types';

interface HabitCardProps {
  habit: Habit;
  onCheck?: (habit: Habit) => void;
}

export function HabitCard({ habit, onCheck }: HabitCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-3xl">{habit.icon}</span>
          <div>
            <h3 className="font-bold">{habit.title}</h3>
            <div className="flex gap-4 text-sm text-gray-400">
              <span>🔥 {habit.current_streak} gün seri</span>
              <span>🏆 En iyi: {habit.best_streak} gün</span>
            </div>
            {habit.description && (
              <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => onCheck?.(habit)}
          className="btn-primary px-4 py-2 whitespace-nowrap"
        >
          {habit.last_completed_at &&
          new Date(habit.last_completed_at).toDateString() === new Date().toDateString()
            ? '✓ Yapıldı'
            : 'Bugün Yap'}
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-400">
          Toplam: {habit.total_completions} kez tamamlandı ({habit.frequency})
        </div>
      </div>
    </div>
  );
}
