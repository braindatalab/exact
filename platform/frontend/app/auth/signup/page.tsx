"use client";
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import logo_ptb from "@/public/logo_ptb.png";

const SignUp = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            window.location.href = "/"
        } else {
            alert('Failed to sign up');
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
                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
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

                    <button type="submit" style={{
                        backgroundColor: 'blue',
                        color: 'white',
                        borderRadius: '5px',
                        padding: '10px 0',
                        border: '1px solid black'
                    }}>Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;