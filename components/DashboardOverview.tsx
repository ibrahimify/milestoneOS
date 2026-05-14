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
  Sparkles,
  Zap,
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
  // Aggregate Calculations
  const totalLoggedMinutes = mentees.reduce((sum, m) => sum + (m.totalMinutes || 0), 0);
  const totalContractMinutes = 2880; // 4 mentees * 720 mins
  const minuteProgressPct = Math.min(100, Math.round((totalLoggedMinutes / totalContractMinutes) * 100));

  const totalContractAmount = salary.total;
  const settledAmount = salary.payments
    .filter((p) => p.received)
    .reduce((sum, p) => sum + p.amount, 0);
  const settledPct = Math.round((settledAmount / totalContractAmount) * 100);

  // Active or high streak mentees
  const activeMenteesCount = mentees.length;

  // Recent 4 sessions across the entire fleet
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  // Filter upcoming deadlines or upcoming events
  const upcomingEvents = [...calendarEvents]
    .filter((ev) => new Date(ev.date) >= new Date('2026-05-01'))
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-7xl mx-auto">
      {/* Dark Minimalist High-Fidelity Hero Command Panel */}
      <div className="bg-[#0b1120] rounded-[32px] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        {/* Ambient subtle agency gradient mesh */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-1/3 h-1/2 bg-[radial-gradient(circle_at_bottom,rgba(16,185,129,0.08),transparent_60%)] pointer-events-none" />
        
        {/* Micro-dot overlay pattern */}
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-blue-400 text-[11px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Operational Nerve Center</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-space font-bold leading-tight tracking-tight text-slate-100">
              Mentor Command Overview
            </h1>
            
            <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed max-w-lg">
              Real-time audit telemetry for self-employed EV mentor lines. Tracking aggregate contract delivery targets, pending escrow disbursements, and personalized degree trajectories.
            </p>

            {/* Quick action helper pill triggers */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={() => onNavigate('finance')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm group"
              >
                <DollarSign className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>EV Finance Ledger</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('resources')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all"
              >
                <span>Browse Syllabus</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Core Master Progress Gauges */}
          <div className="flex sm:flex-row flex-col gap-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            {/* Delivery minutes radial mini-display */}
            <div className="flex items-center gap-3.5 pr-4 sm:border-r border-slate-800">
              <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    className="text-slate-800"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 23}
                    strokeDashoffset={(2 * Math.PI * 23) * (1 - minuteProgressPct / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="text-blue-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{minuteProgressPct}%</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Time Logged
                </div>
                <div className="text-sm font-space font-bold text-slate-200 mt-0.5">
                  {totalLoggedMinutes} <span className="text-[10px] font-normal text-slate-500">/ {totalContractMinutes}m</span>
                </div>
              </div>
            </div>

            {/* Payout percentage mini-display */}
            <div className="flex items-center gap-3.5 pl-1">
              <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    className="text-slate-800"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 23}
                    strokeDashoffset={(2 * Math.PI * 23) * (1 - settledPct / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="text-emerald-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{settledPct}%</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Disbursed
                </div>
                <div className="text-sm font-space font-bold text-emerald-400 mt-0.5">
                  {(settledAmount / 1000).toFixed(0)}k <span className="text-[10px] font-normal text-slate-500">HUF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Capacity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Active Allocations
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-space font-bold text-slate-900 leading-none">
              {activeMenteesCount} <span className="text-xs font-normal text-slate-400">Students</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-2">
              Full capacity mapping optimized
            </p>
          </div>
        </div>

        {/* Global Hours Logged */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Aggregate Delivery
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-space font-bold text-slate-900 leading-none">
              {(totalLoggedMinutes / 60).toFixed(1)} <span className="text-xs font-normal text-slate-400">Hours</span>
            </div>
            <p className="text-[11px] text-indigo-600 font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Target: 48.0 Hours Cap</span>
            </p>
          </div>
        </div>

        {/* Contract Ledger Sum */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Contract Ledger Cap
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-space font-bold text-slate-900 leading-none">
              {totalContractAmount.toLocaleString()} <span className="text-xs font-normal text-slate-400">HUF</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-2">
              Fixed rate Self-Employed agreement
            </p>
          </div>
        </div>

        {/* System Logs Telemetry */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Audited Logs
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-space font-bold text-slate-900 leading-none">
              {sessions.length} <span className="text-xs font-normal text-slate-400">Entries</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-2">
              100% verified persistent storage
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Telemetry Layout Row: Fleet Progress & Activity Stream */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2): Active Contract Line Distribution */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-premium p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-space font-bold text-slate-900 text-sm tracking-tight">
                Mentee Fleet Delivery Mapping
              </h3>
              <button
                onClick={() => onNavigate('mentees')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                <span>Gallery View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-5">
              Click any specific profile pipeline below to examine granular degree trajectory dossiers.
            </p>

            <div className="space-y-4">
              {mentees.map((mentee) => {
                const pct = Math.min(100, Math.round(((mentee.totalMinutes || 0) / 720) * 100));
                return (
                  <div
                    key={mentee.id}
                    onClick={() => onSelectMentee(mentee.id)}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-slate-200/80 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Individual colored index ring */}
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: mentee.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-space font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {mentee.name}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.2 rounded bg-slate-100/80">
                            {mentee.yearGroup}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                          {mentee.subject.split('&')[0]}
                        </div>
                      </div>
                    </div>

                    {/* Linear Progress Bar container */}
                    <div className="hidden sm:block flex-1 max-w-xs mx-4">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                        <span>{mentee.totalMinutes}m logged</span>
                        <span>{pct}% Target</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: mentee.color }}
                        />
                      </div>
                    </div>

                    {/* Direct action indicator */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right sm:hidden">
                        <span className="text-xs font-bold text-slate-900 block">{pct}%</span>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Uniform baseline target: 720 logged minutes per contract stream</span>
            <span className="font-semibold text-slate-500">Live Client Data</span>
          </div>
        </div>

        {/* Right Column: Global Recent Activity Stream & Schedule alerts */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* Stream Log Container */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Recent Fleet Logs</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Audit Trail
              </span>
            </div>

            {recentSessions.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center text-xs text-slate-400 py-8">
                No telemetry logs authored yet.
              </div>
            ) : (
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {recentSessions.map((s) => {
                  const targetMentee = mentees.find((m) => m.id === s.menteeId);
                  return (
                    <div
                      key={s.id}
                      onClick={() => targetMentee && onSelectMentee(targetMentee.id)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-100/60 transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className="font-bold truncate text-[11px]"
                          style={{ color: targetMentee?.color || '#3b82f6' }}
                        >
                          {targetMentee?.name || 'General Log'}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 flex-shrink-0">
                          {s.date}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 line-clamp-1 leading-tight">
                        {s.topic}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        <span>{s.duration} mins logged</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Schedule Preview box */}
          <div className="bg-gradient-to-br from-slate-900 to-[#0b1120] rounded-3xl p-5 text-white shadow-premium border border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-slate-400 text-[10px] font-bold tracking-widest uppercase">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Upcoming Milestones</span>
            </div>
            
            <div className="space-y-2.5">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="text-xs border-l-2 pl-2.5 py-0.5 border-blue-500">
                  <div className="font-space font-bold text-slate-200 line-clamp-1">
                    {ev.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {ev.date} {ev.type === 'deadline' && '⚠️ Critical Due'}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('calendar')}
              className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-bold text-slate-300 transition-colors block text-center border border-slate-700/60"
            >
              Launch Core Calendar
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
