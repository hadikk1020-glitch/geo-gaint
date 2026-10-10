import React, { useState } from 'react';
import {
  Globe,
  Building2,
  Flag,
  Map,
  Castle,
  Waves,
  Compass,
  Mountain,
  Coins,
  Navigation,
  Sun,
  Sparkles,
  Flame,
  TreePine,
  Anchor,
  Play,
  Search,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { CategoryInfo, Difficulty } from '../types';
import { sound } from '../utils/sound';

interface CategoriesViewProps {
  categories: CategoryInfo[];
  masteryMap: Record<string, { totalAnswered: number; correctCount: number; accuracy: number }>;
  onStartQuiz: (categoryId: string, difficulty: Difficulty, questionCount: number) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Flag: <Flag className="w-6 h-6" />,
  Map: <Map className="w-6 h-6" />,
  Castle: <Castle className="w-6 h-6" />,
  Waves: <Waves className="w-6 h-6" />,
  Compass: <Compass className="w-6 h-6" />,
  Mountain: <Mountain className="w-6 h-6" />,
  Coins: <Coins className="w-6 h-6" />,
  Navigation: <Navigation className="w-6 h-6" />,
  Sun: <Sun className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
  TreePine: <TreePine className="w-6 h-6" />,
  Anchor: <Anchor className="w-6 h-6" />,
};

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  masteryMap,
  onStartQuiz,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<'all' | 'global' | 'continents' | 'physical'>('all');
  
  // Selected category for configuration modal / popup
  const [configuringCategory, setConfiguringCategory] = useState<CategoryInfo | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [selectedCount, setSelectedCount] = useState<number>(10);

  const continentIds = ['asia', 'europe', 'africa', 'north_america', 'south_america', 'oceania', 'continents'];
  const physicalIds = ['mountains', 'rivers', 'oceans', 'landmarks'];

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterGroup === 'continents') {
      return continentIds.includes(cat.id);
    }
    if (filterGroup === 'physical') {
      return physicalIds.includes(cat.id);
    }
    if (filterGroup === 'global') {
      return !continentIds.includes(cat.id) && !physicalIds.includes(cat.id);
    }

    return true;
  });

  const handleOpenConfig = (cat: CategoryInfo) => {
    sound.playClick();
    setConfiguringCategory(cat);
  };

  const handleLaunch = () => {
    if (!configuringCategory) return;
    sound.playClick();
    onStartQuiz(configuringCategory.id, selectedDifficulty, selectedCount);
    setConfiguringCategory(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <span>Explore 16 World Categories</span>
            <span aria-hidden="true">·</span>
            <span>Comprehensive Geography Curriculum</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Quiz Categories
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Choose a geographic subject to test your knowledge, earn badges, and sharpen your cartographic prowess.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl max-w-fit mb-8 overflow-x-auto">
        <button
          onClick={() => { sound.playClick(); setFilterGroup('all'); }}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterGroup === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All (16)
        </button>

        <button
          onClick={() => { sound.playClick(); setFilterGroup('global'); }}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterGroup === 'global'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Global Systems & Flags
        </button>

        <button
          onClick={() => { sound.playClick(); setFilterGroup('continents'); }}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterGroup === 'continents'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Continents & Regions
        </button>

        <button
          onClick={() => { sound.playClick(); setFilterGroup('physical'); }}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterGroup === 'physical'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Physical Geography & Peaks
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredCategories.map((cat) => {
          const mastery = masteryMap[cat.id] || { totalAnswered: 0, accuracy: 0 };
          const iconNode = ICON_MAP[cat.icon] || <Compass className="w-6 h-6" />;

          return (
            <div
              key={cat.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Category Icon and Question Count */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: cat.accentColor || '#059669' }}
                  >
                    {iconNode}
                  </div>
                  
                  <span className="text-xs font-mono-num text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
                    {cat.totalQuestions || 6} Questions
                  </span>
                </div>

                {/* Name & Description */}
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Mastery Bar */}
                {mastery.totalAnswered > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Mastery</span>
                      <span className="font-mono-num font-semibold text-slate-700 dark:text-slate-300">
                        {mastery.accuracy}% ({mastery.totalAnswered} answered)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${mastery.accuracy}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Start Quiz Action */}
              <button
                onClick={() => handleOpenConfig(cat)}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-600 text-slate-800 dark:text-slate-200 group-hover:text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Quiz</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Quiz Configuration Modal */}
      {configuringCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: configuringCategory.accentColor || '#059669' }}
                >
                  {ICON_MAP[configuringCategory.icon] || <Compass className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {configuringCategory.name}
                  </h3>
                  <div className="text-xs text-slate-400">Configure Quiz Round</div>
                </div>
              </div>

              <button
                onClick={() => setConfiguringCategory(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Difficulty Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => { sound.playClick(); setSelectedDifficulty(diff); }}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selector */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    onClick={() => { sound.playClick(); setSelectedCount(count); }}
                    className={`py-2 px-2 text-xs font-mono-num font-semibold rounded-xl transition-all cursor-pointer ${
                      selectedCount === count
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfiguringCategory(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunch}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Quiz</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
