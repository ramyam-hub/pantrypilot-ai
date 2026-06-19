import React, { useEffect } from 'react';
import { Archive } from 'lucide-react';
import { useNavigation } from '../App';

export function SplashScreen() {
  const { navigate } = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6">
        <Archive className="w-14 h-14 text-green-600" strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">PantryPilot AI</h1>
      <p className="text-green-100 text-lg">Never run out of anything again</p>
      <div className="mt-12">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
