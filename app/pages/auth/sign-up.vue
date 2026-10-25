<template>
  <section class="w-full rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-[var(--space-lg)] min-[768px]:p-[var(--space-xl)]">
    <p class="text-sm font-semibold text-[var(--color-primary)]">Your private scorecard</p>
    <h1 class="mt-[var(--space-xs)] text-[var(--text-section)] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">Create your Meridian account.</h1>
    <p class="mt-[var(--space-sm)] text-sm leading-relaxed text-[var(--color-ink-2)]">Start by setting the targets that define a good sales week for you.</p>

    <div v-if="hasErrors" ref="errorSummary" tabindex="-1" class="mt-[var(--space-lg)] rounded-[var(--radius-control)] border border-[var(--color-error)] p-[var(--space-sm)] text-sm text-[var(--color-error-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2" role="alert">
      <p class="font-semibold">Fix the highlighted fields, then try again.</p>
      <ul class="mt-[var(--space-xs)] list-disc pl-[var(--space-lg)]">
        <li v-if="errors.displayName"><a href="#sign-up-name" class="underline">Name: {{ errors.displayName }}</a></li>
        <li v-if="errors.email"><a href="#sign-up-email" class="underline">Email address: {{ errors.email }}</a></li>
        <li v-if="errors.password"><a href="#sign-up-password" class="underline">Password: {{ errors.password }}</a></li>
      </ul>
    </div>

    <p v-if="statusMessage" class="mt-[var(--space-lg)] rounded-[var(--radius-control)] border p-[var(--space-sm)] text-sm" :class="statusTone === 'error' ? 'border-[var(--color-error)] text-[var(--color-error-ink)]' : 'border-[var(--color-rule)] text-[var(--color-ink-2)]'" role="status" aria-live="polite">{{ statusMessage }}</p>

    <form novalidate class="mt-[var(--space-lg)] grid gap-[var(--space-md)]" @submit.prevent="handleSubmit">
      <div>
        <label for="sign-up-name" class="block text-sm font-medium text-[var(--color-ink)]">Name</label>
        <input id="sign-up-name" v-model.trim="displayName" name="name" autocomplete="name" class="mt-[var(--space-xs)] min-h-11 w-full rounded-[var(--radius-control)] border border-[var(--color-muted)] bg-[var(--color-paper)] px-[var(--space-sm)] text-[var(--color-ink)] outline-2 outline-transparent outline-offset-[-3px] hover:bg-[var(--color-paper-2)] focus-visible:border-[var(--color-ink-2)] focus-visible:outline-[var(--color-focus)]" :aria-invalid="Boolean(errors.displayName)" :aria-describedby="errors.displayName ? 'sign-up-name-error' : undefined" @blur="validateName">
        <p id="sign-up-name-error" class="mt-[var(--space-2xs)] min-h-[1lh] text-sm text-[var(--color-error-ink)]">{{ errors.displayName }}</p>
      </div>

      <div>
        <label for="sign-up-email" class="block text-sm font-medium text-[var(--color-ink)]">Email address</label>
        <input id="sign-up-email" v-model.trim="email" name="email" type="email" autocomplete="email" inputmode="email" class="mt-[var(--space-xs)] min-h-11 w-full rounded-[var(--radius-control)] border border-[var(--color-muted)] bg-[var(--color-paper)] px-[var(--space-sm)] text-[var(--color-ink)] outline-2 outline-transparent outline-offset-[-3px] hover:bg-[var(--color-paper-2)] focus-visible:border-[var(--color-ink-2)] focus-visible:outline-[var(--color-focus)]" :aria-invalid="Boolean(errors.email)" :aria-describedby="errors.email ? 'sign-up-email-error' : undefined" @blur="validateEmail">
        <p id="sign-up-email-error" class="mt-[var(--space-2xs)] min-h-[1lh] text-sm text-[var(--color-error-ink)]">{{ errors.email }}</p>
      </div>

      <div>
        <label for="sign-up-password" class="block text-sm font-medium text-[var(--color-ink)]">Password</label>
        <input id="sign-up-password" v-model="password" name="password" type="password" autocomplete="new-password" class="mt-[var(--space-xs)] min-h-11 w-full rounded-[var(--radius-control)] border border-[var(--color-muted)] bg-[var(--color-paper)] px-[var(--space-sm)] text-[var(--color-ink)] outline-2 outline-transparent outline-offset-[-3px] hover:bg-[var(--color-paper-2)] focus-visible:border-[var(--color-ink-2)] focus-visible:outline-[var(--color-focus)]" :aria-invalid="Boolean(errors.password)" :aria-describedby="errors.password ? 'sign-up-password-error' : undefined" @blur="validatePassword">
        <p id="sign-up-password-error" class="mt-[var(--space-2xs)] min-h-[1lh] text-sm text-[var(--color-error-ink)]">{{ errors.password }}</p>
      </div>

      <Button type="submit" :loading="isSubmitting">Create account</Button>
    </form>

    <p class="mt-[var(--space-lg)] text-sm text-[var(--color-ink-2)]">Already have an account? <NuxtLink to="/auth/sign-in" class="font-semibold text-[var(--color-primary)]">Sign in</NuxtLink>.</p>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Create account'
})

