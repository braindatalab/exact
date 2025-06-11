"use client";
import { useState } from "react";
import TemporaryDrawer from "./TemporaryDrawer";
import logo_ptb from "@/public/logo_ptb2.png";
import {
  Avatar,
  Button,
  Group,
  Menu,
  Text,
  rem,
  Image,
  Burger,
} from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NO_HEADER_PAGES } from "./utils";
import { useClient, useUser, useUserUpdate } from "./UserContext";
import { useSession } from "../contexts/SessionContext";
import {
  IconLogout,
  IconMessageCircle,
  IconSettings,
  IconUserCog,
  IconUserPentagon,
} from "@tabler/icons-react";
import NextImage from "next/image";
import { useMediaQuery } from "@mantine/hooks";

const Header = () => {
  const pathname = usePathname();
  const user = useUser();
  const updateUser = useUserUpdate();
  const client = useClient();
  const { clearSession } = useSession();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const smallScreen = useMediaQuery("(max-width: 90em)");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    client.post("/logout", user).then(() => {
      updateUser(null);
      clearSession();
    }).catch((error) => {
      console.error('Logout error:', error);
      updateUser(null);
      clearSession();
    });
  };

  if (NO_HEADER_PAGES.includes(pathname)) {
    return <></>;
  }

  return (
    <header className="bg-gray-800 text-white">
      <Group justify="space-between" align="center" px={100} py="xs">
        <Group gap="lg">
          <Burger
            opened={isSidebarOpen}
            onClick={toggleSidebar}
            color="white"
          />
          <Group gap={5}>
            {smallScreen ? (
              <Text component={Link} href="/" size="xl">
                evalXAI
              </Text>
            ) : (
              <>
                <Text component={Link} href="/" size="xl">
                  evalXAI: Explainable AI Benchmarking Platform{" "}
                  <Text inherit span c="gray">
                    hosted by
                  </Text>
                </Text>
                <Image
                  component={NextImage}
                  src={logo_ptb}
                  h={20}
                  w="auto"
                  alt="Logo Physikalisch-Technische Bundesanstalt"
                />
              </>
            )}
          </Group>
        </Group>
        <Group gap="lg">
          <input
            type="search"
            placeholder="Search..."
            className="px-4 py-2 rounded bg-white text-gray-800"
          />
          <Group gap="xs">
            {!user ? (
              user === null ? (
                <>
                  <Button
                    component={Link}
                    href="/login"
                    variant="subtle"
                    radius="sm"
                    size="md"
                    px="xl"
                  >
                    Sign In
                  </Button>
                  <Button
                    component={Link}
                    href="/register"
                    variant="filled"
                    radius="sm"
                    size="md"
                    px="xl"
                  >
                    Register
                  </Button>
                </>
              ) : (
                <></>
              )
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
                      variant="light"
                      radius="sm"
                      color="blue"
                      style={{ cursor: "pointer" }}
                    >
                      <IconUserPentagon />
                      {/* {user.username
                        ? user.username.slice(0, 2).toUpperCase()
                        : "AI"} */}
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
                        <IconLogout
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            )}
          </Group>
        </Group>
      </Group>
      <TemporaryDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </header>
  );
};

export default Header;
