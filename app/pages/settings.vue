<template>
  <section class="mx-auto max-w-[44rem]">
    <p class="text-sm font-semibold text-[var(--color-primary)]">Scorecard setup</p>
    <h1 class="mt-[var(--space-2xs)] text-[var(--text-section)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">Weekly targets.</h1>
    <p class="mt-[var(--space-sm)] max-w-[58ch] text-[var(--text-lg)] text-[var(--color-ink-2)]">Changing a target affects future check-ins. Existing weekly snapshots stay unchanged.</p>

    <div v-if="isLoading" class="mt-[var(--space-xl)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] text-sm text-[var(--color-ink-2)]" role="status">Loading your targets…</div>

    <form v-else novalidate class="mt-[var(--space-xl)] rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] min-[768px]:p-[var(--space-xl)]" @submit.prevent="handleSubmit">
      <div v-if="hasErrors" ref="errorSummary" tabindex="-1" class="mb-[var(--space-lg)] rounded-[var(--radius-control)] border border-[var(--color-error)] p-[var(--space-sm)] text-sm text-[var(--color-error-ink)]" role="alert">
        <p class="font-semibold">Review the target fields below.</p>
        <ul class="mt-[var(--space-xs)] list-disc pl-[var(--space-lg)]">
          <li v-for="metric in invalidMetrics" :key="metric.id"><a :href="`#goal-${metric.id}`" class="underline">{{ metric.label }}: {{ errors[metric.id] }}</a></li>
        </ul>
      </div>

      <p v-if="saveMessage" class="mb-[var(--space-lg)] rounded-[var(--radius-control)] border p-[var(--space-sm)] text-sm" :class="saveTone === 'error' ? 'border-[var(--color-error)] text-[var(--color-error-ink)]' : 'border-[var(--color-rule)] text-[var(--color-ink-2)]'" role="status" aria-live="polite">{{ saveMessage }}</p>

      <KpiGoalFields :values="goals" :errors="errors" @update:value="updateGoal" @blur="validateGoal" />

      <div class="mt-[var(--space-lg)] flex flex-wrap gap-[var(--space-sm)] border-t border-[var(--color-rule)] pt-[var(--space-lg)]">
        <Button type="submit" :loading="isSaving">Save targets</Button>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
import { validateGoals, type MetricFieldErrors } from '~/lib/validation'
import { KPI_METRICS, type KpiGoals, type KpiMetricId } from '~/types/kpi'

useHead({
  title: 'Settings'
})

const { user } = useMeridianAuth()
const { loadGoals, saveGoals } = useKpiRepository()
const goals = reactive<KpiGoals>({
  outreach: 1,
  qualified_leads: 1,
  discovery_calls: 1,
  proposals: 1,
  closed_deals: 1
})
const errors = reactive<MetricFieldErrors>({})
const errorSummary = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)
const saveMessage = ref('')
const saveTone = ref<'error' | 'neutral'>('neutral')

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

const handleSubmit = async () => {
  Object.assign(errors, validateGoals(goals))

  if (Object.keys(errors).some((key) => errors[key as KpiMetricId])) {
    await nextTick()
    errorSummary.value?.focus()
    return
  }

  if (!user.value) {
    return
  }

  isSaving.value = true
  saveMessage.value = ''

  try {
    await saveGoals(user.value.id, goals)
    saveTone.value = 'neutral'
    saveMessage.value = 'Weekly targets saved. Existing check-ins keep their original target snapshots.'
  } catch (error) {
    saveTone.value = 'error'
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

    if (!savedGoals) {
      await navigateTo('/onboarding')
      return
    }

    Object.assign(goals, savedGoals)
  } catch (error) {
    saveTone.value = 'error'
    saveMessage.value = error instanceof Error ? error.message : 'We could not load your saved targets.'
  } finally {
    isLoading.value = false
  }
})
</script>
