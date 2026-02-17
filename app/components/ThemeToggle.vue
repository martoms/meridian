<template>
  <button
    type="button"
    class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink-2)] transition-[background-color,border-color,color,transform] duration-[var(--dur-micro)] ease-[var(--ease-out)] hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 active:translate-y-px"
    :aria-label="mode === 'dark' ? 'Use light theme' : 'Use dark theme'"
    @click="toggleMode"
  >
    <Sun v-if="mode === 'dark'" :size="18" aria-hidden="true" />
    <Moon v-else :size="18" aria-hidden="true" />
  </button>
</template>

<script lang="ts" setup>
import { Moon, Sun } from '@lucide/vue'

const { initializeMode, mode, toggleMode } = useTheme()

onMounted(initializeMode)
</script>
