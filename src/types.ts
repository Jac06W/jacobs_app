export type ActivityType = "football" | "school" | "cadets" | "priority" | "other";

export type RoleType = "student" | "corporal" | "goalkeeper";

export type TimeBlock = {
  id: string;
  title: string;
  detail: string;
  activity: ActivityType;
  day: number;
  start: number;
  end: number;
};

export type Goal = {
  id: string;
  title: string;
  activity: ActivityType;
  startDate?: string;
  targetDate?: string;
  progress: number;
  nextStep?: string;
  status?: "on-track" | "behind" | "ahead" | "unknown";
  steps?: {
    id: string;
    title: string;
    progress: number;
    done: boolean;
  }[];
};

export type DailyTarget = {
  id: string;
  title: string;
  activity: ActivityType;
  role: RoleType;
  measure: string;
  done: boolean;
};

export type PracticeSession = {
  id: string;
  title: string;
  activity: ActivityType;
  role: RoleType;
  focus: string;
  durationMinutes: number;
  confidence: number;
};

export type SyllabusTopic = {
  id: string;
  title: string;
  activity: ActivityType;
  area: string;
  progress: number;
  knowledge: string[];
};

export type QuizQuestion = {
  id: string;
  topicId: string;
  prompt: string;
  options?: string[];
  answer?: number;
  marks?: number;
  explanation: string;
};

export type PracticeSet = {
  id: string;
  title: string;
  questions: QuizQuestion[];
  topicId?: string;
  tier?: string;
  createdAt: number;
};
