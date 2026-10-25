export interface MeridianUser {
  id: string
  email: string
  displayName: string | null
}

interface SupabaseUserClaims {
  sub?: string
  email?: string
  user_metadata?: {
    display_name?: unknown
  } | null
}

export const toMeridianUser = (claims: SupabaseUserClaims | null): MeridianUser | null => {
  if (!claims?.sub) {
    return null
  }

  return {
    id: claims.sub,
    email: claims.email ?? '',
    displayName: typeof claims.user_metadata?.display_name === 'string' ? claims.user_metadata.display_name : null
  }
}
