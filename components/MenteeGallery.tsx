import { useState } from 'react';
import { ArrowUpRight, CalendarDays, NotebookPen, Plus, Search, Target } from 'lucide-react';
import { saveRecord } from '@/app/actions';
import { formatDate } from '@/lib/utils';
import { yearGroups, type Mentee, type Session } from '@/types';
import { Field, FormDialog } from './Forms';
import BrowserImport from './BrowserImport';

function AddMentee({ close }: { close: () => void }) {
  return <FormDialog title="Add mentee" close={close}
    save={(values) => saveRecord('mentees', {
      subject: '', skedda_link: '', goal: '', long_term_goal: '', interests: '', preferences: '',
      next_milestone: '', module_guidance: '', recommended_modules: '', selected_modules: '', notes: '', scratchpad: '',
      ...values,
    })}>
    <div className="form-grid">
      <Field name="name" label="Name" required limit={120} />
      <Field name="email" label="Email" type="email" limit={254} required />
      <Field name="year_group" label="Year group" options={[{ value: '', label: 'Choose year group' }, ...yearGroups]} required />
      <Field name="phone" label="Phone (optional)" type="tel" limit={50} />
    </div>
  </FormDialog>;
}

export default function MenteeGallery({ mentees, sessions, openMentee, profile }: {
  mentees: Mentee[]; sessions: Session[]; openMentee: (id: string) => void; profile: { id: string; email: string };
}) {
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = mentees.filter((item) => [item.name, item.subject, item.year_group].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  return <div className="view-stack">
    <div className="section-heading workspace-hero"><h1>Mentee profiles</h1>
      <button className="button primary" onClick={() => setAdding(true)}><Plus size={17} />Add mentee</button>
    </div>
    {!!mentees.length && <label className="search"><Search size={18} /><input type="search" aria-label="Search mentees"
      placeholder="Search mentees" value={search} onChange={(event) => setSearch(event.target.value)} /></label>}
    {!filtered.length && <div className="panel empty">{mentees.length ? 'No mentees match your search.' : 'Add your first mentee to start tracking sessions.'}</div>}
    <BrowserImport profile={profile} />
    <div className="card-grid">
      {filtered.map((item) => {
        const logs = sessions.filter((session) => session.mentee_id === item.id);
        const last = logs.reduce<Session | undefined>((latest, log) => !latest || log.date > latest.date ? log : latest, undefined);
        const followUp = logs.filter((log) => !log.follow_up_completed_at).map(({ follow_up }) => follow_up).filter(Boolean).sort()[0];
        return <button className="panel mentee-card" key={item.id} onClick={() => openMentee(item.id)}>
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="profile-pill">{item.year_group}</span>
            <strong className="mt-2 block break-words text-2xl tracking-tight">{item.name}</strong>
          </span>
          <span className="profile-arrow"><ArrowUpRight size={19} aria-hidden="true" /></span>
        </span>
        <span className="mentee-card-focus"><span className="card-caption"><Target size={15} aria-hidden="true" />Current goal</span>
          <span className="mt-1 block line-clamp-2 break-words">{item.goal.trim() || 'Add a goal in Profile + goals'}</span>
        </span>
        <span className="mentee-card-meta">
          <span><NotebookPen size={15} aria-hidden="true" />{last ? 'Last session · ' + formatDate(last.date) : 'No sessions logged'}</span>
          {followUp && <span><CalendarDays size={15} aria-hidden="true" />{'Follow-up · ' + formatDate(followUp)}</span>}
        </span>
      </button>;
      })}
    </div>
    {adding && <AddMentee close={() => setAdding(false)} />}
  </div>;
}
