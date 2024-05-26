"use client";
import React from "react";
import EastIcon from "@mui/icons-material/East";
import Link from "next/link";
import { Button } from "@mantine/core";

const steps = [
  { step: "Step 1", description: "Click Menu in the top left corner" },
  { step: "Step 2", description: "Select Competitions" },
  { step: "Step 3", description: "Choose a Competition" },
  { step: "Step 4", description: "Upload your File" },
];

function NavigationCard({
  step,
  description,
}: {
  step: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-6 m-4">
      <span className="text-2xl font-semibold">{step}</span>
      <p className="text-center text-xl">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24 bg-gray-300">
      <h1 className="text-4xl font-bold mb-4"> Welcome</h1>
      <p className="text-xl mb-8">
        Explore and participate in Explainable AI Benchmarking Challenges.
      </p>
      <div className="flex flex-row ">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-row items-center">
            <NavigationCard step={step.step} description={step.description} />
            {index !== 3 && <EastIcon />}
          </div>
        ))}
      </div>
      <div>
        <Link href="/competitions" passHref>
          <Button variant="contained" size="large" className="mt-10 bg-black">
            Get Started!
          </Button>
        </Link>
      </div>
    </main>
  );
}
