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

  const handleLogin = () => {
    setIsLoadingLogin(true);
    client
      .post(`/login`, {
        username,
        email: `${username}@mail.de`,
        password,
      })
      .then(({ data }) => {
        const { password: _, ...userData } = data;
        console.log('Login successful:', userData);
        updateUser(userData);
        setSession(userData);
        setIsLoadingLogin(false);
        router.push("/");
      })
      .catch((e) => {
        console.error('Login error:', e);
        setIsLoadingLogin(false);
        setAuthenticationError(
          "The username or password provided is incorrect."
        );
      });
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
            <>
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
                >
                  Back
                </Button>
                <Group justify="end">
                  <Button
                    variant="filled"
                    radius="lg"
                    onClick={handleLogin}
                    disabled={!(username && password) || isLoadingLogin}
                  >
                    Submit
                  </Button>
                  {isLoadingLogin && <Loader type="dots" />}
                </Group>
              </Group>
            </>
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
