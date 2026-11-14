create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(btrim(nickname)) between 1 and 60),
  email text not null,
  role text not null default 'mentor' check (role in ('mentor', 'admin')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  created_at timestamptz not null default now()
);

create table public.signup_notifications (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create function public.register_mentor() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, nickname, email)
  values (new.id, coalesce(nullif(left(btrim(new.raw_user_meta_data ->> 'nickname'), 60), ''), 'Mentor'), new.email);
  insert into public.signup_notifications (user_id) values (new.id);
  return new;
end;
$$;

create trigger register_mentor after insert on auth.users
for each row when (new.email is not null) execute function public.register_mentor();

create function public.workspace_access(admin_only boolean default false) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    join auth.users u on u.id = p.id
    where p.id = (select auth.uid()) and p.status = 'approved'
      and u.email_confirmed_at is not null and (not admin_only or p.role = 'admin')
  );
$$;

create table public.mentees (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  year_group text not null check (year_group in ('Freshman', 'Sophomore', 'Junior', 'Senior')),
  subject text not null default '',
  email text not null default '',
  phone text not null default '',
  skedda_link text not null default '',
  goal text not null default '',
  long_term_goal text not null default '',
  interests text not null default '',
  preferences text not null default '',
  next_milestone text not null default '',
  module_guidance text not null default '',
  recommended_modules text not null default '',
  selected_modules text not null default '',
  notes text not null default '',
  scratchpad text not null default '',
  unique (owner_id, id)
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  mentee_id uuid not null,
  date date not null,
  duration integer not null check (duration between 1 and 1440),
  topic text not null check (char_length(btrim(topic)) between 1 and 160),
  notes text not null default '',
  next_action text not null default '',
  follow_up date,
  foreign key (owner_id, mentee_id) references public.mentees(owner_id, id) on delete cascade
);

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  mentee_id uuid,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  date date not null,
  start_at timestamptz,
  duration integer not null default 30 check (duration between 1 and 1440),
  description text not null default '',
  category text not null check (category in ('Meeting', 'Deadline', 'Reminder')),
  shared boolean not null default false,
  check (not shared or mentee_id is null),
  foreign key (owner_id, mentee_id) references public.mentees(owner_id, id) on delete cascade
);

create table public.finance_settings (
  owner_id uuid primary key default auth.uid() references public.profiles(id) on delete cascade,
  gross numeric(14,2) not null default 0 check (gross >= 0),
  tax_rate numeric(5,2) not null default 0 check (tax_rate between 0 and 100),
  currency text not null default 'HUF' check (currency in ('HUF', 'EUR', 'USD', 'GBP'))
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  description text not null check (char_length(btrim(description)) between 1 and 160),
  amount numeric(14,2) not null check (amount > 0),
  due_date date not null,
  received_at timestamptz
);

create table public.module_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(btrim(name)) between 1 and 80)
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.module_categories(id) on delete restrict,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  division text not null default '',
  faculty text not null default '',
  description text not null default '',
  form_link text not null default ''
);

create index sessions_owner_mentee on public.sessions (owner_id, mentee_id);
create index events_owner_mentee on public.calendar_events (owner_id, mentee_id);
create index payments_owner on public.payments (owner_id);
create index modules_category on public.modules (category_id);

alter table public.profiles enable row level security;
alter table public.signup_notifications enable row level security;
alter table public.calendar_events enable row level security;

revoke all on public.profiles, public.signup_notifications from anon, authenticated;
grant select on public.profiles to authenticated;
grant select, update on public.signup_notifications to service_role;
grant select on public.profiles to service_role;
create policy profile_read on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.workspace_access(true)));

revoke all on public.calendar_events from anon, authenticated;
grant select, insert, update, delete on public.calendar_events to authenticated;

create policy event_read on public.calendar_events for select to authenticated
  using ((select public.workspace_access()) and (shared or owner_id = (select auth.uid())));
create policy event_insert on public.calendar_events for insert to authenticated
  with check (owner_id = (select auth.uid()) and
    ((not shared and (select public.workspace_access())) or (shared and (select public.workspace_access(true)))));
create policy event_update on public.calendar_events for update to authenticated
  using ((not shared and owner_id = (select auth.uid()) and (select public.workspace_access()))
    or (shared and (select public.workspace_access(true))))
  with check ((not shared and owner_id = (select auth.uid()) and (select public.workspace_access()))
    or (shared and (select public.workspace_access(true))));
create policy event_delete on public.calendar_events for delete to authenticated
  using ((not shared and owner_id = (select auth.uid()) and (select public.workspace_access()))
    or (shared and (select public.workspace_access(true))));

do $$
declare relation text;
begin
  foreach relation in array array['mentees', 'sessions', 'finance_settings', 'payments'] loop
    execute format('alter table public.%I enable row level security', relation);
    execute format('revoke all on public.%I from anon, authenticated', relation);
    execute format('grant select, insert, update, delete on public.%I to authenticated', relation);
    execute format(
      'create policy owner_access on public.%I for all to authenticated
        using (owner_id = (select auth.uid()) and (select public.workspace_access()))
        with check (owner_id = (select auth.uid()) and (select public.workspace_access()))',
      relation);
  end loop;
  foreach relation in array array['module_categories', 'modules'] loop
    execute format('alter table public.%I enable row level security', relation);
    execute format('revoke all on public.%I from anon, authenticated', relation);
    execute format('grant select, insert, update, delete on public.%I to authenticated', relation);
    execute format('create policy catalogue_read on public.%I for select to authenticated
      using ((select public.workspace_access()))', relation);
    execute format('create policy catalogue_admin on public.%I for all to authenticated
      using ((select public.workspace_access(true))) with check ((select public.workspace_access(true)))', relation);
  end loop;
end;
$$;

create function public.review_mentor(mentor_id uuid, decision text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.workspace_access(true) then
    raise insufficient_privilege using message = 'Administrator access required';
  end if;
  if decision not in ('approved', 'rejected', 'suspended') then
    raise invalid_parameter_value using message = 'Invalid decision';
  end if;
  update public.profiles p set status = decision
    where p.id = mentor_id and p.role = 'mentor'
      and (decision <> 'approved' or exists (
        select 1 from auth.users u where u.id = p.id and u.email_confirmed_at is not null
      ));
  if not found then
    raise invalid_parameter_value using message = 'Ask the mentor to verify their email before approval';
  end if;
end;
$$;

revoke all on function public.register_mentor(), public.workspace_access(boolean), public.review_mentor(uuid, text) from public, anon, authenticated;
grant execute on function public.workspace_access(boolean), public.review_mentor(uuid, text) to authenticated;
