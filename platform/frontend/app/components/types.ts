export interface AuthenticationOption {
  name: string;
  icon: any;
}
export interface UserData {
  username?: string;
  email: string;
}
export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // URL to image
  participants: number;
  creator: string;
  createdAt: Date;
  deadline: Date | null;
  xaimethod: string; // URL to xai method template
  mlmodel: string; // URL to ML model
  dataset: string; // URL to dataset
}
export interface LeaderboardData {
  ranking: Array<Score>; // low index = high rating
}
export interface Score {
  score: number;
  username: string;
  challengeId: string;
  createdAt: Date;
  methodName?:string;
}
