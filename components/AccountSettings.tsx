import { useState } from 'react';
import { changeNickname, changePassword } from '@/app/auth/actions';
import { Dialog, Field, RecordForm } from './Forms';

export default function AccountSettings({ nickname, close }: { nickname: string; close: () => void }) {
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  return <Dialog title="Account settings" close={() => { if (!pending) close(); }}>
    <div className="segmented mt-4" role="group" aria-label="Account settings sections">
      <button type="button" disabled={pending} aria-pressed={tab === 'profile'} onClick={() => { setTab('profile'); setMessage(''); }}>Profile</button>
      <button type="button" disabled={pending} aria-pressed={tab === 'password'} onClick={() => { setTab('password'); setMessage(''); }}>Password</button>
    </div>
    {tab === 'profile' ? <RecordForm key="profile" onPendingChange={setPending} submitLabel="Save nickname"
      save={async ({ nickname }) => {
        setMessage('');
        const result = await changeNickname(nickname);
        if (!result.error) setMessage('Nickname updated.');
        return result;
      }} complete={() => {}}>
      <Field name="nickname" label="Nickname" value={nickname} limit={60} autoComplete="nickname" required />
    </RecordForm> : <RecordForm key="password" onPendingChange={setPending} submitLabel="Change password"
      save={async ({ current, password, confirmation }) => {
        setMessage('');
        const result = await changePassword(current, password, confirmation);
        if (!result.error) setMessage('Password updated.');
        return result;
      }}>
      <Field name="current" label="Current password" type="password" autoComplete="current-password" limit={72} required />
      <Field name="password" label="New password" type="password" autoComplete="new-password" minLength={10} limit={72} required />
      <Field name="confirmation" label="Confirm new password" type="password" autoComplete="new-password" minLength={10} limit={72} required />
    </RecordForm>}
    {message && <p className="muted mt-3" role="status">{message}</p>}
  </Dialog>;
}
