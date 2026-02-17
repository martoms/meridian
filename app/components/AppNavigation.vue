<template>
  <nav aria-label="Primary navigation" :class="orientation === 'vertical' ? 'grid gap-[var(--space-xs)]' : 'flex min-w-max items-center gap-[var(--space-xs)]'">
    <NuxtLink
      v-for="item in navigationItems"
      :key="item.to"
      :to="item.to"
      :class="[
        'inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] px-[var(--space-sm)] text-sm font-medium whitespace-nowrap no-underline transition-[background-color,color] duration-[var(--dur-micro)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2',
        route.path === item.to ? 'bg-[var(--color-paper-2)] text-[var(--color-primary)]' : 'text-[var(--color-ink-2)] hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]'
      ]"
      :aria-current="route.path === item.to ? 'page' : undefined"
    >
      <component :is="item.icon" :size="18" aria-hidden="true" />
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>

<script lang="ts" setup>
import { BarChart3, History, Settings } from '@lucide/vue'

withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
  }>(),
  {
    orientation: 'horizontal'
  }
)

const route = useRoute()

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'History', to: '/history', icon: History },
  { label: 'Settings', to: '/settings', icon: Settings }
]
</script>
