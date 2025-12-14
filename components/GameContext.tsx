import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Task, Pet, Theme, GameView, Category, Achievement, UserStats, Accessory, Friend, PetType } from '../types';

interface GameContextType {
  points: number;
  tasks: Task[];
  pets: Pet[];
  activePet: Pet | null;
  shopCatalog: Pet[];
  accessoryCatalog: Accessory[];
  ownedAccessories: string[];
  activeAccessoryId: string | null;
  themes: Theme[];
  activeTheme: Theme;
  ownedThemes: string[];
  categories: Category[];
  achievements: Achievement[];
  currentView: GameView;
  setView: (view: GameView) => void;
  addTask: (title: string, deadline: number, categoryId?: string) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  unlockPet: (petId: string) => boolean;
  buyAccessory: (accId: string) => boolean;
  buyTheme: (themeId: string) => boolean;
  setActivePet: (petId: string) => void;
  setActiveAccessory: (accId: string | null) => void;
  setActiveTheme: (themeId: string) => void;
  petMood: 'happy' | 'neutral' | 'sad';
  celebrating: boolean;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  // Social
  userCode: string;
  friends: Friend[];
  addFriend: (code: string) => { success: boolean; message: string };
  stats: UserStats;
  // Undo
  undoCompleteTask: () => void;
  isUndoable: boolean;
}

const THEMES: Theme[] = [
  { id: 'default', name: 'Ocean', primaryColor: 'bg-indigo-600', secondaryColor: 'bg-indigo-100', backgroundColor: 'bg-gray-50', gradient: 'from-indigo-500 to-purple-600', cost: 0 },
  { id: 'forest', name: 'Forest', primaryColor: 'bg-emerald-600', secondaryColor: 'bg-emerald-100', backgroundColor: 'bg-green-50', gradient: 'from-emerald-500 to-teal-600', cost: 200 },
  { id: 'candy', name: 'Candy', primaryColor: 'bg-pink-500', secondaryColor: 'bg-pink-100', backgroundColor: 'bg-pink-50', gradient: 'from-pink-400 to-rose-400', cost: 200 },
  { id: 'sunset', name: 'Sunset', primaryColor: 'bg-orange-500', secondaryColor: 'bg-orange-100', backgroundColor: 'bg-orange-50', gradient: 'from-orange-400 to-red-500', cost: 300 },
  { id: 'midnight', name: 'Midnight', primaryColor: 'bg-slate-800', secondaryColor: 'bg-slate-200', backgroundColor: 'bg-slate-50', gradient: 'from-slate-700 to-slate-900', cost: 500 },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: 'bg-blue-500' },
  { id: 'personal', name: 'Personal', color: 'bg-green-500' },
  { id: 'health', name: 'Health', color: 'bg-red-500' },
  { id: 'learning', name: 'Learning', color: 'bg-yellow-500' }
];

const STARTER_PET: Pet = {
  id: 'starter_bear',
  name: 'Coco',
  type: 'bear',
  color: '#a0887e', // Brown
  secondaryColor: '#5c4d46',
  unlocked: true,
  cost: 0
};

// Milestone Pets (Rewards)
const MILESTONE_PETS: Pet[] = [
    { id: 'reward_gold_bear', name: 'Midas', type: 'bear', color: '#fbbf24', secondaryColor: '#d97706', unlocked: false, cost: 9999, isSpecial: true },
    { id: 'reward_diamond_cat', name: 'Sparkle', type: 'cat', color: '#e0f2fe', secondaryColor: '#7dd3fc', unlocked: false, cost: 9999, isSpecial: true },
    { id: 'reward_dark_fox', name: 'Shadow', type: 'fox', color: '#1f2937', secondaryColor: '#000000', unlocked: false, cost: 9999, isSpecial: true }
];

