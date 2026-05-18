import React, { useState } from 'react';
import type { Mentee, Session } from '@/types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit2,
  ExternalLink,
  Mail,
  Save,
  Sparkles,
  Trash2,
  Target,
  BookOpen,
  Brain,
  Timer,
  Plus,
  UserRound,
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
  const [newTopic, setNewTopic] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDuration, setNewDuration] = useState(30);
  const [newSummary, setNewSummary] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTopic, setEditTopic] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDuration, setEditDuration] = useState(30);
  const [editSummary, setEditSummary] = useState('');

  const updateListField = (field: 'hobbies' | 'suggestedModules' | 'dislikes', value: string) => {
    onUpdateMenteeField(
      field,
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    );
  };

  const updateSelectedModules = (value: string) => {
    onUpdateMenteeField(
      'selectedModules',
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    );
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const created: Session = {
      id: `s-${Date.now()}`,
      menteeId: mentee.id,
      sessionNumber: sessions.length + 1,
      date: newDate,
      time: new Date().toTimeString().split(' ')[0].slice(0, 5),
      duration: Number(newDuration) || 30,
      topic: newTopic.trim(),
      notes: newSummary.trim(),
      completed: true,
    };

    const updatedSessions = [created, ...sessions];
    onUpdateSessions(updatedSessions);
    onUpdateMenteeField('totalMinutes', updatedSessions.reduce((sum, s) => sum + s.duration, 0));
    setNewTopic('');
    setNewSummary('');
  };

  const startEditing = (session: Session) => {
    setEditingSessionId(session.id);
    setEditTopic(session.topic);
    setEditDate(session.date);
    setEditDuration(session.duration);
    setEditSummary(session.notes);
  };

  const saveEdit = (id: string) => {
    const updatedSessions = sessions.map((session) =>
      session.id === id
        ? {
            ...session,
            topic: editTopic.trim(),
            date: editDate,
            duration: Number(editDuration) || 30,
            notes: editSummary.trim(),
          }
        : session,
    );

    onUpdateSessions(updatedSessions);
    onUpdateMenteeField('totalMinutes', updatedSessions.reduce((sum, s) => sum + s.duration, 0));
    setEditingSessionId(null);
  };

  const deleteSession = (id: string) => {
    if (!window.confirm('Delete this session log?')) return;
    const updatedSessions = sessions.filter((session) => session.id !== id);
    onUpdateSessions(updatedSessions);
    onUpdateMenteeField('totalMinutes', updatedSessions.reduce((sum, s) => sum + s.duration, 0));
  };

  const loggedPct = Math.min(100, Math.round(((mentee.totalMinutes || 0) / 720) * 100));

  return (
    <div className="space-y-7 animate-slide-up select-none">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/44 px-5 py-3 text-xs font-space font-bold text-slate-800 backdrop-blur-xl transition hover:bg-white/70"
      >
        <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        <span>Back to Gallery</span>
      </button>

      <div className="glass-panel-dark relative overflow-hidden rounded-[32px] p-7 text-white md:p-10">
        <div className="absolute -right-14 -top-14 h-56 w-56 rounded-full blur-3xl" style={{ backgroundColor: `${mentee.color}33` }} />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-white/14 bg-white/10 text-white">
                <UserRound className="h-6 w-6 stroke-[2]" />
              </div>
              <div>
              <span className="text-xs font-bold text-white/45 block uppercase tracking-[0.2em]">
                  {mentee.yearGroup} / {mentee.status || 'Active profile'}
                </span>
                <h1 className="text-4xl md:text-5xl font-space font-bold tracking-tight">
                  {mentee.name}
                </h1>
              </div>
            </div>
            <p className="text-sm text-slate-200/70 leading-relaxed">
              {mentee.subject}
            </p>
          </div>

          <div className="w-full rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-xl lg:w-72">
            <div className="flex items-center justify-between text-xs font-space font-bold text-white/60">
              <span>Total delivery</span>
              <span>{loggedPct}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/12">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-300 via-lime-200 to-[#ff6b6b]"
                style={{ width: `${loggedPct}%` }}
              />
            </div>
            <div className="mt-4 text-3xl font-space font-bold">
              {mentee.totalMinutes || 0}m
              <span className="text-xs font-normal text-white/45"> / 720m</span>
            </div>
          </div>
        </div>
      </div>

      <div className="inline-flex rounded-2xl border border-white/60 bg-white/40 p-1 backdrop-blur-xl">
        {(['profile', 'logs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-5 py-2.5 font-space text-xs font-bold capitalize transition ${
              activeTab === tab ? 'glow-button' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            {tab === 'profile' ? 'Profile + Goals' : 'Session Logs'}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
            <ProfileField
              icon={<Target className="h-4 w-4" />}
              label="Main future goal"
              value={mentee.goal}
              rows={4}
              onChange={(value) => onUpdateMenteeField('goal', value)}
            />
            <ProfileField
              icon={<Brain className="h-4 w-4" />}
              label="Long-term profile"
              value={mentee.longTermGoal || ''}
              rows={4}
              onChange={(value) => onUpdateMenteeField('longTermGoal', value)}
            />
            <ProfileField
              icon={<Sparkles className="h-4 w-4" />}
              label="Main interests"
              value={mentee.hobbies.join(', ')}
              rows={4}
              onChange={(value) => updateListField('hobbies', value)}
            />
            <ProfileField
              icon={<Target className="h-4 w-4" />}
              label="Dislikes / avoid"
              value={(mentee.dislikes || []).join(', ')}
              rows={3}
              onChange={(value) => updateListField('dislikes', value)}
            />
            <ProfileField
              icon={<BookOpen className="h-4 w-4" />}
              label="Module recommendations"
              value={(mentee.suggestedModules || []).join(', ')}
              rows={4}
              onChange={(value) => updateListField('suggestedModules', value)}
            />
            <ProfileField
              icon={<BookOpen className="h-4 w-4" />}
              label="Selected modules"
              value={(mentee.selectedModules || []).join(', ')}
              rows={3}
              onChange={updateSelectedModules}
            />
            <ProfileField
              icon={<BookOpen className="h-4 w-4" />}
              label="Module guidance"
              value={mentee.moduleGuidance || ''}
              rows={4}
              onChange={(value) => onUpdateMenteeField('moduleGuidance', value)}
            />
            <ProfileField
              icon={<Target className="h-4 w-4" />}
              label="Next milestone"
              value={mentee.nextMilestone}
              rows={3}
              onChange={(value) => onUpdateMenteeField('nextMilestone', value)}
            />
            <ProfileField
              icon={<Calendar className="h-4 w-4" />}
              label="Meeting schedule"
              value={mentee.meetingSchedule || mentee.nextMeetingPreference || ''}
              rows={3}
              onChange={(value) => onUpdateMenteeField('meetingSchedule', value)}
            />
            <ProfileField
              icon={<Edit2 className="h-4 w-4" />}
              label="Mentor private notes"
              value={mentee.notes}
              rows={3}
              onChange={(value) => onUpdateMenteeField('notes', value)}
            />
          </div>

          <div className="space-y-6">
            <div className="liquid-card rounded-[30px] p-6">
              <div className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Communication
              </div>
              <div className="space-y-3">
                <a
                  href={`mailto:${mentee.email}`}
                  className="flex items-center justify-between rounded-2xl bg-white/48 p-4 text-xs font-space font-bold text-slate-900 transition hover:bg-white/76"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Mail className="h-4 w-4 text-teal-700" />
                    <span className="truncate">{mentee.email}</span>
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>

                {mentee.skeddaLink && mentee.skeddaLink !== 'N/A' && (
                  <a
                    href={mentee.skeddaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl bg-white/48 p-4 text-xs font-space font-bold text-slate-900 transition hover:bg-white/76"
                  >
                    <span className="flex items-center gap-3">
                      <Timer className="h-4 w-4 text-[#ff6b6b]" />
                      <span>Scheduling hub</span>
                    </span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                )}
              </div>
            </div>

            <div className="liquid-card rounded-[30px] p-6">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                <Edit2 className="h-4 w-4 text-teal-700" />
                Scratchpad
              </div>
              <textarea
                value={mentee.scratchpad}
                onChange={(e) => onUpdateMenteeField('scratchpad', e.target.value)}
                rows={8}
                className="glass-input w-full resize-none rounded-2xl p-4 text-sm leading-relaxed text-slate-800 outline-none"
                placeholder="Draft suggestions, questions, and next-message notes..."
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="liquid-card h-fit rounded-[30px] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-space font-bold text-slate-950 tracking-tight">
                  Log session
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Adds minutes to this mentee automatically.
                </p>
              </div>
              <Plus className="h-5 w-5 text-teal-700" />
            </div>

            <form onSubmit={handleAddSession} className="space-y-4">
              <FieldLabel label="What we talked about" />
              <input
                type="text"
                required
                placeholder="e.g. Module shortlist and profile direction"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-space font-bold text-slate-900 outline-none"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel label="Date" />
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-space font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <FieldLabel label="Minutes" />
                  <input
                    type="number"
                    min="1"
                    max="300"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="glass-input w-full rounded-2xl px-4 py-3 text-sm font-space font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <FieldLabel label="What I suggested" />
              <textarea
                rows={5}
                placeholder="Write summary, suggestions, modules, and next steps..."
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="glass-input w-full resize-none rounded-2xl p-4 text-sm text-slate-800 outline-none"
              />

              <button
                type="submit"
                className="glow-button w-full rounded-2xl py-3.5 text-xs font-space font-bold transition"
              >
                Save Log Entry
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {sessions.length === 0 ? (
              <div className="liquid-card rounded-[30px] p-12 text-center text-sm text-slate-500">
                No session logs yet.
              </div>
            ) : (
              sessions.map((session) => {
                const isEditing = editingSessionId === session.id;
                return (
                  <div key={session.id} className="liquid-card rounded-[30px] p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-space font-bold text-teal-700 uppercase">
                            Editing entry #{session.sessionNumber}
                          </span>
                          <button
                            onClick={() => setEditingSessionId(null)}
                            className="text-xs font-space font-bold text-slate-500"
                          >
                            Cancel
                          </button>
                        </div>

                        <input
                          type="text"
                          value={editTopic}
                          onChange={(e) => setEditTopic(e.target.value)}
                          className="glass-input w-full rounded-2xl p-3 text-sm font-space font-bold outline-none"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="glass-input w-full rounded-2xl p-3 text-sm font-space font-bold outline-none"
                          />
                          <input
                            type="number"
                            value={editDuration}
                            onChange={(e) => setEditDuration(Number(e.target.value))}
                            className="glass-input w-full rounded-2xl p-3 text-sm font-space font-bold outline-none"
                          />
                        </div>
                        <textarea
                          value={editSummary}
                          onChange={(e) => setEditSummary(e.target.value)}
                          rows={4}
                          className="glass-input w-full resize-none rounded-2xl p-3 text-sm outline-none"
                        />
                        <button
                          onClick={() => saveEdit(session.id)}
                          className="glow-button inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-space font-bold"
                        >
                          <Save className="h-4 w-4" />
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-space font-bold">
                              <span className="rounded-full bg-white/56 px-3 py-1 text-slate-500">
                                #{session.sessionNumber}
                              </span>
                              <span className="rounded-full bg-white/56 px-3 py-1 text-slate-700">
                                {session.date}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-white/56 px-3 py-1 text-teal-700">
                                <Clock className="h-3 w-3" />
                                {session.duration} mins
                              </span>
                            </div>
                            <h4 className="text-xl font-space font-bold text-slate-950 tracking-tight leading-snug">
                              {session.topic}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEditing(session)}
                              className="rounded-xl p-2 text-slate-400 transition hover:bg-white/60 hover:text-slate-950"
                              title="Edit Entry"
                            >
                              <Edit2 className="w-4 h-4 stroke-[2]" />
                            </button>
                            <button
                              onClick={() => deleteSession(session.id)}
                              className="rounded-xl p-2 text-slate-400 transition hover:bg-white/60 hover:text-red-600"
                              title="Delete Entry"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2]" />
                            </button>
                          </div>
                        </div>

                        {session.notes && (
                          <p className="rounded-2xl bg-white/48 p-4 text-sm leading-relaxed text-slate-600">
                            {session.notes}
                          </p>
                        )}
                      </div>
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

function FieldLabel({ label }: { label: string }) {
  return (
    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
      {label}
    </label>
  );
}

function ProfileField({
  icon,
  label,
  value,
  rows,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <div className="liquid-card rounded-[30px] p-6">
      <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        <span className="text-teal-700">{icon}</span>
        <span>{label}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="glass-input w-full resize-none rounded-2xl p-4 text-sm leading-relaxed text-slate-800 outline-none"
        placeholder={`Add ${label.toLowerCase()}...`}
      />
    </div>
  );
}
