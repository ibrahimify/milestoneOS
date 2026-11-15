'use client';

import { useEffect, useRef } from 'react';

const interactiveSelector = 'a, button:not(:disabled), summary, [role="button"]';
const textSelector = 'input, textarea, [contenteditable="true"]';

export default function CursorGlow() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = cursor.current;
    const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)');
    if (!node || !finePointer.matches) return;

    function move(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target : null;
      const inApp = Boolean(target?.closest('.workspace, .entry-stage'));
      const overText = Boolean(target?.closest(textSelector));
      node!.dataset.visible = String(inApp && !overText);
      node!.dataset.interactive = String(Boolean(target?.closest(interactiveSelector)));
      node!.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    }

    function hide() {
      node!.dataset.visible = 'false';
    }

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, []);

  return <div ref={cursor} className="cursor-glow" data-visible="false" aria-hidden="true">
    <svg viewBox="0 0 32 32">
      <path d="M5 4 26 16 16.5 19.1 11.5 27Z" />
    </svg>
  </div>;
}
