import type { ActivityType, DailyTarget, Goal, PracticeSession, QuizQuestion, RoleType, SyllabusTopic, TimeBlock } from "./types";

export const activityMeta: Record<
  ActivityType,
  { label: string; color: string; soft: string; border: string; targetHours: number }
> = {
  football: {
    label: "Football",
    color: "#2c9b58",
    soft: "#eaf7ee",
    border: "#94d3aa",
    targetHours: 5,
  },
  school: {
    label: "School Work",
    color: "#2166b5",
    soft: "#edf5ff",
    border: "#9fc8f8",
    targetHours: 10,
  },
  cadets: {
    label: "Air Cadets",
    color: "#0a457a",
    soft: "#eaf2fa",
    border: "#96b9d8",
    targetHours: 4,
  },
  priority: {
    label: "Priority",
    color: "#f08a15",
    soft: "#fff3e3",
    border: "#fac77f",
    targetHours: 2,
  },
  other: {
    label: "Other",
    color: "#8a96a3",
    soft: "#f3f5f7",
    border: "#cbd2da",
    targetHours: 3,
  },
};

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const roleMeta: Record<RoleType, { label: string; activity: ActivityType; success: string }> = {
  student: {
    label: "Student",
    activity: "school",
    success: "revision and exam confidence",
  },
  corporal: {
    label: "Corporal",
    activity: "cadets",
    success: "leadership and teaching capability",
  },
  goalkeeper: {
    label: "Goalkeeper",
    activity: "football",
    success: "matchday consistency",
  },
};

export const defaultBlocks: TimeBlock[] = [
  {
    id: "school-mon",
    title: "School",
    detail: "Lessons and tutor time",
    activity: "school",
    day: 0,
    start: 510,
    end: 915,
  },
  {
    id: "algebra-mon",
    title: "Maths - Algebra",
    detail: "Linear equations set",
    activity: "priority",
    day: 0,
    start: 960,
    end: 1020,
  },
  {
    id: "training-mon",
    title: "Football Training",
    detail: "Technical and fitness",
    activity: "football",
    day: 0,
    start: 1050,
    end: 1140,
  },
  {
    id: "cadets-mon",
    title: "Air Cadets Drill",
    detail: "Parade practice",
    activity: "cadets",
    day: 0,
    start: 1155,
    end: 1215,
  },
  {
    id: "school-tue",
    title: "School",
    detail: "Lessons and tutor time",
    activity: "school",
    day: 1,
    start: 510,
    end: 915,
  },
  {
    id: "science-tue",
    title: "Science Homework",
    detail: "Forces worksheet",
    activity: "school",
    day: 1,
    start: 960,
    end: 1020,
  },
  {
    id: "skills-tue",
    title: "Football Skills",
    detail: "First touch and passing",
    activity: "football",
    day: 1,
    start: 1050,
    end: 1125,
  },
  {
    id: "school-wed",
    title: "School",
    detail: "Lessons and tutor time",
    activity: "school",
    day: 2,
    start: 510,
    end: 915,
  },
  {
    id: "essay-wed",
    title: "English Essay",
    detail: "Paragraph structure",
    activity: "school",
    day: 2,
    start: 960,
    end: 1020,
  },
  {
    id: "gym-wed",
    title: "Gym / Fitness",
    detail: "Mobility and strength",
    activity: "football",
    day: 2,
    start: 1050,
    end: 1110,
  },
  {
    id: "homework-wed",
    title: "Homework",
    detail: "Review notes",
    activity: "school",
    day: 2,
    start: 1140,
    end: 1200,
  },
  {
    id: "revision-thu",
    title: "Revision",
    detail: "Flashcards",
    activity: "school",
    day: 3,
    start: 450,
    end: 495,
  },
  {
    id: "school-thu",
    title: "School",
    detail: "Lessons and tutor time",
    activity: "school",
    day: 3,
    start: 510,
    end: 915,
  },
  {
    id: "maths-practice-thu",
    title: "Maths Practice",
    detail: "Algebra questions",
    activity: "school",
    day: 3,
    start: 960,
    end: 1020,
  },
  {
    id: "match-prep-thu",
    title: "Football Match Prep",
    detail: "Set-piece review",
    activity: "football",
    day: 3,
    start: 1050,
    end: 1110,
  },
  {
    id: "tactics-thu",
    title: "Tactics Review",
    detail: "Shape and pressing",
    activity: "cadets",
    day: 3,
    start: 1140,
    end: 1185,
  },
  {
    id: "school-fri",
    title: "School",
    detail: "Lessons and tutor time",
    activity: "school",
    day: 4,
    start: 510,
    end: 915,
  },
  {
    id: "history-fri",
    title: "History Notes",
    detail: "Source summary",
    activity: "school",
    day: 4,
    start: 960,
    end: 1020,
  },
  {
    id: "match-sat",
    title: "Football Match",
    detail: "Arrive 30 mins early",
    activity: "football",
    day: 5,
    start: 540,
    end: 660,
  },
  {
    id: "study-sat",
    title: "Study Block",
    detail: "Maths and science",
    activity: "school",
    day: 5,
    start: 720,
    end: 810,
  },
  {
    id: "cadets-sat",
    title: "Air Cadets Training",
    detail: "Leadership tasks",
    activity: "cadets",
    day: 5,
    start: 960,
    end: 1080,
  },
  {
    id: "review-sun",
    title: "Weekly Review",
    detail: "Plan next week",
    activity: "school",
    day: 6,
    start: 720,
    end: 780,
  },
  {
    id: "activity-sun",
    title: "Air Cadets Activity",
    detail: "Navigation basics",
    activity: "cadets",
    day: 6,
    start: 1020,
    end: 1140,
  },
  {
    id: "plan-sun",
    title: "Plan Next Week",
    detail: "Goals and kit list",
    activity: "priority",
    day: 6,
    start: 1200,
    end: 1230,
  },
];

