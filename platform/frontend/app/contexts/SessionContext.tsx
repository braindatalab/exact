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
    const savedUser = Storage.getLocalStorage('user');
    if (savedUser) {
      console.log('👤 User authenticated:', savedUser.username || 'Unknown user');
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const setSession = (userData: any) => {
    Storage.setLocalStorage('user', userData);
    Storage.setCookie('sessionActive', 'true');
    setUser(userData);
    setIsAuthenticated(true);
    console.log('👤 User logged in:', userData.username || 'Unknown user');
  };

  const clearSession = () => {
    Storage.removeLocalStorage('user');
    Storage.removeCookie('sessionActive');
    setUser(null);
    setIsAuthenticated(false);
    console.log('👤 User logged out');
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