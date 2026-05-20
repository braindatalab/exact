"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChallengeData } from "./types";
import { Badge, Button, Card, Group, Image, Text, ActionIcon } from "@mantine/core";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useUser, useClient } from "./UserContext";
import { IconTrash } from "@tabler/icons-react";

interface ChallengeCardProps {
  challenge: ChallengeData;
  onDelete?: (id: string) => void;
}

const ChallengeCard = ({ challenge, onDelete }: ChallengeCardProps) => {
  const router = useRouter();
  const user = useUser();
  const client = useClient();

  const isNewChallenge =
    new Date().getTime() - challenge.createdAt.getTime() <
    7 * 24 * 60 * 60 * 1000;
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this challenge?")) {
      client.delete(`api/challenge/${challenge.id}/delete`)
        .then(() => {
          if (onDelete) onDelete(challenge.id);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="lg" withBorder>
      <Card.Section component={Link} href={`/competitions/${challenge.id}`} pos="relative">
        <Image src={challenge.thumbnail} h={180} alt={challenge.title} />
        {user && user.username === challenge.creator && (
          <ActionIcon
            color="red"
            variant="filled"
            radius="xl"
            style={{ 
              position: "absolute", 
              top: 10, 
              right: 10, 
              zIndex: 10,
              border: "2px solid white",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.2)" 
            }}
            onClick={handleDelete}
            title="Delete Challenge"
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{challenge.title}</Text>
        {isNewChallenge && <Badge color="pink">New!</Badge>}
      </Group>

      <Text size="sm" c="dimmed" lineClamp={3}>
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
