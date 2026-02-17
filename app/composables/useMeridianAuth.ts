export interface PreviewUser {
  id: string
  email: string
  displayName: string | null
}

export const useMeridianAuth = () => {
  const config = useRuntimeConfig()
  const supabaseUser = useSupabaseUser()
  const previewUser = useCookie<PreviewUser | null>('meridian-preview-user', {
    default: () => null,
    sameSite: 'lax'
  })

  const isSupabaseConfigured = computed(() => {
    const url = config.public.supabase.url
    const key = config.public.supabase.key

    return Boolean(url && key && !url.includes('placeholder.supabase.co') && key !== 'placeholder-publishable-key')
  })

  const user = computed<PreviewUser | null>(() => {
    if (supabaseUser.value) {
      return {
        id: supabaseUser.value.id,
        email: supabaseUser.value.email ?? '',
        displayName: (supabaseUser.value.user_metadata?.display_name as string | undefined) ?? null
      }
    }

    return previewUser.value
  })

  const startPreviewSession = (email: string, displayName: string | null = null) => {
    previewUser.value = {
      id: 'preview-user',
      email,
      displayName
    }
  }

  const signOut = async () => {
    if (isSupabaseConfigured.value) {
      const supabase = useSupabaseClient()
      await supabase.auth.signOut()
    }

    previewUser.value = null
  }

  return {
    isAuthenticated: computed(() => Boolean(user.value)),
    isPreview: computed(() => Boolean(previewUser.value) && !supabaseUser.value),
    isSupabaseConfigured,
    signOut,
    startPreviewSession,
    user
  }
}
