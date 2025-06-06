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
  // Cookie methods
  static setCookie(key: string, value: any, options: CookieOptions = {}) {
    const mergedOptions = { ...defaultOptions, ...options };
    Cookies.set(key, JSON.stringify(value), mergedOptions);
  }

  static getCookie(key: string) {
    const value = Cookies.get(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  }

  static removeCookie(key: string) {
    Cookies.remove(key, { path: '/' });
  }

  // LocalStorage methods with error handling
  static setLocalStorage(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  static getLocalStorage(key: string) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  static removeLocalStorage(key: string) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  static clearLocalStorage() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // Session methods
  static setSession(key: string, value: any) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
      return false;
    }
  }

  static getSession(key: string) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return null;
    }
  }

  static removeSession(key: string) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
      return false;
    }
  }

  static clearSession() {
    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  }
} 