"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  Button, 
  Center, 
  Paper, 
  Stepper, 
  Text, 
  Title, 
  Container,
  Group,
  Stack,
  Card,
  Badge,
  ThemeIcon,
  SimpleGrid,
  Divider
} from "@mantine/core";
import {
  IconAward,
  IconClick,
  IconSelect,
  IconUpload,
  IconUserPlus,
  IconChartBar,
  IconTarget,
  IconUsers,
  IconTrophy
} from "@tabler/icons-react";

const steps = [
  {
    step: "Create Account",
    description: "Register with your details and company info",
    icon: <IconUserPlus />,
  },
  {
    step: "Browse Competitions", 
    description: "Select from available XAI benchmarking challenges",
    icon: <IconSelect />,
  },
  {
    step: "Choose Challenge",
    description: "Pick a competition that matches your expertise",
    icon: <IconAward />,
  },
  {
    step: "Upload XAI Method",
    description: "Submit your explainable AI solution",
    icon: <IconUpload />,
  },
  {
    step: "Get Results",
    description: "Receive your benchmark score and analysis",
    icon: <IconChartBar />,
  },
];

export default function Home() {
  const [stepperActive, setStepperActive] = useState(0);

  return (
    <main className="flex flex-1 flex-col bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <Container size="xl" py={60}>
        {/* Hero Section */}
        <Stack align="center" spacing="xl" mb={80}>
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
              Explore and participate in Explainable AI Benchmarking Challenges.
            </Text>
          </div>

          <Group spacing="md">
            <Button
              size="lg"
              radius="xl"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
              component={Link}
              href="/register"
              leftIcon={<IconUserPlus />}
            >
              Get Started - Create Account
            </Button>
            <Button
              size="lg"
              radius="xl"
              variant="light"
              component={Link}
              href="/competitions"
              leftIcon={<IconTrophy />}
            >
              Browse Competitions
            </Button>
          </Group>
        </Stack>

        {/* How It Works Section */}
        <Stack align="center" spacing="xl">
          <div style={{ textAlign: "center" }}>
            <Title order={2} mb="md">
              How It Works
            </Title>
          </div>

          <Paper shadow="sm" p="xl" radius="lg" w="100%" maw={1000}>
            <Stepper
              active={stepperActive}
              onStepClick={setStepperActive}
              size="lg"
              orientation="horizontal"
              breakpoint="sm"
            >
              {steps.map((s, i) => (
                <Stepper.Step
                  label={s.step}
                  description={s.description}
                  key={i}
                  icon={s.icon}
                  allowStepSelect={false}
                >
                  <Stack align="center" spacing="md" py="xl">
                    <ThemeIcon
                      size={60}
                      radius="xl"
                      variant="gradient"
                      gradient={{ from: "blue", to: "cyan", deg: 90 }}
                    >
                      {s.icon}
                    </ThemeIcon>
                    <div style={{ textAlign: "center" }}>
                      <Text fw={600} size="lg" mb="xs">
                        {s.step}
                      </Text>
                      <Text color="dimmed">
                        {s.description}
                      </Text>
                    </div>
                  </Stack>
                </Stepper.Step>
              ))}
            </Stepper>
            
            <Divider my="xl" />
            
            <Group position="center" spacing="md">
              <Button
                variant="outline"
                onClick={() => setStepperActive(Math.max(0, stepperActive - 1))}
                disabled={stepperActive === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => setStepperActive(Math.min(steps.length - 1, stepperActive + 1))}
                disabled={stepperActive === steps.length - 1}
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 90 }}
              >
                Next
              </Button>
            </Group>
          </Paper>

          {/* Final CTA */}
          <Stack align="center" spacing="md" pt="xl">
            <Text size="lg" fw={500}>
              Ready to benchmark your XAI methods?
            </Text>
            <Group spacing="md">
              <Button
                size="xl"
                radius="xl"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 90 }}
                component={Link}
                href="/register"
                leftIcon={<IconUserPlus />}
              >
                Create Your Account
              </Button>
              <Button
                size="xl"
                radius="xl"
                variant="light"
                component={Link}
                href="/competitions"
                leftIcon={<IconSelect />}
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