const { isSupabaseConfigured, signUp, startPreviewSession } = useMeridianAuth()
const displayName = ref('')
const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const statusMessage = ref('')
const statusTone = ref<'error' | 'neutral'>('neutral')
const errorSummary = ref<HTMLElement | null>(null)
const errors = reactive({
  displayName: '',
  email: '',
  password: ''
})
const hasErrors = computed(() => Object.values(errors).some(Boolean))

const validateName = () => {
  errors.displayName = displayName.value.trim().length > 0 ? '' : 'Enter your name.'
}

const validateEmail = () => {
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? '' : 'Enter a valid email address.'
}

const validatePassword = () => {
  errors.password = password.value.length >= 8 ? '' : 'Use at least 8 characters.'
}

const focusErrorSummary = async () => {
  await nextTick()
  errorSummary.value?.focus()
}

const getSignUpErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : ''

  if (/email rate limit exceeded|over_email_send_rate_limit/i.test(message)) {
    return 'Supabase is still trying to send a confirmation email. For this demo, turn off Confirm email in Authentication → Sign In / Providers → Email. Check Authentication → Users before retrying; an unconfirmed account may already exist.'
  }

  return message || 'We could not create your account. Try again.'
}

const handleSubmit = async () => {
  validateName()
  validateEmail()
  validatePassword()

  if (errors.displayName || errors.email || errors.password) {
    await focusErrorSummary()
    return
  }

  isSubmitting.value = true
  statusMessage.value = ''

  try {
    if (!isSupabaseConfigured.value) {
      startPreviewSession(email.value, displayName.value)
      statusTone.value = 'neutral'
      statusMessage.value = 'Supabase is not configured. Local preview mode is active and no account was created.'
      await navigateTo('/onboarding')
      return
    }

    const { data, error } = await signUp({
      email: email.value,
      password: password.value,
      displayName: displayName.value,
      emailRedirectTo: `${window.location.origin}/auth/confirm`
    })

    if (error) {
      throw error
    }

    if (data.session) {
      statusTone.value = 'neutral'
      statusMessage.value = 'Your account is ready. You are signed in.'
      await navigateTo('/onboarding')
      return
    }

    statusTone.value = 'neutral'
    statusMessage.value = 'Account created, but email confirmation is still enabled in Supabase. Turn off Confirm email in your project’s Email provider settings and try signing in. If this test account is still unconfirmed, confirm it or recreate it.'
  } catch (error) {
    statusTone.value = 'error'
    statusMessage.value = getSignUpErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
