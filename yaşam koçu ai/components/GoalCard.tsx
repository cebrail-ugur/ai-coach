import type { Goal } from '@/types';

interface GoalCardProps {
  goal: Goal;
  onUpdate?: (goal: Goal) => void;
}

export function GoalCard({ goal, onUpdate }: GoalCardProps) {
  const categoryLabel: Record<string, string> = {
    health: '🏥 Sağlık',
    career: '💼 Kariyer',
    personal: '🌟 Kişisel',
    finance: '💰 Finans',
    relationships: '❤️ İlişkiler',
  };

  const priorityLabel: Record<string, string> = {
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
  };

  const priorityColor: Record<string, string> = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">{goal.title}</h3>
          <p className="text-sm text-gray-400">{categoryLabel[goal.category]}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-white text-sm ${priorityColor[goal.priority]}`}>
          {priorityLabel[goal.priority]}
        </span>
      </div>

      {goal.description && (
        <p className="text-gray-300 text-sm">{goal.description}</p>
      )}

      <div className="space-y-2">
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
      </div>

      {goal.target_date && (
        <p className="text-xs text-gray-500">
          Hedef tarihi: {new Date(goal.target_date).toLocaleDateString('tr-TR')}
        </p>
      )}

      <button
        onClick={() => onUpdate?.(goal)}
        className="w-full btn-secondary py-2 text-sm"
      >
        Detaylı Görüntüle
      </button>
    </div>
  );
}
