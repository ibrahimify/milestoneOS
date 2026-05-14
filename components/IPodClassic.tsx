'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, ChevronRight, Play, Lock, ShieldAlert, Sparkles, Smartphone } from 'lucide-react';

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
    { id: 'dashboard', label: 'Enter Dashboard' },
    { id: 'mentees', label: 'Mentee Quick-View' },
    { id: 'finance', label: 'Finance Engine' },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  
  // Security lock state variables
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
    // Ungate any selected option via the secure passkey overlay
    setPendingAction(selected.id as 'dashboard' | 'mentees' | 'finance');
    setShowLock(true);
    setPinInput('');
    setPinError(false);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1619') {
      // Success unlocking the selected target destination
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
      }, 700);
    } else {
      // Restricted access trigger error feedback
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  // Helper context text to clarify what target is being unlocked
  const getActionContextLabel = () => {
    switch (pendingAction) {
      case 'mentees':
        return 'MENTEE QUICK-VIEW';
      case 'finance':
        return 'FINANCE LEDGER';
      case 'dashboard':
      default:
        return 'DASHBOARD CORE';
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 overflow-hidden relative select-none">
      {/* Dynamic Futuristic 3D Glowing Ambient Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0,transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.05)_0,transparent_50%)] pointer-events-none" />
      
      {/* Premium minimal micro-grid backdrop */}
      <div className="absolute inset-0 opacity-15 bg-grid-pattern-dark [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <AnimatePresence>
        {!isZooming ? (
          <motion.div
            key="ipod-device"
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 15, opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
            className="relative z-10 flex flex-col items-center p-6 rounded-[44px] w-[350px] border border-slate-800/80 shadow-[0_0_60px_-15px_rgba(37,99,235,0.2),inset_0_1px_2px_rgba(255,255,255,0.05)] backdrop-blur-2xl"
            style={{
              background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)',
            }}
          >
            {/* Outer Premium Metallic Finish Bezel */}
            <div className="w-full bg-[#030712] p-3 rounded-[22px] shadow-inner mb-8 border border-slate-800/60 relative">
              {/* Internal Glowing IPS Display emulation */}
              <div className="w-full h-[220px] ipod-screen rounded-xl overflow-hidden flex flex-col text-slate-100 font-sans relative border border-slate-800/90">
                
                {/* Header Status Bar */}
                <div className="bg-[#030712]/90 backdrop-blur-md border-b border-slate-800/60 px-3 py-2 flex justify-between items-center text-[10px] font-bold tracking-widest text-slate-400">
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">MILESTONE OS</span>
                  <div className="flex items-center gap-2">
                    <Play className="w-2.5 h-2.5 fill-blue-500 text-blue-500" />
                    <Battery className="w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Main Content Area: Menu / Authentication view switch */}
                <div className="flex-1 flex flex-col relative overflow-hidden">
                  
                  <AnimatePresence mode="wait">
                    {showLock ? (
                      /* Inline Security Lock Screen overlay for Target Actions */
                      <motion.div
                        key="lock-view"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-[#030712]/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-4 text-center"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2.5 shadow-inner">
                          <Lock className="w-4 h-4 animate-pulse" />
                        </div>

                        <div className="text-[9px] font-bold text-blue-400 tracking-widest uppercase mb-0.5">
                          UNLOCKING: {getActionContextLabel()}
                        </div>
                        <div className="text-[10px] font-bold text-slate-200 uppercase tracking-wider leading-tight">
                          CONFIRM IF YOU ARE IBRAHIM
                        </div>
                        <p className="text-[8px] text-slate-500 mt-0.5 mb-3">
                          Enter secure passkey to ungate endpoint
                        </p>

                        <form onSubmit={handlePinSubmit} className="w-full max-w-[160px]">
                          <input
                            type="password"
                            maxLength={4}
                            autoFocus
                            placeholder="••••"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                            className={`w-full text-center tracking-[0.5em] font-space text-sm py-1.5 px-2 rounded-xl bg-[#0b1120] border focus:outline-none focus:ring-1 transition-all ${
                              pinError
                                ? 'border-red-500/80 text-red-400 focus:ring-red-500'
                                : 'border-slate-800 text-blue-400 focus:ring-blue-500'
                            }`}
                          />
                          
                          {pinError && (
                            <motion.div
                              initial={{ opacity: 0, y: -2 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[9px] text-red-400 font-bold mt-1.5 flex items-center justify-center gap-1 animate-pulse"
                            >
                              <ShieldAlert className="w-2.5 h-2.5" />
                              <span>Access Restricted</span>
                            </motion.div>
                          )}

                          <div className="flex items-center justify-between gap-2 mt-3">
                            <button
                              type="button"
                              onClick={() => setShowLock(false)}
                              className="w-1/2 py-1.5 bg-slate-900/80 hover:bg-slate-800 rounded-lg text-[9px] font-bold text-slate-400 border border-slate-800/80 transition-colors"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              className="w-1/2 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-[9px] font-bold text-white transition-colors shadow-sm"
                            >
                              Verify
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    ) : (
                      /* Standard Split Dashboard Index menu view */
                      <motion.div
                        key="menu-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex"
                      >
                        {/* Left sidebar item menu */}
                        <div className="w-3/5 bg-[#030712]/60 py-2 flex flex-col justify-center border-r border-slate-900/80 backdrop-blur-xs">
                          <div className="px-3.5 pb-2 text-[8px] font-bold tracking-widest text-slate-600 uppercase">
                            Secure Endpoints
                          </div>
                          {menuItems.map((item, idx) => {
                            const isSelected = idx === selectedIndex;
                            return (
                              <div
                                key={item.id}
                                onClick={() => setSelectedIndex(idx)}
                                className={`px-3.5 py-2.5 flex items-center justify-between text-xs transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white font-bold pl-4 border-l-2 border-blue-400 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200 font-semibold'
                                }`}
                              >
                                <span className="truncate pr-1 tracking-tight">{item.label}</span>
                                {isSelected && <ChevronRight className="w-3 h-3 stroke-[3]" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Right premium brand column */}
                        <div className="w-2/5 bg-gradient-to-br from-[#090d16]/40 to-[#030712]/20 flex flex-col items-center justify-center p-2 text-center relative overflow-hidden">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 flex items-center justify-center text-blue-400 mb-2 border border-blue-500/20 shadow-inner">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                          </div>
                          <div className="text-[10px] font-bold text-slate-200 tracking-tight">
                            Mentor OS
                          </div>
                          <div className="text-[8px] text-slate-500 font-medium mt-0.5 tracking-wider">
                            Secure Core
                          </div>
                          {/* Elegant sleek watermark */}
                          <div className="absolute -bottom-3 -right-2 text-5xl text-slate-800/20 font-space font-bold select-none pointer-events-none">
                            M
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Bottom interactive action helper */}
                <div className="bg-[#030712] border-t border-slate-800/60 py-1.5 px-2 text-[8px] text-slate-500 text-center tracking-widest uppercase font-bold">
                  <span>{showLock ? 'Hard-type PIN code' : 'Press center wheel to open'}</span>
                </div>
              </div>
            </div>

            {/* Futuristic 3D Kinetic Click Wheel Casing */}
            <div className="relative w-[230px] h-[230px] rounded-full bg-gradient-to-b from-slate-900 via-[#090d16] to-[#020617] shadow-[0_12px_30px_rgba(0,0,0,0.95),inset_0_1px_3px_rgba(255,255,255,0.05)] flex items-center justify-center border border-slate-800/90">
              
              {/* Click-wheel outer rim inner reflection layer */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-[#030712] to-slate-900 pointer-events-none opacity-60" />

              {/* Directional control labels */}
              <button
                onClick={handlePrev}
                className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 hover:text-white tracking-widest active:scale-95 transition-all py-1 px-4 z-10"
              >
                MENU
              </button>
              <button
                onClick={handleNext}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 hover:text-white tracking-widest active:scale-95 transition-all py-1 px-4 z-10"
              >
                ▶||
              </button>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 hover:text-white tracking-widest active:scale-95 transition-all px-2 py-4 z-10"
              >
                |◀◀
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 hover:text-white tracking-widest active:scale-95 transition-all px-2 py-4 z-10"
              >
                ▶▶|
              </button>

              {/* Bold Center Select Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCenterClick}
                className="relative z-10 w-[86px] h-[86px] rounded-full bg-gradient-to-b from-[#020617] to-[#0b1120] shadow-[inset_0_2px_4px_rgba(255,255,255,0.03),0_4px_12px_rgba(0,0,0,0.95)] border border-slate-800/80 flex items-center justify-center group focus:outline-none"
                aria-label="Confirm Item Trigger"
              >
                <div className="w-3 h-3 rounded-full bg-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
              </motion.button>
            </div>

            {/* Helper status string below device */}
            <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-slate-600">
              <Smartphone className="w-3 h-3" />
              <span className="text-[9px] font-bold tracking-widest uppercase">
                iPod Security Casing
              </span>
            </div>
          </motion.div>
        ) : (
          /* High-velocity layout explosion container */
          <motion.div
            key="zooming-screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-[#030712] z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
