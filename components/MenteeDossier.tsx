import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarDays, Check, Clock, Compass, Mail, NotebookPen, Pencil, Phone, Plus, Target, Trash2, UserRound } from 'lucide-react';
import { deleteRecord, saveRecord, toggleFollowUp } from '@/app/actions';
import { formatDate, localDate, newestSessionFirst } from '@/lib/utils';
import { yearGroups, type Mentee, type ModuleSyllabus, type Session } from '@/types';
import { ActionButton, Field, RecordForm, numberValue } from './Forms';
import ModulePicker from './ModulePicker';

const skedda = 'https://app.skedda.com/account/login';
const details = [
  ['goal', 'Current goal', Target],
  ['long_term_goal', 'Long-term goal', Compass],
  ['interests', 'Interests', Compass],
  ['preferences', 'Preferences', UserRound],
  ['module_guidance', 'Module guidance', BookOpen],
  ['next_milestone', 'Next milestone', Target],
] as const;

export default function MenteeDossier({ mentee, sessions, modules, initialSession, back }: {
  mentee: Mentee; sessions: Session[]; modules: ModuleSyllabus[]; initialSession?: string; back: () => void;
}) {
  const [tab, setTab] = useState<'profile' | 'sessions'>(initialSession ? 'sessions' : 'profile');
  const [editContact, setEditContact] = useState(false);
  const [editingSession, setEditingSession] = useState<string>();
  const linkedSession = useRef<HTMLElement>(null);
  useEffect(() => {
    linkedSession.current?.scrollIntoView({ block: 'nearest' });
  }, [initialSession]);
  const phone = mentee.phone.replace(/[^\d+]/g, '');
  const minutes = sessions.reduce((sum, item) => sum + item.duration, 0);
  const orderedSessions = [...sessions].sort(newestSessionFirst);
  const update = (values: Record<string, string>) => saveRecord('mentees', values, mentee.id);
  return <div className="view-stack">
    <div className="section-heading">
      <button className="button primary w-fit" onClick={back}><ArrowLeft size={17} />Mentees</button>
      <ActionButton className="button danger" confirm="Delete this mentee, their session logs and linked meetings?"
        run={async () => {
          const result = await deleteRecord('mentees', mentee.id);
          if (!result.error) back();
          return result;
        }}><Trash2 size={15} aria-hidden="true" />Delete mentee</ActionButton>
    </div>
    <div className="section-heading workspace-hero">
      <div className="flex min-w-0 items-center gap-4">
        <span className="dossier-avatar"><UserRound size={24} aria-hidden="true" /></span>
        <div className="min-w-0">
          <p className="dossier-year">{mentee.year_group}{mentee.subject && ' · ' + mentee.subject}</p>
          <h1>{mentee.name}</h1>
          {mentee.goal.trim() && <p className="muted mt-2 line-clamp-2 break-words">{mentee.goal.trim()}</p>}
        </div>
      </div>
      <div className="dossier-minutes"><Clock size={17} aria-hidden="true" /><strong>{minutes} min</strong>
        <span>{sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}</span></div>
    </div>
    <div className="segmented" role="group" aria-label="Mentee sections">
      <button aria-pressed={tab === 'profile'} onClick={() => setTab('profile')}>Profile + goals</button>
      <button aria-pressed={tab === 'sessions'} onClick={() => setTab('sessions')}>Session logs</button>
    </div>
    {tab === 'profile' ? <div className="dossier-columns">
      <div className="dossier-fields">
        {details.map(([name, label, Icon]) => <ProfileCard key={name} name={name} label={label} value={mentee[name]}
          icon={<Icon size={16} aria-hidden="true" />} save={update} />)}
        <ModulePicker label="Recommended modules" name="recommended_modules" value={mentee.recommended_modules} modules={modules} menteeId={mentee.id} />
        <ModulePicker label="Selected modules" name="selected_modules" value={mentee.selected_modules} modules={modules} menteeId={mentee.id} />
      </div>
      <div className="view-stack">
        <section className="panel">
          <div className="section-heading"><h2 className="card-caption"><Mail size={16} aria-hidden="true" />Communication</h2>
            {!editContact && <button className="icon-button" aria-label="Edit contact details" title="Edit contact details"
              onClick={() => setEditContact(true)}><Pencil size={16} /></button>}
          </div>
          {editContact ? <RecordForm save={update} cancel={() => setEditContact(false)} complete={() => setEditContact(false)}>
            <Field name="name" label="Name" value={mentee.name} required limit={120} />
            <Field name="year_group" label="Year group" value={mentee.year_group} options={yearGroups} required />
            <Field name="email" label="Email" type="email" limit={254} value={mentee.email} />
            <Field name="phone" label="Phone (optional)" type="tel" limit={50} value={mentee.phone} />
          </RecordForm> : <div className="contact-links">
            {mentee.email && <a className="button" href={'mailto:' + mentee.email}><Mail size={16} /><span>{mentee.email}</span></a>}
            {phone && <a className="button" href={'tel:' + phone}><Phone size={16} /><span>{mentee.phone}</span></a>}
          </div>}
          <div className="contact-links mt-3">
            <a className="button primary" href={skedda} target="_blank" rel="noreferrer">
              <CalendarDays size={16} />Schedule on Skedda<ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </section>
        <ProfileCard name="scratchpad" label="Scratchpad" value={mentee.scratchpad} rows={9} icon={<NotebookPen size={16} aria-hidden="true" />} save={update}>
          {mentee.notes && <details className="earlier-notes"><summary>Earlier notes</summary>
            <p className="mt-2 whitespace-pre-wrap break-words">{mentee.notes}</p>
          </details>}
        </ProfileCard>
      </div>
    </div> : <div className="session-columns">
      <section className="panel">
        <div className="section-heading"><h2>Log session</h2><Plus size={18} aria-hidden="true" /></div>
        <SessionForm menteeId={mentee.id} sessionNumber={sessions.length + 1} />
      </section>
      <div className="view-stack">
        {!sessions.length && <section className="panel empty">No session logs yet.</section>}
        {orderedSessions.map((item, index) => {
          const title = item.topic;
          return <article className={'panel' + (initialSession === item.id ? ' linked-session' : '')} key={item.id}
            ref={initialSession === item.id ? linkedSession : undefined}>
          {editingSession === item.id ? <SessionForm menteeId={mentee.id} session={item} sessionNumber={orderedSessions.length - index} close={() => setEditingSession(undefined)} />
            : <>
              <div className="section-heading">
                <div className="flex flex-wrap gap-2">
                  <span className="interest-pill">{formatDate(item.date)}</span>
                  <span className="interest-pill"><Clock size={13} aria-hidden="true" />{item.duration} min</span>
                </div>
                <div className="actions">
                  <button className="icon-button" title="Edit session" aria-label={'Edit ' + title}
                    onClick={() => setEditingSession(item.id)}><Pencil size={16} /></button>
                  <ActionButton className="icon-button danger" label={'Delete ' + title}
                    confirm="Delete this session?" run={() => deleteRecord('sessions', item.id)}><Trash2 size={16} /></ActionButton>
                </div>
              </div>
              <h2 className="mt-3">{title}</h2>
              {item.notes && <div className="session-note">
                <h3 className="card-caption">Notes</h3>
                <p className="mt-2">{item.notes}</p>
              </div>}
              {(item.next_action || item.follow_up) && <div className="session-follow-up">
                <div className="section-heading">
                  <h3 className="card-caption"><CalendarDays size={15} aria-hidden="true" />Next actions</h3>
                  <ActionButton className="button follow-up-toggle" pressed={Boolean(item.follow_up_completed_at)}
                    run={() => toggleFollowUp(item.id, !item.follow_up_completed_at, item.next_action, item.follow_up)}>
                    {item.follow_up_completed_at ? <><Check size={15} aria-hidden="true" />Done</> : 'Mark done'}
                  </ActionButton>
                </div>
                {item.next_action && <p className="mt-2 whitespace-pre-wrap break-words">{item.next_action}</p>}
                {item.follow_up && <p className="muted mt-2">Follow up on <time dateTime={item.follow_up}>{formatDate(item.follow_up)}</time></p>}
              </div>}
            </>}
          </article>;
        })}
      </div>
    </div>}
  </div>;
}

