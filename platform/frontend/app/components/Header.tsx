"use client";
import { useState } from "react";
import TemporaryDrawer from "./TemporaryDrawer";
import logo_ptb from "@/public/logo_ptb.png";
import Image from "next/image";
import { Avatar, Button, Group, Menu, Text, Title, rem } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NO_HEADER_PAGES } from "./utils";
import { useClient, useUser, useUserUpdate } from "./UserContext";
import {
  IconArrowsLeftRight,
  IconChevronRight,
  IconLogout,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconTrash,
  IconUserCog,
} from "@tabler/icons-react";

const Header = () => {
  const pathname = usePathname();
  const user = useUser();
  const updateUser = useUserUpdate();
  const client = useClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    client.post("/logout", user).then(() => {
      updateUser(null);
    });
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
          {!user ? (
            <>
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
            </>
          ) : (
            <>
              <Menu
                shadow="md"
                width={200}
                trigger="click-hover"
                openDelay={100}
                closeDelay={400}
                withArrow
              >
                <Menu.Target>
                  <Avatar
                    radius="sm"
                    color="blue"
                    style={{ cursor: "pointer" }}
                  >
                    {user.username
                      ? user.username.slice(0, 2).toUpperCase()
                      : "AI"}
                  </Avatar>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconSettings
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconMessageCircle
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    Messages
                  </Menu.Item>
                  {/* <Menu.Item
                    leftSection={
                      <IconSearch style={{ width: rem(14), height: rem(14) }} />
                    }
                    rightSection={
                      <Text size="xs" c="dimmed">
                        ⌘K
                      </Text>
                    }
                  >
                    Search
                  </Menu.Item> */}

                  <Menu.Divider />

                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconUserCog
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                    component={Link}
                    href="/profile"
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    leftSection={
                      <IconLogout style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          )}
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
