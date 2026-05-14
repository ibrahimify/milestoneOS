import type { Mentee, Session, Task, CalendarEvent } from '@/types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function getDayName(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long' });
}

// Returns 0-100 percentage of XP progress toward next level
export function getXPPercentage(xp: number, xpToNext: number, level: number): number {
  const thresholds = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800];
  const base = thresholds[level - 1] ?? 0;
  const target = xpToNext;
  const progress = xp - base;
  const needed = target - base;
  return Math.min(100, Math.round((progress / needed) * 100));
}

export function getLevelColor(level: number): string {
  if (level <= 2) return '#cd7f32'; // bronze
  if (level <= 4) return '#9ca3af'; // silver
  if (level <= 6) return '#f59e0b'; // gold
  if (level <= 8) return '#10b981'; // emerald
  return '#60a5fa'; // diamond
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: 'Beginner',
    2: 'Apprentice',
    3: 'Learner',
    4: 'Practitioner',
    5: 'Achiever',
    6: 'Expert',
    7: 'Master',
    8: 'Champion',
    9: 'Legend',
    10: 'Grandmaster',
  };
  return titles[level] ?? 'Grandmaster';
}

export function getMenteeById(
  mentees: Mentee[],
  id: string,
): Mentee | undefined {
  return mentees.find((m) => m.id === id);
}

export function getSessionsForMentee(sessions: Session[], menteeId: string): Session[] {
  return sessions.filter((s) => s.menteeId === menteeId);
}

export function getTasksForMentee(tasks: Task[], menteeId: string): Task[] {
  return tasks.filter((t) => t.menteeId === menteeId);
}

export function getEventsForDate(events: CalendarEvent[], date: string): CalendarEvent[] {
  return events.filter((e) => e.date === date);
}

// Returns a 2D array [week][day] of date strings for a given month
// weekday index: 0=Mon … 6=Sun
export function getMonthCalendar(year: number, month: number): (string | null)[][] {
  const firstDay = new Date(year, month - 1, 1);
  // getDay() returns 0=Sun..6=Sat, convert to Mon=0..Sun=6
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const daysInMonth = new Date(year, month, 0).getDate();
  const weeks: (string | null)[][] = [];
  let week: (string | null)[] = Array(startDow).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    week.push(iso);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

export function isToday(iso: string): boolean {
  const today = new Date();
  const d = new Date(iso + 'T00:00:00');
  return (
    today.getFullYear() === d.getFullYear() &&
    today.getMonth() === d.getMonth() &&
    today.getDate() === d.getDate()
  );
}

export function isPast(iso: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(iso + 'T00:00:00');
  return d < today;
}

export function taskCompletionRate(tasks: Task[]): number {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100);
}
