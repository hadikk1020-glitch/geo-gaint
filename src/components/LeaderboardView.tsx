import React, { useState } from 'react';
import { Trophy, Medal, Flame, Calendar, Award, Crown } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { sound } from '../utils/sound';

interface LeaderboardViewProps {
  dailyLeaderboard: LeaderboardEntry[];
  weeklyLeaderboard: LeaderboardEntry[];
  allTimeLeaderboard: LeaderboardEntry[];
  currentUsername: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  dailyLeaderboard,
  weeklyLeaderboard,
  allTimeLeaderboard,
  currentUsername,
}) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'allTime'>('allTime');

  const currentList =
    timeframe === 'daily'
      ? dailyLeaderboard
      : timeframe === 'weekly'
      ? weeklyLeaderboard
      : allTimeLeaderboard;

  const top3 = currentList.slice(0, 3);
  const remaining = currentList.slice(3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
          <Crown className="w-4 h-4 fill-amber-500" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-300/30 text-slate-500 flex items-center justify-center font-bold">
          <Medal className="w-4 h-4" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-700 flex items-center justify-center font-bold">
          <Medal className="w-4 h-4" />
        </div>
      );
    }
    return (
      <span className="font-mono-num text-sm font-semibold text-slate-400 w-8 text-center">
        #{rank}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <span>Global Geographer Hall of Fame</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Student Ranks</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
            See how your geographic accuracy and expedition streaks stack up against fellow students worldwide.
          </p>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => { sound.playClick(); setTimeframe('daily'); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              timeframe === 'daily'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => { sound.playClick(); setTimeframe('weekly'); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              timeframe === 'weekly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => { sound.playClick(); setTimeframe('allTime'); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              timeframe === 'allTime'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <div className="order-2 md:order-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center shadow-sm relative flex flex-col items-center justify-between">
              <div className="absolute top-4 right-4 text-xs font-bold text-slate-400">#2</div>
              <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-slate-300 mb-3 border-2 border-slate-300 dark:border-slate-700">
                {top3[1].username.charAt(0)}
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white truncate max-w-[200px]">
                {top3[1].username}
              </h3>
              <p className="text-xs text-slate-400 mb-3">{top3[1].avatar}</p>
              <div className="font-mono-num text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                {top3[1].score.toLocaleString()} <span className="text-xs font-normal">pts</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-orange-500 font-medium">
                  <Flame className="w-3.5 h-3.5" />
                  {top3[1].bestStreak} streak
                </span>
                <span>·</span>
                <span>{top3[1].quizzesCompleted} quizzes</span>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {top3[0] && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 border-2 border-amber-400/80 dark:border-amber-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-md relative flex flex-col items-center justify-between">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center absolute -top-4 font-bold shadow-md">
                <Crown className="w-4 h-4 fill-current" />
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-2xl font-black text-slate-900 mb-3 border-4 border-white dark:border-slate-900 shadow-md">
                {top3[0].username.charAt(0)}
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                {top3[0].username}
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-3">{top3[0].avatar}</p>
              <div className="font-mono-num text-3xl font-extrabold text-amber-600 dark:text-amber-400 mb-2">
                {top3[0].score.toLocaleString()} <span className="text-xs font-normal">pts</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-orange-500 font-medium">
                  <Flame className="w-3.5 h-3.5" />
                  {top3[0].bestStreak} streak
                </span>
                <span>·</span>
                <span>{top3[0].quizzesCompleted} quizzes</span>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <div className="order-3 md:order-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center shadow-sm relative flex flex-col items-center justify-between">
              <div className="absolute top-4 right-4 text-xs font-bold text-slate-400">#3</div>
              <div className="w-16 h-16 rounded-full bg-amber-900/10 dark:bg-amber-950/40 flex items-center justify-center text-xl font-bold text-amber-700 dark:text-amber-500 mb-3 border-2 border-amber-600/30">
                {top3[2].username.charAt(0)}
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white truncate max-w-[200px]">
                {top3[2].username}
              </h3>
              <p className="text-xs text-slate-400 mb-3">{top3[2].avatar}</p>
              <div className="font-mono-num text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                {top3[2].score.toLocaleString()} <span className="text-xs font-normal">pts</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-orange-500 font-medium">
                  <Flame className="w-3.5 h-3.5" />
                  {top3[2].bestStreak} streak
                </span>
                <span>·</span>
                <span>{top3[2].quizzesCompleted} quizzes</span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Ranks 4+ Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider grid grid-cols-12 gap-2">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5 sm:col-span-6">Student Explorer</div>
          <div className="col-span-3 sm:col-span-3 text-right">Points</div>
          <div className="col-span-3 sm:col-span-2 text-right">Streak</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {remaining.length === 0 && top3.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No entries recorded for this timeframe yet. Be the first to play!
            </div>
          ) : (
            remaining.map((entry) => {
              const isCurrentUser = entry.username === currentUsername;
              return (
                <div
                  key={entry.id}
                  className={`px-6 py-4 grid grid-cols-12 gap-2 items-center text-sm transition-colors ${
                    isCurrentUser
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 font-semibold'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="col-span-1 flex justify-center">
                    {getRankBadge(entry.rank)}
                  </div>

                  <div className="col-span-5 sm:col-span-6 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs shrink-0">
                      {entry.username.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="text-slate-900 dark:text-white truncate flex items-center gap-2">
                        <span>{entry.username}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-normal">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate">{entry.avatar}</div>
                    </div>
                  </div>

                  <div className="col-span-3 sm:col-span-3 text-right font-mono-num font-bold text-slate-900 dark:text-white">
                    {entry.score.toLocaleString()}
                  </div>

                  <div className="col-span-3 sm:col-span-2 text-right font-mono-num text-orange-500 flex items-center justify-end gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{entry.bestStreak}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
