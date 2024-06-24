"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button, Center, Paper, Stepper, Text, Title } from "@mantine/core";
import {
  IconAward,
  IconClick,
  IconSelect,
  IconUpload,
} from "@tabler/icons-react";

const steps = [
  {
    step: "First Step",
    description: "Open Menu in corner",
    icon: <IconClick />,
  },
  {
    step: "Second Step",
    description: "Select Competitions",
    icon: <IconSelect />,
  },
  {
    step: "Third Step",
    description: "Choose a Competition",
    icon: <IconAward />,
  },
  { step: "Final Step", description: "Upload your File", icon: <IconUpload /> },
];

export default function Home() {
  const [stepperActive, setStepperActive] = useState(0);
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gray-300">
      <div style={{ textAlign: "center", width: "100%" }}>
        <Text size="50px" fw={700}>
          Welcome to{" "}
          <Text
            fw={900}
            variant="gradient"
            inherit
            span
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
          >
            evalXAI
          </Text>
        </Text>
        <Text size="lg">
          Explore and participate in Explainable AI Benchmarking Challenges.
        </Text>
        <Center my={50}>
          <Stepper
            active={stepperActive}
            onStepClick={setStepperActive}
            w="80%"
            size="xl"
          >
            {steps.map((s, i) => (
              <Stepper.Step
                label={s.step}
                description={s.description}
                key={i}
                icon={s.icon}
              >
                {s.step} content: {s.description}
              </Stepper.Step>
            ))}
          </Stepper>
        </Center>
        <div>
          <Button
            variant="light"
            component={Link}
            href="/competitions"
            size="lg"
            radius="xl"
            px="xl"
            title="See all competitions"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
          >
            Get Started!
          </Button>
        </div>
      </div>
    </main>
  );
}
