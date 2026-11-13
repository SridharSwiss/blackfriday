-- Admin access for the AKTION.CH dashboard. Run once in the SQL Editor of the dedicated project (after schema.sql).
-- Admins are matched by the verified email in the sign-in token; the list is not readable from the browser.
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
insert into public.admins (email) values ('sridhar.gande@gmail.com') on conflict do nothing;
-- Only this one account is an admin: remove any other row.
delete from public.admins where lower(email) <> 'sridhar.gande@gmail.com';

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.admin_dashboard(days int default 30) returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare r jsonb; since timestamptz := now() - make_interval(days => least(greatest(days, 1), 365));
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  select jsonb_build_object(
    'totals', (select jsonb_build_object('visitors', count(distinct visitor_id), 'sessions', count(distinct session_id),
      'pageviews', count(*) filter (where type = 'pageview'), 'shop_clicks', count(*) filter (where type = 'outbound'),
      'saves', count(*) filter (where type = 'watch'), 'logins', count(*) filter (where type = 'login')) from public.events where created_at > since),
    'users', (select count(*) from public.profiles),
    'new_users', (select count(*) from public.profiles where created_at > since),
    'consent', (select jsonb_build_object('decisions', count(*), 'accepted', count(*) filter (where analytics)) from public.consents where created_at > since),
    'daily', coalesce((select jsonb_agg(x order by x.day) from (select created_at::date as day, count(distinct visitor_id) as visitors,
      count(*) filter (where type = 'pageview') as pageviews, count(*) filter (where type = 'outbound') as clicks from public.events where created_at > since group by 1) x), '[]'),
    'tabs', coalesce((select jsonb_agg(x) from (select tab as k, count(*) as n from public.events where type = 'tab' and created_at > since group by 1 order by 2 desc limit 10) x), '[]'),
    'deals', coalesce((select jsonb_agg(x) from (select deal_id as k, shop, count(*) as n from public.events where type = 'outbound' and created_at > since group by 1, 2 order by 3 desc limit 15) x), '[]'),
    'shops', coalesce((select jsonb_agg(x) from (select shop as k, count(*) as n from public.events where type = 'outbound' and created_at > since group by 1 order by 2 desc limit 10) x), '[]'),
    'sources', coalesce((select jsonb_agg(x) from (select coalesce(utm_source, nullif(split_part(split_part(referrer, '//', 2), '/', 1), ''), 'direct') as k, count(distinct session_id) as n
      from public.events where type = 'pageview' and created_at > since group by 1 order by 2 desc limit 10) x), '[]'),
    'devices', coalesce((select jsonb_agg(x) from (select device as k, count(distinct visitor_id) as n from public.events where created_at > since group by 1 order by 2 desc) x), '[]'),
    'langs', coalesce((select jsonb_agg(x) from (select lang as k, count(distinct visitor_id) as n from public.events where created_at > since group by 1 order by 2 desc) x), '[]'),
    'recent_users', coalesce((select jsonb_agg(x) from (select email, created_at from public.profiles order by created_at desc limit 10) x), '[]')
  ) into r;
  return r;
end $$;
revoke all on function public.admin_dashboard(int) from public, anon;
grant execute on function public.admin_dashboard(int) to authenticated;
