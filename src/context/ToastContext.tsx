import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'delete';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'delete') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'delete' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg bg-white border border-gray-100 animate-slide-up"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Trash2 className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-medium text-gray-800">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
