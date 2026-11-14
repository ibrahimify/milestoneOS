'use client';

import { useState } from 'react';
import { importBrowserRecords } from '@/app/browser-import';
import { browserRecordKeys, readBrowserRecords, type BrowserRecords } from '@/lib/browser-records';
import { Dialog } from './Forms';

export default function BrowserImport({ profile }: { profile: { id: string; email: string } }) {
  const [records, setRecords] = useState<BrowserRecords>();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function preview() {
    setOpen(true);
    setError('');
    setMessage('');
    try {
      setRecords(readBrowserRecords(window.localStorage));
    } catch {
      setError('Some browser data could not be read. Download a copy to preserve the original values.');
    }
  }

  function backup() {
    const data = Object.fromEntries(Object.values(browserRecordKeys).map((key) => [key, window.localStorage.getItem(key)]));
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'milestone-browser-backup.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copy() {
    if (!records || pending) return;
    setPending(true);
    setError('');
    try {
      const result = await importBrowserRecords(records, profile.id, Intl.DateTimeFormat().resolvedOptions().timeZone);
      if ('error' in result) setError(result.error || 'The import failed.');
      else setMessage([
        result.imported + ' new records imported.',
        result.orphan ? result.orphan + ' session logs had no matching mentee in the browser copy.' : '',
        result.financeSkipped ? 'Payments were skipped because the account uses a different currency.' : '',
      ].filter(Boolean).join(' '));
    } catch {
      setError('The import was interrupted. You can retry safely.');
    } finally {
      setPending(false);
    }
  }

  const hasRecords = records && Boolean(records.mentees.length || records.sessions.length || records.events.length || records.salary);
  return <>
    <button className="button subtle w-fit" onClick={preview}>Recover earlier records</button>
    {open && <Dialog title="Recover earlier records" close={() => { if (!pending) setOpen(false); }}>
      <p className="muted mt-3 break-words">Destination account: <strong>{profile.email}</strong></p>
      {hasRecords ? <div className="mt-3 space-y-2">
        <p>{records.mentees.length} mentees, {records.sessions.length} session logs, {records.events.length} calendar events
          {records.salary ? ', and ' + records.salary.payments.length + ' installments' : ''} found.</p>
        {!!records.mentees.length && <ul className="max-h-36 overflow-auto list-disc pl-5">
          {records.mentees.map((mentee, index) => <li key={mentee.id + index}>{mentee.name}</li>)}
        </ul>}
      </div> : !error && <p className="mt-3">No earlier records found here. Open Milestone OS in the same browser profile and at the same address you used before.</p>}
      {error && <p className="error-text mt-3" role="alert">{error}</p>}
      {message && <p className="mt-3" role="status">{message}</p>}
      <div className="actions mt-4">
        <button className="button" disabled={pending} onClick={backup}>Download browser backup</button>
        {hasRecords && !message && <button className="button primary" disabled={pending} onClick={copy}>
          {pending ? 'Importing…' : 'Import into this account'}
        </button>}
      </div>
    </Dialog>}
  </>;
}
