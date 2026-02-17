const privateRoutes = ['/dashboard', '/history', '/onboarding', '/settings']

export default defineNuxtRouteMiddleware((to) => {
  if (!privateRoutes.includes(to.path)) {
    return
  }

  const { isAuthenticated } = useMeridianAuth()

  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/auth/sign-in',
      query: {
        next: to.fullPath
      }
    })
  }
})
