"use client";
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../contexts/SessionContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  useEffect(() => {
    const username = prompt("Username:");
    const password = prompt("Password:");
    if (username !== "admin" || password !== "admin") {
      alert("Access denied");
      window.location.href = "/";
    } else {
      // Programmatically log in to backend
      fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: 'admin', email: 'admin@admin.com', password: 'admin' }),
      })
        .then(res => {
          if (res.ok) {
            setAuthenticated(true);
          } else {
            alert("Backend login failed. Please use the main login page.");
            window.location.href = "/";
          }
        })
        .catch(() => {
          alert("Backend login failed. Please use the main login page.");
          window.location.href = "/";
        });
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const fetchPending = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/admin/pending-users/', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setPendingUsers(data);
      } catch (e) {
        setError('Could not load users');
      }
      setLoading(false);
    };
    fetchPending();
  }, [authenticated]);

  const handleApproveAll = async () => {
    setActionStatus(null);
    let success = 0;
    for (const user of pendingUsers) {
      const res = await fetch(`/admin/approve-user/${user.id}/`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) success++;
    }
    setActionStatus(`${success} users approved`);
    setPendingUsers([]);
  };

  if (!authenticated) return null;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h2>Admin Dashboard</h2>
      {actionStatus && <div style={{ marginBottom: 12 }}>{actionStatus}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          <button onClick={handleApproveAll} style={{ marginBottom: 16 }}>Approve All</button>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.length === 0 ? (
                <tr><td colSpan={3}>No pending users</td></tr>
              ) : (
                pendingUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.date_joined}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
} 