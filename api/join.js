import { createStore } from '../server/stores.mjs'
import { joinPlayer } from '../server/leaderboardCore.mjs'

const store = createStore()

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })
  try {
    let body = req.body
    if (typeof body === 'string') body = JSON.parse(body)
    const result = await joinPlayer(store, body ?? {})
    res.setHeader('Cache-Control', 'no-store')
    res.status(result.status).json(result.body)
  } catch {
    res.status(500).json({ error: 'server error' })
  }
}
