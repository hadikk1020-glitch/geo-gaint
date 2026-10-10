import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Flame,
  Award,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  X,
  Volume2,
  Zap,
} from 'lucide-react';
import { Difficulty, Question, QuizAttemptAnswer } from '../types';
import { sound } from '../utils/sound';

interface QuizViewProps {
  categoryTitle: string;
  categoryId: string;
  difficulty: Difficulty;
  questions: Question[];
  isDaily?: boolean;
  onFinishQuiz: (
    answers: QuizAttemptAnswer[],
    totalScore: number,
    baseScore: number,
    speedBonus: number,
    streakBonus: number,
    bestStreak: number,
    timeSpentSeconds: number
  ) => void;
  onCancelQuiz: () => void;
}

const QUESTION_TIME_LIMIT = 20; // 20 seconds per question

export const QuizView: React.FC<QuizViewProps> = ({
  categoryTitle,
  categoryId,
  difficulty,
  questions,
  isDaily = false,
  onFinishQuiz,
  onCancelQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [answersRecord, setAnswersRecord] = useState<QuizAttemptAnswer[]>([]);
  const [runningScore, setRunningScore] = useState(0);
  const [baseScoreTotal, setBaseScoreTotal] = useState(0);
  const [speedBonusTotal, setSpeedBonusTotal] = useState(0);
  const [streakBonusTotal, setStreakBonusTotal] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [lastPointsEarned, setLastPointsEarned] = useState<{
    base: number;
    speed: number;
    streakMult: number;
    total: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = questions[currentIndex];

  // Shuffle options whenever the current question changes
  useEffect(() => {
    if (!currentQ) return;
    const opts = [...currentQ.options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    setShuffledOptions(opts);
    setSelectedOption(null);
    setHasAnswered(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setLastPointsEarned(null);
  }, [currentIndex, currentQ]);

  // Timer Countdown Effect
  useEffect(() => {
    if (hasAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        if (prev <= 4) {
          sound.playTimerTick();
        }
        return prev - 1;
      });
      setTotalTimeSpent((t) => t + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, hasAnswered]);

  // Clean up auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  const handleTimeOut = () => {
    if (hasAnswered || !currentQ) return;
    setHasAnswered(true);
    sound.playWrong();

    const record: QuizAttemptAnswer = {
      questionId: currentQ.id,
      question: currentQ.question,
      selected: 'Time expired',
      correctAnswer: currentQ.correctAnswer,
      isCorrect: false,
      explanation: currentQ.explanation,
      pointsEarned: 0,
      timeTakenSeconds: QUESTION_TIME_LIMIT,
    };

    setAnswersRecord((prev) => [...prev, record]);
    setCurrentStreak(0);

    // Auto advance after 3.5s
    autoAdvanceRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 3500);
  };

  const handleSelectOption = (option: string) => {
    if (hasAnswered || !currentQ) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setHasAnswered(true);
    setSelectedOption(option);

    const isCorrect = option === currentQ.correctAnswer;
    const timeTaken = QUESTION_TIME_LIMIT - timeLeft;

    let points = 0;
    let base = 0;
    let speed = 0;
    let streakMult = 1.0;

    if (isCorrect) {
      sound.playCorrect();

      // Base points based on difficulty
      base = currentQ.points || 100;

      // Speed bonus: up to +50 points
      speed = Math.round(timeLeft * 2.5);

      // Streak calculation
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }

      if (newStreak >= 8) {
        streakMult = 1.5;
        sound.playStreakBonus();
      } else if (newStreak >= 5) {
        streakMult = 1.25;
        sound.playStreakBonus();
      } else if (newStreak >= 3) {
        streakMult = 1.1;
      }

      points = Math.round((base + speed) * streakMult);

      setLastPointsEarned({
        base,
        speed,
        streakMult,
        total: points,
      });

      setRunningScore((s) => s + points);
      setBaseScoreTotal((b) => b + base);
      setSpeedBonusTotal((sb) => sb + speed);
      setStreakBonusTotal((stb) => stb + (points - (base + speed)));
    } else {
      sound.playWrong();
      setCurrentStreak(0);
      setLastPointsEarned(null);
    }

    const record: QuizAttemptAnswer = {
      questionId: currentQ.id,
      question: currentQ.question,
      selected: option,
      correctAnswer: currentQ.correctAnswer,
      isCorrect,
      explanation: currentQ.explanation,
      pointsEarned: points,
      timeTakenSeconds: timeTaken,
    };

    setAnswersRecord((prev) => [...prev, record]);

    // Auto advance after 3.2s
    autoAdvanceRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 3200);
  };

  const goToNextQuestion = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Finished all questions!
      onFinishQuiz(
        answersRecord,
        runningScore,
        baseScoreTotal,
        speedBonusTotal,
        streakBonusTotal,
        bestStreak,
        totalTimeSpent
      );
    }
  };

  if (!currentQ) {
    return (
      <div className="p-12 text-center text-slate-500">
        Loading questions...
      </div>
    );
  }

  // Keyboard shortcut support (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasAnswered) {
        if (e.key === 'Enter' || e.key === ' ') {
          goToNextQuestion();
        }
        return;
      }
      if (['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (shuffledOptions[index]) {
          handleSelectOption(shuffledOptions[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, shuffledOptions]);

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const timerPercent = (timeLeft / QUESTION_TIME_LIMIT) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm mb-6 transition-colors">
        
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {categoryTitle}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 capitalize">
              {difficulty}
            </span>
            {isDaily && (
              <>
                <span className="text-slate-400">·</span>
                <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                  Daily Challenge
                </span>
              </>
            )}
          </div>

          <button
            onClick={onCancelQuiz}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Exit Quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status bar: Question Count, Timer, Running Score & Streak */}
        <div className="grid grid-cols-3 items-center gap-4 py-2 border-y border-slate-100 dark:border-slate-800/80">
          
          {/* Question Counter */}
          <div className="text-left">
            <div className="text-xs text-slate-500 dark:text-slate-400">Progress</div>
            <div className="font-mono-num text-lg font-bold text-slate-800 dark:text-slate-100">
              {currentIndex + 1}
              <span className="text-sm font-normal text-slate-400"> / {questions.length}</span>
            </div>
          </div>

          {/* Central Circular / Ring Timer */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className={`transition-all duration-1000 ${
                    timeLeft <= 5
                      ? 'stroke-red-500 animate-pulse'
                      : timeLeft <= 10
                      ? 'stroke-amber-500'
                      : 'stroke-emerald-500'
                  }`}
                  strokeWidth="3.5"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * timerPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span
                className={`absolute font-mono-num font-bold text-sm ${
                  timeLeft <= 5 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Score & Streak */}
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              {currentStreak >= 2 && (
                <span className="inline-flex items-center gap-1 font-semibold text-orange-500">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>{currentStreak}x</span>
                </span>
              )}
              <span>Score</span>
            </div>
            <div className="font-mono-num text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {runningScore}
            </div>
          </div>

        </div>

        {/* Horizontal linear progress line */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors relative">
        
        {/* Flag or Image preview if available */}
        {currentQ.flagEmoji && (
          <div className="text-5xl text-center mb-4 select-none animate-in zoom-in-75">
            {currentQ.flagEmoji}
          </div>
        )}

        {/* Question Text */}
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center leading-snug mb-8 max-w-2xl mx-auto">
          {currentQ.question}
        </h2>

        {/* Answer Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6">
          {shuffledOptions.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = selectedOption === option;
            const isCorrectAnswer = option === currentQ.correctAnswer;

            let buttonStyle =
              'border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-100';

            if (hasAnswered) {
              if (isCorrectAnswer) {
                buttonStyle =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/50';
              } else if (isSelected && !isCorrectAnswer) {
                buttonStyle =
                  'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 ring-2 ring-red-500/50';
              } else {
                buttonStyle = 'border-slate-200 dark:border-slate-800 opacity-40 text-slate-400';
              }
            }

            return (
              <button
                key={option}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(option)}
                className={`relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 text-left text-base sm:text-lg font-medium transition-all cursor-pointer ${buttonStyle} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      hasAnswered && isCorrectAnswer
                        ? 'bg-emerald-600 text-white'
                        : hasAnswered && isSelected && !isCorrectAnswer
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="leading-tight">{option}</span>
                </div>

                {/* Status Icon */}
                {hasAnswered && (
                  <div className="shrink-0 ml-2">
                    {isCorrectAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {isSelected && !isCorrectAnswer && (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Educational Explanation Card */}
        {hasAnswered && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in slide-in-from-bottom-2">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-200/60 dark:border-slate-700/60">
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Geo Insight
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {currentQ.explanation}
                  </p>

                  {/* Points breakdown tag */}
                  {lastPointsEarned && (
                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>+{lastPointsEarned.total} pts</span>
                      <span className="text-slate-400 font-normal">
                        ({lastPointsEarned.base} base + {lastPointsEarned.speed} speed bonus
                        {lastPointsEarned.streakMult > 1 && ` × ${lastPointsEarned.streakMult} streak multiplier`})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button: Next Question */}
              <button
                onClick={goToNextQuestion}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98 whitespace-nowrap cursor-pointer shrink-0"
              >
                <span>
                  {currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
