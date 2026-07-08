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

type KnowledgeGuideSection = {
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

const goalKnowledgeGuides: Record<string, KnowledgeGuideSection[]> = {
  fitness: [
    {
      title: "Physical Output",
      points: [
        "Know how to structure aerobic, speed-endurance, and repeated sprint work across the week.",
        "Understand the difference between conditioning for football and just general fitness.",
        "Track heart rate, recovery time, and session intensity so progress is measurable.",
      ],
    },
    {
      title: "Recovery Standards",
      points: [
        "Sleep, hydration, cooldowns, and nutrition have to be treated as part of the training plan.",
        "Recognise fatigue signs early so performance does not dip by the end of the week.",
        "Know when to push intensity and when to use recovery or mobility work instead.",
      ],
    },
  ],
  maths: [
    {
      title: "Exam Technique",
      points: [
        "Know how to set out algebra, number, ratio, geometry, probability, and statistics work clearly enough for method marks.",
        "Understand when to show substitutions, formula use, and rearrangements line by line.",
        "Know how to check whether an answer is sensible using estimation or reverse operations.",
      ],
    },
    {
      title: "Weak Topic Repair",
      points: [
        "Be secure with algebraic manipulation, fractions, percentages, compound growth, and geometric reasoning.",
        "Know the non-calculator methods well enough to complete early paper questions quickly and accurately.",
        "Review mistakes by topic, not just by paper, so repeated errors are removed properly.",
      ],
    },
  ],
  drill: [
    {
      title: "Drill Precision",
      points: [
        "Know every word of command exactly and deliver them with the correct pace, pause, and volume.",
        "Understand the reason behind timings, dressing, turns, saluting, and parade movement.",
        "Be able to spot and correct faults quickly without breaking confidence or flow.",
      ],
    },
    {
      title: "Command Presence",
      points: [
        "A strong drill standard depends on confidence, posture, consistency, and authority.",
        "Know how to position yourself so the whole flight can hear and follow clearly.",
        "Corrections should be specific, calm, and immediate rather than vague or delayed.",
      ],
    },
  ],
  "cadets-promotion-sgt": [
    {
      title: "Leadership Evidence",
      points: [
        "Know how to lead cadets in real situations, not just talk about leadership in theory.",
        "Understand how to delegate, brief, supervise, and review an activity from start to finish.",
        "You should be able to explain examples where you improved standards, solved problems, or developed younger cadets.",
      ],
    },
    {
      title: "Board Interview Knowledge",
      points: [
        "Know RAFAC structure, squadron expectations, safeguarding basics, dress standards, and the responsibilities of a Sergeant.",
        "Be ready to explain why you deserve promotion using specific evidence rather than generic claims.",
        "Understand how to speak clearly, answer directly, and back up each point with examples from parade nights.",
      ],
    },
    {
      title: "Training Delivery",
      points: [
        "Know how to plan a short lesson with a clear objective, a simple structure, and checks for understanding.",
        "Be able to teach drill, cadet knowledge, or practical skills in a way that keeps a group engaged.",
        "Strong promotion evidence comes from repeated reliable performance, not one-off good nights.",
      ],
    },
  ],
  "goalkeeping-jpl": [
    {
      title: "Technical Goalkeeping",
      points: [
        "Know the details of set position, footwork, handling shape, diving mechanics, and recovery steps after each action.",
        "Understand how body shape changes for low saves, high claims, one-v-ones, and crosses.",
        "Review technical mistakes from footage so corrections are specific and repeatable in training.",
      ],
    },
    {
      title: "Game Intelligence",
      points: [
        "Read triggers for pressing, through balls, cut-backs, and crossing situations earlier than outfield players.",
        "Know when to hold, when to sweep, and when to narrow angles aggressively.",
        "Distribution decisions should be based on opponent shape, teammate body position, and game state.",
      ],
    },
    {
      title: "Performance Habits",
      points: [
        "Top goalkeepers organise constantly, reset quickly after mistakes, and keep communication specific.",
        "Strength, mobility, explosiveness, and recovery all matter because technical quality drops when the body fades.",
        "Use match review to track claims, saves, distribution success, and goals conceded by cause.",
      ],
    },
  ],
  "school-grade-9s": [
    {
      title: "Revision System",
      points: [
        "Know what each subject actually demands in the exam: recall, explanation, method, analysis, and written structure.",
        "Build a revision cycle using retrieval, worked examples, timed practice, and feedback rather than passive rereading.",
        "Separate weak topics from secure ones so time is spent where marks are genuinely available.",
      ],
    },
    {
      title: "Exam Execution",
      points: [
        "Grade 9 performance comes from accuracy under pressure, not just knowing content when relaxed.",
        "Know how to manage timings, command words, mark allocations, and checking routines in every paper.",
        "After each mock or past paper, convert mistakes into a fix list with clear reteach and reattempt actions.",
      ],
    },
  ],
};

const knowledgeSupportByActivity: Record<ActivityType, { mistakes: string[]; revision: string[] }> = {
  school: {
    mistakes: [
      "Skipping working and losing method marks on questions worth 3 marks or more.",
      "Using formulas or definitions from memory without checking the exact conditions in the question.",
      "Rushing final answers without unit checks, rounding checks, or reasonableness checks.",
    ],
    revision: [
      "Use 20-minute focused blocks: worked example, one timed question, then a correction pass.",
      "Build a personal error log with the exact reason each mark was lost and how to prevent it.",
      "Revisit weak skills after 48 hours with fresh questions to secure long-term recall.",
    ],
  },
  cadets: {
    mistakes: [
      "Knowing the theory but not applying it with confident delivery during parade nights.",
      "Giving broad instructions instead of clear, specific commands and standards.",
      "Failing to collect feedback and evidence after delivering leadership or instructional tasks.",
    ],
    revision: [
      "Rehearse key commands and explanations out loud so delivery is sharp under pressure.",
      "After each session, log what went well, what slipped, and one improvement for next time.",
      "Pair technical knowledge with real leadership scenarios and decisions you can justify.",
    ],
  },
  football: {
    mistakes: [
      "Practising technique in isolation but not linking it to game-state decisions.",
      "Ignoring body shape and footwork details that affect consistency under pressure.",
      "Reviewing performance generally instead of tracking repeatable technical errors.",
    ],
    revision: [
      "Use short technical blocks followed by realistic pressure reps with decision-making.",
      "Clip or note three moments per session and convert each into a specific correction cue.",
      "Finish sessions with reflection: what trigger, movement, and communication choice worked best.",
    ],
  },
  priority: {
    mistakes: [
      "Treating priority tasks as urgent only, instead of defining outcome quality first.",
      "Switching context too often and losing depth on high-value tasks.",
      "Completing tasks without a final quality check against the expected standard.",
    ],
    revision: [
      "Start each task with a success criterion so focus stays on quality, not just completion.",
      "Protect one deep-work block daily for the highest-impact target.",
      "Run a quick end-of-day review to lock in progress and carry forward only clear next steps.",
    ],
  },
  other: {
    mistakes: [
      "Studying without a clear objective for what must be remembered or demonstrated.",
      "Collecting notes but not converting them into retrieval practice or action.",
      "Letting inconsistent routine reduce confidence across the week.",
    ],
    revision: [
      "Define one measurable learning outcome before starting any study session.",
      "Convert notes into short prompts and test recall before checking answers.",
      "Use weekly checkpoints to ensure progress is visible and sustainable.",
    ],
  },
};

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

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function formatHours(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, value));
}

type Page = "dashboard" | "today" | "goals" | "syllabus" | "practice" | "knowledge" | "calendar" | "commitments" | "settings" | "profile" | "gf";

type UiSettings = {
  fontSize: number;
  screenColor: string;
  calendarColor: string;
  dyslexiaBackground: "default" | "cream" | "blue" | "green";
  highContrastText: boolean;
  showQuotes: boolean;
  quotes: string[];
};

type ProfileSettings = {
  name: string;
  subtitle: string;
  avatarDataUrl: string;
};

type GfItem = {
  id: string;
  title: string;
  timeSpentMinutes: number;
};

type GfSettings = {
  partnerName: string;
};

const defaultGfSettings: GfSettings = {
  partnerName: "",
};

const defaultUiSettings: UiSettings = {
  fontSize: 16,
  screenColor: "#10a7a0",
  calendarColor: "#1f7ac4",
  dyslexiaBackground: "default",
  highContrastText: false,
  showQuotes: true,
  quotes: [
    "Consistency beats intensity when you stay with it.",
    "Small daily wins build serious long-term results.",
  ],
};

const defaultProfileSettings: ProfileSettings = {
  name: "Jacob",
  subtitle: "Cadet Cdt",
  avatarDataUrl: "",
};

type QuestionTier = "Foundation" | "Higher" | "Mixed";

type GcseMathPattern = {
  tier: QuestionTier;
  create: (index: number) => {
    prompt: string;
    explanation: string;
    marks: number;
    options?: string[];
    answer?: number;
  };
};

function getAoTagForStep(marks: number, index: number) {
  if (marks < 4) return "";
  const aoCycle = marks >= 6 ? ["AO1", "AO2", "AO3", "AO2", "AO3", "AO1"] : ["AO1", "AO2", "AO3", "AO2"];
  return aoCycle[index % aoCycle.length];
}

function formatExamBoardMarkScheme(marks: number, steps: string[]) {
  const cleaned = steps.filter(Boolean);
  const lines = [
    `Exam-board style mark scheme (${marks} marks)`,
    ...cleaned.map((step, index) => {
      const ao = getAoTagForStep(marks, index);
      const aoPrefix = ao ? `[${ao}] ` : "";
      return `• Step ${index + 1} (1 mark): ${aoPrefix}Award 1 mark for ${step}`;
    }),
    `Full marks criteria: ${marks}/${marks} requires complete, logically ordered working with an accurate final answer.`,
  ];
  return lines.join("\n");
}

