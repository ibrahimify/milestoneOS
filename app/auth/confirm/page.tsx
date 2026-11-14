import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';

async function confirm(form: FormData) {
  'use server';
  const token_hash = form.get('token_hash');
  const type = form.get('type');
  if (typeof token_hash === 'string' && (type === 'email' || type === 'recovery')) {
    const client = await supabase();
    const { error } = await client.auth.verifyOtp({ token_hash, type });
    if (!error) redirect(type === 'recovery' ? '/?reset=1' : '/');
  }
  redirect('/?auth=expired');
}

export default async function ConfirmEmail({ searchParams }: {
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}) {
  const { token_hash, type } = await searchParams;
  if (!token_hash || (type !== 'email' && type !== 'recovery')) redirect('/?auth=expired');
  const label = type === 'email' ? 'Verify email' : 'Continue to password reset';

  return <main className="entry-stage">
    <section className="verification-player">
      <div className="player-screen">
        <header className="player-status">Milestone OS</header>
        <form className="player-form" action={confirm}>
          <input type="hidden" name="token_hash" value={token_hash} />
          <input type="hidden" name="type" value={type} />
          <h1>{label}</h1>
          <button className="button primary">Continue</button>
        </form>
      </div>
    </section>
  </main>;
}
