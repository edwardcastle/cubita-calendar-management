begin;
select plan(6);

-- Create a second manager so we can test isolation.
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role)
values
  ('99999999-9999-9999-9999-999999999999', 'manager2@demo.local',
   crypt('demo1234', gen_salt('bf')), now(), '{"full_name":"Manager B"}'::jsonb,
   'authenticated', 'authenticated');
-- profile was auto-created as 'manager' by trigger; no override needed.

-- Manager B creates an artist
set local role authenticated;
set local "request.jwt.claim.sub" to '99999999-9999-9999-9999-999999999999';
insert into artists (id, name, slug, manager_id)
values ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Otro', 'otro', '99999999-9999-9999-9999-999999999999');

-- As manager B, sees only their own artist
select is(
  (select count(*)::int from artists),
  1,
  'manager B sees only their own artist'
);

select is(
  (select name from artists),
  'Otro',
  'manager B sees correct artist'
);

-- As manager A
set local "request.jwt.claim.sub" to '11111111-1111-1111-1111-111111111111';
select is(
  (select count(*)::int from artists),
  2,
  'manager A sees their two artists'
);

select ok(
  not exists(select 1 from artists where manager_id = '99999999-9999-9999-9999-999999999999'),
  'manager A does NOT see manager B artists'
);

-- Manager A cannot insert on behalf of manager B
select throws_ok(
  $$insert into artists (name, slug, manager_id) values ('Hack', 'hack', '99999999-9999-9999-9999-999999999999')$$,
  '42501',
  null,
  'manager A cannot insert artist owned by manager B (RLS WITH CHECK)'
);

-- Manager A cannot delete manager B artist
delete from artists where id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
select is(
  (select count(*)::int from artists where id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  0,
  'manager A delete on manager B artist matched 0 rows (RLS silently filtered)'
);

select * from finish();
rollback;
