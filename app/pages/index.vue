<template>
  <div>
    <a class="skip-link" href="#main-content" @click.prevent="skipToMain">Skip to main content</a>
    <AppHeader />
    <main id="main-content" tabindex="-1" class="mx-auto grid min-h-[calc(100dvh-var(--space-4xl))] max-w-[var(--container)] content-center gap-[var(--space-xl)] px-[var(--space-md)] py-[var(--space-2xl)] min-[768px]:px-[var(--space-lg)] min-[1024px]:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] min-[1280px]:px-[var(--space-xl)]">
      <section class="min-w-0">
        <p class="text-sm font-semibold tracking-[0.01em] text-[var(--color-primary)]">Weekly sales scorecard</p>
        <h1 class="mt-[var(--space-md)] max-w-[20ch] text-[clamp(2rem,calc(1.25rem+3.2vw),2.75rem)] font-bold leading-[1.12] tracking-[var(--tracking-display)] text-[var(--color-ink)]">See the work behind your sales week.</h1>
        <p class="mt-[var(--space-lg)] max-w-[48ch] text-[clamp(1.0625rem,calc(0.85rem+0.9vw),1.2rem)] leading-[1.65] text-[var(--color-ink-2)]">Set five weekly targets, record one check-in, and understand a 0 to 100 score without hiding the calculation.</p>
        <div class="mt-[var(--space-xl)] flex flex-wrap gap-[var(--space-sm)]">
          <NuxtLink to="/auth/sign-up" class="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] bg-[var(--color-primary)] px-[var(--space-md)] text-sm font-semibold text-[var(--color-primary-ink)] no-underline transition-[background-color,transform] duration-[var(--dur-micro)] ease-[var(--ease-out)] hover:bg-[color-mix(in_oklab,var(--color-primary)_88%,var(--color-ink))] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 active:translate-y-px">Create your scorecard</NuxtLink>
          <NuxtLink to="/auth/sign-in" class="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-rule)] px-[var(--space-md)] text-sm font-semibold text-[var(--color-ink)] no-underline transition-[background-color,transform] duration-[var(--dur-micro)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-2)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 active:translate-y-px">Sign in</NuxtLink>
        </div>
      </section>

      <section aria-labelledby="scorecard-preview-title" class="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] min-[768px]:p-[var(--space-xl)]">
        <p class="text-sm text-[var(--color-ink-2)]">The scorecard keeps five inputs in view.</p>
        <h2 id="scorecard-preview-title" class="mt-[var(--space-xs)] text-[var(--text-section)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">One weekly view</h2>
        <dl class="mt-[var(--space-lg)] grid gap-[var(--space-sm)] border-t border-[var(--color-rule)] pt-[var(--space-md)]">
          <div v-for="metric in metrics" :key="metric.id" class="flex items-center justify-between gap-[var(--space-md)] border-b border-[var(--color-rule)] pb-[var(--space-sm)]">
            <dt class="text-sm text-[var(--color-ink-2)]">{{ metric.label }}</dt>
            <dd class="text-sm font-semibold tabular-nums text-[var(--color-ink)]">{{ metric.weight }}% weight</dd>
          </div>
        </dl>
        <p class="mt-[var(--space-xl)] max-w-[42ch] text-sm leading-[1.45] text-[var(--color-ink-2)]">Attainment can exceed 100%, but each weighted contribution caps at its target.</p>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { KPI_METRICS } from '~/types/kpi'

definePageMeta({
  layout: false
})

useHead({
  title: 'Sales KPI Scorecard'
})

const metrics = KPI_METRICS
const { skipToMain } = useSkipToMain()
</script>
