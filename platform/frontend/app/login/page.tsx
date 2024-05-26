"use client";
import { useState } from "react";
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
} from "@mantine/core";
import { IconArrowLeft, IconExclamationCircle } from "@tabler/icons-react";
import Link from "next/link";
import logo from "../components/evalXAI_logo.png";
import NextImage from "next/image";
import { AUTHENTICATION_OPTIONS, BASE_URL_API } from "../components/utils";
import { AuthenticationOption } from "../components/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser, useUserUpdate } from "../components/UserContext";

const Login = () => {
  const router = useRouter();
  const user = useUser();
  const updateUser = useUserUpdate();

  if (user !== null) {
    router.push("/");
  }

  const [selectedAuthenticationOption, setSelectedAuthenticationOption] =
    useState<AuthenticationOption | null>(null);
  const [authenticationError, setAuthenticationError] = useState<string | null>(
    null
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    axios
      .post(`${BASE_URL_API}/login`, {
        username,
        email: `${username}@mail.de`,
        password,
      })
      .then(({ data }) => {
        console.log("hihi" + data);
        const { password, ...userData } = data;
        updateUser(userData);
        router.push("/");
      })
      .catch((e) => {
        setAuthenticationError(
          "The username or password provided is incorrect."
        );
      });
  };

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
                <Button
                  variant="filled"
                  radius="lg"
                  onClick={handleLogin}
                  disabled={!(username && password)}
                >
                  Submit
                </Button>
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
