<template>
  <nav aria-label="Primary navigation" :class="orientation === 'vertical' ? 'grid gap-[var(--space-xs)]' : 'grid grid-cols-3 gap-[var(--space-2xs)]'">
    <NuxtLink
      v-for="item in navigationItems"
      :key="item.to"
      :to="item.to"
      :class="[
        'inline-flex min-h-11 min-w-0 items-center rounded-[var(--radius-control)] font-medium whitespace-nowrap no-underline transition-[background-color,color] duration-[var(--dur-micro)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2',
        orientation === 'vertical' ? 'justify-start gap-2 px-[var(--space-sm)] text-sm' : 'justify-center gap-[var(--space-2xs)] px-[var(--space-2xs)] text-xs min-[360px]:gap-[var(--space-xs)] min-[360px]:px-[var(--space-xs)] min-[360px]:text-sm',
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
