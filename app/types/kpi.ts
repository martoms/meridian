export const KPI_METRICS = [
  {
    id: 'outreach',
    label: 'Outreach',
    description: 'New outbound messages or calls.',
    weight: 15
  },
  {
    id: 'qualified_leads',
    label: 'Qualified leads',
    description: 'Contacts matching your qualification criteria.',
    weight: 20
  },
  {
    id: 'discovery_calls',
    label: 'Discovery calls',
    description: 'Completed first conversations with prospects.',
    weight: 20
  },
  {
    id: 'proposals',
    label: 'Proposals',
    description: 'Proposals sent to qualified prospects.',
    weight: 20
  },
  {
    id: 'closed_deals',
    label: 'Closed deals',
    description: 'New signed or paid customer agreements.',
    weight: 25
  }
] as const

export type KpiMetricId = (typeof KPI_METRICS)[number]['id']

export type MetricValues = Record<KpiMetricId, number>

export type KpiGoals = MetricValues

export type KpiActuals = MetricValues

export interface MetricScore {
  id: KpiMetricId
  label: string
  weight: number
  target: number
  actual: number
  attainment: number
  cappedAttainment: number
  contribution: number
}

export interface ScoreResult {
  score: number
  rawScore: number
  metrics: MetricScore[]
}

export interface WeeklyCheckInDraft {
  weekStart: string
  actuals: KpiActuals
  goals: KpiGoals
}

export interface WeeklyCheckInSnapshot extends WeeklyCheckInDraft {
  userId: string
}
