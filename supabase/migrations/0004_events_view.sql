create or replace view events_view with (security_invoker = on) as
select
  e.id,
  e.artist_id,
  e.event_date,
  e.show_time,
  e.soundcheck_time,
  e.timezone,
  e.status,
  e.country_code,
  e.city,
  e.venue_name,
  e.festival_name,
  case when is_manager() then e.fee_amount   else null end as fee_amount,
  case when is_manager() then e.fee_currency else null end as fee_currency,
  e.promoter_name,
  e.promoter_email,
  e.promoter_phone,
  e.notes,
  e.created_by,
  e.created_at,
  e.updated_at,
  -- derived "completed" flag
  (e.event_date < current_date and e.status = 'confirmed') as is_completed
from events e;

-- Allow authenticated users to select from the view.
grant select on events_view to authenticated;