function ProfileCard({ name, label, value, icon, save, rows = 5, children }: {
  name: string; label: string; value: string; icon: ReactNode;
  rows?: number; children?: ReactNode;
  save: (values: Record<string, string>) => ReturnType<typeof saveRecord>;
}) {
  const [draft, setDraft] = useState(value);
  return <section className="panel profile-field">
    <RecordForm save={save} disabled={draft === value}>
      <label className="field">
        <span className="card-caption">{icon}{label}</span>
        <textarea name={name} value={draft} onChange={(event) => setDraft(event.target.value)} rows={rows} maxLength={6000} />
      </label>
    </RecordForm>
    {children}
  </section>;
}

function SessionForm({ menteeId, session, sessionNumber, close }: {
  menteeId: string; session?: Session; sessionNumber: number; close?: () => void;
}) {
  return <RecordForm cancel={close} complete={close} submitLabel={session ? 'Save changes' : 'Save log'} save={(values) =>
    saveRecord('sessions', {
      ...values, mentee_id: menteeId,
      duration: numberValue(values, 'duration'), follow_up: values.follow_up || null,
    }, session?.id)}>
    <Field name="topic" label="Title" value={session?.topic} placeholder={'Session ' + sessionNumber} required />
    <div className="form-grid">
      <Field name="date" label="Date" type="date" value={session?.date || localDate()} required />
      <Field name="duration" label="Minutes" type="number" min={1} max={1440} value={session?.duration ?? 30} required />
    </div>
    <Field name="notes" label="Session notes" type="textarea" value={session?.notes} />
    <Field name="next_action" label="Next action" type="textarea" value={session?.next_action} />
    <Field name="follow_up" label="Follow-up date" type="date" value={session?.follow_up} />
  </RecordForm>;
}
