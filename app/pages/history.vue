<template>
  <section>
    <div class="flex flex-wrap items-end justify-between gap-[var(--space-md)]">
      <div>
        <p class="text-sm font-semibold text-[var(--color-primary)]">Private record</p>
        <h1 class="mt-[var(--space-2xs)] text-[var(--text-section)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">Weekly history.</h1>
      </div>
      <NuxtLink to="/dashboard" class="inline-flex min-h-11 items-center rounded-[var(--radius-control)] border border-[var(--color-rule)] px-[var(--space-sm)] text-sm font-semibold text-[var(--color-ink)] no-underline transition-[background-color,color] duration-[var(--dur-micro)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-2)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2">Open dashboard</NuxtLink>
    </div>

    <div v-if="isLoading" class="mt-[var(--space-xl)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] text-sm text-[var(--color-ink-2)]" role="status">Loading check-in history…</div>

    <div v-else-if="loadMessage" class="mt-[var(--space-xl)] rounded-[var(--radius-control)] border border-[var(--color-error)] p-[var(--space-md)] text-sm text-[var(--color-error-ink)]" role="alert">{{ loadMessage }}</div>

    <div v-else-if="checkIns.length === 0" class="mt-[var(--space-xl)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] shadow-[var(--shadow-card)] min-[768px]:p-[var(--space-xl)]">
      <h2 class="text-[var(--text-title)] font-semibold text-[var(--color-ink)]">No check-ins yet.</h2>
      <p class="mt-[var(--space-xs)] max-w-[52ch] text-sm leading-relaxed text-[var(--color-ink-2)]">Your first weekly check-in will preserve its own targets here, even if you change targets later.</p>
      <NuxtLink to="/dashboard" class="mt-[var(--space-lg)] inline-flex min-h-11 items-center rounded-[var(--radius-control)] bg-[var(--color-primary)] px-[var(--space-md)] text-sm font-semibold text-[var(--color-primary-ink)] no-underline transition-[background-color,transform] duration-[var(--dur-micro)] ease-[var(--ease-out)] hover:bg-[color-mix(in_oklab,var(--color-primary)_88%,var(--color-ink))] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 active:translate-y-px">Save a check-in</NuxtLink>
    </div>

    <div v-else class="mt-[var(--space-xl)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-md)] shadow-[var(--shadow-card)] min-[768px]:p-[var(--space-xl)]">
      <CheckInHistory :check-ins="checkIns" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { WeeklyCheckInSnapshot } from '~/types/kpi'

useHead({
  title: 'History'
})

const { user } = useMeridianAuth()
const { listCheckIns } = useKpiRepository()
const checkIns = ref<WeeklyCheckInSnapshot[]>([])
const isLoading = ref(true)
const loadMessage = ref('')

onMounted(async () => {
  if (!user.value) {
    return
  }

  try {
    checkIns.value = await listCheckIns(user.value.id)
  } catch (error) {
    loadMessage.value = error instanceof Error ? error.message : 'We could not load your check-in history.'
  } finally {
    isLoading.value = false
  }
})
</script>
