// Servidor leve do placar. Sem dependências: serve o build (dist/) e guarda os jogadores
// em memória (ou Redis, se configurado) — reiniciar o processo zera o placar.
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createStore } from './stores.mjs'
import { joinPlayer, listPlayers, scorePlayer } from './leaderboardCore.mjs'

const PORT = Number(process.env.PORT) || 3001
const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

const store = createStore()

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
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
  if (req.method === 'GET' && pathname === '/api/leaderboard') return json(res, 200, await listPlayers(store))

  if (req.method === 'POST' && (pathname === '/api/join' || pathname === '/api/score')) {
    let body
    try {
      body = await readBody(req)
    } catch {
      return json(res, 400, { error: 'invalid body' })
    }
    const result = await (pathname === '/api/join' ? joinPlayer : scorePlayer)(store, body)
    return json(res, result.status, result.body)
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
