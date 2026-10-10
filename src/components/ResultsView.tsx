import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  LayoutGrid,
  Share2,
  ArrowRight,
  Flame,
  Clock,
  Zap,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Achievement, QuizAttempt } from '../types';
import { sound } from '../utils/sound';

interface ResultsViewProps {
  attempt: QuizAttempt;
  newAchievements: Achievement[];
  onPlayAgain: () => void;
  onTryAnotherCategory: () => void;
  onViewLeaderboard: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  attempt,
  newAchievements,
  onPlayAgain,
  onTryAnotherCategory,
  onViewLeaderboard,
}) => {
  useEffect(() => {
    // Play victory fanfare
    sound.playFanfare();

    // Trigger confetti if accuracy >= 70%
    if (attempt.accuracy >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'],
        });
      } catch {
        // Fallback
      }
    }
  }, [attempt.accuracy]);

  // Performance message
  const getPerformanceMessage = (acc: number) => {
    if (acc === 100) return { title: 'Legendary Master Geographer!', grade: 'S+', color: 'text-amber-500', desc: 'Flawless execution! You navigated every single question with absolute world-class accuracy.' };
    if (acc >= 90) return { title: 'Grand Navigator!', grade: 'A+', color: 'text-emerald-500', desc: 'Outstanding knowledge! You are well on your way to becoming a true Geo Giant.' };
    if (acc >= 75) return { title: 'Skilled Expedition Leader', grade: 'A', color: 'text-teal-500', desc: 'Great job! Strong geographic insight across the globe.' };
    if (acc >= 60) return { title: 'Avid Cartographer', grade: 'B', color: 'text-blue-500', desc: 'Good effort! A little more study will make your geographical knowledge unbeatable.' };
    return { title: 'Curious Explorer', grade: 'C', color: 'text-orange-500', desc: 'Every grand journey begins with a first step. Review your questions below and try again!' };
  };

  const perf = getPerformanceMessage(attempt.accuracy);
  const minutes = Math.floor(attempt.timeSpentSeconds / 60);
  const seconds = attempt.timeSpentSeconds % 60;
  const timeFormatted = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      
      {/* Newly Unlocked Achievements Banner */}
      {newAchievements.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/40 rounded-2xl p-5 text-center shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>New Achievement Unlocked!</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            {newAchievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 shadow-sm"
              >
                <Award className="w-5 h-5 text-amber-500" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{ach.title}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{ach.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Results Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm transition-colors text-center">
        
        {/* Category and Mode metadata */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>{attempt.categoryName}</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{attempt.difficulty} Level</span>
          {attempt.isDailyChallenge && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-500 font-semibold">Daily Challenge</span>
            </>
          )}
        </div>

        {/* Grade & Title */}
        <div className="inline-block px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold mb-2 text-slate-600 dark:text-slate-300">
          Rank Grade: <span className={perf.color}>{perf.grade}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {perf.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8">
          {perf.desc}
        </p>

        {/* Big Total Score Tally */}
        <div className="relative inline-flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/60 mb-8 min-w-[240px]">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            Total Points Earned
          </span>
          <span className="font-mono-num text-4xl sm:text-6xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {attempt.score.toLocaleString()}
          </span>

          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Base: {attempt.baseScore}</span>
            <span>·</span>
            <span>Speed: +{attempt.speedBonus}</span>
            {attempt.streakBonus > 0 && (
              <>
                <span>·</span>
                <span className="text-orange-500 font-semibold">Streak: +{attempt.streakBonus}</span>
              </>
            )}
          </div>
        </div>

        {/* Metrics Grid: 4 Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mb-10">
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Accuracy</div>
            <div className="font-mono-num text-2xl font-bold text-slate-900 dark:text-white">
              {attempt.accuracy}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {attempt.correctCount} / {attempt.totalQuestions} correct
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Correct / Wrong</div>
            <div className="font-mono-num text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {attempt.correctCount}
              <span className="text-slate-400 font-normal text-base"> / </span>
              <span className="text-red-500 text-lg">
                {attempt.totalQuestions - attempt.correctCount}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Total answers
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Best Streak</div>
            <div className="font-mono-num text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5" />
              <span>{attempt.bestStreak}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              In a row
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Time Taken</div>
            <div className="font-mono-num text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{timeFormatted}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Avg {(attempt.timeSpentSeconds / attempt.totalQuestions).toFixed(1)}s / Q
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onTryAnotherCategory();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-xl transition-all cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Try Another Category</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onViewLeaderboard();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>View Leaderboard</span>
          </button>
        </div>

        {/* Detailed Question Review Section */}
        <div className="text-left border-t border-slate-100 dark:border-slate-800 pt-8">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">
            Question Review & Geography Insights
          </h3>

          <div className="space-y-3">
            {attempt.answers.map((ans, idx) => (
              <div
                key={ans.questionId + idx}
                className={`p-4 rounded-2xl border transition-colors ${
                  ans.isCorrect
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40'
                    : 'bg-red-50/40 dark:bg-red-950/20 border-red-200/60 dark:border-red-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono-num text-xs font-bold text-slate-400 mt-0.5">
                      #{idx + 1}
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100">
                      {ans.question}
                    </p>
                  </div>

                  <span className="shrink-0 mt-0.5">
                    {ans.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2 pl-6">
                  <div>
                    <span className="text-slate-400">Your Answer: </span>
                    <span
                      className={`font-semibold ${
                        ans.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {ans.selected}
                    </span>
                  </div>
                  {!ans.isCorrect && (
                    <div>
                      <span className="text-slate-400">Correct Answer: </span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                        {ans.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pl-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/40 dark:border-slate-700/40 pt-2 mt-2">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Insight: </span>
                  {ans.explanation}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
