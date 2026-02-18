import type { WeeklyCheckInSnapshot } from '~/types/kpi'

export const upsertCheckInForWeek = (checkIns: WeeklyCheckInSnapshot[], nextCheckIn: WeeklyCheckInSnapshot) => {
  const index = checkIns.findIndex(
    (checkIn) => checkIn.userId === nextCheckIn.userId && checkIn.weekStart === nextCheckIn.weekStart
  )

  if (index === -1) {
    return [...checkIns, nextCheckIn]
  }

  return checkIns.map((checkIn, checkInIndex) => (checkInIndex === index ? nextCheckIn : checkIn))
}
