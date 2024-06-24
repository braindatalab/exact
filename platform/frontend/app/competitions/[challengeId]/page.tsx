"use client";
import React, { useEffect, useState } from "react";
import {
  AspectRatio,
  Button,
  Center,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
  Overlay,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { ChallengeData } from "@/app/components/types";
import { useClient } from "@/app/components/UserContext";
import { notFound } from "next/navigation";
import {
  IconDataset,
  IconModel,
  IconTemplate,
  convertChallengeData,
} from "@/app/components/utils";
import { AxiosError } from "axios";
import { IconFileSpreadsheet } from "@tabler/icons-react";

const ChallengeDetail = ({ params }: { params: { challengeId: string } }) => {
  const client = useClient();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    client
      .get(`/api/challenge/${params.challengeId}`)
      .then(({ data }) => {
        setChallenge(convertChallengeData(data));
      })
      .catch((e) => {
        setError(e);
      });
  }, [client, params.challengeId]);

  if (error && error.response && error.response.status === 404) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col bg-gray-300">
      {challenge === null ? (
        <Center mt="xl">
          <Loader />
        </Center>
      ) : (
        <Grid w="100%" px={100} py="lg" gutter="lg">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Paper p="0" shadow="md" style={{ overflow: "hidden" }}>
              <AspectRatio ratio={4 / 2} pos="relative">
                <Image src={challenge.thumbnail} alt="Demo" />
                <Overlay
                  gradient="linear-gradient(
    to bottom,
    hsla(0, 0%, 100%, 0) 0%,
    hsla(0, 0%, 100%, 0.013) 13.5%,
    hsla(0, 0%, 100%, 0.049) 25.2%,
    hsla(0, 0%, 100%, 0.104) 35.4%,
    hsla(0, 0%, 100%, 0.175) 44.1%,
    hsla(0, 0%, 100%, 0.259) 51.7%,
    hsla(0, 0%, 100%, 0.352) 58.2%,
    hsla(0, 0%, 100%, 0.45) 63.9%,
    hsla(0, 0%, 100%, 0.55) 68.9%,
    hsla(0, 0%, 100%, 0.648) 73.4%,
    hsla(0, 0%, 100%, 0.741) 77.6%,
    hsla(0, 0%, 100%, 0.825) 81.7%,
    hsla(0, 0%, 100%, 0.896) 85.8%,
    hsla(0, 0%, 100%, 0.951) 90.1%,
    hsla(0, 0%, 100%, 0.987) 94.7%,
    hsl(0, 0%, 100%) 100%
  )" // gradient easing done with https://larsenwork.com/easing-gradients/
                  opacity={1}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    transform: "translateY(-30px)",
                    zIndex: 1000,
                    textAlign: "center",
                  }}
                >
                  <Text
                    size="30px"
                    fw="900"
                    tt="uppercase"
                    variant="gradient"
                    gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  >
                    {challenge.title}
                  </Text>
                </div>
              </AspectRatio>
              <Text m="md">{challenge.description}</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Paper shadow="md" p="sm">
              <Text size="xl" fw="600" ta="center">
                Metadata
              </Text>
              <Divider mb="sm" />
              <Group justify="space-between">
                <Text>Created by</Text>
                <Text>
                  {challenge.creator ? challenge.creator : "creator unknown"}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text>Created at</Text>
                <Text>{challenge.createdAt.toISOString()}</Text>
              </Group>
              <Group justify="space-between">
                <Text>Closes on</Text>
                <Text>
                  {challenge.deadline ? challenge.deadline.toISOString() : "-"}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text>Number Participants</Text>
                <Text>
                  {challenge.participants
                    ? challenge.participants
                    : "number partipants unknown"}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text>Challenge ID</Text>
                <Text>{challenge.id}</Text>
              </Group>
            </Paper>
            <Paper shadow="md" mt="lg" p="sm">
              <Text size="xl" fw="600" ta="center">
                Resources
              </Text>
              <Divider mb="sm" />
              <Button
                rightSection={<IconDataset size={16} />}
                fullWidth
                variant="light"
                component="a"
                href={`http://localhost:8000/api/dataset/${challenge.id}`}
              >
                Download Dataset
              </Button>
              <Button
                rightSection={<IconTemplate size={16} />}
                mt="xs"
                fullWidth
                variant="light"
                component="a"
                href={`http://localhost:8000/api/xaimethod/${challenge.id}`}
              >
                Download XAI Method Template
              </Button>
              <Button
                rightSection={<IconModel size={16} />}
                mt="xs"
                fullWidth
                variant="light"
                component="a"
                href={`http://localhost:8000/api/mlmodel/${challenge.id}`}
              >
                Download Mashine Model
              </Button>
            </Paper>
            <Paper shadow="md" mt="lg" p="sm">
              <Text size="xl" fw="600" ta="center">
                Leaderboard
              </Text>
              <Divider mb="sm" />
              todo
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Paper shadow="md" p="sm">
              <Text size="xl" fw="600" ta="center">
                Your Submissions
              </Text>
              <Divider mb="sm" />
              <Group justify="flex-end">
                <Button>Add Submission</Button>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      )}
    </main>
  );
};

export default ChallengeDetail;
