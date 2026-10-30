// Servidor leve do placar. Sem dependências: serve o build (dist/) e guarda os jogadores
// APENAS EM MEMÓRIA — qualquer redeploy/reinício do processo zera o placar.
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = Number(process.env.PORT) || 3001
const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

/** @type {Map<string, {name:string,score:number,best:number,lives:number,day:number,status:string,attempts:number,updatedAt:number}>} */
const players = new Map()
/** @type {Set<import('node:http').ServerResponse>} */
const clients = new Set()

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
}

const keyOf = (name) => name.trim().toLowerCase()
const cleanName = (raw) => (typeof raw === 'string' ? raw.trim().replace(/\s+/g, ' ').slice(0, 16) : '')
const num = (v, min, max) => Math.min(max, Math.max(min, Math.floor(Number(v) || 0)))

function snapshot() {
  return [...players.values()].sort(
    (a, b) => b.score - a.score || b.best - a.best || a.updatedAt - b.updatedAt,
  )
}

function broadcast() {
  const data = `data: ${JSON.stringify(snapshot())}\n\n`
  for (const res of clients) res.write(data)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (c) => {
      raw += c
      if (raw.length > 10_000) {
        reject(new Error('too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(body))
}

async function handleApi(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/leaderboard') return json(res, 200, snapshot())

  if (req.method === 'GET' && pathname === '/api/leaderboard/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    })
    res.write(`data: ${JSON.stringify(snapshot())}\n\n`)
    clients.add(res)
    const ping = setInterval(() => res.write(': ping\n\n'), 25_000)
    req.on('close', () => {
      clearInterval(ping)
      clients.delete(res)
    })
    return
  }

  if (req.method === 'POST' && (pathname === '/api/join' || pathname === '/api/score')) {
    let body
    try {
      body = await readBody(req)
    } catch {
      return json(res, 400, { error: 'invalid body' })
    }
    const name = cleanName(body.name)
    if (name.length < 2) return json(res, 400, { error: 'name too short' })
    const key = keyOf(name)
    const existing = players.get(key)

    if (pathname === '/api/join') {
      // Entrar/tentar de novo: nova rodada zerada, mantendo recorde e nº de tentativas.
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
      players.set(key, entry)
      broadcast()
      return json(res, 200, entry)
    }

    if (!existing) return json(res, 404, { error: 'unknown player' })
    const score = num(body.score, 0, 1_000_000)
    const status = ['playing', 'game_over', 'finished'].includes(body.status) ? body.status : 'playing'
    const entry = {
      ...existing,
      score,
      best: Math.max(existing.best, score),
      lives: num(body.lives, 0, 3),
      day: num(body.day, 1, 5),
      status,
      updatedAt: Date.now(),
    }
    players.set(key, entry)
    broadcast()
    return json(res, 200, entry)
  }

  return json(res, 404, { error: 'not found' })
}

async function serveStatic(res, pathname) {
  let file = path.join(DIST, path.normalize(pathname))
  if (!file.startsWith(DIST) || !existsSync(file) || path.extname(file) === '') {
    file = path.join(DIST, 'index.html') // fallback SPA (/leaderboard etc.)
  }
  try {
    const data = await readFile(file)
    const ext = path.extname(file)
    res.writeHead(200, {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('Rode "npm run build" antes de "npm start".')
  }
}

http
  .createServer((req, res) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost')
    if (pathname.startsWith('/api/')) {
      handleApi(req, res, pathname).catch(() => json(res, 500, { error: 'server error' }))
    } else {
      serveStatic(res, decodeURIComponent(pathname))
    }
  })
  .listen(PORT, () => console.log(`Servidor do jogo em http://localhost:${PORT} (placar em memória)`))
