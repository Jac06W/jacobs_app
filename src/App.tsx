import {
  BookOpen,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dumbbell,
  FileQuestion,
  Flame,
  GraduationCap,
  ListPlus,
  Medal,
  NotebookPen,
  Plus,
  RotateCcw,
  Settings,
  Shield,
  Target,
  Trophy,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  activityMeta,
  defaultBlocks,
  defaultDailyTargets,
  defaultGoals,
  defaultPracticeSessions,
  defaultQuestions,
  defaultPracticeSets,
  defaultSyllabus,
  roleMeta,
  weekDays,
} from "./data";
import type { ActivityType, DailyTarget, Goal, PracticeSession, QuizQuestion, PracticeSet, RoleType, SyllabusTopic, TimeBlock } from "./types";

const startHour = 7;
const endHour = 21;
const rowHeight = 56;

const iconMap = {
  football: Trophy,
  school: GraduationCap,
  cadets: Shield,
  priority: Flame,
  other: Clock3,
};

type SyllabusSection = {
  title: string;
  points: string[];
};

const roleOptions = Object.entries(roleMeta) as [RoleType, (typeof roleMeta)[RoleType]][];

const cadetPromotionSyllabus: SyllabusSection[] = [
  {
    title: "Leadership",
    points: [
      "Take charge confidently without waiting to be asked.",
      "Lead by example in uniform, attitude and punctuality.",
      "Make fair decisions under pressure.",
      "Delegate tasks effectively to Corporals and cadets.",
      "Motivate quieter cadets to get involved.",
      "Learn different leadership styles and when to use them.",
      "Build trust with cadets and staff.",
    ],
  },
  {
    title: "Instruction",
    points: [
      "Deliver at least one high-quality lesson every month.",
      "Improve public speaking confidence.",
      "Learn to explain difficult topics clearly.",
      "Keep lessons engaging with practical activities.",
      "Ask for feedback after every lesson.",
      "Mentor new recruits during parade nights.",
      "Become confident teaching drill.",
    ],
  },
  {
    title: "Drill",
    points: [
      "Perfect all words of command.",
      "Improve confidence when calling drill on large parades.",
      "Correct drill mistakes professionally.",
      "Learn ceremonial drill.",
      "Help prepare cadets for inspections and competitions.",
    ],
  },
  {
    title: "Flight Management",
    points: [
      "Know every cadet in your flight personally.",
      "Track attendance and notice when cadets are struggling.",
      "Encourage every cadet to complete classifications.",
      "Ensure everyone feels included.",
      "Improve communication within the flight.",
      "Organise small team-building activities.",
    ],
  },
  {
    title: "Discipline",
    points: [
      "Maintain high personal standards every parade night.",
      "Correct behaviour respectfully.",
      "Stay calm during stressful situations.",
      "Be someone cadets naturally respect.",
    ],
  },
  {
    title: "Initiative",
    points: [
      "Volunteer for more responsibilities.",
      "Organise an activity or competition.",
      "Help staff without being asked.",
      "Suggest ideas to improve parade nights.",
      "Identify problems before they become issues.",
    ],
  },
  {
    title: "Knowledge",
    points: [
      "Improve knowledge of RAFAC policies.",
      "Learn more about aviation and RAF history.",
      "Complete more classifications where possible.",
      "Stay up to date with squadron events.",
      "Improve knowledge of first aid.",
    ],
  },
  {
    title: "Personal Development",
    points: [
      "Improve confidence speaking to groups.",
      "Become more organised.",
      "Improve time management.",
      "Learn to give constructive feedback.",
      "Handle criticism positively.",
      "Develop resilience when things don't go to plan.",
    ],
  },
  {
    title: "Sergeant Promotion Evidence",
    points: [
      "Lead parade nights regularly.",
      "Run a full lesson independently.",
      "Mentor a new recruit from joining to passing First Class.",
      "Organise a flight competition.",
      "Be trusted to supervise activities without constant staff input.",
      "Help plan squadron events.",
      "Be someone staff rely on.",
      "Support other NCOs rather than just your own flight.",
    ],
  },
];

const goalkeeperDrillsSyllabus: SyllabusSection[] = [
  {
    title: "Handling",
    points: [
      "Catch high balls consistently.",
      "Improve low diving catches.",
      "Hold onto shots without spilling.",
      "Develop safer handling under pressure.",
      "Improve reaction catches.",
      "Practise different catching techniques.",
    ],
  },
  {
    title: "Shot Stopping",
    points: [
      "Improve reaction speed.",
      "Make quicker decisions in 1v1 situations.",
      "Improve positioning before shots.",
      "Reduce goals conceded from long-range shots.",
      "Develop stronger diving technique.",
      "Improve close-range saves.",
    ],
  },
  {
    title: "Footwork",
    points: [
      "Improve quick side steps.",
      "Stay balanced before every save.",
      "Improve recovery after diving.",
      "Develop explosive movement.",
      "Move efficiently around the goal.",
      "Improve agility.",
    ],
  },
  {
    title: "Positioning",
    points: [
      "Narrow shooting angles.",
      "Start in the correct position every attack.",
      "Improve awareness of attackers.",
      "Anticipate where shots will go.",
      "Improve positioning at crosses.",
      "Recover into position quickly.",
    ],
  },
  {
    title: "Distribution",
    points: [
      "Improve passing accuracy.",
      "Improve throwing distance.",
      "Develop weaker foot passing.",
      "Improve long kicks.",
      "Make quicker distribution decisions.",
      "Start counter-attacks effectively.",
    ],
  },
  {
    title: "Communication",
    points: [
      "Give louder, clearer instructions.",
      "Organise defenders before set pieces.",
      "Call confidently for crosses.",
      "Encourage teammates throughout matches.",
      "Improve leadership from the back.",
      "Communicate under pressure.",
    ],
  },
  {
    title: "Crosses",
    points: [
      "Improve timing when claiming crosses.",
      "Catch crosses consistently.",
      "Punch safely when needed.",
      "Judge flight of the ball.",
      "Improve decision-making.",
      "Command the penalty area.",
    ],
  },
  {
    title: "1v1 Situations",
    points: [
      "Stay patient.",
      "Close angles quickly.",
      "Improve spread saves.",
      "Delay attackers effectively.",
      "Improve bravery.",
      "Recover after rebounds.",
    ],
  },
  {
    title: "Diving",
    points: [
      "Improve diving technique.",
      "Dive earlier when needed.",
      "Land safely.",
      "Improve diving distance.",
      "Recover quickly after every dive.",
      "Improve low diving saves.",
    ],
  },
  {
    title: "Fitness",
    points: [
      "Improve explosive power.",
      "Increase agility.",
      "Improve stamina.",
      "Strengthen legs.",
      "Improve flexibility.",
      "Prevent injuries through mobility work.",
    ],
  },
  {
    title: "Mentality",
    points: [
      "Stay focused for the full match.",
      "Recover quickly after mistakes.",
      "Build confidence.",
      "Stay calm under pressure.",
      "Improve decision-making.",
      "Maintain a positive attitude.",
    ],
  },
  {
    title: "Leadership",
    points: [
      "Organise the defence.",
      "Encourage teammates.",
      "Lead by example.",
      "Stay composed.",
      "Help younger goalkeepers.",
      "Take responsibility during games.",
    ],
  },
  {
    title: "Decision Making",
    points: [
      "Know when to catch or punch.",
      "Decide quickly whether to come off the line.",
      "Improve passing choices.",
      "Read the game earlier.",
      "Anticipate danger.",
      "Make confident decisions.",
    ],
  },
  {
    title: "Sweeper Keeper",
    points: [
      "Improve positioning outside the box.",
      "Read through balls early.",
      "Improve first touch.",
      "Clear danger confidently.",
      "Support build-up play.",
      "Improve passing under pressure.",
    ],
  },
  {
    title: "Match Preparation",
    points: [
      "Complete a proper warm-up.",
      "Stay hydrated.",
      "Set personal match goals.",
      "Analyse opponents.",
      "Prepare mentally.",
      "Review performances after matches.",
    ],
  },
  {
    title: "Recovery",
    points: [
      "Stretch after training.",
      "Complete recovery sessions.",
      "Get enough sleep.",
      "Eat well after matches.",
      "Manage soreness.",
      "Prevent injuries.",
    ],
  },
];

function useStoredState<T>(
  key: string,
  initialValue: T,
  merge?: (storedValue: T, initialValue: T) => T,
) {
  const [value, setValue] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return initialValue;
    }

    try {
      const parsed = JSON.parse(stored) as T;
      return merge ? merge(parsed, initialValue) : parsed;
    } catch {
      return initialValue;
    }
  });

  function update(nextValue: T | ((current: T) => T)) {
    setValue((current) => {
      const resolved = typeof nextValue === "function" ? (nextValue as (current: T) => T)(current) : nextValue;
      window.localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  }

  return [value, update] as const;
}

function toTime(minutes: number) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

function parseTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatHours(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, value));
}

