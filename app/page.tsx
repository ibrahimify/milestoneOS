'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  defaultMentees,
  defaultSessions,
  defaultSalary,
  defaultCalendarEvents,
  STORAGE_KEYS,
  initializeLocalStorageState,
} from '@/lib/mockData';
import type { Mentee, Session, CalendarEvent, MonthlySalary } from '@/types';

// Import newly authored high-fidelity views
import IPodClassic from '@/components/IPodClassic';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DashboardOverview from '@/components/DashboardOverview';
import MenteeGallery from '@/components/MenteeGallery';
import MenteeDossier from '@/components/MenteeDossier';
import CalendarGrid from '@/components/CalendarGrid';
import FinanceTracker from '@/components/FinanceTracker';
import SyllabusCatalogue from '@/components/SyllabusCatalogue';

export default function App() {
  const [isClient, setIsClient] = useState(false);

  // Active navigational tracking
  const [currentView, setCurrentView] = useState<string>('login');
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);

  // Global state arrays linked directly to client storage engine
  const [mentees, setMentees] = useState<Mentee[]>(defaultMentees);
  const [sessions, setSessions] = useState<Session[]>(defaultSessions);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(defaultCalendarEvents);
  const [salary, setSalary] = useState<MonthlySalary>(defaultSalary);

  // Mobile menu control toggle
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Client bootstrap synchronization hook
  useEffect(() => {
    setIsClient(true);
    initializeLocalStorageState();

    // Pull Mentees
    const storedMentees = localStorage.getItem(STORAGE_KEYS.MENTEES);
    if (storedMentees) {
      try {
        setMentees(JSON.parse(storedMentees));
      } catch (e) {
        console.error('Failed parsing stored mentees', e);
      }
    }

    // Pull Sessions
    const storedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (storedSessions) {
      try {
        setSessions(JSON.parse(storedSessions));
      } catch (e) {
        console.error('Failed parsing stored sessions', e);
      }
    }


    // Pull Calendar Events
    const storedCalendar = localStorage.getItem(STORAGE_KEYS.CALENDAR);
    if (storedCalendar) {
      try {
        setCalendarEvents(JSON.parse(storedCalendar));
      } catch (e) {
        console.error('Failed parsing stored calendar events', e);
      }
    }

    // Pull sticky Salary states if available
    const storedSalary = localStorage.getItem('milestone_os_salary_v1');
    if (storedSalary) {
      try {
        setSalary(JSON.parse(storedSalary));
      } catch (e) {
        console.error('Failed parsing stored salary', e);
      }
    }
  }, []);

  // Compute total collective logged minutes across all students
  const totalLoggedMinutes = mentees.reduce((sum, m) => sum + (m.totalMinutes || 0), 0);

  // Navigation callbacks
  const handleNavigate = useCallback((viewId: string) => {
    setCurrentView(viewId);
    setSelectedMenteeId(null);
    setMobileNavOpen(false); // close mobile overlays
  }, []);

  const handleSelectMentee = useCallback((id: string) => {
    setSelectedMenteeId(id);
    setCurrentView('mentee-dossier');
    setMobileNavOpen(false);
  }, []);

  // Synchronizers
  const handleUpdateSessions = useCallback((updatedSessions: Session[]) => {
    setSessions(updatedSessions);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));
    }
  }, []);

  const handleUpdateMenteeField = useCallback((id: string, field: keyof Mentee, value: unknown) => {
    setMentees((prev) => {
      const next = prev.map((m) => {
        if (m.id === id) {
          return { ...m, [field]: value };
        }
        return m;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.MENTEES, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const handleAddCalendarEvent = useCallback((newEvent: CalendarEvent) => {
    setCalendarEvents((prev) => {
      const next = [newEvent, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const handleDeleteCalendarEvent = useCallback((eventId: string) => {
    setCalendarEvents((prev) => {
      const next = prev.filter((e) => e.id !== eventId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const handleTogglePayment = useCallback((paymentId: string) => {
    setSalary((prev) => {
      const updatedPayments = prev.payments.map((p) => {
        if (p.id === paymentId) {
          return { ...p, received: !p.received };
        }
        return p;
      });
      const next: MonthlySalary = { ...prev, payments: updatedPayments };
      if (typeof window !== 'undefined') {
        localStorage.setItem('milestone_os_salary_v1', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // Avoid SSR hydration layout flash
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Phase 1: Entry / Login state via immersive iPod Classic UI wrapper
  if (currentView === 'login') {
    return (
      <IPodClassic
        onEnterDashboard={() => handleNavigate('dashboard')}
        onQuickView={() => handleNavigate('mentees')}
        onFinance={() => handleNavigate('finance')}
      />
    );
  }

  // Find targeted mentee record if viewing dossier details directly
  const selectedMenteeRecord = mentees.find((m) => m.id === selectedMenteeId);
  const selectedMenteeSessions = selectedMenteeRecord
    ? sessions.filter((s) => s.menteeId === selectedMenteeRecord.id)
    : [];

  // Phase 2: Modern Professional Operating System Experience
  return (
    <div className="liquid-os min-h-screen flex flex-col md:flex-row relative">
      {/* Desktop Persistent Sidebar */}
      <Sidebar
        currentView={currentView === 'mentee-dossier' ? 'mentees' : currentView}
        onNavigate={handleNavigate}
        onBackToIPod={() => setCurrentView('login')}
      />

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/42 backdrop-blur-md"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative w-72 max-w-xs bg-white h-full shadow-2xl flex flex-col z-50">
            {/* Direct load instance */}
            <div className="p-4 border-b border-white/40 flex justify-between items-center">
              <span className="font-space font-bold text-sm">Navigation</span>
              <button onClick={() => setMobileNavOpen(false)} className="text-slate-400 font-bold">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                currentView={currentView === 'mentee-dossier' ? 'mentees' : currentView}
                onNavigate={handleNavigate}
                onBackToIPod={() => setCurrentView('login')}
                isMobile={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Primary Right Hand Layout Pane */}
      <div className="relative z-10 flex-1 flex flex-col md:pl-[19rem] min-w-0">
        <TopBar
          totalLoggedMinutes={totalLoggedMinutes}
          onOpenSidebar={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {/* Active View Router Orchestration */}
          {currentView === 'dashboard' && (
            <DashboardOverview
              mentees={mentees}
              sessions={sessions}
              salary={salary}
              calendarEvents={calendarEvents}
              onNavigate={handleNavigate}
              onSelectMentee={handleSelectMentee}
            />
          )}

          {currentView === 'mentees' && (
            <MenteeGallery
              mentees={mentees}
              onSelectMentee={handleSelectMentee}
            />
          )}

          {currentView === 'mentee-dossier' && selectedMenteeRecord && (
            <MenteeDossier
              mentee={selectedMenteeRecord}
              sessions={selectedMenteeSessions}
              onBack={() => handleNavigate('mentees')}
              onUpdateSessions={handleUpdateSessions}
              onUpdateMenteeField={(field, val) =>
                handleUpdateMenteeField(selectedMenteeRecord.id, field, val)
              }
            />
          )}

          {currentView === 'calendar' && (
            <CalendarGrid
              events={calendarEvents}
              mentees={mentees}
              onAddEvent={handleAddCalendarEvent}
              onDeleteEvent={handleDeleteCalendarEvent}
            />
          )}

          {currentView === 'finance' && (
            <FinanceTracker
              salary={salary}
              onTogglePayment={handleTogglePayment}
            />
          )}

          {currentView === 'resources' && <SyllabusCatalogue />}
        </main>
      </div>
    </div>
  );
}
