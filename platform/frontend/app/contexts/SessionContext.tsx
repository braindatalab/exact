'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Storage } from '../utils/storage';
import { useUser } from '../components/UserContext';

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
  const backendUser = useUser();  // Get the user state from UserContext

  useEffect(() => {
  console.log('[Session] checking for existing session…')
  const savedUser = Storage.getLocalStorage('user')

    if (savedUser) {
      console.log('[Session] found user in localStorage:', savedUser)
      setUser(savedUser)
      setIsAuthenticated(true)

    } else {
      // No localStorage user found.
      // Don’t auto‐clear—only clear on logout.
      console.log(
        '[Session] no user in localStorage—leaving cookies intact',
        'sessionActive cookie =',
        Storage.getCookie('sessionActive')
      )

      // Optionally:
      // if (Storage.getCookie('sessionActive')) {
      //   // maybe re-fetch your user from the API
      // }
    }
  }, [])


  const setSession = (userData: any) => {
    console.log('🔐 [Session] setting session for:', userData);
    const ok1 = Storage.setLocalStorage('user', userData);
    const ok2 = Storage.setCookie('sessionActive', 'true');
    console.log('🔐 [Session] setLocalStorage OK?', ok1, 'setCookie OK?', ok2);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearSession = () => {
    console.log('🔓 [Session] clearing session');
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