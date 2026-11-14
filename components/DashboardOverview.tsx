import { useState } from 'react';
import { CalendarDays, ChevronRight, Clock, NotebookPen, Users, Wallet } from 'lucide-react';
import type { WorkspaceData } from '@/types';
import { formatCurrency, formatDate, localDate, newestSessionFirst } from '@/lib/utils';
import type { View } from './Sidebar';

const previewLimit = 4;

export default function DashboardOverview({ data, navigate, openMentee }: {
  data: WorkspaceData; navigate: (view: View) => void; openMentee: (id: string, sessionId?: string) => void;
}) {
  const [now] = useState(() => new Date());
  const today = localDate(now);
  const upcoming = data.events.filter((item) => item.start_at ? Date.parse(item.start_at) >= now.getTime() : item.date >= today)
    .sort((a, b) => (a.start_at || a.date).localeCompare(b.start_at || b.date)).slice(0, 3);
  const followUps = data.sessions.filter((item) => item.follow_up && !item.follow_up_completed_at)
    .sort((a, b) => a.follow_up!.localeCompare(b.follow_up!)).slice(0, 3);
  const outstanding = data.payments.filter((item) => !item.received_at).reduce((sum, item) => sum + item.amount, 0);
  const recent = [...data.sessions].sort(newestSessionFirst).slice(0, previewLimit);
  const stats = [
    { label: 'Mentees', value: data.mentees.length, Icon: Users },
    { label: 'Session logs', value: data.sessions.length, Icon: NotebookPen },
    { label: 'Minutes logged', value: data.sessions.reduce((sum, item) => sum + item.duration, 0), Icon: Clock },
    { label: 'Unpaid installments', value: formatCurrency(outstanding, data.finance.currency), Icon: Wallet },
  ];
  return <div className="view-stack">
    <section className="section-heading workspace-hero">
      <h1>Dashboard</h1>
      <div className="actions">
        <button className="button" onClick={() => navigate('mentees')}>Open mentees</button>
        <button className="button hero-secondary" onClick={() => navigate('finance')}>Finance</button>
      </div>
    </section>
    <div className="card-grid stats">
      {stats.map(({ label, value, Icon }) => <div className="panel" key={label}>
        <p className="muted flex items-center gap-2"><Icon size={17} />{label}</p><strong className="stat-value">{value}</strong>
      </div>)}
    </div>
    <div className="dashboard-columns">
      <section className="panel">
        <div className="section-heading"><h2>Mentees</h2><Users size={19} aria-hidden="true" /></div>
        {!data.mentees.length && <p className="empty">No mentees yet.</p>}
        {data.mentees.slice(0, previewLimit).map((mentee) => <button key={mentee.id} className="record-row row-button dashboard-preview-row"
          onClick={() => openMentee(mentee.id)}>
          <div><strong className="block truncate">{mentee.name}</strong><p className="muted truncate">{mentee.goal.trim() || mentee.year_group}</p></div>
          <ChevronRight size={17} className="shrink-0" />
        </button>)}
        {data.mentees.length > previewLimit && <button className="button subtle dashboard-view-all" onClick={() => navigate('mentees')}>
          View all {data.mentees.length} mentees<ChevronRight size={16} aria-hidden="true" />
        </button>}
      </section>
        <section className="panel">
          <div className="section-heading"><h2>Recent logs</h2><Clock size={19} aria-hidden="true" /></div>
          {!recent.length && <p className="empty">No logs yet.</p>}
          {recent.map((session) => <button className="record-row row-button dashboard-preview-row" key={session.id} onClick={() => openMentee(session.mentee_id, session.id)}>
            <div><strong className="block truncate">{session.topic}</strong><p className="muted truncate">
              {data.mentees.find((mentee) => mentee.id === session.mentee_id)?.name} · {formatDate(session.date)}
            </p></div>
            <span className="shrink-0">{session.duration} min</span>
          </button>)}
        </section>
        <section className="panel">
          <div className="section-heading"><h2>Upcoming</h2>
            <button className="button subtle" onClick={() => navigate('calendar')}><CalendarDays size={17} />Calendar</button></div>
          {!upcoming.length && <p className="empty">No upcoming events.</p>}
          {upcoming.map((item) => <div className="record-row" key={item.id}>
            <div><strong>{item.title}</strong><p className="muted">{item.start_at
              ? <span suppressHydrationWarning>{new Date(item.start_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
              : formatDate(item.date)}</p></div>
            {item.shared && <span className="label">Shared</span>}
          </div>)}
        </section>
      <section className="panel">
        <div className="section-heading"><h2>Follow-ups</h2>
          <button className="button subtle" onClick={() => navigate('mentees')}>Mentees<ChevronRight size={17} /></button></div>
        {!followUps.length && <p className="empty">No follow-ups scheduled.</p>}
        {followUps.map((item) => <button className="record-row row-button" key={item.id} onClick={() => openMentee(item.mentee_id, item.id)}>
          <div><strong className="line-clamp-2">{item.next_action || item.topic}</strong><p className="muted">
            {data.mentees.find((mentee) => mentee.id === item.mentee_id)?.name} · {item.follow_up! < today && 'Overdue · '}{formatDate(item.follow_up!)}
          </p></div>
          <ChevronRight size={17} className="shrink-0" />
        </button>)}
      </section>
    </div>
  </div>;
}
