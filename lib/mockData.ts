import type { Mentee, Session, Task, CalendarEvent, MonthlySalary, ModuleSyllabus } from '@/types';

// ─── SYLLABUS CATALOGUE MODULES ──────────────────────────────────────────────

export const availableModules: ModuleSyllabus[] = [
  {
    code: '26/1 - Academic Writing',
    title: 'Academic Writing',
    division: 'Skill Development',
    coreFor: 'N/A',
    formLink: 'N/A',
    teacher: 'various',
    level: 'N/A',
  },
  {
    code: '26/1 - Magic in the Making',
    title: 'Magic in the Making',
    division: 'Arts and Humanities: Applied Aesthetics',
    coreFor: 'N/A',
    formLink: 'N/A',
    teacher: 'Dúcz Erzsébet',
    level: 'Freshman Module',
  },
  {
    code: '26/1 - Ventures',
    title: 'Ventures',
    division: 'Social Sciences: Regions, Development, Enterprise',
    coreFor: 'N/A',
    formLink: 'N/A',
    teacher: 'Zekov Szófia',
    level: 'Freshman Module',
  },
  {
    code: '26/1 - Engineering Lab: 3D Printing',
    title: 'Engineering Lab: 3D Printing',
    division: 'Numerical Sciences: Physics and Engineering',
    coreFor: 'N/A',
    formLink: 'https://forms.gle/JfjGVyxEz6xr4YC99',
    teacher: 'Husam Kareem',
    level: 'Orientation',
  },
  {
    code: '26/1 - Evolution',
    title: 'Evolution',
    division: 'Natural Sciences: Life Sciences',
    coreFor: 'Veterinary Science, Anthropology',
    formLink: 'https://forms.gle/qKnZ6Q4bgHs8uQxL7',
    teacher: 'Boros Gergely',
    level: 'Orientation',
  },
  {
    code: '26/1 - Forensic Science',
    title: 'Forensic Science',
    division: 'Natural Sciences: Chemical, Material and Earth Sciences',
    coreFor: 'N/A',
    formLink: 'https://forms.gle/UN9gLhYDuxTPsV9n9',
    teacher: 'Rézműves Zoltán, Boros Gergely',
    level: 'Orientation',
  },
  {
    code: '26/1 - Global Challenges',
    title: 'Global Challenges',
    division: 'Numerical Sciences: Physics and Engineering',
    coreFor: 'Business and Management',
    formLink: 'https://forms.gle/qyYgYYcumcEYMsov6',
    teacher: 'Verebes-Szász Edit',
    level: 'Orientation',
  },
  {
    code: '26/1 - Good and Evil',
    title: 'Good and Evil',
    division: 'Arts and Humanities: Law and Humanities',
    coreFor: 'Theology',
    formLink: 'https://forms.gle/EUyASR6PMeX7iqXs6',
    teacher: 'Sárosi András',
    level: 'Orientation',
  },
  {
    code: '26/1 - Human Nature',
    title: 'Human Nature',
    division: 'Natural Sciences: Thought, Language, Behaviour',
    coreFor: 'Psychology, Social Anthropology',
    formLink: 'https://forms.gle/2bQKY2CYJp24pREb7',
    teacher: 'Markó Gitta',
    level: 'Orientation',
  },
  {
    code: '26/1 - Posters for Change',
    title: 'Posters for Change',
    division: 'Arts and Humanities: Applied Aesthetics',
    coreFor: 'Design, Animation and Fine Art',
    formLink: 'https://forms.gle/fG8893iAWFNQ1iMV8',
    teacher: 'Máté Dániel',
    level: 'Orientation',
  },
  {
    code: '26/1 - Introduction to Programming',
    title: 'Introduction to Programming',
    division: 'Numerical Sciences: Mathematics and Its Applications',
    coreFor: 'Computer Science',
    formLink: 'https://forms.gle/mZ5sMBmEDNtCZ4MTA',
    teacher: 'Saleem Mohammad',
    level: 'Orientation',
  },
  {
    code: '26/1 - World Politics and Area Studies: The Middle East',
    title: 'World Politics and Area Studies: The Middle East',
    division: 'Social Sciences: Regions, Development, Enterprise',
    coreFor: 'Area Studies and Languages, International Relations',
    formLink: 'https://forms.gle/dNq8VczZqKZV4SPM6',
    teacher: 'Akin Erdost',
    level: 'Immersion 1',
  },
  {
    code: '26/1 - Diagnosis',
    title: 'Diagnosis',
    division: 'Natural Sciences: Life Sciences',
    coreFor: 'Biology, Medicine, Veterinary Science',
    formLink: 'https://forms.gle/LUzA3TCgC8YNtQkUA',
    teacher: 'Vig Julianna',
    level: 'Immersion 1',
  },
  {
    code: '26/1 - Differentiation',
    title: 'Differentiation',
    division: 'Numerical Sciences: Mathematics and Its Applications',
    coreFor: 'Computer Science, Economics, Mathematics, Engineering, Physics',
    formLink: 'https://forms.gle/AaKR2hxcfzdsygas5',
    teacher: 'Szabó Dávid',
    level: 'Immersion 1',
  },
  {
    code: '26/1 - Pop vs Culture',
    title: 'Pop vs Culture',
    division: 'Arts and Humanities: Applied Aesthetics',
    coreFor: 'Music, Literary Studies, Film Studies, Art Management, Animation and Fine Art, Cultural Studies',
    formLink: 'https://forms.gle/GYnLSJbaV3SZj3qV6',
    teacher: 'Szentpály Dalma',
    level: 'Immersion 1',
  },
  {
    code: '26/1 - Quantitative Research Methods',
    title: 'Quantitative Research Methods',
    division: 'Natural Sciences: Thought, Language, Behaviour',
    coreFor: 'Linguistics, Psychology, Sociology',
    formLink: 'https://forms.gle/f2PsCyaiXFtHWhGb6',
    teacher: 'Sopronyi Gréta',
    level: 'Immersion 1',
  },
  {
    code: '26/1 - Sociological Perspectives',
    title: 'Sociological Perspectives',
    division: 'Social Sciences: Politics, Society, Culture',
    coreFor: 'Politics, Sociology, Cultural Studies',
    formLink: 'https://forms.gle/1GoLZop9qj6x3HpL6',
    teacher: 'Jakab Eszter',
    level: 'Immersion 1',
  },
  {
    code: '26/1 - Biomedical Ethics',
    title: 'Biomedical Ethics',
    division: 'Natural Sciences: Thought, Language, Behaviour',
    coreFor: 'Philosophy',
    formLink: 'https://forms.gle/kqfK5x95UWtjz2mW8',
    teacher: 'Varjú Márton',
    level: 'Immersion 2',
  },
  {
    code: '26/1 - Historiography',
    title: 'Historiography',
    division: 'Arts and Humanities: Past, Narrative, Interpretation',
    coreFor: 'Archaeology, History, Area Studies and Languages',
    formLink: 'https://forms.gle/H56kqFfNxrjbduxeA',
    teacher: 'Hutvágner Zsófia',
    level: 'Immersion 2',
  },
  {
    code: '26/1 - Mechanics',
    title: 'Mechanics',
    division: 'Numerical Sciences: Physics and Engineering',
    coreFor: 'Engineering, Physics, Materials Science',
    formLink: 'https://forms.gle/8hCxdH9p2a762c716',
    teacher: 'Hetényi Balázs',
    level: 'Immersion 2',
  },
  {
    code: '26/1 - Probability',
    title: 'Probability',
    division: 'Numerical Sciences: Mathematics and Its Applications',
    coreFor: 'Economics',
    formLink: 'https://forms.gle/byAGcpqy6b3i4qm89',
    teacher: 'Mavroyiannis Diomides',
    level: 'Immersion 2',
  },
  {
    code: '26/1 - State Theory',
    title: 'State Theory',
    division: 'Social Sciences: Politics, Society, Culture',
    coreFor: 'Politics',
    formLink: 'https://forms.gle/D8vmLFqqXBNLDQZp8',
    teacher: 'Hayes Lukács Dániel',
    level: 'Immersion 2',
  },
  {
    code: '26/1 - Energy',
    title: 'Energy',
    division: 'Social Sciences: Regions, Development, Enterprise',
    coreFor: 'International Relations, Land Economy and Development Studies, Geography, Business and Management',
    formLink: 'https://forms.gle/jPZfCbMvf4JyZxtS7',
    teacher: 'Dürr Miklós János',
    level: 'Focus',
  },
];

