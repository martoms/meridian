<template>
  <div>
    <div class="grid gap-[var(--space-md)] min-[768px]:hidden">
      <article v-for="checkIn in checkIns" :key="checkIn.weekStart" class="border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-md)] shadow-[var(--shadow-card)]">
        <div class="flex items-baseline justify-between gap-[var(--space-md)]">
          <h2 class="week-label text-[var(--text-title)] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">{{ formatWeek(checkIn.weekStart) }}</h2>
          <p class="text-[var(--text-xl)] font-bold tabular-nums text-[var(--color-ink)]">{{ getScore(checkIn).score }}<span class="text-sm text-[var(--color-ink-2)]">/100</span></p>
        </div>
        <dl class="mt-[var(--space-md)] grid grid-cols-2 gap-x-[var(--space-md)] gap-y-[var(--space-xs)] border-t border-[var(--color-rule)] pt-[var(--space-sm)] text-sm">
          <template v-for="metric in getScore(checkIn).metrics" :key="metric.id">
            <dt class="text-[var(--color-ink-2)]">{{ metric.label }}</dt>
            <dd class="text-right font-semibold tabular-nums text-[var(--color-ink)]">{{ metric.actual }} / {{ metric.target }}</dd>
          </template>
        </dl>
      </article>
    </div>

    <div class="hidden min-[768px]:block">
      <table class="w-full border-collapse text-left">
        <caption class="sr-only">Past weekly KPI check-ins and their target snapshots.</caption>
        <thead class="border-b border-[var(--color-rule)] text-sm text-[var(--color-ink-2)]">
          <tr>
            <th scope="col" class="py-[var(--space-sm)] pr-[var(--space-md)] font-medium">Week</th>
            <th v-for="metric in metrics" :key="metric.id" scope="col" class="px-[var(--space-sm)] py-[var(--space-sm)] text-right font-medium whitespace-nowrap">{{ metric.label }}</th>
            <th scope="col" class="py-[var(--space-sm)] pl-[var(--space-md)] text-right font-medium whitespace-nowrap">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="checkIn in checkIns" :key="checkIn.weekStart" class="border-b border-[var(--color-rule)] last:border-b-0">
            <th scope="row" class="week-label py-[var(--space-md)] pr-[var(--space-md)] text-sm font-medium text-[var(--color-ink)]">{{ formatWeek(checkIn.weekStart) }}</th>
            <td v-for="metric in getScore(checkIn).metrics" :key="metric.id" class="px-[var(--space-sm)] py-[var(--space-md)] text-right text-sm tabular-nums text-[var(--color-ink-2)] whitespace-nowrap"><span class="font-semibold text-[var(--color-ink)]">{{ metric.actual }}</span> / {{ metric.target }}</td>
            <td class="py-[var(--space-md)] pl-[var(--space-md)] text-right text-sm font-semibold tabular-nums text-[var(--color-ink)] whitespace-nowrap">{{ getScore(checkIn).score }}/100</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { calculateScore } from '~/lib/kpi'
import { KPI_METRICS, type WeeklyCheckInSnapshot } from '~/types/kpi'

defineProps<{
  checkIns: WeeklyCheckInSnapshot[]
}>()

const metrics = KPI_METRICS
const getScore = (checkIn: WeeklyCheckInSnapshot) => calculateScore(checkIn.actuals, checkIn.goals)
const formatWeek = (weekStart: string) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${weekStart}T00:00:00`))
</script>

<style scoped>
.week-label {
  min-width: 0;
  overflow-wrap: break-word;
}
</style>
