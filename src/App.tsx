/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Achievement,
  CategoryInfo,
  Difficulty,
  LeaderboardEntry,
  Question,
  QuizAttempt,
  QuizAttemptAnswer,
  UserProfile,
} from './types';
import { db } from './db/storage';
import { sound } from './utils/sound';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CategoriesView } from './components/CategoriesView';
import { QuizView } from './components/QuizView';
import { ResultsView } from './components/ResultsView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('geo_giant_theme_dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sound mute state
  const [soundMuted, setSoundMuted] = useState<boolean>(() => sound.isMuted());

  // Database State
  const [user, setUser] = useState<UserProfile>(() => db.getUserProfile());
  const [categories, setCategories] = useState<CategoryInfo[]>(() => db.getCategories());
  const [questions, setQuestions] = useState<Question[]>(() => db.getQuestions());
  const [history, setHistory] = useState<QuizAttempt[]>(() => db.getQuizHistory());
  const [isDailyDoneToday, setIsDailyDoneToday] = useState<boolean>(() => db.isDailyCompletedToday());

  // Leaderboard states
  const [dailyLeaderboard, setDailyLeaderboard] = useState<LeaderboardEntry[]>(() => db.getLeaderboard('daily'));
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>(() => db.getLeaderboard('weekly'));
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState<LeaderboardEntry[]>(() => db.getLeaderboard('allTime'));

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<{
    categoryTitle: string;
    categoryId: string;
    difficulty: Difficulty;
    questions: Question[];
    isDaily: boolean;
  } | null>(null);

  // Active Results State
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<Achievement[]>([]);

  // Apply Dark Mode Class to HTML document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('geo_giant_theme_dark', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    sound.playClick();
    setDarkMode((prev) => !prev);
  };

  const toggleSound = () => {
    const isMutedNow = sound.toggleMute();
    setSoundMuted(isMutedNow);
  };

  const refreshAppData = () => {
    setUser(db.getUserProfile());
    setCategories(db.getCategories());
    setQuestions(db.getQuestions());
    setHistory(db.getQuizHistory());
    setIsDailyDoneToday(db.isDailyCompletedToday());
    setDailyLeaderboard(db.getLeaderboard('daily'));
    setWeeklyLeaderboard(db.getLeaderboard('weekly'));
    setAllTimeLeaderboard(db.getLeaderboard('allTime'));
  };

  // --- QUIZ LAUNCHERS ---
  const startQuiz = (categoryId: string, difficulty: Difficulty, questionCount: number = 10) => {
    let pool = db.getQuestionsByCategory(categoryId, difficulty);
    // If not enough questions for exact difficulty, relax difficulty filter
    if (pool.length < questionCount) {
      pool = db.getQuestionsByCategory(categoryId);
    }
    // If still not enough, grab from all
    if (pool.length === 0) {
      pool = db.getQuestions();
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, questionCount);

    const categoryObj = categories.find((c) => c.id === categoryId);
    const categoryTitle = categoryObj ? categoryObj.name : 'World Geography';

    setActiveQuiz({
      categoryTitle,
      categoryId,
      difficulty,
      questions: selectedQuestions,
      isDaily: false,
    });
    setCurrentTab('quiz');
  };

  const startDailyChallenge = () => {
    const dailyQuestions = db.getDailyChallengeQuestions();
    setActiveQuiz({
      categoryTitle: 'Daily Geography Challenge',
      categoryId: 'daily',
      difficulty: 'medium',
      questions: dailyQuestions,
      isDaily: true,
    });
    setCurrentTab('quiz');
  };

  const startRandomQuiz = (difficulty: Difficulty = 'medium') => {
    const all = db.getQuestions();
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    setActiveQuiz({
      categoryTitle: 'Random World Geography Mix',
      categoryId: 'world_geography',
      difficulty,
      questions: shuffled.slice(0, 10),
      isDaily: false,
    });
    setCurrentTab('quiz');
  };

  const startSpeedChallenge = () => {
    const all = db.getQuestions();
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    setActiveQuiz({
      categoryTitle: 'Timed Speed Challenge',
      categoryId: 'speed',
      difficulty: 'hard',
      questions: shuffled.slice(0, 10),
      isDaily: false,
    });
    setCurrentTab('quiz');
  };

  // --- FINISH QUIZ ---
  const handleFinishQuiz = (
    answers: QuizAttemptAnswer[],
    totalScore: number,
    baseScore: number,
    speedBonus: number,
    streakBonus: number,
    bestStreak: number,
    timeSpentSeconds: number
  ) => {
    if (!activeQuiz) return;

    const correctCount = answers.filter((a) => a.isCorrect).length;
    const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

    const { attempt, newAchievements } = db.recordQuizAttempt({
      userId: user.id,
      categoryId: activeQuiz.categoryId,
      categoryName: activeQuiz.categoryTitle,
      difficulty: activeQuiz.difficulty,
      score: totalScore,
      baseScore,
      speedBonus,
      streakBonus,
      correctCount,
      totalQuestions: answers.length,
      accuracy,
      bestStreak,
      timeSpentSeconds,
      date: new Date().toISOString(),
      isDailyChallenge: activeQuiz.isDaily,
      answers,
    });

    setLatestAttempt(attempt);
    setNewlyUnlockedAchievements(newAchievements);
    refreshAppData();
    setCurrentTab('results');
  };

  const handleUpdateUserProfile = (updates: Partial<UserProfile>) => {
    const updated = db.updateUserProfile(updates);
    setUser(updated);
    refreshAppData();
  };

  // Admin Question handlers
  const handleAddQuestion = (q: Omit<Question, 'id'>) => {
    db.addQuestion(q);
    refreshAppData();
  };

  const handleUpdateQuestion = (id: string, q: Partial<Question>) => {
    db.updateQuestion(id, q);
    refreshAppData();
  };

  const handleDeleteQuestion = (id: string) => {
    db.deleteQuestion(id);
    refreshAppData();
  };

  const handleResetQuestions = () => {
    db.resetQuestions();
    refreshAppData();
  };

  const handleAddCategory = (cat: Omit<CategoryInfo, 'totalQuestions'>) => {
    db.addCategory(cat);
    refreshAppData();
  };

  // Category mastery mapping
  const masteryMap: Record<string, { totalAnswered: number; correctCount: number; accuracy: number }> = {};
  history.forEach((h) => {
    if (!masteryMap[h.categoryId]) {
      masteryMap[h.categoryId] = { totalAnswered: 0, correctCount: 0, accuracy: 0 };
    }
    masteryMap[h.categoryId].totalAnswered += h.totalQuestions;
    masteryMap[h.categoryId].correctCount += h.correctCount;
  });
  Object.values(masteryMap).forEach((m) => {
    if (m.totalAnswered > 0) {
      m.accuracy = Math.round((m.correctCount / m.totalAnswered) * 100);
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'daily') {
            startDailyChallenge();
          } else {
            setCurrentTab(tab);
          }
        }}
        user={user}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        soundMuted={soundMuted}
        onToggleSound={toggleSound}
        isDailyDoneToday={isDailyDoneToday}
      />

      {/* Main View Container */}
      <main className="flex-1 pb-20 md:pb-12">
        {currentTab === 'home' && (
          <HomeView
            user={user}
            categories={categories}
            isDailyDoneToday={isDailyDoneToday}
            onSelectTab={setCurrentTab}
            onStartQuiz={startQuiz}
            onStartDailyChallenge={startDailyChallenge}
            onStartRandomQuiz={startRandomQuiz}
            onStartSpeedChallenge={startSpeedChallenge}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesView
            categories={categories}
            masteryMap={masteryMap}
            onStartQuiz={startQuiz}
          />
        )}

        {currentTab === 'quiz' && activeQuiz && (
          <QuizView
            categoryTitle={activeQuiz.categoryTitle}
            categoryId={activeQuiz.categoryId}
            difficulty={activeQuiz.difficulty}
            questions={activeQuiz.questions}
            isDaily={activeQuiz.isDaily}
            onFinishQuiz={handleFinishQuiz}
            onCancelQuiz={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'results' && latestAttempt && (
          <ResultsView
            attempt={latestAttempt}
            newAchievements={newlyUnlockedAchievements}
            onPlayAgain={() => {
              if (activeQuiz) {
                startQuiz(activeQuiz.categoryId, activeQuiz.difficulty, activeQuiz.questions.length);
              } else {
                startRandomQuiz('medium');
              }
            }}
            onTryAnotherCategory={() => setCurrentTab('categories')}
            onViewLeaderboard={() => setCurrentTab('leaderboard')}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView
            dailyLeaderboard={dailyLeaderboard}
            weeklyLeaderboard={weeklyLeaderboard}
            allTimeLeaderboard={allTimeLeaderboard}
            currentUsername={user.username}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            categories={categories}
            history={history}
            onUpdateUser={handleUpdateUserProfile}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPanel
            questions={questions}
            categories={categories}
            stats={db.getStats()}
            onAddQuestion={handleAddQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onResetQuestions={handleResetQuestions}
            onAddCategory={handleAddCategory}
          />
        )}
      </main>

      {/* Clean quiet educational footer */}
      <footer className="hidden md:block border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-800 dark:text-slate-200">Geo Giant</span>
            <span aria-hidden="true">·</span>
            <span>Educational Geography Quiz & Cartographic Explorer</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>16 Categories</span>
            <span aria-hidden="true">·</span>
            <span>4 Difficulty Tiers</span>
            <span aria-hidden="true">·</span>
            <span>Daily Challenges</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
