import React, { useState } from 'react';
import {
  Compass,
  Play,
  Calendar,
  LayoutGrid,
  Trophy,
  User,
  Flame,
  Zap,
  Sparkles,
  ArrowRight,
  Globe2,
  Clock,
  Shuffle,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { CategoryInfo, Difficulty, UserProfile } from '../types';
import { InteractiveWorldMap } from './InteractiveWorldMap';
import { sound } from '../utils/sound';

// Generated visual assets with fallback containers
import heroGlobeImg from '../assets/images/hero_world_map_globe_1791097414315.jpg';
import landmarksImg from '../assets/images/landmarks_montage_1791097428520.jpg';
import trophyImg from '../assets/images/trophy_geography_giant_1791097439818.jpg';
import dailyBannerImg from '../assets/images/daily_challenge_banner_1791097450549.jpg';

interface HomeViewProps {
  user: UserProfile;
  categories: CategoryInfo[];
  isDailyDoneToday: boolean;
  onSelectTab: (tab: string) => void;
  onStartQuiz: (categoryId: string, difficulty: Difficulty, questionCount: number) => void;
  onStartDailyChallenge: () => void;
  onStartRandomQuiz: (difficulty: Difficulty) => void;
  onStartSpeedChallenge: () => void;
}

const GEOGRAPHY_FACTS = [
  'Mount Everest grows by approximately 4 millimeters each year due to tectonic compression between the Indian and Eurasian plates.',
  'Canada has more natural freshwater lakes than all other countries in the world combined.',
  'Russia spans 11 time zones; when it is 7:00 AM on Monday in Kaliningrad, it is 5:00 PM on Monday in Kamchatka.',
  'The Atacama Desert in Chile is so arid that scientists use it to simulate Mars exploration rovers.',
  'The Kingdom of Lesotho in southern Africa is the only sovereign state in the world whose entire territory lies above 1,000 meters in altitude.',
  'Vatican City can fit inside New York City’s Central Park almost 8 times over.',
];

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  categories,
  isDailyDoneToday,
  onSelectTab,
  onStartQuiz,
  onStartDailyChallenge,
  onStartRandomQuiz,
  onStartSpeedChallenge,
}) => {
  const [factIndex, setFactIndex] = useState(0);

  const rotateFact = () => {
    sound.playClick();
    setFactIndex((prev) => (prev + 1) % GEOGRAPHY_FACTS.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-xl">
        
        {/* Background Image with Gradient Scrim */}
        <div className="absolute inset-0">
          <img
            src={heroGlobeImg}
            alt="Geo Giant World Map & Globe"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/60" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
          
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-3 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive World Geography Platform</span>
            <span className="text-slate-600">·</span>
            <span>Created for Students</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4 text-balance">
            Master the World with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Geo Giant</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl text-balance">
            Embark on a voyage across countries, flags, capitals, mountain ranges, and world wonders. Sharpen your global knowledge, earn explorer badges, and climb the student leaderboards.
          </p>

          {/* Primary Quick CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                sound.playClick();
                onStartRandomQuiz('medium');
              }}
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/30 transition-all hover:scale-102 active:scale-98 text-base cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Play Quiz Now</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onStartDailyChallenge();
              }}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 border border-amber-500/40 font-semibold rounded-2xl transition-all hover:scale-102 active:scale-98 text-sm sm:text-base cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Daily Challenge</span>
              {!isDailyDoneToday && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold">
                  NEW
                </span>
              )}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('categories');
              }}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl backdrop-blur-md transition-all text-sm sm:text-base cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-slate-300" />
              <span>Browse Categories</span>
            </button>
          </div>

        </div>

        {/* Motivational Fact Ribbon at bottom of Hero */}
        <div className="relative z-10 px-6 sm:px-10 py-3.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300 truncate">
            <span className="font-bold text-amber-400 shrink-0">Geographic Curiosity:</span>
            <span className="truncate">{GEOGRAPHY_FACTS[factIndex]}</span>
          </div>
          <button
            onClick={rotateFact}
            className="text-emerald-400 hover:text-emerald-300 font-semibold shrink-0 cursor-pointer flex items-center gap-1"
          >
            <span>Next Fact</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main 5 Navigation Cards: Play, Daily, Categories, Leaderboard, Progress */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* 1. Play Quiz */}
        <button
          onClick={() => {
            sound.playClick();
            onStartRandomQuiz('medium');
          }}
          className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Quick Match</div>
            <div className="font-display text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Play Quiz
            </div>
            <div className="text-xs text-slate-500 mt-1">Random world mix</div>
          </div>
        </button>

        {/* 2. Daily Challenge */}
        <button
          onClick={() => {
            sound.playClick();
            onStartDailyChallenge();
          }}
          className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              {isDailyDoneToday ? 'Completed' : 'Today’s Round'}
            </div>
            <div className="font-display text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Daily Challenge
            </div>
            <div className="text-xs text-slate-500 mt-1">10 Curated questions</div>
          </div>
        </button>

        {/* 3. Categories */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('categories');
          }}
          className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
        >
          <div className="w-11 h-11 rounded-2xl bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Curriculum</div>
            <div className="font-display text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Categories
            </div>
            <div className="text-xs text-slate-500 mt-1">16 Topic domains</div>
          </div>
        </button>

        {/* 4. Leaderboard */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('leaderboard');
          }}
          className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Ranks & Podium</div>
            <div className="font-display text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Leaderboard
            </div>
            <div className="text-xs text-slate-500 mt-1">Daily & all-time</div>
          </div>
        </button>

        {/* 5. My Progress */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('profile');
          }}
          className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between col-span-2 sm:col-span-1"
        >
          <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Stats & Medals</div>
            <div className="font-display text-base font-bold text-slate-900 dark:text-white mt-0.5">
              My Progress
            </div>
            <div className="text-xs text-slate-500 mt-1">{user.unlockedAchievements.length} Badges won</div>
          </div>
        </button>

      </div>

      {/* User Stats / Streak Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 border border-emerald-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Explorer {user.username}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-300">
                {user.avatar}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Keep answering correctly to build your expedition streak multiplier!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 divide-x divide-slate-200 dark:divide-slate-700">
          <div className="text-left">
            <div className="text-xs text-slate-400">Total Points</div>
            <div className="font-mono-num text-2xl font-bold text-slate-900 dark:text-white">
              {user.totalPoints.toLocaleString()}
            </div>
          </div>

          <div className="pl-6 text-left">
            <div className="text-xs text-slate-400">Accuracy</div>
            <div className="font-mono-num text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {user.accuracy}%
            </div>
          </div>

          <div className="pl-6 text-left">
            <div className="text-xs text-slate-400">Best Streak</div>
            <div className="font-mono-num text-2xl font-bold text-orange-500 flex items-center gap-1">
              <Flame className="w-5 h-5" />
              <span>{user.bestStreak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive World Map Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Interactive World Map Visual
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any continent or glowing landmark pin to launch an instant regional expedition.
            </p>
          </div>
        </div>

        <InteractiveWorldMap
          onStartContinentQuiz={(categoryId) => onStartQuiz(categoryId, 'medium', 10)}
        />
      </div>

      {/* Featured Game Modes: Daily Challenge, Random Blitz, Landmark Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Daily Challenge Showcase */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
          <div className="h-36 rounded-2xl overflow-hidden mb-4 relative bg-slate-800">
            <img
              src={dailyBannerImg}
              alt="Daily Challenge Study"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Refreshes Every 24 Hours</span>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
              Daily Geography Challenge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Every day brings 10 specially selected questions across all continents. Complete today’s challenge to claim the Daily Explorer badge!
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onStartDailyChallenge();
            }}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isDailyDoneToday ? 'Replay Today’s Challenge' : 'Play Daily Challenge'}</span>
          </button>
        </div>

        {/* Card 2: Famous Landmarks & Natural Wonders */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
          <div className="h-36 rounded-2xl overflow-hidden mb-4 relative bg-slate-800">
            <img
              src={landmarksImg}
              alt="Famous World Landmarks"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Wonders & Peaks</span>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
              Landmarks & Monuments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              From Petra and the Pyramids to Machu Picchu and the Colosseum, journey through historical treasures.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onStartQuiz('landmarks', 'medium', 10);
            }}
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Landmarks Quiz</span>
          </button>
        </div>

        {/* Card 3: Speed Blitz Challenge */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
          <div className="h-36 rounded-2xl overflow-hidden mb-4 relative bg-slate-800 flex items-center justify-center">
            <img
              src={trophyImg}
              alt="Geography Giant Trophy"
              referrerPolicy="no-referrer"
              className="w-32 h-32 object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>High-Intensity Speed Run</span>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
              Timed Speed Challenge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Only 10 seconds per question with maximum speed points! Test your lightning geographic instincts under pressure.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onStartSpeedChallenge();
            }}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Start Speed Challenge</span>
          </button>
        </div>

      </div>

    </div>
  );
};
