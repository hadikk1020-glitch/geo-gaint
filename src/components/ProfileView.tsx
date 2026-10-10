import React, { useState } from 'react';
import {
  User,
  Award,
  Flame,
  Target,
  Trophy,
  History,
  CheckCircle,
  Sparkles,
  Edit2,
  Check,
  Compass,
  Zap,
  Globe,
  Flag,
  Building2,
  Calendar,
  Crown,
  Coins,
} from 'lucide-react';
import { Achievement, CategoryInfo, QuizAttempt, UserProfile } from '../types';
import { ACHIEVEMENTS_LIST } from '../db/storage';
import { sound } from '../utils/sound';

interface ProfileViewProps {
  user: UserProfile;
  categories: CategoryInfo[];
  history: QuizAttempt[];
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

const AVATAR_OPTIONS = [
  'Globe Trotter',
  'The Pathfinder',
  'The Cartographer',
  'The Deep Diver',
  'The Alpinist',
  'The Stargazer',
  'The Island Hopper',
  'The Archaeologist',
];

const BADGE_ICONS: Record<string, React.ReactNode> = {
  ach_beginner: <Compass className="w-5 h-5 text-emerald-500" />,
  ach_flags: <Flag className="w-5 h-5 text-red-500" />,
  ach_capitals: <Building2 className="w-5 h-5 text-blue-500" />,
  ach_explorer: <Globe className="w-5 h-5 text-teal-500" />,
  ach_perfect: <Award className="w-5 h-5 text-amber-500" />,
  ach_streak10: <Flame className="w-5 h-5 text-orange-500" />,
  ach_points1000: <Coins className="w-5 h-5 text-yellow-500" />,
  ach_giant: <Crown className="w-5 h-5 text-purple-500" />,
  ach_daily: <Calendar className="w-5 h-5 text-cyan-500" />,
  ach_speed: <Zap className="w-5 h-5 text-indigo-500" />,
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  categories,
  history,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.username);
  const [editAvatar, setEditAvatar] = useState(user.avatar);

  const handleSaveProfile = () => {
    sound.playClick();
    onUpdateUser({
      username: editName.trim() || 'Student Explorer',
      avatar: editAvatar,
    });
    setIsEditing(false);
  };

  // Category accuracy calculations
  const categoryMastery: Record<string, { name: string; total: number; correct: number; pct: number }> = {};
  categories.forEach((c) => {
    categoryMastery[c.id] = { name: c.name, total: 0, correct: 0, pct: 0 };
  });

  history.forEach((h) => {
    if (categoryMastery[h.categoryId]) {
      categoryMastery[h.categoryId].total += h.totalQuestions;
      categoryMastery[h.categoryId].correct += h.correctCount;
    }
  });

  Object.values(categoryMastery).forEach((m) => {
    if (m.total > 0) {
      m.pct = Math.round((m.correct / m.total) * 100);
    }
  });

  const activeMastery = Object.values(categoryMastery).filter((m) => m.total > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Profile Overview Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 transition-colors">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg shadow-emerald-500/20">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {user.username}
                </h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{user.avatar}</span>
                <span aria-hidden="true">·</span>
                <span>Fav: {user.favoriteCategory}</span>
                <span aria-hidden="true">·</span>
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400">Career Points</div>
              <div className="font-mono-num text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {user.totalPoints.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Drawer / Form */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Explorer Username
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={24}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Explorer Persona / Archetype
                </label>
                <select
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white cursor-pointer"
                >
                  {AVATAR_OPTIONS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-sm"
              >
                Save Profile
              </button>
            </div>
          </div>
        )}

        {/* 4 Core Statistics Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Quizzes</div>
            <div className="font-mono-num text-2xl font-bold text-slate-900 dark:text-white">
              {user.totalQuizzes}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{user.totalAnswered} questions taken</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Global Accuracy</div>
            <div className="font-mono-num text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {user.accuracy}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{user.totalCorrect} correct answers</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Best Streak</div>
            <div className="font-mono-num text-2xl font-bold text-orange-500 flex items-center gap-1">
              <Flame className="w-5 h-5" />
              <span>{user.bestStreak}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">consecutive correct</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Badges Unlocked</div>
            <div className="font-mono-num text-2xl font-bold text-amber-500 flex items-center gap-1">
              <Award className="w-5 h-5" />
              <span>{user.unlockedAchievements.length}</span>
              <span className="text-sm font-normal text-slate-400">/ {ACHIEVEMENTS_LIST.length}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Honorary medals</div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Achievements Grid (2 cols wide) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Achievements / Badges Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  Expedition Badges
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Earn all 10 badges by demonstrating geographic mastery across categories.
                </p>
              </div>
              <span className="text-xs font-mono-num font-semibold text-emerald-600 dark:text-emerald-400">
                {user.unlockedAchievements.length} / {ACHIEVEMENTS_LIST.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {ACHIEVEMENTS_LIST.map((ach) => {
                const isUnlocked = user.unlockedAchievements.includes(ach.id);
                const iconNode = BADGE_ICONS[ach.id] || <Award className="w-5 h-5 text-amber-500" />;

                return (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isUnlocked
                        ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 shadow-xs'
                        : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? 'bg-white dark:bg-slate-800 shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 grayscale'
                      }`}
                    >
                      {iconNode}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {ach.title}
                        </span>
                        {isUnlocked && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Quiz History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
              Recent Quizzes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Review your latest expedition rounds and performance records.
            </p>

            {history.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-400">
                You haven't played any quizzes yet. Start a quiz now to record your adventures!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.slice(0, 8).map((attempt) => (
                  <div key={attempt.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span>{attempt.categoryName}</span>
                        <span className="text-xs text-slate-400 font-normal capitalize">
                          ({attempt.difficulty})
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {new Date(attempt.date).toLocaleDateString()} · {attempt.correctCount}/{attempt.totalQuestions} correct
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono-num text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        +{attempt.score} pts
                      </div>
                      <div className="text-xs font-mono-num text-slate-400">
                        {attempt.accuracy}% acc
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Category Mastery Breakdown */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
              Category Mastery
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Your overall accuracy breakdown by topic.
            </p>

            {activeMastery.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                Play quizzes across various categories to build your personal mastery map!
              </div>
            ) : (
              <div className="space-y-4">
                {activeMastery.map((m) => (
                  <div key={m.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
                        {m.name}
                      </span>
                      <span className="font-mono-num font-semibold text-slate-800 dark:text-slate-200">
                        {m.pct}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${m.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
