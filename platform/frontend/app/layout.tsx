import React from "react";
import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import ClientWrapper from './components/ClientWrapper';
import Link from 'next/link';
import { useContext } from 'react';
import { SessionContext } from './components/UserContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "evalXAI",
  description: "Explainable AI Benchmarking Platform",
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          {/* AdminNav will be rendered inside ClientWrapper so SessionContext is available */}
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
