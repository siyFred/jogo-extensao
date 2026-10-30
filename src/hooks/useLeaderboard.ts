import { useEffect, useRef, useState } from 'react'
import { fetchLeaderboard } from '../lib/leaderboardApi'
import type { LeaderboardEntry } from '../types/game'

export interface LeaderboardView {
  entries: LeaderboardEntry[]
  /** Variação de posição recente por jogador (positivo = subiu, negativo = caiu) */
  rankDeltas: Record<string, number>
  connected: boolean
  /** true quando o servidor está sem banco (Redis) configurado */
  notConfigured: boolean
}

const POLL_INTERVAL_MS = 2000
const DELTA_VISIBLE_MS = 5000

/** Acompanha o placar quase em tempo real, consultando /api/leaderboard a cada 2s. */
export function useLeaderboard(): LeaderboardView {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [rankDeltas, setRankDeltas] = useState<Record<string, number>>({})
  const [connected, setConnected] = useState(false)
  const [notConfigured, setNotConfigured] = useState(false)
  const prevRanks = useRef<Map<string, number>>(new Map())
  const timers = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    let cancelled = false
    const currentTimers = timers.current

    const apply = (next: LeaderboardEntry[]) => {
      const changes: Record<string, number> = {}
      next.forEach((entry, index) => {
        const previous = prevRanks.current.get(entry.name)
        if (previous !== undefined && previous !== index) changes[entry.name] = previous - index
      })
      prevRanks.current = new Map(next.map((entry, index) => [entry.name, index]))
      setEntries(next)

      const changedNames = Object.keys(changes)
      if (changedNames.length === 0) return
      setRankDeltas((prev) => ({ ...prev, ...changes }))
      changedNames.forEach((name) => {
        const old = currentTimers.get(name)
        if (old) window.clearTimeout(old)
        currentTimers.set(
          name,
          window.setTimeout(() => {
            setRankDeltas((prev) => {
              const { [name]: _removed, ...rest } = prev
              void _removed
              return rest
            })
            currentTimers.delete(name)
          }, DELTA_VISIBLE_MS),
        )
      })
    }

    const poll = async () => {
      if (document.hidden) return
      try {
        const next = await fetchLeaderboard()
        if (cancelled) return
        setConnected(true)
        setNotConfigured(false)
        apply(next)
      } catch (error) {
        if (cancelled) return
        setConnected(false)
        setNotConfigured(error instanceof Error && error.message === 'storage_not_configured')
      }
    }

    void poll()
    const interval = window.setInterval(poll, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      window.clearInterval(interval)
      currentTimers.forEach((id) => window.clearTimeout(id))
      currentTimers.clear()
    }
  }, [])

  return { entries, rankDeltas, connected, notConfigured }
}
