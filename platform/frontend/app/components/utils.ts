import { IconMail } from "@tabler/icons-react";
import { AuthenticationOption, ChallengeData, LeaderboardData } from "./types";
import {
  IconFile3d,
  IconFileCode,
  IconFileSpreadsheet,
} from "@tabler/icons-react";

export const BASE_URL_API = "http://localhost:8000";

export const NO_HEADER_PAGES = ["/login", "/register"]; // pages where the header should be hidden

export const NO_FOOTER_PAGES = ["/login", "/register"]; // pages where the footer should be hidden

export const AUTHENTICATION_OPTIONS: Array<AuthenticationOption> = [
  { name: "Email", icon: IconMail },
];

export const convertChallengeData = (c: any) => {
  const challenge = {
    ...c,
    id: c.challenge_id,
    deadline: null,
    createdAt: new Date(c.created_at),
    thumbnail:
      c.thumbnail ||
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Typical_Tetris_Game.svg/1200px-Typical_Tetris_Game.svg.png",
    creator: c.creator || null,
    participants: c.participants || null,
  };
  delete challenge.challenge_id;
  delete challenge.created_at;
  return challenge;
};

export const IconModel = IconFile3d;
export const IconDataset = IconFileSpreadsheet;
export const IconTemplate = IconFileCode;

export const CHALLENGES_MOCK_DATA: Array<ChallengeData> = [
  {
    id: "1",
    title: "Tetris Challenge",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Typical_Tetris_Game.svg/1200px-Typical_Tetris_Game.svg.png",
    participants: 13,
    creator: "Rick",
    createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000),
    deadline: null,
    xaimethod: "https://thispersondoesnotexist.com",
    mlmodel: "https://thispersondoesnotexist.com",
    dataset: "https://thispersondoesnotexist.com",
  },
  {
    id: "2",
    title: "Tetris Challenge 2",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Typical_Tetris_Game.svg/1200px-Typical_Tetris_Game.svg.png",
    participants: 4,
    creator: "Rick",
    createdAt: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000),
    deadline: null,
    xaimethod: "https://thispersondoesnotexist.com",
    mlmodel: "https://thispersondoesnotexist.com",
    dataset: "https://thispersondoesnotexist.com",
  },
  {
    id: "3",
    title: "Challenge 3",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Typical_Tetris_Game.svg/1200px-Typical_Tetris_Game.svg.png",
    participants: 0,
    creator: "Benny",
    createdAt: new Date(new Date().getTime() - 19 * 24 * 60 * 60 * 1000),
    deadline: null,
    xaimethod: "https://thispersondoesnotexist.com",
    mlmodel: "https://thispersondoesnotexist.com",
    dataset: "https://thispersondoesnotexist.com",
  },
  {
    id: "4",
    title: "New Challenge",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Typical_Tetris_Game.svg/1200px-Typical_Tetris_Game.svg.png",
    participants: 49,
    creator: "Rick",
    createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
    deadline: null,
    xaimethod: "https://thispersondoesnotexist.com",
    mlmodel: "https://thispersondoesnotexist.com",
    dataset: "https://thispersondoesnotexist.com",
  },
  {
    id: "5",
    title: "Another Challenge",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Typical_Tetris_Game.svg/1200px-Typical_Tetris_Game.svg.png",
    participants: 1,
    creator: "Rick",
    createdAt: new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000),
    deadline: null,
    xaimethod: "https://thispersondoesnotexist.com",
    mlmodel: "https://thispersondoesnotexist.com",
    dataset: "https://thispersondoesnotexist.com",
  },
];

const challengeId = "insert challenge id for leaderboard mockdata here";
export const LEADERBOARD_MOCK_DATA: LeaderboardData = {
  ranking: [
    { username: "Mochtaba", score: 20, challengeId, createdAt: new Date() },
    { username: "Konrad", score: 4, challengeId, createdAt: new Date() },
    { username: "Vincent", score: 19, challengeId, createdAt: new Date() },
    { username: "Nick", score: 19, challengeId, createdAt: new Date() },
    { username: "Matthew", score: 39, challengeId, createdAt: new Date() },
  ],
};

// Aktualisierte convertScore Funktion mit EMD und IMA Feldern
export const convertScore = (score: any) => {
  return {
    score: score["score"] || null,
    challengeId: score["challenge_id"],
    username: score["username"],
    methodName: score["method_name"],
    createdAt: new Date(score["created_at"]),
    // Neue Felder
    emdScore: score["emd_score"] || null,
    emdStd: score["emd_std"] || null,
    imaScore: score["ima_score"] || null,
    imaStd: score["ima_std"] || null,
    status: score["status"] || "completed",
  };
};

export const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export const formatDateGerman = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes} Uhr`;
};