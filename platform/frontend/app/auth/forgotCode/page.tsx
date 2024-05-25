"use client";
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import logo_ptb from "@/public/logo_ptb.png";

const SignUp = () => {

    const [email, setEmail] = useState('');


    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
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
                        marginBottom: '70px',
                    }}>Your Mail</h1>

                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            marginBottom: '40px',
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
                    }}>Send mail</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;