import React from "react";
import Header from "@/app/components/Header";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Link from "next/link";
import tetris from "@/public/tetris.png";
import { Leaderboard } from "../components/Leaderboard";

const Competitions = () => {
  const competitionName = "Tetris";
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24 bg-gray-300">
      <h1 className="text-4xl font-bold mb-4">Competitions</h1>
      <p className="text-lg mb-8">
        In this competition section you can explore and participate in
        Explainable AI Benchmarking Challenges.
      </p>
      <Leaderboard />
      <p className="my-10">
        In the following you can see all available competitions. Click on the
        competition to learn more and participate.
      </p>
      <Link href={`/competitions/tetris`} passHref>
        <Card sx={{ maxWidth: 345, cursor: "pointer" }}>
          <CardActionArea>
            <CardMedia
              component="img"
              sx={{
                height: 230,
              }}
              height="140"
              image={tetris.src}
              alt="Tetris"
            />

            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {competitionName} Competition
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click here to learn more and participate.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </main>
  );
};

export default Competitions;
