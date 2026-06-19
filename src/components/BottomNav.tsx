import React from 'react';
import { Home, Grid3X3, PlusCircle, ShoppingCart } from 'lucide-react';
import { useNavigation, Screen } from '../App';

const navItems: { screen: Screen; icon: React.ElementType; label: string; isAdd?: boolean }[] = [
  { screen: 'dashboard', icon: Home, label: 'Home' },
  { screen: 'inventory', icon: Grid3X3, label: 'Pantry' },
  { screen: 'add', icon: PlusCircle, label: 'Add', isAdd: true },
  { screen: 'shopping', icon: ShoppingCart, label: 'Shopping' },
];

export function BottomNav() {
  const { currentScreen, navigate } = useNavigation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-[430px] mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ screen, icon: Icon, label, isAdd }) => {
            const isActive = currentScreen === screen;
            return (
              <button
                key={screen}
                onClick={() => navigate(screen)}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 px-3 transition-colors ${
                  isAdd
                    ? 'text-green-600 -mt-4'
                    : isActive
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <Icon
                  className={isAdd ? 'w-10 h-10' : 'w-6 h-6'}
                  strokeWidth={isAdd ? 2 : 1.5}
                />
                <span className={`text-xs ${isAdd ? 'font-semibold' : ''}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
