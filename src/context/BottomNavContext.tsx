import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ShortcutKey = 'journal' | 'companion' | 'trends' | 'symptoms' | 'settings' | 'careplan' | 'reports' | 'medicalhistory' | 'integrations' | 'menuscan';

interface BottomNavContextType {
  shortcuts: ShortcutKey[];
  addShortcut: (key: ShortcutKey) => void;
  removeShortcut: (key: ShortcutKey) => void;
}

const defaultShortcuts: ShortcutKey[] = ['journal', 'companion', 'trends'];
const STORAGE_KEY = 'forela_shortcuts';

// Migration function to clean up old data
const migrateShortcuts = (stored: any[]): ShortcutKey[] => {
  if (!Array.isArray(stored)) return defaultShortcuts;
  
  const validShortcuts: ShortcutKey[] = [];
  const validKeys: ShortcutKey[] = ['journal', 'companion', 'trends', 'symptoms', 'settings', 'careplan', 'reports', 'medicalhistory', 'integrations', 'menuscan'];
  
  for (const item of stored) {
    if (validKeys.includes(item) && !validShortcuts.includes(item)) {
      validShortcuts.push(item);
    }
  }
  
  // If no valid shortcuts or old analytics found, return defaults
  if (validShortcuts.length === 0 || stored.includes('analytics')) {
    return defaultShortcuts;
  }
  
  return validShortcuts;
};

const BottomNavContext = createContext<BottomNavContextType | undefined>(undefined);

export const BottomNavProvider = ({ children }: { children: ReactNode }) => {
  const [shortcuts, setShortcuts] = useState<ShortcutKey[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return migrateShortcuts(parsed);
      } catch {
        return defaultShortcuts;
      }
    }
    return defaultShortcuts;
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