type Page = "dashboard" | "today" | "goals" | "syllabus" | "practice";

type QuestionTier = "Foundation" | "Higher" | "Mixed";

const gcseMathQuestionTemplates: Record<
  string,
  Array<{
    tier: QuestionTier;
    prompt: string;
    options?: string[];
    answer?: number;
    explanation: string;
    marks?: number;
  }>
> = {
  "maths-number": [
    {
      tier: "Foundation",
      prompt: "What is 15% of 240?",
      options: ["24", "36", "40", "48"],
      answer: 1,
      explanation: "15% of 240 = 0.15 × 240 = 36.",
    },
    {
      tier: "Foundation",
      prompt: "Write 0.75 as a fraction in its simplest form.",
      options: ["3/4", "4/5", "7/10", "75/100"],
      answer: 0,
      explanation: "0.75 = 75/100 = 3/4 after simplifying.",
    },
    {
      tier: "Higher",
      prompt: "Write 0.00042 in standard form.",
      options: ["4.2 × 10⁻⁴", "4.2 × 10⁻³", "42 × 10⁻⁵", "0.42 × 10⁻³"],
      answer: 0,
      explanation: "Move the decimal 4 places to the right: 4.2 × 10⁻⁴.",
    },
    {
      tier: "Higher",
      prompt: "A bag contains 4 red, 3 blue and 5 green counters. What fraction are not green?",
      options: ["4/12", "7/12", "8/12", "9/12"],
      answer: 1,
      explanation: "Not green counters = 4 + 3 = 7, total 12, so 7/12.",
    },
    {
      tier: "Higher",
      prompt: "A quantity increases by 20% then decreases by 20%. Is the final value greater than, less than, or equal to the original?",
      options: ["Greater", "Less", "Equal", "Cannot tell"],
      answer: 1,
      explanation: "The decrease is from a larger value, so the final amount is less than the original.",
    },
    {
      tier: "Higher",
      prompt: "A map has a scale of 1:25 000. The distance between two villages on the map is 7.4 cm. Work out the actual distance in kilometres.",
      explanation: "Actual distance = 7.4 × 25 000 = 185 000 cm = 1 850 m = 1.85 km. Show conversion from centimetres to metres to kilometres.",
      marks: 5,
    },
    {
      tier: "Higher",
      prompt: "The population of a town increases by 8% each year. After 3 years the population is 125 971. Work out the original population. Give your answer to the nearest whole number.",
      explanation: "Let P be the original population. After 3 years: P × 1.08³ = 125 971. Calculate 1.08³ = 1.259712. Then P = 125 971 ÷ 1.259712 ≈ 100 000. Answer: 100 000 (to the nearest whole number).",
      marks: 6,
    },
  ],
  "maths-algebra": [
    {
      tier: "Foundation",
      prompt: "Solve 3x + 7 = 22.",
      options: ["x = 3", "x = 5", "x = 10", "x = 15"],
      answer: 1,
      explanation: "Subtract 7 from both sides then divide by 3 to get x = 5.",
    },
    {
      tier: "Foundation",
      prompt: "Expand and simplify 4(2x - 3) + 5x.",
      options: ["13x - 12", "8x - 12", "13x + 12", "3x - 12"],
      answer: 0,
      explanation: "Expand to 8x - 12 then add 5x to get 13x - 12.",
    },
    {
      tier: "Higher",
      prompt: "Solve x² - 5x + 6 = 0.",
      options: ["x = 2 or 3", "x = -2 or -3", "x = 1 or 6", "x = -1 or -6"],
      answer: 0,
      explanation: "Factor to (x - 2)(x - 3) = 0 so x = 2 or 3.",
    },
    {
      tier: "Higher",
      prompt: "Solve the simultaneous equations: y = 2x + 1 and y = x - 4.",
      options: ["x = -5, y = -9", "x = 5, y = 11", "x = -5, y = -7", "x = 5, y = 6"],
      answer: 0,
      explanation: "Set 2x + 1 = x - 4 so x = -5, then substitute to get y = -9.",
    },
    {
      tier: "Higher",
      prompt: "The first four terms of a sequence are 6, 11, 16, 21. What is the nth term?",
      options: ["5n + 1", "5n + 2", "4n + 2", "6n"],
      answer: 0,
      explanation: "The common difference is 5, so the nth term is 5n + 1.",
    },
    {
      tier: "Higher",
      prompt: "A quadratic function has turning point (1, -2) and passes through (3, 6). Work out the equation of the function in the form y = ax² + bx + c.",
      explanation: "Use y = a(x - 1)² - 2. Substitute (3,6): 6 = a(2)² - 2 so 6 = 4a - 2, so 4a = 8 and a = 2. Expand: y = 2(x² - 2x + 1) - 2 = 2x² - 4x + 2 - 2 = 2x² - 4x. Since the turning point gives c = 0 here, final equation is y = 2x² - 4x.",
      marks: 6,
    },
    {
      tier: "Higher",
      prompt: "A quadratic equation is x² - 6x + k = 0. The roots are x = 2 and x = 4. Find the value of k.",
      explanation: "For roots 2 and 4, sum = 6 and product = 8. The equation is x² - 6x + 8 = 0, so k = 8.",
      marks: 3,
    },
  ],
  "maths-ratio": [
    {
      tier: "Foundation",
      prompt: "A recipe uses 2 parts sugar to 3 parts flour. If 20g of sugar is used, how much flour is needed?",
      options: ["20g", "25g", "30g", "40g"],
      answer: 2,
      explanation: "Ratio 2:3 means flour = 3/2 × 20 = 30g.",
    },
    {
      tier: "Foundation",
      prompt: "If 5 apples cost £3, how much do 15 apples cost at the same rate?",
      options: ["£6", "£7", "£8", "£9"],
      answer: 3,
      explanation: "£3 for 5 apples means £0.60 each so 15 apples cost £9.",
    },
    {
      tier: "Higher",
      prompt: "A car travels 100 km in 2 hours 30 minutes. What is its average speed in km/h?",
      options: ["40", "42", "44", "45"],
      answer: 0,
      explanation: "2.5 hours gives 100 ÷ 2.5 = 40 km/h.",
    },
    {
      tier: "Higher",
      prompt: "A quantity increases by 12% and then decreases by 12%. Is the final quantity: A) same, B) higher, C) lower, D) cannot tell?",
      options: ["Same", "Higher", "Lower", "Cannot tell"],
      answer: 2,
      explanation: "A 12% increase then 12% decrease gives a smaller overall value because the decrease is from a larger amount.",
    },
    {
      tier: "Higher",
      prompt: "A cyclist travels 15 km in 40 minutes. Calculate the average speed in metres per second. Give your answer correct to 2 decimal places.",
      explanation: "Convert distance to metres: 15 km = 15 000 m. Convert time to seconds: 40 min = 2 400 s. Speed = 15 000 ÷ 2 400 = 6.25 m/s.",
      marks: 5,
    },
    {
      tier: "Higher",
      prompt: "A machine produces 120 items in 45 minutes. At this rate, how many items will it produce in 5 hours? Show your working.",
      explanation: "Rate = 120 ÷ 45 = 8/3 items per minute. 5 hours = 300 minutes. Items = 300 × 8/3 = 800. Show conversion from hours to minutes and multiply by the rate.",
      marks: 6,
    },
  ],
  "maths-geometry": [
    {
      tier: "Foundation",
      prompt: "What is the area of a triangle with base 8 cm and height 5 cm?",
      options: ["20 cm²", "26 cm²", "30 cm²", "40 cm²"],
      answer: 0,
      explanation: "Area = ½ × base × height = ½ × 8 × 5 = 20 cm².",
    },
    {
      tier: "Higher",
      prompt: "A circle has radius 7 cm. What is its circumference? Use π ≈ 3.14.",
      options: ["43.96 cm", "21.98 cm", "153.86 cm", "87.92 cm"],
      answer: 0,
      explanation: "Circumference = 2 × 3.14 × 7 = 43.96 cm.",
    },
    {
      tier: "Higher",
      prompt: "In a right-angled triangle, angle A = 30° and hypotenuse = 10 cm. What is the opposite side?",
      options: ["5 cm", "10√3 cm", "5√3 cm", "8.66 cm"],
      answer: 0,
      explanation: "Opposite side = 10 × sin 30° = 5 cm.",
    },
    {
      tier: "Higher",
      prompt: "A circle has radius 9 cm. Find the area of a sector with angle 150°. Use π = 3.14.",
      explanation: "Area of sector = θ/360 × πr² = 150/360 × 3.14 × 9² = 0.4167 × 3.14 × 81 ≈ 106.0 cm².",
      marks: 5,
    },
    {
      tier: "Higher",
      prompt: "Two angles in the same segment of a circle are equal. The angle at the circumference is 35°. Find the opposite angle in the same segment.",
      options: ["35°", "55°", "70°", "145°"],
      answer: 0,
      explanation: "Angles in the same segment are equal, so the opposite angle is also 35°.",
      marks: 3,
    },
    {
      tier: "Higher",
      prompt: "Triangle ABC has sides AB = 7 cm, AC = 9 cm and included angle A = 60°. Calculate the area of triangle ABC. Show your working.",
      explanation: "Use area = ½ab sin C. Here a = 7, b = 9, C = 60°. Area = ½ × 7 × 9 × sin 60° = 31.5 × √3/2 ≈ 27.3 cm². Show substitution and use sin 60° = √3/2.",
      marks: 6,
    },
  ],
  "maths-probability": [
    {
      tier: "Foundation",
      prompt: "A bag contains 2 red and 3 blue counters. What is the probability of drawing a red counter?",
      options: ["2/5", "3/5", "1/2", "1/5"],
      answer: 0,
      explanation: "There are 2 red out of 5 total counters so probability = 2/5.",
    },
    {
      tier: "Foundation",
      prompt: "A coin is tossed once. What is the probability of getting heads?",
      options: ["1/4", "1/3", "1/2", "2/3"],
      answer: 2,
      explanation: "A fair coin has two outcomes; probability of heads = 1/2.",
    },
    {
      tier: "Higher",
      prompt: "Two dice are rolled. What is the probability the total is 7?",
      options: ["1/6", "1/9", "1/12", "1/8"],
      answer: 0,
      explanation: "There are 6 combinations that make 7 out of 36 possible outcomes, so probability = 6/36 = 1/6.",
    },
    {
      tier: "Higher",
      prompt: "A spinner has 3 equal regions labelled A, B and C. What is the probability of A or B on one spin?",
      options: ["1/3", "2/3", "1/6", "1/2"],
      answer: 1,
      explanation: "P(A or B) = P(A) + P(B) = 1/3 + 1/3 = 2/3 since sectors are mutually exclusive.",
    },
    {
      tier: "Higher",
      prompt: "A bag contains 5 red, 3 blue and 2 green counters. A counter is selected at random. Find the probability the counter is not blue.",
      explanation: "Total counters = 10. Not blue counters = 5 + 2 = 7. Probability = 7/10. Give answer as a fraction.",
      marks: 3,
    },
    {
      tier: "Higher",
      prompt: "Two dice are rolled. Work out the probability that one die shows an even number and the total is 8. Show your working.",
      explanation: "Possible outcomes with total 8: (2,6), (3,5), (4,4), (5,3), (6,2). Even outcomes among these: (2,6), (4,4), (6,2) → 3 outcomes. Total outcomes = 36. Probability = 3/36 = 1/12.",
      marks: 6,
    },
  ],
  "maths-statistics": [
    {
      tier: "Foundation",
      prompt: "The numbers are 3, 5, 7, 7, 8. What is the mode?",
      options: ["3", "5", "7", "8"],
      answer: 2,
      explanation: "7 appears most often.",
    },
    {
      tier: "Foundation",
      prompt: "The numbers are 2, 4, 6, 8, 10. What is the median?",
      options: ["4", "5", "6", "7"],
      answer: 2,
      explanation: "The median is the middle number, which is 6.",
    },
    {
      tier: "Higher",
      prompt: "A spinner has 4 equal sectors. What is the probability of landing on sector A twice in a row?",
      options: ["1/2", "1/8", "1/16", "1/4"],
      answer: 2,
      explanation: "Probability = 1/4 × 1/4 = 1/16.",
    },
    {
      tier: "Higher",
      prompt: "Five students scored 4, 7, 7, 9 and 13. What is the mean score?",
      options: ["8", "8.5", "8.0", "8.2"],
      answer: 0,
      explanation: "Mean = (4 + 7 + 7 + 9 + 13) ÷ 5 = 8.",
    },
  ],
};

