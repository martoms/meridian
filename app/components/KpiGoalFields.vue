<template>
  <fieldset class="grid gap-[var(--space-xs)]">
    <legend class="text-[var(--text-title)] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">Weekly targets</legend>
    <p class="text-sm leading-relaxed text-[var(--color-ink-2)]">Choose the outcomes that make a strong week for you. Every target must be a whole number greater than zero.</p>

    <div v-for="metric in metrics" :key="metric.id" class="grid grid-cols-[minmax(0,1fr)_8rem] items-center gap-x-[var(--space-sm)] gap-y-[var(--space-2xs)] border-b border-[var(--color-rule)] pb-[var(--space-sm)] last:border-0 last:pb-0">
      <div class="min-w-0">
        <label :for="`goal-${metric.id}`" class="block text-sm font-medium text-[var(--color-ink)]">{{ metric.label }}</label>
        <p :id="`goal-${metric.id}-hint`" class="mt-[var(--space-2xs)] text-sm text-[var(--color-ink-2)]">{{ metric.description }}</p>
      </div>
      <input
        :id="`goal-${metric.id}`"
        :value="values[metric.id]"
        :name="`${metric.id}-target`"
        type="number"
        autocomplete="off"
        min="1"
        step="1"
        required
        inputmode="numeric"
        class="min-h-11 w-full min-w-0 rounded-[var(--radius-control)] border border-[var(--color-muted)] bg-[var(--color-paper)] px-[var(--space-sm)] tabular-nums text-[var(--color-ink)] outline-2 outline-transparent outline-offset-[-3px] placeholder:text-[var(--color-muted)] hover:bg-[var(--color-paper-2)] focus-visible:border-[var(--color-ink-2)] focus-visible:outline-[var(--color-focus)]"
        :aria-invalid="Boolean(errors[metric.id])"
        :aria-describedby="errors[metric.id] ? `goal-${metric.id}-hint goal-${metric.id}-error` : `goal-${metric.id}-hint`"
        @input="emit('update:value', metric.id, Number(($event.target as HTMLInputElement).value))"
        @blur="emit('blur', metric.id)"
      >
      <p :id="`goal-${metric.id}-error`" class="col-start-2 min-h-[1lh] text-sm text-[var(--color-error-ink)]">{{ errors[metric.id] }}</p>
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
