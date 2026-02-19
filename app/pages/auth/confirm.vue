<template>
  <section class="w-full rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] min-[768px]:p-[var(--space-xl)]">
    <h1 class="text-[var(--text-section)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">Confirming your account.</h1>
    <p class="mt-[var(--space-sm)] text-sm leading-relaxed text-[var(--color-ink-2)]">Meridian is checking the confirmation link from your email.</p>
    <p class="mt-[var(--space-lg)] text-sm text-[var(--color-ink-2)]" role="status" aria-live="polite">{{ statusMessage }}</p>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Confirm account'
})

const user = useSupabaseUser()
const { isSupabaseConfigured } = useMeridianAuth()
const statusMessage = ref(isSupabaseConfigured.value ? 'Waiting for the secure confirmation callback.' : 'Supabase is not configured. Return to sign in to use local preview mode.')

watch(
  user,
  async (currentUser) => {
    if (currentUser) {
      await navigateTo('/onboarding')
    }
  },
  { immediate: true }
)
</script>
