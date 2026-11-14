'use client';

import { useActionState, useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import { ChevronRight, Play, SkipBack, SkipForward } from 'lucide-react';
import { authenticate, type AuthResult } from '@/app/auth/actions';
import PasswordInput from './PasswordInput';

const modes = [
  { id: 'signin', label: 'Sign in' },
  { id: 'signup', label: 'Request access' },
  { id: 'reset', label: 'Reset password' },
] as const;

export default function IPodClassic({ unavailable, expired, updating, status, signOutAction, adminEntry }: {
  unavailable?: boolean; expired?: boolean; updating?: boolean; status?: string;
  signOutAction?: () => Promise<void>; adminEntry?: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(!!updating);
  const wheelAngle = useRef<number | null>(null);
  const wheelScroll = useRef(0);
  const mode = updating ? { id: 'update', label: 'Set new password' } : modes[selected];
  const move = (change: number) => setSelected((i) => (i + change + modes.length) % modes.length);
  const menu = !open && !unavailable && !status;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = menuRef.current;
    if (!node) return;
    function scroll(event: WheelEvent) {
      event.preventDefault();
      wheelScroll.current += event.deltaY;
      if (Math.abs(wheelScroll.current) < 24 && event.deltaMode === 0) return;
      const direction = Math.sign(wheelScroll.current);
      wheelScroll.current = 0;
      setSelected((i) => (i + direction + modes.length) % modes.length);
    }
    node.addEventListener('wheel', scroll, { passive: false });
    return () => node.removeEventListener('wheel', scroll);
  }, [menu]);

  function angle(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return Math.atan2(event.clientY - bounds.top - bounds.height / 2, event.clientX - bounds.left - bounds.width / 2);
  }

  function rotate(event: PointerEvent<HTMLDivElement>) {
    if (wheelAngle.current === null) return;
    const next = angle(event);
    const delta = Math.atan2(Math.sin(next - wheelAngle.current), Math.cos(next - wheelAngle.current));
    const steps = Math.trunc(delta / (Math.PI / 5));
    if (steps) {
      wheelAngle.current = next;
      move(steps);
    }
  }

  return <main className="entry-stage">
    <div className="player-frame">
    <section className="player" aria-label="Milestone OS account access">
      <div className="player-jack" aria-hidden="true" />
      <div className="player-hold" aria-hidden="true" />
      <div className="player-screen">
        <header className="player-status"><span>{open ? mode.label : 'Milestone OS'}</span><span className="battery" aria-hidden="true" /></header>
        <div className="player-screen-content">
        {unavailable ? <p className="player-message">Workspace setup is required.</p>
        : status ? <div className="player-message">
          <p>{status}</p>
          <form action={signOutAction} className="mt-4"><button className="button primary">Sign out</button></form>
        </div>
        : open ? <Credentials key={mode.id} mode={mode.id} label={mode.label} adminEntry={adminEntry} />
        : <div className="player-menu" ref={menuRef} onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const index = (selected + (event.key === 'ArrowDown' ? 1 : -1) + modes.length) % modes.length;
            setSelected(index);
            event.currentTarget.querySelectorAll('button')[index]?.focus();
          }
        }}>
          {modes.map((item, index) => <button key={item.id} type="button"
            className={index === selected ? 'selected' : ''}
            onFocus={() => setSelected(index)}
            onClick={() => { setSelected(index); setOpen(true); }}>
            {item.label}<ChevronRight size={13} aria-hidden="true" />
          </button>)}
          {expired && <p className="player-message" role="alert">That link has expired. Request a new link.</p>}
        </div>}
        </div>
      </div>
      <div className="click-wheel" role="group" aria-label="Menu controls">
        {menu && <div className="wheel-ring" aria-hidden="true" onPointerDown={(event) => {
          wheelAngle.current = angle(event);
          event.currentTarget.setPointerCapture(event.pointerId);
        }} onPointerMove={rotate} onLostPointerCapture={() => { wheelAngle.current = null; }} />}
        <button className="wheel-menu" disabled={!open || updating} onClick={() => setOpen(false)}>MENU</button>
        <button className="wheel-up" disabled={!menu} aria-label="Previous option" onClick={() => move(-1)}><SkipBack size={16} fill="currentColor" /></button>
        <button className="wheel-select" type="button" disabled={!menu} aria-label={'Select ' + modes[selected].label} onClick={() => setOpen(true)} />
        <button className="wheel-down" disabled={!menu} aria-label="Next option" onClick={() => move(1)}><SkipForward size={16} fill="currentColor" /></button>
        <button className="wheel-play" type="submit" form="ipod-credentials" disabled={!open} aria-label="Submit form">
          <Play size={11} fill="currentColor" aria-hidden="true" /><span aria-hidden="true">Ⅱ</span>
        </button>
      </div>
    </section>
    </div>
  </main>;
}

function Credentials({ mode, label, adminEntry }: { mode: string; label: string; adminEntry?: boolean }) {
  const passwordId = useId();
  const [result, action, pending] = useActionState(async (previous: AuthResult, form: FormData) => {
    try {
      return await authenticate(previous, form);
    } catch (error) {
      if (error instanceof TypeError) {
        return { error: 'The connection was interrupted. Refresh this page and try again.' };
      }
      throw error;
    }
  }, {});
  return <form id="ipod-credentials" action={action} className="player-form">
    <input type="hidden" name="mode" value={mode} />
    {adminEntry && mode === 'signin' && <input type="hidden" name="view" value="admin" />}
    {mode === 'signup' && <label>Nickname<input name="nickname" autoComplete="nickname" maxLength={60} required /></label>}
    {mode !== 'update' && <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>}
    {mode !== 'reset' && <div className="player-password-row"><label htmlFor={passwordId}>Password</label>
      <PasswordInput id={passwordId} label="Password" name="password" maxLength={72}
        minLength={mode === 'signin' ? 1 : 10} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required />
    </div>}
    <button className="button primary" disabled={pending}>{pending ? 'Please wait…' : label}</button>
    {result.error && <p role="alert" className="error-text">{result.error}</p>}
    {result.message && <p role="status">{result.message}</p>}
  </form>;
}
