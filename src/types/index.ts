export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type CategoryId =
  | 'countries'
  | 'capitals'
  | 'flags'
  | 'continents'
  | 'landmarks'
  | 'oceans'
  | 'rivers'
  | 'mountains'
  | 'currencies'
  | 'world_geography'
  | 'asia'
  | 'europe'
  | 'africa'
  | 'north_america'
  | 'south_america'
  | 'oceania';

export interface CategoryInfo {
  id: CategoryId | string;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  totalQuestions?: number;
}

export interface Question {
  id: string;
  question: string;
  categoryId: CategoryId | string;
  difficulty: Difficulty;
  options: string[];
  correctAnswer: string;
  explanation: string;
  flagEmoji?: string;
  imageUrl?: string;
  points: number;
  isCustom?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  totalQuizzes: number;
  totalPoints: number;
  totalCorrect: number;
  totalAnswered: number;
  accuracy: number;
  bestStreak: number;
  currentStreak: number;
  favoriteCategory: string;
  unlockedAchievements: string[];
  lastDailyDate?: string;
  createdAt: string;
}

export interface QuizAttemptAnswer {
  questionId: string;
  question: string;
  selected: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  pointsEarned: number;
  timeTakenSeconds: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  difficulty: Difficulty;
  score: number;
  baseScore: number;
  speedBonus: number;
  streakBonus: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  bestStreak: number;
  timeSpentSeconds: number;
  date: string;
  isDailyChallenge?: boolean;
  answers: QuizAttemptAnswer[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'starter' | 'skill' | 'streak' | 'mastery';
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  score: number;
  bestStreak: number;
  quizzesCompleted: number;
  timeframe: 'daily' | 'weekly' | 'allTime';
}
