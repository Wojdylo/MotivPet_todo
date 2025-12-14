import React from 'react';
import { useGame } from './GameContext';
import { GameView } from '../types';
import { ArrowLeft, Award } from 'lucide-react';

export const Achievements: React.FC = () => {
  const { setView, achievements, points, activeTheme } = useGame();

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progress = (unlockedCount / achievements.length) * 100;

  return (
    <div className={`flex flex-col h-full ${activeTheme.backgroundColor}`}>
      {/* Header */}
      <div className="p-4 bg-white shadow-sm flex items-center gap-4 z-10">
        <button onClick={() => setView(GameView.DASHBOARD)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">Achievements</h1>
        </div>
      </div>

      {/* Progress Card */}
      <div className={`p-6 ${activeTheme.primaryColor} text-white m-4 rounded-2xl shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
             <span className="font-bold opacity-80">Collection</span>
             <span className="font-bold">{unlockedCount} / {achievements.length}</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-3">
              <div 
                className="bg-yellow-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
          </div>
          <p className="mt-4 text-white/90 text-sm">Keep completing tasks and streaks to unlock more badges and earn bragging rights!</p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 grid grid-cols-2 gap-4">
        {achievements.map(ach => (
            <div 
                key={ach.id} 
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-2 transition-all duration-500
                    ${ach.unlocked 
                        ? 'bg-white border-yellow-400 shadow-md transform hover:-translate-y-1' 
                        : 'bg-gray-100 border-gray-200 opacity-60 grayscale'
                    }`}
            >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-1
                    ${ach.unlocked ? 'bg-yellow-100' : 'bg-gray-200'}
                `}>
                    {ach.icon}
                </div>
                <h3 className="font-bold text-gray-800 leading-tight">{ach.title}</h3>
                <p className="text-xs text-gray-500">{ach.description}</p>
                {ach.unlocked && (
                    <span className="text-[10px] uppercase font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full mt-1">Unlocked</span>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};