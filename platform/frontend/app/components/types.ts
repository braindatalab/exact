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

// Erweiterte Score Interface mit EMD und IMA
export interface Score {
  score: number; // Legacy score field
  username: string;
  challengeId: string;
  createdAt: Date;
  methodName?: string;
  // Neue Felder für EMD und IMA
  emdScore?: number | null;
  emdStd?: number | null;
  imaScore?: number | null;
  imaStd?: number | null;
  status?: string;
}

// Neue Interface für detaillierte Scores in der Response
export interface DetailedScores {
  emd: {
    mean: number | null;
    std: number | null;
  };
  ima: {
    mean: number | null;
    std: number | null;
  };
}

export interface UserProfile {
  is_approved: boolean;
  approved_at: string | null;
  approved_by: string | null;
  rejected_at: string | null;
}

export interface UserWithProfile {
  id: number;
  username: string;
  email: string;
  date_joined: string;
  profile: UserProfile;
}

export type PendingApprovalUser = {
  username: string;
  email: string;
  date_joined: string;
  profile: {
    is_approved: boolean;
    approved_at: string | null;
    approved_by: { username: string; email: string } | null;
    rejected_at: string | null;
  };
};