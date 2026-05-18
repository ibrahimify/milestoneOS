import React from 'react';
import type { Mentee, Session, MonthlySalary, CalendarEvent } from '@/types';
import {
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  NotebookPen,
  Users,
  WalletCards,
} from 'lucide-react';

interface DashboardOverviewProps {
  mentees: Mentee[];
  sessions: Session[];
  salary: MonthlySalary;
  calendarEvents: CalendarEvent[];
  onNavigate: (viewId: string) => void;
  onSelectMentee: (id: string) => void;
}

export default function DashboardOverview({
  mentees,
  sessions,
  salary,
  calendarEvents,
  onNavigate,
  onSelectMentee,
}: DashboardOverviewProps) {
  const totalLoggedMinutes = mentees.reduce((sum, mentee) => sum + (mentee.totalMinutes || 0), 0);
  const settledAmount = salary.payments
    .filter((payment) => payment.received)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = salary.total - settledAmount;

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const upcomingEvents = [...calendarEvents]
    .filter((event) => new Date(event.date) >= new Date('2026-05-18'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <div className="animate-fade-in space-y-6">
      <section className="rounded-[30px] bg-black p-8 text-white shadow-[0_26px_70px_rgba(0,0,0,0.16)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/42">Dashboard</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Mentor command center
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/58">
              Track mentee profiles, meeting logs, selected modules, minutes, and finance without leaving the main workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('mentees')}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black"
            >
              Open mentees
            </button>
            <button
              onClick={() => onNavigate('finance')}
              className="rounded-2xl border border-white/18 px-5 py-3 text-sm font-bold text-white"
            >
              Finance
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Mentees" value={`${mentees.length}`} />
        <StatCard icon={<NotebookPen className="h-5 w-5" />} label="Logs" value={`${sessions.length}`} />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Minutes" value={`${totalLoggedMinutes}`} />
        <StatCard icon={<WalletCards className="h-5 w-5" />} label="Pending HUF" value={pendingAmount.toLocaleString()} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="liquid-card rounded-[30px] p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Mentees</h2>
              <p className="mt-1 text-sm text-black/45">Open a profile to edit goals, modules, and notes.</p>
            </div>
            <BookOpen className="h-5 w-5 text-black/50" />
          </div>

          <div className="space-y-3">
            {mentees.map((mentee) => {
              const selectedCount = mentee.selectedModules?.length || 0;
              return (
                <button
                  key={mentee.id}
                  onClick={() => onSelectMentee(mentee.id)}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl bg-black/[0.035] p-4 text-left transition hover:bg-black hover:text-white"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{mentee.name}</div>
                    <div className="mt-1 truncate text-xs opacity-50">{mentee.status || mentee.yearGroup}</div>
                  </div>
                  <div className="shrink-0 text-xs font-bold">{selectedCount} selected</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="liquid-card rounded-[30px] p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Recent logs</h2>
              <Clock className="h-5 w-5 text-black/50" />
            </div>
            <div className="space-y-3">
              {recentSessions.length === 0 ? (
                <div className="rounded-2xl bg-white p-4 text-sm text-black/45">No logs yet.</div>
              ) : (
                recentSessions.map((session) => {
                  const mentee = mentees.find((m) => m.id === session.menteeId);
                  return (
                    <button
                      key={session.id}
                      onClick={() => mentee && onSelectMentee(mentee.id)}
                      className="w-full rounded-2xl bg-white p-4 text-left shadow-[0_12px_28px_rgba(0,0,0,0.055)] transition hover:bg-black hover:text-white"
                    >
                      <div className="flex items-center justify-between gap-3 text-sm font-bold">
                        <span className="truncate">{session.topic}</span>
                        <span>{session.duration}m</span>
                      </div>
                      <div className="mt-1 truncate text-xs opacity-50">{mentee?.name || 'General'} / {session.date}</div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="liquid-card rounded-[30px] p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Upcoming</h2>
              <CalendarIcon className="h-5 w-5 text-black/50" />
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.055)]">
                  <div className="text-sm font-bold">{event.title}</div>
                  <div className="mt-1 text-xs text-black/45">{event.date}{event.time ? ` / ${event.time}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="liquid-card rounded-[26px] p-6">
      <div className="mb-5 flex items-center justify-between text-black/52">
        <span className="text-xs font-bold uppercase tracking-[0.12em]">{label}</span>
        {icon}
      </div>
      <div className="truncate text-3xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
