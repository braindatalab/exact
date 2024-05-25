"use client";
import { useState } from "react";
import TemporaryDrawer from "./TemporaryDrawer";
import logo_ptb from "@/public/logo_ptb.png";
import Image from "next/image";
import Link from 'next/link';

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <svg
          onClick={toggleSidebar}
          className="h-6 w-6 text-white cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <Image src={logo_ptb} alt="logo" className="bg-white p-2 mx-2 w-40" />
        <h1 className="text-xl mx-5 font-semibold">
          Explainable AI Benchmarking Platform
        </h1>
        <input
          type="search"
          placeholder="Search..."
          className="px-4 py-2 rounded bg-white text-gray-800"
        />
        <nav className="flex mx-5 space-x-4">
          <Link href="/auth"> {}
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login / Sign Up
            </a>
          </Link>
          <p>Settings</p>
        </nav>
      </div>
      <TemporaryDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </header>
  );
};

export default Header;
