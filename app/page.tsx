import { signOut } from '@/app/auth/actions';
import IPodClassic from '@/components/IPodClassic';
import Workspace from '@/components/Workspace';
import { supabase, supabaseConfig } from '@/lib/supabase';
import type { Profile } from '@/types';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: {
  searchParams: Promise<{ reset?: string; auth?: string; view?: string }>;
}) {
  const params = await searchParams;
  if (!supabaseConfig()) return <IPodClassic unavailable />;
  const client = await supabase();
  const { data: { user } } = await client.auth.getUser();
  if (!user || params.reset === '1') {
    return <IPodClassic updating={Boolean(user && params.reset === '1')} expired={params.auth === 'expired'}
      adminEntry={params.view === 'admin'} />;
  }

  const result = await client.from('profiles').select('*').eq('id', user.id).maybeSingle();
  const profile = result.data as Profile | null;
  if (!profile || profile.status !== 'approved' || !user.email_confirmed_at) {
    const status = profile?.status;
    const message = status === 'suspended' ? 'This account is suspended.'
      : status === 'rejected' ? 'Your access request was declined.'
      : !profile ? 'We could not load your account. Try signing in again.'
      : !user.email_confirmed_at ? 'Verify your email to continue.'
      : 'An administrator is reviewing your request.';
    return <IPodClassic status={message} signOutAction={signOut} />;
  }

  const results = await Promise.all([
    client.from('mentees').select('*').order('name'),
    client.from('sessions').select('*').order('date', { ascending: false }),
    client.from('calendar_events').select('*').order('date'),
    client.from('finance_settings').select('gross,tax_rate,currency').maybeSingle(),
    client.from('payments').select('*').order('due_date'),
    client.from('module_categories').select('*').order('name'),
    client.from('modules').select('*').order('title'),
    profile.role === 'admin'
      ? client.from('profiles').select('*').eq('role', 'mentor').order('created_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);
  const resources = ['mentees', 'sessions', 'calendar events', 'finance settings', 'payments', 'module categories', 'modules', 'accounts'];
  for (const [index, { error }] of results.entries()) {
    if (!error) continue;
    console.error('Milestone OS could not load ' + resources[index], error.code, error.message);
    throw new Error('Could not load the workspace');
  }
  const [mentees, sessions, events, finance, payments, categories, modules, accounts] = results;

  return <Workspace initialView={params.view} data={{
    profile, mentees: mentees.data ?? [], sessions: sessions.data ?? [], events: events.data ?? [],
    finance: finance.data ?? { gross: 0, tax_rate: 0, currency: 'HUF' }, payments: payments.data ?? [],
    categories: categories.data ?? [], modules: modules.data ?? [], accounts: accounts.data ?? [],
  }} />;
}
