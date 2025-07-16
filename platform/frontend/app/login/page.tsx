"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Center,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Image,
  Alert,
  Loader,
} from "@mantine/core";
import { IconArrowLeft, IconExclamationCircle } from "@tabler/icons-react";
import Link from "next/link";
import logo from "../components/evalXAI_logo.png";
import NextImage from "next/image";
import { AUTHENTICATION_OPTIONS } from "../components/utils";
import { AuthenticationOption } from "../components/types";
import { useRouter } from "next/navigation";
import { useUser, useUserUpdate } from "../components/UserContext";
import { useClient } from "../components/UserContext";
import { useSession } from "../contexts/SessionContext";
import PendingApprovalNotice from "../components/PendingApprovalNotice";

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

const Login = () => {
  const router = useRouter();
  const client = useClient();
  const user = useUser();
  const updateUser = useUserUpdate();
  const { setSession } = useSession();

  const [selectedAuthenticationOption, setSelectedAuthenticationOption] =
    useState<AuthenticationOption | null>(null);
  const [authenticationError, setAuthenticationError] = useState<string | null>(
    null
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoadingLogin(true);
    setPendingApproval(false);
    setAuthenticationError(null);
    try {
      const res = await client.post(`/login`, {
        username,
        email: `${username}@mail.de`,
        password,
      });
      const { password: _, ...userData } = res.data;
      updateUser(userData);
      setSession(userData);
      setIsLoadingLogin(false);
      router.push("/");
    } catch (e) {
      setIsLoadingLogin(false);
      let errorMsg = "The username or password provided is incorrect.";
      let isPending = false;
      if (e?.response?.data) {
        if (e.response.data.detail === 'pending_approval') {
          isPending = true;
        } else if (e.response.data.detail) {
          errorMsg = e.response.data.detail;
        }
      } else if (e?.message && e.message.includes('Network')) {
        errorMsg = 'Cannot connect to server. Please try again later.';
      }
      if (isPending) {
        setPendingApproval(true);
        setAuthenticationError(null);
      } else {
        setAuthenticationError(errorMsg);
      }
    }
  };

  useEffect(() => {
    if (user !== null) {
      router.push("/");
    }
  }, [router, user]);

  return (
    <div>
      <Center py="lg">
        <Paper withBorder p="xl" radius="lg" mx="auto" w={375}>
          <Center>
            <Image
              component={NextImage}
              src={logo}
              alt="logo (to be changed)"
              h="80"
              w="auto"
              priority
              onClick={() => router.push("/")}
              style={{ cursor: "pointer" }}
            />
          </Center>
          <Title className="text-center" order={2} my="lg">
            {selectedAuthenticationOption ? "Sign In" : "Welcome!"}
          </Title>
          {selectedAuthenticationOption ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {authenticationError && (
                <div className="w-100">
                  <Alert
                    variant="light"
                    color="red"
                    withCloseButton
                    icon={<IconExclamationCircle />}
                    onClose={() => setAuthenticationError(null)}
                    title="Authentication error"
                    mb="sm"
                  >
                    {authenticationError}
                  </Alert>
                </div>
              )}
              {pendingApproval && <PendingApprovalNotice />}
              {error && !pendingApproval && (
                <div style={{ color: 'red', marginBottom: '1em' }}>{error}</div>
              )}
              <TextInput
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <PasswordInput
                label="Password"
                mt="sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Text size="xs" ta="center" mt="lg">
                Forgot{" "}
                <Link href="/" className="underline">
                  Username
                </Link>{" "}
                or{" "}
                <Link href="/" className="underline">
                  Password
                </Link>
                ?
              </Text>
              <Group justify="space-between" mt="xl">
                <Button
                  variant="subtle"
                  radius="lg"
                  leftSection={<IconArrowLeft size="17" />}
                  onClick={() => {
                    setSelectedAuthenticationOption(null);
                    setAuthenticationError(null);
                  }}
                  type="button"
                >
                  Back
                </Button>
                <Group justify="end">
                  <Button
                    type="submit"
                    variant="filled"
                    radius="lg"
                    style={{ background: '#2563eb', color: 'white', padding: '0.75em 2em', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', marginTop: '20px' }}
                    disabled={isLoadingLogin}
                  >
                    Login
                  </Button>
                  {isLoadingLogin && <Loader type="dots" />}
                </Group>
              </Group>
            </form>
          ) : (
            <>
              {AUTHENTICATION_OPTIONS.map((o, i) => (
                <Group key={i} justify="center" mt={i === 0 ? "0" : "sm"}>
                  <Button
                    key={i}
                    onClick={() => setSelectedAuthenticationOption(o)}
                    radius="lg"
                    variant="outline"
                    leftSection={
                      <o.icon size="17" style={{ marginRight: 10 }} />
                    }
                    ta="center"
                  >
                    Sign in with {o.name}
                  </Button>
                </Group>
              ))}
              <Text size="xs" ta="center" mt="lg">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline">
                  Create one
                </Link>
              </Text>
            </>
          )}
        </Paper>
      </Center>
      <Text size="xs" ta="center">
        <Link href="/" className="underline">
          Contact Us / Support
        </Link>
      </Text>
    </div>
  );
};

export default Login;
