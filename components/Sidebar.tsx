import { ArrowUpRight, BookOpen, Bug, CalendarDays, Circle, LayoutGrid, Play, ShieldCheck, Smartphone, Square, Users, Wallet } from 'lucide-react';
import { signOut } from '@/app/auth/actions';

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'mentees', label: 'Mentees', icon: Users },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'modules', label: 'Modules', icon: BookOpen },
  { id: 'admin', label: 'Accounts', icon: ShieldCheck },
] as const;
export type View = typeof items[number]['id'];

export default function Sidebar({ view, navigate, admin }: { view: View; navigate: (view: View) => void; admin: boolean }) {
  return <div className="sidebar-content">
    <div className="brand">
      <div className="flex items-center gap-2" aria-hidden="true"><Square size={16} fill="currentColor" /><Circle size={16} fill="currentColor" /><Play size={20} fill="currentColor" /></div>
      <span>MILESTONE</span>
    </div>
    <nav aria-label="Workspace">
      {items.filter((item) => admin || item.id !== 'admin').map(({ id, label, icon: Icon }) =>
        <button key={id} aria-current={view === id ? 'page' : undefined} onClick={() => navigate(id)}>
          <Icon size={18} aria-hidden="true" />{label}
        </button>)}
    </nav>
    <div className="sidebar-footer">
      <a className="button report-bug" href="https://github.com/ibrahimify"
        target="_blank" rel="noreferrer"><Bug size={16} aria-hidden="true" />Report a bug<ArrowUpRight size={14} aria-hidden="true" /></a>
      <form action={signOut}><button className="button signout"><Smartphone size={17} aria-hidden="true" />Sign out</button></form>
    </div>
  </div>;
}
