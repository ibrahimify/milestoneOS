import { z } from 'zod';
import { currencies, yearGroups } from '@/types';

const optionalText = z.string().nullish();
const optionalList = z.array(z.string()).nullish();
const legacyId = z.string().min(1).max(160);
const payment = z.object({
  id: legacyId, amount: z.number().positive(), dueDate: z.iso.date(), received: z.boolean(),
  receivedDate: optionalText, description: z.string(),
});
export const browserRecords = z.object({
  mentees: z.array(z.object({
    id: legacyId, name: z.string(), yearGroup: z.enum(yearGroups), subject: optionalText,
    email: optionalText, skeddaLink: optionalText, goal: optionalText, longTermGoal: optionalText,
    hobbies: optionalList, dislikes: optionalList, nextMilestone: optionalText, moduleGuidance: optionalText,
    suggestedModules: optionalList, selectedModules: optionalList, notes: optionalText, scratchpad: optionalText,
    meetingSchedule: optionalText, nextMeetingPreference: optionalText, favSubjects: optionalList,
    status: optionalText, joinDate: optionalText,
  })).max(1000),
  sessions: z.array(z.object({
    id: legacyId, menteeId: legacyId, date: z.iso.date(), time: optionalText, duration: z.number(),
    topic: z.string(), notes: optionalText, achievements: optionalText, nextSteps: optionalText,
  })).max(1000),
  events: z.array(z.object({
    id: legacyId, menteeId: legacyId.nullish(), date: z.iso.date(), title: z.string(),
    type: z.enum(['session', 'task', 'payment', 'deadline']), description: optionalText, time: optionalText,
  })).max(1000),
  salary: z.object({
    total: z.number().nonnegative(), currency: z.enum(currencies), payments: z.array(payment).max(1000),
  }).nullable(),
});
export type BrowserRecords = z.infer<typeof browserRecords>;

export const browserRecordKeys = {
  mentees: 'milestone_os_mentees_v2',
  sessions: 'milestone_os_sessions_v2',
  events: 'milestone_os_calendar_v1',
  salary: 'milestone_os_salary_v1',
  tasks: 'milestone_os_tasks_v1',
};

export function readBrowserRecords(storage: Storage) {
  const read = (key: string, fallback: string) => JSON.parse(storage.getItem(key) ?? fallback);
  return browserRecords.parse({
    mentees: read(browserRecordKeys.mentees, '[]'),
    sessions: read(browserRecordKeys.sessions, '[]'),
    events: read(browserRecordKeys.events, '[]'),
    salary: read(browserRecordKeys.salary, 'null'),
  });
}
