import React, { useEffect, useState } from 'react';
import { useGame } from './GameContext';
import { GameView } from '../types';
import { Plus, Check, Trash2, Clock, Trophy, Settings, Users, RotateCcw } from 'lucide-react';
import * as GeminiService from '../services/geminiService';
import { PetAvatar } from './PetAvatar';

export const Dashboard: React.FC = () => {
  const { 
    activePet, petMood, tasks, points, 
    completeTask, deleteTask, setView, categories,
    activeAccessoryId, celebrating, activeTheme,
    isUndoable, undoCompleteTask
  } = useGame();
  
  const [quote, setQuote] = useState<string>("Loading motivation...");
  const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');

  useEffect(() => {
    if (activePet) {
      const urgentCount = tasks.filter(t => !t.completed && t.deadline - Date.now() < 24*3600*1000).length;
      GeminiService.getMotivationalQuote(activePet.name, urgentCount, petMood === 'happy')
        .then(setQuote)
        .catch(() => setQuote("Let's do this!"));
    }
  }, [activePet, petMood, tasks.length]);

  const sortedTasks = [...tasks].sort((a, b) => a.deadline - b.deadline);
  const todoTasks = sortedTasks.filter(t => !t.completed);
  const doneTasks = sortedTasks.filter(t => t.completed).reverse();

  const formatDeadline = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "Overdue!";
    if (days === 0) return `Today ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    if (days === 1) return "Tomorrow";
    return date.toLocaleDateString();
  };

  // Group tasks by category
  const getTasksByCategory = (taskList: typeof tasks) => {
    const grouped: Record<string, typeof tasks> = {};
    const uncategorized: typeof tasks = [];

    taskList.forEach(t => {
        if (t.categoryId) {
            if (!grouped[t.categoryId]) grouped[t.categoryId] = [];
            grouped[t.categoryId].push(t);
        } else {
            uncategorized.push(t);
        }
    });
    return { grouped, uncategorized };
  };

  const { grouped, uncategorized } = getTasksByCategory(activeTab === 'todo' ? todoTasks : doneTasks);

  const renderTaskRow = (task: typeof tasks[0]) => {
    const isOverdue = !task.completed && task.deadline < Date.now();
    const isUrgent = !task.completed && task.deadline - Date.now() < 24 * 60 * 60 * 1000 && !isOverdue;
    const catColor = categories.find(c => c.id === task.categoryId)?.color || 'bg-gray-200';

    return (
        <div 
          key={task.id} 
          className={`bg-white p-4 rounded-2xl shadow-sm border-l-4 flex items-center gap-3 transition-all animate-fade-in
            ${task.completed ? 'border-green-400 opacity-60' : isOverdue ? 'border-red-500 bg-red-50' : isUrgent ? 'border-orange-400' : 'border-gray-200'}
          `}
        >
          <button 
            onClick={() => task.completed ? null : completeTask(task.id)}
            disabled={task.completed}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
              ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-indigo-500 text-transparent hover:text-indigo-200'}
            `}
          >
            <Check size={16} strokeWidth={3} />
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-800 truncate ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <Clock size={12} />
              <span className={`${isOverdue ? 'text-red-600 font-bold' : ''}`}>
                {formatDeadline(task.deadline)}
              </span>
              {task.categoryId && (
                  <span className={`w-2 h-2 rounded-full ${catColor}`}></span>
              )}
              {task.completed && <span className="text-green-600 font-bold">+{task.pointsEarned} pts</span>}
            </div>
          </div>

          {!task.completed && (
            <button 
              onClick={() => deleteTask(task.id)}
              className="text-gray-300 hover:text-red-400 p-2"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
    );
  };

  return (
    <div className={`flex flex-col h-full ${activeTheme.backgroundColor}`}>
      {/* Widget */}
      <div className={`bg-gradient-to-br ${activeTheme.gradient} text-white rounded-b-3xl shadow-xl pt-6 pb-2 px-6 relative transition-all duration-500`}>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="white" />
          </svg>
        </div>
        
        <div className="flex items-center justify-between mb-8 z-10 relative">
          <div>
            <h1 className="text-xl font-bold">Good Day!</h1>
            <p className="text-white/80 text-sm">{points} Coins</p>
          </div>
          <div className="flex gap-2">
             <button 
                onClick={() => setView(GameView.SOCIAL)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition text-indigo-100"
                title="Friends"
            >
                <Users size={20} />
            </button>
             <button 
                onClick={() => setView(GameView.ACHIEVEMENTS)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition text-yellow-300"
                title="Achievements"
            >
                <Trophy size={20} />
            </button>
            <button 
                onClick={() => setView(GameView.SHOP)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-xs font-semibold backdrop-blur-sm transition"
            >
                🛍️ Shop
            </button>
          </div>
        </div>

        {/* Pet Interaction Area */}
        <div className="flex items-end justify-between z-10 relative">
          {/* Quote Bubble */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl rounded-bl-none p-3 text-sm italic leading-relaxed border border-white/10 mb-8 max-w-[60%] animate-fade-in">
             "{quote}"
           </div>

           {/* The Pet Sitting on the Edge */}
           {activePet && (
             <div className={`relative -mb-6 -mr-2 z-20 transition-all duration-300 ease-out ${celebrating ? '-translate-y-8 scale-110' : ''}`}>
               {/* Visual Particles when celebrating */}
               {celebrating && (
                   <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none w-32 justify-center">
                        <span className="text-2xl animate-bounce delay-0">✨</span>
                        <span className="text-3xl animate-bounce delay-75 text-red-400">❤️</span>
                        <span className="text-2xl animate-bounce delay-150">🎉</span>
                   </div>
               )}
               <PetAvatar 
                  type={activePet.type} 
                  color={activePet.color} 
                  secondaryColor={activePet.secondaryColor}
                  mood={celebrating ? 'happy' : petMood} 
                  accessoryId={activeAccessoryId || undefined}
                  size={120} 
                  className="filter drop-shadow-xl"
               />
             </div>
           )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 flex gap-4 mt-2">
        <button 
          onClick={() => setActiveTab('todo')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'todo' ? `${activeTheme.primaryColor} text-white shadow-md` : 'bg-white text-gray-500'}`}
        >
          Tasks
        </button>
        <button 
          onClick={() => setActiveTab('done')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'done' ? `${activeTheme.primaryColor} text-white shadow-md` : 'bg-white text-gray-500'}`}
        >
          History
        </button>
        <button 
             onClick={() => setView(GameView.CATEGORIES)}
             className="w-10 flex items-center justify-center bg-white text-gray-500 rounded-xl shadow-sm border border-gray-100"
             title="Manage Categories"
        >
            <Settings size={18} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar space-y-4">
        {activeTab === 'todo' && todoTasks.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <p className="mb-2 text-4xl">🍃</p>
            <p>No tasks here yet.</p>
          </div>
        )}

        {/* Render grouped tasks */}
        {Object.entries(grouped).map(([catId, catTasks]) => {
            const category = categories.find(c => c.id === catId);
            if (!category) return null; // Should not happen often
            return (
                <div key={catId} className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
                        {category.name}
                    </h3>
                    {catTasks.map(renderTaskRow)}
                </div>
            )
        })}

        {/* Render uncategorized tasks */}
        {uncategorized.length > 0 && (
            <div className="space-y-2">
                {Object.keys(grouped).length > 0 && (
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Other</h3>
                )}
                {uncategorized.map(renderTaskRow)}
            </div>
        )}
      </div>

      {/* UNDO TOAST */}
      {isUndoable && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-bounce z-50">
              <span className="text-sm font-semibold">Task Completed!</span>
              <button 
                onClick={undoCompleteTask}
                className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 font-bold text-sm"
              >
                  <RotateCcw size={16} /> Undo
              </button>
          </div>
      )}

      {/* FAB */}
      <div className="absolute bottom-6 right-6">
        <button 
          onClick={() => setView(GameView.ADD_TASK)}
          className={`${activeTheme.primaryColor} hover:brightness-110 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95`}
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};