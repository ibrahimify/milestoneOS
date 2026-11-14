-- Preserve unknown creation times for existing logs.
alter table public.sessions add column if not exists created_at timestamptz;
alter table public.sessions alter column created_at set default now();
