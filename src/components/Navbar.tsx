import React from 'react';
import {
  Compass,
  Trophy,
  Flame,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  LayoutGrid,
  User,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';
import { sound } from '../utils/sound';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  isDailyDoneToday: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  darkMode,
  onToggleDarkMode,
  soundMuted,
  onToggleSound,
  isDailyDoneToday,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element Brand Zone */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('home');
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Geo Giant
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('home');
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'home'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('categories');
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'categories'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Categories
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('daily');
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'daily'
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Daily Challenge</span>
            {!isDailyDoneToday && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('leaderboard');
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'leaderboard'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 text-emerald-500" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('profile');
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'profile'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>My Progress</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('admin');
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'admin'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/40 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
            <span className="font-mono-num">{user.bestStreak}</span>
            <span className="hidden lg:inline text-orange-500 font-normal">streak</span>
          </div>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            title={soundMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Sound"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Profile Quick Pill */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('profile');
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-emerald-500 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[90px]">
                {user.username}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-num leading-none">
                {user.totalPoints} pts
              </span>
            </div>
          </button>
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => { sound.playClick(); onSelectTab('home'); }}
          className={`flex flex-col items-center gap-0.5 text-xs ${currentTab === 'home' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Compass className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => { sound.playClick(); onSelectTab('categories'); }}
          className={`flex flex-col items-center gap-0.5 text-xs ${currentTab === 'categories' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Quizzes</span>
        </button>

        <button
          onClick={() => { sound.playClick(); onSelectTab('daily'); }}
          className={`flex flex-col items-center gap-0.5 text-xs relative ${currentTab === 'daily' ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Calendar className="w-5 h-5" />
          <span>Daily</span>
          {!isDailyDoneToday && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          onClick={() => { sound.playClick(); onSelectTab('leaderboard'); }}
          className={`flex flex-col items-center gap-0.5 text-xs ${currentTab === 'leaderboard' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Trophy className="w-5 h-5" />
          <span>Ranks</span>
        </button>

        <button
          onClick={() => { sound.playClick(); onSelectTab('profile'); }}
          className={`flex flex-col items-center gap-0.5 text-xs ${currentTab === 'profile' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => { sound.playClick(); onSelectTab('admin'); }}
          className={`flex flex-col items-center gap-0.5 text-xs ${currentTab === 'admin' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
