"use client";
import { useState } from "react";
import TemporaryDrawer from "./TemporaryDrawer";
import logo_ptb from "@/public/logo_ptb.png";
import Image from "next/image";
import { Button, Title } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NO_HEADER_PAGES } from "./utils";

const Header = () => {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (NO_HEADER_PAGES.includes(pathname)) {
    return <></>;
  }

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
        <Link href="/">
          <Title order={3}>Explainable AI Benchmarking Platform</Title>
        </Link>
        <input
          type="search"
          placeholder="Search..."
          className="px-4 py-2 rounded bg-white text-gray-800"
        />
        <nav className="flex mx-5 space-x-4">
          <Button
            component={Link}
            href="/login"
            variant="subtle"
            radius="xl"
            size="md"
          >
            Sign In
          </Button>
          <Button
            component={Link}
            href="/register"
            variant="filled"
            radius="xl"
            size="md"
          >
            Register
          </Button>
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