// ─── REAL DATA MENTEES ───────────────────────────────────────────────────────

export const defaultMentees: Mentee[] = [
  {
    id: 'tianle',
    name: 'Wang Tianle (Kimi)',
    yearGroup: 'Sophomore',
    avatar: 'Atom',
    subject: 'Physics & History',
    color: '#3b82f6', // bright blue
    bgClass: 'bg-blue-500',
    level: 3,
    xp: 450,
    xpToNext: 600,
    streak: 2,
    badges: [],
    goal: 'Study abroad in France, Germany, or Switzerland',
    longTermGoal: 'Build multi-disciplinary expertise combining technical sciences and diplomatic policy',
    nextMilestone: 'Select modules aligned with MUN and automotive mechanics',
    joinDate: '2026-02-01',
    notes: 'Took part in Model United Nations (MUN). Enthusiastic about complex global mechanisms.',
    totalMinutes: 30,
    hobbies: ['History', 'Cars', 'Chess', 'Watching Football'],
    favSubjects: ['History', 'Physics'],
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=60', // Porsche/Car
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&auto=format&fit=crop&q=60', // Chess
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=60', // Football
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&auto=format&fit=crop&q=60', // France/Paris
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&auto=format&fit=crop&q=60', // MUN/Conference
    ],
    scratchpad: 'Drafting introduction email and syllabus overview for Kimi. Highlight Mechanics and Middle East Area Studies modules.',
    email: 'kimi.wang@student.milestone.hu',
    skeddaLink: 'https://milestone.skedda.com/booking?space=mentor-room-1',
    suggestedModules: ['26/1 - Mechanics', '26/1 - World Politics and Area Studies: The Middle East', '26/1 - Engineering Lab: 3D Printing'],
    nextMeetingPreference: 'Next week Monday at 5:00 PM',
  },
  {
    id: 'julia',
    name: 'Benkó Júlia Franciska',
    yearGroup: 'Sophomore',
    avatar: 'Compass',
    subject: 'Physics & Engineering Basics',
    color: '#ec4899', // premium pink
    bgClass: 'bg-pink-500',
    level: 4,
    xp: 680,
    xpToNext: 800,
    streak: 3,
    badges: [],
    goal: 'Attend Oxford Summer Program next year (MIT Builders)',
    longTermGoal: 'Master basics of physics, programming, aerodynamics, and car electrical architecture',
    nextMilestone: 'Review syllabus for technical foundations and submit choice forms',
    joinDate: '2026-01-15',
    notes: 'Highly organized, detail-oriented. Studied in the US. Dislikes history, literature, biology, and chemistry. Loves hands-on building, legos, sewing pants, and painting.',
    totalMinutes: 30,
    hobbies: ['Pilates', 'Sewing & Building', 'Legos', 'Painting', 'F1 Racing', 'Traveling'],
    favSubjects: ['Mathematics', 'Physics'],
    images: [
      'https://images.unsplash.com/photo-1581092160323-7eb475513152?w=400&auto=format&fit=crop&q=60', // Building/Engineering
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=60', // Painting/Arts
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=60', // Pilates/Fitness
      'https://images.unsplash.com/photo-1532974297617-c0f05fe4812b?w=400&auto=format&fit=crop&q=60', // Oxford/UK
      'https://images.unsplash.com/photo-1611416517780-eff3a13b0359?w=400&auto=format&fit=crop&q=60', // Legos/Blocks
    ],
    scratchpad: 'Draft: Review Mechanics and Intro to Programming options with Julia. Double-check her schedule preferences since Tuesday 4-5 is blocked.',
    email: 'julia.benko@student.milestone.hu',
    skeddaLink: 'https://milestone.skedda.com/booking?space=mentor-room-1',
    suggestedModules: ['26/1 - Mechanics', '26/1 - Introduction to Programming', '26/1 - Engineering Lab: 3D Printing'],
    nextMeetingPreference: 'Mondays after 4:00 PM (Tuesdays blocked 4-5)',
  },
  {
    id: 'rui',
    name: 'Huang Rui',
    yearGroup: 'Sophomore',
    avatar: 'Terminal',
    subject: 'Computer Science & Languages',
    color: '#8b5cf6', // violet
    bgClass: 'bg-violet-500',
    level: 3,
    xp: 520,
    xpToNext: 700,
    streak: 4,
    badges: [],
    goal: 'Explore programming, US law, and debating disciplines',
    longTermGoal: 'Leverage strong logical aptitude across interdisciplinary tech and law sectors',
    nextMilestone: 'Confirm module registration for immersion pathways',
    joinDate: '2026-02-10',
    notes: 'Loves Rubik\'s cube, traveling, math, physics, biology, and IT. Intrigued by law, humanities, and debating.',
    totalMinutes: 30,
    hobbies: ['Programming', 'Languages', 'US Law', 'Rubik\'s Cube', 'Traveling', 'Debating'],
    favSubjects: ['Mathematics', 'English', 'Physics', 'Biology', 'IT'],
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60', // Code
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=60', // Law/Scales
      'https://images.unsplash.com/photo-1595052951718-202c3b2e5648?w=400&auto=format&fit=crop&q=60', // Cube
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&auto=format&fit=crop&q=60', // Travel
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=60', // Debating/Group
    ],
    scratchpad: 'Drafting response for Rui: Recommend Introduction to Programming and Good and Evil (Law/Humanities module). Prepare custom practice files.',
    email: 'rui.huang@student.milestone.hu',
    skeddaLink: 'https://milestone.skedda.com/booking?space=mentor-room-1',
    suggestedModules: ['26/1 - Introduction to Programming', '26/1 - Good and Evil', '26/1 - Human Nature'],
    nextMeetingPreference: 'Tuesdays 4:30 PM onwards (Sundays / Saturday PM also free)',
  },
  {
    id: 'mingdao',
    name: 'Li Mingdao',
    yearGroup: 'Freshman',
    avatar: 'Sparkles',
    subject: 'Mathematics & Gen AI',
    color: '#10b981', // emerald
    bgClass: 'bg-emerald-500',
    level: 2,
    xp: 310,
    xpToNext: 500,
    streak: 1,
    badges: [],
    goal: 'Win Gold Medal in International Math Olympiad (TIM contest)',
    longTermGoal: 'Study Computer Science at MIT, found a generative AI startup company',
    nextMilestone: 'Deepen knowledge in polynomial/non-polynomial logic and advanced Gen AI architectures',
    joinDate: '2026-04-10',
    notes: 'Brilliant student, highly conversant in AI (pros/cons, NP-completeness, jailbreaking, cybersecurity). Knows C++ and participated in Codeforces. Enjoys Roblox, outdoor mountain climbing, running, research, and philosophy. Dislikes dangerous sports like football.',
    totalMinutes: 30,
    hobbies: ['Gen AI & Cybersec', 'Roblox', 'Research & Philosophy', 'Mountain Climbing', 'Running', 'Road Trips'],
    favSubjects: ['Mathematics', 'Computer Science'],
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=60', // Gen AI / Brain
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=60', // Abstract Tech/Math
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=60', // Mountain Climbing
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=60', // Running/Road
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=60', // Futuristic/MIT
    ],
    scratchpad: 'Draft: Acknowledge outstanding grasp of AI concepts from our icebreaker. Discuss TIM math contest roadmap and suggest pure logic / philosophical modules.',
    email: 'mingdao.li@student.milestone.hu',
    skeddaLink: 'https://milestone.skedda.com/booking?space=mentor-room-1',
    suggestedModules: ['26/1 - Introduction to Programming', '26/1 - Differentiation', '26/1 - Biomedical Ethics'],
    nextMeetingPreference: 'Mondays are completely free',
  },
];

