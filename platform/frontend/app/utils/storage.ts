import Cookies from 'js-cookie';

// Cookie options type
interface CookieOptions {
  expires?: number | Date;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

// Default cookie options
const defaultOptions: CookieOptions = {
  expires: 7, // 7 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

// Storage class to handle both cookies and localStorage
export class Storage {
  private static lastConsentCheck: number = 0;
  private static lastConsentStatus: string | undefined = undefined;
  private static readonly CHECK_INTERVAL = 1000; // 1 second

  private static hasConsent(): boolean {
    const now = Date.now();
    // Only check and log if enough time has passed since last check
    if (now - this.lastConsentCheck > this.CHECK_INTERVAL) {
      const consent = Cookies.get('cookieConsent');
      if (consent !== this.lastConsentStatus) {
        console.log('🍪 Cookie consent status:', consent || 'undefined');
        this.lastConsentStatus = consent;
      }
      this.lastConsentCheck = now;
      return consent === 'accepted';
    }
    return this.lastConsentStatus === 'accepted';
  }

  // Cookie methods
  static setCookie(key: string, value: any, options: CookieOptions = {}) {
    // Always allow setting the cookieConsent cookie
    if (key === 'cookieConsent') {
      const mergedOptions = { ...defaultOptions, ...options };
      Cookies.set(key, typeof value === 'string' ? value : JSON.stringify(value), mergedOptions);
      return true;
    }
    
    if (this.hasConsent()) {
      const mergedOptions = { ...defaultOptions, ...options };
      Cookies.set(key, typeof value === 'string' ? value : JSON.stringify(value), mergedOptions);
      return true;
    }
    return false;
  }

  static getCookie(key: string) {
    // Always allow reading the cookieConsent cookie
    const value = Cookies.get(key);
    
    if (key === 'cookieConsent') {
      return value;
    }
    
    if (this.hasConsent()) {
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return value;
      }
    }
    return null;
  }

  static removeCookie(key: string) {
    // Always allow removing any cookie
    Cookies.remove(key, { path: '/' });
  }

  // LocalStorage methods with error handling
  static setLocalStorage(key: string, value: any) {
    if (this.hasConsent()) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
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

  static removeLocalStorage(key: string) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  static clearLocalStorage() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Session methods
  static setSession(key: string, value: any) {
    if (this.hasConsent()) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  static getSession(key: string) {
    if (this.hasConsent()) {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  static removeSession(key: string) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  static clearSession() {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      return false;
    }
  }
} 