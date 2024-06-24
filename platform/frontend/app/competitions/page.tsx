"use client";
import React, { useState, useEffect } from "react";
import { Alert, Grid, Loader, Text } from "@mantine/core";
import ChallengeCard from "../components/ChallengeCard";
import { ChallengeData } from "../components/types";
import { useClient } from "../components/UserContext";
import { IconAlertCircle } from "@tabler/icons-react";

const Competitions = () => {
  const client = useClient();

  const [challenges, setChallenges] = useState<ChallengeData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .get("/api/challenges")
      .then(({ data }) => {
        setChallenges(
          data.map((c: any) => {
            const challenge = {
              ...c,
              deadline: null,
              createdAt: new Date(c.created_at),
              thumbnail:
                c.thumbnail ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Typical_Tetris_Game.svg/1200px-Typical_Tetris_Game.svg.png",
              creator: c.creator || null,
            };
            delete challenge.created_at;
            console.log(challenge);
            return challenge;
          })
        );
      })
      .catch(() => {
        setError("Error loading challenges");
      });
  }, [client]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24 bg-gray-300">
      <h1 className="text-4xl font-bold mb-4">Competitions</h1>
      <p className="text-lg mb-8">
        In this competition section you can explore and participate in
        Explainable AI Benchmarking Challenges.
      </p>
      {/* <Leaderboard /> */}
      {challenges === null ? (
        error === null ? (
          <Loader />
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
    </main>
  );
};

export default Competitions;
