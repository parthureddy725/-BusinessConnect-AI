import React, { createContext, useContext, useState } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <UIContext.Provider value={{ showToast }}>
      {children}
      {/* Floating Toasts container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between gap-3 p-4 rounded-xl shadow-xl backdrop-blur-md border animate-float-medium transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-500/90 dark:bg-emerald-950/90 text-white border-emerald-400/30'
                : toast.type === 'error'
                ? 'bg-rose-500/90 dark:bg-rose-950/90 text-white border-rose-400/30'
                : 'bg-amber-500/90 dark:bg-amber-950/90 text-white border-amber-400/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'warning' && <AlertTriangle size={20} />}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
