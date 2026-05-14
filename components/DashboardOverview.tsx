import React from 'react';
import type { Mentee, Session, MonthlySalary, CalendarEvent } from '@/types';
import {
  Clock,
  DollarSign,
  Users,
  Calendar as CalendarIcon,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
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
  const totalLoggedMinutes = mentees.reduce((sum, m) => sum + (m.totalMinutes || 0), 0);
  const totalContractMinutes = 2880; 

  const totalContractAmount = salary.total;
  const settledAmount = salary.payments
    .filter((p) => p.received)
    .reduce((sum, p) => sum + p.amount, 0);

  const activeMenteesCount = mentees.length;

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const upcomingEvents = [...calendarEvents]
    .filter((ev) => new Date(ev.date) >= new Date('2026-05-01'))
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in select-none max-w-7xl mx-auto">
      {/* High-End Clean Dark Header Pane */}
      <div className="bg-[#0b1120] rounded-[32px] p-8 md:p-12 text-white">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-space font-bold leading-tight tracking-tight text-white">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-lg">
            Real-time management for self-employed EV mentor frameworks. Deliver optimized guidance across fixed contract instructional paths.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('finance')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 text-xs font-space font-bold hover:bg-slate-100 transition-colors"
            >
              <span>Finance Engine</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => onNavigate('resources')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-xs font-space font-bold hover:bg-slate-800 transition-colors"
            >
              <span>Syllabus Catalogue</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Clean Big Text Stats Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Active Roster
          </div>
          <div className="text-3xl font-space font-bold text-slate-900">
            {activeMenteesCount} <span className="text-sm font-normal text-slate-400">Students</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Logged Hours
          </div>
          <div className="text-3xl font-space font-bold text-slate-900">
            {(totalLoggedMinutes / 60).toFixed(1)} <span className="text-sm font-normal text-slate-400">/ 48.0h</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Gross Escrow Cap
          </div>
          <div className="text-3xl font-space font-bold text-slate-900">
            {totalContractAmount.toLocaleString()} <span className="text-sm font-normal text-slate-400">HUF</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Cleared Escrow
          </div>
          <div className="text-3xl font-space font-bold text-slate-900 text-emerald-600">
            {settledAmount.toLocaleString()} <span className="text-sm font-normal text-slate-400">HUF</span>
          </div>
        </div>
      </div>

      {/* Mentees & Logs Container Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Fleet Pipeline list */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-space font-bold text-slate-900 tracking-tight">
              Instructional Allocations
            </h2>
            <button
              onClick={() => onNavigate('mentees')}
              className="text-xs font-space font-bold text-slate-400 hover:text-slate-900 transition-colors"
            >
              View Roster →
            </button>
          </div>

          <div className="space-y-4">
            {mentees.map((mentee) => {
              const pct = Math.min(100, Math.round(((mentee.totalMinutes || 0) / 720) * 100));
              return (
                <div
                  key={mentee.id}
                  onClick={() => onSelectMentee(mentee.id)}
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: mentee.color }}
                    />
                    <div>
                      <div className="font-space font-bold text-base text-slate-900">
                        {mentee.name}
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">
                        {mentee.subject.split('&')[0]}
                      </div>
                    </div>
                  </div>

                  {/* Clean text progress */}
                  <div className="text-right">
                    <div className="font-space font-bold text-sm text-slate-900">
                      {mentee.totalMinutes}m <span className="text-xs font-normal text-slate-400">/ 720m</span>
                    </div>
                    <div className="text-xs text-slate-400 font-bold mt-0.5">
                      {pct}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar logs */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 flex-1 flex flex-col">
            <h2 className="text-xl font-space font-bold text-slate-900 tracking-tight mb-6">
              Recent Logs
            </h2>

            {recentSessions.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                No telemetry recorded.
              </div>
            ) : (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {recentSessions.map((s) => {
                  const targetMentee = mentees.find((m) => m.id === s.menteeId);
                  return (
                    <div
                      key={s.id}
                      onClick={() => targetMentee && onSelectMentee(targetMentee.id)}
                      className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-space font-bold text-slate-900 truncate">
                          {targetMentee?.name || 'General'}
                        </span>
                        <span className="text-slate-400">{s.date}</span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium line-clamp-1">
                        {s.topic}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
