<template>
  <header class="sticky top-0 z-[var(--z-sticky-nav)] border-b border-[var(--color-rule)] bg-[var(--color-paper)]">
    <div class="mx-auto flex min-h-16 max-w-[var(--container)] items-center justify-between gap-[var(--space-sm)] px-[var(--space-md)] min-[768px]:px-[var(--space-lg)] min-[1280px]:px-[var(--space-xl)]">
      <AppBrand />
      <div class="flex min-w-0 items-center gap-[var(--space-xs)]">
        <div v-if="isAuthenticated" class="hidden min-w-0 text-right min-[768px]:block">
          <p class="truncate text-sm font-medium text-[var(--color-ink)]">{{ user?.displayName || user?.email }}</p>
          <p v-if="isPreview" class="text-xs text-[var(--color-muted)]">Local preview</p>
        </div>
        <ThemeToggle />
        <Button v-if="isAuthenticated" variant="quiet" size="compact" @click="handleSignOut">Sign out</Button>
        <NuxtLink v-else to="/auth/sign-in" class="inline-flex min-h-11 items-center rounded-[var(--radius-control)] px-[var(--space-sm)] text-sm font-semibold text-[var(--color-primary)] no-underline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2">Sign in</NuxtLink>
      </div>
    </div>
    <div v-if="isAuthenticated" class="overflow-x-auto border-t border-[var(--color-rule)] px-[var(--space-md)] min-[1280px]:hidden">
      <AppNavigation />
    </div>
  </header>
</template>

<script lang="ts" setup>
const { isAuthenticated, isPreview, signOut, user } = useMeridianAuth()

const handleSignOut = async () => {
  await signOut()
  await navigateTo('/')
}
</script>
