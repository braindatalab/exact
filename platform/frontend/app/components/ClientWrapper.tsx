'use client';

import { MantineProvider } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import { UserProvider } from "./UserContext";
import { SessionProvider } from '../contexts/SessionContext';
import { CookieConsent } from './CookieConsent';
import AdminNav from './AdminNav';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MantineProvider theme={{ primaryColor: "blue" }}>
        <UserProvider>
          <Header />
          <main className="min-h-screen">
            <AdminNav />
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </UserProvider>
      </MantineProvider>
    </SessionProvider>
  );
} 