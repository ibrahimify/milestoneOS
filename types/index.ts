export type AppView =
  | 'login'
  | 'dashboard'
  | 'mentee-detail'
  | 'calendar'
  | 'tasks'
  | 'sessions'
  | 'salary';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

export interface Session {
  id: string;
  menteeId: string;
  sessionNumber?: number;
  date: string; // ISO date YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  topic: string;
  notes: string; // summary / notes
  achievements?: string;
  nextSteps?: string;
  completed: boolean;
}

export interface Task {
  id: string;
  menteeId: string;
  title: string;
  description: string;
  dueDate: string; // ISO date YYYY-MM-DD
  completed: boolean;
  completedDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface Mentee {
  id: string;
  name: string;
  yearGroup: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  avatar: string; // Lucide icon identifier string (e.g. 'Atom', 'Compass', etc.)
  subject: string;
  color: string; // hex color
  bgClass: string; // tailwind bg class
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  badges: Badge[];
  goal: string;
  longTermGoal?: string;
  nextMilestone: string;
  joinDate: string;
  notes: string;
  totalMinutes: number;
  hobbies: string[];
  favSubjects?: string[];
  images: string[]; // 5 image slots
  scratchpad: string;
  email: string;
  skeddaLink: string;
  suggestedModules?: string[];
  selectedModules?: string[];
  status?: string;
  dislikes?: string[];
  meetingSchedule?: string;
  moduleGuidance?: string;
  nextMeetingPreference?: string;
}

export interface SalaryPayment {
  id: string;
  amount: number; // in HUF
  dueDate: string; // ISO date
  received: boolean;
  receivedDate?: string;
  description: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  title: string;
  type: 'session' | 'task' | 'payment' | 'deadline';
  menteeId?: string;
  color: string;
  time?: string;
  description?: string;
}

export interface MonthlySalary {
  total: number;
  currency: string;
  payments: SalaryPayment[];
}

export interface ModuleSyllabus {
  code: string;
  title: string;
  division: string;
  coreFor: string;
  formLink: string;
  teacher: string;
  level: string;
}
