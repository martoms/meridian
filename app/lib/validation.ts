import { KPI_METRICS, type MetricValues } from '~/types/kpi'

export type MetricFieldErrors = Partial<Record<keyof MetricValues, string>>

export const isPositiveWholeNumber = (value: number) => Number.isInteger(value) && value > 0

export const isNonNegativeWholeNumber = (value: number) => Number.isInteger(value) && value >= 0

export const validateGoals = (values: MetricValues): MetricFieldErrors => {
  return KPI_METRICS.reduce<MetricFieldErrors>((errors, metric) => {
    if (!isPositiveWholeNumber(values[metric.id])) {
      errors[metric.id] = 'Enter a whole number greater than zero.'
    }

    return errors
  }, {})
}

export const validateActuals = (values: MetricValues): MetricFieldErrors => {
  return KPI_METRICS.reduce<MetricFieldErrors>((errors, metric) => {
    if (!isNonNegativeWholeNumber(values[metric.id])) {
      errors[metric.id] = 'Enter a whole number that is zero or greater.'
    }

    return errors
  }, {})
}
