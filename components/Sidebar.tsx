import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  Smartphone,
  Circle,
  Square,
  Play,
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
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'resources', label: 'Modules', icon: BookOpen },
  ];

  const wrapperClasses = isMobile
    ? 'flex h-full w-full flex-col bg-white'
    : 'glass-panel fixed left-6 top-6 z-30 hidden h-[calc(100vh-48px)] w-64 flex-col rounded-[28px] md:flex';

  return (
    <aside className={wrapperClasses}>
      <div className="px-7 pb-7 pt-8">
        <div className="mb-8 flex items-center gap-2">
          <Square className="h-4 w-4 fill-black" />
          <Circle className="h-4 w-4 fill-black" />
          <Play className="h-5 w-5 fill-black" />
        </div>
        <h1 className="font-space text-[17px] tracking-tight text-black">
          MILESTONE
        </h1>
        <p className="mt-2 text-xs text-black/40">retro mentor operating system</p>
      </div>

      <nav className="flex-1 space-y-2 px-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-sm transition ${
                isActive
                  ? 'bg-black text-white shadow-[0_18px_34px_rgba(0,0,0,0.18)]'
                  : 'text-black/42 hover:bg-black/[0.04] hover:text-black'
              }`}
            >
              <Icon className="h-4 w-4 stroke-[2.4]" />
              <span className="font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-5">
        <div className="mb-4 rounded-[24px] bg-black p-5 text-white">
          <div className="font-space text-[10px] leading-5">LOGS ARE MONEY</div>
          <p className="mt-3 text-xs leading-relaxed text-white/58">
            Every session note feeds minutes, profile memory, and finance tracking.
          </p>
        </div>
        <button
          onClick={onBackToIPod}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-black shadow-[0_14px_30px_rgba(0,0,0,0.08)] transition hover:bg-black hover:text-white"
        >
          <Smartphone className="h-4 w-4" />
          <span>iPod lock</span>
        </button>
      </div>
    </aside>
  );
}
