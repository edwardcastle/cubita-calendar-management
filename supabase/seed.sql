-- Demo data. Only ever runs in local development (supabase db reset).
-- One manager + two artist-users + 2 artists + 6 events to make the UI
-- never look empty.

-- Insert auth users (trigger creates profiles with role='manager' by default).
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role)
values
  ('11111111-1111-1111-1111-111111111111', 'manager@demo.local',
   crypt('demo1234', gen_salt('bf')), now(), '{"full_name":"Manager Demo"}'::jsonb,
   'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'artist1@demo.local',
   crypt('demo1234', gen_salt('bf')), now(), '{"full_name":"Buena Vista"}'::jsonb,
   'authenticated', 'authenticated'),
  ('33333333-3333-3333-3333-333333333333', 'artist2@demo.local',
   crypt('demo1234', gen_salt('bf')), now(), '{"full_name":"Yotuel"}'::jsonb,
   'authenticated', 'authenticated');

-- Override role for the two artist users. protect_profile_role only allows
-- this when the caller is service_role. We wrap in a transaction so that
-- SET LOCAL takes effect (it is a no-op outside a transaction block).
-- The superuser running db reset already bypasses RLS, providing the
-- additional layer of protection needed.
begin;
set local "request.jwt.claim.role" to 'service_role';
update profiles set role = 'artist'
  where id in ('22222222-2222-2222-2222-222222222222',
               '33333333-3333-3333-3333-333333333333');
commit;

-- Artists owned by the manager, linked to artist-users.
insert into artists (id, name, slug, user_id, manager_id) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Buena Vista', 'buena-vista',
   '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Yotuel',      'yotuel',
   '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111');

-- Six events in a mix of statuses, all created by the manager.
insert into events (artist_id, event_date, show_time, timezone, status, country_code, city, venue_name, festival_name, fee_amount, fee_currency, promoter_name, promoter_email, created_by) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date + 14, '21:00', 'Europe/Madrid',  'confirmed', 'ES', 'Barcelona', 'Sala Apolo',                null,                 2500.00, 'EUR', 'Joan Promotor',  'joan@apolo.cat',   '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date + 21, '22:00', 'Europe/Madrid',  'hold',      'ES', 'Madrid',    'Razzmatazz',                null,                 3000.00, 'EUR', 'Carla Booking',  'carla@razzm.es',   '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date + 45, '23:00', 'Europe/Paris',   'possible',  'FR', 'Paris',     'La Cigale',                 'Festival Latino',    null,    null,  'Pierre',         'pierre@cigale.fr', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', current_date + 7,  '20:30', 'America/Havana', 'confirmed', 'CU', 'La Habana', 'Fabrica de Arte Cubano',    null,                 800.00,  'USD', 'Yoel',           'yoel@fac.cu',      '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', current_date + 30, '19:00', 'Europe/Rome',    'possible',  'IT', 'Roma',      'Auditorium Parco della Musica', 'Tomorrowland 2026', 5000.00, 'EUR', 'Giulia', 'giulia@auditorium.it', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', current_date - 10, '21:00', 'Europe/Madrid',  'cancelled', 'ES', 'Valencia',  'Sala Moon',                 null,                 null,    null,  'Marta',          'marta@moon.es',    '11111111-1111-1111-1111-111111111111');
