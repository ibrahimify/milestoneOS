import React from 'react';
import { Calendar as CalendarIcon, Clock, CreditCard, Menu, Sparkles } from 'lucide-react';

interface TopBarProps {
  totalLoggedMinutes: number;
  onOpenSidebar?: () => void;
}

export default function TopBar({
  totalLoggedMinutes,
  onOpenSidebar,
}: TopBarProps) {
  // Target date calculations from simulated date May 13, 2026
  const targetDate = new Date('2026-08-30T00:00:00');
  const simDate = new Date('2026-05-13T00:00:00');
  const daysLeft = Math.ceil((targetDate.getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24));

  const maxMinutes = 2880; // 4 mentees * 720 mins
  const pct = Math.min(100, Math.round((totalLoggedMinutes / maxMinutes) * 100));

  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-2xl border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between gap-4 select-none transition-all">
      {/* Mobile Menu Trigger */}
      <div className="flex items-center gap-3 md:hidden">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl bg-white border border-slate-100 text-slate-700 shadow-sm active:scale-95 transition-all"
            aria-label="Open Mobile Drawer"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2 font-space font-bold text-slate-900 text-xs tracking-tight">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>MILESTONE OS</span>
        </div>
      </div>

      {/* Left side desktop status indicator */}
      <div className="hidden md:flex items-center gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100/80 text-slate-700 font-semibold text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="tracking-tight">System State: Active Telemetry</span>
        </div>
      </div>

      {/* Right side global metrics indicators */}
      <div className="flex items-center gap-3 ml-auto md:ml-0">
        {/* Highlighted Simulated Date */}
        <div className="flex items-center gap-2.5 bg-white border border-slate-100 shadow-premium px-3.5 py-2 rounded-2xl">
          <CalendarIcon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <div className="text-right leading-tight">
            <div className="text-[8px] font-bold text-blue-600 uppercase tracking-widest block">
              Simulation Date
            </div>
            <div className="text-xs font-space font-bold text-slate-900">
              May 13, 2026
            </div>
          </div>
        </div>

        {/* Global Minute Tracker */}
        <div className="flex items-center gap-3 bg-white border border-slate-100 shadow-premium px-3.5 py-2 rounded-2xl min-w-[150px]">
          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              <span>Delivery Cap</span>
              <span className="text-slate-900 font-space">{totalLoggedMinutes}/{maxMinutes}m</span>
            </div>
            {/* Extremely elegant gradient mini global progress bar */}
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Next Payout Countdown */}
        <div className="hidden sm:flex items-center gap-2.5 bg-[#0b1120] text-white px-3.5 py-2 rounded-2xl shadow-premium border border-slate-800">
          <CreditCard className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <div className="text-left leading-tight">
            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">
              Escrow Payout
            </div>
            <div className="text-xs font-space font-bold text-emerald-400">
              {daysLeft} Days Left
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
