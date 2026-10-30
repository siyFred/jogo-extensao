// Armazenamento do placar.
// - Local / sem Redis configurado: memória do processo (zera ao reiniciar).
// - Vercel + Upstash Redis (variáveis REST abaixo): compartilhado entre as funções serverless.
//   A chave inclui o ID do deploy, então CADA REDEPLOY COMEÇA COM O PLACAR ZERADO.

function createMemoryStore() {
  const players = new Map()
  return {
    kind: 'memory',
    async getAll() {
      return [...players.values()]
    },
    async get(key) {
      return players.get(key)
    },
    async set(key, entry) {
      players.set(key, entry)
    },
  }
}

function createUpstashStore(url, token, hashKey) {
  const command = async (args) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    })
    if (!res.ok) throw new Error(`redis ${res.status}`)
    return (await res.json()).result
  }
  return {
    kind: 'redis',
    async getAll() {
      const flat = (await command(['HGETALL', hashKey])) ?? []
      const entries = []
      for (let i = 1; i < flat.length; i += 2) entries.push(JSON.parse(flat[i]))
      return entries
    },
    async get(key) {
      const raw = await command(['HGET', hashKey, key])
      return raw ? JSON.parse(raw) : undefined
    },
    async set(key, entry) {
      await command(['HSET', hashKey, key, JSON.stringify(entry)])
      await command(['EXPIRE', hashKey, 60 * 60 * 24 * 7])
    },
  }
}

export function createStore() {
  // Singleton por processo: join/score/leaderboard compartilham a mesma memória quando rodam juntos.
  globalThis.__leaderboardStore ??= buildStore()
  return globalThis.__leaderboardStore
}

function buildStore() {
  const env = process.env
  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN
  if (url && token) {
    const deployment = env.VERCEL_DEPLOYMENT_ID || env.VERCEL_URL || 'local'
    return createUpstashStore(url, token, `leaderboard:${deployment}`)
  }
  return createMemoryStore()
}
