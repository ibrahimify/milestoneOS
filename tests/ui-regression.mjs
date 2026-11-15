import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const apiPort = 54651;
const appPort = 54652;
const apiUrl = `http://127.0.0.1:${apiPort}`;
const appUrl = `http://127.0.0.1:${appPort}`;
const userId = '11111111-1111-4111-8111-111111111111';
const createdAt = '2026-11-15T09:00:00Z';
const profile = { id: userId, email: 'mentor@example.test', nickname: 'Ibra', status: 'approved', role: 'admin', created_at: createdAt };
const mentees = Array.from({ length: 4 }, (_, index) => ({
  id: `20000000-0000-4000-8000-00000000000${index}`,
  mentor_id: userId,
  name: ['Alex Morgan', 'Sam Patel', 'Robin Chen', 'Jamie Rivera'][index],
  email: '', phone: '', year_group: 'Senior', subject: '',
  goal: ['Build a research shortlist', 'Prepare for a design review', 'Choose a spring module', 'Make a study plan'][index],
  long_term_goal: '', interests: '', preferences: '', module_guidance: '', next_milestone: '',
  recommended_modules: '', selected_modules: '', notes: '', scratchpad: '', skedda_link: '',
}));
const sessions = Array.from({ length: 3 }, (_, index) => ({
  id: `30000000-0000-4000-8000-00000000000${index}`,
  mentor_id: userId, mentee_id: mentees[0].id,
  date: `2026-11-${14 - index}`, duration: 30, topic: `Session ${3 - index}`,
  notes: '', next_action: '', follow_up: null, follow_up_completed_at: null,
  created_at: `2026-11-${14 - index}T09:00:00Z`,
}));
const tables = {
  mentees,
  sessions,
  calendar_events: [],
  finance_settings: [{ gross: 0, tax_rate: 0, currency: 'HUF' }],
  payments: [],
  module_categories: [],
  modules: [],
};

function token() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + 3600, aud: 'authenticated', role: 'authenticated' })).toString('base64url');
  return `${header}.${payload}.signature`;
}

function user() {
  return { ...profile, aud: 'authenticated', email_confirmed_at: createdAt, app_metadata: {}, user_metadata: {}, identities: [] };
}

const api = createServer(async (request, response) => {
  const url = new URL(request.url, apiUrl);
  const send = (value, status = 200) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(value));
  };

  if (url.pathname === '/auth/v1/token') {
    return send({ user: user(), access_token: token(), refresh_token: 'fixture-refresh', expires_in: 3600, token_type: 'bearer' });
  }
  if (url.pathname === '/auth/v1/user') return send(user());
  if (url.pathname === '/auth/v1/logout') return send({});
  if (url.pathname === '/rest/v1/rpc/workspace_access') return send(true);

  const table = url.pathname.split('/').at(-1);
  if (table === 'profiles') {
    return send(url.searchParams.has('id') ? [profile] : []);
  }
  if (table in tables) return send(tables[table]);
  return send({ message: `Unknown fixture route: ${url.pathname}` }, 404);
});

await new Promise((resolve) => api.listen(apiPort, '127.0.0.1', resolve));
const next = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(appPort)], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: apiUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'fixture-key',
    NEXT_TELEMETRY_DISABLED: '1',
  },
  stdio: 'inherit',
});

