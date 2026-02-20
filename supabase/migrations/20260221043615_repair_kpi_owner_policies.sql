revoke all on table public.kpi_goals, public.weekly_check_ins from anon;
grant select, insert, update, delete on table public.kpi_goals, public.weekly_check_ins to authenticated;

alter table public.kpi_goals enable row level security;
alter table public.weekly_check_ins enable row level security;

drop policy if exists "goals are private to their owner" on public.kpi_goals;
create policy "goals are private to their owner"
on public.kpi_goals
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "check-ins are private to their owner" on public.weekly_check_ins;
create policy "check-ins are private to their owner"
on public.weekly_check_ins
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
