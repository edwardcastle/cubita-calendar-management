-- Enums
create type user_role    as enum ('manager', 'artist');
create type event_status as enum ('possible', 'hold', 'confirmed', 'cancelled');

-- profiles: extends auth.users
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'artist',
  full_name   text,
  created_at  timestamptz not null default now()
);

-- artists
create table artists (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  user_id     uuid unique references profiles(id) on delete set null,
  manager_id  uuid not null references profiles(id) on delete restrict,
  notes       text,
  created_at  timestamptz not null default now()
);

-- events
create table events (
  id               uuid primary key default gen_random_uuid(),
  artist_id        uuid not null references artists(id) on delete cascade,
  event_date       date not null,
  show_time        time,
  soundcheck_time  time,
  timezone         text not null default 'UTC',
  status           event_status not null default 'possible',
  country_code     char(2) not null,
  city             text,
  venue_name       text not null,
  festival_name    text,
  fee_amount       numeric(12,2),
  fee_currency     char(3),
  promoter_name    text,
  promoter_email   text,
  promoter_phone   text,
  notes            text,
  created_by       uuid not null references profiles(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index events_artist_date_idx on events(artist_id, event_date);
create index events_date_idx        on events(event_date);
create index events_status_idx      on events(status);

-- updated_at trigger
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger events_set_updated_at
before update on events
for each row execute function set_updated_at();
