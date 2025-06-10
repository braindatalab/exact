# Cookie Handling and Caching Guide

This guide provides a comprehensive walkthrough for implementing cookie handling, local storage management, and user consent in a Next.js application. This implementation follows best practices and GDPR compliance requirements.

## Table of Contents
1. [Overview](#overview)
2. [Implementation Steps](#implementation-steps)
3. [Components Structure](#components-structure)
4. [Detailed Implementation](#detailed-implementation)
5. [Testing](#testing)
6. [Best Practices](#best-practices)

## Overview

The implementation consists of three main parts:
1. Storage utility for managing cookies and local storage
2. Cookie consent management
3. Session handling with proper caching

### Prerequisites
- Next.js project
- TypeScript
- js-cookie library (`npm install js-cookie @types/js-cookie`)

## Implementation Steps

### 1. Set Up Storage Utility

First, create a utility class to handle all storage operations (`app/utils/storage.ts`):

```typescript
import Cookies from 'js-cookie';

interface CookieOptions {
  expires?: number | Date;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const defaultOptions: CookieOptions = {
  expires: 7,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

export class Storage {
  // Check for user consent
  private static hasConsent(): boolean {
    const consent = Cookies.get('cookieConsent');
    return consent === 'accepted';
  }

  // Cookie methods
  static setCookie(key: string, value: any, options: CookieOptions = {}) {
    if (key === 'cookieConsent' || this.hasConsent()) {
      const mergedOptions = { ...defaultOptions, ...options };
      Cookies.set(key, typeof value === 'string' ? value : JSON.stringify(value), mergedOptions);
      return true;
    }
    return false;
  }

  static getCookie(key: string) {
    if (key === 'cookieConsent' || this.hasConsent()) {
      const value = Cookies.get(key);
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return value;
      }
    }
    return null;
  }

  // LocalStorage methods
  static setLocalStorage(key: string, value: any) {
    if (this.hasConsent()) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
      }
    }
    return false;
  }

  static getLocalStorage(key: string) {
    if (this.hasConsent()) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        return null;
      }
    }
    return null;
  }
}
```

### 2. Create Cookie Consent Component

Create a component to handle user consent (`app/components/CookieConsent.tsx`):

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Paper, Text, Group, Button, Box } from '@mantine/core';
import { Storage } from '../utils/storage';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const consent = Storage.getCookie('cookieConsent');
    if (consent === 'accepted' || consent === 'declined') {
      setShowBanner(false);
    }
  }, []);

  const handleAccept = () => {
    Storage.setCookie('cookieConsent', 'accepted', { expires: 365 });
    setShowBanner(false);
  };

  const handleDecline = () => {
    Storage.setCookie('cookieConsent', 'declined', { expires: 1 });
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <Paper shadow="md" p="md" withBorder bg="white">
        <Group justify="space-between" align="center">
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={500}>Cookie Consent</Text>
            <Text size="sm" c="dimmed" mt={4}>
              This website uses cookies to improve your experience.
            </Text>
          </Box>
          <Group gap="sm">
            <Button variant="outline" onClick={handleDecline}>
              Decline
            </Button>
            <Button onClick={handleAccept}>
              Accept
            </Button>
          </Group>
        </Group>
      </Paper>
    </Box>
  );
}
```

### 3. Implement Session Handling

Create a session context (`app/contexts/SessionContext.tsx`):

```typescript
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
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const setSession = (userData: any) => {
    Storage.setLocalStorage('user', userData);
    Storage.setCookie('sessionActive', 'true');
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
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
```

## Components Structure

```
app/
├── components/
│   ├── CookieConsent.tsx    # Cookie consent banner
│   └── ClientWrapper.tsx    # Client-side wrapper component
├── contexts/
│   └── SessionContext.tsx   # Session management
└── utils/
    └── storage.ts           # Storage utility
```

## Best Practices

1. **Cookie Consent**
   - Always show the consent banner on first visit
   - Store consent decision in a cookie
   - Set appropriate expiration times (1 year for accept, 1 day for decline)
   - Clear non-essential cookies when consent is declined

2. **Security**
   - Use `secure` flag in production
   - Implement proper `sameSite` attributes
   - Never store sensitive information in client storage
   - Use HTTP-only cookies for sensitive data

3. **Performance**
   - Use local storage for larger data
   - Use cookies for essential session data
   - Implement proper error handling
   - Clear old/unused data

4. **GDPR Compliance**
   - Provide clear consent options
   - Allow users to decline cookies
   - Make consent revocable
   - Only store necessary data

## Testing

Test your implementation by:

1. **Consent Flow**
   ```javascript
   // Clear existing storage
   localStorage.clear();
   Cookies.remove('cookieConsent');

   // Verify banner appears
   expect(screen.getByText('Cookie Consent')).toBeInTheDocument();

   // Test accept flow
   fireEvent.click(screen.getByText('Accept'));
   expect(Cookies.get('cookieConsent')).toBe('accepted');

   // Test decline flow
   fireEvent.click(screen.getByText('Decline'));
   expect(Cookies.get('cookieConsent')).toBe('declined');
   ```

2. **Storage Operations**
   ```javascript
   // Test storage with consent
   Storage.setCookie('cookieConsent', 'accepted');
   Storage.setLocalStorage('testKey', 'testValue');
   expect(Storage.getLocalStorage('testKey')).toBe('testValue');

   // Test storage without consent
   Storage.setCookie('cookieConsent', 'declined');
   Storage.setLocalStorage('testKey', 'testValue');
   expect(Storage.getLocalStorage('testKey')).toBeNull();
   ```

## Common Issues and Solutions

1. **Cookie Not Saving**
   - Check domain settings
   - Verify secure flag configuration
   - Ensure proper consent handling

2. **Consent Banner Reappearing**
   - Verify cookie expiration
   - Check consent cookie path
   - Validate storage implementation

3. **Session Issues**
   - Implement proper error handling
   - Use appropriate storage method
   - Handle expired sessions

## Additional Resources

- [MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [js-cookie Documentation](https://github.com/js-cookie/js-cookie)
- [GDPR Compliance Guide](https://gdpr.eu/cookies/)
- [Next.js Documentation](https://nextjs.org/docs) 