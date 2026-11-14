'use server';

import { after } from 'next/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { notifySignups } from '@/lib/signup-email';

export interface AuthResult { error?: string; message?: string }

export async function authenticate(_: AuthResult, form: FormData): Promise<AuthResult> {
  const mode = form.get('mode');
  const email = z.email().max(254).safeParse(String(form.get('email') || '').trim());
  const password = String(form.get('password') || '');
  const client = await supabase();

  if (mode === 'update') {
    if (password.length < 10 || password.length > 72) return { error: 'Use 10 to 72 characters.' };
    const { error } = await client.auth.updateUser({ password });
    if (error) return { error: 'Could not update the password. Request a new reset link and try again.' };
    redirect('/');
  }

  if (!email.success) return { error: 'Enter a valid email address.' };
  if (mode === 'reset') {
    const { error } = await client.auth.resetPasswordForEmail(email.data);
    if (error && error.status === 429) return { error: 'Please wait before requesting another link.' };
    return { message: 'If an account exists for that email, a reset link will arrive shortly.' };
  }

  if (mode === 'signup') {
    const nickname = z.string().trim().min(1).max(60).safeParse(form.get('nickname'));
    if (!nickname.success) return { error: 'Enter the name you want us to use.' };
    if (password.length < 10 || password.length > 72) return { error: 'Use 10 to 72 characters.' };
    const { data, error } = await client.auth.signUp({
      email: email.data,
      password,
      options: { data: { nickname: nickname.data } },
    });
    if (error) {
      if (error.status === 429) return { error: 'Please wait before sending another request.' };
      return { error: 'Could not request access. Check your details and try again.' };
    }
    const user = data.user;
    if (user && user.identities?.length) after(() => notifySignups(user.id));
    return { message: 'Check your email to verify your address. An administrator will review your request.' };
  }

  if (mode !== 'signin' || !password || password.length > 72) return { error: 'Enter your email and password.' };
  const { error } = await client.auth.signInWithPassword({ email: email.data, password });
  if (error) {
    return { error: error.code === 'email_not_confirmed'
      ? 'Verify your email before signing in.'
      : 'Could not sign in. Check your email and password.' };
  }
  redirect(form.get('view') === 'admin' ? '/?view=admin' : '/');
}

export async function signOut() {
  const client = await supabase();
  await client.auth.signOut({ scope: 'local' });
  redirect('/');
}

export async function changeNickname(nickname: string) {
  const parsed = z.string().trim().min(1).max(60).safeParse(nickname);
  if (!parsed.success) return { error: 'Enter a nickname between 1 and 60 characters.' };
  const client = await supabase();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return { error: 'Sign in again to update your nickname.' };
  const { data, error } = await client.from('profiles').update({ nickname: parsed.data })
    .eq('id', user.id).select('id').maybeSingle();
  if (error?.code === '42501') return { error: 'Nickname updates are unavailable. Contact your workspace administrator.' };
  if (error || !data) return { error: 'Could not update your nickname.' };
  revalidatePath('/');
  return {};
}

export async function changePassword(current: string, password: string, confirmation: string) {
  if (!z.string().min(1).max(72).safeParse(current).success) return { error: 'Enter your current password.' };
  if (!z.string().min(10).max(72).safeParse(password).success) return { error: 'Use 10 to 72 characters for your new password.' };
  if (password !== confirmation) return { error: 'The new passwords do not match.' };
  const client = await supabase();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return { error: 'Sign in again to change your password.' };
  const { error } = await client.auth.updateUser({ current_password: current, password });
  if (error?.code === 'reauthentication_needed') return { error: 'Sign out and sign back in, then try again.' };
  if (error?.code === 'same_password') return { error: 'Choose a different password.' };
  if (error?.code === 'invalid_credentials' || error?.code === 'current_password_invalid') return { error: 'The current password is incorrect.' };
  if (error) return { error: 'Could not change your password. Check your current password and try again.' };
  return {};
}
