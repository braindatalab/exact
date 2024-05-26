import React from "react";
import { SingleCompetition } from "@/app/components/SingleCompetition";
import Header from "@/app/components/Header";

const CompetitionPage = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24 bg-gray-300">
      <SingleCompetition competitionName={"Tetris"} />
    </main>
  );
};

export default CompetitionPage;
