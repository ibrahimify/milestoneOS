'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { ActionResult } from '@/app/actions';

export type Values = Record<string, string>;
export const numberValue = (values: Values, name: string) => Number(values[name]);

export function Field({ name, label, value, type = 'text', options, required, max, min, step, limit, placeholder, autoComplete, minLength }: {
  name: string; label: string; value?: string | number | null; type?: string;
  options?: readonly (string | { value: string; label: string })[];
  required?: boolean; min?: number; max?: number; step?: number; limit?: number; placeholder?: string;
  autoComplete?: string; minLength?: number;
}) {
  const id = useId();
  return <div className="field"><label htmlFor={id}>{label}</label>
    {options ? <div className="field-select"><select id={id} name={name} defaultValue={value ?? ''} required={required}>
      {options.map((option) => {
        const item = typeof option === 'string' ? { value: option, label: option } : option;
        return <option key={item.value} value={item.value}>{item.label}</option>;
      })}
    </select><ChevronDown size={16} aria-hidden="true" /></div> : type === 'textarea'
      ? <textarea id={id} name={name} defaultValue={value ?? ''} maxLength={limit || 6000} rows={3} required={required} />
      : <input id={id} name={name} defaultValue={value ?? ''} type={type} required={required} placeholder={placeholder}
          min={min} max={max} step={step} maxLength={limit || 160} minLength={minLength} autoComplete={autoComplete} />}
  </div>;
}

export function Dialog({ title, close, children, className = '' }: { title: string; close: () => void; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (!ref.current?.open) ref.current?.showModal(); }, []);
  return <dialog ref={ref} className={'editor ' + className} aria-label={title} onCancel={(event) => { event.preventDefault(); close(); }}>
    <header className="section-heading"><h2>{title}</h2>
      <button type="button" className="icon-button" aria-label="Close dialog" onClick={close}><X size={20} /></button>
    </header>
    {children}
  </dialog>;
}

export function RecordForm({ save, children, cancel, complete, submitLabel = 'Save', disabled, onPendingChange }: {
  save: (values: Values) => ActionResult | Promise<ActionResult>; children: ReactNode;
  cancel?: () => void; complete?: () => void; submitLabel?: string; disabled?: boolean;
  onPendingChange?: (pending: boolean) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || disabled) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Values;
    setPending(true);
    onPendingChange?.(true);
    setError('');
    try {
      const result = await save(values);
      if (result.error) setError(result.error);
      else if (complete) complete();
      else form.reset();
    } catch {
      setError('Could not save. Try again.');
    } finally {
      setPending(false);
      onPendingChange?.(false);
    }
  }
  return <form onSubmit={submit} className="editor-form" aria-busy={pending || undefined}>
      <fieldset disabled={pending}>{children}</fieldset>
      {error && <p role="alert" className="error-text">{error}</p>}
      <footer className="actions">
        {cancel && <button type="button" className="button" onClick={cancel} disabled={pending}>Cancel</button>}
        <button className="button primary" disabled={pending || disabled}>{pending ? 'Saving…' : submitLabel}</button>
      </footer>
    </form>;
}

export function FormDialog({ title, close, save, children, className }: {
  title: string; close: () => void; save: (values: Values) => ActionResult | Promise<ActionResult>; children: ReactNode;
  className?: string;
}) {
  const [pending, setPending] = useState(false);
  return <Dialog title={title} className={className} close={() => { if (!pending) close(); }}>
    <RecordForm save={save} onPendingChange={setPending} cancel={close} complete={close}>{children}</RecordForm>
  </Dialog>;
}

export function ActionButton({ run, children, confirm, className = 'button', pressed, label }: {
  run: () => Promise<ActionResult>; children: ReactNode; confirm?: string; className?: string; pressed?: boolean; label?: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function click() {
    if (pending || (confirm && !window.confirm(confirm))) return;
    setPending(true);
    setError('');
    try {
      const result = await run();
      setError(result.error || '');
    } catch {
      setError('Could not complete the action. Try again.');
    } finally {
      setPending(false);
    }
  }
  return <div className="action-button">
    <button type="button" aria-label={label} aria-busy={pending || undefined} aria-pressed={pressed}
      className={className} disabled={pending} onClick={click}>
      {pending && !label ? 'Saving…' : children}
    </button>
    {error && <small role="alert" className="error-text">{error}</small>}
  </div>;
}
