import React from 'react';
import { GameProvider, useGame } from './components/GameContext';
import { Dashboard } from './components/Dashboard';
import { AddTask } from './components/AddTask';
import { Shop } from './components/Shop';
import { ManageCategories } from './components/ManageCategories';
import { Achievements } from './components/Achievements';
import { Social } from './components/Social';
import { GameView } from './types';

const AppContent: React.FC = () => {
  const { currentView } = useGame();

  // Simple Router based on state
  const renderView = () => {
    switch (currentView) {
      case GameView.ADD_TASK:
        return <AddTask />;
      case GameView.SHOP:
        return <Shop />;
      case GameView.CATEGORIES:
        return <ManageCategories />;
      case GameView.ACHIEVEMENTS:
        return <Achievements />;
      case GameView.SOCIAL:
        return <Social />;
      case GameView.DASHBOARD:
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="w-full h-screen bg-white overflow-hidden relative">
       {/* Full screen mobile-first design */}
       {renderView()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;