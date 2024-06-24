"use client";
import React, { useState, useEffect } from "react";
import { Alert, Center, Container, Grid, Loader, Text } from "@mantine/core";
import ChallengeCard from "../components/ChallengeCard";
import { ChallengeData } from "../components/types";
import { useClient } from "../components/UserContext";
import { IconAlertCircle } from "@tabler/icons-react";
import { convertChallengeData } from "../components/utils";

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
        {challenges === null ? (
          error === null ? (
            <Center mt="xl">
              <Loader />
            </Center>
          ) : (
            <></>
          )
        ) : challenges.length > 0 ? (
          <Grid w="100%">
            {challenges.map((challenge, i) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={i}>
                <ChallengeCard challenge={challenge} />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Text>Unfortunately, there are no open challenges currently...</Text>
        )}
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
