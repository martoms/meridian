<template>
  <div class="min-h-dvh bg-[var(--color-paper)] text-[var(--color-ink)]">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
useHead({
  script: [
    {
      key: 'meridian-theme',
      innerHTML: "try { const mode = localStorage.getItem('meridian-color-mode'); if (mode === 'dark' || mode === 'light') document.documentElement.dataset.mode = mode } catch {}"
    }
  ]
})
</script>
