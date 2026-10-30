import { useEffect, useRef, useState } from 'react'
import type { LeaderboardEntry } from '../types/game'

export interface LeaderboardView {
  entries: LeaderboardEntry[]
  /** Variação de posição recente por jogador (positivo = subiu, negativo = caiu) */
  rankDeltas: Record<string, number>
  connected: boolean
}

const DELTA_VISIBLE_MS = 5000

/** Acompanha o placar em tempo real via SSE (/api/leaderboard/stream). */
export function useLeaderboard(): LeaderboardView {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [rankDeltas, setRankDeltas] = useState<Record<string, number>>({})
  const [connected, setConnected] = useState(false)
  const prevRanks = useRef<Map<string, number>>(new Map())
  const timers = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    const source = new EventSource('/api/leaderboard/stream')
    const currentTimers = timers.current

    source.onopen = () => setConnected(true)
    source.onerror = () => setConnected(false)
    source.onmessage = (event: MessageEvent<string>) => {
      const next = JSON.parse(event.data) as LeaderboardEntry[]
      const changes: Record<string, number> = {}
      next.forEach((entry, index) => {
        const previous = prevRanks.current.get(entry.name)
        if (previous !== undefined && previous !== index) changes[entry.name] = previous - index
      })
      prevRanks.current = new Map(next.map((entry, index) => [entry.name, index]))
      setEntries(next)

      const changedNames = Object.keys(changes)
      if (changedNames.length > 0) {
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
    }

    return () => {
      source.close()
      currentTimers.forEach((id) => window.clearTimeout(id))
      currentTimers.clear()
    }
  }, [])

  return { entries, rankDeltas, connected }
}
