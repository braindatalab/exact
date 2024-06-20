"use client";
import React from "react";
import { Grid } from "@mantine/core";
import { CHALLENGES_MOCK_DATA } from "../components/utils";
import ChallengeCard from "../components/ChallengeCard";

const Competitions = () => {
  const challenges = CHALLENGES_MOCK_DATA; // hier später stattdessen mit useeffect tatsächliche challenges JSON fetchen (wenn der endpoint steht)

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24 bg-gray-300">
      <h1 className="text-4xl font-bold mb-4">Competitions</h1>
      <p className="text-lg mb-8">
        In this competition section you can explore and participate in
        Explainable AI Benchmarking Challenges.
      </p>
      {/* <Leaderboard /> */}
      <Grid>
        {challenges.map((challenge, i) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={i}>
            <ChallengeCard challenge={challenge} />
          </Grid.Col>
        ))}
      </Grid>
    </main>
  );
};

export default Competitions;
