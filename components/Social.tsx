import React, { useState } from 'react';
import { useGame } from './GameContext';
import { GameView } from '../types';
import { ArrowLeft, Copy, UserPlus, Users, Crown } from 'lucide-react';
import { PetAvatar } from './PetAvatar';

export const Social: React.FC = () => {
  const { setView, userCode, addFriend, friends, stats, activePet, activeTheme } = useGame();
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [msg, setMsg] = useState('');

  const handleAddFriend = () => {
      const result = addFriend(friendCodeInput);
      setMsg(result.message);
      if (result.success) setFriendCodeInput('');
      setTimeout(() => setMsg(''), 3000);
  };

  const copyCode = () => {
      navigator.clipboard.writeText(userCode);
      setMsg("Code copied!");
      setTimeout(() => setMsg(''), 2000);
  };

  // Build leaderboard data
  const currentUserEntry = {
      id: 'me',
      name: 'You',
      code: userCode,
      petType: activePet?.type || 'bear',
      petColor: activePet?.color || '#a0887e',
      weeklyScore: stats.weeklyCompleted || 0,
      monthlyScore: stats.monthlyCompleted || 0,
      isMe: true
  };

  // Normalize friends to have isMe property
  const friendEntries = friends.map(f => ({ ...f, isMe: false }));

  const allEntries = [currentUserEntry, ...friendEntries].sort((a, b) => {
      if (activeTab === 'weekly') return b.weeklyScore - a.weeklyScore;
      return b.monthlyScore - a.monthlyScore;
  });

  return (
    <div className={`flex flex-col h-full ${activeTheme.backgroundColor}`}>
      {/* Header */}
      <div className="p-4 bg-white shadow-sm flex items-center gap-4 z-10">
        <button onClick={() => setView(GameView.DASHBOARD)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={20}/> Community
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          
          {/* User Code Card */}
          <div className={`bg-gradient-to-r ${activeTheme.gradient} p-6 rounded-2xl shadow-lg text-white`}>
              <h2 className="text-sm font-semibold opacity-90 uppercase mb-1">Your Friend Code</h2>
              <div className="flex items-center justify-between">
                  <span className="text-3xl font-black tracking-widest font-mono">{userCode}</span>
                  <button onClick={copyCode} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition">
                      <Copy size={20} />
                  </button>
              </div>
              <p className="text-xs mt-2 opacity-80">Share this code with friends to compete!</p>
          </div>

          {/* Add Friend Input */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Connect with Friend</label>
              <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={friendCodeInput}
                    onChange={(e) => setFriendCodeInput(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    maxLength={6}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-mono uppercase tracking-wider focus:ring-2 focus:ring-indigo-100 outline-none text-gray-800"
                  />
                  <button 
                    onClick={handleAddFriend}
                    className={`${activeTheme.primaryColor} text-white px-4 rounded-xl font-bold flex items-center justify-center`}
                  >
                      <UserPlus size={20} />
                  </button>
              </div>
              {msg && <p className="text-xs font-bold text-indigo-600 mt-2 animate-fade-in">{msg}</p>}
          </div>

          {/* Leaderboard */}
          <div>
              <div className="flex gap-2 mb-4 bg-gray-200 p-1 rounded-xl">
                  <button 
                    onClick={() => setActiveTab('weekly')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'weekly' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                      Weekly Top
                  </button>
                  <button 
                    onClick={() => setActiveTab('monthly')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'monthly' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                      Monthly Top
                  </button>
              </div>

              <div className="space-y-3">
                  {allEntries.map((entry, index) => {
                      const score = activeTab === 'weekly' ? entry.weeklyScore : entry.monthlyScore;
                      const isFirst = index === 0;
                      const isSecond = index === 1;
                      const isThird = index === 2;

                      return (
                        <div 
                            key={entry.code} 
                            className={`flex items-center gap-3 p-3 rounded-2xl border-b-4 transition-transform hover:scale-[1.02]
                                ${entry.isMe ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100'}
                            `}
                        >
                            <div className="w-8 font-bold text-gray-400 text-center flex justify-center">
                                {isFirst ? <Crown size={24} className="text-yellow-400 fill-yellow-400" /> :
                                 isSecond ? <span className="text-gray-400 text-xl">#2</span> :
                                 isThird ? <span className="text-orange-300 text-xl">#3</span> :
                                 <span className="text-sm">#{index + 1}</span>}
                            </div>
                            
                            <div className="relative w-12 h-12 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                <div className="scale-50 translate-y-1">
                                    <PetAvatar 
                                        type={entry.petType as any} 
                                        color={entry.petColor} 
                                        mood="happy" 
                                        size={100} 
                                    />
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className={`font-bold ${entry.isMe ? 'text-indigo-700' : 'text-gray-800'}`}>
                                    {entry.name} {entry.isMe && '(You)'}
                                </h3>
                                <p className="text-[10px] text-gray-400 font-mono tracking-wider">ID: {entry.code}</p>
                            </div>

                            <div className="text-right">
                                <span className={`text-xl font-black ${isFirst ? 'text-yellow-500' : 'text-gray-700'}`}>
                                    {score}
                                </span>
                                <p className="text-[10px] uppercase font-bold text-gray-400">Tasks</p>
                            </div>
                        </div>
                      );
                  })}
              </div>
          </div>
      </div>
    </div>
  );
};