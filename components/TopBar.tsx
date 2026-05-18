import React from 'react';
import { Clock, Mail, Menu, Search } from 'lucide-react';

interface TopBarProps {
  totalLoggedMinutes: number;
  onOpenSidebar?: () => void;
}

export default function TopBar({
  totalLoggedMinutes,
  onOpenSidebar,
}: TopBarProps) {
  const pct = Math.min(100, Math.round((totalLoggedMinutes / 2880) * 100));

  return (
    <header className="sticky top-0 z-20 px-4 py-5 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="rounded-2xl bg-white p-3 text-black shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:hidden"
              aria-label="Open Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div>
            <h2 className="font-space text-[18px] text-black md:text-[22px]">
              HELLO, MENTOR
            </h2>
            <p className="mt-1 text-xs text-black/36">May 18, 2026 / private dashboard</p>
          </div>
        </div>

        <div className="hidden flex-1 justify-center px-8 lg:flex">
          <div className="flex w-full max-w-[300px] items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_16px_36px_rgba(0,0,0,0.07)]">
            <Search className="h-4 w-4 text-black/50" />
            <span className="text-xs text-black/42">Search logs soon</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-2xl bg-white p-3 shadow-[0_14px_30px_rgba(0,0,0,0.08)] sm:block" aria-label="Messages">
            <Mail className="h-4 w-4" />
          </button>
          <div className="rounded-2xl bg-black px-4 py-3 text-white shadow-[0_18px_36px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Clock className="h-4 w-4" />
              <span>{totalLoggedMinutes}m</span>
              <span className="text-white/40">{pct}%</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
