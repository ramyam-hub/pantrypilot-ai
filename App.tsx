import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './pages/SplashScreen';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { AddItem } from './pages/AddItem';
import { ShoppingList } from './pages/ShoppingList';

export type Screen = 'splash' | 'dashboard' | 'inventory' | 'add' | 'edit' | 'shopping';

interface NavigationContextValue {
  currentScreen: Screen;
  navigate: (screen: Screen, itemId?: string) => void;
  editingItemId: string | null;
}

export const NavigationContext = React.createContext<NavigationContextValue | null>(null);

export function useNavigation() {
  const context = React.useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (currentScreen !== 'splash') {
      setEditingItemId(null);
    }
  }, [currentScreen]);

  const navigate = (screen: Screen, itemId?: string) => {
    setCurrentScreen(screen);
    if (itemId) {
      setEditingItemId(itemId);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'add':
        return <AddItem />;
      case 'edit':
        return <AddItem />;
      case 'shopping':
        return <ShoppingList />;
      default:
        return <Dashboard />;
    }
  };

  const showBottomNav = currentScreen !== 'splash' && currentScreen !== 'add' && currentScreen !== 'edit';

  return (
    <ToastProvider>
      <NavigationContext.Provider value={{ currentScreen, navigate, editingItemId }}>
        <div className="min-h-screen bg-gray-50 flex justify-center w-full">
          <div className="w-full max-w-[430px] relative overflow-x-hidden">
            {renderScreen()}
            {showBottomNav && <BottomNav />}
          </div>
        </div>
      </NavigationContext.Provider>
    </ToastProvider>
  );
}

export default App;
