export const yearGroups = ['Freshman', 'Sophomore', 'Junior', 'Senior'] as const;
export const eventCategories = ['Meeting', 'Deadline', 'Reminder'] as const;
export const currencies = ['HUF', 'EUR', 'USD', 'GBP'] as const;

export interface Profile {
  id: string;
  nickname: string;
  email: string;
  role: 'admin' | 'mentor';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  created_at: string;
}

export interface Mentee {
  id: string;
  name: string;
  year_group: typeof yearGroups[number];
  subject: string;
  email: string;
  phone: string;
  skedda_link: string;
  goal: string;
  long_term_goal: string;
  interests: string;
  preferences: string;
  next_milestone: string;
  module_guidance: string;
  recommended_modules: string;
  selected_modules: string;
  notes: string;
  scratchpad: string;
}

export interface Session {
  id: string;
  mentee_id: string;
  date: string;
  created_at?: string | null;
  duration: number;
  topic: string;
  notes: string;
  next_action: string;
  follow_up: string | null;
  follow_up_completed_at?: string | null;
}

export interface CalendarEvent {
  id: string;
  mentee_id: string | null;
  title: string;
  date: string;
  start_at: string | null;
  duration: number;
  description: string;
  category: typeof eventCategories[number];
  shared: boolean;
}

export interface FinanceSettings {
  gross: number;
  tax_rate: number;
  currency: typeof currencies[number];
}

export interface Payment {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  received_at: string | null;
}

export interface ModuleCategory {
  id: string;
  name: string;
}

export interface ModuleSyllabus {
  id: string;
  category_id: string;
  title: string;
  division: string;
  faculty: string;
  description: string;
  form_link: string;
}

export interface WorkspaceData {
  profile: Profile;
  mentees: Mentee[];
  sessions: Session[];
  events: CalendarEvent[];
  finance: FinanceSettings;
  payments: Payment[];
  categories: ModuleCategory[];
  modules: ModuleSyllabus[];
  accounts: Profile[];
}
