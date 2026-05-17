-- KNOWN ISSUE — to be resolved in T15 (invite flow design):
-- This trigger reads `raw_user_meta_data->>'artist_id'`, which is user-controlled
-- on open signup. A direct caller of the Supabase auth API can include
--   data: { artist_id: '<victim-uuid>' }
-- and auto-link themselves as that artist. The application-level mitigation we
-- rely on TODAY is that the only public signup path (lib/auth/actions.ts ->
-- signUpManager, added in T15) never sends `artist_id`, and the artist-invite
-- path uses the service-role admin SDK. T15 will harden this either by
-- (a) disabling open signup and provisioning managers via admin SDK, or
-- (b) moving artist-link out of the trigger into a service-role server action
--     that validates the invite via a separate table.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_artist_id uuid;
begin
  -- Defensive: malformed `artist_id` becomes NULL rather than rolling back
  -- the entire auth signup with an opaque uuid cast error.
  begin
    v_artist_id := nullif(new.raw_user_meta_data->>'artist_id', '')::uuid;
  exception
    when invalid_text_representation then
      v_artist_id := null;
  end;

  insert into profiles (id, role, full_name)
  values (
    new.id,
    case when v_artist_id is not null then 'artist'::user_role else 'manager'::user_role end,
    new.raw_user_meta_data->>'full_name'
  );

  if v_artist_id is not null then
    update artists set user_id = new.id where id = v_artist_id;
    -- Refuse the signup if the invited artist record no longer exists:
    -- leaving the user with role 'artist' but no linked artist would create
    -- a confusing partially-initialised account.
    if not found then
      raise exception 'invited artist % does not exist', v_artist_id
        using errcode = 'foreign_key_violation';
    end if;
  end if;

  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- Prevent self-promotion: users cannot change their own `role` column.
-- service_role bypasses this trigger entirely.
-- We raise instead of silently reverting so a debugging engineer sees a
-- clear error rather than "UPDATE 1" followed by a SELECT that shows
-- the value unchanged. This is also a meaningful audit signal in prod.
create or replace function protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_setting('request.jwt.claim.role', true) = 'service_role' then
    return new;
  end if;
  if old.role is distinct from new.role then
    raise exception 'permission denied: role cannot be modified except by service_role'
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end $$;

create trigger profiles_protect_role
before update on profiles
for each row
when (old.role is distinct from new.role)
execute function protect_profile_role();
