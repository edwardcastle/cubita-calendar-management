begin;
select plan(5);

-- Authenticate as the linked artist user (Buena Vista user from seed)
set local role authenticated;
set local "request.jwt.claim.sub" to '22222222-2222-2222-2222-222222222222';

-- Artist reads via events_view: must see their events, with fee_* = null
select is(
  (select count(*)::int from events_view where artist_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  3,
  'artist sees their three events via events_view'
);

select ok(
  not exists(select 1 from events_view where fee_amount is not null),
  'artist sees fee_amount as null in events_view'
);

select ok(
  not exists(select 1 from events_view where fee_currency is not null),
  'artist sees fee_currency as null in events_view'
);

-- Artist cannot insert
select throws_ok(
  $$insert into events (artist_id, event_date, country_code, venue_name, created_by)
     values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date, 'ES', 'Hack', '22222222-2222-2222-2222-222222222222')$$,
  '42501',
  null,
  'artist cannot insert events (RLS WITH CHECK)'
);

-- Artist cannot update events
update events set notes = 'tampered' where artist_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
select is(
  (select count(*)::int from events where notes = 'tampered'),
  0,
  'artist update affected 0 rows (RLS silently filtered)'
);

select * from finish();
rollback;