// ─── INITIAL LOCAL STORAGE LOGS ──────────────────────────────────────────────

export const defaultSessions: Session[] = [
  {
    id: 's-m1',
    menteeId: 'mingdao',
    sessionNumber: 1,
    date: '2026-05-12',
    time: '16:00',
    duration: 30,
    topic: 'Icebreaker & 5 Images Activity',
    notes: 'Initial icebreaker session. Discussed extensive passion for Gen AI, cybersecurity, and NP problems. Reviewed ambition for Math Olympiad gold and founding an AI startup.',
    achievements: 'Demonstrated superb theoretical awareness of polynomial models and AI jailbreaking.',
    nextSteps: 'Outline a precise prep path for the TIM math contest and suggest non-core enrichment modules.',
    completed: true,
  },
  {
    id: 's-t1',
    menteeId: 'tianle',
    sessionNumber: 1,
    date: '2026-05-11',
    time: '17:00',
    duration: 30,
    topic: 'Introductory Icebreaker Session',
    notes: 'Covered study goals for Western Europe (France/Germany/Switzerland). Shared interest in automotive mechanics, history, and football.',
    achievements: 'Solid communication skills and structured thinking shown through MUN references.',
    nextSteps: 'Send formal intro email outlining the Mechanics and Middle East modules.',
    completed: true,
  },
  {
    id: 's-j1',
    menteeId: 'julia',
    sessionNumber: 1,
    date: '2026-05-11',
    time: '16:30',
    duration: 30,
    topic: 'Icebreaker & Digital Dossier Profile',
    notes: 'Reviewed detailed hobbies: F1, painting, sewing, and legos. Confirmed goal for the Oxford MIT builders program.',
    achievements: 'Expressed profound curiosity about automotive electrical architectures.',
    nextSteps: 'Finalize selection for Mechanics or Intro to Programming; confirm Monday after 4pm availability.',
    completed: true,
  },
  {
    id: 's-r1',
    menteeId: 'rui',
    sessionNumber: 1,
    date: '2026-05-12',
    time: '16:30',
    duration: 30,
    topic: 'Icebreaker & Pathway Planning',
    notes: 'Explored strong alignment with math, English, and US law. Enthusiastic about logic puzzles and the Rubik\'s cube.',
    achievements: 'Highly articulate regarding interdisciplinary connections between IT systems and law.',
    nextSteps: 'Verify schedule alignment for Tuesday afternoons and draft module motivation responses.',
    completed: true,
  },
];