export const defaultDailyTargets: DailyTarget[] = [
  {
    id: "dt-maths-1",
    title: "Answer 10 maths practice questions",
    activity: "school",
    role: "student",
    measure: "questions",
    done: false,
  },
  {
    id: "dt-reading-1",
    title: "Read 20 pages of textbook",
    activity: "school",
    role: "student",
    measure: "pages",
    done: false,
  },
  {
    id: "dt-corporal-1",
    title: "Lead squad debrief session",
    activity: "cadets",
    role: "corporal",
    measure: "session",
    done: false,
  },
  {
    id: "dt-corporal-2",
    title: "Teach drill routine to new cadets",
    activity: "cadets",
    role: "corporal",
    measure: "session",
    done: false,
  },
  {
    id: "dt-goalkeeper-1",
    title: "Complete save reaction drill",
    activity: "football",
    role: "goalkeeper",
    measure: "drill",
    done: false,
  },
  {
    id: "dt-goalkeeper-2",
    title: "Review match distribution footage",
    activity: "football",
    role: "goalkeeper",
    measure: "minutes",
    done: false,
  },
];

export const defaultPracticeSessions: PracticeSession[] = [
  {
    id: "ps-maths-1",
    title: "Algebra practice",
    activity: "school",
    role: "student",
    focus: "Linear equations and rearranging",
    durationMinutes: 30,
    confidence: 60,
  },
  {
    id: "ps-gk-session-1",
    title: "Goalkeeper session",
    activity: "football",
    role: "goalkeeper",
    focus: "Review handling, footwork, shot stopping and warm-up routines",
    durationMinutes: 45,
    confidence: 55,
  },
  {
    id: "ps-gk-bleep-test",
    title: "Bleep test challenge",
    activity: "football",
    role: "goalkeeper",
    focus: "Build endurance and recovery for match fitness",
    durationMinutes: 22,
    confidence: 50,
  },
  {
    id: "ps-cadets-leadership",
    title: "Cadets leadership task",
    activity: "cadets",
    role: "corporal",
    focus: "Run a leadership activity and support your flight",
    durationMinutes: 40,
    confidence: 60,
  },
  {
    id: "ps-cadets-drill",
    title: "Drill sequence practice",
    activity: "cadets",
    role: "corporal",
    focus: "Practice parade drill commands and timing",
    durationMinutes: 30,
    confidence: 65,
  },
  {
    id: "ps-cadets-uniform",
    title: "Uniform inspection prep",
    activity: "cadets",
    role: "corporal",
    focus: "Check kit, polish boots, and prepare for inspection",
    durationMinutes: 25,
    confidence: 70,
  },
];

export const defaultGoals: Goal[] = [
  {
    id: "fitness",
    title: "Improve Match Fitness",
    activity: "football",
    startDate: "01 Jun 2026",
    targetDate: "30 Jul 2026",
    progress: 80,
    status: "on-track",
    steps: [
      { id: "f-1", title: "Complete two HI sessions", progress: 100, done: true },
      { id: "f-2", title: "Improve VO2 max test", progress: 60, done: false },
    ],
    nextStep: "Complete two high-intensity sessions this week.",
  },
  {
    id: "maths",
    title: "Maths - Grade A Target",
    activity: "school",
    startDate: "01 May 2026",
    targetDate: "18 Jul 2026",
    progress: 65,
    status: "behind",
    steps: [
      { id: "m-1", title: "Complete algebra past paper", progress: 70, done: false },
      { id: "m-2", title: "Practice number & ratio questions (100)", progress: 50, done: false },
      { id: "m-3", title: "Weekly review with teacher", progress: 80, done: false },
    ],
    nextStep: "Answer 20 algebra questions without notes.",
  },
  {
    id: "drill",
    title: "Air Cadets - Drill Standard",
    activity: "cadets",
    startDate: "15 May 2026",
    targetDate: "31 Aug 2026",
    progress: 75,
    status: "on-track",
    steps: [
      { id: "d-1", title: "Memorise drill commands", progress: 100, done: true },
      { id: "d-2", title: "Practice parade sequence", progress: 60, done: false },
    ],
    nextStep: "Practise halt, turn, and salute sequence.",
  },
  {
    id: "cadets-promotion-sgt",
    title: "Air Cadets - Promotion to Sergeant",
    activity: "cadets",
    startDate: "2026-07-07",
    targetDate: "2026-12-31",
    progress: 20,
    status: "on-track",
    steps: [
      { id: "cad-1", title: "Lead at least 6 squad activities", progress: 10, done: false },
      { id: "cad-2", title: "Complete leadership training module", progress: 0, done: false },
      { id: "cad-3", title: "Pass promotion board interview", progress: 0, done: false },
      { id: "cad-4", title: "Demonstrate safe event planning and delivery", progress: 0, done: false },
    ],
    nextStep: "Plan and lead a short training activity this month.",
  },
  {
    id: "goalkeeping-jpl",
    title: "Goalkeeping - JPL Top Goalkeeper",
    activity: "football",
    startDate: "2026-07-01",
    targetDate: "2027-05-31",
    progress: 15,
    status: "on-track",
    steps: [
      { id: "gk-1", title: "Weekly goalkeeper training sessions (x2)", progress: 10, done: false },
      { id: "gk-2", title: "Strength & conditioning twice weekly", progress: 10, done: false },
      { id: "gk-3", title: "Record and review match footage to reduce goals conceded", progress: 5, done: false },
      { id: "gk-4", title: "Achieve clean sheets target per month", progress: 0, done: false },
    ],
    nextStep: "Book two focused goalkeeper sessions this week.",
  },
  {
    id: "school-grade-9s",
    title: "School - Achieve Grade 9s",
    activity: "school",
    startDate: "2026-05-01",
    targetDate: "2027-06-30",
    progress: 10,
    status: "behind",
    steps: [
      { id: "s-1", title: "Weekly topic revision schedule", progress: 10, done: false },
      { id: "s-2", title: "Complete past papers for each topic", progress: 5, done: false },
      { id: "s-3", title: "Attend extra support and review sessions", progress: 0, done: false },
      { id: "s-4", title: "Teacher feedback cycle after each mock", progress: 0, done: false },
    ],
    nextStep: "Start a weekly past-paper rotation and mark answers.",
  },
];

