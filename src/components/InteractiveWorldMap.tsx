import React, { useState } from 'react';
import { MapPin, Sparkles, Compass, Play, ChevronRight } from 'lucide-react';
import { sound } from '../utils/sound';

interface ContinentData {
  id: string;
  name: string;
  categoryId: string;
  fact: string;
  highestPoint: string;
  countriesCount: number;
  highlightColor: string;
}

const CONTINENTS_MAP: Record<string, ContinentData> = {
  north_america: {
    id: 'north_america',
    name: 'North America',
    categoryId: 'north_america',
    fact: 'Contains every single biome type, from Arctic tundra to tropical rainforest.',
    highestPoint: 'Denali (6,190 m)',
    countriesCount: 23,
    highlightColor: '#16a34a',
  },
  south_america: {
    id: 'south_america',
    name: 'South America',
    categoryId: 'south_america',
    fact: 'Home to the world’s largest river by discharge volume (Amazon) and longest range (Andes).',
    highestPoint: 'Aconcagua (6,961 m)',
    countriesCount: 12,
    highlightColor: '#059669',
  },
  europe: {
    id: 'europe',
    name: 'Europe',
    categoryId: 'europe',
    fact: 'Has no deserts; encompasses over 50 sovereign countries and microstates.',
    highestPoint: 'Mont Blanc (4,808 m)',
    countriesCount: 44,
    highlightColor: '#2563eb',
  },
  africa: {
    id: 'africa',
    name: 'Africa',
    categoryId: 'africa',
    fact: 'The cradle of human origin; features the largest hot desert and longest river.',
    highestPoint: 'Kilimanjaro (5,895 m)',
    countriesCount: 54,
    highlightColor: '#d97706',
  },
  asia: {
    id: 'asia',
    name: 'Asia',
    categoryId: 'asia',
    fact: 'Largest continent by both area and population (over 4.7 billion people).',
    highestPoint: 'Mount Everest (8,849 m)',
    countriesCount: 48,
    highlightColor: '#ea580c',
  },
  oceania: {
    id: 'oceania',
    name: 'Australia & Oceania',
    categoryId: 'oceania',
    fact: 'Spans thousands of Pacific islands and the world’s oldest, flattest continent.',
    highestPoint: 'Puncak Jaya (4,884 m)',
    countriesCount: 14,
    highlightColor: '#0891b2',
  },
};

const LANDMARK_PINS = [
  { name: 'Mount Everest', coords: { x: 710, y: 195 }, note: 'Tallest peak on Earth (8,849 m)' },
  { name: 'Great Barrier Reef', coords: { x: 865, y: 310 }, note: 'World’s largest coral reef' },
  { name: 'Nile River Delta', coords: { x: 550, y: 185 }, note: 'Historic cradle of Egyptian civilization' },
  { name: 'Amazon Basin', coords: { x: 300, y: 260 }, note: '20% of Earth’s total river flow' },
  { name: 'Grand Canyon', coords: { x: 190, y: 165 }, note: 'Deep desert canyon in Arizona' },
  { name: 'Roman Colosseum', coords: { x: 505, y: 160 }, note: 'Iconic ancient amphitheater' },
];

interface InteractiveWorldMapProps {
  onStartContinentQuiz: (categoryId: string) => void;
}

