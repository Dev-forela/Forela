import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ShortcutKey = 'journal' | 'companion' | 'analytics' | 'symptoms' | 'settings';

interface BottomNavContextType {
  shortcuts: ShortcutKey[];
  addShortcut: (key: ShortcutKey) => void;
  removeShortcut: (key: ShortcutKey) => void;
}

const defaultShortcuts: ShortcutKey[] = ['journal', 'companion', 'analytics'];
const STORAGE_KEY = 'forela_shortcuts';

const BottomNavContext = createContext<BottomNavContextType | undefined>(undefined);

export const BottomNavProvider = ({ children }: { children: ReactNode }) => {
  const [shortcuts, setShortcuts] = useState<ShortcutKey[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ShortcutKey[]) : defaultShortcuts;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
  }, [shortcuts]);

  const addShortcut = (key: ShortcutKey) => {
    setShortcuts((prev) => {
      if (prev.includes(key)) return prev;
      if (prev.length >= 3) {
        // Remove the oldest and add the new one
        return [...prev.slice(1), key];
      }
      return [...prev, key];
    });
  };

  const removeShortcut = (key: ShortcutKey) => {
    setShortcuts((prev) => prev.filter((k) => k !== key));
  };

  return (
    <BottomNavContext.Provider value={{ shortcuts, addShortcut, removeShortcut }}>
      {children}
    </BottomNavContext.Provider>
  );
};

export const useBottomNav = () => {
  const ctx = useContext(BottomNavContext);
  if (!ctx) throw new Error('useBottomNav must be used within BottomNavProvider');
  return ctx;
}; 