export const defaultSyllabus: SyllabusTopic[] = [
  {
    id: "maths-number",
    title: "3.1 Number",
    activity: "school",
    area: "Number: place value, fractions, decimals, percentages, standard form",
    progress: 60,
    knowledge: [
      "Understand place value for integers and decimals and order numbers accurately.",
      "Perform arithmetic with integers, negatives and decimals and choose efficient methods.",
      "Convert between fractions, decimals and percentages and use these in context.",
      "Use standard form for very large and very small numbers and perform calculations.",
      "Recognise and use factors, multiples, primes, HCF and LCM where needed.",
    ],
  },
  {
    id: "maths-algebra",
    title: "3.2 Algebra",
    activity: "school",
    area: "Expressions, equations, formulae, sequences and graphs",
    progress: 65,
    knowledge: [
      "Form and manipulate algebraic expressions and simplify them correctly.",
      "Solve linear equations including those with brackets and unknowns on both sides.",
      "Set up and solve simple quadratic and simultaneous equations where appropriate.",
      "Work with sequences (arithmetic and simple geometric) and derive nth term.",
      "Use function notation, plot and interpret graphs and relate graphs to situations.",
    ],
  },
  {
    id: "maths-ratio",
    title: "3.3 Ratio, proportion and rates of change",
    activity: "school",
    area: "Ratio, proportion, direct and inverse proportion, compound measures",
    progress: 62,
    knowledge: [
      "Solve problems involving ratio and proportion, including sharing and scaling.",
      "Work with direct and inverse proportion and use unitary methods where needed.",
      "Handle compound measures such as speed, density and pressure and convert units.",
      "Apply percentage change (increase/decrease), reverse percentages and repeated percentage change.",
    ],
  },
  {
    id: "maths-geometry",
    title: "3.4 Geometry and measures",
    activity: "school",
    area: "Properties of shapes, geometric reasoning, measures, perimeter, area and volume",
    progress: 58,
    knowledge: [
      "Use properties of angles, parallel lines, polygons and circles (including arc/sector).",
      "Apply Pythagoras' theorem and trigonometry in right-angled triangles and 2D problems.",
      "Calculate perimeter, area and volume for a range of shapes including composite shapes.",
      "Understand transformations (enlargement, rotation, reflection, translation) and bearings.",
      "Work comfortably with standard metric units and convert between units.",
    ],
  },
  {
    id: "maths-probability",
    title: "3.5 Probability",
    activity: "school",
    area: "Probability: experimental and theoretical probability, combined events",
    progress: 56,
    knowledge: [
      "Understand probability as a number between 0 and 1 and represent probabilities as fractions, decimals and percentages.",
      "Calculate probabilities for single events and combined independent events (including tree diagrams).",
      "Use sample spaces and conditional ideas in simple contexts and interpret experimental results.",
      "Estimate probabilities from data and compare theoretical vs experimental probabilities.",
    ],
  },
  {
    id: "maths-statistics",
    title: "3.6 Statistics",
    activity: "school",
    area: "Collecting and processing data, averages and spread, interpreting charts",
    progress: 60,
    knowledge: [
      "Collect and represent data in tables, bar/pie charts, scatter graphs and histograms.",
      "Calculate and interpret measures of location (mean, median, mode) and spread (range, IQR, standard deviation—introductory).",
      "Interpret statistical measures in context and understand misleading representations.",
      "Use line of best fit and correlation to describe relationships in bivariate data.",
    ],
  },
  {
    id: "physics-energy",
    title: "4.1 Energy",
    activity: "school",
    area: "Energy stores, transfers, efficiency, power and renewable energy",
    progress: 55,
    knowledge: [
      "Understand different energy stores and how energy transfers between them.",
      "Use the equation E = mgh and E = ½mv² for gravitational and kinetic energy.",
      "Calculate efficiency and power from energy transferred and time.",
      "Recognise renewable and non-renewable energy sources and their environmental impact.",
    ],
  },
  {
    id: "physics-electricity",
    title: "4.2 Electricity",
    activity: "school",
    area: "Current, voltage, resistance, circuits and power",
    progress: 52,
    knowledge: [
      "Describe the difference between series and parallel circuits.",
      "Use V = IR and calculate power with P = VI.",
      "Measure current and potential difference using ammeters and voltmeters correctly.",
      "Understand the behaviour of resistors and the impact of component arrangement.",
    ],
  },
  {
    id: "physics-particles",
    title: "4.3 Particle model of matter",
    activity: "school",
    area: "Density, pressure, changes of state and kinetic theory",
    progress: 54,
    knowledge: [
      "Use density = mass/volume and calculate density for solids, liquids and gases.",
      "Describe internal energy, specific heat capacity and specific latent heat.",
      "Explain pressure in gases and liquids and relate it to particle motion.",
      "Describe changes of state with energy transfer and particle movement.",
    ],
  },
  {
    id: "physics-atomic",
    title: "4.4 Atomic structure",
    activity: "school",
    area: "Subatomic particles, isotopes, nuclear radiation and half-life",
    progress: 48,
    knowledge: [
      "Identify protons, neutrons and electrons and use atomic and mass numbers.",
      "Explain radioactive decay and the properties of alpha, beta and gamma radiation.",
      "Use half-life to describe how activity decreases over time.",
      "Understand nuclear equations and energy release from radioactive sources.",
    ],
  },
  {
    id: "physics-forces",
    title: "4.5 Forces",
    activity: "school",
    area: "Forces, motion, Newton's laws, momentum and elastic behaviour",
    progress: 56,
    knowledge: [
      "Apply equations for speed, acceleration and force (F = ma).",
      "Explain Newton's third law and give examples of action-reaction pairs.",
      "Calculate momentum and use the idea of conservation of momentum.",
      "Describe elastic and inelastic deformation and relate force to extension.",
    ],
  },
  {
    id: "physics-waves",
    title: "4.6 Waves",
    activity: "school",
    area: "Wave behaviour, reflection, refraction, sound and electromagnetic spectrum",
    progress: 50,
    knowledge: [
      "Describe transverse and longitudinal waves and use wave speed = frequency × wavelength.",
      "Explain reflection, refraction and total internal reflection.",
      "Understand the properties of sound and the EM spectrum.",
      "Use ray diagrams for lenses and mirrors and describe their effects.",
    ],
  },
  {
    id: "physics-magnetism",
    title: "4.7 Magnetism and electromagnetism",
    activity: "school",
    area: "Magnetic fields, forces, motors, transformers and induced voltage",
    progress: 51,
    knowledge: [
      "Describe the shape of magnetic field lines around magnets and current-carrying wires.",
      "Explain how motors, generators and transformers work.",
      "Use Fleming's left-hand rule and right-hand rule for force and induction.",
      "Understand induced voltage and how it changes with magnetic flux and movement.",
    ],
  },
  {
    id: "physics-space",
    title: "4.8 Space physics",
    activity: "school",
    area: "Orbits, satellites, gravitational fields and lifecycle of stars",
    progress: 45,
    knowledge: [
      "Describe planetary orbits and the role of gravity in circular motion.",
      "Explain how satellites remain in orbit and how their speed relates to orbit height.",
      "Understand the main stages in the life cycle of stars and what determines their path.",
      "Use the idea of gravitational fields and the inverse square law qualitatively.",
    ],
  },
  {
    id: "physics-keyideas",
    title: "4.9 Key ideas",
    activity: "school",
    area: "Science skills, models, measurement, risk and communicating ideas",
    progress: 57,
    knowledge: [
      "Use models and theories to explain physical phenomena and their limitations.",
      "Identify variables and design experiments using fair testing and repeated trials.",
      "Draw graphs and interpret trends using scientific evidence.",
      "Understand uncertainty, accuracy and how to present results clearly.",
    ],
  },
  {
    id: "chemistry-atomic",
    title: "4.1 Atomic structure and the periodic table",
    activity: "school",
    area: "Atoms, isotopes, electronic structure and periodic trends",
    progress: 50,
    knowledge: [
      "Describe the structure of atoms and compare relative atomic mass and charge.",
      "Explain how electrons occupy shells and how this determines group and period.",
      "Use the periodic table to predict element properties and group behaviour.",
      "Understand isotopes, relative formula mass and arrangement of elements in the periodic table.",
    ],
  },
  {
    id: "chemistry-bonding",
    title: "4.2 Bonding, structure and the properties of matter",
    activity: "school",
    area: "Ionic, covalent and metallic bonding, giant structures and properties",
    progress: 48,
    knowledge: [
      "Compare ionic, covalent and metallic bonding and how they affect melting and boiling points.",
      "Describe giant covalent and metallic structures and explain electrical conductivity.",
      "Use dot-and-cross diagrams to show bonding and predict formulas.",
      "Understand allotropes of carbon and the properties of substances like diamond and graphite.",
    ],
  },
  {
    id: "chemistry-quantitative",
    title: "4.3 Quantitative chemistry",
    activity: "school",
    area: "Moles, conserving mass, reacting masses and concentration",
    progress: 52,
    knowledge: [
      "Use formulas to calculate reacting masses and mass changes in chemical reactions.",
      "Understand the mole concept and use Avogadro's constant where needed.",
      "Calculate concentration in g/dm³ and mol/dm³ and use balanced equations. ",
      "Recognise the law of conservation of mass in chemical reactions.",
    ],
  },
  {
    id: "chemistry-changes",
    title: "4.4 Chemical changes",
    activity: "school",
    area: "Acids and alkalis, reactivity series, electrolysis and extraction",
    progress: 49,
    knowledge: [
      "Describe neutralisation and the pH scale and calculate concentrations from titration data.",
      "Use the reactivity series to predict displacement reactions and extraction of metals.",
      "Explain electrolysis and the products formed at each electrode.",
      "Understand acids, bases and salts and why some metals are extracted by reduction.",
    ],
  },
  {
    id: "chemistry-energy",
    title: "4.5 Energy changes",
    activity: "school",
    area: "Exothermic and endothermic reactions, bond energy and reaction profiles",
    progress: 46,
    knowledge: [
      "Distinguish between exothermic and endothermic reactions and draw energy profile diagrams.",
      "Use bond energies to calculate energy changes for reactions.",
      "Explain why some reactions release energy and others absorb it.",
      "Understand the role of activation energy and reaction pathways.",
    ],
  },
  {
    id: "chemistry-rate",
    title: "4.6 The rate and extent of chemical change",
    activity: "school",
    area: "Rate of reaction, concentration, catalysts, equilibrium and yield",
    progress: 47,
    knowledge: [
      "Describe factors affecting rate of reaction and how to measure it experimentally.",
      "Explain the effect of concentration, temperature, surface area and catalysts.",
      "Use collision theory to explain how reactions become faster or slower.",
      "Understand reversible reactions, dynamic equilibrium and factors affecting yield.",
    ],
  },
  {
    id: "chemistry-organic",
    title: "4.7 Organic chemistry",
    activity: "school",
    area: "Hydrocarbons, functional groups, polymers and fuels",
    progress: 45,
    knowledge: [
      "Describe the structure and naming of alkanes, alkenes and homologous series.",
      "Explain polymerisation and the properties of addition polymers.",
      "Understand fuels, cracking and the chemistry of crude oil fractions.",
      "Recognise functional groups such as alcohols, carboxylic acids and esters.",
    ],
  },
  {
    id: "chemistry-analysis",
    title: "4.8 Chemical analysis",
    activity: "school",
    area: "Purity, chromatography, identification of ions and gases",
    progress: 51,
    knowledge: [
      "Use chromatography to identify substances and test purity.",
      "Describe tests for common ions and gases in qualitative analysis.",
      "Understand how formulations and chromatography are used in real contexts.",
      "Use techniques such as flame tests and gas tests to identify elements and compounds.",
    ],
  },
  {
    id: "chemistry-atmosphere",
    title: "4.9 Chemistry of the atmosphere",
    activity: "school",
    area: "Composition of the atmosphere, climate change and pollutant gases",
    progress: 44,
    knowledge: [
      "Describe the composition of the Earth's atmosphere and how it has changed over time.",
      "Understand the greenhouse effect and the role of carbon dioxide and methane.",
      "Explain acid rain, particulate pollution and the effects of sulfur and nitrogen oxides.",
      "Recognise how human activity affects atmospheric chemistry and climate.",
    ],
  },
  {
    id: "chemistry-resources",
    title: "4.10 Using resources",
    activity: "school",
    area: "Sustainable raw materials, water, life cycle and recycling",
    progress: 46,
    knowledge: [
      "Understand how materials are extracted and processed from the Earth.",
      "Describe the importance of recycling, potable water and sustainable chemistry.",
      "Explain life cycle assessments and how to reduce environmental impact.",
      "Understand how agriculture and finite resources affect material supply.",
    ],
  },
  {
    id: "chemistry-keyideas",
    title: "4.11 Key ideas",
    activity: "school",
    area: "Core chemistry skills, models, measurement and evaluation",
    progress: 53,
    knowledge: [
      "Use chemical models to explain structure and bonding, while recognising their limits.",
      "Identify variables, design fair tests and describe risk in experiments.",
      "Process data accurately and draw conclusions from evidence.",
      "Understand the importance of measurement accuracy, repeat readings and error analysis.",
    ],
  },
  {
    id: "english-writing",
    title: "English - Writing",
    activity: "school",
    area: "Essay structure, analysis",
    progress: 64,
    knowledge: [
      "Start a paragraph with a clear point linked to the question.",
      "Use evidence precisely and explain how it supports the point.",
      "Close by connecting the analysis back to the argument.",
    ],
  },
  {
    id: "cadets-nav",
    title: "Air Cadets - Navigation",
    activity: "cadets",
    area: "Map symbols, bearings",
    progress: 61,
    knowledge: [
      "Grid references read eastings first, then northings.",
      "A bearing is measured clockwise from north.",
      "Use contour lines to judge slope and height change.",
    ],
  },
  {
    id: "football-game",
    title: "Football - Match Craft",
    activity: "football",
    area: "Positioning, scanning",
    progress: 69,
    knowledge: [
      "Scan before receiving to choose the next action earlier.",
      "Create passing angles by moving off the marker's line.",
      "Recover goal-side quickly after losing possession.",
    ],
  },
];

