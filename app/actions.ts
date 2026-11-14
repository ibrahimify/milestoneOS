'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { currencies, eventCategories, yearGroups } from '@/types';
import { moduleFields, readModuleChoices, type ModuleField } from '@/lib/mentee-modules';

const text = (max = 6000) => z.string().trim().max(max);
const required = (max = 160) => text(max).min(1);
const blankOr = (schema: z.ZodType<string>) => z.union([z.literal(''), schema]);
const url = blankOr(z.url({ protocol: /^https?$/ }).max(2048));
const id = z.uuid();
const date = z.iso.date();
const minutes = z.number().int().min(1).max(1440);
const schemas = {
  mentees: z.object({
    name: required(120), year_group: z.enum(yearGroups), subject: text(160),
    email: blankOr(z.email().max(254)), phone: text(50), skedda_link: url, goal: text(),
    long_term_goal: text(), interests: text(), preferences: text(), next_milestone: text(),
    module_guidance: text(), recommended_modules: text(), selected_modules: text(),
    notes: text(), scratchpad: text(),
  }),
  sessions: z.object({
    mentee_id: id, date, duration: minutes, topic: required(), notes: text(),
    next_action: text(), follow_up: date.nullable(),
  }),
  calendar_events: z.object({
    mentee_id: id.nullable(), title: required(), date, start_at: z.iso.datetime().nullable(),
    duration: minutes, description: text(), category: z.enum(eventCategories), shared: z.boolean(),
  }).refine((event) => !event.shared || !event.mentee_id, 'Shared events cannot reference private mentees'),
  finance_settings: z.object({
    gross: z.number().min(0).max(999999999999), tax_rate: z.number().min(0).max(100),
    currency: z.enum(currencies),
  }),
  payments: z.object({
    description: required(), amount: z.number().positive().max(999999999999), due_date: date,
  }),
  module_categories: z.object({ name: required(80) }),
  modules: z.object({
    title: required(), category_id: id, division: text(160), faculty: text(160),
    description: text(), form_link: url,
  }),
};

export type RecordTable = keyof typeof schemas;
export type ActionResult = { id?: string; error?: string };

async function getWorkspaceClient() {
  const client = await supabase();
  const result = await client.rpc('workspace_access');
  return result.data === true ? client : null;
}

export async function saveRecord(table: RecordTable, input: unknown, recordId?: string): Promise<ActionResult> {
  if (!Object.hasOwn(schemas, table) || (recordId !== undefined && !id.safeParse(recordId).success)) {
    return { error: 'Invalid record.' };
  }
  const schema = table === 'mentees' && recordId
    ? schemas.mentees.omit({ recommended_modules: true, selected_modules: true }).partial()
    : schemas[table];
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: 'Check ' + String(parsed.error.issues[0]?.path[0] || 'the form') + ' and try again.' };
  const client = await getWorkspaceClient();
  if (!client) return { error: 'An approved account is required.' };
  if (table === 'finance_settings') {
    const { error } = await client.from(table).upsert(parsed.data as Record<string, unknown>, { onConflict: 'owner_id' });
    if (error) return { error: 'Could not save finance settings.' };
    revalidatePath('/');
    return {};
  }
  const values: Record<string, unknown> = parsed.data;
  const query = recordId
    ? client.from(table).update(values).eq('id', recordId)
    : client.from(table).insert(values);
  const { data, error } = await query.select('id').maybeSingle();
  if (error?.code === '23505') return { error: 'That record already exists.' };
  if (error || !data) return { error: 'Could not save this record. Check your access and try again.' };
  revalidatePath('/');
  return { id: data.id };
}

export async function deleteRecord(table: Exclude<RecordTable, 'finance_settings'>, recordId: string): Promise<ActionResult> {
  if (!Object.hasOwn(schemas, table) || String(table) === 'finance_settings' || !id.safeParse(recordId).success) {
    return { error: 'Invalid record.' };
  }
  const client = await getWorkspaceClient();
  if (!client) return { error: 'An approved account is required.' };
  const { data, error } = await client.from(table).delete().eq('id', recordId).select('id').maybeSingle();
  if (error?.code === '23503') return { error: 'Move or delete the modules in this category first.' };
  if (error || !data) return { error: 'Could not delete this record.' };
  revalidatePath('/');
  return {};
}

