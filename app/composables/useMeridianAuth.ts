import { toMeridianUser, type MeridianUser } from '~/lib/auth'

export type PreviewUser = MeridianUser

interface SignUpDetails {
  email: string
  password: string
  displayName: string
  emailRedirectTo: string
}

export const useMeridianAuth = () => {
  const config = useRuntimeConfig()
  const supabase = useSupabaseClient()
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
    if (isSupabaseConfigured.value) {
      return toMeridianUser(supabaseUser.value)
    }

    return previewUser.value
  })

  const startPreviewSession = (email: string, displayName: string | null = null) => {
    if (isSupabaseConfigured.value) {
      return
    }

    previewUser.value = {
      id: 'preview-user',
      email,
      displayName
    }
  }

  const refreshSupabaseUser = async () => {
    if (!isSupabaseConfigured.value) {
      return previewUser.value
    }

    const { data } = await supabase.auth.getClaims()
    supabaseUser.value = data?.claims ?? null
    return user.value
  }

  const signInWithPassword = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password })

    if (result.data.session) {
      await refreshSupabaseUser()
    }

    return result
  }

  const signUp = async ({ email, password, displayName, emailRedirectTo }: SignUpDetails) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        },
        emailRedirectTo
      }
    })

    if (result.data.session) {
      await refreshSupabaseUser()
    }

    return result
  }

  const signOut = async () => {
    previewUser.value = null

    if (isSupabaseConfigured.value) {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      supabaseUser.value = null
    }
  }

  return {
    isAuthenticated: computed(() => Boolean(user.value)),
    isPreview: computed(() => Boolean(previewUser.value) && !isSupabaseConfigured.value),
    isSupabaseConfigured,
    refreshSupabaseUser,
    signInWithPassword,
    signOut,
    signUp,
    startPreviewSession,
    user
  }
}
