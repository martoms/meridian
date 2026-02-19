<template>
  <section class="w-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] shadow-[var(--shadow-card)] min-[768px]:p-[var(--space-xl)]">
    <p class="text-sm font-semibold text-[var(--color-primary)]">Welcome back</p>
    <h1 class="mt-[var(--space-xs)] text-[var(--text-section)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">Sign in to Meridian.</h1>
    <p class="mt-[var(--space-sm)] text-sm leading-relaxed text-[var(--color-ink-2)]">Continue your private scorecard and weekly check-in.</p>

    <p v-if="statusMessage" class="mt-[var(--space-lg)] rounded-[var(--radius-control)] border p-[var(--space-sm)] text-sm" :class="statusTone === 'error' ? 'border-[var(--color-error)] text-[var(--color-error-ink)]' : 'border-[var(--color-rule)] text-[var(--color-ink-2)]'" role="status" aria-live="polite">{{ statusMessage }}</p>

    <form novalidate class="mt-[var(--space-lg)] grid gap-[var(--space-md)]" @submit.prevent="handleSubmit">
      <div>
        <label for="sign-in-email" class="block text-sm font-medium text-[var(--color-ink)]">Email address</label>
        <input id="sign-in-email" v-model.trim="email" name="email" type="email" autocomplete="email" inputmode="email" class="mt-[var(--space-xs)] min-h-11 w-full rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[var(--color-paper)] px-[var(--space-sm)] text-[var(--color-ink)] outline-2 outline-transparent outline-offset-[-3px] placeholder:text-[var(--color-muted)] hover:bg-[var(--color-paper-2)] focus-visible:border-[var(--color-ink-2)] focus-visible:outline-[var(--color-focus)]" :aria-invalid="Boolean(errors.email)" :aria-describedby="errors.email ? 'sign-in-email-error' : undefined" @blur="validateEmail">
        <p id="sign-in-email-error" class="mt-[var(--space-2xs)] min-h-[1lh] text-sm text-[var(--color-error-ink)]">{{ errors.email }}</p>
      </div>

      <div>
        <label for="sign-in-password" class="block text-sm font-medium text-[var(--color-ink)]">Password</label>
        <input id="sign-in-password" v-model="password" name="password" type="password" autocomplete="current-password" class="mt-[var(--space-xs)] min-h-11 w-full rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[var(--color-paper)] px-[var(--space-sm)] text-[var(--color-ink)] outline-2 outline-transparent outline-offset-[-3px] placeholder:text-[var(--color-muted)] hover:bg-[var(--color-paper-2)] focus-visible:border-[var(--color-ink-2)] focus-visible:outline-[var(--color-focus)]" :aria-invalid="Boolean(errors.password)" :aria-describedby="errors.password ? 'sign-in-password-error' : undefined" @blur="validatePassword">
        <p id="sign-in-password-error" class="mt-[var(--space-2xs)] min-h-[1lh] text-sm text-[var(--color-error-ink)]">{{ errors.password }}</p>
      </div>

      <Button type="submit" :loading="isSubmitting">Sign in</Button>
    </form>

    <p class="mt-[var(--space-lg)] text-sm text-[var(--color-ink-2)]">Need a scorecard? <NuxtLink to="/auth/sign-up" class="font-semibold text-[var(--color-primary)]">Create an account</NuxtLink>.</p>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Sign in'
})

const route = useRoute()
const { isSupabaseConfigured, startPreviewSession } = useMeridianAuth()
const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const statusMessage = ref('')
const statusTone = ref<'error' | 'neutral'>('neutral')
const errors = reactive({
  email: '',
  password: ''
})

const validateEmail = () => {
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? '' : 'Enter a valid email address.'
}

const validatePassword = () => {
  errors.password = password.value.length > 0 ? '' : 'Enter your password.'
}

const handleSubmit = async () => {
  validateEmail()
  validatePassword()

  if (errors.email || errors.password) {
    statusTone.value = 'error'
    statusMessage.value = 'Fix the highlighted fields, then try again.'
    return
  }

  isSubmitting.value = true
  statusMessage.value = ''

  try {
    if (!isSupabaseConfigured.value) {
      startPreviewSession(email.value)
      statusTone.value = 'neutral'
      statusMessage.value = 'Supabase is not configured. Local preview mode is active and no account was created.'
      await navigateTo(typeof route.query.next === 'string' ? route.query.next : '/dashboard')
      return
    }

    const supabase = useSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      throw error
    }

    await navigateTo(typeof route.query.next === 'string' ? route.query.next : '/dashboard')
  } catch (error) {
    statusTone.value = 'error'
    statusMessage.value = error instanceof Error ? error.message : 'We could not sign you in. Try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
