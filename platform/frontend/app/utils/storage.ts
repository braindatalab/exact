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
  private static hasConsent(): boolean {
    const consent = Cookies.get('cookieConsent');
    console.log('Checking cookie consent:', consent);
    return consent === 'accepted';
  }

  // Cookie methods
  static setCookie(key: string, value: any, options: CookieOptions = {}) {
    // Always allow setting the cookieConsent cookie
    if (key === 'cookieConsent') {
      console.log('Setting cookieConsent cookie:', value);
      const mergedOptions = { ...defaultOptions, ...options };
      Cookies.set(key, typeof value === 'string' ? value : JSON.stringify(value), mergedOptions);
      return true;
    }
    
    if (this.hasConsent()) {
      console.log('Setting cookie with consent:', key, value);
      const mergedOptions = { ...defaultOptions, ...options };
      Cookies.set(key, typeof value === 'string' ? value : JSON.stringify(value), mergedOptions);
      return true;
    }
    
    console.log('Blocked setting cookie (no consent):', key);
    return false;
  }

  static getCookie(key: string) {
    // Always allow reading the cookieConsent cookie
    const value = Cookies.get(key);
    
    if (key === 'cookieConsent') {
      console.log('Reading cookieConsent cookie:', value);
      return value;
    }
    
    if (this.hasConsent()) {
      console.log('Reading cookie with consent:', key, value);
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return value;
      }
    }
    
    console.log('Blocked reading cookie (no consent):', key);
    return null;
  }

  static removeCookie(key: string) {
    // Always allow removing any cookie
    console.log('Removing cookie:', key);
    Cookies.remove(key, { path: '/' });
  }

  // LocalStorage methods with error handling
  static setLocalStorage(key: string, value: any) {
    if (this.hasConsent()) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log('Set localStorage:', key, value);
        return true;
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
      }
    }
    console.log('Blocked setting localStorage (no consent):', key);
    return false;
  }

  static getLocalStorage(key: string) {
    if (this.hasConsent()) {
      try {
        const item = localStorage.getItem(key);
        console.log('Get localStorage:', key, item);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    }
    console.log('Blocked reading localStorage (no consent):', key);
    return null;
  }

  static removeLocalStorage(key: string) {
    try {
      localStorage.removeItem(key);
      console.log('Removed from localStorage:', key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  static clearLocalStorage() {
    try {
      localStorage.clear();
      console.log('Cleared localStorage');
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // Session methods
  static setSession(key: string, value: any) {
    if (this.hasConsent()) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        console.log('Set sessionStorage:', key, value);
        return true;
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
        return false;
      }
    }
    console.log('Blocked setting sessionStorage (no consent):', key);
    return false;
  }

  static getSession(key: string) {
    if (this.hasConsent()) {
      try {
        const item = sessionStorage.getItem(key);
        console.log('Get sessionStorage:', key, item);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return null;
      }
    }
    console.log('Blocked reading sessionStorage (no consent):', key);
    return null;
  }

  static removeSession(key: string) {
    try {
      sessionStorage.removeItem(key);
      console.log('Removed from sessionStorage:', key);
      return true;
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
      return false;
    }
  }

  static clearSession() {
    try {
      sessionStorage.clear();
      console.log('Cleared sessionStorage');
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  }
} 