export const defaultQuestions: QuizQuestion[] = [
  {
    id: "q-number-1",
    topicId: "maths-number",
    prompt: "What is 15% of 240?",
    options: ["24", "36", "40", "48"],
    answer: 1,
    explanation: "15% of 240 is 0.15 × 240 = 36.",
  },
  {
    id: "q-number-2",
    topicId: "maths-number",
    prompt: "Write 0.00042 in standard form.",
    options: ["4.2 × 10⁻⁴", "4.2 × 10⁻³", "42 × 10⁻⁵", "0.42 × 10⁻³"],
    answer: 0,
    explanation: "Move the decimal 4 places to the right: 4.2 × 10⁻⁴.",
  },
  {
    id: "q-number-3",
    topicId: "maths-number",
    prompt: "A bag contains 4 red, 3 blue and 5 green counters. What fraction are not green?",
    options: ["4/12", "7/12", "8/12", "9/12"],
    answer: 1,
    explanation: "Not green counters = 4 + 3 = 7, total 12, so 7/12.",
  },
  {
    id: "q-algebra-1",
    topicId: "maths-algebra",
    prompt: "Solve 3x + 7 = 22.",
    options: ["x = 3", "x = 5", "x = 10", "x = 15"],
    answer: 1,
    explanation: "Subtract 7 from both sides then divide by 3 to get x = 5.",
  },
  {
    id: "q-algebra-2",
    topicId: "maths-algebra",
    prompt: "Expand and simplify 4(2x - 3) + 5x.",
    options: ["13x - 12", "8x - 12", "13x + 12", "3x - 12"],
    answer: 0,
    explanation: "Expand to 8x - 12 then add 5x to get 13x - 12.",
  },
  {
    id: "q-algebra-3",
    topicId: "maths-algebra",
    prompt: "The first four terms of a sequence are 6, 10, 14, 18. Write the nth term.",
    options: ["4n + 2", "2n + 4", "3n + 3", "n + 5"],
    answer: 0,
    explanation: "The common difference is 4, so the nth term is 4n + 2.",
  },
  {
    id: "q-algebra-4",
    topicId: "maths-algebra",
    prompt: "Solve x² - 5x + 6 = 0.",
    options: ["x = 2 or 3", "x = -2 or -3", "x = 1 or 6", "x = -1 or -6"],
    answer: 0,
    explanation: "Factor to (x - 2)(x - 3) = 0 so x = 2 or 3.",
  },
  {
    id: "q-ratio-1",
    topicId: "maths-ratio",
    prompt: "A recipe uses 2 parts sugar to 3 parts flour. If 20g of sugar is used, how much flour is needed?",
    options: ["20g", "25g", "30g", "40g"],
    answer: 2,
    explanation: "Ratio 2:3 means flour = 3/2 × 20 = 30g.",
  },
  {
    id: "q-ratio-2",
    topicId: "maths-ratio",
    prompt: "A car travels 100 km in 2 hours 30 minutes. What is its average speed in km/h?",
    options: ["40", "42", "44", "45"],
    answer: 0,
    explanation: "100 ÷ 2.5 = 40 km/h.",
  },
  {
    id: "q-geometry-1",
    topicId: "maths-geometry",
    prompt: "What is the area of a triangle with base 8 cm and height 5 cm?",
    options: ["20 cm²", "26 cm²", "30 cm²", "40 cm²"],
    answer: 0,
    explanation: "Area = ½ × 8 × 5 = 20 cm².",
  },
  {
    id: "q-geometry-2",
    topicId: "maths-geometry",
    prompt: "A circle has radius 7 cm. What is its circumference? Use π ≈ 3.14.",
    options: ["43.96 cm", "21.98 cm", "153.86 cm", "87.92 cm"],
    answer: 0,
    explanation: "Circumference = 2 × 3.14 × 7 = 43.96 cm.",
  },
  {
    id: "q-geometry-3",
    topicId: "maths-geometry",
    prompt: "In a right triangle, angle A = 30° and hypotenuse = 10 cm. What is the opposite side?",
    options: ["5 cm", "10√3 cm", "5√3 cm", "8.66 cm"],
    answer: 0,
    explanation: "Opposite side = 10 × sin 30° = 10 × 0.5 = 5 cm.",
  },
  {
    id: "q-statistics-1",
    topicId: "maths-statistics",
    prompt: "The numbers are 3, 5, 7, 7, 8. What is the mode?",
    options: ["3", "5", "7", "8"],
    answer: 2,
    explanation: "7 appears most often.",
  },
  {
    id: "q-statistics-2",
    topicId: "maths-statistics",
    prompt: "What is the mean of 4, 7, 7, 9 and 13?",
    options: ["7.8", "8", "8.2", "8.5"],
    answer: 1,
    explanation: "Mean = 40 ÷ 5 = 8.",
  },
  {
    id: "q-physics-energy-1",
    topicId: "physics-energy",
    prompt: "A 2 kg object rises by 5 m. What is the increase in gravitational potential energy? Use g = 9.8 N/kg.",
    options: ["49 J", "98 J", "196 J", "980 J"],
    answer: 1,
    explanation: "ΔE = mgh = 2 × 9.8 × 5 = 98 J.",
  },
  {
    id: "q-physics-electricity-1",
    topicId: "physics-electricity",
    prompt: "A resistor has 0.5 A flowing through it with 12 V across it. What is its resistance?",
    options: ["6 Ω", "24 Ω", "0.041 Ω", "18 Ω"],
    answer: 1,
    explanation: "Using V = IR gives R = V/I = 12 / 0.5 = 24 Ω.",
  },
  {
    id: "q-physics-particles-1",
    topicId: "physics-particles",
    prompt: "What is the density of a 4 kg object with volume 2 m³?",
    options: ["0.5 kg/m³", "2 kg/m³", "8 kg/m³", "6 kg/m³"],
    answer: 1,
    explanation: "Density = mass ÷ volume = 4 ÷ 2 = 2 kg/m³.",
  },
  {
    id: "q-physics-atomic-1",
    topicId: "physics-atomic",
    prompt: "How many protons are in an atom of carbon-12?",
    options: ["6", "12", "18", "24"],
    answer: 0,
    explanation: "Carbon has atomic number 6, so it has 6 protons.",
  },
  {
    id: "q-physics-forces-1",
    topicId: "physics-forces",
    prompt: "A 3 kg object accelerates at 4 m/s². What force acts on it?",
    options: ["7 N", "12 N", "15 N", "20 N"],
    answer: 1,
    explanation: "F = ma, so 3 × 4 = 12 N.",
  },
  {
    id: "q-physics-waves-1",
    topicId: "physics-waves",
    prompt: "A wave has frequency 5 Hz and wavelength 2 m. What is its speed?",
    options: ["2 m/s", "5 m/s", "7 m/s", "10 m/s"],
    answer: 3,
    explanation: "Speed = frequency × wavelength = 5 × 2 = 10 m/s.",
  },
  {
    id: "q-physics-magnetism-1",
    topicId: "physics-magnetism",
    prompt: "Which device converts electrical energy into mechanical energy using magnetic fields?",
    options: ["Transformer", "Motor", "Generator", "Resistor"],
    answer: 1,
    explanation: "A motor converts electrical energy to mechanical energy.",
  },
  {
    id: "q-physics-space-1",
    topicId: "physics-space",
    prompt: "Which force keeps planets moving in a circular orbit around the Sun?",
    options: ["Friction", "Magnetism", "Gravity", "Air resistance"],
    answer: 2,
    explanation: "Gravity is the centripetal force that keeps planets in orbit.",
  },
  {
    id: "q-physics-keyideas-1",
    topicId: "physics-keyideas",
    prompt: "Which variable should be changed by the experimenter in a fair test?",
    options: ["Dependent variable", "Control variable", "Independent variable", "Random variable"],
    answer: 2,
    explanation: "The independent variable is changed by the experimenter.",
  },
  {
    id: "q-chem-atomic-1",
    topicId: "chemistry-atomic",
    prompt: "Which element is in Group 1 and Period 3 of the periodic table?",
    options: ["Lithium", "Sodium", "Potassium", "Magnesium"],
    answer: 1,
    explanation: "Sodium is Group 1, Period 3.",
  },
  {
    id: "q-chem-bonding-1",
    topicId: "chemistry-bonding",
    prompt: "What type of bonding occurs between sodium and chlorine in sodium chloride?",
    options: ["Covalent", "Ionic", "Metallic", "Hydrogen"],
    answer: 1,
    explanation: "Sodium transfers an electron to chlorine, forming oppositely charged ions.",
  },
  {
    id: "q-chem-quantitative-1",
    topicId: "chemistry-quantitative",
    prompt: "What is the relative formula mass of H2O?",
    options: ["18", "20", "16", "10"],
    answer: 0,
    explanation: "H2O = 2 × 1 + 16 = 18.",
  },
  {
    id: "q-chem-changes-1",
    topicId: "chemistry-changes",
    prompt: "What is formed when an acid reacts with a base?",
    options: ["Salt and water", "Salt and oxygen", "Hydrogen gas", "A polymer"],
    answer: 0,
    explanation: "Acid-base reactions form a salt and water.",
  },
  {
    id: "q-chem-energy-1",
    topicId: "chemistry-energy",
    prompt: "Which type of reaction releases heat to the surroundings?",
    options: ["Endothermic", "Exothermic", "Neutralisation", "Precipitation"],
    answer: 1,
    explanation: "Exothermic reactions transfer heat to the surroundings.",
  },
  {
    id: "q-chem-rate-1",
    topicId: "chemistry-rate",
    prompt: "What happens to the rate of reaction when concentration of reactants increases?",
    options: ["It decreases", "It stays the same", "It increases", "It becomes zero"],
    answer: 2,
    explanation: "Higher concentration means more collisions, so the rate increases.",
  },
  {
    id: "q-chem-organic-1",
    topicId: "chemistry-organic",
    prompt: "Which functional group is present in ethanol?",
    options: ["Alcohol", "Carboxylic acid", "Amine", "Ester"],
    answer: 0,
    explanation: "Ethanol contains an alcohol functional group (−OH).",
  },
  {
    id: "q-chem-analysis-1",
    topicId: "chemistry-analysis",
    prompt: "Which technique separates dissolved substances based on solubility and movement on paper?",
    options: ["Filtration", "Distillation", "Chromatography", "Electrolysis"],
    answer: 2,
    explanation: "Chromatography separates substances by movement on paper or another medium.",
  },
  {
    id: "q-chem-atmosphere-1",
    topicId: "chemistry-atmosphere",
    prompt: "Which gas is most associated with the greenhouse effect?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Argon"],
    answer: 2,
    explanation: "Carbon dioxide is a primary greenhouse gas affecting climate change.",
  },
  {
    id: "q-chem-resources-1",
    topicId: "chemistry-resources",
    prompt: "Which process is used to produce potable water from seawater?",
    options: ["Chromatography", "Distillation", "Electrolysis", "Recycling"],
    answer: 1,
    explanation: "Desalination by distillation produces potable water from seawater.",
  },
  {
    id: "q-chem-keyideas-1",
    topicId: "chemistry-keyideas",
    prompt: "What does a control variable do in a scientific experiment?",
    options: ["Changes with the independent variable", "Is kept constant", "Is measured at the end", "Is chosen randomly"],
    answer: 1,
    explanation: "A control variable is kept constant to ensure a fair test.",
  },
  {
    id: "q-writing-1",
    topicId: "english-writing",
    prompt: "Which paragraph opening best supports a focused essay answer?",
    options: [
      "I am going to write about many things.",
      "This quote is interesting.",
      "The writer presents ambition as dangerous through Macbeth's changing choices.",
      "There are lots of techniques in the extract.",
    ],
    answer: 2,
    explanation: "It makes a clear point and links directly to the argument.",
  },
  {
    id: "q-cadets-1",
    topicId: "cadets-nav",
    prompt: "When reading a grid reference, which direction is read first?",
    options: ["Northings", "Eastings", "Contours", "Bearings"],
    answer: 1,
    explanation: "Grid references are read along the eastings first, then up the northings.",
  },
  {
    id: "q-football-1",
    topicId: "football-game",
    prompt: "Why scan before receiving the ball?",
    options: [
      "To slow the game down",
      "To decide the next action earlier",
      "To avoid passing",
      "To stay behind the defender",
    ],
    answer: 1,
    explanation: "Scanning gives you information before the ball arrives, so decisions are faster.",
  },
];

