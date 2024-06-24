import { IconMail } from "@tabler/icons-react";
import { AuthenticationOption, ChallengeData, LeaderboardData } from "./types";
import { Brygada_1918 } from "next/font/google";

export const BASE_URL_API = "http://localhost:8000";

export const NO_HEADER_PAGES = ["/login", "/register"]; // pages where the header should be hidden

export const NO_FOOTER_PAGES = ["/login", "/register"]; // pages where the footer should be hidden

export const AUTHENTICATION_OPTIONS: Array<AuthenticationOption> = [
  { name: "Email", icon: IconMail },
];

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

export const LEADERBOARD_MOCK_DATA: LeaderboardData = {
  ranking: [
    { user: "Mochtaba", score: 20 },
    { user: "Konrad", score: 4 },
    { user: "Vincent", score: 19 },
    { user: "Nick", score: 19 },
    { user: "Matthew", score: 39 },
  ],
};
