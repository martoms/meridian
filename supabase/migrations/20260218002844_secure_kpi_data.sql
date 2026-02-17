grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.kpi_goals to authenticated;
grant select, insert, update, delete on table public.weekly_check_ins to authenticated;
revoke all on function public.set_updated_at() from public;
revoke all on function public.create_profile_for_new_user() from public;

alter table public.profiles enable row level security;
alter table public.kpi_goals enable row level security;
alter table public.weekly_check_ins enable row level security;

create policy "profiles are private to their owner"
on public.profiles
for all
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "goals are private to their owner"
on public.kpi_goals
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "check-ins are private to their owner"
on public.weekly_check_ins
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
