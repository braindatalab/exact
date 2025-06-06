'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Storage } from '../utils/storage';

interface SessionContextType {
  isAuthenticated: boolean;
  user: any;
  setSession: (user: any) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = Storage.getLocalStorage('user');
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const setSession = (userData: any) => {
    Storage.setLocalStorage('user', userData);
    Storage.setCookie('sessionActive', true);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearSession = () => {
    Storage.removeLocalStorage('user');
    Storage.removeCookie('sessionActive');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <SessionContext.Provider
      value={{
        isAuthenticated,
        user,
        setSession,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
} 