-- AKTION.CH: visitor analytics, consent log, user accounts and synced watch-lists.
-- Apply to a NEW, dedicated Supabase project (never the courses or Indiaspora projects).
-- Privacy by design: no IP address, no query text and no fingerprinting is stored; events exist only after analytics consent.

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  user_id uuid references auth.users(id) on delete set null,
  policy_version text not null check (length(policy_version) <= 20),
  necessary boolean not null default true,
  analytics boolean not null,
  lang text check (length(lang) <= 5),
  created_at timestamptz not null default now()
);
create index on public.consents (visitor_id, created_at desc);

create table public.events (
  id bigint generated always as identity primary key,
  visitor_id uuid not null,
  session_id uuid not null,
  user_id uuid default auth.uid() references auth.users(id) on delete set null,
  type text not null check (type in ('pageview','tab','outbound','watch','share','search','login','signup')),
  tab text check (length(tab) <= 30),
  deal_id text check (length(deal_id) <= 120),
  shop text check (length(shop) <= 40),
  path text check (length(path) <= 200),
  referrer text check (length(referrer) <= 200),
  utm_source text check (length(utm_source) <= 60),
  utm_medium text check (length(utm_medium) <= 60),
  utm_campaign text check (length(utm_campaign) <= 80),
  lang text check (length(lang) <= 5),
  device text check (device in ('mobile','tablet','desktop')),
  created_at timestamptz not null default now()
);
create index on public.events (created_at desc);
create index on public.events (type, created_at desc);

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  lang text,
  created_at timestamptz not null default now()
);
create table public.watchlist (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  deal_id text not null check (length(deal_id) <= 120),
  created_at timestamptz not null default now(),
  primary key (user_id, deal_id)
);

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id, email) values (new.id, new.email) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Row level security: visitors can only INSERT events/consents; nobody can read them from the browser.
alter table public.consents enable row level security;
alter table public.events enable row level security;
alter table public.profiles enable row level security;
alter table public.watchlist enable row level security;

create policy "insert consent" on public.consents for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));
create policy "insert events" on public.events for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));
create policy "own profile read" on public.profiles for select to authenticated using (user_id = (select auth.uid()));
create policy "own watchlist" on public.watchlist for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

revoke all on public.consents, public.events from anon, authenticated;
grant insert on public.consents, public.events to anon, authenticated;
grant usage on all sequences in schema public to anon, authenticated;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
revoke all on public.watchlist from anon;
grant select, insert, delete on public.watchlist to authenticated;

-- GDPR / nDSG: a signed-in user can erase their account, profile, watch-list and linked events.
create function public.delete_my_account() returns void language plpgsql security definer set search_path = '' as $$
begin
  delete from public.events where user_id = auth.uid();
  delete from public.consents where user_id = auth.uid();
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- Reporting views: owner/service role only (run in the Supabase SQL editor).
create view public.analytics_daily with (security_invoker = true) as
  select date_trunc('day', created_at)::date as day,
         count(*) filter (where type = 'pageview') as pageviews,
         count(distinct visitor_id) as visitors,
         count(distinct session_id) as sessions,
         count(*) filter (where type = 'outbound') as shop_clicks,
         count(*) filter (where type = 'watch') as saves,
         count(*) filter (where type = 'signup') as signups
  from public.events group by 1 order by 1 desc;
create view public.analytics_top_deals with (security_invoker = true) as
  select deal_id, shop, count(*) as clicks, count(distinct visitor_id) as visitors
  from public.events where type = 'outbound' group by 1, 2 order by clicks desc;
create view public.analytics_sources with (security_invoker = true) as
  select coalesce(utm_source, nullif(split_part(split_part(referrer, '//', 2), '/', 1), ''), 'direct') as source,
         count(distinct session_id) as sessions
  from public.events where type = 'pageview' group by 1 order by sessions desc;
create view public.consent_rate with (security_invoker = true) as
  select date_trunc('day', created_at)::date as day, count(*) as decisions, count(*) filter (where analytics) as accepted
  from public.consents group by 1 order by 1 desc;
revoke all on public.analytics_daily, public.analytics_top_deals, public.analytics_sources, public.consent_rate from anon, authenticated;

-- Retention (enable pg_cron in the dashboard, then schedule):
-- select cron.schedule('purge-events', '17 3 * * *', $$delete from public.events where created_at < now() - interval '14 months'$$);
