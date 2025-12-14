import React, { useState } from 'react';
import { useGame } from './GameContext';
import { GameView } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';
import * as GeminiService from '../services/geminiService';

export const AddTask: React.FC = () => {
  const { setView, addTask, tasks, categories, activeTheme } = useGame();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    const deadline = new Date(`${date}T${time}`).getTime();
    addTask(title, deadline, selectedCategoryId);
  };

  const generateSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
        const existingTitles = tasks.slice(-5).map(t => t.title);
        const context = existingTitles.length > 0 ? existingTitles : [title || "productivity"];
        
        const result = await GeminiService.analyzeTasksForSuggestions(context);
        setSuggestions(result);
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingSuggestions(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${activeTheme.backgroundColor}`}>
      <div className="p-4 bg-white shadow-sm flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => setView(GameView.DASHBOARD)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">New Mission</h1>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Task Name</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Study Math for 30 mins"
            className="w-full text-lg p-4 bg-white rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition text-gray-900 shadow-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Date</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none text-gray-900 shadow-sm"
            />
          </div>
          <div>
             <label className="block text-sm font-semibold text-gray-600 mb-2">Time</label>
             <input 
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none text-gray-900 shadow-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Category</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button
                    type="button"
                    onClick={() => setSelectedCategoryId(undefined)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors ${!selectedCategoryId ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'}`}
                >
                    None
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors flex items-center gap-2
                             ${selectedCategoryId === cat.id ? `${activeTheme.primaryColor} text-white border-transparent` : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                         <span className={`w-2 h-2 rounded-full ${cat.color} ${selectedCategoryId === cat.id ? 'ring-2 ring-white' : ''}`}></span>
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>

        {/* AI Suggestions */}
        <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-500">Gemini Suggestions</h3>
                <button 
                    type="button"
                    onClick={generateSuggestions}
                    disabled={loadingSuggestions}
                    className={`text-xs ${activeTheme.secondaryColor} text-gray-800 px-3 py-1 rounded-full flex items-center gap-1 hover:brightness-95 transition`}
                >
                    <Sparkles size={12} />
                    {loadingSuggestions ? 'Thinking...' : 'Inspire Me'}
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                    <button 
                        key={i} 
                        onClick={() => setTitle(s)}
                        className={`text-xs border border-gray-100 bg-white text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 active:scale-95 transition`}
                    >
                        + {s}
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-auto">
          <button 
            onClick={handleSubmit}
            disabled={!title}
            className={`w-full ${activeTheme.primaryColor} disabled:bg-gray-300 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]`}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};