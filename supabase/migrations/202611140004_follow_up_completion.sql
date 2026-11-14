alter table public.sessions add column if not exists follow_up_completed_at timestamptz;

create or replace function public.reset_edited_follow_up() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.next_action is distinct from old.next_action
    or new.follow_up is distinct from old.follow_up then
    new.follow_up_completed_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists reset_edited_follow_up on public.sessions;
create trigger reset_edited_follow_up before update on public.sessions
  for each row execute function public.reset_edited_follow_up();
