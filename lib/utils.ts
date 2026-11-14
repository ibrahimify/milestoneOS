import type { Session } from '@/types';

export function newestSessionFirst(a: Session, b: Session) {
  const timestamp = (session: Session) => Date.parse(session.created_at ?? '') || 0;
  return b.date.localeCompare(a.date) || timestamp(b) - timestamp(a) || b.id.localeCompare(a.id);
}

export function localDate(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date + 'T12:00:00'));
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
}

export function safeLink(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}