const subjectOrder: Record<string, number> = {
  all: 0,
  maths: 1,
  physics: 2,
  chemistry: 3,
  english: 4,
  cadets: 5,
  football: 6,
  other: 7,
};

const subjectLabels: Record<string, string> = {
  all: "All subjects",
  maths: "Maths",
  physics: "Physics",
  chemistry: "Chemistry",
  english: "English",
  cadets: "Cadets",
  football: "Football",
  other: "Other",
};

function getTopicSubject(topicId: string) {
  if (topicId.startsWith("maths-")) return "maths";
  if (topicId.startsWith("physics-")) return "physics";
  if (topicId.startsWith("chemistry-")) return "chemistry";
  if (topicId.startsWith("english-")) return "english";
  if (topicId.startsWith("cadets-")) return "cadets";
  if (topicId.startsWith("football-")) return "football";
  return "other";
}

function getQuestionMarks(question: QuizQuestion) {
  if (question.marks && question.marks > 0) return question.marks;
  const fallback = [3, 5, 6];
  const hash = [...question.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return fallback[hash % fallback.length];
}

function createGcseMathsQuestions(topic: SyllabusTopic, tier: QuestionTier = "Mixed", count = 8): QuizQuestion[] {
  const baseId = topic.id.replace(/[^a-z0-9]+/gi, "-");
  const templates = gcseMathQuestionTemplates[topic.id] ?? gcseMathQuestionTemplates["maths-algebra"];
  const filtered = templates.filter((template) => tier === "Mixed" || template.tier === tier);
  const selected = filtered.slice(0, count);
  const marksPattern = tier === "Foundation" ? [3, 3, 5, 5, 6, 6] : [3, 5, 6, 3, 5, 6];

  return selected.map((template, index) => ({
    id: `${baseId}-gcse-${tier.toLowerCase()}-${Date.now()}-${index}`,
    topicId: topic.id,
    prompt: template.prompt,
    options: template.options,
    answer: template.answer,
    explanation: template.explanation,
    marks: template.marks ?? marksPattern[index % marksPattern.length],
  }));
}

function Sidebar({ activePage, onNavigate }: { activePage: Page; onNavigate: (page: Page) => void }) {
  const nav = [
    { label: "Week Plan", icon: CalendarDays, page: "dashboard" as const },
    { label: "Today", icon: Target, page: "today" as const },
    { label: "Goals", icon: Medal, page: "goals" as const },
    { label: "Syllabus", icon: BookOpen, page: "syllabus" as const },
    { label: "Practice", icon: Dumbbell, page: "practice" as const },
  ];

  const support = [
    { label: "Calendar", icon: CalendarDays },
    { label: "Commitments", icon: Clock3 },
    { label: "Settings", icon: Settings },
  ];

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand-mark" aria-hidden="true">
        <Shield size={34} />
        <span>JD</span>
      </div>
      <nav className="nav-stack">
        {nav.map((item) => (
          <button
            className={`nav-item ${activePage === item.page ? "active" : ""}`}
            key={item.label}
            onClick={() => onNavigate(item.page)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="nav-divider" />
      <nav className="nav-stack">
        {support.map((item) => (
          <button className="nav-item" key={item.label}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="profile">
        <div className="avatar">J</div>
        <div>
          <strong>Jacob</strong>
          <span>Cadet Cdt</span>
        </div>
        <ChevronRight size={18} />
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="topbar">
      <div>
        <h1>Jacob's Development Hub</h1>
      </div>
      <div className="date-controls" aria-label="Week controls">
        <button className="button subtle">Today</button>
        <button className="icon-button" aria-label="Previous week">
          <ChevronLeft size={18} />
        </button>
        <button className="icon-button" aria-label="Next week">
          <ChevronRight size={18} />
        </button>
        <strong>{getWeekRange(0)}</strong>
        <button className="button subtle">Week</button>
        <button className="icon-button" aria-label="Settings">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}

function TodayPanel({
  blocks,
  completed,
  onToggle,
  headerLabel,
}: {
  blocks: TimeBlock[];
  completed: string[];
  onToggle: (id: string) => void;
  headerLabel: string;
}) {
  return (
    <section className="panel today-panel" aria-labelledby="today-heading">
      <div className="section-heading inline">
        <h2 id="today-heading">{headerLabel}</h2>
        <span>{headerLabel}</span>
      </div>
      <div className="today-list">
        {blocks.map((block) => {
          const Icon = iconMap[block.activity];
          const meta = activityMeta[block.activity];
          return (
            <button className="today-row" key={block.id} onClick={() => onToggle(block.id)}>
              <span className="activity-icon" style={{ color: meta.color, background: meta.soft }}>
                <Icon size={18} />
              </span>
              <span className="row-main">
                <strong>{block.title}</strong>
                <small>{block.detail}</small>
              </span>
              <time>
                {toTime(block.start)} - {toTime(block.end)}
              </time>
              <span className={`check-box ${completed.includes(block.id) ? "checked" : ""}`}>
                {completed.includes(block.id) && <Check size={14} />}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function getWeekStart(offset: number) {
  const today = new Date();
  const day = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekRange(offset: number) {
  const monday = getWeekStart(offset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const sameMonth = monday.getMonth() === sunday.getMonth();
  const start = monday.toLocaleDateString("en-GB", {
    day: "numeric",
    month: sameMonth ? undefined : "short",
  });
  const end = sunday.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${start} - ${end}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  next.setHours(0, 0, 0, 0);
  return next;
}

function areSameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getIsoWeek(date: Date) {
  const copied = new Date(date);
  copied.setHours(0, 0, 0, 0);
  const day = (copied.getDay() + 6) % 7;
  copied.setDate(copied.getDate() - day + 3);
  const firstThursday = new Date(copied.getFullYear(), 0, 4);
  const firstDay = (firstThursday.getDay() + 6) % 7;
  const weekNumber = 1 + Math.round(((copied.getTime() - firstThursday.getTime()) / 86400000 - 3 + firstDay) / 7);
  return { year: copied.getFullYear(), week: weekNumber };
}

function getIsoWeekStartDate(year: number, week: number) {
  const jan4 = new Date(year, 0, 4);
  const day = (jan4.getDay() + 6) % 7;
  return addDays(jan4, -day + (week - 1) * 7);
}

function getWeekOffsetForDate(date: Date) {
  const targetWeekStart = getIsoWeekStartDate(getIsoWeek(date).year, getIsoWeek(date).week);
  const currentWeekStart = getWeekStart(0);
  return Math.round((targetWeekStart.getTime() - currentWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

function getWeekInputValue(date: Date) {
  const { year, week } = getIsoWeek(date);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function formatDayLabel(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (areSameDate(date, today)) return "Today";
  if (areSameDate(date, addDays(today, 1))) return "Tomorrow";
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}

function formatDayShortLabel(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (areSameDate(date, today)) return "Today";
  if (areSameDate(date, addDays(today, 1))) return "Tmr";
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}

function TodayPage({
  blocks,
  targets,
  completed,
  goals,
  onToggle,
  onToggleTarget,
  onAddTarget,
}: {
  blocks: TimeBlock[];
  targets: DailyTarget[];
  goals: Goal[];
  completed: string[];
  onToggle: (id: string) => void;
  onToggleTarget: (id: string) => void;
  onAddTarget: (target: DailyTarget) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(() => today);
  const [showWeekPicker, setShowWeekPicker] = useState(false);

  const weekStart = getWeekStart(weekOffset);
  const selectedDayIndex = selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1;
  const selectedDateLabel = formatDayLabel(selectedDate);
  const selectedDateShort = formatDayShortLabel(selectedDate);
  const weekDates = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const dayBlocks = blocks.filter((block) => block.day === selectedDayIndex).sort((a, b) => a.start - b.start);

  function navigateDay(delta: number) {
    const nextDate = addDays(selectedDate, delta);
    setSelectedDate(nextDate);
    setWeekOffset(getWeekOffsetForDate(nextDate));
    setShowWeekPicker(false);
  }

  function selectWeekDay(index: number) {
    const day = addDays(weekStart, index);
    setSelectedDate(day);
    setWeekOffset(getWeekOffsetForDate(day));
  }

  function handleWeekInputChange(event: ChangeEvent<HTMLInputElement>) {
    const [yearPart, weekPart] = event.target.value.split("-W");
    if (!yearPart || !weekPart) return;
    const year = Number(yearPart);
    const week = Number(weekPart);
    if (Number.isNaN(year) || Number.isNaN(week)) return;
    const nextWeekStart = getIsoWeekStartDate(year, week);
    setWeekOffset(getWeekOffsetForDate(nextWeekStart));
    setSelectedDate(addDays(nextWeekStart, selectedDayIndex));
    setShowWeekPicker(false);
  }

  return (
    <div className="dashboard-grid">
      <div className="primary-column">
        <section className="panel today-page-panel">
          <div className="section-heading inline">
            <div>
              <h2>Today</h2>
              <span>{getWeekRange(weekOffset)}</span>
            </div>
            <div className="today-page-controls">
              <button className="icon-button" onClick={() => navigateDay(-1)} aria-label="Previous day">
                <ChevronLeft size={18} />
              </button>
              <button className="icon-button" onClick={() => navigateDay(1)} aria-label="Next day">
                <ChevronRight size={18} />
              </button>
              <button className="button subtle" type="button" onClick={() => setShowWeekPicker((current) => !current)}>
                Week
              </button>
              {showWeekPicker && (
                <div className="week-picker">
                  <input type="week" value={getWeekInputValue(selectedDate)} onChange={handleWeekInputChange} />
                  <button className="button compact" type="button" onClick={() => setShowWeekPicker(false)}>
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="today-day-tabs">
            {weekDates.map((day, index) => (
              <button
                key={day.toISOString()}
                className={areSameDate(day, selectedDate) ? "button active" : "button subtle"}
                onClick={() => selectWeekDay(index)}
              >
                {formatDayShortLabel(day)}
              </button>
            ))}
            <span className="today-date-label">{selectedDateLabel}</span>
          </div>
          <TodayPanel blocks={dayBlocks} completed={completed} onToggle={onToggle} headerLabel={selectedDateShort} />
        </section>
        <DailyTargetsPanel targets={targets} onToggle={onToggleTarget} onAdd={onAddTarget} />
      </div>
      <aside className="right-rail">
        <GoalSummaryPanel goals={goals} />
      </aside>
    </div>
  );
}

function BalancePanel({ blocks }: { blocks: TimeBlock[] }) {
  const totals = useMemo(() => {
    const trackedBlocks = blocks.filter((block) => !(block.activity === "school" && block.title === "School"));
    return trackedBlocks.reduce(
      (sum, block) => {
        sum[block.activity] += block.end - block.start;
        return sum;
      },
      { football: 0, school: 0, cadets: 0, priority: 0, other: 0 } as Record<ActivityType, number>,
    );
  }, [blocks]);

  const visible: ActivityType[] = ["school", "football", "cadets"];

  return (
    <section className="panel balance-panel" aria-labelledby="balance-heading">
      <div className="activity-summary">
        {visible.map((activity) => {
          const meta = activityMeta[activity];
          const Icon = iconMap[activity];
          const hours = totals[activity] / 60;
          const percentage = Math.min(100, (hours / meta.targetHours) * 100);
          return (
            <div className="summary-tile" key={activity}>
              <span className="activity-icon large" style={{ color: meta.color, background: meta.soft }}>
                <Icon size={26} />
              </span>
              <span className="summary-label">{meta.label}</span>
              <strong>{formatHours(totals[activity])}</strong>
              <small>Planned this week</small>
              <span className="mini-track" aria-label={`${meta.label} target progress`}>
                <span style={{ width: `${percentage}%`, background: meta.color }} />
              </span>
            </div>
          );
        })}
      </div>
      <p className="consistency" id="balance-heading">
        <Flame size={16} /> Consistency today. Progress tomorrow.
      </p>
    </section>
  );
}

function DailyTargetsPanel({
  targets,
  onToggle,
  onAdd,
}: {
  targets: DailyTarget[];
  onToggle: (id: string) => void;
  onAdd: (target: DailyTarget) => void;
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<RoleType>("student");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onAdd({
      id: `target-${Date.now()}`,
      title: String(formData.get("title")),
      role,
      activity: roleMeta[role].activity,
      measure: String(formData.get("measure")),
      done: false,
    });
    event.currentTarget.reset();
    setRole("student");
    setOpen(false);
  }

  return (
    <section className="panel daily-panel" aria-labelledby="daily-targets-heading">
      <div className="section-heading">
        <div>
          <h2 id="daily-targets-heading">Daily Targets</h2>
          <span>Know what success looks like today.</span>
        </div>
        <button className="link-button" onClick={() => setOpen((current) => !current)}>
          {open ? "Close" : "Add Target"}
        </button>
      </div>
      {open && (
        <form className="inline-form target-form" onSubmit={handleSubmit}>
          <label>
            Role
            <select value={role} onChange={(event) => setRole(event.target.value as RoleType)}>
              {roleOptions.map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Target
            <input name="title" required defaultValue="Complete focused practice" />
          </label>
          <label>
            Measure
            <input name="measure" required defaultValue="Evidence I can check off" />
          </label>
          <button className="button primary compact" type="submit">
            Save Target
          </button>
        </form>
      )}
      <div className="role-target-grid">
        {roleOptions.map(([key, roleInfo]) => {
          const roleTargets = targets.filter((target) => target.role === key);
          const completed = roleTargets.filter((target) => target.done).length;
          const Icon = iconMap[roleInfo.activity];
          const meta = activityMeta[roleInfo.activity];
          return (
            <article className="role-target-card" key={key}>
              <div className="role-card-head">
                <span className="activity-icon" style={{ color: meta.color, background: meta.soft }}>
                  <Icon size={18} />
                </span>
                <div>
                  <strong>{roleInfo.label}</strong>
                  <small>{roleInfo.success}</small>
                </div>
                <em>
                  {completed}/{roleTargets.length}
                </em>
              </div>
              <div className="target-list">
                {roleTargets.map((target) => (
                  <button className="target-row" key={target.id} onClick={() => onToggle(target.id)}>
                    <span className={`check-box ${target.done ? "checked" : ""}`}>{target.done && <Check size={14} />}</span>
                    <span>
                      <strong>{target.title}</strong>
                      <small>{target.measure}</small>
                    </span>
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AddBlockForm({ onAdd }: { onAdd: (block: TimeBlock) => void }) {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState<ActivityType>("school");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const start = parseTime(String(formData.get("start")));
    const end = parseTime(String(formData.get("end")));
    onAdd({
      id: `block-${Date.now()}`,
      title: String(formData.get("title")),
      detail: String(formData.get("detail")),
      activity,
      day: Number(formData.get("day")),
      start,
      end: end > start ? end : start + 30,
    });
    event.currentTarget.reset();
    setActivity("school");
    setOpen(false);
  }

  return (
    <div className="planner-actions">
      <button className="button primary" onClick={() => setOpen((current) => !current)}>
        <Plus size={17} />
        Add Block
      </button>
      {open && (
        <form className="add-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input name="title" required defaultValue="Focused Study" />
          </label>
          <label>
            Detail
            <input name="detail" required defaultValue="Practice and review" />
          </label>
          <label>
            Type
            <select value={activity} onChange={(event) => setActivity(event.target.value as ActivityType)}>
              {Object.entries(activityMeta).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Day
            <select name="day" defaultValue={0}>
              {weekDays.map((day, index) => (
                <option key={day} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </label>
          <label>
            Start
            <input name="start" type="time" required defaultValue="16:00" />
          </label>
          <label>
            End
            <input name="end" type="time" required defaultValue="17:00" />
          </label>
          <button className="button primary compact" type="submit">
            Save
          </button>
        </form>
      )}
    </div>
  );
}

function PlannerGrid({ blocks }: { blocks: TimeBlock[] }) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index);
  const todayIndex = 0;

  return (
    <section className="planner-shell" aria-label="Week Plan">
      <div className="planner-head">
        <div className="time-head">Time</div>
        {weekDays.map((day, index) => (
          <div className={`day-head ${index === todayIndex ? "current" : ""}`} key={day}>
            <span>{day}</span>
            <small>{6 + index}</small>
          </div>
        ))}
      </div>
      <div className="planner-body" style={{ "--row-height": `${rowHeight}px` } as React.CSSProperties}>
        <div className="time-axis">
          {hours.map((hour) => (
            <span key={hour}>{hour.toString().padStart(2, "0")}:00</span>
          ))}
        </div>
        {weekDays.map((day, dayIndex) => (
          <div className="day-column" key={day}>
            {blocks
              .filter((block) => block.day === dayIndex)
              .map((block) => {
                const meta = activityMeta[block.activity];
                const top = ((block.start - startHour * 60) / 60) * rowHeight;
                const height = Math.max(34, ((block.end - block.start) / 60) * rowHeight);
                return (
                  <article
                    className="time-block"
                    key={block.id}
                    style={{
                      top,
                      height,
                      background: meta.soft,
                      borderColor: meta.border,
                      color: meta.color,
                    }}
                  >
                    <strong>{block.title}</strong>
                    <span>
                      {toTime(block.start)} - {toTime(block.end)}
                    </span>
                  </article>
                );
              })}
          </div>
        ))}
      </div>
    </section>
  );
}

function PracticeLibraryPanel({
  sessions,
  onAdd,
  onSchedule,
  practiceSets,
  onGeneratePracticeSet,
}: {
  sessions: PracticeSession[];
  onAdd: (session: PracticeSession) => void;
  onSchedule: (session: PracticeSession) => void;
  practiceSets: PracticeSet[];
  onGeneratePracticeSet: (topicId: string, tier: QuestionTier, count: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<RoleType>("goalkeeper");
  const [openGenerator, setOpenGenerator] = useState(false);
  const [genTopic, setGenTopic] = useState<string>(() => defaultSyllabus[0].id);
  const [genTier, setGenTier] = useState<QuestionTier>("Mixed");
  const [genCount, setGenCount] = useState<number>(8);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onAdd({
      id: `practice-${Date.now()}`,
      title: String(formData.get("title")),
      role,
      activity: roleMeta[role].activity,
      focus: String(formData.get("focus")),
      durationMinutes: Number(formData.get("duration")),
      confidence: Number(formData.get("confidence")),
    });
    event.currentTarget.reset();
    setRole("goalkeeper");
    setOpen(false);
  }

  return (
    <section className="panel stock-panel" aria-labelledby="practice-library-heading">
      <div className="section-heading">
        <div>
          <h2 id="practice-library-heading">Practice Library</h2>
          <span>Build a reusable stock of goalkeeper, cadet, and study practice.</span>
        </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="link-button" onClick={() => setOpen((current) => !current)}>
              {open ? "Close" : "Add Practice"}
            </button>
            <button className="link-button" onClick={() => setOpenGenerator((c) => !c)}>
              {openGenerator ? "Close" : "Generate Practice Set"}
            </button>
          </div>
      </div>
      {open && (
        <form className="inline-form library-form" onSubmit={handleSubmit}>
          <label>
            Role
            <select value={role} onChange={(event) => setRole(event.target.value as RoleType)}>
              {roleOptions.map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Practice
            <input name="title" required defaultValue="Goalkeeper Handling" />
          </label>
          <label>
            Focus
            <input name="focus" required defaultValue="Clean catch, set position, reset" />
          </label>
          <label>
            Minutes
            <input name="duration" type="number" min="10" max="180" required defaultValue="30" />
          </label>
          <label>
            Confidence
            <input name="confidence" type="number" min="0" max="100" required defaultValue="60" />
          </label>
          <button className="button primary compact" type="submit">
            Save Practice
          </button>
        </form>
      )}
      {openGenerator && (
        <form
          className="inline-form library-form"
          onSubmit={(event) => {
            event.preventDefault();
            onGeneratePracticeSet(genTopic, genTier, genCount);
            setOpenGenerator(false);
          }}
        >
          <label>
            Topic
            <select value={genTopic} onChange={(e) => setGenTopic(e.target.value)}>
              {defaultSyllabus.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tier
            <select value={genTier} onChange={(e) => setGenTier(e.target.value as QuestionTier)}>
              <option value="Mixed">Mixed</option>
              <option value="Foundation">Foundation</option>
              <option value="Higher">Higher</option>
            </select>
          </label>
          <label>
            Count
            <input type="number" min={1} max={200} value={genCount} onChange={(e) => setGenCount(Number(e.target.value))} />
          </label>
          <button className="button primary compact" type="submit">
            Generate
          </button>
        </form>
      )}
      <div className="practice-library-grid">
        {sessions.map((session) => {
          const meta = activityMeta[session.activity];
          const Icon = iconMap[session.activity];
          return (
            <article className="practice-library-card" key={session.id}>
              <div className="library-card-top">
                <span className="activity-icon" style={{ color: meta.color, background: meta.soft }}>
                  <Icon size={18} />
                </span>
                <div>
                  <strong>{session.title}</strong>
                  <small>{roleMeta[session.role].label} - {session.durationMinutes} min</small>
                </div>
              </div>
              <p>{session.focus}</p>
              <span className="progress-track">
                <span style={{ width: `${session.confidence}%`, background: meta.color }} />
              </span>
              <div className="card-footer">
                <small>{session.confidence}% confidence</small>
                <button className="button subtle compact" onClick={() => onSchedule(session)}>
                  <CalendarPlus size={15} />
                  Schedule
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function QuestionBankPanel({
  questions,
  topics,
  selectedTopicId,
  onAdd,
  onGenerate,
  onViewSyllabus,
  onSelectTopic,
}: {
  questions: QuizQuestion[];
  topics: SyllabusTopic[];
  selectedTopicId: string;
  onAdd: (question: QuizQuestion) => void;
  onGenerate: (questions: QuizQuestion[]) => void;
  onViewSyllabus: () => void;
  onSelectTopic?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [topicId, setTopicId] = useState(selectedTopicId);
  const [tier, setTier] = useState<QuestionTier>("Mixed");
  const [questionCount, setQuestionCount] = useState(8);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusMessage, setStatusMessage] = useState("");

  const sortedTopics = useMemo(() => {
    return [...topics].sort((a, b) => {
      const aSubject = getTopicSubject(a.id);
      const bSubject = getTopicSubject(b.id);
      if (aSubject !== bSubject) return subjectOrder[aSubject] - subjectOrder[bSubject];
      return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" });
    });
  }, [topics]);

  const visibleTopics = useMemo(() => {
    return sortedTopics.filter((topic) => subjectFilter === "all" || getTopicSubject(topic.id) === subjectFilter);
  }, [sortedTopics, subjectFilter]);

  useEffect(() => {
    if (visibleTopics.length && !visibleTopics.some((topic) => topic.id === topicId)) {
      setTopicId(visibleTopics[0].id);
      onSelectTopic?.(visibleTopics[0].id);
    }
  }, [visibleTopics, topicId, onSelectTopic]);

  const latestQuestions = questions.slice(-4).reverse();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onAdd({
      id: `question-${Date.now()}`,
      topicId,
      prompt: String(formData.get("prompt")),
      options: [
        String(formData.get("optionA")),
        String(formData.get("optionB")),
        String(formData.get("optionC")),
        String(formData.get("optionD")),
      ],
      answer: Number(formData.get("answer")),
      marks: Number(formData.get("marks")) || 3,
      explanation: String(formData.get("explanation")),
    });
    event.currentTarget.reset();
    setTopicId(selectedTopicId);
    setOpen(false);
  }

  function getTopicTitle(id: string) {
    return topics.find((topic) => topic.id === id)?.title ?? "Practice";
  }

  function handleGenerateQuestions() {
    const selectedTopic = topics.find((topic) => topic.id === topicId) ?? topics[0];
    if (!selectedTopic.id.startsWith("maths-")) {
      setStatusMessage("Question generation is only available for GCSE Maths topics right now.");
      return;
    }
    const generated = createGcseMathsQuestions(selectedTopic, tier, questionCount);
    onGenerate(generated);
    setStatusMessage(`Added ${generated.length} GCSE-style ${tier} questions for ${selectedTopic.title}.`);
  }

  return (
    <section className="panel stock-panel" aria-labelledby="question-bank-heading">
      <div className="section-heading">
        <div>
          <h2 id="question-bank-heading">Question Bank</h2>
          <span>Save practice exam questions and answer guidance.</span>
        </div>
        <div className="question-bank-actions">
          <label>
            Subject
            <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
              {Object.entries(subjectLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Count
            <select value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))}>
              <option value={8}>8</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
          <label>
            Tier
            <select value={tier} onChange={(event) => setTier(event.target.value as QuestionTier)}>
              <option value="Foundation">Foundation</option>
              <option value="Higher">Higher</option>
              <option value="Mixed">Mixed</option>
            </select>
          </label>
          <button className="link-button" onClick={handleGenerateQuestions}>
            Generate questions
          </button>
          <button className="link-button" onClick={onViewSyllabus}>
            View syllabus
          </button>
          <button className="link-button" onClick={() => setOpen((current) => !current)}>
            {open ? "Close" : "Add Question"}
          </button>
        </div>
      </div>
      {statusMessage && <p className="generator-status">{statusMessage}</p>}
      {open && (
        <form className="question-form" onSubmit={handleSubmit}>
          <label>
            Topic
            <select value={topicId} onChange={(event) => setTopicId(event.target.value)}>
              {visibleTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Marks
            <select name="marks" defaultValue="3">
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </label>
          <label className="span-2">
            Question
            <textarea name="prompt" required defaultValue="Explain one reason why..." />
          </label>
          <label>
            A
            <input name="optionA" required defaultValue="Answer option A" />
          </label>
          <label>
            B
            <input name="optionB" required defaultValue="Answer option B" />
          </label>
          <label>
            C
            <input name="optionC" required defaultValue="Answer option C" />
          </label>
          <label>
            D
            <input name="optionD" required defaultValue="Answer option D" />
          </label>
          <label>
            Correct
            <select name="answer" defaultValue="1">
              <option value="0">A</option>
              <option value="1">B</option>
              <option value="2">C</option>
              <option value="3">D</option>
            </select>
          </label>
          <label className="span-2">
            Answer guidance
            <textarea name="explanation" required defaultValue="Use this to explain why the answer works." />
          </label>
          <button className="button primary compact" type="submit">
            Save Question
          </button>
        </form>
      )}
      <div className="bank-summary">
        <div>
          <FileQuestion size={20} />
          <strong>{questions.length}</strong>
          <span>questions stocked</span>
        </div>
        <div>
          <NotebookPen size={20} />
          <strong>{questions.filter((question) => question.topicId === selectedTopicId).length}</strong>
          <span>for selected topic</span>
        </div>
      </div>
      <div className="topic-picker">
        <strong>Practice topics</strong>
        <div className="topic-pill-grid">
          {visibleTopics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={`topic-pill ${topic.id === topicId ? "active" : ""}`}
              onClick={() => {
                setTopicId(topic.id);
                onSelectTopic?.(topic.id);
              }}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </div>
      <div className="question-list">
        {latestQuestions.map((question) => (
          <article className="question-row" key={question.id}>
            <strong>
              {getTopicTitle(question.topicId)} · {getQuestionMarks(question)}-mark
            </strong>
            <p>{question.prompt}</p>
            <small>{question.explanation}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function GoalsPanel({
  goals,
  onProgress,
  onAdd,
  onToggleStep,
}: {
  goals: Goal[];
  onProgress: (id: string, delta: number) => void;
  onAdd: (goal: Goal) => void;
  onToggleStep: (goalId: string, stepId: string) => void;
}) {
  const [open, setOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const stepsText = String(data.get("steps") || "");
    const steps = stepsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s, i) => ({ id: `step-${Date.now()}-${i}`, title: s, progress: 0, done: false }));

    onAdd({
      id: `goal-${Date.now()}`,
      title: String(data.get("title")),
      activity: data.get("activity") as ActivityType,
      startDate: String(data.get("startDate")),
      targetDate: String(data.get("targetDate")),
      progress: Number(data.get("progress")),
      nextStep: String(data.get("nextStep")),
      status: (data.get("status") as any) || "unknown",
      steps,
    });
    event.currentTarget.reset();
    setOpen(false);
  }

  return (
    <section className="panel side-panel" aria-labelledby="goals-heading">
      <div className="section-heading">
        <h2 id="goals-heading">Goals</h2>
        <button className="link-button" onClick={() => setOpen((current) => !current)}>
          {open ? "Close" : "Add"}
        </button>
      </div>
      {open && (
        <form className="goal-form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Goal title" required />
          <select name="activity" defaultValue="football">
            <option value="football">Football</option>
            <option value="school">School Work</option>
            <option value="cadets">Air Cadets</option>
          </select>
          <label>
            Start Date
            <input name="startDate" type="date" />
          </label>
          <label>
            Target Date
            <input name="targetDate" type="date" required />
          </label>
          <label>
            Status
            <select name="status" defaultValue="unknown">
              <option value="unknown">Unknown</option>
              <option value="on-track">On track</option>
              <option value="behind">Behind schedule</option>
              <option value="ahead">Ahead</option>
            </select>
          </label>
          <label>
            Key steps (one per line)
            <textarea name="steps" placeholder="e.g. Complete past paper 1\nReview answers with teacher" />
          </label>
          <input name="nextStep" placeholder="Next step" />
          <input name="progress" type="number" min="0" max="100" defaultValue="10" />
          <button className="button primary compact" type="submit">
            Save Goal
          </button>
        </form>
      )}
      <div className="goal-list">
        {goals.map((goal) => {
          const meta = activityMeta[goal.activity];
          const Icon = iconMap[goal.activity];
          return (
            <article className="goal-row" key={goal.id}>
              <span className="activity-icon" style={{ color: meta.color, background: meta.soft }}>
                <Icon size={18} />
              </span>
              <div className="goal-content">
                <div className="goal-title">
                  <strong>{goal.title}</strong>
                  <span>{goal.progress}%</span>
                </div>
                <span className="progress-track">
                  <span style={{ width: `${goal.progress}%`, background: meta.color }} />
                </span>
                <div className="goal-meta">
                  <small>
                    {goal.startDate ? `${goal.startDate} → ` : ""}
                    {goal.targetDate}
                  </small>
                  <small style={{ fontWeight: 600 }}>{goal.status || "unknown"}</small>
                </div>
                <div className="step-list">
                  {(goal.steps || []).map((step) => (
                    <label key={step.id}>
                      <input type="checkbox" checked={step.done} onChange={() => onToggleStep(goal.id, step.id)} />
                      <span>{step.title}</span>
                      <small>{step.progress}%</small>
                    </label>
                  ))}
                </div>
                <div className="stepper">
                  <button onClick={() => onProgress(goal.id, -5)}>-5</button>
                  <button onClick={() => onProgress(goal.id, 5)}>+5</button>
                </div>
                
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GoalSummaryPanel({ goals }: { goals: Goal[] }) {
  return (
    <section className="panel side-panel" aria-labelledby="goal-summary-heading">
      <div className="section-heading">
        <h2 id="goal-summary-heading">Goal summary</h2>
      </div>
      <div className="goal-list">
        {goals.map((goal) => {
          const meta = activityMeta[goal.activity];
          const Icon = iconMap[goal.activity];
          return (
            <article className="goal-summary-row" key={goal.id}>
              <span className="activity-icon" style={{ color: meta.color, background: meta.soft }}>
                <Icon size={18} />
              </span>
              <div className="goal-content goal-summary-content">
                <div className="goal-title">
                  <strong>{goal.title}</strong>
                  <span>{goal.progress}%</span>
                </div>
                <span className="progress-track">
                  <span style={{ width: `${goal.progress}%`, background: meta.color }} />
                </span>
                <div className="goal-meta">
                  <small>{goal.targetDate}</small>
                  <small style={{ marginLeft: 8, fontWeight: 600 }}>{goal.status || "unknown"}</small>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SyllabusPanel({
  topics,
  selectedTopic,
  onSelect,
  onStudy,
}: {
  topics: SyllabusTopic[];
  selectedTopic: SyllabusTopic;
  onSelect: (id: string) => void;
  onStudy: (id: string) => void;
}) {
  return (
    <section className="panel side-panel" aria-labelledby="syllabus-heading">
      <div className="section-heading">
        <h2 id="syllabus-heading">Syllabus</h2>
        <button className="link-button" onClick={() => onStudy(selectedTopic.id)}>
          Study +10%
        </button>
      </div>
      <div className="topic-list">
        {topics.map((topic) => {
          const meta = activityMeta[topic.activity];
          const Icon = iconMap[topic.activity];
          return (
            <button
              className={`topic-row ${selectedTopic.id === topic.id ? "selected" : ""}`}
              key={topic.id}
              onClick={() => onSelect(topic.id)}
            >
              <span className="activity-icon muted" style={{ color: meta.color }}>
                <Icon size={18} />
              </span>
              <span>
                <strong>{topic.title}</strong>
                <small>{topic.area}</small>
              </span>
              <em>{topic.progress}%</em>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SyllabusPage({ topics }: { topics: SyllabusTopic[] }) {
  const mathsTopics = topics.filter((topic) => topic.id.startsWith("maths-"));
  const physicsTopics = topics.filter((topic) => topic.id.startsWith("physics-"));
  const chemistryTopics = topics.filter((topic) => topic.id.startsWith("chemistry-"));
  const cadetsTopics = topics.filter((topic) => topic.id.startsWith("cadets-"));
  const goalkeeperTopics = topics.filter((topic) => topic.id.startsWith("football-"));

  return (
    <div className="dashboard-grid">
      <div className="primary-column">
        <section className="panel syllabus-page-panel">
          <div className="section-heading inline">
            <div>
              <h2>Syllabus Hub</h2>
              <span>Organised GCSE topics for Maths, Physics, Chemistry, cadets, and goalkeeper development.</span>
            </div>
          </div>

          <div className="syllabus-intro">
            <p>Use the cards below to explore the key learning areas for Maths, Physics, Chemistry, cadet leadership and promotion, and goalkeeper training.</p>
          </div>

          <div className="syllabus-section">
            <h3>GCSE Maths (AQA)</h3>
            <div className="syllabus-grid">
              {mathsTopics.map((topic) => (
                <article className="syllabus-card" key={topic.id}>
                  <div className="syllabus-card-header">
                    <strong>{topic.title}</strong>
                    <small>{topic.area}</small>
                  </div>
                  <ul className="topic-points">
                    {topic.knowledge.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="syllabus-section">
            <h3>GCSE Physics (AQA)</h3>
            <div className="syllabus-grid">
              {physicsTopics.map((topic) => (
                <article className="syllabus-card" key={topic.id}>
                  <div className="syllabus-card-header">
                    <strong>{topic.title}</strong>
                    <small>{topic.area}</small>
                  </div>
                  <ul className="topic-points">
                    {topic.knowledge.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="syllabus-section">
            <h3>GCSE Chemistry (AQA)</h3>
            <div className="syllabus-grid">
              {chemistryTopics.map((topic) => (
                <article className="syllabus-card" key={topic.id}>
                  <div className="syllabus-card-header">
                    <strong>{topic.title}</strong>
                    <small>{topic.area}</small>
                  </div>
                  <ul className="topic-points">
                    {topic.knowledge.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="syllabus-section">
            <h3>Corporal / Sergeant Promotion</h3>
            <div className="syllabus-grid">
              {cadetPromotionSyllabus.map((section) => (
                <article className="syllabus-card" key={section.title}>
                  <div className="syllabus-card-header">
                    <strong>{section.title}</strong>
                  </div>
                  <ul className="topic-points">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="syllabus-section">
            <h3>Goalkeeper Development</h3>
            <div className="syllabus-grid">
              {goalkeeperDrillsSyllabus.map((section) => (
                <article className="syllabus-card" key={section.title}>
                  <div className="syllabus-card-header">
                    <strong>{section.title}</strong>
                  </div>
                  <ul className="topic-points">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PracticePage({
  questions,
  topics,
  selectedTopicId,
  onSelectTopic,
  onAddQuestion,
  onGenerateQuestions,
  onViewSyllabus,
  onAnswered,
}: {
  questions: QuizQuestion[];
  topics: SyllabusTopic[];
  selectedTopicId: string;
  onSelectTopic: (id: string) => void;
  onAddQuestion: (question: QuizQuestion) => void;
  onGenerateQuestions: (questions: QuizQuestion[]) => void;
  onViewSyllabus: () => void;
  onAnswered: (topicId: string) => void;
}) {
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];
  const [showQuestionBank, setShowQuestionBank] = useState(true);

  return (
    <div className="dashboard-grid">
      <div className="primary-column">
        <section className="panel practice-page-panel">
          <div className="section-heading inline">
            <div>
              <h2>Practice Hub</h2>
              <span>Practice exam-style questions grouped by syllabus topic.</span>
            </div>
          </div>
          <div className={`practice-page-layout${showQuestionBank ? "" : " collapsed"}`}>
            {showQuestionBank && (
              <div className="practice-left-column">
                <QuestionBankPanel
                  questions={questions}
                  topics={topics}
                  selectedTopicId={selectedTopicId}
                  onAdd={onAddQuestion}
                  onGenerate={onGenerateQuestions}
                  onViewSyllabus={onViewSyllabus}
                />
              </div>
            )}
            <div className="practice-right-column">
              <PracticePanel
                questions={questions}
                selectedTopic={selectedTopic}
                onAnswered={onAnswered}
                showQuestionBank={showQuestionBank}
                onToggleQuestionBank={() => setShowQuestionBank((current) => !current)}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function KnowledgePanel({ selectedTopic }: { selectedTopic: SyllabusTopic }) {
  return (
    <section className="panel side-panel knowledge-panel" aria-labelledby="knowledge-heading">
      <div className="section-heading">
        <h2 id="knowledge-heading">Knowledge</h2>
      </div>
      <div className="knowledge-box">
        <strong>{selectedTopic.title}</strong>
        <ul>
          {selectedTopic.knowledge.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PracticePanel({
  questions,
  selectedTopic,
  onAnswered,
  showQuestionBank,
  onToggleQuestionBank,
}: {
  questions: QuizQuestion[];
  selectedTopic: SyllabusTopic;
  onAnswered: (topicId: string) => void;
  showQuestionBank: boolean;
  onToggleQuestionBank: () => void;
}) {
  const available = questions.filter((question) => question.topicId === selectedTopic.id);
  const fallback = questions[0];
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showMarkScheme, setShowMarkScheme] = useState(false);
  const question = available[activeIndex % Math.max(1, available.length)] ?? fallback;
  const hasOptions = Boolean(question.options && question.options.length);
  const answered = hasOptions ? selected !== null : false;
  const isCorrect = hasOptions && selected === question.answer;

  function choose(optionIndex: number) {
    if (answered || !hasOptions) return;
    setSelected(optionIndex);
    setScore((current) => ({
      correct: current.correct + (optionIndex === question.answer ? 1 : 0),
      total: current.total + 1,
    }));
    if (optionIndex === question.answer) {
      onAnswered(question.topicId);
    }
  }

  function nextQuestion() {
    setSelected(null);
    setActiveIndex((current) => current + 1);
    setShowMarkScheme(false);
  }

  function reset() {
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    setActiveIndex(0);
    setShowMarkScheme(false);
  }

  return (
    <section className="panel side-panel practice-panel" aria-labelledby="practice-heading">
      <div className="section-heading">
        <h2 id="practice-heading">Practice</h2>
        <span className="points">{score.correct}/{score.total}</span>
      </div>
      <div className="quiz-card">
        <div className="quiz-meta">
          <strong>{getQuestionMarks(question)}-mark question</strong>
          <span>{selectedTopic.title}</span>
        </div>
        <p>{question.prompt}</p>
        {question.options && question.options.length ? (
          <div className="answers">
            {question.options.map((option, index) => (
              <button
                className={`answer ${answered && index === question.answer ? "correct" : ""} ${
                  answered && selected === index && !isCorrect ? "wrong" : ""
                }`}
                key={option}
                onClick={() => choose(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option}
                {answered && index === question.answer && <Check size={16} />}
              </button>
            ))}
          </div>
        ) : (
          <div className="long-answer-box">
            <textarea readOnly placeholder="Answer this question in your notebook, then check the mark scheme." />
          </div>
        )}
        {answered && question.options && question.options.length && <p className="explanation">{question.explanation}</p>}
        <div className="mark-scheme-toggle">
          <button className="button subtle compact" onClick={() => setShowMarkScheme((current) => !current)}>
            {showMarkScheme ? "Hide mark scheme" : "Show mark scheme"}
          </button>
          <button className="button subtle compact" onClick={onToggleQuestionBank}>
            {showQuestionBank ? "Hide question bank" : "Show question bank"}
          </button>
        </div>
        {showMarkScheme && (
          <div className="mark-scheme">
            <h3>Mark scheme</h3>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>
      <div className="practice-actions">
        <button
          className="button primary"
          onClick={() => {
            if (answered) {
              nextQuestion();
            } else if (hasOptions && typeof question.answer === "number") {
              choose(question.answer);
            } else {
              nextQuestion();
            }
          }}
        >
          <ListPlus size={17} />
          {answered ? "Next Question" : hasOptions ? "Start Practice" : "Next Question"}
        </button>
        <button className="icon-button" onClick={reset} aria-label="Reset practice score">
          <RotateCcw size={17} />
        </button>
      </div>
    </section>
  );
}

function App() {
  const [blocks, setBlocks] = useStoredState("jacob.blocks", defaultBlocks);
  const [goals, setGoals] = useStoredState("jacob.goals", defaultGoals);
  const [topics, setTopics] = useStoredState(
    "jacob.syllabus",
    defaultSyllabus,
    (stored, initial) => {
      if (!Array.isArray(stored)) {
        return initial;
      }

      const storedById = new Map((stored as SyllabusTopic[]).map((item) => [item.id, item]));
      const merged = initial.map((item) => storedById.get(item.id) ?? item);
      const extraStored = (stored as SyllabusTopic[]).filter(
        (item) => !initial.some((initialItem) => initialItem.id === item.id),
      );
      return [...merged, ...extraStored];
    },
  );
  const [dailyTargets, setDailyTargets] = useStoredState("jacob.dailyTargets", defaultDailyTargets);
  const [practiceSessions, setPracticeSessions] = useStoredState("jacob.practiceSessions", defaultPracticeSessions);
  const [practiceSets, setPracticeSets] = useStoredState<PracticeSet[]>("jacob.practiceSets", defaultPracticeSets as PracticeSet[]);
  const [questions, setQuestions] = useStoredState("jacob.questions", defaultQuestions);
  const [completed, setCompleted] = useStoredState<string[]>("jacob.completed", []);
  const [selectedTopicId, setSelectedTopicId] = useState(defaultSyllabus[0].id);
  const [activePage, setActivePage] = useState<Page>("dashboard");

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];

  function toggleComplete(id: string) {
    setCompleted((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function addBlock(block: TimeBlock) {
    setBlocks((current) => [...current, block]);
  }

  function addGoal(goal: Goal) {
    setGoals((current) => [...current, goal]);
  }

  function toggleGoalStep(goalId: string, stepId: string) {
    setGoals((current) =>
      current.map((g) => {
        if (g.id !== goalId) return g;
        const steps = (g.steps || []).map((s) => (s.id === stepId ? { ...s, done: !s.done, progress: s.done ? 0 : 100 } : s));
        // Recalculate goal progress as average of steps if present
        const progress = steps.length ? Math.round(steps.reduce((acc, s) => acc + s.progress, 0) / steps.length) : g.progress;
        return { ...g, steps, progress };
      }),
    );
  }

  function addDailyTarget(target: DailyTarget) {
    setDailyTargets((current) => [...current, target]);
  }

  function toggleDailyTarget(id: string) {
    setDailyTargets((current) =>
      current.map((target) => (target.id === id ? { ...target, done: !target.done } : target)),
    );
  }

  function addPracticeSession(session: PracticeSession) {
    setPracticeSessions((current) => [...current, session]);
  }

  function schedulePracticeSession(session: PracticeSession) {
    const start = session.activity === "football" ? 1050 : session.activity === "cadets" ? 1140 : 960;
    addBlock({
      id: `scheduled-${session.id}-${Date.now()}`,
      title: session.title,
      detail: session.focus,
      activity: session.activity,
      day: 0,
      start,
      end: start + session.durationMinutes,
    });
  }

  function generatePracticeSet(topicId: string, tier: QuestionTier, count: number) {
    const topic = topics.find((t) => t.id === topicId) ?? topics[0];
    const questionsGenerated = createGcseMathsQuestions(topic, tier, count);
    const set: PracticeSet = {
      id: `pset-${Date.now()}`,
      title: `${topic.title} practice (${tier})`,
      questions: questionsGenerated,
      topicId,
      tier,
      createdAt: Date.now(),
    };
    setPracticeSets((current) => [set, ...current]);
    // Optionally schedule or open UI later — for now we persist the transient set.
  }

  function addQuestion(question: QuizQuestion) {
    setQuestions((current) => [...current, question]);
  }

  function addQuestions(nextQuestions: QuizQuestion[]) {
    setQuestions((current) => [...current, ...nextQuestions]);
  }

  function viewMathsSyllabus() {
    const mathsTopic = topics.find((topic) => topic.id.startsWith("maths-"));
    if (mathsTopic) {
      setSelectedTopicId(mathsTopic.id);
      setActivePage("syllabus");
    }
  }

  function navigate(page: Page) {
    setActivePage(page);
  }

  function adjustGoal(id: string, delta: number) {
    setGoals((current) =>
      current.map((goal) => (goal.id === id ? { ...goal, progress: clampProgress(goal.progress + delta) } : goal)),
    );
  }

  function studyTopic(id: string) {
    setTopics((current) =>
      current.map((topic) => (topic.id === id ? { ...topic, progress: clampProgress(topic.progress + 10) } : topic)),
    );
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={navigate} />
      <main className="workspace">
        <Header />
        {activePage === "goals" ? (
          <div className="dashboard-grid">
            <div className="primary-column">
              <GoalsPanel goals={goals} onProgress={adjustGoal} onAdd={addGoal} onToggleStep={toggleGoalStep} />
            </div>
          </div>
        ) : activePage === "today" ? (
          <TodayPage
            blocks={blocks}
            targets={dailyTargets}
            goals={goals}
            completed={completed}
            onToggle={toggleComplete}
            onToggleTarget={toggleDailyTarget}
            onAddTarget={addDailyTarget}
          />
        ) : activePage === "syllabus" ? (
          <SyllabusPage topics={topics} />
        ) : activePage === "practice" ? (
          <PracticePage
            questions={questions}
            topics={topics}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onAddQuestion={addQuestion}
            onGenerateQuestions={addQuestions}
            onViewSyllabus={viewMathsSyllabus}
            onAnswered={studyTopic}
          />
        ) : (
          <div className="dashboard-grid">
            <div className="primary-column">
              <div className="top-panels">
                <TodayPanel blocks={blocks} completed={completed} onToggle={toggleComplete} headerLabel="Today" />
                <BalancePanel blocks={blocks} />
              </div>
              <DailyTargetsPanel targets={dailyTargets} onToggle={toggleDailyTarget} onAdd={addDailyTarget} />
              <AddBlockForm onAdd={addBlock} />
              <PlannerGrid blocks={blocks} />
              <div className="stock-grid">
                <PracticeLibraryPanel
                  sessions={practiceSessions}
                  onAdd={addPracticeSession}
                  onSchedule={schedulePracticeSession}
                  practiceSets={practiceSets}
                  onGeneratePracticeSet={generatePracticeSet}
                />
                <QuestionBankPanel
                  questions={questions}
                  topics={topics}
                  selectedTopicId={selectedTopic.id}
                  onAdd={addQuestion}
                  onGenerate={addQuestions}
                  onViewSyllabus={viewMathsSyllabus}
                />
              </div>
            </div>
            <aside className="right-rail">
              <GoalSummaryPanel goals={goals} />
              <SyllabusPanel
                topics={topics}
                selectedTopic={selectedTopic}
                onSelect={setSelectedTopicId}
                onStudy={studyTopic}
              />
              <PracticePanel
                questions={questions}
                selectedTopic={selectedTopic}
                onAnswered={studyTopic}
                showQuestionBank={true}
                onToggleQuestionBank={() => {}}
              />
              <KnowledgePanel selectedTopic={selectedTopic} />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