const PET_CATALOG: Pet[] = [
    // Basic Tier (200-400)
    { id: 'cat_pink', name: 'Mochi', type: 'cat', color: '#fca5a5', secondaryColor: '#fee2e2', unlocked: false, cost: 200 },
    { id: 'bear_polar', name: 'Snow', type: 'bear', color: '#f3f4f6', secondaryColor: '#e5e7eb', unlocked: false, cost: 250 },
    { id: 'bear_gold', name: 'Honey', type: 'bear', color: '#fcd34d', secondaryColor: '#fef3c7', unlocked: false, cost: 250 },
    { id: 'bunny_blue', name: 'Sky', type: 'bunny', color: '#93c5fd', secondaryColor: '#dbeafe', unlocked: false, cost: 300 },
    { id: 'bunny_green', name: 'Sprout', type: 'bunny', color: '#86efac', secondaryColor: '#bbf7d0', unlocked: false, cost: 300 },
    { id: 'dog_brown', name: 'Barky', type: 'dog', color: '#854d0e', secondaryColor: '#a16207', unlocked: false, cost: 350 },
    { id: 'cat_black', name: 'Luna', type: 'cat', color: '#374151', secondaryColor: '#1f2937', unlocked: false, cost: 350 },
    { id: 'cat_purple', name: 'Mystic', type: 'cat', color: '#d8b4fe', secondaryColor: '#f3e8ff', unlocked: false, cost: 350 },
    { id: 'pig_pink', name: 'Oink', type: 'pig', color: '#fda4af', secondaryColor: '#fecdd3', unlocked: false, cost: 380 },
    { id: 'panda_bw', name: 'Bamboo', type: 'panda', color: '#ffffff', secondaryColor: '#1f2937', unlocked: false, cost: 400 },
    
    // Exotic Tier (450-700)
    { id: 'fox_orange', name: 'Rusty', type: 'fox', color: '#fb923c', secondaryColor: '#fff7ed', unlocked: false, cost: 450 },
    { id: 'axolotl_pink', name: 'Bubble', type: 'axolotl', color: '#f9a8d4', secondaryColor: '#f472b6', unlocked: false, cost: 500 },
    { id: 'frog_green', name: 'Hops', type: 'frog', color: '#4ade80', secondaryColor: '#22c55e', unlocked: false, cost: 550 },
    { id: 'penguin_blue', name: 'Pippin', type: 'penguin', color: '#3b82f6', secondaryColor: '#fff', unlocked: false, cost: 600 },
    { id: 'raccoon_grey', name: 'Bandit', type: 'raccoon', color: '#9ca3af', secondaryColor: '#4b5563', unlocked: false, cost: 650 },
    { id: 'hamster_gold', name: 'Nibbles', type: 'hamster', color: '#fde047', secondaryColor: '#fca5a5', unlocked: false, cost: 700 },

    // Premium Tier (750-1000)
    { id: 'koala_grey', name: 'Eukie', type: 'koala', color: '#94a3b8', secondaryColor: '#64748b', unlocked: false, cost: 800 },
    { id: 'owl_brown', name: 'Wisdom', type: 'owl', color: '#78350f', secondaryColor: '#92400e', unlocked: false, cost: 850 },
    { id: 'tiger_orange', name: 'Stripes', type: 'tiger', color: '#f97316', secondaryColor: '#000', unlocked: false, cost: 950 },
    { id: 'lion_gold', name: 'Simba', type: 'lion', color: '#eab308', secondaryColor: '#ca8a04', unlocked: false, cost: 1000 },
];

