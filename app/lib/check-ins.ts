import type { KpiActuals, KpiGoals, WeeklyCheckInSnapshot } from '~/types/kpi'

export const getMondayWeekStart = (date = new Date()) => {
  const localDate = new Date(date)
  const day = localDate.getDay()
  const daysSinceMonday = day === 0 ? 6 : day - 1

  localDate.setDate(localDate.getDate() - daysSinceMonday)

  return localDate.toLocaleDateString('en-CA')
}

export const createCheckInSnapshot = ({
  userId,
  weekStart,
  actuals,
  goals
}: {
  userId: string
  weekStart: string
  actuals: KpiActuals
  goals: KpiGoals
}): WeeklyCheckInSnapshot => ({
  userId,
  weekStart,
  actuals: { ...actuals },
  goals: { ...goals }
})