// ─── INITIAL TASKS ───────────────────────────────────────────────────────────

export const defaultTasks: Task[] = [
  {
    id: 't-1',
    menteeId: 'tianle',
    title: 'Review Syllabus Catalogue',
    description: 'Browse available modules focusing on Physics/Engineering or Area Studies.',
    dueDate: '2026-05-17',
    completed: false,
    priority: 'high',
    category: 'Advising',
  },
  {
    id: 't-2',
    menteeId: 'julia',
    title: 'Module Choice Submission',
    description: 'Ensure official module choice form and motivation form are completed by deadline.',
    dueDate: '2026-05-19',
    completed: false,
    priority: 'high',
    category: 'Forms',
  },
  {
    id: 't-3',
    menteeId: 'rui',
    title: 'Motivation Form Submission',
    description: 'Fill out Google Forms for registered modules in Syllabus Catalogue.',
    dueDate: '2026-05-19',
    completed: false,
    priority: 'high',
    category: 'Forms',
  },
  {
    id: 't-4',
    menteeId: 'mingdao',
    title: 'Advanced AI Reading',
    description: 'Optional deep dive into Gen AI research architectures.',
    dueDate: '2026-05-25',
    completed: true,
    completedDate: '2026-05-13',
    priority: 'medium',
    category: 'Research',
  },
];

