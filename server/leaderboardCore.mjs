// Regras do placar, independentes de onde os dados são guardados (memória ou Redis).

const STATUSES = ['playing', 'game_over', 'finished']

export const keyOf = (name) => name.trim().toLowerCase()
const cleanName = (raw) => (typeof raw === 'string' ? raw.trim().replace(/\s+/g, ' ').slice(0, 16) : '')
const num = (v, min, max) => Math.min(max, Math.max(min, Math.floor(Number(v) || 0)))

const sortEntries = (entries) =>
  [...entries].sort((a, b) => b.score - a.score || b.best - a.best || a.updatedAt - b.updatedAt)

export async function listPlayers(store) {
  return sortEntries(await store.getAll())
}

export async function joinPlayer(store, body) {
  const name = cleanName(body?.name)
  if (name.length < 2) return { status: 400, body: { error: 'name too short' } }
  const key = keyOf(name)
  const existing = await store.get(key)
  // Entrar/tentar de novo: rodada zerada, mantendo recorde e contagem de tentativas.
  const entry = {
    name: existing?.name ?? name,
    score: 0,
    best: existing?.best ?? 0,
    lives: 3,
    day: 1,
    status: 'playing',
    attempts: (existing?.attempts ?? 0) + 1,
    updatedAt: Date.now(),
  }
  await store.set(key, entry)
  return { status: 200, body: entry }
}

export async function scorePlayer(store, body) {
  const name = cleanName(body?.name)
  if (name.length < 2) return { status: 400, body: { error: 'name too short' } }
  const key = keyOf(name)
  const existing = await store.get(key)
  if (!existing) return { status: 404, body: { error: 'unknown player' } }
  const score = num(body.score, 0, 1_000_000)
  const entry = {
    ...existing,
    score,
    best: Math.max(existing.best, score),
    lives: num(body.lives, 0, 3),
    day: num(body.day, 1, 5),
    status: STATUSES.includes(body.status) ? body.status : 'playing',
    updatedAt: Date.now(),
  }
  await store.set(key, entry)
  return { status: 200, body: entry }
}
