import React from 'react';
import type { Mentee } from '@/types';
import { ArrowUpRight, BookOpen, CalendarClock, Clock3, Goal, UserRound } from 'lucide-react';

interface MenteeGalleryProps {
  mentees: Mentee[];
  onSelectMentee: (id: string) => void;
}

export default function MenteeGallery({
  mentees,
  onSelectMentee,
}: MenteeGalleryProps) {
  return (
    <div className="space-y-7 animate-fade-in select-none">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.52fr]">
        <div className="rounded-[30px] bg-black p-8 text-white shadow-[0_26px_70px_rgba(0,0,0,0.16)]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
            Student archive
          </p>
          <h1 className="mt-4 max-w-2xl font-space text-4xl tracking-tight md:text-6xl">
            Mentee profiles
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/54">
            Each card opens a full dossier with interests, goals, meeting notes, mentoring strategy, selected modules, and session logs.
          </p>
        </div>
        <div className="liquid-card rounded-[30px] p-7">
          <div className="flex h-full flex-col justify-between gap-6">
            <UserRound className="h-8 w-8" />
            <div>
              <div className="text-4xl font-bold">{mentees.length}</div>
              <div className="mt-2 text-sm text-black/45">active mentees in this workspace</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mentees.map((mentee) => {
          const currentMins = mentee.totalMinutes || 0;
          const pct = Math.min(100, Math.round((currentMins / 720) * 100));
          const modulesCount = mentee.suggestedModules?.length || 0;

          return (
            <button
              key={mentee.id}
              onClick={() => onSelectMentee(mentee.id)}
              className="liquid-card group rounded-[30px] p-7 text-left"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-[11px] font-bold text-white">
                    <span>{mentee.yearGroup}</span>
                    <span className="h-1 w-1 rounded-full bg-white/50" />
                    <span>{mentee.subject}</span>
                  </div>
                  <h3 className="font-space text-2xl tracking-tight text-black">
                    {mentee.name}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-black/48">
                    {mentee.goal}
                  </p>
                </div>
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-black text-white transition group-hover:rotate-[-8deg]">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Metric icon={<Clock3 className="h-4 w-4" />} label="Minutes" value={`${currentMins}m`} />
                <Metric icon={<BookOpen className="h-4 w-4" />} label="Modules" value={`${modulesCount}`} />
                <Metric icon={<Goal className="h-4 w-4" />} label="Cap" value={`${pct}%`} />
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-black/8">
                <div className="h-full rounded-full bg-black" style={{ width: `${pct}%` }} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {mentee.hobbies.slice(0, 4).map((hobby) => (
                  <span key={hobby} className="rounded-full bg-black/[0.045] px-3 py-1 text-xs font-bold text-black/54">
                    {hobby}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-black/5 pt-5 text-xs font-bold text-black/45">
                <CalendarClock className="h-4 w-4" />
                <span>{mentee.nextMeetingPreference || 'Meeting TBD'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.055)]">
      <div className="mb-3 flex items-center justify-between text-black/42">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-[0.08em]">{label}</span>
      </div>
      <div className="text-sm font-bold text-black">{value}</div>
    </div>
  );
}
