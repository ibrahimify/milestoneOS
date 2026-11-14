'use client';

import { useState } from 'react';
import type { WorkspaceData } from '@/types';
import Sidebar, { type View } from './Sidebar';
import TopBar from './TopBar';
import DashboardOverview from './DashboardOverview';
import CalendarGrid from './CalendarGrid';
import FinanceTracker from './FinanceTracker';
import MenteeGallery from './MenteeGallery';
import MenteeDossier from './MenteeDossier';
import SyllabusCatalogue from './SyllabusCatalogue';
import AdminAccounts from './AdminAccounts';
import { Dialog } from './Forms';

export default function Workspace({ data, initialView }: { data: WorkspaceData; initialView?: string }) {
  const admin = data.profile.role === 'admin';
  const [view, setView] = useState<View>(admin && initialView === 'admin' ? 'admin' : 'dashboard');
  const [selected, setSelected] = useState<string>();
  const [selectedSession, setSelectedSession] = useState<string>();
  const [menu, setMenu] = useState(false);
  const mentee = data.mentees.find(({ id }) => id === selected);
  function navigate(target: View) {
    setView(target);
    setMenu(false);
    setSelected(undefined);
    setSelectedSession(undefined);
  }
  function openMentee(id: string, sessionId?: string) {
    navigate('mentees');
    setSelected(id);
    setSelectedSession(sessionId);
  }
  const sidebar = <Sidebar view={view} navigate={navigate} admin={admin} />;
  return <div className="workspace">
    <aside className="desktop-sidebar">{sidebar}</aside>
    {menu && <Dialog title="Navigation" close={() => setMenu(false)}>{sidebar}</Dialog>}
    <div className="workspace-content">
      <TopBar nickname={data.profile.nickname} minutes={data.sessions.reduce((total, session) => total + session.duration, 0)} onOpen={() => setMenu(true)} />
      <main className="main-view workspace-enter" key={view + (selected ?? '') + (selectedSession ?? '')}>
        {view === 'dashboard' && <DashboardOverview data={data} navigate={navigate} openMentee={openMentee} />}
        {view === 'mentees' && (mentee
          ? <MenteeDossier key={mentee.id} mentee={mentee} modules={data.modules} sessions={data.sessions.filter((session) => session.mentee_id === mentee.id)}
              initialSession={selectedSession} back={() => navigate('mentees')} />
          : <MenteeGallery mentees={data.mentees} sessions={data.sessions} openMentee={openMentee} profile={data.profile} />)}
        {view === 'calendar' && <CalendarGrid events={data.events} mentees={data.mentees} admin={admin} />}
        {view === 'finance' && <FinanceTracker finance={data.finance} payments={data.payments} />}
        {view === 'modules' && <SyllabusCatalogue modules={data.modules} categories={data.categories} admin={admin} />}
        {view === 'admin' && admin && <AdminAccounts accounts={data.accounts} />}
      </main>
    </div>
  </div>;
}
