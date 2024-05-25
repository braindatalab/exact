"use client";
import { useState } from 'react';
import { useRouter } from 'next/router';
import logo_ptb from "@/public/logo_ptb.png";
import Image from "next/image";


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
            window.location.href = "/"
        } else {
            alert('Failed to login');
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                    <h1 style={{
                        textAlign: 'center', 
                        fontSize: '45px', 
                        marginTop: '0px',
                        marginBottom: '100px', // Abstand zwischen "Login" und "Username"
                        marginRight: '20px',
                    }}>Login</h1>
                    <label htmlFor="Email">Email:</label>
                    <input
                        id="email"
                        type="text"
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
                            marginBottom: '20px',
                            borderRadius: '5px',
                            padding: '8px',
                            border: '1px solid black'
                        }}
                    />
                    <a href="/auth/signup" style={{ color: 'blue', textDecoration: 'underline', marginBottom: '10px' }}>Noch kein Account?</a>

                    <a href="/auth/forgotCode" style={{ color: 'blue', textDecoration: 'underline', marginBottom: '40px' }}>Passwort vergessen?</a>


                    <button type="submit" style={{
                        backgroundColor: 'blue',
                        color: 'white',
                        borderRadius: '5px',
                        padding: '10px 0',
                        border: '1px solid black'
                    }}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
