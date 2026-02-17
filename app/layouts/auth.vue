<template>
  <div class="min-h-dvh bg-[var(--color-paper)]">
    <header class="border-b border-[var(--color-rule)]">
      <div class="mx-auto flex min-h-16 max-w-[var(--container)] items-center justify-between px-[var(--space-md)] min-[768px]:px-[var(--space-lg)]">
        <AppBrand />
        <ThemeToggle />
      </div>
    </header>
    <main id="main-content" class="mx-auto flex min-h-[calc(100dvh-var(--space-4xl))] max-w-[36rem] items-center px-[var(--space-md)] py-[var(--space-xl)]">
      <slot />
    </main>
  </div>
</template>
