import { describe, expect, it } from 'vitest'
import { createCheckInSnapshot, getMondayWeekStart } from '../app/lib/check-ins'
import { upsertCheckInForWeek } from '../app/lib/check-in-store'
import { calculateScore, SCORE_WEIGHTS_TOTAL } from '../app/lib/kpi'
import { validateActuals, validateGoals } from '../app/lib/validation'
import type { MetricValues } from '../app/types/kpi'

const goals: MetricValues = {
  outreach: 20,
  qualified_leads: 10,
  discovery_calls: 5,
  proposals: 4,
  closed_deals: 2
}

const zeroActuals: MetricValues = {
  outreach: 0,
  qualified_leads: 0,
  discovery_calls: 0,
  proposals: 0,
  closed_deals: 0
}

describe('KPI scorecard', () => {
  it('keeps weights transparent and totals 100', () => {
    expect(SCORE_WEIGHTS_TOTAL).toBe(100)
  })

  it('scores zero actuals as zero', () => {
    expect(calculateScore(zeroActuals, goals).score).toBe(0)
  })

  it('scores exact targets as 100', () => {
    expect(calculateScore(goals, goals).score).toBe(100)
  })

  it('caps score contributions while retaining raw over-target attainment', () => {
    const result = calculateScore(
      {
        outreach: 40,
        qualified_leads: 20,
        discovery_calls: 10,
        proposals: 8,
        closed_deals: 4
      },
      goals
    )

    expect(result.score).toBe(100)
    expect(result.metrics[0]).toMatchObject({ attainment: 200, cappedAttainment: 100, contribution: 15 })
  })
})

describe('KPI validation', () => {
  it('rejects invalid targets and invalid actuals', () => {
    expect(validateGoals({ ...goals, outreach: 0 })).toMatchObject({ outreach: expect.any(String) })
    expect(validateActuals({ ...zeroActuals, proposals: -1 })).toMatchObject({ proposals: expect.any(String) })
    expect(validateActuals({ ...zeroActuals, outreach: 1.5 })).toMatchObject({ outreach: expect.any(String) })
  })
})

describe('weekly check-in snapshots', () => {
  it('stores a target snapshot independent of later goal changes', () => {
    const snapshot = createCheckInSnapshot({
      userId: 'user-1',
      weekStart: '2026-02-16',
      actuals: { ...zeroActuals, outreach: 12 },
      goals
    })

    goals.outreach = 40

    expect(snapshot.goals.outreach).toBe(20)
  })

  it('uses Monday as the week boundary', () => {
    expect(getMondayWeekStart(new Date('2026-02-22T12:00:00'))).toBe('2026-02-16')
    expect(getMondayWeekStart(new Date('2026-02-23T12:00:00'))).toBe('2026-02-23')
  })

  it('replaces a check-in for the same user and Monday week', () => {
    const initial = createCheckInSnapshot({
      userId: 'user-1',
      weekStart: '2026-02-16',
      actuals: zeroActuals,
      goals
    })
    const updated = createCheckInSnapshot({
      userId: 'user-1',
      weekStart: '2026-02-16',
      actuals: { ...zeroActuals, proposals: 2 },
      goals
    })

    expect(upsertCheckInForWeek([initial], updated)).toEqual([updated])
  })
})
