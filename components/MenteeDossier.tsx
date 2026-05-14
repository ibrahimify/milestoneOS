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
  Target,
  Sparkles,
  Atom,
  Compass,
  Terminal,
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
  const [activeTab, setActiveTab] = useState<'profile' | 'logs'>('profile');

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

  const [newTopic, setNewTopic] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDuration, setNewDuration] = useState(30);
  const [newSummary, setNewSummary] = useState('');

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTopic, setEditTopic] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDuration, setEditDuration] = useState(30);
  const [editSummary, setEditSummary] = useState('');

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
      completed: true,
    };

    const updatedSessions = [created, ...sessions];
    onUpdateSessions(updatedSessions);

    const newTotalMinutes = updatedSessions.reduce((sum, s) => sum + s.duration, 0);
    onUpdateMenteeField('totalMinutes', newTotalMinutes);

    setNewTopic('');
    setNewSummary('');
  };

  const startEditing = (s: Session) => {
    setEditingSessionId(s.id);
    setEditTopic(s.topic);
    setEditDate(s.date);
    setEditDuration(s.duration);
    setEditSummary(s.notes);
  };

  const saveEdit = (id: string) => {
    const updatedSessions = sessions.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          topic: editTopic.trim(),
          date: editDate,
          duration: Number(editDuration) || 30,
          notes: editSummary.trim(),
        };
      }
      return s;
    });

    onUpdateSessions(updatedSessions);
    const newTotalMinutes = updatedSessions.reduce((sum, s) => sum + s.duration, 0);
    onUpdateMenteeField('totalMinutes', newTotalMinutes);
    setEditingSessionId(null);
  };

  const deleteSession = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this session log?')) return;
    const updatedSessions = sessions.filter((s) => s.id !== id);
    onUpdateSessions(updatedSessions);
    const newTotalMinutes = updatedSessions.reduce((sum, s) => sum + s.duration, 0);
    onUpdateMenteeField('totalMinutes', newTotalMinutes);
  };

  return (
    <div className="space-y-8 animate-slide-up select-none max-w-5xl mx-auto">
      {/* Navigation header */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-100 text-slate-900 font-space font-bold text-xs hover:bg-slate-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        <span>Back to Gallery</span>
      </button>

      {/* Huge bold Dossier Header Container */}
      <div className="bg-[#0b1120] rounded-[32px] p-8 md:p-12 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              {renderMenteeIcon(mentee.avatar || 'Sparkles', 'w-5 h-5 stroke-[2]')}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Student Profile • {mentee.yearGroup}
              </span>
              <h1 className="text-4xl md:text-5xl font-space font-bold tracking-tight text-white">
                {mentee.name}
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-400 font-medium">
            {mentee.subject}
          </p>
        </div>

        {/* Clean right side stats */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-right w-full sm:w-auto">
          <span className="text-xs text-slate-400 block mb-1">Total Delivery</span>
          <div className="text-3xl font-space font-bold text-white">
            {mentee.totalMinutes || 0}m <span className="text-xs font-normal text-slate-400">/ 720m</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-2">
        {(['profile', 'logs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-space font-bold text-xs capitalize transition-colors ${activeTab === tab
                ? 'bg-[#0b1120] text-white'
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            {tab === 'profile' ? 'Core Targets & Status' : 'Session History Logs'}
          </button>
        ))}
      </div>

      {/* Profile Tab Body */}
      {activeTab === 'profile' && (
        <div className="grid sm:grid-cols-2 gap-8">
          {/* Target goal */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                <Target className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                <span>Primary Milestone Objective</span>
              </div>
              <textarea
                value={mentee.goal}
                onChange={(e) => onUpdateMenteeField('goal', e.target.value)}
                rows={3}
                className="w-full text-lg font-space font-bold text-slate-900 focus:outline-none resize-none border-b border-slate-50 pb-2"
                placeholder="Set targeted outcome..."
              />
            </div>
            <p className="text-xs text-slate-400 font-medium mt-6">
              Updates persist directly to active telemetry framework.
            </p>
          </div>

          {/* Quick Info actions */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
                Communication Links
              </span>

              <div className="space-y-3">
                <a
                  href={`mailto:${mentee.email}`}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-colors text-xs font-space font-bold text-slate-900"
                >
                  <span className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400 stroke-[2]" />
                    <span>{mentee.email}</span>
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 stroke-[2]" />
                </a>

                {mentee.skeddaLink && mentee.skeddaLink !== 'N/A' && (
                  <a
                    href={mentee.skeddaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-colors text-xs font-space font-bold text-slate-900"
                  >
                    <span className="flex items-center gap-3">
                      <ExternalLink className="w-4 h-4 text-slate-400 stroke-[2]" />
                      <span>Skedda Scheduling Hub</span>
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 stroke-[2]" />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 text-xs text-slate-400 font-medium">
              Line capacity strictly bound to instructional caps.
            </div>
          </div>
        </div>
      )}

      {/* Session Logs Tab Body */}
      {activeTab === 'logs' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Log Column */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 h-fit space-y-6">
            <h3 className="text-xl font-space font-bold text-slate-900 tracking-tight">
              Log Session
            </h3>

            <form onSubmit={handleAddSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Topic Covered
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical document formatting..."
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-space font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-space font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-space font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Session Audit Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Summarize instructional breakthroughs..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full text-sm p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 focus:outline-none resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0b1120] text-white text-xs font-space font-bold hover:bg-slate-900 transition-colors"
              >
                Submit Audit Entry
              </button>
            </form>
          </div>

          {/* List of past sessions */}
          <div className="lg:col-span-2 space-y-4">
            {sessions.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 text-slate-400 text-sm font-medium">
                No session logs authored for this student pipeline yet.
              </div>
            ) : (
              sessions.map((s) => {
                const isEditing = editingSessionId === s.id;
                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-3xl p-8 border border-slate-100 transition-all space-y-4"
                  >
                    {isEditing ? (
                      <div className="space-y-4 border-b border-slate-50 pb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-space font-bold text-blue-600 uppercase">
                            Editing Entry #{s.sessionNumber}
                          </span>
                          <button
                            onClick={() => setEditingSessionId(null)}
                            className="text-xs font-space font-bold text-slate-400"
                          >
                            Cancel
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-bold">Topic</label>
                          <input
                            type="text"
                            value={editTopic}
                            onChange={(e) => setEditTopic(e.target.value)}
                            className="w-full text-sm p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-space font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1 font-bold">Date</label>
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="w-full text-sm p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-space font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1 font-bold">Minutes</label>
                            <input
                              type="number"
                              value={editDuration}
                              onChange={(e) => setEditDuration(Number(e.target.value))}
                              className="w-full text-sm p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-space font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-bold">Notes</label>
                          <textarea
                            value={editSummary}
                            onChange={(e) => setEditSummary(e.target.value)}
                            rows={3}
                            className="w-full text-sm p-2.5 rounded-xl bg-slate-50 border border-slate-100 resize-none font-medium"
                          />
                        </div>

                        <button
                          onClick={() => saveEdit(s.id)}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-space font-bold text-xs"
                        >
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-space font-bold text-slate-400 block">
                                #{s.sessionNumber}
                              </span>
                              <span className="text-xs font-space font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                {s.date}
                              </span>
                              <span className="text-xs font-space font-bold text-slate-400">
                                {s.duration} mins
                              </span>
                            </div>

                            <h4 className="text-xl font-space font-bold text-slate-900 tracking-tight leading-snug">
                              {s.topic}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditing(s)}
                              className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                              title="Edit Entry"
                            >
                              <Edit2 className="w-4 h-4 stroke-[2]" />
                            </button>
                            <button
                              onClick={() => deleteSession(s.id)}
                              className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                              title="Delete Entry"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2]" />
                            </button>
                          </div>
                        </div>

                        {s.notes && (
                          <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                            {s.notes}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
