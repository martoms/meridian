import { describe, expect, it } from 'vitest'
import { toMeridianUser } from '~/lib/auth'

describe('toMeridianUser', () => {
  it('uses the Supabase JWT subject as the application user ID', () => {
    expect(toMeridianUser({
      sub: '90dccd05-8d24-4e2b-88a9-668e0df0b7b7',
      email: 'alex@example.com',
      user_metadata: {
        display_name: 'Alex Rivera'
      }
    })).toEqual({
      id: '90dccd05-8d24-4e2b-88a9-668e0df0b7b7',
      email: 'alex@example.com',
      displayName: 'Alex Rivera'
    })
  })

  it('does not authenticate claims without a Supabase subject', () => {
    expect(toMeridianUser({ email: 'alex@example.com' })).toBeNull()
  })
})
