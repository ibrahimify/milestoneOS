import React from 'react';
import type { Mentee } from '@/types';
import { ChevronRight, Atom, Compass, Terminal, Sparkles } from 'lucide-react';

interface MenteeGalleryProps {
  mentees: Mentee[];
  onSelectMentee: (id: string) => void;
}

export default function MenteeGallery({
  mentees,
  onSelectMentee,
}: MenteeGalleryProps) {
  const maxMinutes = 720;

  const renderMenteeIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Atom':
        return <Atom className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Terminal':
        return <Terminal className={className} />;
      case 'Sparkles':
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in select-none max-w-7xl mx-auto">
      {/* Huge bold pure black header */}
      <div className="bg-[#0b1120] rounded-[32px] p-8 md:p-12 text-white">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-space font-bold leading-tight tracking-tight text-white">
            Mentees Gallery
          </h1>
          <p className="text-sm text-slate-400 font-medium max-w-lg">
            Manage individual student pipelines. Select any profile below to access their secure dossier, log session telemetry, and configure active target goals.
          </p>
        </div>
      </div>

      {/* Extreme luxury clean Grid */}
      <div className="grid sm:grid-cols-2 gap-8">
        {mentees.map((mentee) => {
          const currentMins = mentee.totalMinutes || 0;
          return (
            <div
              key={mentee.id}
              onClick={() => onSelectMentee(mentee.id)}
              className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  {/* Avatar Icon placeholder */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 group-hover:scale-105 transition-transform">
                    {renderMenteeIcon(mentee.avatar || 'Sparkles', 'w-5 h-5 stroke-[2]')}
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                      Year Group
                    </span>
                    <span className="font-space font-bold text-sm text-slate-900">
                      {mentee.yearGroup}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-space font-bold text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                  {mentee.name}
                </h3>

                <p className="text-xs text-slate-400 font-medium mb-6">
                  {mentee.subject}
                </p>

                {/* Direct simple metrics summary */}
                <div className="border-t border-slate-50 pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block mb-0.5">Time Logged</span>
                    <span className="font-space font-bold text-lg text-slate-900">
                      {currentMins}m <span className="text-xs font-normal text-slate-400">/ {maxMinutes}m</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block mb-0.5">Active Target</span>
                    <span className="font-space font-bold text-xs text-slate-900 line-clamp-1">
                      {mentee.goal}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-space font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                <span>Access Student Dossier</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
