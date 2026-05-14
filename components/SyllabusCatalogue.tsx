import React, { useState } from 'react';
import { availableModules } from '@/lib/mockData';
import { BookOpen, ExternalLink, Search } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in select-none max-w-7xl mx-auto">
      {/* Huge clean bold header */}
      <div className="bg-[#0b1120] rounded-[32px] p-8 md:p-12 text-white">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-space font-bold leading-tight tracking-tight text-white">
            Syllabus Directory
          </h1>
          <p className="text-sm text-slate-400 font-medium max-w-lg">
            Query verified academic delivery models. Direct vector triggers launch custom preparedness form integrations targeting backend entries.
          </p>
        </div>
      </div>

      {/* Inputs / Filters row */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 flex flex-col lg:flex-row gap-6 justify-between items-center">
        {/* Simple crisp search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search module title, division, or faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none font-space font-bold placeholder:font-sans placeholder:font-normal"
          />
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-2.5 rounded-xl text-xs font-space font-bold transition-colors ${
                selectedLevel === lvl
                  ? 'bg-[#0b1120] text-white'
                  : 'bg-slate-50 text-slate-400 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Results */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredModules.map((mod) => (
          <div
            key={mod.code}
            className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-slate-200 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-space font-bold text-slate-400 mb-4 block uppercase tracking-wider">
                {mod.level}
              </div>

              <h3 className="text-xl font-space font-bold text-slate-900 leading-snug mb-4 group-hover:text-blue-600 transition-colors">
                {mod.title}
              </h3>

              <div className="space-y-2 text-xs text-slate-400 font-medium mb-8">
                <div>
                  <span className="text-slate-400">Division: </span>
                  <strong className="text-slate-900 font-bold">{mod.division}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Faculty: </span>
                  <strong className="text-slate-900 font-bold">{mod.teacher}</strong>
                </div>
                {mod.coreFor !== 'N/A' && (
                  <div className="text-slate-900 font-space font-bold pt-1">
                    Core Route: {mod.coreFor}
                  </div>
                )}
              </div>
            </div>

            {/* Form integration link */}
            <div className="pt-4 border-t border-slate-50">
              {mod.formLink !== 'N/A' ? (
                <a
                  href={mod.formLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between py-2 text-xs font-space font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 stroke-[2.5]" />
                    <span>Motivation Form</span>
                  </span>
                  <ExternalLink className="w-4 h-4 stroke-[2]" />
                </a>
              ) : (
                <div className="text-xs font-space font-bold text-slate-400 py-2">
                  Direct Core Group Allocation
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