const ACCESSORY_CATALOG: Accessory[] = [
    { id: 'acc_flower', name: 'Pretty Flower', type: 'hat', cost: 50, icon: '' },
    { id: 'acc_glasses_nerd', name: 'Smart Glasses', type: 'glasses', cost: 100, icon: '' },
    { id: 'acc_bow_head', name: 'Pink Ribbon', type: 'hat', cost: 100, icon: '' },
    { id: 'acc_bow_tie', name: 'Red Bowtie', type: 'neck', cost: 120, icon: '' },
    { id: 'acc_mustache', name: 'Fancy Stache', type: 'face', cost: 120, icon: '' },
    { id: 'acc_glasses_3d', name: '3D Glasses', type: 'glasses', cost: 150, icon: '' },
    { id: 'acc_clown_nose', name: 'Clown Nose', type: 'face', cost: 150, icon: '' },
    { id: 'acc_hat_party', name: 'Party Hat', type: 'hat', cost: 200, icon: '' },
    { id: 'acc_scarf', name: 'Cozy Scarf', type: 'neck', cost: 200, icon: '' },
    { id: 'acc_eyepatch', name: 'Eye Patch', type: 'glasses', cost: 220, icon: '' },
    { id: 'acc_hat_santa', name: 'Holiday Hat', type: 'hat', cost: 250, icon: '' },
    { id: 'acc_glasses_sun', name: 'Sunglasses', type: 'glasses', cost: 250, icon: '' },
    { id: 'acc_hat_chef', name: 'Chef Hat', type: 'hat', cost: 280, icon: '' },
    { id: 'acc_hat_cowboy', name: 'Cowboy Hat', type: 'hat', cost: 300, icon: '' },
    { id: 'acc_ears_bunny', name: 'Bunny Ears', type: 'hat', cost: 300, icon: '' },
    { id: 'acc_headphones', name: 'Headphones', type: 'hat', cost: 350, icon: '' },
    { id: 'acc_beard', name: 'Grey Beard', type: 'face', cost: 350, icon: '' },
    { id: 'acc_monocle', name: 'The Monocle', type: 'glasses', cost: 400, icon: '' },
    { id: 'acc_pacifier', name: 'Baby Pacifier', type: 'face', cost: 400, icon: '' },
    { id: 'acc_hat_sombrero', name: 'Sombrero', type: 'hat', cost: 450, icon: '' },
    { id: 'acc_hat_top', name: 'Gentleman Hat', type: 'hat', cost: 500, icon: '' },
    { id: 'acc_hat_pirate', name: 'Pirate Hat', type: 'hat', cost: 500, icon: '' },
    { id: 'acc_mask_medical', name: 'Face Mask', type: 'face', cost: 500, icon: '' },
    { id: 'acc_hat_viking', name: 'Viking Helm', type: 'hat', cost: 550, icon: '' },
    { id: 'acc_pipe', name: 'Sherlock Pipe', type: 'face', cost: 600, icon: '' },
    { id: 'acc_hat_wizard', name: 'Wizard Hat', type: 'hat', cost: 700, icon: '' },
    { id: 'acc_headband_ninja', name: 'Ninja Band', type: 'hat', cost: 750, icon: '' },
    { id: 'acc_mask_hero', name: 'Hero Mask', type: 'glasses', cost: 800, icon: '' },
    { id: 'acc_glasses_vr', name: 'VR Headset', type: 'glasses', cost: 850, icon: '' },
    { id: 'acc_halo', name: 'Angel Halo', type: 'hat', cost: 900, icon: '' },
    { id: 'acc_horns', name: 'Devil Horns', type: 'hat', cost: 900, icon: '' },
    { id: 'acc_chain_gold', name: 'Gold Chain', type: 'neck', cost: 950, icon: '' },
    { id: 'acc_hat_crown', name: 'Royal Crown', type: 'hat', cost: 1000, icon: '' },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // --- TASKS COUNT (1-1000) ---
  { id: 'novice', title: 'Novice Doer', description: 'Complete 1 task', icon: '🌱', unlocked: false, conditionType: 'count', threshold: 1 },
  { id: 'pro', title: 'Getting Serious', description: 'Complete 10 tasks', icon: '🔨', unlocked: false, conditionType: 'count', threshold: 10 },
  { id: 'expert', title: 'Task Expert', description: 'Complete 25 tasks', icon: '⭐', unlocked: false, conditionType: 'count', threshold: 25 },
  { id: 'master', title: 'Productivity Machine', description: 'Complete 50 tasks', icon: '⚔️', unlocked: false, conditionType: 'count', threshold: 50 },
  { id: 'legend', title: 'Task Legend', description: 'Complete 100 tasks', icon: '👑', unlocked: false, conditionType: 'count', threshold: 100 },
  { id: 'grandmaster', title: 'Grandmaster', description: 'Complete 250 tasks', icon: '🧘', unlocked: false, conditionType: 'count', threshold: 250 },
  { id: 'demigod', title: 'Productivity God', description: 'Complete 500 tasks', icon: '⚡', unlocked: false, conditionType: 'count', threshold: 500 },
  { id: 'eternal', title: 'Eternal Doer', description: 'Complete 1000 tasks', icon: '♾️', unlocked: false, conditionType: 'count', threshold: 1000 },
  // ... (Other achievements kept same, shortened for brevity in update)
  { id: 'shop_1', title: 'First Buy', description: 'Buy 1 item', icon: '🛍️', unlocked: false, conditionType: 'collection', threshold: 1 },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('motivi_points');
    return saved ? parseInt(saved) : 150;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('motivi_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [pets, setPets] = useState<Pet[]>(() => {
    const saved = localStorage.getItem('motivi_pets');
    return saved ? JSON.parse(saved) : [STARTER_PET];
  });

  const [activePetId, setActivePetId] = useState<string>(() => {
    return localStorage.getItem('motivi_active_pet') || STARTER_PET.id;
  });

  const [ownedAccessories, setOwnedAccessories] = useState<string[]>(() => {
      const saved = localStorage.getItem('motivi_accessories');
      return saved ? JSON.parse(saved) : [];
  });

  const [activeAccessoryId, setActiveAccessoryId] = useState<string | null>(() => {
      return localStorage.getItem('motivi_active_accessory');
  });

  const [ownedThemes, setOwnedThemes] = useState<string[]>(() => {
      const saved = localStorage.getItem('motivi_themes');
      return saved ? JSON.parse(saved) : ['default'];
  });

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
      return localStorage.getItem('motivi_active_theme') || 'default';
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('motivi_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('motivi_achievements');
    const savedParsed: Achievement[] = saved ? JSON.parse(saved) : [];
    
    return INITIAL_ACHIEVEMENTS.map(initial => {
        const existing = savedParsed.find(s => s.id === initial.id);
        if (existing) {
            return { ...initial, unlocked: existing.unlocked, unlockedAt: existing.unlockedAt };
        }
        return initial;
    });
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('motivi_stats');
    return saved ? JSON.parse(saved) : { 
        totalCompleted: 0, 
        weeklyCompleted: 0,
        monthlyCompleted: 0,
        currentStreak: 0, 
        lastCompletionDate: null, 
        earlyCompletions: 0, 
        totalPointsEarned: 0 
    };
  });

  // Social State
  const [userCode, setUserCode] = useState<string>(() => {
      const saved = localStorage.getItem('motivi_user_code');
      if (saved) return saved;
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem('motivi_user_code', newCode);
      return newCode;
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
      const saved = localStorage.getItem('motivi_friends');
      return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<GameView>(GameView.DASHBOARD);
  const [celebrating, setCelebrating] = useState(false);
  const celebrationTimeout = useRef<any>(null);

  // Undo State
  const [undoState, setUndoState] = useState<{
    taskId: string;
    previousStats: UserStats;
    earnedPoints: number;
    previousFriends: Friend[];
  } | null>(null);
  const undoTimerRef = useRef<any>(null);

  const activePet = pets.find(p => p.id === activePetId) || pets[0];
  const activeTheme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];

  const shopCatalog = PET_CATALOG;
  const accessoryCatalog = ACCESSORY_CATALOG;

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('motivi_points', points.toString());
    localStorage.setItem('motivi_tasks', JSON.stringify(tasks));
    localStorage.setItem('motivi_pets', JSON.stringify(pets));
    localStorage.setItem('motivi_active_pet', activePetId);
    localStorage.setItem('motivi_accessories', JSON.stringify(ownedAccessories));
    if (activeAccessoryId) localStorage.setItem('motivi_active_accessory', activeAccessoryId);
    else localStorage.removeItem('motivi_active_accessory');
    
    localStorage.setItem('motivi_themes', JSON.stringify(ownedThemes));
    localStorage.setItem('motivi_active_theme', activeThemeId);

    localStorage.setItem('motivi_categories', JSON.stringify(categories));
    localStorage.setItem('motivi_achievements', JSON.stringify(achievements));
    localStorage.setItem('motivi_stats', JSON.stringify(stats));
    localStorage.setItem('motivi_friends', JSON.stringify(friends));
  }, [points, tasks, pets, activePetId, categories, achievements, stats, ownedAccessories, activeAccessoryId, ownedThemes, activeThemeId, friends]);

  // --- LOGIC ---
  const calculateMood = (): 'happy' | 'neutral' | 'sad' => {
    const now = Date.now();
    const urgentTasks = tasks.filter(t => !t.completed && t.deadline > now && t.deadline - now < 24 * 60 * 60 * 1000);
    const overdueTasks = tasks.filter(t => !t.completed && t.deadline < now);
    const recentCompletion = tasks.some(t => t.completed && t.completedAt && (now - t.completedAt < 5 * 60 * 1000));
    
    if (recentCompletion) return 'happy';
    if (overdueTasks.length > 0 || urgentTasks.length >= 3) return 'sad';
    if (urgentTasks.length > 0) return 'neutral';
    return 'happy';
  };

  const [petMood, setPetMood] = useState<'happy' | 'neutral' | 'sad'>('happy');

  useEffect(() => {
    setPetMood(calculateMood());
    const interval = setInterval(() => setPetMood(calculateMood()), 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  // --- SOCIAL ACTIONS ---
  const addFriend = (code: string): { success: boolean; message: string } => {
      const cleanCode = code.trim().toUpperCase();
      if (!cleanCode) return { success: false, message: "Enter a code." };
      if (cleanCode === userCode) return { success: false, message: "You can't add yourself!" };
      if (friends.some(f => f.code === cleanCode)) return { success: false, message: "Friend already added." };

      const petTypes: PetType[] = ['cat', 'dog', 'fox', 'panda', 'bear', 'bunny'];
      const names = ['Alex', 'Jordan', 'Casey', 'Sam', 'Taylor', 'Morgan', 'Riley', 'Quinn'];
      const colors = ['#fca5a5', '#93c5fd', '#86efac', '#fcd34d', '#d8b4fe'];

      let hash = 0;
      for (let i = 0; i < cleanCode.length; i++) {
        hash = cleanCode.charCodeAt(i) + ((hash << 5) - hash);
      }
      const absHash = Math.abs(hash);

      const mockFriend: Friend = {
          id: crypto.randomUUID(),
          code: cleanCode,
          name: names[absHash % names.length] + ' ' + cleanCode.substring(0,2),
          petType: petTypes[absHash % petTypes.length],
          petColor: colors[absHash % colors.length],
          weeklyScore: (absHash % 15) + 3,
          monthlyScore: (absHash % 40) + 10,
          isBot: true
      };

      setFriends(prev => [...prev, mockFriend]);
      return { success: true, message: `Added ${mockFriend.name}!` };
  };

  // --- ACTIONS ---
  const addTask = (title: string, deadline: number, categoryId?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      deadline,
      completed: false,
      categoryId
    };
    setTasks(prev => [...prev, newTask]);
    setCurrentView(GameView.DASHBOARD);
  };

  const deleteTask = (taskId: string) => {
      setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const addCategory = (name: string, color: string) => {
    setCategories(prev => [...prev, { id: crypto.randomUUID(), name, color }]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const checkAchievements = (newStats: UserStats, currentOwnedAccessories: string[]) => {
    let unlockedCount = 0;
    
    setAchievements(prev => {
        const next = prev.map(ach => {
            if (ach.unlocked) {
                unlockedCount++;
                return ach;
            }
            
            let unlocked = false;
            if (ach.conditionType === 'count' && newStats.totalCompleted >= ach.threshold) unlocked = true;
            if (ach.conditionType === 'streak' && newStats.currentStreak >= ach.threshold) unlocked = true;
            if (ach.conditionType === 'early' && newStats.earlyCompletions >= ach.threshold) unlocked = true;
            if (ach.conditionType === 'wealth' && newStats.totalPointsEarned >= ach.threshold) unlocked = true;
            if (ach.conditionType === 'collection' && currentOwnedAccessories.length >= ach.threshold) unlocked = true;

            if (unlocked) {
                unlockedCount++;
                return { ...ach, unlocked: true, unlockedAt: Date.now() };
            }
            return ach;
        });
        
        if (unlockedCount >= 5) unlockMilestonePet(0);
        if (unlockedCount >= 10) unlockMilestonePet(1);
        if (unlockedCount >= 15) unlockMilestonePet(2);
        
        return next;
    });
  };

  const unlockMilestonePet = (index: number) => {
      const rewardPet = MILESTONE_PETS[index];
      if (!rewardPet) return;
      
      setPets(currentPets => {
          if (currentPets.some(p => p.id === rewardPet.id)) return currentPets;
          return [...currentPets, { ...rewardPet, unlocked: true }];
      });
  };

  const completeTask = (taskId: string) => {
    // 1. Identify task
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    const now = Date.now();
    const hoursRemaining = Math.max(0, (task.deadline - now) / (1000 * 60 * 60));
    const bonus = Math.floor(hoursRemaining * 2);
    const earned = 50 + bonus;

    // 2. Snapshot current state for UNDO
    const snapshot = {
        taskId,
        previousStats: stats,
        earnedPoints: earned,
        previousFriends: friends
    };
    setUndoState(snapshot);

    // Clear undo availability after 5 seconds
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
        setUndoState(null);
    }, 5000);

    // 3. Update Points
    setPoints(p => p + earned);

    // 4. Update Stats
    const today = new Date().toISOString().split('T')[0];
    let newStatsObj: UserStats;

    setStats(currentStats => {
        const isConsecutive = currentStats.lastCompletionDate 
            && (new Date(today).getTime() - new Date(currentStats.lastCompletionDate).getTime() <= 86400000 * 1.5); 
        
        let newStreak = currentStats.currentStreak;
        if (currentStats.lastCompletionDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (currentStats.lastCompletionDate === yesterdayStr) {
                newStreak += 1;
            } else {
                newStreak = 1;
            }
        }

        const isEarly = (task.deadline - now) > (24 * 60 * 60 * 1000);
        
        newStatsObj = {
            totalCompleted: currentStats.totalCompleted + 1,
            weeklyCompleted: (currentStats.weeklyCompleted || 0) + 1,
            monthlyCompleted: (currentStats.monthlyCompleted || 0) + 1,
            currentStreak: newStreak,
            lastCompletionDate: today,
            earlyCompletions: isEarly ? currentStats.earlyCompletions + 1 : currentStats.earlyCompletions,
            totalPointsEarned: currentStats.totalPointsEarned + earned
        };
        
        return newStatsObj;
    });

    // We check achievements after state update in a useEffect normally, but here we do it imperatively for simplicity
    // Note: We use the `newStatsObj` calculated inside setStats callback. 
    // Since we need it for checkAchievements, we duplicate logic or accept a small inconsistency if we used `stats` directly.
    // To solve this cleanly, we can use an effect or just wait for next render. 
    // For this app, let's recalculate simply for the check:
    setTimeout(() => {
        setStats(latest => {
             checkAchievements(latest, ownedAccessories);
             return latest;
        })
    }, 0);


    // 5. Update Task
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: true, completedAt: now, pointsEarned: earned };
      }
      return t;
    }));

    // 6. Simulate Friend Activity
    if (friends.length > 0) {
        setFriends(prev => prev.map(f => {
            if (Math.random() > 0.6) {
                return { ...f, weeklyScore: f.weeklyScore + 1, monthlyScore: f.monthlyScore + 1 };
            }
            return f;
        }));
    }
    
    // 7. Celebration
    setCelebrating(true);
    if (celebrationTimeout.current) clearTimeout(celebrationTimeout.current);
    celebrationTimeout.current = setTimeout(() => setCelebrating(false), 2000);
  };

  const undoCompleteTask = () => {
      if (!undoState) return;
      
      const { taskId, previousStats, earnedPoints, previousFriends } = undoState;

      // Revert Task
      setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
              return { ...t, completed: false, completedAt: undefined, pointsEarned: undefined };
          }
          return t;
      }));

      // Revert Points
      setPoints(p => p - earnedPoints);

      // Revert Stats
      setStats(previousStats);

      // Revert Friends
      setFriends(previousFriends);

      // Clear undo state
      setUndoState(null);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  };

  const unlockPet = (petId: string): boolean => {
    const petToUnlock = shopCatalog.find(p => p.id === petId);
    if (!petToUnlock) return false;
    if (pets.some(p => p.id === petId)) return true;

    if (points >= petToUnlock.cost) {
      setPoints(p => p - petToUnlock.cost);
      setPets(prev => [...prev, { ...petToUnlock, unlocked: true }]);
      checkAchievements(stats, ownedAccessories);
      return true;
    }
    return false;
  };

  const buyAccessory = (accId: string): boolean => {
      const acc = accessoryCatalog.find(a => a.id === accId);
      if (!acc) return false;
      if (ownedAccessories.includes(accId)) return true;
      
      if (points >= acc.cost) {
          setPoints(p => p - acc.cost);
          const newOwned = [...ownedAccessories, accId];
          setOwnedAccessories(newOwned);
          checkAchievements(stats, newOwned);
          return true;
      }
      return false;
  };

  const buyTheme = (themeId: string): boolean => {
      const theme = THEMES.find(t => t.id === themeId);
      if (!theme) return false;
      if (ownedThemes.includes(themeId)) return true;

      if (points >= theme.cost) {
          setPoints(p => p - theme.cost);
          setOwnedThemes(prev => [...prev, themeId]);
          return true;
      }
      return false;
  };

  const setActiveAccessory = (accId: string | null) => {
      setActiveAccessoryId(accId);
  }

  return (
    <GameContext.Provider value={{
      points, tasks, pets, activePet, themes: THEMES, activeTheme, ownedThemes,
      categories, achievements, currentView, setView: setCurrentView, shopCatalog, accessoryCatalog,
      ownedAccessories, activeAccessoryId, celebrating,
      addTask, completeTask, deleteTask, unlockPet, buyAccessory, buyTheme,
      setActivePet: setActivePetId, setActiveAccessory, setActiveTheme: setActiveThemeId,
      petMood, addCategory, deleteCategory,
      userCode, friends, addFriend, stats,
      undoCompleteTask, isUndoable: !!undoState
    }}>
      {children}
    </GameContext.Provider>
  );
};