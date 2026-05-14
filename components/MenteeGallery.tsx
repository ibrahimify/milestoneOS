import React from 'react';
import type { Mentee } from '@/types';
import { ChevronRight, Sparkles, Atom, Compass, Terminal, Flame, Users } from 'lucide-react';

interface MenteeGalleryProps {
  mentees: Mentee[];
  onSelectMentee: (id: string) => void;
}

export default function MenteeGallery({
  mentees,
  onSelectMentee,
}: MenteeGalleryProps) {
  const maxMinutes = 720;

  // Helper function to map string icon identifiers to clean Lucide vector components
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
    <div className="space-y-6 animate-fade-in select-none max-w-7xl mx-auto">
      {/* Title & Introduction Banner */}
      <div className="bg-[#0b1120] rounded-[32px] p-6 md:p-10 text-white shadow-premium relative overflow-hidden border border-slate-800/80">
        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.12),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-10 pointer-events-none" />

        <div className="max-w-xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 font-bold text-[10px] tracking-widest uppercase">
            <Users className="w-3 h-3 text-blue-500" />
            <span>Contract Client Roster</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-space font-bold leading-tight tracking-tight text-slate-100">
            Mentee Management Fleet
          </h1>
          
          <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed max-w-lg">
            Examine core student session logs, audit degree track milestones, and query localized digital dossiers mapped to individual performance metrics.
          </p>
        </div>
      </div>

      {/* Grid of high-end Mentee Cards */}
      <div className="grid sm:grid-cols-2 gap-6">
        {mentees.map((mentee) => {
          const currentMins = mentee.totalMinutes || 0;
          const pct = Math.min(100, Math.round((currentMins / maxMinutes) * 100));

          // SVG Progress Ring calculations
          const radius = 35;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (pct / 100) * circumference;

          return (
            <div
              key={mentee.id}
              onClick={() => onSelectMentee(mentee.id)}
              className="mentee-card bg-white rounded-[28px] p-6 md:p-8 border border-slate-100 shadow-premium flex flex-col justify-between cursor-pointer relative overflow-hidden group"
            >
              {/* Dynamic Accent glowing strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-500 group-hover:h-2.5 opacity-90"
                style={{ backgroundColor: mentee.color }}
              />

              {/* Upper Profile Box */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Exquisite custom icon casing */}
                    <div
                      className="w-14 h-14 rounded-[20px] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${mentee.color}10`,
                        border: `1px solid ${mentee.color}25`,
                        color: mentee.color,
                      }}
                    >
                      {renderMenteeIcon(mentee.avatar, "w-6 h-6 stroke-[2.5]")}
                    </div>
                    
                    <div className="min-w-0">
                      <h3 className="font-space font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors tracking-tight leading-tight truncate">
                        {mentee.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-slate-600">
                          {mentee.yearGroup}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-semibold text-slate-500 truncate max-w-[140px]">
                          {mentee.subject.split('&')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Streak readout (No emojis) */}
                  {mentee.streak > 0 && (
                    <div className="flex items-center gap-1.5 bg-amber-50/80 text-amber-800 px-3 py-1 rounded-xl border border-amber-200/60 flex-shrink-0 shadow-sm">
                      <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span className="text-xs font-space font-bold">{mentee.streak}w</span>
                    </div>
                  )}
                </div>

                {/* Primary Student Goals */}
                <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100/80 mb-6 group-hover:bg-slate-50 transition-colors">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Current Degree Target
                  </div>
                  <p className="text-xs text-slate-800 line-clamp-2 font-medium leading-relaxed">
                    {mentee.goal}
                  </p>
                </div>
              </div>

              {/* Lower Section with SVG Progress Ring & Trigger */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                {/* Custom SVG Progress Ring */}
                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        className="text-slate-100"
                        strokeWidth="5"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                        style={{ stroke: mentee.color }}
                      />
                    </svg>
                    {/* Centered Percentage */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs font-space font-bold text-slate-900 leading-none">
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Absolute minutes readout */}
                  <div>
                    <div className="text-xs font-space font-bold text-slate-900 block">
                      {currentMins} <span className="text-[10px] font-normal text-slate-400">/ {maxMinutes}m</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold tracking-wide mt-0.5">
                      Logged Time
                    </div>
                  </div>
                </div>

                {/* View Dossier Action Indicator Button */}
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-center text-slate-400 group-hover:bg-[#0b1120] group-hover:text-white transition-all duration-300 shadow-sm">
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
