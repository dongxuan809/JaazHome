import React, { useState } from 'react';
import Home from './components/Home';
import Canvas from './components/Canvas';
import { ViewMode, GenMode, User } from './types';

const MOCK_USER: User = {
  name: 'Jaaz', // Changed from static to dynamic prop usage in Home, but data here matches request screenshot context
  avatarUrl: 'https://picsum.photos/100/100',
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [genMode, setGenMode] = useState<GenMode>(null);

  const handleNavigateToCanvas = (mode: GenMode) => {
    setGenMode(mode);
    setCurrentView('canvas');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setGenMode(null);
  };

  return (
    <>
      {currentView === 'home' && (
        <Home 
          user={MOCK_USER} 
          onNavigateToCanvas={handleNavigateToCanvas} 
        />
      )}
      {currentView === 'canvas' && (
        <Canvas 
          mode={genMode} 
          onBack={handleBackToHome} 
        />
      )}
    </>
  );
};

export default App;