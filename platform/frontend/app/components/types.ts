export interface AuthenticationOption {
  name: string;
  icon: any;
}
export interface UserData {
  username?: string;
  email: string;
}
export interface ChallengeData {
  title: string;
  description: string;
  thumbnail: string; // URL to image
  participants: number;
  creator: string;
  deadlineTimestamp: number | null;
  template: string; // URL to xai method template
  model: string; // URL to ML model
  dataset: string; // URL to dataset
}
export interface LeaderboardData {
  ranking: Array<EvaluationData>; // low index = high rating
}
export interface EvaluationData {
  user: string;
  score: number;
}
