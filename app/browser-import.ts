'use server';

import { createHash } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { browserRecords } from '@/lib/browser-records';
import { supabase } from '@/lib/supabase';

const text = (value?: string | null) => value?.trim() ?? '';
const list = (value?: string[] | null) => value?.join(', ') || '';
const paragraph = (...parts: string[]) => parts.filter(Boolean).join('\n\n');
const labeled = (label: string, value?: string | null) => text(value) ? label + ': ' + text(value) : '';

export async function importBrowserRecords(input: unknown, expectedOwner: string, timezone: string) {
  const parsed = browserRecords.safeParse(input);
  if (!parsed.success) return { error: 'The browser data could not be read. Your original records are still in the browser.' };
  const client = await supabase();
  const [{ data: { user } }, { data: access }, currentFinance] = await Promise.all([
    client.auth.getUser(), client.rpc('workspace_access'), client.from('finance_settings').select('currency').maybeSingle(),
  ]);
  if (!user || user.id !== expectedOwner || access !== true) return { error: 'Sign in to the account shown in the import preview.' };
  if (currentFinance.error) return { error: 'Could not check your finance settings. Try again.' };

  const { mentees, sessions, events, salary } = parsed.data;
  const owner = user.id;
  const key = (kind: string, legacy: string) => {
    const hash = createHash('sha256').update(JSON.stringify([owner, kind, legacy])).digest('hex');
    return hash.slice(0, 8) + '-' + hash.slice(8, 12) + '-8' + hash.slice(13, 16)
      + '-8' + hash.slice(17, 20) + '-' + hash.slice(20, 32);
  };
  const UUIDs = new Map(mentees.map((item) => [item.id, key('mentee', item.id)]));
  const orphan = sessions.filter((item) => !UUIDs.has(item.menteeId)).length;
  const financeSkipped = Boolean(salary && currentFinance.data && currentFinance.data.currency !== salary.currency);
  let dateTime: Intl.DateTimeFormat;
  try {
    dateTime = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, timeZoneName: 'longOffset' });
  } catch {
    return { error: 'Your browser timezone could not be read.' };
  }
  const startAt = (date: string, time?: string | null) => {
    if (!time || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
    const nominal = date + 'T' + time + ':00';
    const zone = dateTime.formatToParts(new Date(nominal + 'Z')).find((part) => part.type === 'timeZoneName')?.value;
    return new Date(nominal + (zone?.slice(3) || 'Z')).toISOString();
  };
  const groups: { table: string; rows: Record<string, unknown>[] }[] = [
    { table: 'mentees', rows: mentees.map((m) => ({
      id: key('mentee', m.id), name: m.name, year_group: m.yearGroup, subject: text(m.subject),
      email: z.email().safeParse(m.email).success ? text(m.email) : '',
      skedda_link: /^https?:\/\//i.test(text(m.skeddaLink)) ? text(m.skeddaLink) : '',
      goal: text(m.goal), long_term_goal: text(m.longTermGoal), interests: list(m.hobbies),
      preferences: list(m.dislikes), next_milestone: text(m.nextMilestone), module_guidance: text(m.moduleGuidance),
      recommended_modules: list(m.suggestedModules), selected_modules: list(m.selectedModules),
      scratchpad: text(m.scratchpad), notes: paragraph(text(m.notes), labeled('Meeting schedule', m.meetingSchedule),
        labeled('Next meeting preference', m.nextMeetingPreference), labeled('Favourite subjects', list(m.favSubjects)),
        labeled('Status', m.status), labeled('Joined', m.joinDate),
        z.email().safeParse(m.email).success ? '' : labeled('Original email', m.email),
        /^https?:\/\//i.test(text(m.skeddaLink)) ? '' : labeled('Original scheduling link', m.skeddaLink)),
    })) },
    { table: 'sessions', rows: sessions.flatMap((s) => {
      const mentee = UUIDs.get(s.menteeId);
      return mentee ? [{
        id: key('session', s.id), mentee_id: mentee, date: s.date, duration: s.duration,
        topic: s.topic, notes: paragraph(text(s.notes), labeled('Session time', s.time), labeled('Achievements', s.achievements)),
        next_action: text(s.nextSteps),
      }] : [];
    }) },
    { table: 'calendar_events', rows: events.map((e) => ({
      id: key('calendar', e.id), mentee_id: e.menteeId ? UUIDs.get(e.menteeId) ?? null : null,
      title: e.title, date: e.date, start_at: startAt(e.date, e.time),
      category: e.type === 'session' ? 'Meeting' : e.type === 'deadline' ? 'Deadline' : 'Reminder',
      description: text(e.description),
    })) },
  ];
  if (salary && !financeSkipped) {
    if (!currentFinance.data) {
      const { error } = await client.from('finance_settings').upsert({ gross: salary.total, currency: salary.currency },
        { onConflict: 'owner_id', ignoreDuplicates: true });
      if (error) return { error: 'Could not import the finance settings. Your browser copy is still available.' };
    }
    groups.push({ table: 'payments', rows: salary.payments.map((p) => ({
      id: key('payment', p.id), description: p.description, amount: p.amount, due_date: p.dueDate,
      received_at: p.received ? startAt(z.iso.date().safeParse(p.receivedDate).success ? p.receivedDate! : p.dueDate, '12:00') : null,
    })) });
  }

  let imported = 0;
  for (const { table, rows } of groups) {
    if (!rows.length) continue;
    const { data, error } = await client.from(table).upsert(rows, { onConflict: 'id', ignoreDuplicates: true }).select('id');
    if (error) {
      console.error('Browser import failed for ' + table, error.code);
      revalidatePath('/');
      return { error: 'Could not import ' + table.replaceAll('_', ' ') + '. Earlier records may have been saved. Retrying skips records already imported.' };
    }
    imported += data.length;
  }
  revalidatePath('/');
  return { imported, orphan, financeSkipped };
}
