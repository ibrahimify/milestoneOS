import { useState } from 'react';
import { ArrowUpRight, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react';
import { deleteRecord, saveRecord } from '@/app/actions';
import { eventCategories, type CalendarEvent, type Mentee } from '@/types';
import { formatDate, localDate } from '@/lib/utils';
import { calendarFile, googleCalendarLink } from '@/lib/calendar';
import { ActionButton, Dialog, Field, FormDialog, numberValue } from './Forms';

function displayDate(event: CalendarEvent) {
  return event.start_at ? localDate(new Date(event.start_at)) : event.date;
}

function localTime(iso?: string | null) {
  if (!iso) return '';
  const date = new Date(iso);
  return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
}

export default function CalendarGrid({ events, mentees, admin }: {
  events: CalendarEvent[]; mentees: Mentee[]; admin: boolean;
}) {
  const [day, setDay] = useState(localDate());
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [edit, setEdit] = useState<CalendarEvent | 'new'>();
  const [exportId, setExportId] = useState<string>();
  const exporting = events.find((item) => item.id === exportId);
  const editing = typeof edit === 'object' ? edit : undefined;
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const prefix = localDate(month).slice(0, 7);
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const blanks = (month.getDay() + 6) % 7;
  const eventCounts = new Map<string, number>();
  for (const event of events) {
    const date = displayDate(event);
    eventCounts.set(date, (eventCounts.get(date) ?? 0) + 1);
  }
  const visible = events.filter((item) => displayDate(item).startsWith(prefix))
    .sort((a, b) => (displayDate(a) + localTime(a.start_at)).localeCompare(displayDate(b) + localTime(b.start_at)));
  const close = () => setEdit(undefined);

  function moveMonth(change: number) {
    const next = new Date(year, monthIndex + change, 1);
    setMonth(next);
    setDay(localDate(next));
  }

  function download(event: CalendarEvent) {
    const url = URL.createObjectURL(new Blob([calendarFile(event)], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'milestone-event.ics';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className="view-stack">
    <div className="section-heading workspace-hero"><h1>Calendar</h1>
      <button className="button primary" onClick={() => setEdit('new')}><Plus size={17} />Add event</button>
    </div>
    <section className="panel">
      <div className="section-heading calendar-header">
        <h2 suppressHydrationWarning>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
        <div className="actions">
          <button className="icon-button" aria-label="Previous month" onClick={() => moveMonth(-1)}><ChevronLeft size={20} /></button>
          <button className="button" onClick={() => { setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); setDay(localDate()); }}>Today</button>
          <button className="icon-button" aria-label="Next month" onClick={() => moveMonth(1)}><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="calendar-grid" aria-label="Month days">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => <span key={label} className="muted">{label}</span>)}
        {Array.from({ length: 42 }, (_, index) => {
          const dayOfMonth = index - blanks + 1;
          if (dayOfMonth < 1 || dayOfMonth > days) return <span key={'blank' + index} className="calendar-blank" aria-hidden="true" />;
          const date = localDate(new Date(year, monthIndex, dayOfMonth));
          const count = eventCounts.get(date) ?? 0;
          return <button key={date} aria-pressed={date === day} aria-current={date === localDate() ? 'date' : undefined}
            aria-label={formatDate(date) + (count ? `, ${count} ${count === 1 ? 'event' : 'events'}` : '')}
            className={count ? 'has-events' : undefined} onClick={() => setDay(date)}>
            {dayOfMonth}{count > 0 && <span className="calendar-dots" aria-hidden="true">
              {Array.from({ length: Math.min(count, 3) }, (_, dot) => <i key={dot} />)}
            </span>}
          </button>;
        })}
      </div>
    </section>
    <section className="panel">
      <div className="section-heading"><h2>This month</h2><span className="muted">Selected · {formatDate(day)}</span></div>
      {!visible.length && <p className="empty">No events this month.</p>}
      {visible.map((item) => <article className={'record-row ' + (displayDate(item) === day ? 'selected-event' : '')} key={item.id}>
        <div className="min-w-0"><strong className="break-words">{item.title}</strong>
          <p className="muted">{formatDate(displayDate(item))} · {item.start_at ? localTime(item.start_at) : 'All day'}
            {' · ' + item.category}{item.shared && ' · Shared'}
            {item.mentee_id && ' · ' + (mentees.find((mentee) => mentee.id === item.mentee_id)?.name || 'Mentee')}</p>
          {item.description && <p className="mt-2 whitespace-pre-wrap break-words">{item.description}</p>}
        </div>
        <div className="actions">
          <button className="button" onClick={() => setExportId(item.id)}><CalendarPlus size={16} />Add to calendar</button>
          {(!item.shared || admin) && <>
            <button className="button" onClick={() => setEdit(item)}>Edit</button>
            <ActionButton className="button danger" confirm="Delete this event?" run={() => deleteRecord('calendar_events', item.id)}>Delete</ActionButton>
          </>}
        </div>
      </article>)}
    </section>
    {edit && <FormDialog title={editing ? 'Edit event' : 'Add event'} className="calendar-dialog" close={close}
      save={async (values) => {
        const start = values.time ? new Date(values.date + 'T' + values.time) : null;
        if (start && (!Number.isFinite(start.getTime()) || localDate(start) !== values.date || localTime(start.toISOString()) !== values.time)) {
          return { error: 'That time is unavailable in your timezone. Choose another time.' };
        }
        const shared = values.audience === 'everyone';
        const result = await saveRecord('calendar_events', {
          title: values.title, date: values.date, start_at: start?.toISOString() ?? null, duration: numberValue(values, 'duration'),
          category: values.category, description: values.description, mentee_id: shared ? null : values.mentee_id || null, shared,
        }, editing?.id);
        if (result.id) {
          setDay(values.date);
          setMonth(new Date(values.date.slice(0, 7) + '-01T12:00:00'));
          if (!editing) setExportId(result.id);
        }
        return result;
      }}>
      <Field name="title" label="Title" required value={editing?.title} />
      <div className="form-grid">
        <Field name="date" label="Date" type="date" value={editing ? displayDate(editing) : day} required />
        <Field name="time" label="Local time (optional)" type="time" value={localTime(editing?.start_at)} />
        <Field name="duration" label="Duration in minutes" type="number" min={1} max={1440} value={editing?.duration ?? 30} required />
        <Field name="category" label="Category" options={eventCategories} value={editing?.category || 'Meeting'} required />
      </div>
      <Field name="mentee_id" label="Mentee" value={editing?.mentee_id} options={[
        { value: '', label: 'None' }, ...mentees.map(({ id, name }) => ({ value: id, label: name })),
      ]} />
      {admin && <Field name="audience" label="Audience" value={editing?.shared ? 'everyone' : 'private'}
        options={[{ value: 'private', label: 'Only me' }, { value: 'everyone', label: 'All approved mentors' }]} />}
      <Field name="description" label="Notes (Milestone OS only)" type="textarea" value={editing?.description} />
    </FormDialog>}
    {exporting && !edit && <Dialog title="Add to calendar" className="calendar-dialog" close={() => setExportId(undefined)}>
      <div className="calendar-event-preview">
        <CalendarDays size={21} aria-hidden="true" />
        <div><strong>{exporting.title}</strong><p className="muted">{formatDate(displayDate(exporting))}
          {exporting.start_at ? ' · ' + localTime(exporting.start_at) : ' · All day'}</p></div>
      </div>
      <div className="calendar-export-options">
        <a className="button" href={googleCalendarLink(exporting)} target="_blank" rel="noreferrer">Google Calendar<ArrowUpRight size={16} aria-hidden="true" /></a>
        <button className="button" onClick={() => download(exporting)}>Apple Calendar (.ics)<Download size={16} aria-hidden="true" /></button>
      </div>
    </Dialog>}
  </div>;
}
