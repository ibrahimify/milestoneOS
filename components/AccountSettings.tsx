import { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { changeNickname, changePassword } from '@/app/auth/actions';
import { Dialog, Field, RecordForm } from './Forms';

export default function AccountSettings({ nickname, close }: { nickname: string; close: () => void }) {
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  return <Dialog title="Account settings" close={() => { if (!pending) close(); }}>
    <div className="segmented mt-4" role="group" aria-label="Account settings sections">
      <button type="button" disabled={pending} aria-pressed={tab === 'profile'} onClick={() => { if (tab !== 'profile') setSaved(false); setTab('profile'); }}>Profile</button>
      <button type="button" disabled={pending} aria-pressed={tab === 'password'} onClick={() => { if (tab !== 'password') setSaved(false); setTab('password'); }}>Password</button>
    </div>
    <div role="status" aria-atomic="true">
      {saved && <div className="account-confirmation">
        <CircleCheck size={21} aria-hidden="true" />
        <div><strong>{tab === 'profile' ? 'Nickname updated.' : 'Password updated.'}</strong>
          <p>{tab === 'profile' ? 'Your new nickname appears in the workspace greeting.' : 'Use your new password the next time you sign in.'}</p></div>
      </div>}
    </div>
    {tab === 'profile' ? <RecordForm key="profile" onPendingChange={setPending} submitLabel="Save nickname"
      save={async ({ nickname }) => {
        setSaved(false);
        const result = await changeNickname(nickname);
        if (!result.error) setSaved(true);
        return result;
      }} complete={() => {}}>
      <Field name="nickname" label="Nickname" value={nickname} limit={60} autoComplete="nickname" required />
    </RecordForm> : <RecordForm key="password" onPendingChange={setPending} submitLabel="Change password"
      save={async ({ current, password, confirmation }) => {
        setSaved(false);
        const result = await changePassword(current, password, confirmation);
        if (!result.error) setSaved(true);
        return result;
      }}>
      <Field name="current" label="Current password" type="password" autoComplete="current-password" limit={72} required />
      <Field name="password" label="New password" type="password" autoComplete="new-password" minLength={10} limit={72} required />
      <Field name="confirmation" label="Confirm new password" type="password" autoComplete="new-password" minLength={10} limit={72} required />
    </RecordForm>}
  </Dialog>;
}
