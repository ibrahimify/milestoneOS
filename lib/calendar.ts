import type { CalendarEvent } from '@/types';

const compact = (date: string) => date.replace(/-/g, '');
const utc = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const escapeText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n')
  .replace(/,/g, '\\,').replace(/;/g, '\\;');
const encoder = new TextEncoder();

function foldLine(line: string) {
  let size = 0;
  let result = '';
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (size + bytes > 75) {
      result += '\r\n ';
      size = 1;
    }
    result += character;
    size += bytes;
  }
  return result;
}

function range(event: CalendarEvent) {
  if (event.start_at) {
    const start = new Date(event.start_at);
    return [utc(start), utc(new Date(start.getTime() + event.duration * 60000))];
  }
  const end = new Date(event.date + 'T00:00:00Z');
  end.setUTCDate(end.getUTCDate() + 1);
  return [compact(event.date), compact(end.toISOString().slice(0, 10))];
}

export function googleCalendarLink(event: CalendarEvent) {
  const params = new URLSearchParams({ action: 'TEMPLATE', text: event.title, dates: range(event).join('/') });
  return 'https://calendar.google.com/calendar/render?' + params;
}

export function calendarFile(event: CalendarEvent, now = new Date()) {
  const [start, end] = range(event);
  const dateType = event.start_at ? '' : ';VALUE=DATE';
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Milestone OS//Calendar//EN', 'BEGIN:VEVENT',
    'UID:' + event.id + '@milestone-os', 'DTSTAMP:' + utc(now), 'DTSTART' + dateType + ':' + start,
    'DTEND' + dateType + ':' + end, 'SUMMARY:' + escapeText(event.title),
    'END:VEVENT', 'END:VCALENDAR',
  ].map(foldLine).join('\r\n') + '\r\n';
}