function extractWorkingSteps(rawExplanation: string) {
  const cleaned = rawExplanation
    .replace(/Mark scheme[^:]*:\s*/gi, "")
    .replace(/If two[^.]*\./gi, "")
    .replace(/If two[^,]*,/gi, "")
    .replace(/If two[^;]*;/gi, "")
    .replace(/If two[^\n]*/gi, "")
    .replace(/\b\d+\s*marks?\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned
    .split(/[.;]+|,\s*(?=\d+\s*mark\b)|,\s*(?=mark\b)/i)
    .map((part) =>
      part
        .replace(/^step\s*\d+\s*\(\s*\d+\s*marks?\s*\):\s*/i, "")
        .replace(/^\[AO[123]\]\s*/i, "")
        .replace(/^award\s*\d+\s*marks?\s*for\s*/i, "")
        .replace(/^\d+\s*mark\s*for\s*/i, "")
        .replace(/^mark\s*for\s*/i, "")
        .trim(),
    )
    .filter((part) => part.length > 8);
}

function buildLongAnswerPrompt(prompt: string, index: number, marks: number) {
  if (marks < 5) return prompt;
  const hasCommandWord = /^(work out|calculate|determine|explain|justify|evaluate|prove|show that)\b/i.test(prompt.trim());
  if (hasCommandWord) return prompt;

  const commandWords = marks >= 6 ? ["Evaluate", "Justify", "Prove", "Show that"] : ["Explain", "Determine", "Work out", "Calculate"];
  const commandWord = commandWords[index % commandWords.length];
  const cleaned = prompt.replace(/^[^a-zA-Z0-9]+/, "").replace(/[?.!]+$/, "");
  return `${commandWord} ${cleaned}. Show full working and a clearly justified final answer.`;
}

function formatMathNumber(value: number) {
  const rounded = Math.round(value * 10000) / 10000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function deriveArithmeticExpressionSteps(prompt: string) {
  const expressionMatch = prompt.match(/(?:work out|calculate)\s+([\d\s()+\-*/×÷.]+)(?:[.?]|$)/i);
  if (!expressionMatch) return [] as string[];

  const rawExpression = expressionMatch[1].trim();
  if (!rawExpression || /[a-z]/i.test(rawExpression)) return [] as string[];
  if (rawExpression.includes("(") || rawExpression.includes(")")) return [] as string[];

  const normalized = rawExpression.replace(/×/g, "*").replace(/÷/g, "/").replace(/\s+/g, " ").trim();
  const tokens = normalized.match(/\d+(?:\.\d+)?|[+\-*/]/g);
  if (!tokens || tokens.length < 3) return [] as string[];

  const working = [...tokens];
  const steps: string[] = [];
  const hasMixedPrecedence = /[+\-]/.test(normalized) && /[*/]/.test(normalized);
  if (hasMixedPrecedence) {
    steps.push("BIDMAS: do the multiplication or division first.");
  }

  const applyOps = (ops: string[]) => {
    let index = 0;
    while (index < working.length) {
      const operator = working[index];
      if (!ops.includes(operator)) {
        index += 1;
        continue;
      }

      const left = Number(working[index - 1]);
      const right = Number(working[index + 1]);
      const result = operator === "*"
        ? left * right
        : operator === "/"
          ? left / right
          : operator === "+"
            ? left + right
            : left - right;
      const symbol = operator === "*" ? "×" : operator === "/" ? "÷" : operator;
      steps.push(`${formatMathNumber(left)} ${symbol} ${formatMathNumber(right)} = ${formatMathNumber(result)}.`);
      working.splice(index - 1, 3, formatMathNumber(result));
      index = Math.max(0, index - 1);
    }
  };

  applyOps(["*", "/"]);
  applyOps(["+", "-"]);

  return steps;
}

function deriveWorkedMathSteps(prompt: string, rawExplanation: string) {
  const steps: string[] = [...deriveArithmeticExpressionSteps(prompt)];

  const discountMatch = prompt.match(/price of £?(\d+(?:\.\d+)?) is reduced by (\d+(?:\.\d+)?)%/i);
  if (discountMatch) {
    const original = Number(discountMatch[1]);
    const reduction = Number(discountMatch[2]);
    const multiplier = (100 - reduction) / 100;
    const finalPrice = original * multiplier;
    steps.push(`BIDMAS: work out the multiplier first, (100 - ${reduction})/100 = ${formatMathNumber(multiplier)}.`);
    steps.push(`${original} × ${formatMathNumber(multiplier)} = ${formatMathNumber(finalPrice)}.`);
    steps.push(`New price = £${formatMathNumber(finalPrice)}.`);
  }

  const recipeMatch = prompt.match(/uses (\d+(?:\.\d+)?) g of sugar.*factor of (\d+(?:\.\d+)?)/i);
  if (recipeMatch) {
    const sugar = Number(recipeMatch[1]);
    const scale = Number(recipeMatch[2]);
    const total = sugar * scale;
    steps.push(`${sugar} × ${scale} = ${formatMathNumber(total)}.`);
    steps.push(`Sugar needed = ${formatMathNumber(total)} g.`);
  }

  const originalQuantityMatch = prompt.match(/increases by (\d+(?:\.\d+)?)% each year\. After (\d+) years it is (\d+(?:\.\d+)?)/i);
  if (originalQuantityMatch) {
    const rate = Number(originalQuantityMatch[1]);
    const years = Number(originalQuantityMatch[2]);
    const after = Number(originalQuantityMatch[3]);
    const multiplier = Math.pow(1 + rate / 100, years);
    const original = after / multiplier;
    steps.push(`Growth multiplier = (1 + ${rate}/100)^${years} = ${formatMathNumber(multiplier)}.`);
    steps.push(`Original × ${formatMathNumber(multiplier)} = ${formatMathNumber(after)}.`);
    steps.push(`Original = ${formatMathNumber(after)} ÷ ${formatMathNumber(multiplier)} = ${formatMathNumber(original)}.`);
  }

  const repeatedIncreaseMatch = prompt.match(/quantity is (\d+(?:\.\d+)?) and increases by (\d+(?:\.\d+)?)% each year for (\d+) years/i);
  if (repeatedIncreaseMatch && /original quantity/i.test(prompt)) {
    const rate = Number(repeatedIncreaseMatch[2]);
    const years = Number(repeatedIncreaseMatch[3]);
    const resultMatch = prompt.match(/result is (\d+(?:\.\d+)?)/i);
    if (resultMatch) {
      const after = Number(resultMatch[1]);
      const multiplier = Math.pow(1 + rate / 100, years);
      const original = after / multiplier;
      steps.push(`Growth multiplier = (1 + ${rate}/100)^${years} = ${formatMathNumber(multiplier)}.`);
      steps.push(`Original = ${formatMathNumber(after)} ÷ ${formatMathNumber(multiplier)} = ${formatMathNumber(original)}.`);
    }
  }

  const cyclistMatch = prompt.match(/travels (\d+(?:\.\d+)?) km in (\d+(?:\.\d+)?) minutes.*m\/s/i);
  if (cyclistMatch) {
    const distanceKm = Number(cyclistMatch[1]);
    const timeMinutes = Number(cyclistMatch[2]);
    const distanceM = distanceKm * 1000;
    const timeSeconds = timeMinutes * 60;
    const speed = distanceM / timeSeconds;
    steps.push(`${distanceKm} km = ${formatMathNumber(distanceM)} m.`);
    steps.push(`${timeMinutes} minutes = ${formatMathNumber(timeSeconds)} s.`);
    steps.push(`${formatMathNumber(distanceM)} ÷ ${formatMathNumber(timeSeconds)} = ${formatMathNumber(speed)} m/s.`);
  }

  const machineMatch = prompt.match(/makes (\d+(?:\.\d+)?) items in (\d+(?:\.\d+)?) minutes.*in 5 hours/i);
  if (machineMatch) {
    const items = Number(machineMatch[1]);
    const minutes = Number(machineMatch[2]);
    const rate = items / minutes;
    const total = rate * 300;
    steps.push(`${items} ÷ ${minutes} = ${formatMathNumber(rate)} items per minute.`);
    steps.push(`5 hours = 300 minutes.`);
    steps.push(`${formatMathNumber(rate)} × 300 = ${formatMathNumber(total)} items.`);
  }

  const sectorMatch = prompt.match(/radius (\d+(?:\.\d+)?) cm.*angle (\d+(?:\.\d+)?)°.*π = 3\.14/i);
  if (sectorMatch && /sector/i.test(prompt)) {
    const radius = Number(sectorMatch[1]);
    const angle = Number(sectorMatch[2]);
    const fullArea = 3.14 * radius * radius;
    const sectorArea = (angle / 360) * fullArea;
    steps.push(`Area of full circle = 3.14 × ${radius}² = ${formatMathNumber(fullArea)}.`);
    steps.push(`Area of sector = ${angle}/360 × ${formatMathNumber(fullArea)} = ${formatMathNumber(sectorArea)} cm².`);
  }

  const triangleSinMatch = prompt.match(/AB = (\d+(?:\.\d+)?) cm, AC = (\d+(?:\.\d+)?) cm.*angle A = (\d+(?:\.\d+)?)°/i);
  if (triangleSinMatch) {
    const a = Number(triangleSinMatch[1]);
    const b = Number(triangleSinMatch[2]);
    const angle = Number(triangleSinMatch[3]);
    const area = 0.5 * a * b * Math.sin((angle * Math.PI) / 180);
    steps.push(`Area = 1/2 × ${a} × ${b} × sin ${angle}°.`);
    steps.push(`Area = ${formatMathNumber(area)} cm².`);
  }

  const rangeMatch = prompt.match(/data set contains ([\d,\s]+)/i);
  if (rangeMatch && /range/i.test(prompt)) {
    const values = rangeMatch[1].split(",").map((value) => Number(value.trim())).filter((value) => !Number.isNaN(value));
    if (values.length) {
      const highest = Math.max(...values);
      const lowest = Math.min(...values);
      steps.push(`Highest value = ${highest}.`);
      steps.push(`Lowest value = ${lowest}.`);
      steps.push(`Range = ${highest} - ${lowest} = ${highest - lowest}.`);
    }
  }

  const notBlueMatch = prompt.match(/contains (\d+) red, (\d+) blue and (\d+) green/i);
  if (notBlueMatch && /not blue/i.test(prompt)) {
    const red = Number(notBlueMatch[1]);
    const blue = Number(notBlueMatch[2]);
    const green = Number(notBlueMatch[3]);
    const notBlue = red + green;
    const total = red + blue + green;
    steps.push(`Not blue counters = ${red} + ${green} = ${notBlue}.`);
    steps.push(`Probability = ${notBlue}/${total}.`);
  }

  const meanMatch = rawExplanation.match(/Mean = ([^=]+)=([^=]+)=([^.=]+)/i);
  if (meanMatch) {
    steps.push(`Mean = ${meanMatch[1].trim()} = ${meanMatch[2].trim()}.`);
    steps.push(`${meanMatch[2].trim()} = ${meanMatch[3].trim()}.`);
  }

  const equationLines = rawExplanation
    .split(/[.]+/)
    .map((line) => line.trim())
    .filter((line) => line.includes("="))
    .flatMap((line) => {
      const parts = line.split("=").map((part) => part.trim()).filter(Boolean);
      if (parts.length < 2) return [] as string[];
      return parts.slice(0, -1).map((part, index) => `${part} = ${parts[index + 1]}.`);
    });

  for (const line of equationLines) {
    if (!steps.includes(line)) steps.push(line);
  }

  return Array.from(new Set(steps)).filter(Boolean);
}

function extractNumericMethodSteps(prompt: string, rawExplanation: string) {
  const source = `${prompt} ${rawExplanation}`;
  const steps: string[] = [];

  const percentMatch = source.match(/(\d+(?:\.\d+)?)%\s+of\s+(\d+(?:\.\d+)?)/i);
  if (percentMatch) {
    const percent = Number(percentMatch[1]);
    const base = Number(percentMatch[2]);
    const value = (base * percent) / 100;
    steps.push(`Write ${percent}% as ${percent}/100 and calculate ${base} × ${percent}/100 = ${Number(value.toFixed(4))}.`);
  }

  const linearMatch = source.match(/(\d+)x\s*([+-])\s*(\d+)\s*=\s*(\d+)/i);
  if (linearMatch) {
    const a = Number(linearMatch[1]);
    const op = linearMatch[2];
    const b = Number(linearMatch[3]);
    const c = Number(linearMatch[4]);
    const shifted = op === "+" ? c - b : c + b;
    const x = shifted / a;
    steps.push(`Rearrange ${a}x ${op} ${b} = ${c} to ${a}x = ${shifted}, then divide by ${a}: x = ${Number(x.toFixed(4))}.`);
  }

  const ratioMatch = source.match(/ratio\s+(\d+)\s*:\s*(\d+)/i);
  if (ratioMatch) {
    const left = Number(ratioMatch[1]);
    const right = Number(ratioMatch[2]);
    steps.push(`Use the ratio scale factor method with ${left}:${right}, multiplying each part by the same factor.`);
  }

  const expressionMatches = Array.from(source.matchAll(/\b\d+(?:\.\d+)?\s*[×x*]\s*\d+(?:\.\d+)?(?:\s*[÷/]\s*\d+(?:\.\d+)?)?/g));
  for (const match of expressionMatches.slice(0, 2)) {
    steps.push(`Carry out the calculation line explicitly: ${match[0].replace(/x/g, "×")}.`);
  }

  return Array.from(new Set(steps));
}

function toExamBoardMarkScheme(prompt: string, rawExplanation: string, marks: number, isMathsQuestion = false) {
  const parsed = extractWorkingSteps(rawExplanation);
  const workedMathSteps = isMathsQuestion ? deriveWorkedMathSteps(prompt, rawExplanation) : [];
  const mathsMethodSteps = isMathsQuestion ? extractNumericMethodSteps(prompt, rawExplanation) : [];
  const steps = isMathsQuestion && workedMathSteps.length
    ? [...workedMathSteps, ...mathsMethodSteps, ...parsed]
    : [...parsed, ...mathsMethodSteps];
  const commandWordMatch = prompt.trim().match(/^(Work out|Calculate|Determine|Explain|Justify|Evaluate|Prove|Show that)\b/i);
  const commandWord = commandWordMatch ? commandWordMatch[0] : "Solve";

  if (!steps.length) {
    steps.push("Select the correct method that matches the command word in the question.");
  }

  if (!(isMathsQuestion && workedMathSteps.length)) {
    steps.push("Set out the method in a clear first line before carrying out calculations.");
    if (marks >= 2) steps.push("Substitute all given values accurately and keep units consistent.");
    if (marks >= 3) steps.push("Show a valid intermediate line so method marks can be awarded.");
    if (marks >= 4) steps.push("Use mathematically correct notation and justified transformations.");
    if (marks >= 5) steps.push(`Address the command word \"${commandWord}\" directly with clear reasoning.`);
    if (marks >= 6) steps.push("Conclude with a fully justified final statement and a reasonableness check.");
  }

  const uniqueSteps = Array.from(new Set(steps));
  while (uniqueSteps.length < marks) {
    uniqueSteps.push("Add one more explicit line of valid working that supports the conclusion.");
  }
  const selectedSteps = uniqueSteps.slice(0, marks);

  return formatExamBoardMarkScheme(marks, selectedSteps);
}

function getMarkSchemeSummary(explanation: string) {
  const lines = explanation
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const firstStep = lines.find((line) => line.startsWith("• "));
  if (firstStep) {
    return firstStep
      .replace(/^•\s*step\s*\d+\s*\(\s*\d+\s*marks?\s*\):\s*/i, "")
      .replace(/^•\s*\d+\.\s*/, "")
      .replace(/^\[AO[123]\]\s*/i, "")
      .replace(/^award\s*\d+\s*marks?\s*for\s*/i, "");
  }
  return lines[0] || "Mark scheme available";
}

type AiMarkingResult = {
  score: number;
  maxMarks: number;
  strengths: string[];
  nextSteps: string[];
  matchedSteps: number;
  totalSteps: number;
  band: string;
  examinerJudgement: string;
};

type ExaminerProfile = {
  label: string;
  aoWeights: { AO1: number; AO2: number; AO3: number };
  highMarkMinLength: number;
  requiresReasoningForTopBand: boolean;
  requiresFinalJudgementForTopBand: boolean;
  requiresWorkingForTopBand: boolean;
  subjectEvidenceRegex: RegExp;
};

function getExaminerProfile(topicId: string): ExaminerProfile {
  const subject = getTopicSubject(topicId);

  if (subject === "maths") {
    return {
      label: "Maths examiner",
      aoWeights: { AO1: 1.1, AO2: 1.25, AO3: 1.05 },
      highMarkMinLength: 120,
      requiresReasoningForTopBand: true,
      requiresFinalJudgementForTopBand: true,
      requiresWorkingForTopBand: true,
      subjectEvidenceRegex: /\bformula\b|\bsubstitute\b|\brearrange\b|\btherefore\b|\bunits?\b|\bcalculate\b/,
    };
  }

  if (subject === "english") {
    return {
      label: "English examiner",
      aoWeights: { AO1: 1.0, AO2: 1.3, AO3: 1.2 },
      highMarkMinLength: 180,
      requiresReasoningForTopBand: true,
      requiresFinalJudgementForTopBand: true,
      requiresWorkingForTopBand: false,
      subjectEvidenceRegex: /\bquote\b|\bevidence\b|\bwriter\b|\breader\b|\blanguage\b|\bstructure\b|\beffect\b/,
    };
  }

  if (subject === "physics" || subject === "chemistry") {
    return {
      label: "Science examiner",
      aoWeights: { AO1: 1.1, AO2: 1.2, AO3: 1.2 },
      highMarkMinLength: 150,
      requiresReasoningForTopBand: true,
      requiresFinalJudgementForTopBand: true,
      requiresWorkingForTopBand: true,
      subjectEvidenceRegex: /\bparticle\b|\benergy\b|\breaction\b|\bvariable\b|\bfair test\b|\bunits?\b|\bmethod\b/,
    };
  }

  if (subject === "cadets") {
    return {
      label: "Cadet training examiner",
      aoWeights: { AO1: 1.05, AO2: 1.2, AO3: 1.15 },
      highMarkMinLength: 140,
      requiresReasoningForTopBand: true,
      requiresFinalJudgementForTopBand: true,
      requiresWorkingForTopBand: false,
      subjectEvidenceRegex: /\bcommand\b|\bleadership\b|\bbrief\b|\bsafety\b|\bprocedure\b|\bstandard\b/,
    };
  }

  if (subject === "football") {
    return {
      label: "Performance examiner",
      aoWeights: { AO1: 1.0, AO2: 1.2, AO3: 1.2 },
      highMarkMinLength: 140,
      requiresReasoningForTopBand: true,
      requiresFinalJudgementForTopBand: true,
      requiresWorkingForTopBand: false,
      subjectEvidenceRegex: /\bdecision\b|\bposition\b|\btechnique\b|\btransition\b|\bcommunication\b|\bphase\b/,
    };
  }

  return {
    label: "General examiner",
    aoWeights: { AO1: 1.05, AO2: 1.15, AO3: 1.1 },
    highMarkMinLength: 130,
    requiresReasoningForTopBand: true,
    requiresFinalJudgementForTopBand: true,
    requiresWorkingForTopBand: false,
    subjectEvidenceRegex: /\bmethod\b|\bevidence\b|\banalyse\b|\bevaluate\b|\bjustify\b/,
  };
}

type MarkSchemeCriterion = {
  text: string;
  ao?: "AO1" | "AO2" | "AO3";
};

function getMarkSchemeCriteria(explanation: string): MarkSchemeCriterion[] {
  return explanation
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("• "))
    .map((line) => {
      const cleaned = line
        .replace(/^•\s*step\s*\d+\s*\(\s*\d+\s*marks?\s*\):\s*/i, "")
        .replace(/^•\s*\d+\.\s*/, "");
      const aoMatch = cleaned.match(/^\[(AO[123])\]\s*/i);
      const ao = aoMatch ? (aoMatch[1].toUpperCase() as "AO1" | "AO2" | "AO3") : undefined;
      const text = cleaned
        .replace(/^\[AO[123]\]\s*/i, "")
        .replace(/^award\s*\d+\s*marks?\s*for\s*/i, "")
        .trim();
      return { text, ao };
    })
    .filter((criterion) => criterion.text.length > 0);
}

function extractKeywords(text: string) {
  const stopWords = new Set([
    "this", "that", "with", "from", "into", "your", "their", "have", "using", "show", "work", "line",
    "valid", "clear", "final", "answer", "method", "marks", "mark", "step", "steps", "where", "when",
    "then", "than", "each", "must", "require", "full", "given", "keep", "what", "which", "also", "there",
    "because", "should", "would", "could", "about", "after", "before", "under", "over", "between",
  ]);

  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .map((word) => word.trim())
        .filter((word) => word.length >= 3 && !stopWords.has(word)),
    ),
  );
}

function extractNumberTokens(text: string) {
  return Array.from(new Set(text.match(/\b\d+(?:\.\d+)?\b/g) ?? []));
}

