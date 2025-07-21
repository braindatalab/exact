"use client";
import Link from "next/link";
import {
  Button,
  Paper,
  Text,
  Title,
  Container,
  Group,
  Stack,
  Badge,
  ThemeIcon,
  SimpleGrid
} from "@mantine/core";
import {
  IconAward,
  IconSelect,
  IconUpload,
  IconUserPlus,
  IconChartBar
} from "@tabler/icons-react";
import { useUser } from "./components/UserContext";

const steps = [
  {
    step: "Sign Up",
    description: "Register with your details or sign in to your account",
    icon: <IconUserPlus />,
  },
  {
    step: "Browse Competitions",
    description: "Select from available XAI benchmarking challenges",
    icon: <IconSelect />,
  },
  {
    step: "Choose Challenge",
    description: "Pick a dataset and model for your XAI evaluation",
    icon: <IconAward />,
  },
  {
    step: "Upload XAI Method",
    description: "Submit your XAI method for evaluation",
    icon: <IconUpload />,
  },
  {
    step: "Get Results",
    description: "Receive benchmark scores calculated with EMD and IMA metrics",
    icon: <IconChartBar />,
  },
];

export default function Home() {
  const user = useUser();

  return (
    <main className="flex flex-1 flex-col bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <Container size="xl" py={60}>
        <Stack align="center" gap="xl" mb={80}>
          <div style={{ textAlign: "center" }}>
            <Title
              order={1}
              size="4rem"
              fw={700}
              mb="md"
            >
              Welcome to{" "}
              <Text
                fw={900}
                variant="gradient"
                inherit
                component="span"
                gradient={{ from: "blue", to: "cyan", deg: 90 }}
              >
                evalXAI
              </Text>
            </Title>
            <Text size="lg">
              Explainable AI Benchmarking Platform
            </Text>
          </div>
        </Stack>

        <Stack align="center" gap="xl">
          <div style={{ textAlign: "center" }}>
            <Title order={2} mb="md">
              How It Works
            </Title>
          </div>

          <Paper shadow="sm" p="xl" radius="lg" w="100%" maw={1000}>
            <SimpleGrid cols={{ base: 1, md: 5 }} spacing="xl">
              {steps.map((s, i) => (
                <Stack key={i} align="center" gap="md">
                  <ThemeIcon
                    size={60}
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  >
                    {s.icon}
                  </ThemeIcon>
                  <Badge
                    variant="light"
                    color="blue"
                    size="lg"
                    radius="xl"
                  >
                    Step {i + 1}
                  </Badge>
                  <div style={{ textAlign: "center" }}>
                    <Text fw={600} size="lg" mb="xs">
                      {s.step}
                    </Text>
                    <Text c="dimmed" size="sm">
                      {s.description}
                    </Text>
                  </div>
                </Stack>
              ))}
            </SimpleGrid>
          </Paper>

          <Stack align="center" gap="md" pt="xl">
            <Text size="lg" fw={500}>
              Ready to benchmark your XAI methods?
            </Text>
            <Group gap="md">
              {/* Only show Create Account button if user is not logged in */}
              {user === null && (
                <Button
                  size="xl"
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  component={Link}
                  href="/register"
                  leftSection={<IconUserPlus />}
                >
                  Create Account
                </Button>
              )}
              <Button
                size="xl"
                radius="xl"
                variant="light"
                component={Link}
                href="/competitions"
                leftSection={<IconSelect />}
              >
                View Competitions
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Container>
    </main>
  );
}