// Helper: deterministic pseudo-random based on index
function seededRandom(seed: number) {
  let t = seed + 0x6D2B79F5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967295;
  };
}

function makeOptions(correct: number, distractors: number[], format = (n: number) => String(n)) {
  const opts = [correct, ...distractors].slice(0, 4).map(format);
  while (opts.length < 4) opts.push("-");
  return opts;
}

function genNumberQuestions(topicId: string, count: number, seedBase: number) {
  const rnd = seededRandom(seedBase);
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(rnd() * 90) + 10; // 10-99
    const percent = [10, 15, 20, 25, 30][Math.floor(rnd() * 5)];
    const correct = Math.round((percent / 100) * a);
    const distractors = [Math.max(1, correct - 5), correct + 5, Math.max(1, Math.round(correct * 1.2))];
    out.push({
      id: `${topicId}-num-${seedBase}-${i}`,
      topicId,
      prompt: `What is ${percent}% of ${a}?`,
      options: makeOptions(correct, distractors, (n) => String(n)),
      answer: 0,
      explanation: `${percent}% of ${a} = ${percent / 100} × ${a} = ${correct}.`,
    });
  }
  return out;
}

function genAlgebraQuestions(topicId: string, count: number, seedBase: number) {
  const rnd = seededRandom(seedBase);
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(rnd() * 8) + 1; // 1-8
    const x = Math.floor(rnd() * 12) - 4; // -4..7
    const b = Math.floor(rnd() * 20) - 10; // -10..9
    const c = a * x + b;
    const prompt = `Solve ${a}x ${b >= 0 ? "+" : ""}${b} = ${c}.`;
    const correct = x;
    const distractors = [x + 1, x - 1, x + 2];
    out.push({ id: `${topicId}-alg-${seedBase}-${i}`, topicId, prompt, options: makeOptions(correct, distractors, (n) => `x = ${n}`), answer: 0, explanation: `Rearrange to ${a}x = ${c - b} so x = ${(c - b) / a}.` });
  }
  return out;
}

