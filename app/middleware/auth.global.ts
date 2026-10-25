const privateRoutes = ['/dashboard', '/history', '/onboarding', '/settings']

export default defineNuxtRouteMiddleware(async (to) => {
  if (!privateRoutes.includes(to.path)) {
    return
  }

  const { isAuthenticated, isSupabaseConfigured, refreshSupabaseUser } = useMeridianAuth()

  if (!isAuthenticated.value && isSupabaseConfigured.value) {
    await refreshSupabaseUser()
  }

  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/auth/sign-in',
      query: {
        next: to.fullPath
      }
    })
  }
})
