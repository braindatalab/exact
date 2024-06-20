import { IconMail } from "@tabler/icons-react";
import { AuthenticationOption, ChallengeData, LeaderboardData } from "./types";

export const BASE_URL_API = "http://localhost:8000";

export const NO_HEADER_PAGES = ["/login", "/register"]; // pages where the header should be hidden

export const NO_FOOTER_PAGES = ["/login", "/register"]; // pages where the footer should be hidden

export const AUTHENTICATION_OPTIONS: Array<AuthenticationOption> = [
  { name: "Email", icon: IconMail },
];

export const CHALLENGES_MOCK_DATA: Array<ChallengeData> = [
  {
    title: "Tetris Challenge",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    thumbnail: "http://localhost:3000/_next/static/media/tetris.cab32540.png",
    participants: 13,
    creator: "Rick",
    deadlineTimestamp: null,
    template: "https://thispersondoesnotexist.com",
    model: "https://thispersondoesnotexist.com",
    dataset: "https://thispersondoesnotexist.com",
  },
  {
    title: "Tetris Challenge 2",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    thumbnail: "http://localhost:3000/_next/static/media/tetris.cab32540.png",
    participants: 4,
    creator: "Rick",
    deadlineTimestamp: null,
    template: "https://thispersondoesnotexist.com",
    model: "https://thispersondoesnotexist.com",
    dataset: "https://thispersondoesnotexist.com",
  },
  {
    title: "Challenge 3",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    thumbnail: "http://localhost:3000/_next/static/media/tetris.cab32540.png",
    participants: 0,
    creator: "Benny",
    deadlineTimestamp: null,
    template: "https://thispersondoesnotexist.com",
    model: "https://thispersondoesnotexist.com",
    dataset: "https://thispersondoesnotexist.com",
  },
  {
    title: "New Challenge",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    thumbnail: "http://localhost:3000/_next/static/media/tetris.cab32540.png",
    participants: 49,
    creator: "Rick",
    deadlineTimestamp: null,
    template: "https://thispersondoesnotexist.com",
    model: "https://thispersondoesnotexist.com",
    dataset: "https://thispersondoesnotexist.com",
  },
  {
    title: "Another Challenge",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    thumbnail: "http://localhost:3000/_next/static/media/tetris.cab32540.png",
    participants: 1,
    creator: "Rick",
    deadlineTimestamp: null,
    template: "https://thispersondoesnotexist.com",
    model: "https://thispersondoesnotexist.com",
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
