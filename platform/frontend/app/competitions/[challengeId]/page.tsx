"use client";
import React from "react";
import { Divider, Grid, Paper, Title } from "@mantine/core";
import { CHALLENGES_MOCK_DATA } from "../../components/utils";
import ChallengeCard from "../../components/ChallengeCard";

const ChallengeDetail = ({ params }: { params: { challengeId: string } }) => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24 bg-gray-300">
      <Paper p="xl" w="100%" shadow="md">
        <Title size="h2">{params.challengeId}</Title>
        <Divider my="sm" />
      </Paper>
    </main>
  );
};

export default ChallengeDetail;
