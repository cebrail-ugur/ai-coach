// User Profile
export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  coaching_style: 'motivational' | 'analytical' | 'empathetic' | null;
  primary_focus: string | null;
  created_at: string;
  updated_at: string;
}

// Goals
export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  progress_percentage: number;
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

// Habits
export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  frequency: 'daily' | 'weekly' | 'custom';
  icon: string;
  color: string;
  current_streak: number;
  best_streak: number;
  total_completions: number;
  last_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Chat Messages
export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

// Sessions
export interface CoachingSession {
  id: string;
  user_id: string;
  title: string;
  summary: string | null;
  duration_minutes: number | null;
  key_insights: string[];
  action_items: Array<{ id: string; text: string; completed: boolean }>;
  topics_covered: string[];
  mood_before: number | null;
  mood_after: number | null;
  created_at: string;
  updated_at: string;
}

// Daily Check-in
export interface DailyCheckin {
  id: string;
  user_id: string;
  mood: number;
  energy: number;
  stress: number;
  notes: string | null;
  checkin_date: string;
  created_at: string;
}

// Coach Context (for AI)
export interface CoachContext {
  profile: UserProfile;
  activeGoals: Goal[];
  activeHabits: Habit[];
  recentSessions: CoachingSession[];
  lastCheckin: DailyCheckin | null;
  assessmentSummary: string | null;
}

// Stripe
export interface StripeCustomer {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  subscription_status: 'active' | 'inactive' | 'cancelled';
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  timestamp?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
