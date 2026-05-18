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
    subject: 'History, geopolitics, automobiles',
    color: '#3b82f6', // bright blue
    bgClass: 'bg-blue-500',
    level: 3,
    xp: 450,
    xpToNext: 600,
    streak: 2,
    badges: [],
    status: 'FIRST MEETING COMPLETED',
    goal: 'Study abroad in France, Germany, or Switzerland and build deeper knowledge in history, geopolitics, and international exposure.',
    longTermGoal: 'International study path with strong political, historical, and diplomatic awareness.',
    nextMilestone: 'Confirm module selection before the May 19, 2026 23:59 deadline.',
    joinDate: '2026-02-01',
    notes: 'First meeting completed May 11, 2026, 5:00-5:30 PM. Icebreaker images showed interests in history, cars, competitive activities, and international study. Engaged, thoughtful, proactive communicator who emailed twice before meeting. Good fit for international and political modules.',
    totalMinutes: 30,
    hobbies: ['History', 'Cars', 'Chess', 'Football', 'Model United Nations', 'Travel'],
    favSubjects: ['History', 'Geopolitics'],
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=60', // Porsche/Car
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&auto=format&fit=crop&q=60', // Chess
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=60', // Football
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&auto=format&fit=crop&q=60', // France/Paris
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&auto=format&fit=crop&q=60', // MUN/Conference
    ],
    scratchpad: 'Push him toward World Politics for MUN skills and study abroad preparation. Watch module selection before May 19, 23:59. Offer multiple times for next meeting.',
    email: 'kimi.wang@student.milestone.hu',
    skeddaLink: 'https://milestone.skedda.com/booking?space=mentor-room-1',
    suggestedModules: ['26/1 - Historiography', '26/1 - World Politics and Area Studies: The Middle East', '26/1 - State Theory'],
    selectedModules: [],
    meetingSchedule: 'First meeting: May 11, 2026 (Sunday) 5:00-5:30 PM - DONE. Next meeting: TBD. Availability: flexible, offer multiple times.',
    moduleGuidance: 'Historiography for direct history interest. World Politics and Area Studies for MUN background and international studies preparation. State Theory for politics and MUN development.',
    nextMeetingPreference: 'TBD - coordinate flexible options',
  },
  {
    id: 'julia',
    name: 'Benkó Júlia Franciska',
    yearGroup: 'Sophomore',
    avatar: 'Compass',
    subject: 'Mathematics, physics, making',
    color: '#ec4899', // premium pink
    bgClass: 'bg-pink-500',
    level: 4,
    xp: 680,
    xpToNext: 800,
    streak: 3,
    badges: [],
    status: 'FIRST MEETING SCHEDULED',
    goal: 'Prepare for Oxford summer program next year on the MIT builders track through physics, programming, aerodynamics, and practical making.',
    longTermGoal: 'Build practical engineering, AI, and maker skills while understanding electricity in cars and physics fundamentals.',
    nextMilestone: 'Encourage Shopping Lectures May 15-16 and finalize module choice with MIT builders goal in mind.',
    joinDate: '2026-01-15',
    notes: 'First meeting scheduled Tuesday, May 13 after 4 PM, time pending. Strong STEM focus with maker mentality. Not traditional engineering; prefers applied building. Organized, goal-oriented personality. F1 interest connects naturally to physics and aerodynamics.',
    totalMinutes: 0,
    hobbies: ['Mathematics', 'Physics', '3D printing', 'LEGOs', 'Woodworking', 'Painting', 'Travel', 'F1 Racing', 'Pilates'],
    dislikes: ['History', 'Literature', 'Traditional engineering', 'Biology', 'Chemistry'],
    favSubjects: ['Mathematics', 'Physics'],
    images: [
      'https://images.unsplash.com/photo-1581092160323-7eb475513152?w=400&auto=format&fit=crop&q=60', // Building/Engineering
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=60', // Painting/Arts
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=60', // Pilates/Fitness
      'https://images.unsplash.com/photo-1532974297617-c0f05fe4812b?w=400&auto=format&fit=crop&q=60', // Oxford/UK
      'https://images.unsplash.com/photo-1611416517780-eff3a13b0359?w=400&auto=format&fit=crop&q=60', // Legos/Blocks
    ],
    scratchpad: 'MIT builders program is key motivator. Align modules with that goal. 3D Printing lab is perfect for maker personality. Programming plus Mechanics equals MIT-ready skillset. Help her see the connection between F1/cars and aerodynamics.',
    email: 'julia.benko@student.milestone.hu',
    skeddaLink: 'https://milestone.skedda.com/booking?space=mentor-room-1',
    suggestedModules: ['26/1 - Introduction to Programming', '26/1 - Engineering Lab: 3D Printing', '26/1 - Mechanics', '26/1 - Differentiation'],
    selectedModules: [],
    meetingSchedule: 'First meeting: Tuesday, May 13, 2026 after 4 PM - time pending. Availability: weekday evenings after 4 PM and weekends. Shopping Lectures: encourage attendance May 15-16.',
    moduleGuidance: 'Introduction to Programming is essential for MIT builders. Engineering Lab: 3D Printing fits hands-on making. Mechanics supports physics, aerodynamics, and electricity in motion. Differentiation gives advanced math for physics applications.',
    nextMeetingPreference: 'Weekday evenings after 4 PM, weekends',
  },
  {
    id: 'rui',
    name: 'Huang Rui',
    yearGroup: 'Sophomore',
    avatar: 'Terminal',
    subject: 'Law, humanities, debate, languages',
    color: '#8b5cf6', // violet
    bgClass: 'bg-violet-500',
    level: 3,
    xp: 520,
    xpToNext: 700,
    streak: 4,
    badges: [],
    status: 'FIRST MEETING SCHEDULED',
    goal: 'Explore US law, humanities, debate, public speaking, language proficiency, travel, and international engagement.',
    longTermGoal: 'Develop a strong law and humanities profile with international awareness and debate skills.',
    nextMilestone: 'Hold first meeting and guide toward 1-2 law/politics modules without overloading.',
    joinDate: '2026-02-10',
    notes: 'First meeting scheduled Tuesday, May 13 after 4:30 PM, time pending. Proactive communicator who emailed twice and asked practical questions. Will attend Summer Kick-off May 14, 5:30-6:30 PM, and Team Building May 16, 11:00-17:00. Interested in debate, law, humanities, programming, languages, math, English, biology, physics, and IT.',
    totalMinutes: 0,
    hobbies: ['Programming', 'Languages', 'US Law', 'Rubik\'s Cube', 'Travel', 'Debate', 'Humanities'],
    favSubjects: ['Mathematics', 'English', 'Physics', 'Biology', 'IT'],
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60', // Code
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=60', // Law/Scales
      'https://images.unsplash.com/photo-1595052951718-202c3b2e5648?w=400&auto=format&fit=crop&q=60', // Cube
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&auto=format&fit=crop&q=60', // Travel
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=60', // Debating/Group
    ],
    scratchpad: 'Strong humanities interest despite math/science background. Debate interest suggests Model UN or debate club. World Politics is a good bridge between law and international studies. Monitor load: recommend 1-2 law modules per term, not all at once.',
    email: 'rui.huang@student.milestone.hu',
    skeddaLink: 'https://milestone.skedda.com/booking?space=mentor-room-1',
    suggestedModules: ['26/1 - World Politics and Area Studies: The Middle East', '26/1 - State Theory', '26/1 - Sociological Perspectives', '26/1 - Good and Evil'],
    selectedModules: [],
    meetingSchedule: 'First meeting: Tuesday, May 13, 2026 from 4:30 PM onwards - time pending. Availability: weekday afternoons 4:30+, all day Saturday/Sunday. Will attend May 14 Kick-off and May 16 Team Building.',
    moduleGuidance: 'World Politics for international law and politics. State Theory for political systems and law foundation. Sociological Perspectives for law, society, and debate skills. Good and Evil for philosophy, law, and ethics.',
    nextMeetingPreference: 'Weekday afternoons 4:30+, all day Saturday/Sunday',
  },
  {
    id: 'mingdao',
    name: 'Li Mingdao',
    yearGroup: 'Freshman',
    avatar: 'Sparkles',
    subject: 'Elite mathematics, AI research, philosophy',
    color: '#10b981', // emerald
    bgClass: 'bg-emerald-500',
    level: 2,
    xp: 310,
    xpToNext: 500,
    streak: 1,
    badges: [],
    status: 'FIRST MEETING SCHEDULED (MONDAY)',
    goal: 'Win International Math Olympiad gold, compete in TIM maths contest, reach MIT, and eventually build an AI company/startup.',
    longTermGoal: 'Elite AI researcher/founder path combining pure math, AI theory, cybersecurity, ethics, philosophy, and startup ambition.',
    nextMilestone: 'Schedule first meeting and focus this summer on Academic Writing excellence plus freshman module value.',
    joinDate: '2026-04-10',
    notes: 'First meeting scheduled Monday, time TBD. Genius-level student with extraordinary potential. Serious International Math Olympiad track. Advanced knowledge includes polynomial vs non-polynomial complexity, AI jailbreaks, ethical concerns, Codeforces, and C++. Not interested in traditional CSE; more pure math, AI theory, research, and philosophy. Needs mentoring on research opportunities, MIT strategy, startup pathway, and burnout management.',
    totalMinutes: 0,
    hobbies: ['Mathematics', 'Generative AI', 'AI cybersecurity', 'C++', 'Competitive programming', 'AI research', 'Philosophy', 'AI art', 'Mountain climbing', 'Running', 'Road trips', 'Roblox', 'Ancient Greek history'],
    dislikes: ['Dangerous traditional sports', 'Regular history'],
    favSubjects: ['Mathematics', 'Computer Science'],
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=60', // Gen AI / Brain
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=60', // Abstract Tech/Math
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=60', // Mountain Climbing
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=60', // Running/Road
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=60', // Futuristic/MIT
    ],
    scratchpad: 'Elite track: treat differently from typical Freshman. Academic Writing is foundation for papers, MIT applications, and AI research. Point him toward IMO preparation, MIT admissions timeline, AI research opportunities, and startup path. Encourage TIM maths contest. Watch for burnout. Develop philosophy and ethics angle alongside pure math.',
    email: 'mingdao.li@student.milestone.hu',
    skeddaLink: 'https://milestone.skedda.com/booking?space=mentor-room-1',
    suggestedModules: ['26/1 - Differentiation', '26/1 - Quantitative Research Methods', '26/1 - Good and Evil', '26/1 - Historiography'],
    selectedModules: [],
    meetingSchedule: 'First meeting: Monday, May 12, 2026 - time TBD, needs scheduling. Availability: free on Mondays, flexible other days. Shopping Lectures not required as Freshman but optional for curiosity.',
    moduleGuidance: 'Freshman: no summer module choice. Already has Academic Writing and Freshman Module. This summer: focus on Academic Writing; Ventures may fit startup mindset better than Magic in the Making. Sophomore 2027: Differentiation, Quantitative Research Methods, Good and Evil, Historiography.',
    nextMeetingPreference: 'Mondays free, flexible other days',
  },
];

// ─── INITIAL LOCAL STORAGE LOGS ──────────────────────────────────────────────

export const defaultSessions: Session[] = [
  {
    id: 's-t1',
    menteeId: 'tianle',
    sessionNumber: 1,
    date: '2026-05-11',
    time: '17:00',
    duration: 30,
    topic: 'First Meeting Completed',
    notes: 'Icebreaker images shared. Discussed history, cars, chess, football, Model United Nations, and study abroad goals in France, Germany, or Switzerland. Recommended Historiography, World Politics and Area Studies, and State Theory.',
    achievements: 'Engaged, thoughtful, proactive communicator. Good fit for international and political modules.',
    nextSteps: 'Coordinate next meeting and watch module selection before May 19, 2026 at 23:59.',
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
  MENTEES: 'milestone_os_mentees_v2',
  SESSIONS: 'milestone_os_sessions_v2',
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
          dislikes: p.dislikes || base?.dislikes || [],
          images: p.images || base?.images || [],
          suggestedModules: p.suggestedModules || base?.suggestedModules || [],
          selectedModules: p.selectedModules || base?.selectedModules || [],
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
