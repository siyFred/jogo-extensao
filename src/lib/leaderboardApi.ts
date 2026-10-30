import type { LeaderboardEntry, PlayerStatus } from '../types/game'

async function post(path: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok
  } catch {
    return false // jogo continua funcionando mesmo sem servidor
  }
}

export function joinLeaderboard(name: string): Promise<boolean> {
  return post('/api/join', { name })
}

export function reportScore(payload: {
  name: string
  score: number
  lives: number
  day: number
  status: PlayerStatus
}): Promise<boolean> {
  return post('/api/score', payload)
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch('/api/leaderboard')
  if (!res.ok) throw new Error('leaderboard unavailable')
  return (await res.json()) as LeaderboardEntry[]
}