export async function saveModuleChoices(menteeId: string, field: ModuleField, choices: string[]): Promise<ActionResult> {
  const parsed = z.array(id).max(1000).safeParse(choices);
  if (!id.safeParse(menteeId).success || !moduleFields.includes(field) || !parsed.success) return { error: 'Invalid module selection.' };
  const client = await getWorkspaceClient();
  if (!client) return { error: 'An approved account is required.' };

  const [mentee, catalogue] = await Promise.all([
    client.from('mentees').select('recommended_modules,selected_modules').eq('id', menteeId).maybeSingle(),
    client.from('modules').select('id,title'),
  ]);
  if (!mentee.data || catalogue.error) return { error: 'Could not load the module choices.' };
  const available = new Set(catalogue.data.map(({ id }) => id));
  if (parsed.data.some((id) => !available.has(id))) return { error: 'The catalogue changed. Refresh and pick the available modules again.' };

  const previous = mentee.data[field];
  const { earlier } = readModuleChoices(previous, catalogue.data);
  const next = JSON.stringify([...new Set(parsed.data), ...earlier]);
  if (next.length > 6000) return { error: 'This module list is too long.' };
  const { data, error } = await client.from('mentees').update({ [field]: next })
    .eq('id', menteeId).eq(field, previous).select('id').maybeSingle();
  if (error || !data) return { error: 'Could not save the module list. Refresh and try again.' };
  revalidatePath('/');
  return { id: data.id };
}

export async function settlePayment(recordId: string, received: boolean): Promise<ActionResult> {
  if (!id.safeParse(recordId).success || typeof received !== 'boolean') return { error: 'Invalid payment.' };
  const client = await getWorkspaceClient();
  if (!client) return { error: 'An approved account is required.' };
  const { data, error } = await client.from('payments')
    .update({ received_at: received ? new Date().toISOString() : null }).eq('id', recordId).select('id').maybeSingle();
  if (error || !data) return { error: 'Could not update this payment.' };
  revalidatePath('/');
  return {};
}

export async function toggleFollowUp(sessionId: string, complete: boolean, action: string, due: string | null): Promise<ActionResult> {
  if (!id.safeParse(sessionId).success || typeof complete !== 'boolean' ||
    !text().safeParse(action).success || !date.nullable().safeParse(due).success || (!action.trim() && !due)) {
    return { error: 'This session has no follow-up to update.' };
  }
  const client = await getWorkspaceClient();
  if (!client) return { error: 'An approved account is required.' };
  const query = client.from('sessions').update({ follow_up_completed_at: complete ? new Date().toISOString() : null })
    .eq('id', sessionId).eq('next_action', action);
  const match = due ? query.eq('follow_up', due) : query.is('follow_up', null);
  const { data, error } = await match.select('id').maybeSingle();
  if (error?.code === 'PGRST204' || error?.code === '42703') return { error: 'Apply the follow-up migration in Supabase to enable completion.' };
  if (error || !data) return { error: 'Could not update this follow-up. Refresh and try again.' };
  revalidatePath('/');
  return {};
}

export async function reviewMentor(mentorId: string, decision: string): Promise<ActionResult> {
  if (!id.safeParse(mentorId).success || !['approved', 'rejected', 'suspended'].includes(decision)) {
    return { error: 'Invalid decision.' };
  }
  const client = await getWorkspaceClient();
  if (!client) return { error: 'Administrator access is required.' };
  const { error } = await client.rpc('review_mentor', { mentor_id: mentorId, decision });
  if (error) return { error: error.code === '22023' ? error.message : 'Could not update this account.' };
  revalidatePath('/');
  return {};
}
