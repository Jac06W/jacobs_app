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
import { FormEvent, useMemo, useState } from "react";
import {
  activityMeta,
  defaultBlocks,
  defaultDailyTargets,
  defaultGoals,
  defaultPracticeSessions,
  defaultQuestions,
  defaultSyllabus,
  roleMeta,
  weekDays,
} from "./data";
import type { ActivityType, DailyTarget, Goal, PracticeSession, QuizQuestion, RoleType, SyllabusTopic, TimeBlock } from "./types";

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

const roleOptions = Object.entries(roleMeta) as [RoleType, (typeof roleMeta)[RoleType]][];

function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
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

function getWeekRange() {
  const today = new Date();
  const day = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - day);
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

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, value));
}

function Sidebar() {
  const nav = [
    { label: "Week Plan", icon: CalendarDays, active: true },
    { label: "Today", icon: Target },
    { label: "Goals", icon: Medal },
    { label: "Syllabus", icon: BookOpen },
    { label: "Practice", icon: Dumbbell },
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
          <button className={`nav-item ${item.active ? "active" : ""}`} key={item.label}>
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
        <strong>{getWeekRange()}</strong>
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
}: {
  blocks: TimeBlock[];
  completed: string[];
  onToggle: (id: string) => void;
}) {
  const todayBlocks = blocks
    .filter((block) => block.day === 0)
    .sort((a, b) => a.start - b.start)
    .slice(0, 5);

  return (
    <section className="panel today-panel" aria-labelledby="today-heading">
      <div className="section-heading inline">
        <h2 id="today-heading">Today</h2>
        <span>Monday</span>
      </div>
      <div className="today-list">
        {todayBlocks.map((block) => {
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
}: {
  sessions: PracticeSession[];
  onAdd: (session: PracticeSession) => void;
  onSchedule: (session: PracticeSession) => void;
}) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<RoleType>("goalkeeper");

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
        <button className="link-button" onClick={() => setOpen((current) => !current)}>
          {open ? "Close" : "Add Practice"}
        </button>
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
}: {
  questions: QuizQuestion[];
  topics: SyllabusTopic[];
  selectedTopicId: string;
  onAdd: (question: QuizQuestion) => void;
}) {
  const [open, setOpen] = useState(false);
  const [topicId, setTopicId] = useState(selectedTopicId);
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
      explanation: String(formData.get("explanation")),
    });
    event.currentTarget.reset();
    setTopicId(selectedTopicId);
    setOpen(false);
  }

  function getTopicTitle(id: string) {
    return topics.find((topic) => topic.id === id)?.title ?? "Practice";
  }

  return (
    <section className="panel stock-panel" aria-labelledby="question-bank-heading">
      <div className="section-heading">
        <div>
          <h2 id="question-bank-heading">Question Bank</h2>
          <span>Save practice exam questions and answer guidance.</span>
        </div>
        <button className="link-button" onClick={() => setOpen((current) => !current)}>
          {open ? "Close" : "Add Question"}
        </button>
      </div>
      {open && (
        <form className="question-form" onSubmit={handleSubmit}>
          <label>
            Topic
            <select value={topicId} onChange={(event) => setTopicId(event.target.value)}>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
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
      <div className="question-list">
        {latestQuestions.map((question) => (
          <article className="question-row" key={question.id}>
            <strong>{getTopicTitle(question.topicId)}</strong>
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
}: {
  goals: Goal[];
  onProgress: (id: string, delta: number) => void;
  onAdd: (goal: Goal) => void;
}) {
  const [open, setOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onAdd({
      id: `goal-${Date.now()}`,
      title: String(data.get("title")),
      activity: data.get("activity") as ActivityType,
      targetDate: String(data.get("targetDate")),
      progress: Number(data.get("progress")),
      nextStep: String(data.get("nextStep")),
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
          <input name="targetDate" placeholder="Target date" required />
          <input name="nextStep" placeholder="Next step" required />
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
                  <small>Target: {goal.targetDate}</small>
                  <div className="stepper">
                    <button onClick={() => onProgress(goal.id, -5)}>-5</button>
                    <button onClick={() => onProgress(goal.id, 5)}>+5</button>
                  </div>
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
}: {
  questions: QuizQuestion[];
  selectedTopic: SyllabusTopic;
  onAnswered: (topicId: string) => void;
}) {
  const available = questions.filter((question) => question.topicId === selectedTopic.id);
  const fallback = questions[0];
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const question = available[activeIndex % Math.max(1, available.length)] ?? fallback;
  const answered = selected !== null;
  const isCorrect = selected === question.answer;

  function choose(optionIndex: number) {
    if (answered) return;
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
  }

  function reset() {
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    setActiveIndex(0);
  }

  return (
    <section className="panel side-panel practice-panel" aria-labelledby="practice-heading">
      <div className="section-heading">
        <h2 id="practice-heading">Practice</h2>
        <span className="points">{score.correct}/{score.total}</span>
      </div>
      <div className="quiz-card">
        <div className="quiz-meta">
          <strong>Quick Quiz</strong>
          <span>{selectedTopic.title}</span>
        </div>
        <p>{question.prompt}</p>
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
        {answered && <p className="explanation">{question.explanation}</p>}
      </div>
      <div className="practice-actions">
        <button className="button primary" onClick={answered ? nextQuestion : () => choose(question.answer)}>
          <ListPlus size={17} />
          {answered ? "Next Question" : "Start Practice"}
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
  const [topics, setTopics] = useStoredState("jacob.syllabus", defaultSyllabus);
  const [dailyTargets, setDailyTargets] = useStoredState("jacob.dailyTargets", defaultDailyTargets);
  const [practiceSessions, setPracticeSessions] = useStoredState("jacob.practiceSessions", defaultPracticeSessions);
  const [questions, setQuestions] = useStoredState("jacob.questions", defaultQuestions);
  const [completed, setCompleted] = useStoredState<string[]>("jacob.completed", []);
  const [selectedTopicId, setSelectedTopicId] = useState(defaultSyllabus[0].id);

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

  function addQuestion(question: QuizQuestion) {
    setQuestions((current) => [...current, question]);
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
      <Sidebar />
      <main className="workspace">
        <Header />
        <div className="dashboard-grid">
          <div className="primary-column">
            <div className="top-panels">
              <TodayPanel blocks={blocks} completed={completed} onToggle={toggleComplete} />
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
              />
              <QuestionBankPanel
                questions={questions}
                topics={topics}
                selectedTopicId={selectedTopic.id}
                onAdd={addQuestion}
              />
            </div>
          </div>
          <aside className="right-rail">
            <GoalsPanel goals={goals} onProgress={adjustGoal} onAdd={addGoal} />
            <SyllabusPanel
              topics={topics}
              selectedTopic={selectedTopic}
              onSelect={setSelectedTopicId}
              onStudy={studyTopic}
            />
            <PracticePanel questions={questions} selectedTopic={selectedTopic} onAnswered={studyTopic} />
            <KnowledgePanel selectedTopic={selectedTopic} />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
