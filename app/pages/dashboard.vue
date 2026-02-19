<template>
  <section>
    <div class="flex flex-wrap items-end justify-between gap-[var(--space-md)]">
      <div>
        <p class="text-sm font-semibold text-[var(--color-primary)]">Week of {{ formattedWeekStart }}</p>
        <h1 class="mt-[var(--space-2xs)] text-[var(--text-section)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">Your weekly check-in.</h1>
      </div>
      <NuxtLink to="/settings" class="inline-flex min-h-11 items-center rounded-[var(--radius-control)] border border-[var(--color-rule)] px-[var(--space-sm)] text-sm font-semibold text-[var(--color-ink)] no-underline transition-[background-color,color] duration-[var(--dur-micro)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-2)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2">Edit targets</NuxtLink>
    </div>

    <p v-if="isPreview" class="mt-[var(--space-md)] rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-sm)] text-sm text-[var(--color-ink-2)]" role="status">Local preview mode stores this check-in in this browser only. It is not sent to Supabase.</p>

    <div v-if="isLoading" class="mt-[var(--space-xl)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] text-sm text-[var(--color-ink-2)]" role="status">Loading your current week…</div>

    <div v-else class="mt-[var(--space-xl)] grid gap-[var(--space-xl)] min-[768px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <ScoreSummary :result="scoreResult" />

      <form novalidate class="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] min-[768px]:p-[var(--space-xl)]" @submit.prevent="handleSubmit">
        <div v-if="hasErrors" ref="errorSummary" tabindex="-1" class="mb-[var(--space-lg)] rounded-[var(--radius-control)] border border-[var(--color-error)] p-[var(--space-sm)] text-sm text-[var(--color-error-ink)]" role="alert">
          <p class="font-semibold">Review the check-in fields below.</p>
          <ul class="mt-[var(--space-xs)] list-disc pl-[var(--space-lg)]">
            <li v-for="metric in invalidMetrics" :key="metric.id"><a :href="`#actual-${metric.id}`" class="underline">{{ metric.label }}: {{ errors[metric.id] }}</a></li>
          </ul>
        </div>

        <p v-if="saveMessage" class="mb-[var(--space-lg)] rounded-[var(--radius-control)] border p-[var(--space-sm)] text-sm" :class="saveTone === 'error' ? 'border-[var(--color-error)] text-[var(--color-error-ink)]' : 'border-[var(--color-rule)] text-[var(--color-ink-2)]'" role="status" aria-live="polite">{{ saveMessage }}</p>

        <KpiActualFields :values="actuals" :goals="scoreGoals" :errors="errors" @update:value="updateActual" @blur="validateActual" />

        <div class="mt-[var(--space-lg)] flex flex-wrap gap-[var(--space-sm)] border-t border-[var(--color-rule)] pt-[var(--space-lg)]">
          <Button type="submit" :loading="isSaving">{{ currentCheckIn ? 'Update check-in' : 'Save check-in' }}</Button>
        </div>
      </form>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { createCheckInSnapshot, getMondayWeekStart } from '~/lib/check-ins'
import { calculateScore } from '~/lib/kpi'
import { validateActuals, type MetricFieldErrors } from '~/lib/validation'
import { KPI_METRICS, type KpiActuals, type KpiGoals, type KpiMetricId, type WeeklyCheckInSnapshot } from '~/types/kpi'

useHead({
  title: 'Dashboard'
})

const { isPreview, user } = useMeridianAuth()
const { getCheckIn, loadGoals, saveCheckIn } = useKpiRepository()
const weekStart = getMondayWeekStart()
const goals = ref<KpiGoals | null>(null)
const currentCheckIn = ref<WeeklyCheckInSnapshot | null>(null)
const actuals = reactive<KpiActuals>({
  outreach: 0,
  qualified_leads: 0,
  discovery_calls: 0,
  proposals: 0,
  closed_deals: 0
})
const errors = reactive<MetricFieldErrors>({})
const errorSummary = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)
const saveMessage = ref('')
const saveTone = ref<'error' | 'neutral'>('neutral')

const fallbackGoals: KpiGoals = {
  outreach: 1,
  qualified_leads: 1,
  discovery_calls: 1,
  proposals: 1,
  closed_deals: 1
}

const scoreGoals = computed(() => currentCheckIn.value?.goals ?? goals.value ?? fallbackGoals)
const scoreResult = computed(() => calculateScore(actuals, scoreGoals.value))
const formattedWeekStart = computed(() => new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${weekStart}T00:00:00`)))
const invalidMetrics = computed(() => KPI_METRICS.filter((metric) => errors[metric.id]))
const hasErrors = computed(() => invalidMetrics.value.length > 0)

const validateActual = (metric: KpiMetricId) => {
  const fieldErrors = validateActuals(actuals)
  errors[metric] = fieldErrors[metric]
}

const updateActual = (metric: KpiMetricId, value: number) => {
  actuals[metric] = value

  if (errors[metric]) {
    validateActual(metric)
  }
}

const handleSubmit = async () => {
  Object.assign(errors, validateActuals(actuals))

  if (Object.keys(errors).some((key) => errors[key as KpiMetricId])) {
    await nextTick()
    errorSummary.value?.focus()
    return
  }

  if (!user.value || !goals.value) {
    return
  }

  isSaving.value = true
  saveMessage.value = ''

  try {
    const checkIn = createCheckInSnapshot({
      userId: user.value.id,
      weekStart,
      actuals,
      goals: currentCheckIn.value?.goals ?? goals.value
    })
    currentCheckIn.value = await saveCheckIn(checkIn)
    saveTone.value = 'neutral'
    saveMessage.value = isPreview.value ? 'Saved to this browser’s local preview.' : 'Weekly check-in saved.'
  } catch (error) {
    saveTone.value = 'error'
    saveMessage.value = error instanceof Error ? error.message : 'We could not save this check-in. Try again.'
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  if (!user.value) {
    return
  }

  try {
    goals.value = await loadGoals(user.value.id)

    if (!goals.value) {
      await navigateTo('/onboarding')
      return
    }

    currentCheckIn.value = await getCheckIn(user.value.id, weekStart)

    if (currentCheckIn.value) {
      Object.assign(actuals, currentCheckIn.value.actuals)
    }
  } catch (error) {
    saveTone.value = 'error'
    saveMessage.value = error instanceof Error ? error.message : 'We could not load your check-in.'
  } finally {
    isLoading.value = false
  }
})
</script>