// ─── FIXED EV FINANCE TRACKER (MILESTONE MENTOR) ─────────────────────────────

export const defaultSalary: MonthlySalary = {
  total: 840000,
  currency: 'HUF',
  payments: [
    {
      id: 'p-1',
      amount: 277200,
      dueDate: '2026-08-30',
      received: false,
      description: '1st Installment (Summer Term Payout — 33% of gross contract)',
    },
    {
      id: 'p-2',
      amount: 285600,
      dueDate: '2026-12-30',
      received: false,
      description: '2nd Installment (Autumn Term Payout — 34% of gross contract)',
    },
    {
      id: 'p-3',
      amount: 277200,
      dueDate: '2027-04-30',
      received: false,
      description: '3rd Installment (Spring Term Payout — 33% of gross contract)',
    },
  ],
};

// ─── INITIAL CALENDAR DEADLINES ──────────────────────────────────────────────

export const defaultCalendarEvents: CalendarEvent[] = [
  {
    id: 'ev-shop1',
    date: '2026-05-15',
    title: 'Shopping Lectures (Day 1)',
    type: 'deadline',
    color: '#f59e0b',
    description: 'Encourage students to sample potential modules to gauge difficulty levels.',
  },
  {
    id: 'ev-shop2',
    date: '2026-05-16',
    title: 'Shopping Lectures (Day 2)',
    type: 'deadline',
    color: '#f59e0b',
    description: 'Final opportunity for mentees to participate in live subject exploration.',
  },
  {
    id: 'ev-dead1',
    date: '2026-05-19',
    title: 'CRITICAL: Module Choice Deadline',
    type: 'deadline',
    color: '#dc2626', // strong red
    time: '23:59',
    description: 'Compulsory deadline to complete both personalized Module Choice Forms and Module-specific Google Motivation Forms.',
  },
  {
    id: 'ev-pref',
    date: '2026-05-26',
    title: 'Group Preference Forms Due',
    type: 'deadline',
    color: '#6366f1',
    description: 'Ensure secondary scheduling configurations are aligned for selected subjects.',
  },
  {
    id: 'ev-start',
    date: '2026-06-01',
    title: 'Summer Teaching Period Starts',
    type: 'deadline',
    color: '#10b981',
    description: 'Official commencement of summer academic instruction and consistent mentor log schedules.',
  },
];