export const InteractiveWorldMap: React.FC<InteractiveWorldMapProps> = ({
  onStartContinentQuiz,
}) => {
  const [selectedContinent, setSelectedContinent] = useState<string>('asia');
  const [activePin, setActivePin] = useState<{ name: string; note: string } | null>(null);

  const continent = CONTINENTS_MAP[selectedContinent] || CONTINENTS_MAP.asia;

  const handleSelectContinent = (key: string) => {
    sound.playClick();
    setSelectedContinent(key);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-white relative">
      {/* Header bar of map */}
      <div className="px-6 py-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Interactive World Atlas</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Click a region to explore</span>
          </div>
          <h3 className="font-display text-lg font-bold text-white mt-0.5">
            Global Geography Explorer
          </h3>
        </div>

        {/* Region selector buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.entries(CONTINENTS_MAP).map(([key, data]) => (
            <button
              key={key}
              onClick={() => handleSelectContinent(key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                selectedContinent === key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {data.name}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full aspect-[2/1] min-h-[300px] max-h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
        
        {/* Subtle grid lines background */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Equator & Tropics lines */}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="36%" x2="100%" y2="36%" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="0" y1="64%" x2="100%" y2="64%" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 4" />
        </svg>

        {/* Vector Continents */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full max-w-5xl transition-transform duration-300"
        >
          {/* North America */}
          <path
            d="M 120,70 L 220,60 L 290,90 L 280,140 L 230,160 L 250,220 L 200,260 L 170,230 L 150,170 L 100,140 Z"
            fill={selectedContinent === 'north_america' ? '#16a34a' : '#1e293b'}
            stroke={selectedContinent === 'north_america' ? '#4ade80' : '#334155'}
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300 hover:fill-emerald-700"
            onClick={() => handleSelectContinent('north_america')}
          />
          {/* Greenland */}
          <path
            d="M 330,45 L 390,40 L 370,100 L 320,95 Z"
            fill={selectedContinent === 'north_america' ? '#16a34a' : '#1e293b'}
            stroke={selectedContinent === 'north_america' ? '#4ade80' : '#334155'}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-300 hover:fill-emerald-700"
            onClick={() => handleSelectContinent('north_america')}
          />

          {/* South America */}
          <path
            d="M 240,250 L 320,240 L 350,290 L 320,380 L 280,450 L 250,420 L 240,340 Z"
            fill={selectedContinent === 'south_america' ? '#059669' : '#1e293b'}
            stroke={selectedContinent === 'south_america' ? '#34d399' : '#334155'}
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300 hover:fill-emerald-700"
            onClick={() => handleSelectContinent('south_america')}
          />

          {/* Europe */}
          <path
            d="M 450,85 L 530,75 L 570,110 L 530,175 L 450,170 L 440,130 Z"
            fill={selectedContinent === 'europe' ? '#2563eb' : '#1e293b'}
            stroke={selectedContinent === 'europe' ? '#60a5fa' : '#334155'}
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300 hover:fill-blue-700"
            onClick={() => handleSelectContinent('europe')}
          />
          {/* British Isles */}
          <path
            d="M 425,100 L 445,95 L 440,125 L 420,120 Z"
            fill={selectedContinent === 'europe' ? '#2563eb' : '#1e293b'}
            stroke={selectedContinent === 'europe' ? '#60a5fa' : '#334155'}
            strokeWidth="1.5"
            className="cursor-pointer hover:fill-blue-700"
            onClick={() => handleSelectContinent('europe')}
          />

          {/* Africa */}
          <path
            d="M 450,185 L 560,180 L 590,240 L 540,360 L 490,380 L 450,280 L 430,220 Z"
            fill={selectedContinent === 'africa' ? '#d97706' : '#1e293b'}
            stroke={selectedContinent === 'africa' ? '#fbbf24' : '#334155'}
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300 hover:fill-amber-700"
            onClick={() => handleSelectContinent('africa')}
          />
          {/* Madagascar */}
          <path
            d="M 600,320 L 620,310 L 610,365 L 595,355 Z"
            fill={selectedContinent === 'africa' ? '#d97706' : '#1e293b'}
            stroke={selectedContinent === 'africa' ? '#fbbf24' : '#334155'}
            strokeWidth="1.5"
            className="cursor-pointer hover:fill-amber-700"
            onClick={() => handleSelectContinent('africa')}
          />

          {/* Asia */}
          <path
            d="M 570,75 L 860,65 L 850,180 L 780,240 L 730,220 L 680,270 L 620,230 L 565,175 Z"
            fill={selectedContinent === 'asia' ? '#ea580c' : '#1e293b'}
            stroke={selectedContinent === 'asia' ? '#fb923c' : '#334155'}
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300 hover:fill-orange-700"
            onClick={() => handleSelectContinent('asia')}
          />
          {/* Indian Subcontinent */}
          <path
            d="M 670,190 L 720,200 L 700,270 Z"
            fill={selectedContinent === 'asia' ? '#ea580c' : '#1e293b'}
            stroke={selectedContinent === 'asia' ? '#fb923c' : '#334155'}
            strokeWidth="1.5"
            className="cursor-pointer hover:fill-orange-700"
            onClick={() => handleSelectContinent('asia')}
          />
          {/* Japan Arch */}
          <path
            d="M 850,150 L 870,140 L 860,190 L 840,195 Z"
            fill={selectedContinent === 'asia' ? '#ea580c' : '#1e293b'}
            stroke={selectedContinent === 'asia' ? '#fb923c' : '#334155'}
            strokeWidth="1.5"
            className="cursor-pointer hover:fill-orange-700"
            onClick={() => handleSelectContinent('asia')}
          />

          {/* Australia & Oceania */}
          <path
            d="M 760,310 L 860,300 L 870,370 L 790,390 L 750,350 Z"
            fill={selectedContinent === 'oceania' ? '#0891b2' : '#1e293b'}
            stroke={selectedContinent === 'oceania' ? '#22d3ee' : '#334155'}
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300 hover:fill-cyan-700"
            onClick={() => handleSelectContinent('oceania')}
          />
          {/* New Zealand */}
          <path
            d="M 890,380 L 910,375 L 895,430 L 880,420 Z"
            fill={selectedContinent === 'oceania' ? '#0891b2' : '#1e293b'}
            stroke={selectedContinent === 'oceania' ? '#22d3ee' : '#334155'}
            strokeWidth="1.5"
            className="cursor-pointer hover:fill-cyan-700"
            onClick={() => handleSelectContinent('oceania')}
          />

          {/* Landmark Hotspot Pins */}
          {LANDMARK_PINS.map((pin, i) => (
            <g
              key={i}
              className="cursor-pointer group"
              onMouseEnter={() => setActivePin({ name: pin.name, note: pin.note })}
              onMouseLeave={() => setActivePin(null)}
              onClick={() => {
                sound.playClick();
                setActivePin({ name: pin.name, note: pin.note });
              }}
            >
              <circle
                cx={pin.coords.x}
                cy={pin.coords.y}
                r="6"
                className="fill-amber-400 animate-ping opacity-75"
              />
              <circle
                cx={pin.coords.x}
                cy={pin.coords.y}
                r="4"
                className="fill-amber-500 stroke-slate-900 stroke-2"
              />
            </g>
          ))}
        </svg>

        {/* Hover / Click Pin Popover */}
        {activePin && (
          <div className="absolute top-4 left-4 bg-slate-950/90 border border-amber-500/40 rounded-lg px-3 py-2 text-xs backdrop-blur-md shadow-lg pointer-events-none animate-in fade-in">
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activePin.name}</span>
            </div>
            <p className="text-slate-300 mt-0.5">{activePin.note}</p>
          </div>
        )}
      </div>

      {/* Continent Details & Action Footer */}
      <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{continent.countriesCount} Sovereign Nations</span>
            <span aria-hidden="true">·</span>
            <span>Peak: {continent.highestPoint}</span>
          </div>
          <h4 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <span>{continent.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-normal">
              Active Region
            </span>
          </h4>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {continent.fact}
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onStartContinentQuiz(continent.categoryId);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-102 active:scale-98 whitespace-nowrap cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch {continent.name} Quiz</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
