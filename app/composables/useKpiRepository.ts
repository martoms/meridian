import { upsertCheckInForWeek } from '~/lib/check-in-store'
import type { KpiActuals, KpiGoals, WeeklyCheckInSnapshot } from '~/types/kpi'
import type { Database } from '~/types/database.types'

interface LocalKpiStore {
  checkIns: WeeklyCheckInSnapshot[]
  goalsByUserId: Record<string, KpiGoals>
}

const localStoreKey = 'meridian-preview-kpi-store'

const emptyStore = (): LocalKpiStore => ({
  checkIns: [],
  goalsByUserId: {}
})

const readLocalStore = (): LocalKpiStore => {
  if (!import.meta.client) {
    return emptyStore()
  }

  try {
    const saved = localStorage.getItem(localStoreKey)
    return saved ? (JSON.parse(saved) as LocalKpiStore) : emptyStore()
  } catch {
    return emptyStore()
  }
}

const writeLocalStore = (store: LocalKpiStore) => {
  if (import.meta.client) {
    localStorage.setItem(localStoreKey, JSON.stringify(store))
  }
}

const mapGoalsFromRow = (row: Database['public']['Tables']['kpi_goals']['Row']): KpiGoals => ({
  outreach: row.outreach_target,
  qualified_leads: row.qualified_leads_target,
  discovery_calls: row.discovery_calls_target,
  proposals: row.proposals_target,
  closed_deals: row.closed_deals_target
})

const mapCheckInFromRow = (row: Database['public']['Tables']['weekly_check_ins']['Row']): WeeklyCheckInSnapshot => ({
  userId: row.user_id,
  weekStart: row.week_start,
  actuals: {
    outreach: row.outreach_actual,
    qualified_leads: row.qualified_leads_actual,
    discovery_calls: row.discovery_calls_actual,
    proposals: row.proposals_actual,
    closed_deals: row.closed_deals_actual
  },
  goals: {
    outreach: row.outreach_target,
    qualified_leads: row.qualified_leads_target,
    discovery_calls: row.discovery_calls_target,
    proposals: row.proposals_target,
    closed_deals: row.closed_deals_target
  }
})

const mapGoalsToInsert = (userId: string, goals: KpiGoals): Database['public']['Tables']['kpi_goals']['Insert'] => ({
  user_id: userId,
  outreach_target: goals.outreach,
  qualified_leads_target: goals.qualified_leads,
  discovery_calls_target: goals.discovery_calls,
  proposals_target: goals.proposals,
  closed_deals_target: goals.closed_deals
})

const mapCheckInToInsert = (checkIn: WeeklyCheckInSnapshot): Database['public']['Tables']['weekly_check_ins']['Insert'] => ({
  user_id: checkIn.userId,
  week_start: checkIn.weekStart,
  outreach_actual: checkIn.actuals.outreach,
  qualified_leads_actual: checkIn.actuals.qualified_leads,
  discovery_calls_actual: checkIn.actuals.discovery_calls,
  proposals_actual: checkIn.actuals.proposals,
  closed_deals_actual: checkIn.actuals.closed_deals,
  outreach_target: checkIn.goals.outreach,
  qualified_leads_target: checkIn.goals.qualified_leads,
  discovery_calls_target: checkIn.goals.discovery_calls,
  proposals_target: checkIn.goals.proposals,
  closed_deals_target: checkIn.goals.closed_deals
})

export const useKpiRepository = () => {
  const supabase = useSupabaseClient<Database>()
  const { isSupabaseConfigured } = useMeridianAuth()

  const getAuthenticatedUserId = async (expectedUserId: string) => {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      throw error
    }

    if (!data.user) {
      throw new Error('Your Supabase session has expired. Sign in again before accessing saved data.')
    }

    if (data.user.id !== expectedUserId) {
      throw new Error('Your active account changed. Reload the page and sign in again before continuing.')
    }

    return data.user.id
  }

  const loadGoals = async (userId: string) => {
    if (!isSupabaseConfigured.value) {
      return readLocalStore().goalsByUserId[userId] ?? null
    }

    const authenticatedUserId = await getAuthenticatedUserId(userId)
    const { data, error } = await supabase.from('kpi_goals').select().eq('user_id', authenticatedUserId).maybeSingle()

    if (error) {
      throw error
    }

    return data ? mapGoalsFromRow(data) : null
  }

  const saveGoals = async (userId: string, goals: KpiGoals) => {
    if (!isSupabaseConfigured.value) {
      const store = readLocalStore()
      store.goalsByUserId[userId] = { ...goals }
      writeLocalStore(store)
      return
    }

    const authenticatedUserId = await getAuthenticatedUserId(userId)
    const { error } = await supabase.from('kpi_goals').upsert(mapGoalsToInsert(authenticatedUserId, goals), {
      onConflict: 'user_id'
    })

    if (error) {
      throw error
    }
  }

  const listCheckIns = async (userId: string) => {
    if (!isSupabaseConfigured.value) {
      return readLocalStore().checkIns.filter((checkIn) => checkIn.userId === userId).sort((a, b) => b.weekStart.localeCompare(a.weekStart))
    }

    const authenticatedUserId = await getAuthenticatedUserId(userId)
    const { data, error } = await supabase
      .from('weekly_check_ins')
      .select()
      .eq('user_id', authenticatedUserId)
      .order('week_start', { ascending: false })

    if (error) {
      throw error
    }

    return data.map(mapCheckInFromRow)
  }

  const saveCheckIn = async (checkIn: WeeklyCheckInSnapshot) => {
    if (!isSupabaseConfigured.value) {
      const store = readLocalStore()
      store.checkIns = upsertCheckInForWeek(store.checkIns, checkIn)
      writeLocalStore(store)
      return checkIn
    }

    const authenticatedUserId = await getAuthenticatedUserId(checkIn.userId)
    const authenticatedCheckIn = {
      ...checkIn,
      userId: authenticatedUserId
    }
    const { data, error } = await supabase
      .from('weekly_check_ins')
      .upsert(mapCheckInToInsert(authenticatedCheckIn), {
        onConflict: 'user_id,week_start'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return mapCheckInFromRow(data)
  }

  const getCheckIn = async (userId: string, weekStart: string) => {
    const checkIns = await listCheckIns(userId)
    return checkIns.find((checkIn) => checkIn.weekStart === weekStart) ?? null
  }

  return {
    getCheckIn,
    listCheckIns,
    loadGoals,
    saveCheckIn,
    saveGoals
  }
}
