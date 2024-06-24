"use client";
import React from "react";
import { Button, Text } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24 bg-gray-300">
      <h1 className="text-4xl font-bold mb-4">404 Page Not Found</h1>
      <Text size="md">
        Return to the{" "}
        <Text component={Link} href="/" td="underline">
          home page
        </Text>
        .
      </Text>
    </main>
  );
}
