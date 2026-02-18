<template>
  <section aria-labelledby="score-summary-title" class="border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] shadow-[var(--shadow-card)] min-[768px]:p-[var(--space-xl)]">
    <div class="flex flex-wrap items-end justify-between gap-[var(--space-md)]">
      <div>
        <p class="text-sm font-semibold text-[var(--color-primary)]">Weekly score</p>
        <h2 id="score-summary-title" class="mt-[var(--space-2xs)] text-[var(--text-section)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">A transparent 0 to 100 view.</h2>
      </div>
      <p class="text-[clamp(var(--text-3xl),10vw,4.5rem)] font-bold leading-none tracking-[-0.04em] tabular-nums text-[var(--color-ink)]"><span>{{ result.score }}</span><span class="text-[var(--text-lg)] text-[var(--color-ink-2)]">/100</span></p>
    </div>

    <dl class="mt-[var(--space-lg)] grid gap-[var(--space-md)] border-t border-[var(--color-rule)] pt-[var(--space-lg)]">
      <div v-for="metric in result.metrics" :key="metric.id" class="grid gap-[var(--space-xs)]">
        <div class="flex items-baseline justify-between gap-[var(--space-md)]">
          <dt class="text-sm font-medium text-[var(--color-ink)]">{{ metric.label }}</dt>
          <dd class="text-sm tabular-nums text-[var(--color-ink-2)]"><span class="font-semibold text-[var(--color-ink)]">{{ metric.actual }}</span> / {{ metric.target }} <span class="text-[var(--color-muted)]">({{ metric.attainment }}%)</span></dd>
        </div>
        <div class="h-[var(--space-xs)] overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-paper-3)]" :aria-label="`${metric.label}: ${metric.attainment}% of target`" role="progressbar" aria-valuemin="0" :aria-valuenow="Math.min(metric.attainment, 100)" aria-valuemax="100">
          <div class="h-full rounded-[var(--radius-pill)] bg-[var(--color-primary)]" :style="{ width: `${Math.min(metric.attainment, 100)}%` }" />
        </div>
        <p class="text-xs tabular-nums text-[var(--color-ink-2)]">{{ metric.weight }}% weight, {{ metric.contribution }} score points.</p>
      </div>
    </dl>

    <details class="mt-[var(--space-lg)] border-t border-[var(--color-rule)] pt-[var(--space-md)]">
      <summary class="cursor-pointer text-sm font-semibold text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2">How the score works</summary>
      <p class="mt-[var(--space-sm)] text-sm leading-relaxed text-[var(--color-ink-2)]">Each metric contributes its weight multiplied by its attainment, capped at 100%. Raw attainment remains visible above, so over-target results are never hidden.</p>
    </details>
  </section>
</template>

<script lang="ts" setup>
import type { ScoreResult } from '~/types/kpi'

defineProps<{
  result: ScoreResult
}>()
</script>