function genRatioQuestions(topicId: string, count: number, seedBase: number) {
  const rnd = seededRandom(seedBase);
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const p = Math.floor(rnd() * 4) + 2; // part A
    const q = Math.floor(rnd() * 5) + 2; // part B
    const totalA = p * (Math.floor(rnd() * 5) + 1);
    const correct = Math.round((q / p) * totalA);
    const prompt = `A recipe uses ${p} parts sugar to ${q} parts flour. If ${totalA}g of sugar is used, how much flour is needed?`;
    const distractors = [Math.max(1, correct - 3), correct + 3, Math.max(1, Math.round(correct * 1.1))];
    out.push({ id: `${topicId}-ratio-${seedBase}-${i}`, topicId, prompt, options: makeOptions(correct, distractors, (n) => `${n}g`), answer: 0, explanation: `Scale by ${q}/${p}: flour = ${q}/${p} × ${totalA} = ${correct}g.` });
  }
  return out;
}

function genGeometryQuestions(topicId: string, count: number, seedBase: number) {
  const rnd = seededRandom(seedBase);
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const b = Math.floor(rnd() * 12) + 3;
    const h = Math.floor(rnd() * 10) + 2;
    const correct = 0.5 * b * h;
    const prompt = `What is the area of a triangle with base ${b} cm and height ${h} cm?`;
    const distractors = [Math.max(1, correct - 5), correct + 5, Math.max(1, Math.round(correct * 1.2))];
    out.push({ id: `${topicId}-geo-${seedBase}-${i}`, topicId, prompt, options: makeOptions(correct, distractors, (n) => `${n} cm²`), answer: 0, explanation: `Area = 1/2 × ${b} × ${h} = ${correct} cm².` });
  }
  return out;
}

