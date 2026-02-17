<template>
  <div class="min-h-dvh bg-[var(--color-paper)]">
    <AppHeader />
    <div class="mx-auto grid max-w-[var(--container)] min-[1280px]:grid-cols-[15rem_minmax(0,1fr)]">
      <aside class="hidden border-r border-[var(--color-rule)] p-[var(--space-lg)] min-[1280px]:block">
        <div class="sticky top-[var(--space-4xl)]">
          <AppNavigation orientation="vertical" />
        </div>
      </aside>
      <main id="main-content" class="min-w-0 px-[var(--space-md)] py-[var(--space-lg)] min-[768px]:px-[var(--space-lg)] min-[768px]:py-[var(--space-xl)] min-[1280px]:px-[var(--space-xl)]">
        <slot />
      </main>
    </div>
  </div>
</template>
