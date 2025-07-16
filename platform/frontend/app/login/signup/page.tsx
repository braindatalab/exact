"use client";
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import logo_ptb from "@/public/logo_ptb.png";

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

const SignUp = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pendingNotice, setPendingNotice] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        const csrftoken = getCookie('csrftoken') || '';
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ name, email, password }),
            credentials: 'include',
        });

        if (response.ok) {
            setPendingNotice(true);
            return;
        } else {
            let data;
            try {
                data = await response.json();
            } catch {
                data = {};
            }
            // Show backend error message if present
            if (data && typeof data === 'object') {
                const firstError = Object.values(data)[0];
                setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
            } else {
                setError('Registration failed.');
            }
        }
    };

    return (
        <div>
            <header className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex items-center">
                    <Image
                        src={logo_ptb}
                        alt="logo"
                        width={160}
                        height={40}
                        className="bg-white p-2 mx-2"
                    />
                    <h1 className="text-xl mx-5 font-semibold">
                        Explainable AI Benchmarking Platform
                    </h1>
                </div>
            </header>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', width: '300px', background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <h1 style={{
                        textAlign: 'center',
                        fontSize: '45px',
                        marginTop: '0px',
                        marginBottom: '30px',
                    }}>Sign Up</h1>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            marginBottom: '10px',
                            borderRadius: '5px',
                            padding: '8px',
                            border: '1px solid black'
                        }}
                    />

                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            marginBottom: '10px',
                            borderRadius: '5px',
                            padding: '8px',
                            border: '1px solid black'
                        }}
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            marginBottom: '10px',
                            borderRadius: '5px',
                            padding: '8px',
                            border: '1px solid black'
                        }}
                    />

                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                            marginBottom: '20px',
                            borderRadius: '5px',
                            padding: '8px',
                            border: '1px solid black'
                        }}
                    />

                    <button type="submit" style={{ background: '#2563eb', color: 'white', padding: '0.75em 2em', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', marginTop: '20px', marginBottom: '16px' }}>Register</button>
                    {pendingNotice && (
                        <div style={{ background: '#ffeeba', color: '#856404', padding: '1em', borderRadius: '4px', marginTop: '1em', marginBottom: '1em' }}>
                            Waiting for admin approval.
                        </div>
                    )}
                    {error && !pendingNotice && (
                        <div style={{ color: 'red', marginTop: '1em', marginBottom: '1em' }}>{error}</div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SignUp;