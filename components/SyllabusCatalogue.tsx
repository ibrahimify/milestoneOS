import React, { useState } from 'react';
import { availableModules } from '@/lib/mockData';
import { BookOpen, ExternalLink, Search, Sparkles, Layers } from 'lucide-react';

export default function SyllabusCatalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const levels = ['All', 'Freshman Module', 'Orientation', 'Immersion 1', 'Immersion 2', 'Focus'];

  const filteredModules = availableModules.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.teacher.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = selectedLevel === 'All' || mod.level.includes(selectedLevel);

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-[#0b1120] rounded-[32px] p-6 md:p-10 text-white shadow-premium relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-10 pointer-events-none" />

        <div className="max-w-xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 font-bold text-[10px] tracking-widest uppercase">
            <Layers className="w-3 h-3 text-indigo-500" />
            <span>Curriculum Resource Catalogue</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-space font-bold leading-tight tracking-tight text-slate-100">
            Accredited Syllabus Directory
          </h1>
          
          <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed max-w-lg">
            Query complete instructional structures across academic divisions. Form links for mandatory shopping choices map directly to dynamic backend entries.
          </p>
        </div>
      </div>

      {/* Controls row */}
      <div className="bg-white rounded-[28px] p-5 md:p-6 border border-slate-100 shadow-premium flex flex-col lg:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search module title, division, or faculty member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
          />
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto justify-end">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all tracking-tight ${
                selectedLevel === lvl
                  ? 'bg-[#0b1120] text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Results grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((mod) => (
          <div
            key={mod.code}
            className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-premium flex flex-col justify-between hover:border-slate-200 transition-all relative overflow-hidden group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-100/50 text-blue-700 tracking-wider uppercase">
                  {mod.level}
                </span>
                <span className="text-xs font-space font-bold text-slate-400">8 cr</span>
              </div>

              <h3 className="font-space font-bold text-slate-900 text-sm tracking-tight leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                {mod.title}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-500 font-medium mb-6">
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400 font-normal">Division:</span>
                  <span className="font-semibold text-slate-700">{mod.division}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400 font-normal">Lead Faculty:</span>
                  <span className="font-semibold text-slate-700">{mod.teacher}</span>
                </div>
                
                {mod.coreFor !== 'N/A' && (
                  <div className="text-[10px] text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-md mt-2 block border border-amber-100">
                    <strong className="font-bold">Core Route:</strong> {mod.coreFor}
                  </div>
                )}
              </div>
            </div>

            {/* Form integration link */}
            <div className="pt-4 border-t border-slate-100 mt-auto">
              {mod.formLink !== 'N/A' ? (
                <a
                  href={mod.formLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-[#0b1120] hover:text-white transition-all text-xs font-bold group/link shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-500 group-hover/link:text-white transition-colors" />
                  <span>Motivation Form Target</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover/link:text-slate-300 transition-colors" />
                </a>
              ) : (
                <div className="w-full text-center py-2.5 bg-slate-50/50 rounded-xl border border-slate-100 text-[11px] text-slate-400 font-medium">
                  Direct group allocation / Core Skill Dev
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
