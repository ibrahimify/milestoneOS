import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calendarFile, googleCalendarLink } from '../lib/calendar.ts';

const event = {
  id: 'fixture', title: 'Meeting, next steps', date: '2026-11-30',
  start_at: '2026-11-30T16:00:00.000Z', duration: 45, description: 'Private notes',
};

test('export preserves UTC time, duration and title', () => {
  const google = new URL(googleCalendarLink(event));
  assert.equal(google.searchParams.get('dates'), '20261130T160000Z/20261130T164500Z');
  assert.equal(google.searchParams.get('text'), event.title);
  assert.equal(google.searchParams.has('details'), false);
  const file = calendarFile(event);
  assert.match(file, /DTSTART:20261130T160000Z\r\nDTEND:20261130T164500Z/);
  assert.match(file, /SUMMARY:Meeting\\, next steps/);
  assert.equal(file.includes(event.description), false);
});

test('all-day events and long Unicode titles export correctly', () => {
  const allDay = { ...event, title: 'é'.repeat(80) + '\nEND:VEVENT', start_at: null };
  assert.equal(new URL(googleCalendarLink(allDay)).searchParams.get('dates'), '20261130/20261201');
  const file = calendarFile(allDay);
  assert.match(file, /DTSTART;VALUE=DATE:20261130\r\nDTEND;VALUE=DATE:20261201/);
  assert.ok(file.split('\r\n').every((line) => Buffer.byteLength(line) <= 75));
  assert.ok(file.replaceAll('\r\n ', '').includes('SUMMARY:' + 'é'.repeat(80) + '\\nEND:VEVENT'));
});
