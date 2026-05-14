import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onBackToIPod: () => void;
}

export default function Sidebar({
  currentView,
  onNavigate,
  onBackToIPod,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'mentees', label: 'Mentees Gallery', icon: Users },
    { id: 'calendar', label: 'Calendar Grid Sync', icon: Calendar },
    { id: 'finance', label: 'EV Finance Engine', icon: DollarSign },
    { id: 'resources', label: 'Syllabus Catalogue', icon: BookOpen },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-slate-100 fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-50 flex items-center gap-3 relative overflow-hidden">
        {/* Subtle background ambient ring */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-xl pointer-events-none" />

        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0b1120] to-slate-900 flex items-center justify-center shadow-premium border border-slate-800 relative z-10">
          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
        </div>
        <div className="relative z-10">
          <h1 className="font-space font-bold text-slate-900 text-sm tracking-tight leading-tight">
            MILESTONE OS
          </h1>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wide">Mentor Operating System</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <div className="px-3 pb-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
          Core Workspaces
        </div>
        
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-300 relative group ${
                isActive
                  ? 'bg-[#0b1120] text-white shadow-premium'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {/* Highlight active left border pill */}
              {isActive && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-full" />
              )}
              <IconComponent
                className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-blue-400 stroke-[2.5]' : 'text-slate-400 stroke-[2]'
                }`}
              />
              <span className="truncate tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer link to reload IPod Classic Experience */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/30">
        <button
          onClick={onBackToIPod}
          className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-2xl text-[11px] font-bold text-slate-500 hover:text-slate-900 hover:bg-white transition-all shadow-sm border border-slate-200/60 bg-slate-100/60 group"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          <span className="tracking-tight">Lock to iPod Mode</span>
        </button>
      </div>
    </aside>
  );
}