function genProbabilityQuestions(topicId: string, count: number, seedBase: number) {
  const rnd = seededRandom(seedBase);
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(rnd() * 4) + 1;
    const bl = Math.floor(rnd() * 4) + 1;
    const total = r + bl;
    const correctNum = `${r}/${total}`;
    const options = [correctNum, `${bl}/${total}`, `1/${total}`, `${(r + bl) / total}`];
    out.push({ id: `${topicId}-prob-${seedBase}-${i}`, topicId, prompt: `A bag contains ${r} red and ${bl} blue counters. What is the probability of drawing a red counter?`, options, answer: 0, explanation: `There are ${r} red out of ${total} total, so ${r}/${total}.` });
  }
  return out;
}

function genStatisticsQuestions(topicId: string, count: number, seedBase: number) {
  const rnd = seededRandom(seedBase);
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const nums = Array.from({ length: 5 }, () => Math.floor(rnd() * 10) + 1);
    const mean = (nums.reduce((s, v) => s + v, 0) / nums.length).toFixed(1);
    const prompt = `Find the mean of ${nums.join(", ")}.`;
    const distractors = [Number((Number(mean) + 0.5).toFixed(1)), Number((Number(mean) - 0.5).toFixed(1)), Number((Number(mean) + 1).toFixed(1))];
    out.push({ id: `${topicId}-stats-${seedBase}-${i}`, topicId, prompt, options: makeOptions(Number(mean), distractors, (n) => String(n)), answer: 0, explanation: `Mean = ${nums.join(" + ")} ÷ ${nums.length} = ${mean}.` });
  }
  return out;
}