// ─── LOCAL STORAGE INITIALIZERS ──────────────────────────────────────────────

export const STORAGE_KEYS = {
  MENTEES: 'milestone_os_mentees_v1',
  SESSIONS: 'milestone_os_sessions_v1',
  TASKS: 'milestone_os_tasks_v1',
  CALENDAR: 'milestone_os_calendar_v1',
};

export function initializeLocalStorageState() {
  if (typeof window === 'undefined') return;

  // Initialize Mentees
  const storedMentees = localStorage.getItem(STORAGE_KEYS.MENTEES);
  if (!storedMentees) {
    localStorage.setItem(STORAGE_KEYS.MENTEES, JSON.stringify(defaultMentees));
  } else {
    // Merge or verify missing keys on existing profiles
    try {
      const parsed: Mentee[] = JSON.parse(storedMentees);
      const updated = parsed.map((p) => {
        const base = defaultMentees.find((d) => d.id === p.id);
        return {
          ...base,
          ...p,
          // ensure arrays or structures aren't broken
          hobbies: p.hobbies || base?.hobbies || [],
          images: p.images || base?.images || [],
          totalMinutes: p.totalMinutes ?? base?.totalMinutes ?? 0,
        };
      });
      localStorage.setItem(STORAGE_KEYS.MENTEES, JSON.stringify(updated));
    } catch {
      localStorage.setItem(STORAGE_KEYS.MENTEES, JSON.stringify(defaultMentees));
    }
  }

  // Initialize Sessions
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(defaultSessions));
  }

  // Initialize Tasks
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(defaultTasks));
  }

  // Initialize Calendar Events
  if (!localStorage.getItem(STORAGE_KEYS.CALENDAR)) {
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(defaultCalendarEvents));
  }
}
