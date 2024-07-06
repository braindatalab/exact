"use client";
import React, { useState, useEffect } from "react";
import {
  ActionIcon,
  Alert,
  Center,
  Container,
  Grid,
  Loader,
  Paper,
  Text,
} from "@mantine/core";
import ChallengeCard from "../components/ChallengeCard";
import { ChallengeData } from "../components/types";
import { useClient } from "../components/UserContext";
import { IconAlertCircle, IconCirclePlus, IconPlus } from "@tabler/icons-react";
import { convertChallengeData } from "../components/utils";
import Link from "next/link";

const Competitions = () => {
  const client = useClient();

  const [challenges, setChallenges] = useState<ChallengeData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .get("/api/challenges")
      .then(({ data }) => {
        setChallenges(data.map((c: any) => convertChallengeData(c)));
      })
      .catch(() => {
        setError("Error loading challenges");
      });
  }, [client]);

  return (
    <main className="flex flex-1 flex-col bg-gray-300">
      <Container p="none" m={0} px={100} py="lg" fluid>
        <Text size="xl" w="100%" mb="lg">
          <Text inherit span fw="600">
            Competitions:
          </Text>{" "}
          Explore and Participate in Explainable AI Benchmarking Challenges.
        </Text>
        {/* <Leaderboard /> */}
        {
          challenges === null ? (
            error === null ? (
              <Center mt="xl">
                <Loader />
              </Center>
            ) : (
              <></>
            )
          ) : (
            <Grid w="100%">
              {challenges.map((challenge, i) => (
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={i}>
                  <ChallengeCard challenge={challenge} />
                </Grid.Col>
              ))}
              <Grid.Col
                span={{ base: 12, md: 6, lg: 4 }}
                key={challenges.length + 1}
              >
                <Paper h={180} radius="lg" bg="gray.3">
                  <Center h="100%" w="100%">
                    <ActionIcon
                      variant="subtle"
                      radius={120}
                      aria-label="Settings"
                      h={120}
                      w={120}
                      p={0}
                      title="Add a Competition"
                      href="/competitions/create"
                      component={Link}
                    >
                      <IconPlus
                        style={{ width: "70%", height: "70%" }}
                        stroke={2}
                      />
                    </ActionIcon>
                  </Center>
                </Paper>
              </Grid.Col>
            </Grid>
          )
          //   <Text>Unfortunately, there are no open challenges currently...</Text>
        }
        {error && (
          <Alert
            variant="light"
            color="red"
            radius="md"
            withCloseButton
            title="Error"
            w="100%"
            onClose={() => {
              setError(null);
            }}
            icon={<IconAlertCircle />}
          >
            {error}
          </Alert>
        )}
      </Container>
    </main>
  );
};

export default Competitions;
