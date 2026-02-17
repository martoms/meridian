<template>
  <NuxtLink to="/" class="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] px-[var(--space-xs)] text-lg font-bold tracking-[-0.02em] text-[var(--color-ink)] no-underline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2">
    <Route :size="22" class="text-[var(--color-primary)]" aria-hidden="true" />
    Meridian
  </NuxtLink>
</template>

<script lang="ts" setup>
import { Route } from '@lucide/vue'
</script>
