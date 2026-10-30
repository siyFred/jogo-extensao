import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Play, Trophy } from 'lucide-react'

interface NameEntryScreenProps {
  onSubmit: (name: string) => void
}

const MIN_LENGTH = 2
const MAX_LENGTH = 16

export function NameEntryScreen({ onSubmit }: NameEntryScreenProps) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const trimmed = name.trim().replace(/\s+/g, ' ')
  const valid = trimmed.length >= MIN_LENGTH

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid || submitting) return
    setSubmitting(true)
    onSubmit(trimmed)
  }

  return (
    <div className="flex h-[100dvh] w-full max-w-md lg:max-w-none mx-auto items-center justify-center overflow-hidden bg-slate-950 px-6 text-slate-100 touch-manipulation select-none">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-sm text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-600/30 bg-amber-900/30">
          <ShieldCheck className="h-8 w-8 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Jogo</h1>
        <p className="mt-2 mb-6 text-sm text-slate-400">Digite seu nome para entrar no placar e começar.</p>

        <label htmlFor="player-name" className="sr-only">
          Seu nome
        </label>
        <input
          id="player-name"
          autoFocus
          autoComplete="off"
          value={name}
          maxLength={MAX_LENGTH}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome ou apelido"
          className="w-full select-text rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-center text-lg text-slate-100 placeholder:text-slate-600 focus:border-amber-500"
        />
        <p className="mt-1 text-xs text-slate-600">
          {MIN_LENGTH} a {MAX_LENGTH} caracteres
        </p>

        <button
          type="submit"
          disabled={!valid || submitting}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-semibold text-slate-950 transition-colors active:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Play className="h-5 w-5" />
          Começar
        </button>

        <a
          href="/leaderboard"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300"
        >
          <Trophy className="h-3.5 w-3.5" />
          Ver placar ao vivo
        </a>
      </motion.form>
    </div>
  )
}