function scoreCriterionAgainstAnswer(criterion: MarkSchemeCriterion, normalizedAnswer: string) {
  const keywords = extractKeywords(criterion.text).slice(0, 10);
  const expectedNumbers = extractNumberTokens(criterion.text);
  if (!keywords.length && !expectedNumbers.length) return 0;

  let score = 0;

  if (keywords.length) {
    const hitCount = keywords.filter((keyword) => normalizedAnswer.includes(keyword)).length;
    const coverage = hitCount / keywords.length;
    const baseThreshold = keywords.length >= 5 ? 0.3 : 0.45;
    if (coverage >= baseThreshold || hitCount >= 2) score = 0.7;
    else if (coverage >= 0.18 || hitCount === 1) score = 0.35;
  }

  if (expectedNumbers.length) {
    const numberHits = expectedNumbers.filter((token) => new RegExp(`\\b${token}\\b`).test(normalizedAnswer)).length;
    const numberCoverage = numberHits / expectedNumbers.length;
    if (numberCoverage >= 0.7) score += 0.35;
    else if (numberCoverage >= 0.34) score += 0.2;
    else if (numberHits >= 1) score += 0.1;
  }

  if ((criterion.text.includes("=") || /[×÷*/+-]/.test(criterion.text)) && /[=×÷*/+-]/.test(normalizedAnswer)) {
    score += 0.08;
  }

  return Math.max(0, Math.min(1, score));
}

function markAnswerWithAiExaminer(prompt: string, topicId: string, answer: string, explanation: string, maxMarks: number): AiMarkingResult {
  const profile = getExaminerProfile(topicId);
  const criteria = getMarkSchemeCriteria(explanation);
  const effectiveCriteria = criteria.length
    ? criteria
    : [{ text: "Provide a correct method with clear working and a justified final answer." }];
  const normalizedAnswer = answer.toLowerCase();
  const compactAnswer = normalizedAnswer.replace(/\s+/g, " ");

  if (!answer.trim()) {
    return {
      score: 0,
      maxMarks,
      strengths: [],
      nextSteps: effectiveCriteria.slice(0, 3).map((criterion) => criterion.text),
      matchedSteps: 0,
      totalSteps: effectiveCriteria.length,
      band: "No evidence",
      examinerJudgement: "No credit awarded because no examinable response was provided.",
    };
  }

  const matched: string[] = [];
  const missed: string[] = [];
  let weightedHits = 0;

  for (const criterion of effectiveCriteria) {
    const criterionScore = scoreCriterionAgainstAnswer(criterion, compactAnswer);
    const weight = criterion.ao ? profile.aoWeights[criterion.ao] : profile.aoWeights.AO1;
    weightedHits += criterionScore * weight;

    const label = criterion.ao ? `[${criterion.ao}] ${criterion.text}` : criterion.text;
    if (criterionScore >= 1) {
      matched.push(label);
    } else {
      missed.push(label);
    }
  }

  const hasReasoningLanguage = /\btherefore\b|\bbecause\b|\bhence\b|\bso\b|\bthus\b|\bimplies\b/.test(compactAnswer);
  const hasWorkingEvidence = /\d+\s*[=+\-*/^]\s*\d+|\bsubstitute\b|\bmethod\b|\bcalculate\b|\bformula\b/.test(compactAnswer);
  const hasFinalJudgement = /\bfinal answer\b|\btherefore\b|\bhence\b|\bso the answer\b|\bconclusion\b/.test(compactAnswer);
  const hasSubjectEvidence = profile.subjectEvidenceRegex.test(compactAnswer);

  const denominator = effectiveCriteria.reduce((sum, criterion) => sum + (criterion.ao ? profile.aoWeights[criterion.ao] : profile.aoWeights.AO1), 0);
  const criteriaRatio = denominator > 0 ? weightedHits / denominator : 0;

  let qualityAdjustment = 0;
  if (hasReasoningLanguage) qualityAdjustment += 0.04;
  if (hasWorkingEvidence) qualityAdjustment += 0.05;
  if (hasFinalJudgement) qualityAdjustment += 0.04;
  if (maxMarks >= 5 && answer.length < profile.highMarkMinLength) qualityAdjustment -= 0.12;
  if (maxMarks >= 5 && !hasFinalJudgement) qualityAdjustment -= 0.1;
  if (maxMarks >= 5 && !hasReasoningLanguage) qualityAdjustment -= 0.08;
  if (!hasSubjectEvidence) qualityAdjustment -= 0.08;
  if (hasSubjectEvidence) qualityAdjustment += 0.05;

  const calibratedRatio = Math.max(0, Math.min(1, criteriaRatio + qualityAdjustment));
  let score = Math.round(calibratedRatio * maxMarks);

  if (
    maxMarks >= 5 &&
    ((profile.requiresFinalJudgementForTopBand && !hasFinalJudgement) ||
      (profile.requiresReasoningForTopBand && !hasReasoningLanguage) ||
      (profile.requiresWorkingForTopBand && !hasWorkingEvidence))
  ) {
    score = Math.min(score, maxMarks - 2);
  }

  const topBandEligible =
    score >= maxMarks - 1 &&
    matched.length >= Math.max(1, effectiveCriteria.length - 1) &&
    (!profile.requiresFinalJudgementForTopBand || hasFinalJudgement) &&
    (!profile.requiresReasoningForTopBand || hasReasoningLanguage) &&
    (!profile.requiresWorkingForTopBand || hasWorkingEvidence) &&
    hasSubjectEvidence;

  if (!topBandEligible && score === maxMarks) {
    score = maxMarks - 1;
  }

  const ratio = score / Math.max(1, maxMarks);
  const band = ratio >= 0.85 ? "Top band" : ratio >= 0.65 ? "Secure pass" : ratio >= 0.4 ? "Developing" : "Limited";
  const commandWordMatch = prompt.trim().match(/^(Work out|Calculate|Determine|Explain|Justify|Evaluate|Prove|Show that|Analyse|Demonstrate|Interpret|Describe|Outline|State|Identify)\b/i);
  const commandWord = commandWordMatch ? commandWordMatch[1] : "answer";

  const examinerJudgement =
    band === "Top band"
      ? `Examiner judgement (${profile.label}): response meets top-band standard with secure method, reasoning, and a clear final judgement for \"${commandWord}\".`
      : band === "Secure pass"
        ? `Examiner judgement (${profile.label}): response is mostly secure but needs tighter subject-specific evidence and clearer top-band justification.`
        : band === "Developing"
          ? `Examiner judgement (${profile.label}): response shows partial evidence; add more explicit mark-scheme steps and stronger command-word focus.`
          : `Examiner judgement (${profile.label}): response has limited examinable evidence and needs structured method lines linked to the subject criteria.`;

  return {
    score,
    maxMarks,
    strengths: matched.slice(0, 3),
    nextSteps: missed.slice(0, 3),
    matchedSteps: matched.length,
    totalSteps: effectiveCriteria.length,
    band,
    examinerJudgement,
  };
}

function createNonMathsQuestions(topic: SyllabusTopic, count = 8, startIndex = 0): QuizQuestion[] {
  const subject = getTopicSubject(topic.id);
  const baseId = topic.id.replace(/[^a-z0-9]+/gi, "-");
  const points = topic.knowledge.length ? topic.knowledge : ["Apply core subject knowledge accurately in context."];

  const contextsBySubject: Record<string, string[]> = {
    physics: ["required practical", "energy transfer", "experimental method", "data interpretation", "real-world scenario"],
    chemistry: ["required practical", "particle model", "reaction pathway", "quantitative method", "industrial process"],
    english: ["language analysis", "structure analysis", "critical interpretation", "comparative response", "extended writing"],
    cadets: ["parade night", "leadership task", "navigation exercise", "instructional delivery", "flight management"],
    football: ["match scenario", "training drill", "decision-making phase", "transition moment", "set-piece phase"],
    other: ["applied task", "performance context", "review cycle", "improvement block", "assessment context"],
    maths: ["problem-solving context"],
  };

  const commandWordsByMark: Record<number, string[]> = {
    1: ["State", "Identify"],
    2: ["Describe", "Outline"],
    3: ["Explain", "Interpret"],
    4: ["Analyse", "Demonstrate"],
    5: ["Justify", "Evaluate"],
    6: ["Prove", "Evaluate"],
  };

  return Array.from({ length: count }, (_, localIndex) => {
    const index = startIndex + localIndex;
    const marks = [1, 2, 3, 4, 5, 6][index % 6];
    const contextList = contextsBySubject[subject] ?? contextsBySubject.other;
    const context = contextList[index % contextList.length];
    const pointA = points[index % points.length];
    const pointB = points[(index * 3 + 1) % points.length];
    const commandWords = commandWordsByMark[marks] ?? commandWordsByMark[3];
    const commandWord = commandWords[index % commandWords.length];

    const prompt = marks >= 5
      ? `${commandWord} how the following knowledge should be applied in a ${context}: ${pointA}. Refer to ${pointB.toLowerCase()} and present a full, reasoned response.`
      : `${commandWord} the key knowledge needed for this ${context}: ${pointA}.`;

    const rawSteps = [
      `Identify the precise knowledge point being assessed: ${pointA}`,
      `Apply the point directly to the given ${context} using accurate terminology`,
      `Link the method or reasoning to ${pointB.toLowerCase()}`,
      `Develop the explanation with a valid supporting detail or example`,
      `Justify why the chosen approach is valid and higher quality than weaker alternatives`,
      `Conclude with a precise final judgement that fully answers the command word`,
    ].slice(0, marks);

    return {
      id: `${baseId}-subject-${subject}-${index}-${Date.now()}`,
      topicId: topic.id,
      prompt,
      explanation: toExamBoardMarkScheme(prompt, rawSteps.join("; "), marks, false),
      marks,
    };
  });
}

