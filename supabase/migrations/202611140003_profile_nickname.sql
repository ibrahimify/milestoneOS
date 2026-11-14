grant update (nickname) on public.profiles to authenticated;

drop policy if exists profile_update_own_nickname on public.profiles;
create policy profile_update_own_nickname on public.profiles for update to authenticated
  using (id = (select auth.uid()) and (select public.workspace_access()))
  with check (id = (select auth.uid()) and (select public.workspace_access()));
