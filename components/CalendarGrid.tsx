import React, { useState } from 'react';
import type { CalendarEvent, Mentee } from '@/types';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

interface CalendarGridProps {
  events: CalendarEvent[];
  mentees: Mentee[];
  onAddEvent: (newEvent: CalendarEvent) => void;
  onDeleteEvent?: (id: string) => void;
}

export default function CalendarGrid({
  events,
  mentees,
  onAddEvent,
  onDeleteEvent,
}: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); 
  const [showAddModal, setShowAddModal] = useState(false);

  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-05-18');
  const [eventTime, setEventTime] = useState('17:00');
  const [eventType, setEventType] = useState<'session' | 'task' | 'deadline'>('session');
  const [eventMenteeId, setEventMenteeId] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayRaw = new Date(year, month, 1).getDay();
  const firstDayOffset = firstDayRaw === 0 ? 6 : firstDayRaw - 1; 
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    let color = '#0b1120';
    if (eventType === 'deadline') color = '#dc2626';
    else if (eventMenteeId) {
      const found = mentees.find((m) => m.id === eventMenteeId);
      if (found) color = found.color;
    }

    const created: CalendarEvent = {
      id: `ev-${Date.now()}`,
      date: eventDate,
      title: eventTitle.trim(),
      type: eventType,
      menteeId: eventMenteeId || undefined,
      color,
      time: eventTime || undefined,
      description: eventDesc.trim() || undefined,
    };

    onAddEvent(created);
    setShowAddModal(false);

    setEventTitle('');
    setEventDesc('');
  };

  const blanks = Array.from({ length: firstDayOffset }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-7 animate-fade-in select-none">
      {/* Huge pure black header banner */}
      <div className="glass-panel-dark relative overflow-hidden rounded-[32px] p-7 text-white md:p-10">
        <div className="absolute -right-14 -bottom-14 h-56 w-56 rounded-full bg-teal-300/14 blur-3xl" />
        <div className="max-w-2xl space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-lime-100/80">
            Calendar sync
          </p>
          <h1 className="text-4xl md:text-6xl font-space font-bold leading-tight tracking-tight text-white">
            {monthNames[month]} {year}
          </h1>
          <p className="text-sm text-slate-200/70 font-medium max-w-lg leading-relaxed">
            Map advisory sessions, module deadlines, and personal follow-ups beside the mentee records.
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="liquid-card rounded-[30px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-3 rounded-2xl hover:bg-white/60 text-slate-900 transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2]" />
          </button>
          
          <div className="px-4 py-2 text-center min-w-[140px]">
            <span className="font-space font-bold text-slate-900 text-base tracking-tight block">
              {monthNames[month]} {year}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-3 rounded-2xl hover:bg-white/60 text-slate-900 transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="glow-button inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-space font-bold text-xs transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Grid Matrix Body */}
      <div className="liquid-card rounded-[30px] overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-white/50 bg-white/32 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="py-4 text-xs font-space font-bold text-slate-400 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Matrix Cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-white/50">
          {blanks.map((b) => (
            <div key={`blank-${b}`} className="min-h-[120px] bg-white/16 p-3" />
          ))}

          {days.map((day) => {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter((ev) => ev.date === dateString);
            const isSimulatedCurrent = dateString === '2026-05-18';

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[120px] p-3 flex flex-col justify-between transition-colors relative group ${
                  isSimulatedCurrent ? 'bg-lime-100/32' : 'hover:bg-white/36'
                }`}
              >
                {/* Day Text marker */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-space font-bold text-sm ${
                      isSimulatedCurrent ? 'text-teal-700' : 'text-slate-900'
                    }`}
                  >
                    {day}
                  </span>
                  {isSimulatedCurrent && (
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                  )}
                </div>

                {/* Event tags */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2 rounded-xl text-xs transition-colors relative group/ev border border-white/50 backdrop-blur"
                      style={{
                        backgroundColor: ev.type === 'deadline' ? 'rgba(254, 242, 242, 0.76)' : 'rgba(255, 255, 255, 0.58)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className="font-space font-bold truncate block text-slate-900"
                          style={{ color: ev.type === 'deadline' ? '#dc2626' : '#0b1120' }}
                        >
                          {ev.title}
                        </span>

                        {onDeleteEvent && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEvent(ev.id);
                            }}
                            className="opacity-0 group-hover/ev:opacity-100 text-slate-300 hover:text-red-600 transition-opacity absolute right-1.5 top-1.5"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3 h-3 stroke-[2]" />
                          </button>
                        )}
                      </div>

                      {ev.time && (
                        <div className="text-[10px] text-slate-400 font-medium mt-1 truncate">
                          {ev.time} {ev.description ? `- ${ev.description}` : ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Instant Create plus button */}
                <button
                  onClick={() => {
                    setEventDate(dateString);
                    setShowAddModal(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 absolute bottom-2 right-2 w-6 h-6 rounded-lg bg-white/70 text-slate-600 hover:bg-slate-950 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal Dialog Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/62 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel rounded-[30px] p-8 max-w-md w-full space-y-6">
            <div className="flex items-center justify-between border-b border-white/50 pb-4">
              <h3 className="text-lg font-space font-bold text-slate-900 tracking-tight">
                Add Event
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-space font-bold text-slate-400 hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Code formatting framework..."
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="glass-input w-full text-sm px-4 py-3 rounded-2xl text-slate-900 focus:outline-none font-space font-bold"
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
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="glass-input w-full text-sm px-4 py-3 rounded-2xl text-slate-900 focus:outline-none font-space font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="glass-input w-full text-sm px-4 py-3 rounded-2xl text-slate-900 focus:outline-none font-space font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as 'session' | 'task' | 'deadline')}
                    className="glass-input w-full text-sm px-4 py-3 rounded-2xl text-slate-900 focus:outline-none font-space font-bold"
                  >
                    <option value="session">Session</option>
                    <option value="task">Task</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Mentee
                  </label>
                  <select
                    value={eventMenteeId}
                    onChange={(e) => setEventMenteeId(e.target.value)}
                    className="glass-input w-full text-sm px-4 py-3 rounded-2xl text-slate-900 focus:outline-none font-space font-bold"
                  >
                    <option value="">General Roster</option>
                    {mentees.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Optional context..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="glass-input w-full text-sm px-4 py-3 rounded-2xl text-slate-900 focus:outline-none font-space font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 rounded-2xl bg-white/48 text-slate-500 text-xs font-space font-bold hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glow-button px-5 py-3 rounded-2xl text-xs font-space font-bold transition"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
