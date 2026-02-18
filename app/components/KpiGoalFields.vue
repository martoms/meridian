<template>
  <fieldset class="grid gap-[var(--space-md)]">
    <legend class="text-[var(--text-title)] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">Weekly targets</legend>
    <p class="-mt-[var(--space-sm)] text-sm text-[var(--color-ink-2)]">Choose the outcomes that make a strong week for you. Every target must be a whole number greater than zero.</p>

    <div v-for="metric in metrics" :key="metric.id">
      <label :for="`goal-${metric.id}`" class="block text-sm font-medium text-[var(--color-ink)]">{{ metric.label }}</label>
      <p :id="`goal-${metric.id}-hint`" class="mt-[var(--space-2xs)] text-sm text-[var(--color-ink-2)]">{{ metric.description }}</p>
      <input
        :id="`goal-${metric.id}`"
        :value="values[metric.id]"
        :name="`${metric.id}-target`"
        type="number"
        min="1"
        step="1"
        required
        inputmode="numeric"
        class="mt-[var(--space-xs)] min-h-11 w-full rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[var(--color-paper)] px-[var(--space-sm)] tabular-nums text-[var(--color-ink)] outline-2 outline-transparent outline-offset-[-3px] placeholder:text-[var(--color-muted)] hover:bg-[var(--color-paper-2)] focus-visible:border-[var(--color-ink-2)] focus-visible:outline-[var(--color-focus)]"
        :aria-invalid="Boolean(errors[metric.id])"
        :aria-describedby="errors[metric.id] ? `goal-${metric.id}-hint goal-${metric.id}-error` : `goal-${metric.id}-hint`"
        @input="emit('update:value', metric.id, Number(($event.target as HTMLInputElement).value))"
        @blur="emit('blur', metric.id)"
      >
      <p :id="`goal-${metric.id}-error`" class="mt-[var(--space-2xs)] min-h-[1lh] text-sm text-[var(--color-error-ink)]">{{ errors[metric.id] }}</p>
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
import { KPI_METRICS, type KpiMetricId, type MetricValues } from '~/types/kpi'
import type { MetricFieldErrors } from '~/lib/validation'

defineProps<{
  errors: MetricFieldErrors
  values: MetricValues
}>()

const emit = defineEmits<{
  blur: [metric: KpiMetricId]
  'update:value': [metric: KpiMetricId, value: number]
}>()

const metrics = KPI_METRICS
</script>
