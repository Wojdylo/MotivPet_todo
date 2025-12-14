import React, { useState } from 'react';
import { useGame } from './GameContext';
import { GameView } from '../types';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';

const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

export const ManageCategories: React.FC = () => {
  const { setView, categories, addCategory, deleteCategory, activeTheme } = useGame();
  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[10]); // Blue default

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), selectedColor);
    setNewCatName('');
  };

  return (
    <div className={`flex flex-col h-full ${activeTheme.backgroundColor}`}>
      <div className="p-4 bg-white shadow-sm flex items-center gap-4 z-10">
        <button onClick={() => setView(GameView.DASHBOARD)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Categories</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* List Existing */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {categories.map((cat, idx) => (
                <div key={cat.id} className={`p-4 flex items-center justify-between ${idx !== categories.length -1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full ${cat.color} shadow-sm`}></div>
                        <span className="font-semibold text-gray-700">{cat.name}</span>
                    </div>
                    <button 
                        onClick={() => deleteCategory(cat.id)}
                        className="text-gray-400 hover:text-red-500 p-2"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
            {categories.length === 0 && (
                <div className="p-8 text-center text-gray-400">No categories yet.</div>
            )}
        </div>

        {/* Add New */}
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-gray-800">Create Category</h2>
            
            <input 
                type="text" 
                value={newCatName} 
                onChange={e => setNewCatName(e.target.value)}
                placeholder="Category Name"
                className="w-full p-3 bg-gray-50 rounded-xl border focus:border-indigo-500 outline-none text-gray-900"
            />
            
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Color</label>
                <div className="flex flex-wrap gap-2">
                    {COLORS.map(color => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full ${color} transition-transform ${selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-300' : 'hover:scale-110'}`}
                        />
                    ))}
                </div>
            </div>

            <button 
                onClick={handleAdd}
                disabled={!newCatName.trim()}
                className={`w-full ${activeTheme.primaryColor} disabled:bg-gray-300 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2`}
            >
                <Plus size={20} />
                Add Category
            </button>
        </div>
      </div>
    </div>
  );
};