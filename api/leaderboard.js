import { createStore } from '../server/stores.mjs'
import { listPlayers } from '../server/leaderboardCore.mjs'

const store = createStore()

export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json(await listPlayers(store))
  } catch {
    res.status(500).json({ error: 'server error' })
  }
}
