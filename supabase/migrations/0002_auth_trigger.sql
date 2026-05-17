create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_artist_id uuid := nullif(new.raw_user_meta_data->>'artist_id', '')::uuid;
begin
  insert into profiles (id, role, full_name)
  values (
    new.id,
    case when v_artist_id is not null then 'artist'::user_role else 'manager'::user_role end,
    new.raw_user_meta_data->>'full_name'
  );
  if v_artist_id is not null then
    update artists set user_id = new.id where id = v_artist_id;
  end if;
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- Prevent self-promotion: users cannot change their own `role` column.
-- service_role bypasses this trigger entirely.
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
    new.role := old.role;
  end if;
  return new;
end $$;

create trigger profiles_protect_role
before update on profiles
for each row execute function protect_profile_role();
