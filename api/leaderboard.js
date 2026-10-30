import { createStore } from '../server/stores.mjs'
import { listPlayers } from '../server/leaderboardCore.mjs'

const store = createStore()

export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json(await listPlayers(store))
  } catch (error) {
    if (error instanceof Error && error.message === 'storage_not_configured') {
      return res.status(503).json({ error: 'storage_not_configured' })
    }
    res.status(500).json({ error: 'server error' })
  }
}
