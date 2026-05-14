import React from 'react';
import { Calendar as CalendarIcon, Clock, Menu } from 'lucide-react';

interface TopBarProps {
  totalLoggedMinutes: number;
  onOpenSidebar?: () => void;
}

export default function TopBar({
  totalLoggedMinutes,
  onOpenSidebar,
}: TopBarProps) {
  const maxMinutes = 2880;

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-12 py-5 flex items-center justify-between select-none">
      {/* Left side Brand / Mobile Trigger */}
      <div className="flex items-center gap-4">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2.5 rounded-xl hover:bg-slate-50 text-slate-900 transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        {/* Simplified high-end Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#0b1120]" />
          <span className="font-space font-bold text-slate-900 text-lg tracking-tight md:hidden">
            Milestone OS
          </span>
        </div>
      </div>

      {/* Right side clean high-end metrics */}
      <div className="flex items-center gap-8 text-slate-900">
        {/* Simulation Date */}
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-4 h-4 text-slate-400 stroke-[2]" />
          <span className="font-space font-bold text-sm tracking-tight">
            May 13, 2026
          </span>
        </div>

        {/* Minimal Delivery Tracker */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-slate-400 stroke-[2]" />
          <span className="font-space font-bold text-sm tracking-tight">
            {totalLoggedMinutes} / {maxMinutes} mins
          </span>
        </div>
      </div>
    </header>
  );
}