let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(appUrl);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error('Milestone OS did not start for the UI regression check.');

  const localChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROME_PATH || (existsSync(localChrome) ? localChrome : undefined),
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto(appUrl, { waitUntil: 'networkidle' });

  const cursor = page.locator('.cursor-glow');
  await page.mouse.move(280, 180);
  assert.equal(await cursor.getAttribute('data-visible'), 'true');
  assert.ok((await cursor.evaluate((node) => getComputedStyle(node).filter)) !== 'none', 'Sign-in cursor glow must be rendered.');

  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Email', { exact: true }).fill(profile.email);
  await page.getByLabel('Password', { exact: true }).fill('fixture-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).last().click();
  await page.getByText('Welcome, Ibra', { exact: true }).waitFor();

  const dashboardSections = page.locator('.dashboard-columns > section');
  const roster = dashboardSections.filter({ has: page.getByRole('heading', { name: 'Mentees', exact: true }) });
  const recent = dashboardSections.filter({ has: page.getByRole('heading', { name: 'Recent logs', exact: true }) });
  async function assertBalanced(expectedMentees, expectedLogs) {
    assert.equal(await roster.locator('.dashboard-preview-row').count(), expectedMentees);
    assert.equal(await recent.locator('.dashboard-preview-row').count(), expectedLogs);
    const rosterBox = await roster.boundingBox();
    const recentBox = await recent.boundingBox();
    assert.ok(rosterBox && recentBox);
    assert.ok(Math.abs(rosterBox.y - recentBox.y) < 1, 'Dashboard panels must start on the same row.');
    assert.ok(Math.abs(rosterBox.height - recentBox.height) < 1, 'Dashboard panels must have equal height.');
  }
  await assertBalanced(4, 3);

  for (const viewport of [{ width: 1440, height: 960 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 720 }]) {
    await page.setViewportSize(viewport);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Dashboard must not overflow at ${viewport.width}px.`);
    if (viewport.width > 560) {
      const left = await roster.boundingBox();
      const right = await recent.boundingBox();
      assert.ok(left && right && Math.abs(left.height - right.height) < 1, `Dashboard panels must align at ${viewport.width}px.`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.mouse.move(680, 450);
  assert.equal(await cursor.getAttribute('data-visible'), 'true');
  assert.ok((await cursor.evaluate((node) => getComputedStyle(node).filter)) !== 'none', 'Dashboard cursor glow must be rendered.');

  const remainingMentees = mentees.splice(1);
  await page.reload({ waitUntil: 'networkidle' });
  await assertBalanced(1, 3);
  mentees.push(...remainingMentees);

  const extras = Array.from({ length: 2 }, (_, index) => ({ ...mentees[0], id: `40000000-0000-4000-8000-00000000000${index}`, name: `Extra mentee ${index + 1}` }));
  mentees.push(...extras);
  await page.reload({ waitUntil: 'networkidle' });
  await assertBalanced(4, 3);
  await roster.getByRole('button', { name: 'View all 6 mentees' }).waitFor();
  mentees.splice(-extras.length);

  const savedMentees = mentees.splice(0);
  const savedSessions = sessions.splice(0);
  await page.reload({ waitUntil: 'networkidle' });
  await assertBalanced(0, 0);
  await roster.getByText('No mentees yet.', { exact: true }).waitFor();
  await recent.getByText('No logs yet.', { exact: true }).waitFor();
  mentees.push(...savedMentees);
  sessions.push(...savedSessions);
  await page.reload({ waitUntil: 'networkidle' });
  await assertBalanced(4, 3);

  await roster.getByRole('button', { name: /Alex Morgan/ }).click();
  const hero = page.locator('.dossier-hero');
  await hero.getByRole('heading', { name: 'Alex Morgan' }).waitFor();
  assert.equal(await hero.getByText('Build a research shortlist', { exact: true }).count(), 0);
  assert.match(await hero.locator('.dossier-minutes').innerText(), /90 min\s+3 sessions/);
  assert.match(await hero.evaluate((node) => getComputedStyle(node).gridTemplateColumns), /px/);

  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile profile must not overflow horizontally.');
  await page.getByRole('button', { name: 'Mentees' }).first().click();
  await page.getByText('Mentee profiles', { exact: true }).waitFor();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile mentee gallery must not overflow horizontally.');
  assert.deepEqual(pageErrors, []);

  console.log('UI regression passed at 320, 390, 768 and 1440 px.');
} finally {
  await browser?.close();
  next.kill();
  api.close();
}
