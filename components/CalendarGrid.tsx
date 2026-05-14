import React, { useState } from 'react';
import type { CalendarEvent, Mentee } from '@/types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, AlertCircle, Sparkles, Trash2, CalendarDays } from 'lucide-react';

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
  // Start view around May 2026 to showcase the simulation date and immediate deadlines
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // Month is 0-indexed: 4 is May
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form States
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

  // Calendar Math: Note that getDay() returns 0 for Sunday, 1 for Monday.
  // Standardize grid to start on Monday for consistent international UI layout
  const firstDayRaw = new Date(year, month, 1).getDay();
  const firstDayOffset = firstDayRaw === 0 ? 6 : firstDayRaw - 1; // Number of blank cells before the 1st
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    // Pick a corresponding color token based on type or mentee
    let color = '#2563eb';
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

    // reset fields
    setEventTitle('');
    setEventDesc('');
  };

  // Generate blank leading days
  const blanks = Array.from({ length: firstDayOffset }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-7xl mx-auto">
      {/* Premium Command Banner */}
      <div className="bg-[#0b1120] rounded-[32px] p-6 md:p-10 text-white shadow-premium relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-10 pointer-events-none" />

        <div className="max-w-xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 font-bold text-[10px] tracking-widest uppercase">
            <CalendarDays className="w-3 h-3 text-blue-500" />
            <span>Master Time Matrix</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-space font-bold leading-tight tracking-tight text-slate-100">
            {monthNames[month]} {year} Framework
          </h1>
          
          <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed max-w-lg">
            Synchronized contract delivery view. Mapped events reflect strict client deadlines, simulated advisory meetings, and target salary allocation benchmarks.
          </p>
        </div>
      </div>

      {/* Month Navigation Controls */}
      <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-[#0b1120] hover:text-white transition-all shadow-sm"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="px-4 py-2 text-center min-w-[140px]">
            <span className="font-space font-bold text-slate-900 text-sm tracking-tight block">
              {monthNames[month]} {year}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-[#0b1120] hover:text-white transition-all shadow-sm"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-sm group"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3] group-hover:rotate-90 transition-transform" />
          <span>Author Calendar Tag</span>
        </button>
      </div>

      {/* Calendar Grid Body */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-premium overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid layout */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100/80 border-t border-slate-100">
          {/* Blank prefixes */}
          {blanks.map((b) => (
            <div key={`blank-${b}`} className="min-h-[100px] md:min-h-[130px] bg-slate-50/30 p-2" />
          ))}

          {/* Valid days */}
          {days.map((day) => {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter((ev) => ev.date === dateString);
            const isSimulatedCurrent = dateString === '2026-05-13';

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[100px] md:min-h-[130px] p-2 flex flex-col justify-between transition-colors relative group ${
                  isSimulatedCurrent ? 'bg-blue-50/30' : 'hover:bg-slate-50/40'
                }`}
              >
                {/* Day Marker */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-space font-bold w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      isSimulatedCurrent
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-700 group-hover:text-blue-600'
                    }`}
                  >
                    {day}
                  </span>
                  {isSimulatedCurrent && (
                    <span className="text-[7px] font-bold tracking-widest text-blue-600 uppercase bg-blue-100 px-1 rounded block">
                      Sim Date
                    </span>
                  )}
                </div>

                {/* Inline Events box */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-1.5 rounded-lg text-[10px] leading-tight transition-all relative group/ev border"
                      style={{
                        backgroundColor: `${ev.color}12`,
                        borderColor: `${ev.color}30`,
                        color: ev.type === 'deadline' ? '#dc2626' : '#0f172a',
                      }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold truncate" style={{ color: ev.color }}>
                          {ev.title}
                        </span>
                        
                        {/* Inline Delete badge button */}
                        {onDeleteEvent && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEvent(ev.id);
                            }}
                            className="opacity-0 group-hover/ev:opacity-100 p-0.5 text-slate-400 hover:text-red-600 transition-opacity absolute right-1 top-1 rounded bg-white shadow-xs"
                            title="Purge Event Tag"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      
                      {ev.time && (
                        <div className="text-[8px] text-slate-500 font-medium mt-0.5 truncate">
                          {ev.time} {ev.description ? `• ${ev.description}` : ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Fast author trigger helper icon on hover */}
                <button
                  onClick={() => {
                    setEventDate(dateString);
                    setShowAddModal(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 absolute bottom-1 right-1 w-4 h-4 rounded bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"
                  title="Author entry targeting this date"
                >
                  <Plus className="w-2.5 h-2.5 stroke-[3]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Calendar Event Overlay Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#0b1120]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-space font-bold text-slate-900 text-sm tracking-tight">
                Author Master Matrix Event
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Code formatting framework submission"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Category Tag
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as 'session' | 'task' | 'deadline')}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
                  >
                    <option value="session">Advisory Session</option>
                    <option value="task">Operational Task</option>
                    <option value="deadline">Critical Deadline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Mapped Mentee
                  </label>
                  <select
                    value={eventMenteeId}
                    onChange={(e) => setEventMenteeId(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
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
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Optional Description Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bring physical laptop for local build..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0b1120] hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Inject Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
