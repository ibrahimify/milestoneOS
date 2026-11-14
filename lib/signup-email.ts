import 'server-only';
import { createClient } from '@supabase/supabase-js';

export async function notifySignups(userId?: string) {
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SECRET_KEY: key,
    RESEND_API_KEY: apiKey, SIGNUP_EMAIL_FROM: from, SIGNUP_EMAIL_TO: to, APP_URL: appUrl } = process.env;
  if (!url || !key || !apiKey || !from || !to || !appUrl) return false;

  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  let query = client.from('signup_notifications')
    .select('user_id, profiles!inner(nickname,email)').is('sent_at', null).order('created_at').limit(50);
  if (userId) query = query.eq('user_id', userId);
  const { data, error } = await query;
  if (error) return false;

  let delivered = true;
  for (const item of data) {
    const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
          'Idempotency-Key': 'mentor-signup/' + item.user_id,
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: 'New Milestone OS access request',
          text: profile.nickname + ' (' + profile.email + ') requested an account.\n\nReview the request at ' + new URL('/?view=admin', appUrl),
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) {
        delivered = false;
        continue;
      }
      const result = await client.from('signup_notifications')
        .update({ sent_at: new Date().toISOString() }).eq('user_id', item.user_id);
      if (result.error) delivered = false;
    } catch {
      delivered = false;
    }
  }
  return delivered;
}
