'use client';

import { MantineProvider } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import { UserProvider } from "./UserContext";
import { SessionProvider } from '../contexts/SessionContext';
import { CookieConsent } from './CookieConsent';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MantineProvider theme={{ 
        primaryColor: 'ptbBlue',
        colors: {
          ptbBlue: [
            '#e0f4fc', '#b3e3f7', '#80cef1', '#4db9ea', '#26a9e5', 
            '#009cd1', '#008cc0', '#007db0', '#007198', '#006187'
          ]
        }
      }}>
        <UserProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </UserProvider>
      </MantineProvider>
    </SessionProvider>
  );
} 