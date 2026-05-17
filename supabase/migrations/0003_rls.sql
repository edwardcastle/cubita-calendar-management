-- Helpers (security definer to avoid recursive RLS)
create or replace function is_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from profiles where id = auth.uid()) = 'manager', false);
$$;

create or replace function owns_artist(p_artist_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from artists
    where id = p_artist_id and manager_id = auth.uid()
  );
$$;

create or replace function is_my_artist(p_artist_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from artists
    where id = p_artist_id and user_id = auth.uid()
  );
$$;

-- Enable RLS
alter table profiles enable row level security;
alter table artists  enable row level security;
alter table events   enable row level security;

-- profiles policies
create policy "profile readable by owner"
  on profiles for select
  using (id = auth.uid());

create policy "profile readable by manager of artist-user"
  on profiles for select
  using (id in (select user_id from artists where manager_id = auth.uid()));

create policy "profile updatable by owner"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- artists policies
create policy "artists selectable by owning manager"
  on artists for select
  using (manager_id = auth.uid());

create policy "artists selectable by linked artist-user"
  on artists for select
  using (user_id = auth.uid());

create policy "artists insertable by managers only"
  on artists for insert
  with check (is_manager() and manager_id = auth.uid());

create policy "artists updatable by owning manager"
  on artists for update
  using (manager_id = auth.uid())
  with check (manager_id = auth.uid());

create policy "artists deletable by owning manager"
  on artists for delete
  using (manager_id = auth.uid());

-- events policies
create policy "events readable by manager or artist"
  on events for select
  using (owns_artist(artist_id) or is_my_artist(artist_id));

create policy "events insertable by owning manager"
  on events for insert
  with check (owns_artist(artist_id));

create policy "events updatable by owning manager"
  on events for update
  using (owns_artist(artist_id))
  with check (owns_artist(artist_id));

create policy "events deletable by owning manager"
  on events for delete
  using (owns_artist(artist_id));

-- NOTE: do NOT revoke EXECUTE on these helpers from `authenticated`.
-- SECURITY DEFINER only changes which role the function BODY runs as; the
-- caller still needs EXECUTE permission to invoke it. Revoking from
-- `authenticated` makes Postgres crash when an RLS policy evaluates
-- `owns_artist(...)` for an authenticated user — breaking RLS entirely.
-- The RPC-leak concern from the T7 review is acknowledged but accepted:
-- the helpers only leak a single true/false bit per probe, and the
-- alternative (moving them to a private, non-exposed schema) requires
-- more rework than the v1 threat model justifies. Re-evaluate before
-- public production launch.
