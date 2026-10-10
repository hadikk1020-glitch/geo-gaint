import {
  Achievement,
  CategoryInfo,
  Difficulty,
  LeaderboardEntry,
  Question,
  QuizAttempt,
  UserProfile,
} from '../types';
import { INITIAL_CATEGORIES, INITIAL_QUESTIONS } from './seedQuestions';

const STORAGE_KEYS = {
  QUESTIONS: 'geo_giant_questions_v1',
  CATEGORIES: 'geo_giant_categories_v1',
  USER_PROFILE: 'geo_giant_user_profile_v1',
  QUIZ_HISTORY: 'geo_giant_quiz_history_v1',
  LEADERBOARD_DAILY: 'geo_giant_leaderboard_daily_v1',
  LEADERBOARD_WEEKLY: 'geo_giant_leaderboard_weekly_v1',
  LEADERBOARD_ALLTIME: 'geo_giant_leaderboard_alltime_v1',
  THEME_MODE: 'geo_giant_theme_mode',
};

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'ach_beginner',
    title: 'Geography Beginner',
    description: 'Complete your very first geography quiz on Geo Giant.',
    icon: 'Compass',
    category: 'starter',
  },
  {
    id: 'ach_flags',
    title: 'Flag Master',
    description: 'Score 90% or higher in the World Flags category.',
    icon: 'Flag',
    category: 'skill',
  },
  {
    id: 'ach_capitals',
    title: 'Capital Expert',
    description: 'Score 90% or higher in Capital Cities quiz.',
    icon: 'Building2',
    category: 'skill',
  },
  {
    id: 'ach_explorer',
    title: 'World Explorer',
    description: 'Test your geography across 5 or more distinct categories.',
    icon: 'Globe',
    category: 'skill',
  },
  {
    id: 'ach_perfect',
    title: 'Perfect Quiz',
    description: 'Achieve 100% accuracy on any quiz with 5 or more questions.',
    icon: 'Award',
    category: 'mastery',
  },
  {
    id: 'ach_streak10',
    title: '10 Quiz Streak',
    description: 'Answer 10 consecutive geography questions correctly.',
    icon: 'Flame',
    category: 'streak',
  },
  {
    id: 'ach_points1000',
    title: '1000 Points',
    description: 'Accumulate a career total of 1,000 points.',
    icon: 'Coins',
    category: 'starter',
  },
  {
    id: 'ach_giant',
    title: 'Geography Giant',
    description: 'Amass 5,000 total points or triumph on an Expert level quiz.',
    icon: 'Crown',
    category: 'mastery',
  },
  {
    id: 'ach_daily',
    title: 'Daily Explorer',
    description: 'Complete today’s official Daily Geography Challenge.',
    icon: 'Calendar',
    category: 'skill',
  },
  {
    id: 'ach_speed',
    title: 'Speed Demon',
    description: 'Correctly answer a question in under 5 seconds.',
    icon: 'Zap',
    category: 'skill',
  },
];

const SEED_USERS = [
  { name: 'Elena Rostova', avatar: 'Cartographer', score: 6420, streak: 14, quizzes: 42 },
  { name: 'Marcus Chen', avatar: 'Pathfinder', score: 5890, streak: 12, quizzes: 38 },
  { name: 'Amara Okafor', avatar: 'Globe Trotter', score: 5120, streak: 15, quizzes: 35 },
  { name: 'Sofia Rodriguez', avatar: 'Alpinist', score: 4780, streak: 9, quizzes: 31 },
  { name: 'Liam O’Connor', avatar: 'Island Hopper', score: 4210, streak: 11, quizzes: 28 },
  { name: 'Zara Al-Mansoor', avatar: 'Deep Diver', score: 3950, streak: 8, quizzes: 26 },
  { name: 'Kenji Sato', avatar: 'Archaeologist', score: 3600, streak: 10, quizzes: 24 },
  { name: 'Aria Patel', avatar: 'Stargazer', score: 3140, streak: 7, quizzes: 22 },
];

export class Database {
  private static instance: Database;

  private constructor() {
    this.ensureInitialized();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }

