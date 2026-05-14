import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  Smartphone,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onBackToIPod: () => void;
  isMobile?: boolean;
}

export default function Sidebar({
  currentView,
  onNavigate,
  onBackToIPod,
  isMobile = false,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mentees', label: 'Mentees', icon: Users },
    { id: 'calendar', label: 'Calendar Sync', icon: Calendar },
    { id: 'finance', label: 'Finance Ledger', icon: DollarSign },
    { id: 'resources', label: 'Syllabus', icon: BookOpen },
  ];

  const baseClasses = "flex flex-col bg-white select-none";
  const wrapperClasses = isMobile
    ? `${baseClasses} w-full h-full`
    : `${baseClasses} hidden md:flex w-72 min-h-screen border-r border-slate-100 fixed left-0 top-0 z-30`;

  return (
    <aside className={wrapperClasses}>
      {/* Spacious Brand Header */}
      <div className={`pt-12 pb-10 px-10 ${isMobile ? 'pt-6 pb-6 px-6' : ''}`}>
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-4 h-4 bg-[#0b1120]" />
          <h1 className="font-space font-bold text-slate-900 text-xl tracking-tight">
            Milestone OS
          </h1>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={`flex-1 space-y-2 ${isMobile ? 'px-4' : 'px-6'}`}>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-space font-bold transition-colors ${
                isActive
                  ? 'bg-[#0b1120] text-white'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <IconComponent className="w-4 h-4 stroke-[2.5]" />
              <span className="tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Minimal Footer action */}
      <div className={`p-6 ${isMobile ? 'p-4' : ''}`}>
        <button
          onClick={onBackToIPod}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-xs font-space font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <Smartphone className="w-4 h-4 stroke-[2]" />
          <span>Lock to iPod Mode</span>
        </button>
      </div>
    </aside>
  );
}
