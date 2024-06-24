"use client";
import React, { useState, useEffect } from "react";
import { Grid } from "@mantine/core";
import ChallengeCard from "../components/ChallengeCard";
import { ChallengeData } from "../components/types";

const Competitions = () => {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/challenges/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched challenges:", data);  // Log the fetched data
        setChallenges(data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    fetchChallenges();
  }, []);

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
