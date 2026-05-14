'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, ChevronRight, Play, Lock, ShieldAlert, Smartphone } from 'lucide-react';

interface IPodClassicProps {
  onEnterDashboard: () => void;
  onQuickView: () => void;
  onFinance: () => void;
}

export default function IPodClassic({
  onEnterDashboard,
  onQuickView,
  onFinance,
}: IPodClassicProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'mentees', label: 'Mentee Quick-View' },
    { id: 'finance', label: 'Finance Engine' },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  
  const [showLock, setShowLock] = useState(false);
  const [pendingAction, setPendingAction] = useState<'dashboard' | 'mentees' | 'finance'>('dashboard');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleNext = () => {
    if (showLock) return;
    setSelectedIndex((prev) => (prev + 1) % menuItems.length);
  };

  const handlePrev = () => {
    if (showLock) return;
    setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
  };

  const handleCenterClick = () => {
    const selected = menuItems[selectedIndex];
    setPendingAction(selected.id as 'dashboard' | 'mentees' | 'finance');
    setShowLock(true);
    setPinInput('');
    setPinError(false);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1619') {
      setPinError(false);
      setIsZooming(true);
      setTimeout(() => {
        if (pendingAction === 'dashboard') {
          onEnterDashboard();
        } else if (pendingAction === 'mentees') {
          onQuickView();
        } else if (pendingAction === 'finance') {
          onFinance();
        }
      }, 600);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const getActionContextLabel = () => {
    switch (pendingAction) {
      case 'mentees':
        return 'Mentee Quick-View';
      case 'finance':
        return 'Finance Engine';
      case 'dashboard':
      default:
        return 'Dashboard Overview';
    }
  };

  return (
    <div className="min-h-screen bg-[#05070f] flex items-center justify-center p-4 select-none">
      <AnimatePresence>
        {!isZooming ? (
          <motion.div
            key="ipod-device"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 12, opacity: 0, transition: { duration: 0.5 } }}
            className="flex flex-col items-center p-8 rounded-[48px] w-[360px] bg-[#0b1120] border border-slate-800 shadow-2xl"
          >
            {/* Screen Enclosure */}
            <div className="w-full bg-[#03050a] p-3 rounded-3xl mb-8 border border-slate-800">
              <div className="w-full h-[220px] rounded-2xl overflow-hidden flex flex-col bg-white text-slate-900 relative">
                
                {/* Status bar */}
                <div className="border-b border-slate-100 px-4 py-2 flex justify-between items-center text-[10px] font-space font-bold text-slate-900">
                  <span>Milestone OS</span>
                  <div className="flex items-center gap-2">
                    <Play className="w-2.5 h-2.5 fill-slate-900" />
                    <Battery className="w-4 h-4 stroke-[2]" />
                  </div>
                </div>

                {/* Inner Canvas Area */}
                <div className="flex-1 flex flex-col relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {showLock ? (
                      /* PIN verification screen */
                      <motion.div
                        key="lock-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-6 text-center"
                      >
                        <Lock className="w-5 h-5 text-slate-900 mb-2 stroke-[2.5]" />
                        <div className="text-xs font-space font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {getActionContextLabel()}
                        </div>
                        <div className="text-sm font-space font-bold text-slate-900 mb-4">
                          Enter PIN Code
                        </div>

                        <form onSubmit={handlePinSubmit} className="w-full max-w-[160px]">
                          <input
                            type="password"
                            maxLength={4}
                            autoFocus
                            placeholder="••••"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                            className={`w-full text-center tracking-[0.5em] font-space font-bold text-base py-2 rounded-xl bg-slate-50 border focus:outline-none transition-colors ${
                              pinError
                                ? 'border-red-500 text-red-600'
                                : 'border-slate-200 text-slate-900'
                            }`}
                          />
                          
                          {pinError && (
                            <div className="text-[10px] text-red-600 font-bold mt-2 flex items-center justify-center gap-1 animate-pulse">
                              <ShieldAlert className="w-3 h-3" />
                              <span>Incorrect PIN</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-2 mt-4">
                            <button
                              type="button"
                              onClick={() => setShowLock(false)}
                              className="w-1/2 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-space font-bold text-slate-400 transition-colors"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              className="w-1/2 py-2 bg-[#0b1120] hover:bg-slate-900 rounded-xl text-xs font-space font-bold text-white transition-colors"
                            >
                              Unlock
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    ) : (
                      /* Main Menu screen */
                      <motion.div
                        key="menu-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex"
                      >
                        {/* List column */}
                        <div className="w-3/5 bg-slate-50/50 py-3 flex flex-col justify-center border-r border-slate-100">
                          <div className="px-4 pb-3 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                            Navigation
                          </div>
                          {menuItems.map((item, idx) => {
                            const isSelected = idx === selectedIndex;
                            return (
                              <div
                                key={item.id}
                                onClick={() => setSelectedIndex(idx)}
                                className={`px-4 py-3 flex items-center justify-between text-xs transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#0b1120] text-white font-space font-bold'
                                    : 'text-slate-400 font-medium'
                                }`}
                              >
                                <span className="truncate pr-1">{item.label}</span>
                                {isSelected && <ChevronRight className="w-3 h-3 stroke-[2.5]" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Visual brand column */}
                        <div className="w-2/5 bg-white flex flex-col items-center justify-center p-3 text-center">
                          <div className="w-12 h-12 rounded-2xl bg-[#0b1120] flex items-center justify-center text-white mb-3">
                            <div className="w-3 h-3 bg-white rounded-full" />
                          </div>
                          <div className="text-xs font-space font-bold text-slate-900">
                            Milestone OS
                          </div>
                          <div className="text-[9px] text-slate-400 font-medium mt-0.5">
                            Core Gate
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Helper prompt bar */}
                <div className="border-t border-slate-100 py-1.5 px-3 text-[9px] text-slate-400 text-center tracking-wider uppercase font-space font-bold bg-slate-50/50">
                  <span>{showLock ? 'PIN required' : 'Press center trigger'}</span>
                </div>
              </div>
            </div>

            {/* Click Wheel Hardware */}
            <div className="relative w-[240px] h-[240px] rounded-full bg-[#0e1629] flex items-center justify-center border border-slate-800">
              <button
                onClick={handlePrev}
                className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-space font-bold text-slate-400 hover:text-white transition-colors py-1 px-4 z-10"
              >
                MENU
              </button>
              <button
                onClick={handleNext}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-space font-bold text-slate-400 hover:text-white transition-colors py-1 px-4 z-10"
              >
                ▶||
              </button>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-space font-bold text-slate-400 hover:text-white transition-colors px-2 py-4 z-10"
              >
                |◀◀
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-space font-bold text-slate-400 hover:text-white transition-colors px-2 py-4 z-10"
              >
                ▶▶|
              </button>

              {/* Bold Center Select Button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleCenterClick}
                className="relative z-10 w-[90px] h-[90px] rounded-full bg-[#060a14] border border-slate-800 flex items-center justify-center group focus:outline-none shadow-inner"
                aria-label="Trigger center select"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 group-hover:bg-white transition-colors" />
              </motion.button>
            </div>

            {/* Footer sub text */}
            <div className="mt-8 text-center flex items-center justify-center gap-2 text-slate-500">
              <Smartphone className="w-3.5 h-3.5 stroke-[2]" />
              <span className="text-xs font-space font-bold tracking-wider uppercase">
                Hardware Access Frame
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
