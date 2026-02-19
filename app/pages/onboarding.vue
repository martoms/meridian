<template>
  <section class="mx-auto max-w-[44rem]">
    <p class="text-sm font-semibold text-[var(--color-primary)]">Step 1 of 1</p>
    <h1 class="mt-[var(--space-xs)] text-[var(--text-section)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">Set your weekly targets.</h1>
    <p class="mt-[var(--space-sm)] max-w-[58ch] text-[var(--text-lg)] text-[var(--color-ink-2)]">Meridian will keep these targets with every check-in so your score history remains comparable.</p>

    <div v-if="isLoading" class="mt-[var(--space-xl)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] text-sm text-[var(--color-ink-2)]" role="status">Loading your targets…</div>

    <form v-else novalidate class="mt-[var(--space-xl)] rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] min-[768px]:p-[var(--space-xl)]" @submit.prevent="handleSubmit">
      <div v-if="hasErrors" ref="errorSummary" tabindex="-1" class="mb-[var(--space-lg)] rounded-[var(--radius-control)] border border-[var(--color-error)] p-[var(--space-sm)] text-sm text-[var(--color-error-ink)]" role="alert">
        <p class="font-semibold">Review the target fields below.</p>
        <ul class="mt-[var(--space-xs)] list-disc pl-[var(--space-lg)]">
          <li v-for="metric in invalidMetrics" :key="metric.id"><a :href="`#goal-${metric.id}`" class="underline">{{ metric.label }}: {{ errors[metric.id] }}</a></li>
        </ul>
      </div>

      <p v-if="saveMessage" class="mb-[var(--space-lg)] rounded-[var(--radius-control)] border border-[var(--color-rule)] p-[var(--space-sm)] text-sm text-[var(--color-ink-2)]" role="status" aria-live="polite">{{ saveMessage }}</p>

      <KpiGoalFields :values="goals" :errors="errors" @update:value="updateGoal" @blur="validateGoal" />

      <div class="mt-[var(--space-lg)] flex flex-wrap gap-[var(--space-sm)] border-t border-[var(--color-rule)] pt-[var(--space-lg)]">
        <Button type="submit" :loading="isSaving">Save targets</Button>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
import { KPI_METRICS, type KpiGoals, type KpiMetricId } from '~/types/kpi'
import { validateGoals, type MetricFieldErrors } from '~/lib/validation'

useHead({
  title: 'Set weekly targets'
})

const { user } = useMeridianAuth()
const { loadGoals, saveGoals } = useKpiRepository()
const defaultGoals: KpiGoals = {
  outreach: 20,
  qualified_leads: 10,
  discovery_calls: 5,
  proposals: 4,
  closed_deals: 2
}
const goals = reactive<KpiGoals>({ ...defaultGoals })
const errors = reactive<MetricFieldErrors>({})
const errorSummary = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)
const saveMessage = ref('')

const invalidMetrics = computed(() => KPI_METRICS.filter((metric) => errors[metric.id]))
const hasErrors = computed(() => invalidMetrics.value.length > 0)

const validateGoal = (metric: KpiMetricId) => {
  const fieldErrors = validateGoals(goals)
  errors[metric] = fieldErrors[metric]
}

const updateGoal = (metric: KpiMetricId, value: number) => {
  goals[metric] = value

  if (errors[metric]) {
    validateGoal(metric)
  }
}

const focusErrorSummary = async () => {
  await nextTick()
  errorSummary.value?.focus()
}

const handleSubmit = async () => {
  Object.assign(errors, validateGoals(goals))

  if (Object.keys(errors).some((key) => errors[key as KpiMetricId])) {
    await focusErrorSummary()
    return
  }

  if (!user.value) {
    return
  }

  isSaving.value = true
  saveMessage.value = ''

  try {
    await saveGoals(user.value.id, goals)
    await navigateTo('/dashboard')
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'We could not save your targets. Try again.'
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  if (!user.value) {
    return
  }

  try {
    const savedGoals = await loadGoals(user.value.id)

    if (savedGoals) {
      Object.assign(goals, savedGoals)
    }
  } catch (error) {
    saveMessage.value = error instanceof Error ? error.message : 'We could not load your saved targets.'
  } finally {
    isLoading.value = false
  }
})
</script>
