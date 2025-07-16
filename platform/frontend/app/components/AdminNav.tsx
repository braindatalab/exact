"use client";
import { useContext } from 'react';
import { SessionContext } from '../contexts/SessionContext';
import Link from 'next/link';

export default function AdminNav() {
  const session = useContext(SessionContext);
  const user = session?.user;
  const isAdmin = user && user.username === 'admin';
  if (!isAdmin) return null;
  return (
    <nav style={{ background: '#f8f9fa', padding: '0.5em 1em' }}>
      <Link href="/admin">Admin Dashboard</Link>
    </nav>
  );
} 