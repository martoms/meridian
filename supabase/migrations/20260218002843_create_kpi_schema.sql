create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_display_name_length check (display_name is null or char_length(trim(display_name)) between 1 and 80)
);

create table public.kpi_goals (
  user_id uuid primary key references auth.users (id) on delete cascade,
  outreach_target integer not null check (outreach_target > 0),
  qualified_leads_target integer not null check (qualified_leads_target > 0),
  discovery_calls_target integer not null check (discovery_calls_target > 0),
  proposals_target integer not null check (proposals_target > 0),
  closed_deals_target integer not null check (closed_deals_target > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.weekly_check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  week_start date not null,
  outreach_actual integer not null check (outreach_actual >= 0),
  qualified_leads_actual integer not null check (qualified_leads_actual >= 0),
  discovery_calls_actual integer not null check (discovery_calls_actual >= 0),
  proposals_actual integer not null check (proposals_actual >= 0),
  closed_deals_actual integer not null check (closed_deals_actual >= 0),
  outreach_target integer not null check (outreach_target > 0),
  qualified_leads_target integer not null check (qualified_leads_target > 0),
  discovery_calls_target integer not null check (discovery_calls_target > 0),
  proposals_target integer not null check (proposals_target > 0),
  closed_deals_target integer not null check (closed_deals_target > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint weekly_check_ins_monday_only check (extract(isodow from week_start) = 1),
  constraint weekly_check_ins_user_week_unique unique (user_id, week_start)
);

create index weekly_check_ins_user_week_start_idx on public.weekly_check_ins (user_id, week_start desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger kpi_goals_set_updated_at
before update on public.kpi_goals
for each row execute function public.set_updated_at();

create trigger weekly_check_ins_set_updated_at
before update on public.weekly_check_ins
for each row execute function public.set_updated_at();

create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), ''));
  return new;
end;
$$;

create trigger auth_user_created_profile
after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();
