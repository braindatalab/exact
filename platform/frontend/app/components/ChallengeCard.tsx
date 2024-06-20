"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChallengeData } from "./types";
import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ChallengeCardProps {
  challenge: ChallengeData;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const router = useRouter();

  const isNewChallenge =
    new Date().getTime() - challenge.creationTimestamp <
    7 * 24 * 60 * 60 * 1000;
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section component={Link} href={`/competitions/${challenge.id}`}>
        <Image src={challenge.thumbnail} h={180} alt={challenge.title} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{challenge.title}</Text>
        {isNewChallenge && <Badge color="pink">New!</Badge>}
      </Group>

      <Text size="sm" c="dimmed">
        {challenge.description}
      </Text>

      <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => {
          router.push(`/competitions/${challenge.id}`);
        }}
      >
        Learn More and Participate
      </Button>
    </Card>
  );
};

export default ChallengeCard;
