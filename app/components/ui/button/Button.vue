<template>
  <button
    :type="type"
    :class="cn(buttonVariants({ variant, size }))"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <span v-if="loading" class="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] px-[var(--space-md)] text-sm font-semibold whitespace-nowrap outline-2 outline-transparent outline-offset-2 transition-[background-color,border-color,color,transform] duration-[var(--dur-micro)] ease-[var(--ease-out)] focus-visible:outline-[var(--color-focus)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-[0.55]',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary)] text-[var(--color-primary-ink)] hover:bg-[color-mix(in_oklab,var(--color-primary)_88%,var(--color-ink))]',
        secondary: 'border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]',
        quiet: 'text-[var(--color-ink-2)] hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]',
        danger: 'border border-[var(--color-error)] bg-[var(--color-paper)] text-[var(--color-error-ink)] hover:bg-[var(--color-paper-2)]'
      },
      size: {
        standard: '',
        compact: 'min-h-10 px-[var(--space-sm)]'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'standard'
    }
  }
)

type ButtonVariants = VariantProps<typeof buttonVariants>

withDefaults(
  defineProps<{
    disabled?: boolean
    loading?: boolean
    size?: ButtonVariants['size']
    type?: 'button' | 'submit' | 'reset'
    variant?: ButtonVariants['variant']
  }>(),
  {
    disabled: false,
    loading: false,
    size: 'standard',
    type: 'button',
    variant: 'primary'
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
