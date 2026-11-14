import { useState } from 'react';
import { Clock, Menu, UserRound } from 'lucide-react';
import AccountSettings from './AccountSettings';

export default function TopBar({ nickname, minutes, onOpen }: { nickname: string; minutes: number; onOpen: () => void }) {
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(new Date());
  const [settings, setSettings] = useState(false);
  return <header className="workspace-header">
    <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={onOpen}><Menu size={22} /></button>
    <div>
      <p className="greeting">Welcome, {nickname}</p>
      <p className="muted" suppressHydrationWarning>{date}</p>
    </div>
    <span className="minutes-pill"><Clock size={16} aria-hidden="true" />{minutes} min</span>
    <button type="button" className="icon-button account-button" aria-label="Account settings"
      title="Account settings" onClick={() => setSettings(true)}><UserRound size={18} aria-hidden="true" /></button>
    {settings && <AccountSettings nickname={nickname} close={() => setSettings(false)} />}
  </header>;
}
