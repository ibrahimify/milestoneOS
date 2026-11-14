import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

const admin = '00000000-0000-4000-8000-000000000001';
const mentorA = '00000000-0000-4000-8000-000000000002';
const mentorB = '00000000-0000-4000-8000-000000000003';
const pending = '00000000-0000-4000-8000-000000000004';

test('approval, tenant isolation and shared resources', async (t) => {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users (
      id uuid primary key, email text, email_confirmed_at timestamptz,
      raw_user_meta_data jsonb not null default '{}'
    );
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
    $$;
    grant usage on schema auth to authenticated;
  `);
  for (const filename of ['202611140001_workspace.sql', '202611140002_module_catalogue.sql', '202611140003_profile_nickname.sql', '202611140004_follow_up_completion.sql', '202611150005_session_creation_time.sql']) {
    await db.exec(await readFile(new URL('../supabase/migrations/' + filename, import.meta.url), 'utf8'));
  }
  for (const [index, user] of [admin, mentorA, mentorB, pending].entries()) {
    await db.query('insert into auth.users values ($1,$2,$3,$4)', [
      user, 'user' + index + '@example.test', user === pending ? null : new Date().toISOString(),
      { nickname: 'User ' + index, role: 'admin', status: 'approved' },
    ]);
  }
  const result = async (sql, values) => (await db.query(sql, values)).rows;
  async function as(user) {
    await db.exec('reset role');
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [user]);
    await db.exec('set role authenticated');
  }
  assert.equal((await result('select count(*)::int as count from signup_notifications'))[0].count, 4);
  await db.query("update profiles set role='admin',status='approved' where id=$1", [admin]);
  await as(mentorA);
  assert.deepEqual(await result('select role,status,nickname from profiles'), [{ role: 'mentor', status: 'pending', nickname: 'User 1' }]);
  assert.deepEqual(await result("update profiles set nickname='Pending edit' returning nickname"), []);
  await assert.rejects(db.query("update profiles set status='approved'"), { code: '42501' });
  await assert.rejects(db.query("select review_mentor($1,'approved')", [mentorA]), { code: '42501' });
  await assert.rejects(db.query("insert into mentees(name,year_group) values ('Private','Senior')"), { code: '42501' });

  await as(admin);
  await assert.rejects(db.query("select review_mentor($1,'approved')", [pending]), { code: '22023' });
  await db.query("select review_mentor($1,'approved')", [mentorA]);
  await db.query("select review_mentor($1,'approved')", [mentorB]);
  const [{ id: sharedEvent }] = await result("insert into calendar_events(title,date,category,shared) values ('Shared','2026-11-20','Deadline',true) returning id");
  await as(mentorA);
  assert.deepEqual(await result("update profiles set nickname='Updated nickname' returning nickname"), [{ nickname: 'Updated nickname' }]);
  assert.deepEqual(await result("update profiles set nickname='Wrong account' where id=$1 returning nickname", [mentorB]), []);
  await assert.rejects(db.query("update profiles set role='admin'"), { code: '42501' });
  assert.equal((await result('select id from modules')).length > 0, true);
  await assert.rejects(db.query("insert into module_categories(name) values ('Unauthorized')"), { code: '42501' });
  assert.deepEqual(await result('select id from calendar_events'), [{ id: sharedEvent }]);
  assert.deepEqual(await result('delete from calendar_events where id=$1 returning id', [sharedEvent]), []);
  await assert.rejects(db.query("insert into calendar_events(title,date,category,shared) values ('Fake','2026-11-20','Meeting',true)"), { code: '42501' });
  const [{ id: mentee }] = await result("insert into mentees(name,year_group) values ('Private','Senior') returning id");
  const [{ id: otherMentee }] = await result("insert into mentees(name,year_group) values ('Second','Junior') returning id");
  const [{ id: session, created_at: createdAt }] = await result("insert into sessions(mentee_id,date,duration,topic) values ($1,'2026-11-20',30,'Session') returning id, created_at", [mentee]);
  assert.ok(createdAt instanceof Date);
  await db.query("update sessions set next_action='Send shortlist', follow_up='2026-11-24' where id=$1", [session]);
  await db.query("update sessions set follow_up_completed_at=now() where id=$1", [session]);
  await db.query("update sessions set notes='Updated notes' where id=$1", [session]);
  assert.equal((await result('select follow_up_completed_at is not null as done from sessions where id=$1', [session]))[0].done, true);
  await db.query("update sessions set follow_up='2026-11-25' where id=$1", [session]);
  assert.equal((await result('select follow_up_completed_at is null as open from sessions where id=$1', [session]))[0].open, true);
  await db.query("insert into sessions(mentee_id,date,duration,topic) values ($1,'2026-11-20',45,'Other session')", [otherMentee]);
  await db.query('delete from sessions where id=$1', [session]);
  assert.deepEqual(await result('select topic from sessions'), [{ topic: 'Other session' }]);
  await db.query("insert into finance_settings(gross,tax_rate) values (100000,15) on conflict(owner_id) do update set gross=excluded.gross,tax_rate=excluded.tax_rate");
  await db.query("insert into finance_settings(gross,tax_rate) values (90000,15) on conflict(owner_id) do update set gross=excluded.gross,tax_rate=excluded.tax_rate");
  assert.deepEqual(await result('select gross::int as gross from finance_settings'), [{ gross: 90000 }]);
  await as(mentorB);
  assert.deepEqual(await result('select id from mentees'), []);
  assert.deepEqual(await result('select id from sessions'), []);
  assert.deepEqual(await result('select gross from finance_settings'), []);
  assert.deepEqual(await result('delete from mentees where id=$1 returning id', [mentee]), []);
  await assert.rejects(db.query("insert into sessions(mentee_id,date,duration,topic) values ($1,'2026-11-20',30,'Wrong owner')", [mentee]), { code: '23503' });
  await assert.rejects(db.query("insert into calendar_events(mentee_id,title,date,category) values ($1,'Wrong owner','2026-11-20','Meeting')", [mentee]), { code: '23503' });
  await as(admin);
  assert.deepEqual(await result('select id from mentees'), []);
  await db.query("select review_mentor($1,'suspended')", [mentorA]);
  await as(mentorA);
  assert.deepEqual(await result('select id from mentees'), []);
  assert.deepEqual(await result('select id from calendar_events'), []);
  assert.deepEqual(await result('select id from modules'), []);
});
