import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Search,
  RotateCcw,
  CheckCircle,
  BarChart3,
  ListPlus,
  BookOpen,
  Trophy,
  Award,
  KeyRound,
  AlertTriangle,
  X,
} from 'lucide-react';
import { CategoryInfo, Difficulty, Question } from '../types';
import { ACHIEVEMENTS_LIST } from '../db/storage';
import { sound } from '../utils/sound';

interface AdminPanelProps {
  questions: Question[];
  categories: CategoryInfo[];
  stats: {
    totalQuestions: number;
    totalCategories: number;
    totalAttempts: number;
    averageAccuracy: number;
    userTotalPoints: number;
    unlockedAchievementsCount: number;
  };
  onAddQuestion: (q: Omit<Question, 'id'>) => void;
  onUpdateQuestion: (id: string, q: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onResetQuestions: () => void;
  onAddCategory: (cat: Omit<CategoryInfo, 'totalQuestions'>) => void;
}

const ADMIN_PIN = 'geo123';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  questions,
  categories,
  stats,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onResetQuestions,
  onAddCategory,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'questions' | 'categories' | 'stats' | 'achievements'>('questions');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Question modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Question form inputs
  const [formQuestion, setFormQuestion] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.id || 'countries');
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>('medium');
  const [formOptA, setFormOptA] = useState('');
  const [formOptB, setFormOptB] = useState('');
  const [formOptC, setFormOptC] = useState('');
  const [formOptD, setFormOptD] = useState('');
  const [formCorrectOpt, setFormCorrectOpt] = useState('A');
  const [formExplanation, setFormExplanation] = useState('');
  const [formFlagEmoji, setFormFlagEmoji] = useState('');
  const [formPoints, setFormPoints] = useState(150);

  // Category form inputs
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catColor, setCatColor] = useState('#059669');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      sound.playCorrect();
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      sound.playWrong();
      setPinError(true);
    }
  };

  const handleOpenAddQuestion = () => {
    sound.playClick();
    setEditingQuestionId(null);
    setFormQuestion('');
    setFormCategory(categories[0]?.id || 'countries');
    setFormDifficulty('medium');
    setFormOptA('');
    setFormOptB('');
    setFormOptC('');
    setFormOptD('');
    setFormCorrectOpt('A');
    setFormExplanation('');
    setFormFlagEmoji('');
    setFormPoints(150);
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    sound.playClick();
    setEditingQuestionId(q.id);
    setFormQuestion(q.question);
    setFormCategory(q.categoryId);
    setFormDifficulty(q.difficulty);
    setFormOptA(q.options[0] || '');
    setFormOptB(q.options[1] || '');
    setFormOptC(q.options[2] || '');
    setFormOptD(q.options[3] || '');

    const correctIdx = q.options.indexOf(q.correctAnswer);
    setFormCorrectOpt(correctIdx >= 0 ? ['A', 'B', 'C', 'D'][correctIdx] : 'A');
    setFormExplanation(q.explanation);
    setFormFlagEmoji(q.flagEmoji || '');
    setFormPoints(q.points || 150);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const options = [formOptA.trim(), formOptB.trim(), formOptC.trim(), formOptD.trim()];
    if (options.some((o) => !o) || !formQuestion.trim()) {
      alert('Please fill out question text and all 4 options.');
      return;
    }

    const correctIndex = ['A', 'B', 'C', 'D'].indexOf(formCorrectOpt);
    const correctAnswer = options[correctIndex];

    if (editingQuestionId) {
      onUpdateQuestion(editingQuestionId, {
        question: formQuestion.trim(),
        categoryId: formCategory,
        difficulty: formDifficulty,
        options,
        correctAnswer,
        explanation: formExplanation.trim() || 'Verified by Geo Giant geography faculty.',
        flagEmoji: formFlagEmoji.trim() || undefined,
        points: Number(formPoints) || 150,
      });
    } else {
      onAddQuestion({
        question: formQuestion.trim(),
        categoryId: formCategory,
        difficulty: formDifficulty,
        options,
        correctAnswer,
        explanation: formExplanation.trim() || 'Verified by Geo Giant geography faculty.',
        flagEmoji: formFlagEmoji.trim() || undefined,
        points: Number(formPoints) || 150,
      });
    }

    sound.playCorrect();
    setIsQuestionModalOpen(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const id = catName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    onAddCategory({
      id,
      name: catName.trim(),
      description: catDesc.trim() || 'Geography topic module',
      icon: 'Compass',
      accentColor: catColor,
    });

    sound.playCorrect();
    setCatName('');
    setCatDesc('');
    setIsAddCatModalOpen(false);
  };

  // Filtered questions list
  const filteredQuestions = questions.filter((q) => {
    const matchSearch =
      q.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchFilter.toLowerCase());
    const matchCat = categoryFilter === 'all' || q.categoryId === categoryFilter;
    return matchSearch && matchCat;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7" />
          </div>

          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Teacher & Admin Access
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Enter educator security PIN to manage geography curriculum questions, categories, and review student statistics.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter PIN (hint: geo123)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
              {pinError && (
                <div className="text-xs text-red-500 mt-1.5 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Incorrect PIN. Try: geo123</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-4 text-[11px] text-slate-400">
            Default educator PIN: <span className="font-mono font-bold text-indigo-500">geo123</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Admin Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Geo Giant Educator Console</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Curriculum & Database Control</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
            Admin Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Restore question database to initial factory defaults?')) {
                onResetQuestions();
                sound.playClick();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Questions</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl cursor-pointer"
          >
            Lock Console
          </button>
        </div>
      </div>

      {/* 4 Stats KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Total Questions</div>
          <div className="font-mono-num text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {stats.totalQuestions}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Active Categories</div>
          <div className="font-mono-num text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.totalCategories}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Total Quizzes Run</div>
          <div className="font-mono-num text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {stats.totalAttempts}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Average Student Accuracy</div>
          <div className="font-mono-num text-2xl font-bold text-amber-500 mt-1">
            {stats.averageAccuracy}%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl max-w-fit mb-6">
        <button
          onClick={() => { sound.playClick(); setActiveTab('questions'); }}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Questions ({questions.length})
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('categories'); }}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Categories ({categories.length})
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('achievements'); }}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'achievements'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Achievements ({ACHIEVEMENTS_LIST.length})
        </button>
      </div>

      {/* Tab 1: Questions Management */}
      {activeTab === 'questions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          
          {/* Controls: Search, Category Filter, and Add Question */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAddQuestion}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Question</span>
            </button>
          </div>

          {/* Questions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Question</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Difficulty</th>
                  <th className="pb-3 px-3">Correct Answer</th>
                  <th className="pb-3 px-3">Points</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 max-w-sm">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {q.question}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {q.explanation}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 capitalize">
                      {categories.find((c) => c.id === q.categoryId)?.name || q.categoryId}
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize text-slate-700 dark:text-slate-300 font-medium">
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[150px]">
                      {q.correctAnswer}
                    </td>
                    <td className="py-3 px-3 font-mono-num font-medium text-slate-600 dark:text-slate-400">
                      {q.points}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditQuestion(q)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer mr-1"
                        title="Edit Question"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this question?')) {
                            onDeleteQuestion(q.id);
                            sound.playClick();
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab 2: Categories Management */}
      {activeTab === 'categories' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Course Categories
              </h3>
              <p className="text-xs text-slate-400">Manage curriculum domains.</p>
            </div>

            <button
              onClick={() => setIsAddCatModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                </div>
                <div
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: c.accentColor || '#059669' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Achievements Directory */}
      {activeTab === 'achievements' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
            Student Achievements Directory
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            All system badges configured for students to unlock.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ACHIEVEMENTS_LIST.map((ach) => (
              <div
                key={ach.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ach.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1 inline-block">
                    Type: {ach.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {editingQuestionId ? 'Edit Question' : 'Add New Question'}
              </h3>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Question Text
                </label>
                <textarea
                  required
                  rows={2}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. Which country has the most natural lakes?"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white capitalize"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Points Value
                  </label>
                  <input
                    type="number"
                    value={formPoints}
                    onChange={(e) => setFormPoints(Number(e.target.value))}
                    min={50}
                    max={500}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Four Multiple-Choice Options
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-400 w-4">A:</span>
                    <input
                      required
                      type="text"
                      placeholder="Option A"
                      value={formOptA}
                      onChange={(e) => setFormOptA(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-400 w-4">B:</span>
                    <input
                      required
                      type="text"
                      placeholder="Option B"
                      value={formOptB}
                      onChange={(e) => setFormOptB(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-400 w-4">C:</span>
                    <input
                      required
                      type="text"
                      placeholder="Option C"
                      value={formOptC}
                      onChange={(e) => setFormOptC(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-400 w-4">D:</span>
                    <input
                      required
                      type="text"
                      placeholder="Option D"
                      value={formOptD}
                      onChange={(e) => setFormOptD(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Correct Option Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Which option is the Correct Answer?
                </label>
                <div className="flex items-center gap-4">
                  {['A', 'B', 'C', 'D'].map((letter) => (
                    <label key={letter} className="flex items-center gap-1.5 text-xs cursor-pointer font-semibold">
                      <input
                        type="radio"
                        name="correctOpt"
                        value={letter}
                        checked={formCorrectOpt === letter}
                        onChange={() => setFormCorrectOpt(letter)}
                        className="text-indigo-600"
                      />
                      <span>Option {letter}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Explanation & Emoji */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Educational Explanation
                  </label>
                  <input
                    type="text"
                    value={formExplanation}
                    onChange={(e) => setFormExplanation(e.target.value)}
                    placeholder="Fact explaining why this is the right answer"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Flag Emoji (opt)
                  </label>
                  <input
                    type="text"
                    value={formFlagEmoji}
                    onChange={(e) => setFormFlagEmoji(e.target.value)}
                    placeholder="e.g. 🇨🇦"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
                >
                  {editingQuestionId ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
              Add New Category
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Category Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Desert Wonders"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Arid terrains, dunes, and oasis geography"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
