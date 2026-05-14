/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import type { Mentee, Session } from '@/types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit2,
  ExternalLink,
  Mail,
  Plus,
  Save,
  Trash2,
  FileText,
  Target,
  Sparkles,
  Atom,
  Compass,
  Terminal,
  Flame,
} from 'lucide-react';

interface MenteeDossierProps {
  mentee: Mentee;
  sessions: Session[];
  onBack: () => void;
  onUpdateSessions: (newSessions: Session[]) => void;
  onUpdateMenteeField: (field: keyof Mentee, value: unknown) => void;
}

export default function MenteeDossier({
  mentee,
  sessions,
  onBack,
  onUpdateSessions,
  onUpdateMenteeField,
}: MenteeDossierProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'logs' | 'drafts'>('profile');

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

  // Form states for creating a new mentoring log
  const [newTopic, setNewTopic] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDuration, setNewDuration] = useState(30);
  const [newSummary, setNewSummary] = useState('');
  const [newAchievements, setNewAchievements] = useState('');
  const [newNextSteps, setNewNextSteps] = useState('');

  // Editing existing session state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTopic, setEditTopic] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDuration, setEditDuration] = useState(30);
  const [editSummary, setEditSummary] = useState('');
  const [editAchievements, setEditAchievements] = useState('');
  const [editNextSteps, setEditNextSteps] = useState('');

  // Handle CRUD: Create
  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const nextNumber = sessions.length + 1;
    const created: Session = {
      id: `s-${Date.now()}`,
      menteeId: mentee.id,
      sessionNumber: nextNumber,
      date: newDate,
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      duration: Number(newDuration) || 30,
      topic: newTopic.trim(),
      notes: newSummary.trim(),
      achievements: newAchievements.trim(),
      nextSteps: newNextSteps.trim(),
      completed: true,
    };

    const updatedSessions = [created, ...sessions];
    onUpdateSessions(updatedSessions);

    // Update total minutes on mentee profile automatically
    const newTotalMinutes = updatedSessions.reduce((sum, s) => sum + s.duration, 0);
    onUpdateMenteeField('totalMinutes', newTotalMinutes);

    // Reset create inputs
    setNewTopic('');
    setNewSummary('');
    setNewAchievements('');
    setNewNextSteps('');
  };

  // Handle CRUD: Start Edit
  const startEditing = (s: Session) => {
    setEditingSessionId(s.id);
    setEditTopic(s.topic);
    setEditDate(s.date);
    setEditDuration(s.duration);
    setEditSummary(s.notes);
    setEditAchievements(s.achievements || '');
    setEditNextSteps(s.nextSteps || '');
  };

  // Handle CRUD: Save Edit
  const saveEdit = (id: string) => {
    const updatedSessions = sessions.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          topic: editTopic.trim(),
          date: editDate,
          duration: Number(editDuration) || 30,
          notes: editSummary.trim(),
          achievements: editAchievements.trim(),
          nextSteps: editNextSteps.trim(),
        };
      }
      return s;
    });

    onUpdateSessions(updatedSessions);
    const newTotalMinutes = updatedSessions.reduce((sum, s) => sum + s.duration, 0);
    onUpdateMenteeField('totalMinutes', newTotalMinutes);
    setEditingSessionId(null);
  };

  // Handle CRUD: Delete
  const deleteSession = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this session log?')) return;
    const updatedSessions = sessions.filter((s) => s.id !== id);
    onUpdateSessions(updatedSessions);
    const newTotalMinutes = updatedSessions.reduce((sum, s) => sum + s.duration, 0);
    onUpdateMenteeField('totalMinutes', newTotalMinutes);
  };

  return (
    <div className="space-y-6 animate-slide-up select-none max-w-5xl mx-auto">
      {/* Header Profile Area */}
      <div className="bg-white rounded-[32px] p-6 md:p-10 border border-slate-100 shadow-premium relative overflow-hidden">
        {/* Top Individualized Custom Band */}
        <div
          className="absolute top-0 left-0 right-0 h-2.5 opacity-90"
          style={{ backgroundColor: mentee.color }}
        />

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
          <span className="tracking-tight">Return to Gallery</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 md:gap-6 min-w-0">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] flex items-center justify-center flex-shrink-0 shadow-inner"
              style={{
                backgroundColor: `${mentee.color}10`,
                border: `1px solid ${mentee.color}25`,
                color: mentee.color,
              }}
            >
              {renderMenteeIcon(mentee.avatar, "w-8 h-8 md:w-10 md:h-10 stroke-[2.5]")}
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-space font-bold text-slate-900 leading-tight tracking-tight truncate">
                  {mentee.name}
                </h1>
                <span className="text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-slate-600">
                  {mentee.yearGroup}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1 truncate">
                {mentee.subject}
              </p>

              {/* Quick links buttons */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <a
                  href={`mailto:${mentee.email}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0b1120] text-white hover:bg-slate-800 transition-all text-xs font-bold shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Student</span>
                </a>
                <a
                  href={mentee.skeddaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-white transition-all text-xs font-bold"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Skedda Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Progress state overview */}
          <div className="flex items-center gap-5 bg-slate-50/80 rounded-2xl p-4 border border-slate-100/80 md:min-w-[210px] flex-shrink-0">
            <div className="flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Delivery Progress
              </span>
              <div className="text-xl font-space font-bold text-slate-900 leading-tight mt-0.5">
                {mentee.totalMinutes || 0} <span className="text-xs font-normal text-slate-400">/ 720m</span>
              </div>
              <span className="text-[9px] font-bold tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md w-max mt-1.5">
                {Math.min(100, Math.round(((mentee.totalMinutes || 0) / 720) * 100))}% Contract Line
              </span>
            </div>
            
            {mentee.streak > 0 && (
              <div className="ml-auto text-center border-l border-slate-200/60 pl-4 flex flex-col items-center justify-center">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500 mb-1" />
                <div className="text-xs font-space font-bold text-amber-600">{mentee.streak}w</div>
              </div>
            )}
          </div>
        </div>

        {/* Meeting preferences note if configured */}
        {mentee.nextMeetingPreference && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span><strong className="text-slate-800 font-bold">Preferred Advisory Times:</strong> {mentee.nextMeetingPreference}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-100 px-2">
        {[
          { id: 'profile', label: 'Advisory Dossier', icon: Target },
          { id: 'logs', label: `Session Audit Logs (${sessions.length})`, icon: FileText },
          { id: 'drafts', label: 'Scratchpad Engine', icon: Edit2 },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'logs' | 'drafts')}
              className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs tracking-tight transition-all relative ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile & Dossier Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Left Block: Dossier Meta Notes */}
            <div className="bg-white rounded-[28px] p-6 md:p-8 border border-slate-100 shadow-premium space-y-5">
              <div>
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Advisory Context Notes
                </h4>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {mentee.notes}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 block">
                  Declared Extracurriculars
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {mentee.hobbies.map((hb) => (
                    <span
                      key={hb}
                      className="text-[11px] font-semibold px-3 py-1 rounded-xl bg-slate-50 border border-slate-100 text-slate-600"
                    >
                      {hb}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Block: Goals & Recommended Modules */}
            <div className="bg-white rounded-[28px] p-6 md:p-8 border border-slate-100 shadow-premium space-y-5 flex flex-col justify-between">
              <div>
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Core Long-Term Ambitions
                </h4>
                <p className="text-sm font-space font-bold text-slate-900 leading-snug">
                  {mentee.longTermGoal || mentee.goal}
                </p>
              </div>

              {mentee.suggestedModules && mentee.suggestedModules.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-2.5 block">
                    Recommended Syllabus Mapping
                  </h4>
                  <div className="space-y-2">
                    {mentee.suggestedModules.map((mod) => (
                      <div
                        key={mod}
                        className="text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-blue-50/50 border border-blue-100/60 text-blue-900 leading-tight"
                      >
                        {mod}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: CRUD Editable Mentoring Logs Table */}
      {activeTab === 'logs' && (
        <div className="space-y-6 animate-fade-in">
          {/* Add New Session Inline Form */}
          <div className="bg-white rounded-[28px] p-6 md:p-8 border border-slate-100 shadow-premium">
            <h3 className="font-space font-bold text-slate-900 text-sm mb-4 flex items-center gap-2 tracking-tight">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>Author Audit Telemetry Log</span>
            </h3>
            
            <form onSubmit={handleAddSession} className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Session Topic / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shopping Framework Review & Selection"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Duration (Minutes)
                  </label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
                  >
                    <option value={15}>15 Mins</option>
                    <option value={30}>30 Mins (Standard)</option>
                    <option value={45}>45 Mins</option>
                    <option value={60}>60 Mins</option>
                    <option value={90}>90 Mins</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Pastoral Notes / Summary
                  </label>
                  <input
                    type="text"
                    placeholder="Brief summary of instructional advisory tone..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Core Realizations / Achievements
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mastered binary path search complexity"
                    value={newAchievements}
                    onChange={(e) => setNewAchievements(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Assigned Actions / Next Steps
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Link Google motivation form for processing"
                    value={newNextSteps}
                    onChange={(e) => setNewNextSteps(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0b1120] text-white hover:bg-slate-800 active:scale-95 transition-all text-xs font-bold shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Commit Session Record</span>
                </button>
              </div>
            </form>
          </div>

          {/* Table of existing logs */}
          <div className="bg-white rounded-[28px] border border-slate-100 shadow-premium overflow-hidden">
            <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Official Chronological Audit Trail
              </span>
              <span className="text-xs font-space font-bold text-slate-600">
                {mentee.totalMinutes || 0}m Disbursed
              </span>
            </div>

            {sessions.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400 font-medium">
                No session entries recorded yet. Author initial logs to unlock dynamic metrics.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sessions.map((session, index) => {
                  const isEditing = editingSessionId === session.id;
                  const sNum = session.sessionNumber || sessions.length - index;

                  return (
                    <div key={session.id} className="p-5 md:p-6 transition-colors hover:bg-slate-50/30">
                      {isEditing ? (
                        /* Live Row Edit State */
                        <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 animate-fade-in">
                          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                            <span className="text-xs font-space font-bold text-blue-600 tracking-tight">
                              Editing Telemetry Entry #{sNum}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => saveEdit(session.id)}
                                className="px-3 py-1 rounded-lg bg-[#0b1120] text-white text-[10px] font-bold hover:bg-slate-800 flex items-center gap-1 transition-all"
                              >
                                <Save className="w-3 h-3" /> Save Changes
                              </button>
                              <button
                                onClick={() => setEditingSessionId(null)}
                                className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] font-bold hover:bg-slate-50 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Topic</label>
                              <input
                                type="text"
                                value={editTopic}
                                onChange={(e) => setEditTopic(e.target.value)}
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-white font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</label>
                              <input
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-white font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</label>
                              <input
                                type="number"
                                value={editDuration}
                                onChange={(e) => setEditDuration(Number(e.target.value))}
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-white font-medium"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Summary Notes</label>
                            <input
                              type="text"
                              value={editSummary}
                              onChange={(e) => setEditSummary(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-white font-medium"
                            />
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Achievements</label>
                              <input
                                type="text"
                                value={editAchievements}
                                onChange={(e) => setEditAchievements(e.target.value)}
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-white font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Next Actions</label>
                              <input
                                type="text"
                                value={editNextSteps}
                                onChange={(e) => setEditNextSteps(e.target.value)}
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-white font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Standard Premium View Mode */
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-[10px] font-space font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                                #{sNum}
                              </span>
                              <h4 className="text-xs font-space font-bold text-slate-900 tracking-tight leading-tight">
                                {session.topic}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[11px] font-bold tracking-wide text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-blue-500" />
                                {session.duration}m
                              </span>
                              
                              {/* Action Triggers */}
                              <div className="flex items-center gap-0.5 opacity-40 hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditing(session)}
                                  className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                                  title="Edit Entry"
                                >
                                  <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
                                </button>
                                <button
                                  onClick={() => deleteSession(session.id)}
                                  className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors"
                                  title="Delete Entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-3">
                            Logged Date: {session.date}
                          </div>

                          {/* Summary text */}
                          {session.notes && (
                            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/60 p-3 rounded-xl border border-slate-100 mb-3">
                              {session.notes}
                            </p>
                          )}

                          {/* Secondary attributes row */}
                          {(session.achievements || session.nextSteps) && (
                            <div className="grid sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100/80 text-xs">
                              {session.achievements && (
                                <div className="bg-emerald-50/50 text-emerald-900 p-2.5 rounded-xl border border-emerald-100/60">
                                  <strong className="text-emerald-800 block font-bold text-[8px] tracking-widest uppercase mb-1">
                                    Core Realization:
                                  </strong>
                                  <span className="font-medium text-[11px]">{session.achievements}</span>
                                </div>
                              )}
                              {session.nextSteps && (
                                <div className="bg-blue-50/50 text-blue-900 p-2.5 rounded-xl border border-blue-100/60">
                                  <strong className="text-blue-800 block font-bold text-[8px] tracking-widest uppercase mb-1">
                                    Assigned Pipeline Action:
                                  </strong>
                                  <span className="font-medium text-[11px]">{session.nextSteps}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Persistent Text Scratchpad Drafting Area */}
      {activeTab === 'drafts' && (
        <div className="bg-white rounded-[28px] p-6 md:p-8 border border-slate-100 shadow-premium space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-space font-bold text-slate-900 text-sm tracking-tight">
                Dossier Scratchpad & Auto-Sync Engine
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Record informal guidance markers, specific syllabus suggestions, or pending message drafts. Changes persist natively in client LocalStorage arrays.
              </p>
            </div>
            <span className="text-[9px] font-bold text-blue-600 tracking-widest uppercase bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
              Persistent Memory
            </span>
          </div>

          <textarea
            rows={10}
            value={mentee.scratchpad || ''}
            onChange={(e) => onUpdateMenteeField('scratchpad', e.target.value)}
            placeholder="Type advisory communication blueprints, specific module codes, or preliminary pastoral advice here..."
            className="w-full text-xs p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans leading-relaxed resize-y transition-all"
          />

          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 tracking-wider pt-1">
            <span>Buffer length: {(mentee.scratchpad || '').length} characters</span>
            <span>Pointer target: {mentee.id}</span>
          </div>
        </div>
      )}
    </div>
  );
}