const gcseMathQuestionPatterns: Record<string, GcseMathPattern[]> = {
  "maths-number": [
    {
      tier: "Foundation",
      create: (index) => {
        const bases = [120, 150, 180, 210, 240, 270, 300, 330];
        const percentages = [10, 12, 15, 18, 20, 25, 30, 35];
        const base = bases[index % bases.length];
        const percent = percentages[index % percentages.length];
        const answer = Math.round((base * percent) / 100);
        return {
          prompt: `Work out ${percent}% of ${base}.`,
          options: [String(answer), String(answer + 5), String(answer - 4), String(answer + 10)],
          answer: 0,
          explanation: `Percentage = ${percent}/100. So ${percent}% of ${base} = ${base} × ${percent}/100 = ${answer}.`,
          marks: 1,
        };
      },
    },
    {
      tier: "Foundation",
      create: (index) => {
        const numerators = [3, 4, 5, 6, 7, 8, 9, 12];
        const denominator = 10;
        const numerator = numerators[index % numerators.length];
        const gcf = gcd(numerator, denominator);
        const simplest = `${numerator / gcf}/${denominator / gcf}`;
        return {
          prompt: `Write ${numerator}/${denominator} in its simplest form.`,
          options: [simplest, `${numerator}/${denominator}`, `${numerator * 2}/${denominator * 2}`, `${numerator - 1}/${denominator}`],
          answer: 0,
          explanation: `Divide numerator and denominator by their highest common factor. ${numerator}/${denominator} simplifies to ${simplest}.`, 
          marks: 1,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const n = [420, 650, 880, 1020, 1360, 1490, 1760, 1980][index % 8];
        const standard = `${(n / Math.pow(10, Math.floor(Math.log10(n)))).toFixed(1)} × 10^${Math.floor(Math.log10(n))}`;
        return {
          prompt: `Write ${n} in standard form.`,
          options: [standard, `${n / 10} × 10^${Math.floor(Math.log10(n))}`, `${n} × 10^0`, `${(n / 100).toFixed(1)} × 10^${Math.floor(Math.log10(n)) + 1}`],
          answer: 0,
          explanation: `Standard form writes ${n} as a number between 1 and 10 times a power of 10. Here that is ${standard}.`, 
          marks: 2,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const reduction = [15, 18, 20, 22, 25, 28, 30, 35][index % 8];
        const original = 100 + (index % 6) * 20;
        const reduced = Math.round(original * (100 - reduction) / 100);
        return {
          prompt: `A price of £${original} is reduced by ${reduction}%. Find the new price. Show your working.`,
          explanation:
            `Mark scheme (3 marks): 1 mark for multiplying by (100 - ${reduction})/100, 1 mark for calculating the product, 1 mark for writing the final price. ` +
            `If two correct steps are shown, award 2/3.`,
          marks: 3,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const scale = [2, 3, 4, 5, 6, 7, 8, 9][index % 8];
        const sugar = 25 + ((index % 5) * 5);
        const answer = sugar * scale;
        return {
          prompt: `A recipe uses ${sugar} g of sugar. It is scaled by a factor of ${scale}. Calculate the sugar needed for the larger recipe. Show all working.`,
          explanation:
            `Mark scheme (4 marks): 1 mark for writing ${sugar} × ${scale}, 1 mark for calculating ${answer} g, 1 mark for showing the multiplication clearly, 1 mark for the final answer. ` +
            `If two correct steps are shown, award 2/4.`,
          marks: 4,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const rate = [6, 7, 8, 9, 10, 11, 12, 15][index % 8];
        const years = 3;
        const after = Math.round(100000 * Math.pow(1 + rate / 100, years));
        return {
          prompt: `A quantity increases by ${rate}% each year. After ${years} years it is ${after}. Find the original quantity. Show your working.`,
          explanation:
            `Mark scheme (5 marks): 1 mark for writing the compound growth expression, 1 mark for rearranging to the original amount, 1 mark for evaluating the divisor, 1 mark for the division, 1 mark for the final answer. ` +
            `If two correct steps are shown, award 2/5.`,
          marks: 5,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const p = [5, 6, 7, 8, 9, 10, 12, 15][index % 8];
        const starting = 200 + (index % 6) * 25;
        const after = Math.round(starting * Math.pow(1 + p / 100, 4));
        return {
          prompt: `A quantity is ${starting} and increases by ${p}% each year for 4 years. The result is ${after}. Work out the original quantity. Show all working.`,
          explanation:
            `Mark scheme (6 marks): 1 mark for writing the compound increase expression, 2 marks for rearranging the formula, 1 mark for calculating the divisor, 1 mark for performing the division, 1 mark for the final answer. ` +
            `If two correct steps are shown, award 2/6.`,
          marks: 6,
        };
      },
    },
  ],
  "maths-algebra": [
    {
      tier: "Foundation",
      create: (index) => {
        const a = 2 + (index % 4);
        const b = 3 + (index % 5);
        const c = a * 5 + b;
        const answer = 5;
        return {
          prompt: `Solve ${a}x + ${b} = ${c}.`, 
          options: [String(answer), String(answer + 1), String(answer - 1), String(answer + 2)],
          answer: 0,
          explanation: `Subtract ${b} to get ${a}x = ${c - b} then divide by ${a} to get x = ${answer}.`, 
          marks: 1,
        };
      },
    },
    {
      tier: "Foundation",
      create: (index) => {
        const a = 2 + (index % 4);
        const b = 1 + (index % 4);
        const result = `${2 * a + 5}x - ${a * b}`;
        return {
          prompt: `Expand and simplify ${a}(2x - ${b}) + 5x.`,
          options: [result, `${2 * a}x - ${a * b}`, `${a + 5}x - ${b}`, `${5 * a}x - ${a * b}`],
          answer: 0,
          explanation: `Expand ${a}(2x - ${b}) = ${2 * a}x - ${a * b}, then add 5x to get ${result}.`, 
          marks: 1,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const a = 1 + (index % 3);
        const b = 4 + (index % 4);
        const c = 2 + (index % 3);
        const disc = b * b - 4 * a * c;
        const root = Math.sqrt(disc);
        const root1 = ((b + root) / (2 * a)).toFixed(2);
        const root2 = ((b - root) / (2 * a)).toFixed(2);
        return {
          prompt: `Solve ${a}x² - ${b}x + ${c} = 0.`, 
          options: [`x = ${root1} or ${root2}`, `x = ${root2} or ${root1}`, `x = ${c} or ${b}`, `x = ${b} or ${c}`],
          answer: 0,
          explanation: `Use the quadratic formula x = [b ± √(b² - 4ac)]/(2a). Here the roots are ${root1} and ${root2}.`, 
          marks: 2,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const a = 2 + (index % 3);
        const b = 3 + (index % 4);
        const c = 1 + (index % 3);
        return {
          prompt: `Solve the simultaneous equations y = ${a}x + ${b} and y = ${c}x - 4. Show your working.`, 
          explanation:
            `Mark scheme (5 marks): 1 mark for equating ${a}x + ${b} and ${c}x - 4, 2 marks for solving the resulting equation, 1 mark for substituting x to find y, 1 mark for the final pair (x, y). ` +
            `If two correct steps are shown, award 2/5.`,
          marks: 5,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const d = 5 + (index % 4);
        return {
          prompt: `The first four terms of a sequence are ${d}, ${d + 5}, ${d + 10}, ${d + 15}. What is the nth term?`, 
          options: [`5n + ${d - 5}`, `5n + ${d}`, `4n + ${d}`, `n + ${d}`],
          answer: 0,
          explanation: `The sequence increases by 5 each term, so nth term = 5n + ${d - 5}.`, 
          marks: 2,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const p = 2 + (index % 3);
        const h = 2 + (index % 4);
        const k = 1 + (index % 3);
        return {
          prompt: `A quadratic with turning point (${p}, ${k}) passes through (${p + 2}, ${h}). Work out its equation in the form y = ax² + bx + c. Show your working.`, 
          explanation:
            `Mark scheme (6 marks): 1 mark for using y = a(x - ${p})² + ${k}, 2 marks for substituting (${p + 2}, ${h}), 1 mark for solving a, 1 mark for expanding, 1 mark for presenting ax² + bx + c. ` +
            `If two correct steps are shown, award 2/6.`,
          marks: 6,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const a = 1 + (index % 3);
        const b = 5 + (index % 4);
        const c = a * b;
        return {
          prompt: `A quadratic equation is x² - ${b}x + ${c} = 0. The roots are x = 1 and x = ${c}. Find the missing root and explain your working.`, 
          explanation:
            `Mark scheme (3 marks): 1 mark for using sum of roots = ${b}, 1 mark for using product of roots = ${c}, 1 mark for the missing root. ` +
            `If two points are correct, award 2/3.`,
          marks: 3,
        };
      },
    },
  ],
  "maths-ratio": [
    {
      tier: "Foundation",
      create: (index) => {
        const x = 2 + (index % 3);
        const y = 3 + (index % 4);
        const quantity = 10 + (index % 5) * 5;
        const answer = (quantity * y) / x;
        return {
          prompt: `A recipe uses ${x} parts sugar to ${y} parts flour. If ${quantity} g of sugar is used, how much flour is needed?`, 
          options: [String(answer), String(answer + 5), String(answer - 5), String(answer + 10)],
          answer: 0,
          explanation: `Use ratio ${x}:${y}. Flour = ${quantity} × ${y}/${x} = ${answer} g.`, 
          marks: 1,
        };
      },
    },
    {
      tier: "Foundation",
      create: (index) => {
        const unit = 3 + (index % 3);
        const apples = 5 + (index % 4);
        const total = unit * apples;
        return {
          prompt: `If ${apples} apples cost £${unit}, how much do ${apples * 3} apples cost at the same rate?`, 
          options: [`£${total * 3 / apples}`, `£${unit * 2}`, `£${unit * 3}`, `£${total}`],
          answer: 0,
          explanation: `Unit cost = £${unit}/${apples}. For ${apples * 3} apples the cost is £${(unit / apples) * apples * 3}.`, 
          marks: 1,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const time = 40 + (index % 4) * 5;
        const distance = 100 + (index % 5) * 20;
        const speed = Math.round((distance / (time / 60)) * 100) / 100;
        return {
          prompt: `A car travels ${distance} km in ${time} minutes. What is its average speed in km/h?`, 
          options: [String(speed), String(speed + 5), String(speed - 3), String(speed + 2)],
          answer: 0,
          explanation: `Convert ${time} minutes to ${time / 60} hours and divide ${distance} by that value.`, 
          marks: 2,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const inc = 12 + (index % 4);
        return {
          prompt: `A quantity increases by ${inc}% and then decreases by ${inc}%. Is the final quantity greater than, less than or equal to the original? Explain your answer.`, 
          options: ["Greater", "Less", "Equal", "Cannot tell"],
          answer: 1,
          explanation: `The decrease is taken from a larger amount after the first increase, so the final quantity is less than the original.`, 
          marks: 2,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const distance = 12 + (index % 5) * 2;
        const time = 45 + (index % 3) * 5;
        return {
          prompt: `A cyclist travels ${distance} km in ${time} minutes. Calculate the average speed in m/s. Show the working.`, 
          explanation:
            `Mark scheme: 1 mark for converting ${distance} km to ${distance * 1000} m, 1 mark for converting ${time} minutes to ${time * 60} s, 2 marks for dividing the distance by the time, 1 mark for the final value. ` +
            `If two steps are correct, award 2/5.`,
          marks: 5,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const items = 120 + (index % 5) * 10;
        const minutes = 45 + (index % 4) * 5;
        return {
          prompt: `A machine makes ${items} items in ${minutes} minutes. At that rate, how many items does it make in 5 hours? Show all working.`, 
          explanation:
            `Mark scheme: 1 mark for finding the rate per minute, 2 marks for converting 5 hours to 300 minutes and multiplying, 1 mark for the final answer. ` +
            `If two correct points are shown, award 2/5.`,
          marks: 6,
        };
      },
    },
  ],
  "maths-geometry": [
    {
      tier: "Foundation",
      create: (index) => {
        const base = 8 + (index % 4) * 2;
        const height = 5 + (index % 4);
        const answer = (base * height) / 2;
        return {
          prompt: `What is the area of a triangle with base ${base} cm and height ${height} cm?`, 
          options: [`${answer} cm²`, `${answer + 5} cm²`, `${answer - 3} cm²`, `${answer + 10} cm²`],
          answer: 0,
          explanation: `Area = ½ × ${base} × ${height} = ${answer} cm².`, 
          marks: 1,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const radius = 7 + (index % 3) * 2;
        const circumference = Number((2 * 3.14 * radius).toFixed(2));
        return {
          prompt: `A circle has radius ${radius} cm. What is its circumference? Use π ≈ 3.14.`, 
          options: [`${circumference} cm`, `${Math.round(3.14 * radius)} cm`, `${Math.round(radius * radius * 3.14)} cm`, `${Math.round(3.14 * 2 * radius * 10) / 10} cm`],
          answer: 0,
          explanation: `Circumference = 2 × π × ${radius} = ${circumference} cm.`, 
          marks: 2,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const hyp = 10 + (index % 4) * 2;
        return {
          prompt: `In a right-angled triangle, angle A = 30° and hypotenuse = ${hyp} cm. What is the opposite side?`, 
          options: [`${(hyp * 0.5).toFixed(2)} cm`, `${(hyp * Math.sqrt(3) / 2).toFixed(2)} cm`, `${(hyp * 0.866).toFixed(2)} cm`, `${(hyp * 0.75).toFixed(2)} cm`],
          answer: 0,
          explanation: `Opposite side = ${hyp} × sin 30° = ${hyp * 0.5} cm.`, 
          marks: 2,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const radius = 9 + (index % 3) * 2;
        const angle = 120 + (index % 3) * 10;
        const area = Number(((angle / 360) * 3.14 * radius * radius).toFixed(1));
        return {
          prompt: `A circle has radius ${radius} cm. Find the area of a sector with angle ${angle}°. Use π = 3.14. Show your working.`, 
          explanation:
            `Mark scheme: 2 marks for using area = θ/360 × πr², 2 marks for substituting ${angle}, ${radius}, and π = 3.14, 1 mark for the final answer. ` +
            `If two correct points are shown, award 2/5.`,
          marks: 5,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const angle = 35 + (index % 3) * 5;
        return {
          prompt: `Two angles in the same segment of a circle are equal. The angle at the circumference is ${angle}°. Find the opposite angle in the same segment.`, 
          options: [`${angle}°`, `${180 - angle}°`, `${90 - angle}°`, `${180 + angle}°`],
          answer: 0,
          explanation: `Angles in the same segment are equal, so the opposite angle is ${angle}°.`, 
          marks: 3,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const a = 7 + (index % 3);
        const c = 9 + (index % 4);
        const angle = 60;
        return {
          prompt: `Triangle ABC has sides AB = ${a} cm, AC = ${c} cm and included angle A = ${angle}°. Calculate the area of triangle ABC. Show your working.`, 
          explanation:
            `Mark scheme: 1 mark for using area = ½ab sin C, 2 marks for substituting ${a}, ${c} and sin ${angle}°, 2 marks for calculating the product, 1 mark for the final answer. ` +
            `If two correct steps are shown, award 2/6.`,
          marks: 6,
        };
      },
    },
  ],
  "maths-probability": [
    {
      tier: "Foundation",
      create: (index) => {
        const red = 2 + (index % 3);
        const blue = 3 + (index % 4);
        const total = red + blue;
        return {
          prompt: `A bag contains ${red} red and ${blue} blue counters. What is the probability of drawing a red counter?`, 
          options: [`${red}/${total}`, `${blue}/${total}`, `${red}/${blue}`, `${red}/${red + 2}`],
          answer: 0,
          explanation: `There are ${red} red counters out of ${total}, so probability = ${red}/${total}.`, 
          marks: 1,
        };
      },
    },
    {
      tier: "Foundation",
      create: (index) => {
        const heads = 1;
        const tails = 1;
        return {
          prompt: `A fair coin is tossed once. What is the probability of getting heads?`, 
          options: ["1/2", "1/4", "1/3", "2/3"],
          answer: 0,
          explanation: `Heads is one of two equally likely outcomes, so probability = 1/2.`, 
          marks: 1,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const dice = [7, 8, 9][index % 3];
        const possibilities = dice === 7 ? 6 : dice === 8 ? 5 : 4;
        return {
          prompt: `Two dice are rolled. What is the probability the total is ${dice}?`, 
          options: [`${possibilities}/36`, `1/6`, `${possibilities}/18`, `${possibilities}/12`],
          answer: 0,
          explanation: `There are ${possibilities} combinations summing to ${dice} out of 36 total outcomes.`, 
          marks: 2,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        return {
          prompt: `A spinner has 3 equal regions labelled A, B and C. What is the probability of A or B on one spin?`, 
          options: ["2/3", "1/3", "1/2", "1/4"],
          answer: 0,
          explanation: `P(A or B) = P(A) + P(B) = 1/3 + 1/3 = 2/3.`, 
          marks: 2,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        return {
          prompt: `A bag contains 5 red, 3 blue and 2 green counters. A counter is selected at random. Find the probability the counter is not blue.`, 
          explanation:
            `Mark scheme: 1 mark for counting not-blue counters (5 + 2 = 7), 1 mark for writing the probability 7/10, 1 mark for simplifying if needed. ` +
            `If two correct points are present, award 2/3.`,
          marks: 3,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        return {
          prompt: `Two dice are rolled. Work out the probability that one die shows an even number and the total is 8. Show your working.`, 
          explanation:
            `Mark scheme: 1 mark for listing outcomes with total 8, 1 mark for identifying even outcomes, 1 mark for counting 3 successful outcomes, 1 mark for using 36 total possibilities, 1 mark for final probability 1/12. ` +
            `If two correct points are shown, award 2/5.`,
          marks: 6,
        };
      },
    },
  ],
  "maths-statistics": [
    {
      tier: "Foundation",
      create: (index) => {
        const values = [3, 5, 7, 7, 8];
        return {
          prompt: `The numbers are ${values.join(", ")}. What is the mode?`, 
          options: ["7", "5", "3", "8"],
          answer: 0,
          explanation: `7 appears most often, so mode = 7.`, 
          marks: 1,
        };
      },
    },
    {
      tier: "Foundation",
      create: (index) => {
        const values = [2, 4, 6, 8, 10];
        return {
          prompt: `The numbers are ${values.join(", ")}. What is the median?`, 
          options: ["6", "5", "8", "4"],
          answer: 0,
          explanation: `The median is the middle value in the ordered list, which is 6.`, 
          marks: 1,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        return {
          prompt: `A spinner has 4 equal sectors. What is the probability of landing on sector A twice in a row?`, 
          options: ["1/16", "1/4", "1/8", "1/2"],
          answer: 0,
          explanation: `Probability of A twice = 1/4 × 1/4 = 1/16.`, 
          marks: 2,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        return {
          prompt: `Five students scored 4, 7, 7, 9 and 13. What is the mean score?`, 
          options: ["8", "8.5", "8.0", "8.2"],
          answer: 0,
          explanation: `Mean = (4 + 7 + 7 + 9 + 13) ÷ 5 = 40 ÷ 5 = 8.`, 
          marks: 2,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const values = [10, 12, 14, 16, 18];
        return {
          prompt: `A frequency table shows values ${values.join(", ")} with equal frequency. Find the mean.`,
          explanation: `Mark scheme: 1 mark for summing the values, 1 mark for dividing by 5, 1 mark for the final mean. If two correct points are shown, award 2/3.`,
          marks: 4,
        };
      },
    },
    {
      tier: "Higher",
      create: (index) => {
        const values = [2, 3, 5, 7, 11];
        return {
          prompt: `A data set contains ${values.join(", ")}. Work out the range and explain your working.`,
          explanation: `Mark scheme: 1 mark for identifying the highest value, 1 mark for identifying the lowest value, 1 mark for subtracting lowest from highest. If two correct steps are shown, award 2/3.`,
          marks: 3,
        };
      },
    },
  ],
};

function createGcseMathsQuestions(topic: SyllabusTopic, tier: QuestionTier = "Mixed", count = 8, startIndex = 0): QuizQuestion[] {
  const baseId = topic.id.replace(/[^a-z0-9]+/gi, "-");
  const patterns = gcseMathQuestionPatterns[topic.id] ?? gcseMathQuestionPatterns["maths-algebra"];
  const filtered = patterns.filter((pattern) => tier === "Mixed" || pattern.tier === tier);
  const selected = filtered.length ? filtered : patterns;
  const prepared = selected.map((pattern, index) => {
    const sample = pattern.create(index);
    return { pattern, marks: sample.marks };
  });
  const markCycle = [1, 2, 3, 4, 5, 6];
  const availableMarks = Array.from(new Set(prepared.map((item) => item.marks))).sort((a, b) => a - b);
  const distributionCycle = markCycle.filter((mark) => availableMarks.includes(mark));
  const usageByMark = new Map<number, number>();

  return Array.from({ length: count }, (_, localIndex) => {
    const index = startIndex + localIndex;
    const targetMark = (distributionCycle.length ? distributionCycle : availableMarks)[
      index % Math.max(1, distributionCycle.length || availableMarks.length)
    ];
    const exact = prepared.filter((item) => item.marks === targetMark);
    const candidatePool = exact.length ? exact : prepared;
    const usage = usageByMark.get(targetMark) ?? 0;
    const chosen = candidatePool[usage % candidatePool.length];
    usageByMark.set(targetMark, usage + 1);

    const questionData = chosen.pattern.create(index);
    const isLongAnswer = questionData.marks >= 5;
    const upgradedPrompt = buildLongAnswerPrompt(questionData.prompt, index, questionData.marks);
    return {
      id: `${baseId}-gcse-${tier.toLowerCase()}-${index}-${Date.now()}`,
      topicId: topic.id,
      prompt: upgradedPrompt,
      options: isLongAnswer ? undefined : questionData.options,
      answer: isLongAnswer ? undefined : questionData.answer,
      explanation: toExamBoardMarkScheme(upgradedPrompt, questionData.explanation, questionData.marks, true),
      marks: questionData.marks,
    };
  });
}

function createQuestionsForTopic(topic: SyllabusTopic, tier: QuestionTier = "Mixed", count = 8, startIndex = 0): QuizQuestion[] {
  if (topic.id.startsWith("maths-")) {
    return createGcseMathsQuestions(topic, tier, count, startIndex);
  }
  return createNonMathsQuestions(topic, count, startIndex);
}

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
  const fallback = [1, 2, 3, 4, 5, 6];
  const hash = [...question.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return fallback[hash % fallback.length];
}

function hexToRgba(hex: string, alpha: number) {
  const cleaned = hex.replace("#", "").trim();
  const normalized = cleaned.length === 3
    ? `${cleaned[0]}${cleaned[0]}${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}`
    : cleaned;
  const valid = /^[0-9a-fA-F]{6}$/.test(normalized) ? normalized : "10a7a0";
  const r = parseInt(valid.slice(0, 2), 16);
  const g = parseInt(valid.slice(2, 4), 16);
  const b = parseInt(valid.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read image file"));
    reader.readAsDataURL(file);
  });
}

function Sidebar({
  activePage,
  onNavigate,
  profile,
}: {
  activePage: Page;
  onNavigate: (page: Page) => void;
  profile: ProfileSettings;
}) {
  const nav = [
    { label: "Week Plan", icon: CalendarDays, page: "dashboard" as const },
    { label: "Today", icon: Target, page: "today" as const },
    { label: "Goals", icon: Medal, page: "goals" as const },
    { label: "Syllabus", icon: BookOpen, page: "syllabus" as const },
    { label: "Knowledge", icon: NotebookPen, page: "knowledge" as const },
    { label: "Practice", icon: Dumbbell, page: "practice" as const },
  ];

  const support = [
    { label: "Calendar", icon: CalendarDays, page: "calendar" as const },
    { label: "Commitments", icon: Clock3, page: "commitments" as const },
    { label: "GF", icon: Flame, page: "gf" as const },
    { label: "Settings", icon: Settings, page: "settings" as const },
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
          <button
            className={`nav-item ${item.page && activePage === item.page ? "active" : ""}`}
            key={item.label}
            onClick={() => {
              if (item.page) onNavigate(item.page);
            }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <button className="profile" onClick={() => onNavigate("profile")}>
        <div className="avatar">
          {profile.avatarDataUrl ? <img src={profile.avatarDataUrl} alt="Profile picture" /> : profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <strong>{profile.name}</strong>
          <span>{profile.subtitle}</span>
        </div>
        <ChevronRight size={18} />
      </button>
    </aside>
  );
}

function Header({ quote }: { quote?: string }) {
  return (
    <header className="topbar">
      <div className="topbar-title-block">
        <h1>Jacob's Development Hub</h1>
      </div>
      {quote && (
        <aside className="motivation-quote">
          <p>"{quote}"</p>
          <small>- Jacob Westwood 2026</small>
        </aside>
      )}
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

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getDayIndex(date: Date) {
  return date.getDay() === 0 ? 6 : date.getDay() - 1;
}

function getWeekStartForDate(date: Date) {
  return getIsoWeekStartDate(getIsoWeek(date).year, getIsoWeek(date).week);
}

function getWeekRangeForDate(date: Date) {
  const monday = getWeekStartForDate(date);
  const sunday = addDays(monday, 6);
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

function startOfMonth(date: Date) {
  const next = new Date(date.getFullYear(), date.getMonth(), 1);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addMonths(date: Date, delta: number) {
  const next = new Date(date.getFullYear(), date.getMonth() + delta, 1);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getMonthGridStart(date: Date) {
  const monthStart = startOfMonth(date);
  return addDays(monthStart, -getDayIndex(monthStart));
}

function getBlocksForDate(blocks: TimeBlock[], date: Date) {
  const dateKey = toDateKey(date);
  const dayIndex = getDayIndex(date);
  return blocks
    .filter((block) => (block.date ? block.date === dateKey : block.day === dayIndex))
    .sort((a, b) => a.start - b.start);
}

function getBlocksForWeek(blocks: TimeBlock[], referenceDate: Date) {
  const weekStart = getWeekStartForDate(referenceDate);
  const weekEnd = addDays(weekStart, 6);
  return blocks.filter((block) => {
    if (!block.date) return true;
    const blockDate = fromDateKey(block.date);
    return blockDate >= weekStart && blockDate <= weekEnd;
  });
}

function resolveBlockOccurrence(block: TimeBlock, referenceDate: Date) {
  if (block.date) return fromDateKey(block.date);

  const weekStart = getWeekStartForDate(referenceDate);
  const occurrence = addDays(weekStart, block.day);
  const nowMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes();

  if (occurrence < referenceDate || (areSameDate(occurrence, referenceDate) && block.end < nowMinutes)) {
    return addDays(occurrence, 7);
  }

  return occurrence;
}

function formatReminderDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (areSameDate(date, today)) return "Today";
  if (areSameDate(date, addDays(today, 1))) return "Tomorrow";
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
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

function getDominantActivity(blocks: TimeBlock[]): ActivityType {
  if (!blocks.length) return "other";

  const totals = blocks.reduce(
    (sum, block) => {
      sum[block.activity] += block.end - block.start;
      return sum;
    },
    { football: 0, school: 0, cadets: 0, priority: 0, other: 0 } as Record<ActivityType, number>,
  );

  return (Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] as ActivityType) ?? "other";
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

function DashboardOverviewPanel({
  blocks,
  completed,
  goals,
  topics,
  targets,
  questions,
  practiceSets,
  selectedDate,
}: {
  blocks: TimeBlock[];
  completed: string[];
  goals: Goal[];
  topics: SyllabusTopic[];
  targets: DailyTarget[];
  questions: QuizQuestion[];
  practiceSets: PracticeSet[];
  selectedDate: Date;
}) {
  const weekStart = getWeekStartForDate(selectedDate);
  const weekDates = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const visibleBlocks = getBlocksForWeek(blocks, selectedDate);

  const totalMinutes = visibleBlocks.reduce((sum, block) => sum + (block.end - block.start), 0);
  const completedCount = completed.length;
  const targetDone = targets.filter((target) => target.done).length;
  const onTrackGoals = goals.filter((goal) => goal.status === "on-track" || goal.status === "ahead").length;
  const activeTopics = topics.filter((topic) => topic.progress > 0 && topic.progress < 100).length;

  const activityTotals = visibleBlocks.reduce(
    (sum, block) => {
      sum[block.activity] += block.end - block.start;
      return sum;
    },
    { football: 0, school: 0, cadets: 0, priority: 0, other: 0 } as Record<ActivityType, number>,
  );

  const topActivities = (Object.entries(activityTotals) as [ActivityType, number][])
    .filter(([, minutes]) => minutes > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <section className="panel dashboard-overview-panel" aria-labelledby="week-overview-heading">
      <div className="dashboard-overview-hero">
        <div>
          <p className="eyebrow">Week plan overview</p>
          <h2 id="week-overview-heading">Broad picture first, detail on the dedicated pages.</h2>
          <p className="dashboard-overview-copy">
            This week is built around the main commitments, progress targets, and revision focus. Use Today, Goals,
            Syllabus, and Practice when you want the full breakdown.
          </p>
        </div>
        <div className="dashboard-stat-grid">
          <article className="dashboard-stat-card emphasis">
            <span>Planned time</span>
            <strong>{formatHours(totalMinutes)}</strong>
            <small>{blocks.length} sessions across the week</small>
          </article>
          <article className="dashboard-stat-card">
            <span>Weekly momentum</span>
            <strong>{completedCount}</strong>
            <small>completed plan items so far</small>
          </article>
          <article className="dashboard-stat-card">
            <span>Goal progress</span>
            <strong>{onTrackGoals}/{goals.length}</strong>
            <small>goals currently on track</small>
          </article>
          <article className="dashboard-stat-card">
            <span>Study + practice</span>
            <strong>{activeTopics + practiceSets.length}</strong>
            <small>{questions.length} saved questions, {targetDone}/{targets.length} targets done</small>
          </article>
        </div>
      </div>

      <div className="dashboard-overview-lower">
        <div className="dashboard-focus-panel">
          <div className="section-heading inline compact-heading">
            <div>
              <h3>Weekly rhythm</h3>
              <span>{getWeekRangeForDate(selectedDate)}</span>
            </div>
          </div>
          <div className="overview-day-grid">
            {weekDates.map((date, index) => {
              const dayBlocks = getBlocksForDate(blocks, date);
              const dominant = getDominantActivity(dayBlocks);
              const meta = activityMeta[dominant];
              const total = dayBlocks.reduce((sum, block) => sum + (block.end - block.start), 0);
              const headline =
                dominant === "school"
                  ? "School-led day"
                  : dominant === "football"
                    ? "Training focus"
                    : dominant === "cadets"
                      ? "Cadet focus"
                      : dominant === "priority"
                        ? "Priority revision"
                        : "Lighter reset day";

              return (
                <article className="overview-day-card" key={date.toISOString()}>
                  <div className="overview-day-head">
                    <strong>{formatDayShortLabel(date)}</strong>
                    <span>{dayBlocks.length} items</span>
                  </div>
                  <p>{headline}</p>
                  <small>{dayBlocks.length ? `${formatHours(total)} planned · ${meta.label}` : "Space to recover or catch up"}</small>
                </article>
              );
            })}
          </div>
        </div>

        <div className="dashboard-snapshot-panel">
          <div className="section-heading inline compact-heading">
            <div>
              <h3>Priority snapshot</h3>
              <span>Where the week is leaning</span>
            </div>
          </div>
          <div className="snapshot-list">
            {topActivities.map(([activity, minutes]) => {
              const meta = activityMeta[activity];
              const Icon = iconMap[activity];
              return (
                <div className="snapshot-row" key={activity}>
                  <span className="activity-icon" style={{ color: meta.color, background: meta.soft }}>
                    <Icon size={18} />
                  </span>
                  <div className="snapshot-copy">
                    <strong>{meta.label}</strong>
                    <small>{formatHours(minutes)} planned this week</small>
                  </div>
                </div>
              );
            })}
            <div className="snapshot-note">
              <strong>Main message</strong>
              <p>Keep the dashboard for orientation only. Switch to the dedicated pages whenever you want the detail.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getSuggestedStartForDay(blocks: TimeBlock[], day: number, activity: ActivityType) {
  const dayBlocks = blocks.filter((block) => block.day === day).sort((a, b) => a.end - b.end);
  const fallback = activity === "football" ? 1050 : activity === "cadets" ? 1140 : 960;
  if (!dayBlocks.length) return fallback;
  return Math.min(Math.max(dayBlocks[dayBlocks.length - 1].end + 30, 900), 1230);
}

function createGoalTrainingBlock(goal: Goal, date: Date, blocks: TimeBlock[], durationMinutes: number): TimeBlock {
  const day = getDayIndex(date);
  const start = getSuggestedStartForDay(blocks, day, goal.activity);
  return {
    id: `goal-session-${goal.id}-${Date.now()}`,
    title: `${goal.title} session`,
    detail: goal.nextStep ?? "Focused development session",
    activity: goal.activity,
    day,
    date: toDateKey(date),
    start,
    end: start + durationMinutes,
  };
}

function CalendarPage({
  blocks,
  goals,
  completed,
  topics,
  targets,
  questions,
  practiceSets,
  onAdd,
  onUpdate,
  onDelete,
}: {
  blocks: TimeBlock[];
  goals: Goal[];
  completed: string[];
  topics: SyllabusTopic[];
  targets: DailyTarget[];
  questions: QuizQuestion[];
  practiceSets: PracticeSet[];
  onAdd: (block: TimeBlock) => void;
  onUpdate: (block: TimeBlock) => void;
  onDelete: (id: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState<Date>(() => today);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [monthCursor, setMonthCursor] = useState<Date>(() => startOfMonth(today));
  const [activity, setActivity] = useState<ActivityType>("school");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [title, setTitle] = useState("Focused session");
  const [detail, setDetail] = useState("Extra development work");
  const [location, setLocation] = useState("");
  const [personalInfo, setPersonalInfo] = useState("");
  const [startTime, setStartTime] = useState("16:00");
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const selectedDay = getDayIndex(selectedDate);
  const selectedDateKey = toDateKey(selectedDate);
  const dayBlocks = getBlocksForDate(blocks, selectedDate);
  const weekStart = getWeekStartForDate(selectedDate);
  const weekDates = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const monthGridStart = getMonthGridStart(monthCursor);
  const monthDates = Array.from({ length: 42 }, (_, index) => addDays(monthGridStart, index));
  const calendarWeekBlocks = getBlocksForWeek(blocks, selectedDate);
  const weekBlocks = blocks
    .filter((block) => {
      if (!block.date) return true;
      const blockDate = fromDateKey(block.date);
      return blockDate >= weekStart && blockDate <= addDays(weekStart, 6);
    })
    .map((block) => (block.date ? { ...block, day: getDayIndex(fromDateKey(block.date)) } : block));
  const upcomingBlocks = blocks
    .map((block) => ({ block, occurrence: resolveBlockOccurrence(block, today) }))
    .filter(({ occurrence }) => occurrence >= today)
    .sort((a, b) => {
      const dateDelta = a.occurrence.getTime() - b.occurrence.getTime();
      if (dateDelta !== 0) return dateDelta;
      return a.block.start - b.block.start;
    })
    .slice(0, 5);

  function resetForm() {
    setActivity("school");
    setDurationMinutes(60);
    setTitle("Focused session");
    setDetail("Extra development work");
    setLocation("");
    setPersonalInfo("");
    setStartTime("16:00");
    setEditingBlockId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const start = parseTime(startTime);
    const block: TimeBlock = {
      id: editingBlockId ?? `calendar-block-${Date.now()}`,
      title,
      detail,
      location: location.trim() || undefined,
      personalInfo: personalInfo.trim() || undefined,
      activity,
      day: selectedDay,
      date: selectedDateKey,
      start,
      end: start + durationMinutes,
    };

    if (editingBlockId) {
      onUpdate(block);
    } else {
      onAdd(block);
    }

    resetForm();
  }

  function startEditing(block: TimeBlock) {
    setEditingBlockId(block.id);
    setTitle(block.title);
    setDetail(block.detail);
    setLocation(block.location ?? "");
    setPersonalInfo(block.personalInfo ?? "");
    setActivity(block.activity);
    setStartTime(toTime(block.start));
    setDurationMinutes(block.end - block.start);
    if (block.date) {
      const nextDate = fromDateKey(block.date);
      setSelectedDate(nextDate);
      setMonthCursor(startOfMonth(nextDate));
    }
  }

  const dayMiniSlots = useMemo(() => {
    const slots: Array<{ type: "busy" | "free"; start: number; end: number; block?: TimeBlock }> = [];
    const sorted = [...dayBlocks].sort((a, b) => a.start - b.start);
    let cursor = startHour * 60;
    const dayEnd = endHour * 60;

    for (const block of sorted) {
      if (block.start > cursor) {
        slots.push({ type: "free", start: cursor, end: block.start });
      }
      slots.push({ type: "busy", start: block.start, end: block.end, block });
      cursor = Math.max(cursor, block.end);
    }

    if (cursor < dayEnd) {
      slots.push({ type: "free", start: cursor, end: dayEnd });
    }

    return slots.filter((slot) => slot.end > slot.start);
  }, [dayBlocks]);

  const freeMinutes = dayMiniSlots
    .filter((slot) => slot.type === "free")
    .reduce((sum, slot) => sum + (slot.end - slot.start), 0);

  return (
    <section className="calendar-page-panel" aria-labelledby="calendar-page-heading">
      <div className="section-heading inline">
        <div>
          <h2 id="calendar-page-heading">Calendar</h2>
          <span>Add events, revision blocks, and extra training sessions directly into your weekly plan.</span>
        </div>
        <div className="calendar-view-switch">
          <button className={viewMode === "week" ? "button active" : "button subtle"} onClick={() => setViewMode("week")}>
            Week view
          </button>
          <button className={viewMode === "month" ? "button active" : "button subtle"} onClick={() => setViewMode("month")}>
            Month view
          </button>
        </div>
      </div>

      <div className="top-panels calendar-summary-panels">
        <DashboardOverviewPanel
          blocks={calendarWeekBlocks}
          completed={completed}
          goals={goals}
          topics={topics}
          targets={targets}
          questions={questions}
          practiceSets={practiceSets}
          selectedDate={selectedDate}
        />
        <BalancePanel blocks={calendarWeekBlocks} />
      </div>

      {viewMode === "week" ? (
        <>
          <div className="calendar-day-tabs">
            {weekDates.map((date) => (
              <button
                key={date.toISOString()}
                className={areSameDate(date, selectedDate) ? "button active" : "button subtle"}
                onClick={() => setSelectedDate(date)}
              >
                {formatDayShortLabel(date)}
              </button>
            ))}
          </div>
          <section className="panel calendar-mini-day-panel">
            <div className="section-heading inline compact-heading">
              <div>
                <h3>{formatDayLabel(selectedDate)} mini calendar</h3>
                <span>{dayBlocks.length} events planned · {formatHours(freeMinutes)} free</span>
              </div>
            </div>
            <div className="calendar-mini-day-list">
              {dayMiniSlots.map((slot, index) =>
                slot.type === "busy" && slot.block ? (
                  <button
                    key={`${slot.block.id}-${index}`}
                    className="calendar-mini-slot busy"
                    type="button"
                    onClick={() => startEditing(slot.block!)}
                  >
                    <div>
                      <strong>{slot.block.title}</strong>
                      <small>{slot.block.detail}</small>
                      {slot.block.location && <small>Location: {slot.block.location}</small>}
                      {slot.block.personalInfo && <small>Info: {slot.block.personalInfo}</small>}
                    </div>
                    <span>{toTime(slot.start)} - {toTime(slot.end)}</span>
                  </button>
                ) : (
                  <div key={`free-${index}`} className="calendar-mini-slot free">
                    <div>
                      <strong>Free time</strong>
                      <small>Available slot</small>
                    </div>
                    <span>{toTime(slot.start)} - {toTime(slot.end)}</span>
                  </div>
                ),
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="calendar-month-header">
          <button className="icon-button" onClick={() => setMonthCursor((current) => addMonths(current, -1))} aria-label="Previous month">
            <ChevronLeft size={18} />
          </button>
          <strong>{monthCursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</strong>
          <button className="icon-button" onClick={() => setMonthCursor((current) => addMonths(current, 1))} aria-label="Next month">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <div className="calendar-page-layout">
        <div className="calendar-main-column">
          <section className="panel calendar-planner-panel">
            <div className="section-heading inline compact-heading">
              <div>
                <h3>{viewMode === "week" ? "Weekly calendar" : "Monthly calendar"}</h3>
                <span>{viewMode === "week" ? getWeekRangeForDate(selectedDate) : monthCursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
              </div>
            </div>
            {viewMode === "week" ? (
              <PlannerGrid blocks={weekBlocks} onSelectBlock={startEditing} />
            ) : (
              <div className="month-grid">
                {weekDays.map((day) => (
                  <div className="month-grid-head" key={day}>{day}</div>
                ))}
                {monthDates.map((date) => {
                  const dateBlocks = getBlocksForDate(blocks, date);
                  const isCurrentMonth = date.getMonth() === monthCursor.getMonth();
                  const isSelected = areSameDate(date, selectedDate);
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      className={`month-cell ${isCurrentMonth ? "" : "muted"} ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedDate(date);
                        setMonthCursor(startOfMonth(date));
                      }}
                    >
                      <span className="month-cell-date">{date.getDate()}</span>
                      <div className="month-cell-events">
                        {dateBlocks.slice(0, 3).map((block) => (
                          <button
                            type="button"
                            className="month-event-pill"
                            key={`${date.toISOString()}-${block.id}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              startEditing(block);
                            }}
                          >
                            {block.title}
                          </button>
                        ))}
                        {dateBlocks.length > 3 && <span className="month-event-more">+{dateBlocks.length - 3} more</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="panel calendar-agenda-panel">
            <div className="section-heading inline compact-heading">
              <div>
                <h3>{weekDays[selectedDay]} agenda</h3>
                <span>{dayBlocks.length} items planned</span>
              </div>
            </div>
            <div className="calendar-agenda-list">
              {dayBlocks.length ? (
                dayBlocks.map((block) => {
                  const meta = activityMeta[block.activity];
                  return (
                    <article
                      className="calendar-agenda-item calendar-event-clickable"
                      key={block.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => startEditing(block)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          startEditing(block);
                        }
                      }}
                    >
                      <div>
                        <strong>{block.title}</strong>
                        <small>{block.detail}</small>
                        {block.location && <small>Location: {block.location}</small>}
                        {block.personalInfo && <small>Info: {block.personalInfo}</small>}
                      </div>
                      <span style={{ color: meta.color }}>{toTime(block.start)} - {toTime(block.end)}</span>
                      <div className="calendar-agenda-actions">
                        <button
                          className="button subtle compact"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            startEditing(block);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="button subtle compact"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onDelete(block.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="calendar-empty-copy">No items planned yet for this day.</p>
              )}
            </div>
          </section>
        </div>

        <div className="calendar-bottom-panels">
          <section className="panel calendar-reminders-panel">
            <div className="section-heading inline compact-heading">
              <div>
                <h3>Coming up</h3>
                <span>Reminders for sessions and events on the horizon.</span>
              </div>
            </div>
            <div className="calendar-reminder-list">
              {upcomingBlocks.length ? (
                upcomingBlocks.map(({ block, occurrence }) => {
                  const meta = activityMeta[block.activity];
                  return (
                    <article
                      className="calendar-reminder-item calendar-event-clickable"
                      key={`${block.id}-${toDateKey(occurrence)}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => startEditing(block)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          startEditing(block);
                        }
                      }}
                    >
                      <div>
                        <strong>{block.title}</strong>
                        <small>{block.detail}</small>
                        {block.location && <small>Location: {block.location}</small>}
                        {block.personalInfo && <small>Info: {block.personalInfo}</small>}
                      </div>
                      <div className="calendar-reminder-meta">
                        <span>{formatReminderDate(occurrence)}</span>
                        <small style={{ color: meta.color }}>{toTime(block.start)} - {toTime(block.end)}</small>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="calendar-empty-copy">No upcoming sessions yet.</p>
              )}
            </div>
          </section>

          <section className="panel calendar-add-panel">
            <div className="section-heading inline compact-heading">
              <div>
                <h3>{editingBlockId ? "Edit event" : "Add event"}</h3>
                <span>{formatDayLabel(selectedDate)} slot</span>
              </div>
            </div>
            <form className="calendar-add-form" onSubmit={handleSubmit}>
              <label>
                Title
                <input value={title} onChange={(event) => setTitle(event.target.value)} required />
              </label>
              <label>
                Detail
                <input value={detail} onChange={(event) => setDetail(event.target.value)} required />
              </label>
              <label>
                Location
                <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Sports hall, classroom" />
              </label>
              <label>
                Personalised info
                <input
                  value={personalInfo}
                  onChange={(event) => setPersonalInfo(event.target.value)}
                  placeholder="Any custom notes, person, kit, reminder..."
                />
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
                Start
                <input value={startTime} onChange={(event) => setStartTime(event.target.value)} type="time" required />
              </label>
              <label>
                Duration
                <div className="calendar-duration-buttons">
                  {[30, 45, 60, 75, 90, 120].map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      className={durationMinutes === minutes ? "duration-button active" : "duration-button"}
                      onClick={() => setDurationMinutes(minutes)}
                    >
                      {minutes}m
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={15}
                  step={15}
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(Math.max(15, Number(event.target.value) || 15))}
                />
              </label>
              <div className="calendar-form-actions">
                <button className="button primary" type="submit">
                  <CalendarPlus size={16} />
                  {editingBlockId ? "Save changes" : "Add to calendar"}
                </button>
                {editingBlockId && (
                  <button className="button subtle" type="button" onClick={resetForm}>
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="panel calendar-goal-panel">
            <div className="section-heading inline compact-heading">
              <div>
                <h3>Quick goal sessions</h3>
                <span>Little buttons to add extra development work fast.</span>
              </div>
            </div>
            <div className="calendar-goal-buttons">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  className="calendar-goal-button"
                  onClick={() => onAdd(createGoalTrainingBlock(goal, selectedDate, blocks, durationMinutes))}
                >
                  <strong>{goal.title}</strong>
                  <small>{goal.nextStep}</small>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function TodayPage({
  blocks,
  targets,
  completed,
  selectedDate,
  onSelectDate,
  onToggle,
  onToggleTarget,
  onAddTarget,
}: {
  blocks: TimeBlock[];
  targets: DailyTarget[];
  completed: string[];
  selectedDate: Date;
  onSelectDate: (nextDate: Date) => void;
  onToggle: (id: string) => void;
  onToggleTarget: (id: string) => void;
  onAddTarget: (target: DailyTarget) => void;
}) {
  const weekStart = getWeekStartForDate(selectedDate);
  const selectedDateLabel = formatDayLabel(selectedDate);
  const selectedDateShort = formatDayShortLabel(selectedDate);
  const weekDates = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const dayBlocks = getBlocksForDate(blocks, selectedDate);

  function navigateDay(delta: number) {
    onSelectDate(addDays(selectedDate, delta));
  }

  function selectWeekDay(index: number) {
    onSelectDate(addDays(weekStart, index));
  }

  return (
    <div className="dashboard-grid today-layout-grid">
      <div className="primary-column">
        <section className="panel today-page-panel">
          <div className="section-heading inline">
            <div>
              <h2>Today</h2>
              <span>{getWeekRangeForDate(selectedDate)}</span>
            </div>
            <div className="today-page-controls">
              <button className="icon-button" onClick={() => navigateDay(-1)} aria-label="Previous day">
                <ChevronLeft size={18} />
              </button>
              <button className="icon-button" onClick={() => navigateDay(1)} aria-label="Next day">
                <ChevronRight size={18} />
              </button>
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
    </div>
  );
}

function CommitmentsPage({ blocks, onAdd }: { blocks: TimeBlock[]; onAdd: (block: TimeBlock) => void }) {
  const plannerBlocks = blocks.map((block) => {
    if (!block.date) return block;
    return { ...block, day: getDayIndex(fromDateKey(block.date)) };
  });

  const commitments = plannerBlocks
    .slice()
    .sort((a, b) => (a.day !== b.day ? a.day - b.day : a.start - b.start))
    .slice(0, 14);

  return (
    <div className="dashboard-grid today-layout-grid">
      <div className="primary-column">
        <section className="panel commitments-page-panel">
          <div className="section-heading inline">
            <div>
              <h2>Commitments</h2>
              <span>Add sessions, events, and tasks straight onto your planner.</span>
            </div>
          </div>
          <AddBlockForm onAdd={onAdd} />
        </section>

        <section className="panel commitments-page-panel">
          <div className="section-heading inline">
            <div>
              <h3>Planner view</h3>
              <span>Everything you add here appears on the weekly planner.</span>
            </div>
          </div>
          <PlannerGrid blocks={plannerBlocks} />
        </section>

        <section className="panel commitments-page-panel">
          <div className="section-heading inline">
            <div>
              <h3>Upcoming commitments</h3>
              <span>Quick view of your next planned items.</span>
            </div>
          </div>
          <div className="calendar-agenda-list">
            {commitments.length ? (
              commitments.map((block) => {
                const meta = activityMeta[block.activity];
                return (
                  <article className="calendar-agenda-item" key={block.id}>
                    <div>
                      <strong>{block.title}</strong>
                      <small>{block.detail}</small>
                    </div>
                    <span style={{ color: meta.color }}>
                      {weekDays[block.day]} · {toTime(block.start)} - {toTime(block.end)}
                    </span>
                  </article>
                );
              })
            ) : (
              <p className="calendar-empty-copy">No commitments added yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function GfPage({
  items,
  gfSettings,
  onUpdateSettings,
  onAddItem,
  onAddTime,
}: {
  items: GfItem[];
  gfSettings: GfSettings;
  onUpdateSettings: (patch: Partial<GfSettings>) => void;
  onAddItem: (title: string) => void;
  onAddTime: (id: string, minutes: number) => void;
}) {
  const [draft, setDraft] = useState("");
  const [minutesDraft, setMinutesDraft] = useState(30);

  function submitItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = draft.trim();
    if (!next) return;
    onAddItem(next);
    setDraft("");
  }

  const totalTime = items.reduce((sum, item) => sum + item.timeSpentMinutes, 0);

  return (
    <div className="dashboard-grid today-layout-grid">
      <div className="primary-column gf-layout">
        <section className="panel gf-page-panel" aria-labelledby="gf-heading">
          <div className="gf-hero-card">
            <div className="section-heading inline gf-hero-heading">
              <div>
                <h2 id="gf-heading">GF</h2>
                <span>Type the things you would like to do together and keep track of time spent.</span>
              </div>
            </div>

            <label className="gf-name-field">
              Her name
              <input
                value={gfSettings.partnerName}
                onChange={(event) => onUpdateSettings({ partnerName: event.target.value })}
                placeholder="Add her name"
              />
            </label>
            {gfSettings.partnerName.trim() && (
              <p className="gf-name-chip">Planning for {gfSettings.partnerName.trim()}</p>
            )}
          </div>

          <form className="gf-add-form" onSubmit={submitItem}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Add something you'd like to do together"
            />
            <button className="button primary compact" type="submit">
              Add to list
            </button>
          </form>

          <div className="gf-list-card">
            {items.length ? (
              items.map((item) => (
                <article className="gf-list-row" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.timeSpentMinutes} minutes together</small>
                  </div>
                  <div className="gf-row-actions">
                    <button className="button subtle compact" type="button" onClick={() => onAddTime(item.id, minutesDraft)}>
                      +{minutesDraft}m
                    </button>
                    <input
                      className="gf-minutes-input"
                      type="number"
                      min={5}
                      step={5}
                      value={minutesDraft}
                      onChange={(event) => setMinutesDraft(Math.max(5, Number(event.target.value) || 5))}
                    />
                  </div>
                </article>
              ))
            ) : (
              <p className="calendar-empty-copy">No shared activities added yet.</p>
            )}
          </div>
        </section>

        <section className="panel gf-page-panel">
          <div className="section-heading inline">
            <div>
              <h3>Ideas list</h3>
              <span>Keep a running list of things to do together {gfSettings.partnerName.trim() ? `with ${gfSettings.partnerName.trim()}` : ""}.</span>
            </div>
          </div>
          <div className="gf-idea-list">
            {items.length ? (
              items.map((item) => (
                <article className="gf-idea-row" key={item.id}>
                  <strong>{item.title}</strong>
                </article>
              ))
            ) : (
              <p className="calendar-empty-copy">Type your first idea above.</p>
            )}
          </div>
        </section>
      </div>

      <aside className="calendar-side-column">
        <section className="panel gf-time-panel">
          <div className="section-heading inline">
            <div>
              <h3>Time spent together</h3>
              <span>See the total time you’ve built up.</span>
            </div>
          </div>
          <div className="gf-total-time">
            <strong>{formatHours(totalTime)}</strong>
            <small>Total time together</small>
          </div>
          <div className="gf-time-list">
            {items.length ? (
              items.map((item) => (
                <div className="gf-time-row" key={item.id}>
                  <span>{item.title}</span>
                  <strong>{formatHours(item.timeSpentMinutes)}</strong>
                </div>
              ))
            ) : (
              <p className="calendar-empty-copy">No time logged yet.</p>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}

function SettingsPage({
  settings,
  onUpdate,
  onAddQuote,
  onRemoveQuote,
  onReset,
}: {
  settings: UiSettings;
  onUpdate: (patch: Partial<UiSettings>) => void;
  onAddQuote: (quote: string) => void;
  onRemoveQuote: (index: number) => void;
  onReset: () => void;
}) {
  const [quoteDraft, setQuoteDraft] = useState("");

  function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = quoteDraft.trim();
    if (!next) return;
    onAddQuote(next);
    setQuoteDraft("");
  }

  const dyslexiaBackgroundOptions: Array<{ value: UiSettings["dyslexiaBackground"]; label: string }> = [
    { value: "default", label: "Default" },
    { value: "cream", label: "Cream" },
    { value: "blue", label: "Soft blue" },
    { value: "green", label: "Soft green" },
  ];

  return (
    <div className="dashboard-grid today-layout-grid">
      <div className="primary-column">
        <section className="panel settings-page-panel" aria-labelledby="settings-heading">
          <div className="section-heading inline">
            <div>
              <h2 id="settings-heading">Settings</h2>
              <span>Change text size, app colours, and motivational quotes for every screen.</span>
            </div>
            <button className="button subtle compact" onClick={onReset}>
              Reset defaults
            </button>
          </div>

          <div className="settings-grid">
            <label>
              Font size: {settings.fontSize}px
              <input
                type="range"
                min={14}
                max={20}
                step={1}
                value={settings.fontSize}
                onChange={(event) => onUpdate({ fontSize: Number(event.target.value) })}
              />
            </label>

            <label>
              Screen colour
              <input
                type="color"
                value={settings.screenColor}
                onChange={(event) => onUpdate({ screenColor: event.target.value })}
              />
            </label>

            <label>
              Calendar colour
              <input
                type="color"
                value={settings.calendarColor}
                onChange={(event) => onUpdate({ calendarColor: event.target.value })}
              />
            </label>

            <label className="settings-dyslexia-field">
              Dyslexia-friendly background
              <div className="settings-dyslexia-buttons" role="group" aria-label="Dyslexia-friendly background presets">
                {dyslexiaBackgroundOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={
                      settings.dyslexiaBackground === option.value
                        ? "button subtle compact active"
                        : "button subtle compact"
                    }
                    onClick={() => onUpdate({ dyslexiaBackground: option.value })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </label>

            <label className="settings-toggle-row">
              <input
                type="checkbox"
                checked={settings.highContrastText}
                onChange={(event) => onUpdate({ highContrastText: event.target.checked })}
              />
              High contrast text
            </label>

            <label className="settings-toggle-row">
              <input
                type="checkbox"
                checked={settings.showQuotes}
                onChange={(event) => onUpdate({ showQuotes: event.target.checked })}
              />
              Show motivational quote on every screen
            </label>
          </div>
        </section>

        <section className="panel settings-page-panel">
          <div className="section-heading inline">
            <div>
              <h3>Motivational quotes</h3>
              <span>Add as many as you want. Quotes rotate across screens.</span>
            </div>
          </div>

          <form className="settings-quote-form" onSubmit={submitQuote}>
            <input
              value={quoteDraft}
              onChange={(event) => setQuoteDraft(event.target.value)}
              placeholder="Write a motivational quote"
            />
            <button className="button primary compact" type="submit">
              Add quote
            </button>
          </form>

          <div className="settings-quote-list">
            {settings.quotes.length ? (
              settings.quotes.map((quote, index) => (
                <article className="settings-quote-item" key={`${quote}-${index}`}>
                  <p>{quote}</p>
                  <button className="button subtle compact" onClick={() => onRemoveQuote(index)}>
                    Remove
                  </button>
                </article>
              ))
            ) : (
              <p className="calendar-empty-copy">No quotes yet. Add one above.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfilePage({
  profile,
  onUpdate,
}: {
  profile: ProfileSettings;
  onUpdate: (patch: Partial<ProfileSettings>) => void;
}) {
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    onUpdate({ avatarDataUrl: dataUrl });
    event.target.value = "";
  }

  function removePicture() {
    onUpdate({ avatarDataUrl: "" });
  }

  return (
    <div className="dashboard-grid today-layout-grid">
      <div className="primary-column">
        <section className="panel profile-page-panel" aria-labelledby="profile-heading">
          <div className="section-heading inline">
            <div>
              <h2 id="profile-heading">Profile</h2>
              <span>Edit your name, subtitle, and profile picture.</span>
            </div>
          </div>

          <div className="profile-editor-layout">
            <div className="profile-preview-card">
              <div className="avatar large">
                {profile.avatarDataUrl ? <img src={profile.avatarDataUrl} alt="Profile preview" /> : profile.name.charAt(0).toUpperCase()}
              </div>
              <strong>{profile.name}</strong>
              <span>{profile.subtitle}</span>
            </div>

            <div className="settings-grid profile-settings-grid">
              <label>
                Name
                <input value={profile.name} onChange={(event) => onUpdate({ name: event.target.value })} />
              </label>

              <label>
                Subtitle
                <input value={profile.subtitle} onChange={(event) => onUpdate({ subtitle: event.target.value })} />
              </label>

              <label className="profile-picture-upload">
                Profile picture
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>

              <button className="button subtle compact profile-reset-button danger" type="button" onClick={removePicture}>
                Remove picture
              </button>
            </div>
          </div>
        </section>
      </div>
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

function PlannerGrid({ blocks, onSelectBlock }: { blocks: TimeBlock[]; onSelectBlock?: (block: TimeBlock) => void }) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index);
  const todayIndex = 0;

  return (
    <section className="planner-shell planner-shell-compact" aria-label="Week Plan">
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
                    className={`time-block ${onSelectBlock ? "interactive" : ""}`}
                    key={block.id}
                    style={{
                      top,
                      height,
                      background: meta.soft,
                      borderColor: meta.border,
                      color: meta.color,
                    }}
                    role={onSelectBlock ? "button" : undefined}
                    tabIndex={onSelectBlock ? 0 : undefined}
                    onClick={onSelectBlock ? () => onSelectBlock(block) : undefined}
                    onKeyDown={
                      onSelectBlock
                        ? (event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              onSelectBlock(block);
                            }
                          }
                        : undefined
                    }
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
  const activeTopic = topics.find((topic) => topic.id === topicId);

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
    const existingCount = questions.filter((question) => question.topicId === selectedTopic.id).length;
    const generated = createQuestionsForTopic(selectedTopic, tier, questionCount, existingCount);
    onGenerate(generated);
    setStatusMessage(`Added ${generated.length} differentiated ${tier} questions for ${selectedTopic.title}.`);
  }

  return (
    <section className="panel stock-panel" aria-labelledby="question-bank-heading">
      <div className="question-bank-shell">
        <div className="question-bank-hero">
          <div className="question-bank-intro">
            <h2 id="question-bank-heading">Question Bank</h2>
            <p>Build your own exam-style set with smarter filters, then focus by topic.</p>
          </div>
          <div className="question-bank-control-card">
            <div className="question-bank-filter-grid">
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
            </div>
            <div className="question-bank-action-row">
              <button className="button primary compact" type="button" onClick={handleGenerateQuestions}>
                Generate
              </button>
              <button className="button subtle compact" type="button" onClick={onViewSyllabus}>
                Syllabus
              </button>
              <button className="button subtle compact" type="button" onClick={() => setOpen((current) => !current)}>
                {open ? "Close" : "Add Question"}
              </button>
            </div>
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
            <strong>{questions.filter((question) => question.topicId === topicId).length}</strong>
            <span>for selected topic</span>
          </div>
        </div>

        <div className="question-bank-body">
          <div className="question-topic-column">
            <div className="topic-picker compact">
              <div className="topic-picker-head">
                <strong>Practice topics</strong>
                {activeTopic && <small>{activeTopic.area}</small>}
              </div>
              <div className="topic-pill-grid question-bank-topic-grid">
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
          </div>

          <div className="question-feed-column">
            <div className="question-feed-head">
              <strong>Latest saved questions</strong>
              <span>Most recent first</span>
            </div>
            <div className="question-list question-feed-list">
              {latestQuestions.map((question) => (
                <article className="question-row" key={question.id}>
                  <strong>
                    {getTopicTitle(question.topicId)} · {getQuestionMarks(question)}-mark
                  </strong>
                  <p>{question.prompt}</p>
                  <small>{getMarkSchemeSummary(question.explanation)}</small>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}

function GoalsPanel({
  goals,
  onProgress,
  onAdd,
  onUpdate,
  onToggleStep,
}: {
  goals: Goal[];
  onProgress: (id: string, delta: number) => void;
  onAdd: (goal: Goal) => void;
  onUpdate: (id: string, patch: Partial<Goal>) => void;
  onToggleStep: (goalId: string, stepId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({
    title: "",
    status: "unknown" as NonNullable<Goal["status"]>,
    targetDate: "",
    progress: 0,
    nextStep: "",
  });
  const onTrackCount = goals.filter((goal) => goal.status === "on-track" || goal.status === "ahead").length;
  const behindAmount = goals
    .filter((goal) => goal.status === "behind")
    .reduce((sum, goal) => sum + Math.max(0, 100 - goal.progress), 0);
  const averageProgress = goals.length
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  function startEdit(goal: Goal) {
    setEditMode(true);
    setEditingGoalId(goal.id);
    setEditDraft({
      title: goal.title,
      status: goal.status || "unknown",
      targetDate: goal.targetDate || "",
      progress: goal.progress,
      nextStep: goal.nextStep || "",
    });
  }

  function cancelEdit() {
    setEditingGoalId(null);
  }

  function saveEdit(goalId: string) {
    onUpdate(goalId, {
      title: editDraft.title.trim() || "Untitled goal",
      status: editDraft.status,
      targetDate: editDraft.targetDate,
      progress: clampProgress(editDraft.progress),
      nextStep: editDraft.nextStep.trim(),
    });
    setEditingGoalId(null);
  }

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
    <section className="panel side-panel goals-panel" aria-labelledby="goals-heading">
      <div className="section-heading">
        <h2 id="goals-heading">Goals</h2>
        <div className="goals-heading-actions">
          <button className="link-button" onClick={() => setOpen((current) => !current)}>
            {open ? "Close" : "Add"}
          </button>
          <button
            className="link-button"
            onClick={() => {
              setEditMode((current) => !current);
              setEditingGoalId(null);
            }}
          >
            {editMode ? "Done" : "Edit"}
          </button>
        </div>
      </div>
      {editMode && <p className="goal-edit-hint">Tap a goal title below to retype and edit it.</p>}
      <div className="goals-overview-strip">
        <article>
          <small>Total goals</small>
          <strong>{goals.length}</strong>
        </article>
        <article>
          <small>On track</small>
          <strong>{onTrackCount}</strong>
        </article>
        <article>
          <small>Behind by</small>
          <strong>{behindAmount}%</strong>
        </article>
        <article>
          <small>Avg progress</small>
          <strong>{averageProgress}%</strong>
        </article>
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
      <div className="goal-list goal-list-grid">
        {goals.map((goal) => {
          const meta = activityMeta[goal.activity];
          const Icon = iconMap[goal.activity];
          const stepCount = goal.steps?.length ?? 0;
          const doneSteps = (goal.steps || []).filter((step) => step.done).length;
          const statusLabel = goal.status ? goal.status.replace("-", " ") : "unknown";
          const isEditing = editingGoalId === goal.id;

          return (
            <article
              className={`goal-row goal-card ${editMode ? "goal-card-editable" : ""} ${isEditing ? "editing" : ""}`}
              key={goal.id}
              onClick={() => {
                if (editMode && !isEditing) {
                  startEdit(goal);
                }
              }}
            >
              <span className="activity-icon" style={{ color: meta.color, background: meta.soft }}>
                <Icon size={18} />
              </span>
              <div className="goal-content">
                <div className="goal-title">
                  {editMode && isEditing ? (
                    <input
                      className="goal-title-input"
                      value={editDraft.title}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => setEditDraft((current) => ({ ...current, title: event.target.value }))}
                    />
                  ) : (
                    <strong>{goal.title}</strong>
                  )}
                  <span>{goal.progress}%</span>
                </div>
                <div className="goal-meta-row">
                  <span className={`goal-status-badge ${goal.status || "unknown"}`}>{statusLabel}</span>
                  <small>{doneSteps}/{stepCount} steps complete</small>
                </div>
                <span className="progress-track">
                  <span style={{ width: `${goal.progress}%`, background: meta.color }} />
                </span>
                <div className="goal-meta">
                  <small>
                    {goal.startDate ? `${goal.startDate} → ` : ""}
                    {goal.targetDate}
                  </small>
                  <small>{goal.nextStep || "Add a next step for focus"}</small>
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
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onProgress(goal.id, -5);
                    }}
                  >
                    -5
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onProgress(goal.id, 5);
                    }}
                  >
                    +5
                  </button>
                </div>
                {editMode && isEditing && (
                  <div className="goal-edit-grid">
                    <label>
                      Status
                      <select
                        value={editDraft.status}
                        onChange={(event) =>
                          setEditDraft((current) => ({
                            ...current,
                            status: event.target.value as NonNullable<Goal["status"]>,
                          }))
                        }
                      >
                        <option value="unknown">Unknown</option>
                        <option value="on-track">On track</option>
                        <option value="behind">Behind schedule</option>
                        <option value="ahead">Ahead</option>
                      </select>
                    </label>
                    <label>
                      Target date
                      <input
                        type="date"
                        value={editDraft.targetDate}
                        onChange={(event) =>
                          setEditDraft((current) => ({ ...current, targetDate: event.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Progress %
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editDraft.progress}
                        onChange={(event) =>
                          setEditDraft((current) => ({
                            ...current,
                            progress: Number(event.target.value),
                          }))
                        }
                      />
                    </label>
                    <label className="goal-edit-full">
                      Next step
                      <input
                        value={editDraft.nextStep}
                        onChange={(event) => setEditDraft((current) => ({ ...current, nextStep: event.target.value }))}
                      />
                    </label>
                    <div className="goal-edit-actions goal-edit-full">
                      <button
                        className="button primary compact"
                        onClick={(event) => {
                          event.stopPropagation();
                          saveEdit(goal.id);
                        }}
                      >
                        Save changes
                      </button>
                      <button
                        className="button subtle compact"
                        onClick={(event) => {
                          event.stopPropagation();
                          cancelEdit();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
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

function KnowledgePage({ goals, topics, selectedTopicId, onSelectTopic }: {
  goals: Goal[];
  topics: SyllabusTopic[];
  selectedTopicId: string;
  onSelectTopic: (id: string) => void;
}) {
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>(selectedTopic.activity);

  const activityFilters = useMemo(
    () => Array.from(new Set(topics.map((topic) => topic.activity))) as ActivityType[],
    [topics],
  );

  const filteredTopics = useMemo(
    () => topics.filter((topic) => topic.activity === selectedActivity),
    [topics, selectedActivity],
  );

  const activeTopic = filteredTopics.find((topic) => topic.id === selectedTopicId) ?? filteredTopics[0] ?? selectedTopic;
  const activitySupport = knowledgeSupportByActivity[activeTopic.activity];
  const examApplications = activeTopic.knowledge.slice(0, 4).map((point) => {
    const trimmed = point.endsWith(".") ? point.slice(0, -1) : point;
    const opening = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
    return `Use this in an exam response by showing each step as you ${opening}.`;
  });

  useEffect(() => {
    setSelectedActivity(selectedTopic.activity);
  }, [selectedTopic.activity]);

  useEffect(() => {
    if (activeTopic.id !== selectedTopicId) {
      onSelectTopic(activeTopic.id);
    }
  }, [activeTopic.id, onSelectTopic, selectedTopicId]);

  return (
    <section className="panel knowledge-page-panel" aria-labelledby="knowledge-page-heading">
      <div className="section-heading inline">
        <div>
          <h2 id="knowledge-page-heading">Knowledge</h2>
          <span>Detailed reference for what you need to know to achieve your goals properly.</span>
        </div>
      </div>

      <div className="knowledge-layout">
        <aside className="knowledge-side-column">
          <div className="knowledge-topic-panel">
            <div className="section-heading inline compact-heading">
              <div>
                <h3>Topic knowledge bank</h3>
                <span>Pick a subject, then open a topic for a deeper study breakdown.</span>
              </div>
            </div>

            <div className="knowledge-subject-tabs" role="tablist" aria-label="Knowledge subject filters">
              {activityFilters.map((activity) => {
                const meta = activityMeta[activity];
                return (
                  <button
                    key={activity}
                    type="button"
                    className={`knowledge-subject-chip ${selectedActivity === activity ? "active" : ""}`}
                    onClick={() => setSelectedActivity(activity)}
                    role="tab"
                    aria-selected={selectedActivity === activity}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>

            <div className="knowledge-topic-list" role="listbox" aria-label="Topics in selected subject">
              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className={`knowledge-topic-item ${activeTopic.id === topic.id ? "active" : ""}`}
                  onClick={() => onSelectTopic(topic.id)}
                  role="option"
                  aria-selected={activeTopic.id === topic.id}
                >
                  <strong>{topic.title}</strong>
                  <small>{topic.area}</small>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="knowledge-main-column">
          <article className="knowledge-spotlight" aria-live="polite">
            <div className="knowledge-spotlight-head">
              <span
                className="knowledge-activity-badge"
                style={{
                  color: activityMeta[activeTopic.activity].color,
                  background: activityMeta[activeTopic.activity].soft,
                  borderColor: activityMeta[activeTopic.activity].border,
                }}
              >
                {activityMeta[activeTopic.activity].label}
              </span>
              <h3>{activeTopic.title}</h3>
              <p>{activeTopic.area}</p>
            </div>

            <div className="knowledge-detail-grid">
              <section className="knowledge-detail-card">
                <h4>Core topic knowledge</h4>
                <ul>
                  {activeTopic.knowledge.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>

              <section className="knowledge-detail-card">
                <h4>High-mark application</h4>
                <ul>
                  {examApplications.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>

              <section className="knowledge-detail-card">
                <h4>Common mistakes</h4>
                <ul>
                  {activitySupport.mistakes.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>

              <section className="knowledge-detail-card">
                <h4>Revision moves that work</h4>
                <ul>
                  {activitySupport.revision.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            </div>
          </article>

          <div className="knowledge-guide-grid compact">
            {goals.map((goal) => {
              const sections = goalKnowledgeGuides[goal.id] ?? [
                {
                  title: "Core Understanding",
                  points: [
                    "Know the exact standard this goal requires, what success looks like, and how it is measured.",
                    "Turn each step into evidence: what you must know, what you must practise, and how you prove improvement.",
                  ],
                },
              ];
              const highlights = sections.flatMap((section) => section.points).slice(0, 3);
              const meta = activityMeta[goal.activity];
              const Icon = iconMap[goal.activity];

              return (
                <article className="knowledge-guide-card compact" key={goal.id}>
                  <div className="knowledge-guide-head">
                    <span className="activity-icon" style={{ color: meta.color, background: meta.soft }}>
                      <Icon size={18} />
                    </span>
                    <div>
                      <strong>{goal.title}</strong>
                      <small>{goal.nextStep}</small>
                    </div>
                  </div>
                  <ul className="knowledge-guide-points">
                    {highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
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
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [aiMarking, setAiMarking] = useState<AiMarkingResult | null>(null);
  const question = available[activeIndex % Math.max(1, available.length)] ?? fallback;
  const hasOptions = Boolean(question.options && question.options.length);
  const answered = hasOptions ? selected !== null : false;
  const isCorrect = hasOptions && selected === question.answer;

  useEffect(() => {
    setWrittenAnswer("");
    setAiMarking(null);
  }, [question.id]);

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
    setAiMarking(null);
    setWrittenAnswer("");
  }

  function reset() {
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    setActiveIndex(0);
    setShowMarkScheme(false);
    setAiMarking(null);
    setWrittenAnswer("");
  }

  function markMyAnswer() {
    const result = markAnswerWithAiExaminer(
      question.prompt,
      question.topicId,
      writtenAnswer,
      question.explanation,
      getQuestionMarks(question),
    );
    setAiMarking(result);
    setShowMarkScheme(true);
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
            <textarea
              value={writtenAnswer}
              onChange={(event) => setWrittenAnswer(event.target.value)}
              placeholder="Write your full exam-style answer here, showing method and reasoning."
            />
            <div className="ai-marking-actions">
              <button className="button primary compact" type="button" onClick={markMyAnswer} disabled={!writtenAnswer.trim()}>
                Mark my answer
              </button>
              <small>AI examiner uses the mark scheme and AO criteria to estimate your mark.</small>
            </div>
            {aiMarking && (
              <div className="ai-marking-result" role="status" aria-live="polite">
                <div className="ai-marking-head">
                  <strong>{aiMarking.score}/{aiMarking.maxMarks}</strong>
                  <span>{aiMarking.band}</span>
                  <small>
                    Mark scheme points met: {aiMarking.matchedSteps}/{aiMarking.totalSteps}
                  </small>
                </div>
                <p className="ai-examiner-judgement">{aiMarking.examinerJudgement}</p>
                {aiMarking.strengths.length > 0 && (
                  <div>
                    <h4>What you did well</h4>
                    <ul>
                      {aiMarking.strengths.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiMarking.nextSteps.length > 0 && (
                  <div>
                    <h4>How to improve</h4>
                    <ul>
                      {aiMarking.nextSteps.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {answered && question.options && question.options.length && <p className="explanation">{getMarkSchemeSummary(question.explanation)}</p>}
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
            <ul className="mark-scheme-list">
              {question.explanation
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  if (line.startsWith("Exam-board style")) {
                    return (
                      <li key={line} className="mark-scheme-heading">
                        {line}
                      </li>
                    );
                  }
                  return <li key={line}>{line.replace(/^•\s*/, "")}</li>;
                })}
            </ul>
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
  const [uiSettings, setUiSettings] = useStoredState<UiSettings>(
    "jacob.uiSettings",
    defaultUiSettings,
    (stored, initial) => {
      const safeStored = stored as Partial<UiSettings>;
      return {
        ...initial,
        ...safeStored,
        quotes: Array.isArray(safeStored.quotes) ? safeStored.quotes.filter(Boolean) : initial.quotes,
      };
    },
  );
  const [profileSettings, setProfileSettings] = useStoredState<ProfileSettings>(
    "jacob.profileSettings",
    defaultProfileSettings,
    (stored, initial) => ({
      ...initial,
      ...(stored as Partial<ProfileSettings>),
      name: String((stored as Partial<ProfileSettings>).name || initial.name),
      subtitle: String((stored as Partial<ProfileSettings>).subtitle || initial.subtitle),
      avatarDataUrl: String((stored as Partial<ProfileSettings>).avatarDataUrl || initial.avatarDataUrl),
    }),
  );
  const [gfItems, setGfItems] = useStoredState<GfItem[]>("jacob.gfItems", []);
  const [gfSettings, setGfSettings] = useStoredState<GfSettings>("jacob.gfSettings", defaultGfSettings);
  const [selectedTopicId, setSelectedTopicId] = useState(defaultSyllabus[0].id);
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];

  useEffect(() => {
    const subjectsToSeed = ["maths", "physics", "chemistry", "english", "cadets", "football"];

    setQuestions((current) => {
      let changed = false;
      const seeded = current.map((question) => {
        const marks = getQuestionMarks(question);
        const isMathsQuestion = getTopicSubject(question.topicId) === "maths";
        const hasPersonalizedMathScheme =
          isMathsQuestion &&
          /Award\s+1\s+mark\s+for/i.test(question.explanation) &&
          /[\d=×÷+\-/]/.test(question.explanation);

        if (!isMathsQuestion && (marks < 3 || (marks < 4 && question.explanation.startsWith("Exam-board style")))) {
          return question;
        }
        if (isMathsQuestion && hasPersonalizedMathScheme) {
          return question;
        }
        if (!isMathsQuestion && marks >= 4 && /\[AO[123]\]/.test(question.explanation) && /Award\s+1\s+mark\s+for/i.test(question.explanation)) {
          return question;
        }
        changed = true;
        return {
          ...question,
          explanation: toExamBoardMarkScheme(
            question.prompt,
            question.explanation,
            marks,
            isMathsQuestion,
          ),
        };
      });

      const existingKeys = new Set(seeded.map((question) => `${question.topicId}::${question.prompt}`));
      const topicCounts = new Map<string, number>();

      for (const question of seeded) {
        topicCounts.set(question.topicId, (topicCounts.get(question.topicId) ?? 0) + 1);
      }

      for (const subject of subjectsToSeed) {
        const currentSubjectCount = seeded.filter((question) => getTopicSubject(question.topicId) === subject).length;
        const missing = Math.max(0, 100 - currentSubjectCount);
        if (!missing) continue;

        const subjectTopics = topics.filter((topic) => getTopicSubject(topic.id) === subject);
        if (!subjectTopics.length) continue;

        for (let i = 0; i < missing; i += 1) {
          const topic = subjectTopics[i % subjectTopics.length];
          const startAt = topicCounts.get(topic.id) ?? 0;
          let inserted = false;

          for (let attempt = 0; attempt < 4 && !inserted; attempt += 1) {
            const [candidate] = createQuestionsForTopic(topic, "Mixed", 1, startAt + attempt * 17);
            const key = `${candidate.topicId}::${candidate.prompt}`;
            if (existingKeys.has(key)) continue;
            seeded.push(candidate);
            existingKeys.add(key);
            topicCounts.set(topic.id, startAt + 1);
            inserted = true;
            changed = true;
          }
        }
      }

      return changed ? seeded : current;
    });
  }, [topics, setQuestions]);

  function toggleComplete(id: string) {
    setCompleted((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function addBlock(block: TimeBlock) {
    setBlocks((current) => [...current, block]);
  }

  function updateBlock(nextBlock: TimeBlock) {
    setBlocks((current) => current.map((block) => (block.id === nextBlock.id ? nextBlock : block)));
  }

  function deleteBlock(id: string) {
    setBlocks((current) => current.filter((block) => block.id !== id));
  }

  function addGoal(goal: Goal) {
    setGoals((current) => [...current, goal]);
  }

  function updateGoal(id: string, patch: Partial<Goal>) {
    setGoals((current) => current.map((goal) => (goal.id === id ? { ...goal, ...patch } : goal)));
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
    const existingCount = questions.filter((question) => question.topicId === topic.id).length;
    const questionsGenerated = createQuestionsForTopic(topic, tier, count, existingCount);
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

  function updateUiSettings(patch: Partial<UiSettings>) {
    setUiSettings((current) => ({ ...current, ...patch }));
  }

  function addQuote(quote: string) {
    setUiSettings((current) => ({ ...current, quotes: [...current.quotes, quote] }));
  }

  function removeQuote(index: number) {
    setUiSettings((current) => ({ ...current, quotes: current.quotes.filter((_, idx) => idx !== index) }));
  }

  function resetUiSettings() {
    setUiSettings(defaultUiSettings);
  }

  function addGfItem(title: string) {
    setGfItems((current) => [...current, { id: `gf-${Date.now()}`, title, timeSpentMinutes: 0 }]);
  }

  function addGfTime(id: string, minutes: number) {
    setGfItems((current) => current.map((item) => (item.id === id ? { ...item, timeSpentMinutes: item.timeSpentMinutes + minutes } : item)));
  }

  function updateGfSettings(patch: Partial<GfSettings>) {
    setGfSettings((current) => ({ ...current, ...patch }));
  }

  function updateProfileSettings(patch: Partial<ProfileSettings>) {
    setProfileSettings((current) => ({ ...current, ...patch }));
  }

  const pageOrder: Page[] = [
    "dashboard",
    "today",
    "goals",
    "syllabus",
    "knowledge",
    "practice",
    "calendar",
    "commitments",
    "settings",
    "profile",
    "gf",
  ];
  const activePageIndex = Math.max(0, pageOrder.indexOf(activePage));
  const activeQuote =
    uiSettings.showQuotes && uiSettings.quotes.length
      ? uiSettings.quotes[activePageIndex % uiSettings.quotes.length]
      : "";

  const appStyle = {
    fontSize: `${uiSettings.fontSize}px`,
    "--screen-accent": hexToRgba(uiSettings.screenColor, 0.2),
    "--workspace-tint": hexToRgba(uiSettings.screenColor, 0.08),
    "--calendar-accent-soft": hexToRgba(uiSettings.calendarColor, 0.14),
    "--calendar-accent-border": hexToRgba(uiSettings.calendarColor, 0.45),
    "--dyslexia-bg":
      uiSettings.dyslexiaBackground === "cream"
        ? "#f7f3df"
        : uiSettings.dyslexiaBackground === "blue"
          ? "#eaf3fb"
          : uiSettings.dyslexiaBackground === "green"
            ? "#ecf7ef"
            : "#f4f7fb",
  } as React.CSSProperties;

  return (
    <div className={`app-shell ${uiSettings.highContrastText ? "high-contrast" : ""}`} style={appStyle}>
      <Sidebar activePage={activePage} onNavigate={navigate} profile={profileSettings} />
      <main className="workspace">
        <Header quote={activeQuote} />
        {activePage === "goals" ? (
          <div className="dashboard-grid">
            <div className="primary-column">
              <GoalsPanel
                goals={goals}
                onProgress={adjustGoal}
                onAdd={addGoal}
                onUpdate={updateGoal}
                onToggleStep={toggleGoalStep}
              />
            </div>
          </div>
        ) : activePage === "today" ? (
          <TodayPage
            blocks={blocks}
            targets={dailyTargets}
            completed={completed}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onToggle={toggleComplete}
            onToggleTarget={toggleDailyTarget}
            onAddTarget={addDailyTarget}
          />
        ) : activePage === "commitments" ? (
          <CommitmentsPage blocks={blocks} onAdd={addBlock} />
        ) : activePage === "settings" ? (
          <SettingsPage
            settings={uiSettings}
            onUpdate={updateUiSettings}
            onAddQuote={addQuote}
            onRemoveQuote={removeQuote}
            onReset={resetUiSettings}
          />
        ) : activePage === "profile" ? (
          <ProfilePage profile={profileSettings} onUpdate={updateProfileSettings} />
        ) : activePage === "gf" ? (
          <GfPage items={gfItems} gfSettings={gfSettings} onUpdateSettings={updateGfSettings} onAddItem={addGfItem} onAddTime={addGfTime} />
        ) : activePage === "syllabus" ? (
          <SyllabusPage topics={topics} />
        ) : activePage === "calendar" ? (
          <CalendarPage
            blocks={blocks}
            goals={goals}
            completed={completed}
            topics={topics}
            targets={dailyTargets}
            questions={questions}
            practiceSets={practiceSets}
            onAdd={addBlock}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
          />
        ) : activePage === "knowledge" ? (
          <KnowledgePage
            goals={goals}
            topics={topics}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
          />
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
          <div className="dashboard-grid weekly-plan-grid">
            <div className="primary-column weekly-plan-column">
              <DashboardOverviewPanel
                blocks={blocks}
                completed={completed}
                goals={goals}
                topics={topics}
                targets={dailyTargets}
                questions={questions}
                practiceSets={practiceSets}
                selectedDate={selectedDate}
              />
              <BalancePanel blocks={blocks} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