// Create default practice sets: 100 per topic (Higher-tier focus)
const perTopic = 100;
export const defaultPracticeSets = [
  { id: "ps-maths-number", title: "Number practice (Higher)", questions: genNumberQuestions("maths-number", perTopic, 101), topicId: "maths-number", tier: "Higher", createdAt: Date.now() },
  { id: "ps-maths-algebra", title: "Algebra practice (Higher)", questions: genAlgebraQuestions("maths-algebra", perTopic, 201), topicId: "maths-algebra", tier: "Higher", createdAt: Date.now() },
  { id: "ps-maths-ratio", title: "Ratio & Proportion practice (Higher)", questions: genRatioQuestions("maths-ratio", perTopic, 301), topicId: "maths-ratio", tier: "Higher", createdAt: Date.now() },
  { id: "ps-maths-geometry", title: "Geometry practice (Higher)", questions: genGeometryQuestions("maths-geometry", perTopic, 401), topicId: "maths-geometry", tier: "Higher", createdAt: Date.now() },
  { id: "ps-maths-probability", title: "Probability practice (Higher)", questions: genProbabilityQuestions("maths-probability", perTopic, 501), topicId: "maths-probability", tier: "Higher", createdAt: Date.now() },
  { id: "ps-maths-statistics", title: "Statistics practice (Higher)", questions: genStatisticsQuestions("maths-statistics", perTopic, 601), topicId: "maths-statistics", tier: "Higher", createdAt: Date.now() },
];
