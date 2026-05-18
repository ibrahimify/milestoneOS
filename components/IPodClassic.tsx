'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Battery, ChevronRight, Lock, Play, Rewind, FastForward, Pause } from 'lucide-react';

interface IPodClassicProps {
  onEnterDashboard: () => void;
  onQuickView: () => void;
  onFinance: () => void;
}

type ActionId = 'dashboard' | 'mentees' | 'finance' | 'calendar';

const MENU_ITEMS: Array<{ id: ActionId; label: string; hint: string }> = [
  { id: 'dashboard', label: 'Dashboard', hint: 'Mentor overview' },
  { id: 'mentees', label: 'Mentees', hint: 'Student dossiers' },
  { id: 'finance', label: 'Finance', hint: 'Contract ledger' },
  { id: 'calendar', label: 'Calendar', hint: 'Deadlines' },
];

export default function IPodClassic({
  onEnterDashboard,
  onQuickView,
  onFinance,
}: IPodClassicProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lockOpen, setLockOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pendingAction, setPendingAction] = useState<ActionId>('dashboard');
  const [booting, setBooting] = useState(false);
  const [hoverZone, setHoverZone] = useState<'menu' | 'prev' | 'next' | 'play' | 'center' | null>(null);

  const current = MENU_ITEMS[selectedIndex];

  const next = () => {
    if (lockOpen) return;
    setSelectedIndex((prev) => (prev + 1) % MENU_ITEMS.length);
  };

  const prev = () => {
    if (lockOpen) return;
    setSelectedIndex((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
  };

  const select = () => {
    const item = MENU_ITEMS[selectedIndex];
    setPendingAction(item.id);
    setLockOpen(true);
    setPinInput('');
    setPinError(false);
  };

  const unlock = (event: React.FormEvent) => {
    event.preventDefault();
    if (pinInput !== '1619') {
      setPinError(true);
      setTimeout(() => setPinError(false), 900);
      return;
    }

    setBooting(true);
    setTimeout(() => {
      if (pendingAction === 'dashboard') onEnterDashboard();
      if (pendingAction === 'mentees') onQuickView();
      if (pendingAction === 'finance') onFinance();
      if (pendingAction === 'calendar') onEnterDashboard();
    }, 760);
  };

  return (
    <div className="retro-stage flex min-h-screen items-center justify-center p-5 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <div className="relative w-[min(86vw,310px)] rounded-[36px] border-[4px] border-black bg-[#ded5bd] px-5 pb-7 pt-7 shadow-[18px_26px_30px_rgba(0,0,0,0.30)]">
          <div className="absolute left-1/2 top-3 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/80" />
          <div className="absolute inset-1 rounded-[30px] border-2 border-white/40 pointer-events-none" />

          <div className="relative mb-7 rounded-[12px] border-[4px] border-black bg-black p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.24)]">
            <div className="ipod-screen relative h-[166px] overflow-hidden rounded-[7px] bg-[#eff0eb] text-black">
              <AnimatePresence mode="wait">
                {booting ? (
                  <motion.div
                    key="boot"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white"
                  >
                    <div className="text-sm font-bold tracking-[0.18em]">LOADING</div>
                    <div className="mt-4 h-4 w-40 border-2 border-white p-0.5">
                      <div className="boot-fill h-full bg-white" />
                    </div>
                  </motion.div>
                ) : lockOpen ? (
                  <motion.div
                    key="pin"
                    initial={{ x: 18, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -18, opacity: 0 }}
                    className="absolute inset-0 bg-[#eff0eb] p-3"
                  >
                    <div className="flex items-center justify-between border-b-2 border-black pb-1 text-[10px] font-bold">
                      <span>{current.label}</span>
                      <Battery className="h-4 w-4" />
                    </div>
                    <form onSubmit={unlock} className="flex h-[130px] flex-col items-center justify-center text-center">
                      <Lock className="mb-2 h-5 w-5" />
                      <div className="text-[11px] font-bold tracking-[0.18em]">PASSCODE</div>
                      <input
                        type="password"
                        autoFocus
                        maxLength={4}
                        value={pinInput}
                        onChange={(event) => setPinInput(event.target.value.replace(/\D/g, ''))}
                        className={`mt-3 w-28 border-2 border-black bg-white px-2 py-2 text-center text-sm font-bold tracking-[0.35em] outline-none ${
                          pinError ? 'animate-bounce-x' : ''
                        }`}
                        placeholder="----"
                      />
                      <button type="submit" className="mt-3 bg-black px-4 py-1.5 text-[10px] font-bold text-white">
                        ENTER
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 grid grid-cols-[59%_41%]"
                  >
                    <div className="border-r border-black/30 bg-[#eff0eb]">
                      <div className="flex items-center justify-between border-b border-black/25 px-2 py-1 text-[9px] font-bold">
                        <span>iPod</span>
                        <span className="flex items-center gap-1">
                          <Play className="h-3 w-3 fill-black" />
                          <Battery className="h-4 w-4" />
                        </span>
                      </div>
                      <div className="py-1">
                        {MENU_ITEMS.map((item, index) => {
                          const active = selectedIndex === index;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setSelectedIndex(index)}
                              className={`flex w-full items-center justify-between px-2 py-2 text-left text-[10px] font-bold ${
                                active ? 'bg-black text-white' : 'bg-transparent text-black'
                              }`}
                            >
                              <span>{item.label}</span>
                              {active && <ChevronRight className="h-3.5 w-3.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="relative overflow-hidden bg-[#f8f8f4]">
                      <div className="absolute inset-3 rounded-md border border-black/20 bg-[#eff0eb]" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
                        <div className="mb-3 h-8 w-8 rounded-full border border-black/30 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.12)]" />
                        <div className="text-[10px] font-bold leading-4">{current.hint}</div>
                        <div className="mt-2 text-[9px] font-bold text-black/45">SELECT</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div
            className="relative mx-auto h-[170px] w-[170px] rounded-full bg-black text-white shadow-[inset_7px_7px_18px_rgba(255,255,255,0.08),inset_-10px_-10px_16px_rgba(0,0,0,0.62),0_8px_12px_rgba(0,0,0,0.28)]"
            onMouseLeave={() => setHoverZone(null)}
          >
            <div
              className={`pointer-events-none absolute inset-2 rounded-full transition ${
                hoverZone ? 'bg-white/8' : 'bg-transparent'
              }`}
            />
            <button
              onMouseEnter={() => setHoverZone('menu')}
              onClick={() => setLockOpen(false)}
              className={`absolute left-1/2 top-4 -translate-x-1/2 rounded-full px-4 py-2 text-[9px] font-bold transition ${
                hoverZone === 'menu' ? 'bg-white text-black' : ''
              }`}
            >
              MENU
            </button>
            <button
              onMouseEnter={() => setHoverZone('prev')}
              onClick={prev}
              aria-label="Previous"
              className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 transition ${
                hoverZone === 'prev' ? 'bg-white text-black' : ''
              }`}
            >
              <Rewind className="h-4 w-4 fill-current" />
            </button>
            <button
              onMouseEnter={() => setHoverZone('next')}
              onClick={next}
              aria-label="Next"
              className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 transition ${
                hoverZone === 'next' ? 'bg-white text-black' : ''
              }`}
            >
              <FastForward className="h-4 w-4 fill-current" />
            </button>
            <button
              onMouseEnter={() => setHoverZone('play')}
              onClick={next}
              aria-label="Play pause"
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full p-3 transition ${
                hoverZone === 'play' ? 'bg-white text-black' : ''
              }`}
            >
              <Pause className="h-4 w-4 fill-current" />
            </button>
            <button
              onMouseEnter={() => setHoverZone('center')}
              onClick={select}
              aria-label="Select"
              className={`absolute left-[51px] top-[51px] h-[68px] w-[68px] rounded-full border-2 border-black bg-[#242424] shadow-[inset_5px_5px_12px_rgba(255,255,255,0.08),inset_-6px_-6px_12px_rgba(0,0,0,0.7)] transition active:scale-[0.96] ${
                hoverZone === 'center' ? 'ring-4 ring-white/25' : ''
              }`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
