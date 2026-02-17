import { KPI_METRICS, type KpiActuals, type KpiGoals, type MetricScore, type ScoreResult } from '~/types/kpi'

export const SCORE_WEIGHTS_TOTAL = KPI_METRICS.reduce((total, metric) => total + metric.weight, 0)

export const roundToOneDecimal = (value: number) => Math.round(value * 10) / 10

export const getAttainment = (actual: number, target: number) => {
  if (!Number.isFinite(actual) || !Number.isFinite(target) || target <= 0) {
    return 0
  }

  return roundToOneDecimal((actual / target) * 100)
}

export const getMetricScore = (metricId: (typeof KPI_METRICS)[number]['id'], actual: number, target: number): MetricScore => {
  const metric = KPI_METRICS.find((item) => item.id === metricId)

  if (!metric) {
    throw new Error(`Unknown KPI metric: ${metricId}`)
  }

  const attainment = getAttainment(actual, target)
  const cappedAttainment = Math.min(attainment, 100)

  return {
    id: metric.id,
    label: metric.label,
    weight: metric.weight,
    target,
    actual,
    attainment,
    cappedAttainment,
    contribution: roundToOneDecimal((cappedAttainment / 100) * metric.weight)
  }
}

export const calculateScore = (actuals: KpiActuals, goals: KpiGoals): ScoreResult => {
  const metrics = KPI_METRICS.map((metric) => getMetricScore(metric.id, actuals[metric.id], goals[metric.id]))
  const rawScore = roundToOneDecimal(metrics.reduce((total, metric) => total + metric.contribution, 0))

  return {
    rawScore,
    score: Math.min(100, Math.round(rawScore)),
    metrics
  }
}
