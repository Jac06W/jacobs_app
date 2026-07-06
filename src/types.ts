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
  targetDate: string;
  progress: number;
  nextStep: string;
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
  options: string[];
  answer: number;
  explanation: string;
};
