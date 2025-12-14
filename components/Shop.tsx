import React, { useState } from 'react';
import { useGame } from './GameContext';
import { GameView } from '../types';
import { ArrowLeft, Coins, Lock, Check, Palette } from 'lucide-react';
import { PetAvatar } from './PetAvatar';

export const Shop: React.FC = () => {
  const { 
      points, unlockPet, setView, setActivePet, pets, shopCatalog, activePet,
      accessoryCatalog, ownedAccessories, buyAccessory, setActiveAccessory, activeAccessoryId,
      themes, ownedThemes, activeTheme, buyTheme, setActiveTheme
  } = useGame();

  const [shopTab, setShopTab] = useState<'pets' | 'accessories' | 'themes'>('pets');

  const handleBuyOrEquipPet = (petId: string, cost: number, isOwned: boolean) => {
      if (isOwned) {
          setActivePet(petId);
      } else {
          if (points >= cost) {
              const success = unlockPet(petId);
              if (success) {
                  // Optionally auto-equip
              }
          } else {
              alert("Not enough coins!");
          }
      }
  };

  const handleBuyOrEquipAccessory = (accId: string, cost: number, isOwned: boolean) => {
      if (isOwned) {
          if (activeAccessoryId === accId) {
              setActiveAccessory(null); // Unequip
          } else {
              setActiveAccessory(accId); // Equip
          }
      } else {
          if (points >= cost) {
              const success = buyAccessory(accId);
              if (success) {
                  setActiveAccessory(accId);
              }
          } else {
              alert("Not enough coins!");
          }
      }
  };

  const handleBuyOrEquipTheme = (themeId: string, cost: number, isOwned: boolean) => {
      if (isOwned) {
          setActiveTheme(themeId);
      } else {
          if (points >= cost) {
              const success = buyTheme(themeId);
              if (success) {
                  setActiveTheme(themeId);
              }
          } else {
              alert("Not enough coins!");
          }
      }
  };

  return (
    <div className={`flex flex-col h-full ${activeTheme.backgroundColor}`}>
      <div className="p-4 bg-white shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setView(GameView.DASHBOARD)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Shop</h1>
        </div>
        <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full text-yellow-800 font-bold text-sm">
          <Coins size={16} />
          {points}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => setShopTab('pets')}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${shopTab === 'pets' ? `${activeTheme.primaryColor} text-white shadow` : 'bg-white text-gray-500'}`}
          >
              Pets
          </button>
          <button 
            onClick={() => setShopTab('accessories')}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${shopTab === 'accessories' ? `${activeTheme.primaryColor} text-white shadow` : 'bg-white text-gray-500'}`}
          >
              Accessories
          </button>
          <button 
            onClick={() => setShopTab('themes')}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1 ${shopTab === 'themes' ? `${activeTheme.primaryColor} text-white shadow` : 'bg-white text-gray-500'}`}
          >
              <Palette size={14}/> Themes
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            
            {/* PETS TAB */}
            {shopTab === 'pets' && shopCatalog.map(pet => {
               const isOwned = pets.some(p => p.id === pet.id);
               const isActive = activePet?.id === pet.id;

               return (
                <div 
                    key={pet.id} 
                    onClick={() => handleBuyOrEquipPet(pet.id, pet.cost, isOwned)}
                    className={`bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer border-2 transition-all relative
                        ${isActive ? 'border-indigo-500 ring-2 ring-indigo-200' : isOwned ? 'border-green-200' : 'border-transparent opacity-90'}
                        ${pet.isSpecial && !isOwned ? 'border-yellow-200 bg-yellow-50' : ''}
                    `}
                >
                    <div className={`aspect-square w-full bg-gray-100 relative flex items-center justify-center overflow-hidden`}>
                        <div className="scale-75 translate-y-4">
                            <PetAvatar 
                                type={pet.type} 
                                color={pet.color} 
                                secondaryColor={pet.secondaryColor} 
                                mood="happy" 
                                size={120} 
                            />
                        </div>
                        
                        {isOwned && !isActive && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                <Check size={12} />
                            </div>
                        )}
                        {isActive && (
                            <div className="absolute top-2 right-2 bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                                ACTIVE
                            </div>
                        )}
                    </div>
                    
                    <div className="p-3">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-gray-800 text-sm truncate">{pet.name}</h3>
                            <span className="text-[10px] uppercase text-gray-400 font-bold">{pet.type}</span>
                        </div>
                        
                        {!isOwned ? (
                            pet.isSpecial ? (
                                <div className="text-xs text-yellow-600 font-bold text-center mt-2 bg-yellow-100 py-1 rounded">
                                    Achievement Reward
                                </div>
                            ) : (
                                <button className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors">
                                    <Coins size={12} />
                                    {pet.cost}
                                </button>
                            )
                        ) : (
                            <button 
                                className={`w-full mt-2 font-bold text-xs py-2 rounded-lg transition-colors
                                    ${isActive ? `${activeTheme.secondaryColor} text-gray-900` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                `}
                            >
                                {isActive ? 'Selected' : 'Equip'}
                            </button>
                        )}
                    </div>

                    {!isOwned && points < pet.cost && !pet.isSpecial && (
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                            <Lock className="text-gray-400" />
                        </div>
                    )}
                </div>
               );
            })}

            {/* ACCESSORIES TAB */}
            {shopTab === 'accessories' && accessoryCatalog.map(acc => {
                const isOwned = ownedAccessories.includes(acc.id);
                const isActive = activeAccessoryId === acc.id;

                return (
                    <div 
                        key={acc.id} 
                        onClick={() => handleBuyOrEquipAccessory(acc.id, acc.cost, isOwned)}
                        className={`bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer border-2 transition-all relative
                            ${isActive ? 'border-indigo-500 ring-2 ring-indigo-200' : isOwned ? 'border-green-200' : 'border-transparent opacity-90'}
                        `}
                    >
                         <div className={`aspect-square w-full bg-gray-50 relative flex items-center justify-center overflow-hidden`}>
                             <div className="scale-75 translate-y-2">
                                <PetAvatar 
                                    type="bear" 
                                    color="#e5e7eb" 
                                    secondaryColor="#d1d5db" 
                                    mood="happy"
                                    accessoryId={acc.id}
                                    size={120} 
                                />
                             </div>
                            
                            {isOwned && !isActive && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                    <Check size={12} />
                                </div>
                            )}
                            {isActive && (
                                <div className="absolute top-2 right-2 bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                                    ON
                                </div>
                            )}
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold text-gray-800 text-sm truncate mb-1">{acc.name}</h3>
                             {!isOwned ? (
                                <button className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors">
                                    <Coins size={12} />
                                    {acc.cost}
                                </button>
                            ) : (
                                <button 
                                    className={`w-full mt-2 font-bold text-xs py-2 rounded-lg transition-colors
                                        ${isActive ? `${activeTheme.secondaryColor} text-gray-900` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                    `}
                                >
                                    {isActive ? 'Take Off' : 'Wear'}
                                </button>
                            )}
                        </div>
                         {!isOwned && points < acc.cost && (
                            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                                <Lock className="text-gray-400" />
                            </div>
                        )}
                    </div>
                )
            })}

            {/* THEMES TAB */}
            {shopTab === 'themes' && themes.map(theme => {
                const isOwned = ownedThemes.includes(theme.id);
                const isActive = activeTheme.id === theme.id;

                return (
                    <div 
                        key={theme.id}
                        onClick={() => handleBuyOrEquipTheme(theme.id, theme.cost, isOwned)}
                        className={`bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer border-2 transition-all relative
                            ${isActive ? 'border-indigo-500 ring-2 ring-indigo-200' : isOwned ? 'border-green-200' : 'border-transparent opacity-90'}
                        `}
                    >
                         <div className={`aspect-[4/3] w-full bg-gradient-to-br ${theme.gradient} relative flex items-center justify-center overflow-hidden`}>
                             <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-white font-bold shadow-lg">
                                {theme.name}
                             </div>
                             
                             {isOwned && !isActive && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow">
                                    <Check size={12} />
                                </div>
                            )}
                            {isActive && (
                                <div className="absolute top-2 right-2 bg-white text-indigo-600 text-[10px] px-2 py-1 rounded-full font-bold shadow">
                                    ACTIVE
                                </div>
                            )}
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold text-gray-800 text-sm truncate mb-1">{theme.name} Theme</h3>
                            {!isOwned ? (
                                <button className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors">
                                    <Coins size={12} />
                                    {theme.cost}
                                </button>
                            ) : (
                                <button 
                                    className={`w-full mt-2 font-bold text-xs py-2 rounded-lg transition-colors
                                        ${isActive ? `${activeTheme.secondaryColor} text-gray-900` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                    `}
                                >
                                    {isActive ? 'Selected' : 'Apply'}
                                </button>
                            )}
                        </div>
                         {!isOwned && points < theme.cost && (
                            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                                <Lock className="text-gray-400" />
                            </div>
                        )}
                    </div>
                );
            })}
          </div>
      </div>
    </div>
  );
};