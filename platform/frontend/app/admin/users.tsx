import { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../components/UserContext';
import { UserWithProfile } from '../components/types';

function getCookie(name: string) {
  let cookieValue = null;
  if (typeof document !== 'undefined' && document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default function AdminUsersPage() {
  const { user } = useContext(SessionContext) || {};
  const isAdmin = user && user.username === 'admin';
  const [pendingUsers, setPendingUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
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
  }, [isAdmin]);

  const handleApprove = async (userId: number) => {
    setActionStatus(null);
    const csrftoken = getCookie('csrftoken');
    const res = await fetch(`/admin/approve-user/${userId}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrftoken,
      },
      credentials: 'include',
    });
    if (res.ok) {
      setActionStatus('User approved');
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    } else {
      setActionStatus('Failed to approve');
    }
  };

  const handleReject = async (userId: number) => {
    setActionStatus(null);
    const csrftoken = getCookie('csrftoken');
    const res = await fetch(`/admin/reject-user/${userId}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrftoken,
      },
      credentials: 'include',
    });
    if (res.ok) {
      setActionStatus('User rejected');
      setPendingUsers(pendingUsers.filter(u => u.id !== userId));
    } else {
      setActionStatus('Failed to reject');
    }
  };

  if (!isAdmin) {
    return <div>Not found</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {actionStatus && <div style={{ marginBottom: 12 }}>{actionStatus}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Date Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length === 0 ? (
              <tr><td colSpan={4}>No pending users</td></tr>
            ) : (
              pendingUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.date_joined}</td>
                  <td>
                    <button onClick={() => handleApprove(user.id)} style={{ marginRight: 8 }}>Approve</button>
                    <button onClick={() => handleReject(user.id)}>Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
} 