    if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
      const defaultUser: UserProfile = {
        id: 'user_main',
        username: 'Student Explorer',
        avatar: 'Globe Trotter',
        totalQuizzes: 0,
        totalPoints: 0,
        totalCorrect: 0,
        totalAnswered: 0,
        accuracy: 0,
        bestStreak: 0,
        currentStreak: 0,
        favoriteCategory: 'World Geography',
        unlockedAchievements: [],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultUser));
    }

    if (!localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify([]));
    }

    // Seed leaderboards if empty
    if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD_ALLTIME)) {
      const allTime: LeaderboardEntry[] = SEED_USERS.map((u, i) => ({
        id: `lb-at-${i}`,
        rank: i + 1,
        username: u.name,
        avatar: u.avatar,
        score: u.score,
        bestStreak: u.streak,
        quizzesCompleted: u.quizzes,
        timeframe: 'allTime',
      }));
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD_ALLTIME, JSON.stringify(allTime));
    }

    if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD_WEEKLY)) {
      const weekly: LeaderboardEntry[] = SEED_USERS.slice(1, 7).map((u, i) => ({
        id: `lb-wk-${i}`,
        rank: i + 1,
        username: u.name,
        avatar: u.avatar,
        score: Math.round(u.score * 0.45),
        bestStreak: u.streak,
        quizzesCompleted: Math.round(u.quizzes * 0.4),
        timeframe: 'weekly',
      }));
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD_WEEKLY, JSON.stringify(weekly));
    }

    if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD_DAILY)) {
      const daily: LeaderboardEntry[] = SEED_USERS.slice(2, 6).map((u, i) => ({
        id: `lb-dy-${i}`,
        rank: i + 1,
        username: u.name,
        avatar: u.avatar,
        score: Math.round(u.score * 0.18),
        bestStreak: Math.max(3, u.streak - 4),
        quizzesCompleted: Math.max(1, Math.round(u.quizzes * 0.12)),
        timeframe: 'daily',
      }));
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD_DAILY, JSON.stringify(daily));
    }
  }

  // --- QUESTIONS CRUD ---
  public getQuestions(): Question[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return raw ? JSON.parse(raw) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  }

  public getQuestionsByCategory(categoryId: string, difficulty?: Difficulty): Question[] {
    const list = this.getQuestions();
    return list.filter((q) => {
      const matchCat = categoryId === 'all' || q.categoryId === categoryId;
      const matchDiff = !difficulty || q.difficulty === difficulty;
      return matchCat && matchDiff;
    });
  }

  public addQuestion(question: Omit<Question, 'id'>): Question {
    const list = this.getQuestions();
    const newQ: Question = {
      ...question,
      id: `q_custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      isCustom: true,
    };
    list.unshift(newQ);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(list));
    return newQ;
  }

  public updateQuestion(id: string, updates: Partial<Question>): Question | null {
    const list = this.getQuestions();
    const idx = list.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(list));
    return list[idx];
  }

  public deleteQuestion(id: string): boolean {
    const list = this.getQuestions();
    const filtered = list.filter((q) => q.id !== id);
    if (filtered.length === list.length) return false;
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(filtered));
    return true;
  }

  public resetQuestions(): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
  }

  // --- CATEGORIES ---
  public getCategories(): CategoryInfo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const cats: CategoryInfo[] = raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
      const questions = this.getQuestions();
      return cats.map((c) => ({
        ...c,
        totalQuestions: questions.filter((q) => q.categoryId === c.id).length,
      }));
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  public addCategory(cat: Omit<CategoryInfo, 'totalQuestions'>): CategoryInfo {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const list: CategoryInfo[] = raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
    list.push(cat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list));
    return cat;
  }

  // --- USER PROFILE ---
  public getUserProfile(): UserProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    const fallback: UserProfile = {
      id: 'user_main',
      username: 'Student Explorer',
      avatar: 'Globe Trotter',
      totalQuizzes: 0,
      totalPoints: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      accuracy: 0,
      bestStreak: 0,
      currentStreak: 0,
      favoriteCategory: 'World Geography',
      unlockedAchievements: [],
      createdAt: new Date().toISOString(),
    };
    return fallback;
  }

  public updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated: UserProfile = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    return updated;
  }

  // --- QUIZ HISTORY & ATTEMPTS ---
  public getQuizHistory(): QuizAttempt[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public recordQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): { attempt: QuizAttempt; newAchievements: Achievement[] } {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    const history = this.getQuizHistory();
    history.unshift(newAttempt);
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));

    // Update user profile
    const profile = this.getUserProfile();
    const totalQuizzes = profile.totalQuizzes + 1;
    const totalPoints = profile.totalPoints + newAttempt.score;
    const totalCorrect = profile.totalCorrect + newAttempt.correctCount;
    const totalAnswered = profile.totalAnswered + newAttempt.totalQuestions;
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const bestStreak = Math.max(profile.bestStreak, newAttempt.bestStreak);

    // Calculate favorite category
    const catCounts: Record<string, number> = {};
    history.forEach((h) => {
      catCounts[h.categoryName] = (catCounts[h.categoryName] || 0) + 1;
    });
    let favoriteCategory = profile.favoriteCategory;
    let maxPlays = 0;
    for (const [cName, count] of Object.entries(catCounts)) {
      if (count > maxPlays) {
        maxPlays = count;
        favoriteCategory = cName;
      }
    }

    // Check newly unlocked achievements
    const newlyUnlocked: Achievement[] = [];
    const currentUnlockedIds = new Set(profile.unlockedAchievements);

    const checkAndAward = (achId: string, condition: boolean) => {
      if (condition && !currentUnlockedIds.has(achId)) {
        currentUnlockedIds.add(achId);
        const match = ACHIEVEMENTS_LIST.find((a) => a.id === achId);
        if (match) {
          newlyUnlocked.push({ ...match, unlockedAt: new Date().toISOString() });
        }
      }
    };

    // 1. Beginner
    checkAndAward('ach_beginner', totalQuizzes >= 1);
    // 2. Flags
    checkAndAward(
      'ach_flags',
      newAttempt.categoryId === 'flags' && newAttempt.accuracy >= 90
    );
    // 3. Capitals
    checkAndAward(
      'ach_capitals',
      newAttempt.categoryId === 'capitals' && newAttempt.accuracy >= 90
    );
    // 4. World Explorer: played >= 5 distinct categories
    const distinctCats = new Set(history.map((h) => h.categoryId));
    checkAndAward('ach_explorer', distinctCats.size >= 5);
    // 5. Perfect Quiz: 100% on >= 5 questions
    checkAndAward('ach_perfect', newAttempt.accuracy === 100 && newAttempt.totalQuestions >= 5);
    // 6. 10 Streak
    checkAndAward('ach_streak10', bestStreak >= 10);
    // 7. 1000 Points
    checkAndAward('ach_points1000', totalPoints >= 1000);
    // 8. Geography Giant: 5000 points or expert perfect quiz
    checkAndAward(
      'ach_giant',
      totalPoints >= 5000 || (newAttempt.difficulty === 'expert' && newAttempt.accuracy === 100)
    );
    // 9. Daily
    if (newAttempt.isDailyChallenge) {
      checkAndAward('ach_daily', true);
    }
    // 10. Speed Demon
    const hasFastAnswer = newAttempt.answers.some((a) => a.isCorrect && a.timeTakenSeconds <= 5);
    checkAndAward('ach_speed', hasFastAnswer);

    const updatedProfile: UserProfile = {
      ...profile,
      totalQuizzes,
      totalPoints,
      totalCorrect,
      totalAnswered,
      accuracy,
      bestStreak,
      favoriteCategory,
      unlockedAchievements: Array.from(currentUnlockedIds),
      lastDailyDate: newAttempt.isDailyChallenge ? new Date().toISOString().slice(0, 10) : profile.lastDailyDate,
    };
    this.updateUserProfile(updatedProfile);

    // Sync to Leaderboards
    this.recordScoreToLeaderboards(updatedProfile, newAttempt.score);

    return { attempt: newAttempt, newAchievements: newlyUnlocked };
  }

  // --- LEADERBOARDS ---
  public getLeaderboard(timeframe: 'daily' | 'weekly' | 'allTime'): LeaderboardEntry[] {
    const key =
      timeframe === 'daily'
        ? STORAGE_KEYS.LEADERBOARD_DAILY
        : timeframe === 'weekly'
        ? STORAGE_KEYS.LEADERBOARD_WEEKLY
        : STORAGE_KEYS.LEADERBOARD_ALLTIME;

    try {
      const raw = localStorage.getItem(key);
      const list: LeaderboardEntry[] = raw ? JSON.parse(raw) : [];
      return list.sort((a, b) => b.score - a.score).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    } catch {
      return [];
    }
  }

  private recordScoreToLeaderboards(user: UserProfile, quizScore: number) {
    const timeframes: ('daily' | 'weekly' | 'allTime')[] = ['daily', 'weekly', 'allTime'];

    timeframes.forEach((tf) => {
      const key =
        tf === 'daily'
          ? STORAGE_KEYS.LEADERBOARD_DAILY
          : tf === 'weekly'
          ? STORAGE_KEYS.LEADERBOARD_WEEKLY
          : STORAGE_KEYS.LEADERBOARD_ALLTIME;

      const raw = localStorage.getItem(key);
      let list: LeaderboardEntry[] = raw ? JSON.parse(raw) : [];
      const userIndex = list.findIndex((e) => e.username === user.username);

      const additionalScore = tf === 'allTime' ? user.totalPoints : quizScore;

      if (userIndex >= 0) {
        list[userIndex] = {
          ...list[userIndex],
          avatar: user.avatar,
          score: tf === 'allTime' ? user.totalPoints : list[userIndex].score + additionalScore,
          bestStreak: Math.max(list[userIndex].bestStreak, user.bestStreak),
          quizzesCompleted: tf === 'allTime' ? user.totalQuizzes : list[userIndex].quizzesCompleted + 1,
        };
      } else {
        list.push({
          id: `entry_${Date.now()}_${tf}`,
          rank: 0,
          username: user.username,
          avatar: user.avatar,
          score: tf === 'allTime' ? user.totalPoints : quizScore,
          bestStreak: user.bestStreak,
          quizzesCompleted: tf === 'allTime' ? user.totalQuizzes : 1,
          timeframe: tf,
        });
      }

      list.sort((a, b) => b.score - a.score);
      list = list.slice(0, 50).map((entry, idx) => ({ ...entry, rank: idx + 1 }));
      localStorage.setItem(key, JSON.stringify(list));
    });
  }

  // --- DAILY CHALLENGE ---
  public getDailyChallengeQuestions(): Question[] {
    const all = this.getQuestions();
    const todayStr = new Date().toISOString().slice(0, 10);
    // Simple deterministic hash based on date string
    let seed = 0;
    for (let i = 0; i < todayStr.length; i++) {
      seed = (seed * 31 + todayStr.charCodeAt(i)) % 1000000;
    }

    // Pseudo-random selection of 10 balanced questions
    const shuffled = [...all].sort((a, b) => {
      const hashA = (a.id.charCodeAt(0) * seed) % 97;
      const hashB = (b.id.charCodeAt(0) * seed) % 97;
      return hashA - hashB;
    });

    return shuffled.slice(0, 10);
  }

  public isDailyCompletedToday(): boolean {
    const user = this.getUserProfile();
    const todayStr = new Date().toISOString().slice(0, 10);
    return user.lastDailyDate === todayStr;
  }

  // --- ADMIN & STATS ---
  public getStats() {
    const questions = this.getQuestions();
    const categories = this.getCategories();
    const history = this.getQuizHistory();
    const user = this.getUserProfile();

    const totalQuizzes = history.length;
    const avgAccuracy =
      totalQuizzes > 0
        ? Math.round(history.reduce((acc, h) => acc + h.accuracy, 0) / totalQuizzes)
        : 0;

    return {
      totalQuestions: questions.length,
      totalCategories: categories.length,
      totalAttempts: totalQuizzes,
      averageAccuracy: avgAccuracy,
      userTotalPoints: user.totalPoints,
      unlockedAchievementsCount: user.unlockedAchievements.length,
    };
  }
}

export const db = Database.getInstance();
