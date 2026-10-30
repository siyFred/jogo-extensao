import { motion } from 'framer-motion'
import { Heart, Trophy, ArrowUp, ArrowDown, Skull, Flag, Gamepad2, Wifi, WifiOff } from 'lucide-react'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import type { PlayerStatus } from '../../types/game'

const statusConfig: Record<PlayerStatus, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  playing: { label: 'Jogando', className: 'text-green-300 bg-green-900/30 border-green-600/40', icon: Gamepad2 },
  game_over: { label: 'Eliminado', className: 'text-red-300 bg-red-900/30 border-red-600/40', icon: Skull },
  finished: { label: 'Concluiu o dia', className: 'text-amber-300 bg-amber-900/30 border-amber-600/40', icon: Flag },
}

const podiumColor = ['text-amber-300', 'text-slate-300', 'text-orange-400']

export function LeaderboardPage() {
  const { entries, rankDeltas, connected } = useLeaderboard()

  return (
    <div className="h-[100dvh] w-full overflow-y-auto bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-3xl px-3 py-4 sm:px-6">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-amber-600/30 bg-amber-900/30 p-2">
              <Trophy className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Placar ao Vivo</h1>
              <p className="text-xs text-slate-500">{entries.length} jogador(es)</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono ${
              connected
                ? 'border-green-600/40 bg-green-900/30 text-green-300'
                : 'border-red-600/40 bg-red-900/30 text-red-300'
            }`}
          >
            {connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {connected ? 'AO VIVO' : 'RECONECTANDO'}
          </div>
        </header>

        {entries.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 py-16 text-center text-slate-500">
            <Trophy className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p>Nenhum jogador ainda. Aguardando o primeiro...</p>
          </div>
        ) : (
          <ol className="space-y-2">
            {entries.map((entry, index) => {
              const status = statusConfig[entry.status]
              const StatusIcon = status.icon
              const delta = rankDeltas[entry.name] ?? 0
              return (
                <motion.li
                  key={entry.name}
                  layout
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${
                    entry.status === 'game_over'
                      ? 'border-red-900/50 bg-slate-900/40 opacity-80'
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex w-12 flex-shrink-0 items-center justify-center gap-0.5">
                    <span className={`font-mono text-lg font-bold ${podiumColor[index] ?? 'text-slate-400'}`}>
                      {index + 1}º
                    </span>
                    {delta > 0 && <ArrowUp className="h-4 w-4 text-green-400" aria-label="subiu" />}
                    {delta < 0 && <ArrowDown className="h-4 w-4 text-red-400" aria-label="caiu" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{entry.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className={`flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-mono uppercase ${status.className}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Dia {entry.day}/5</span>
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: 3 }, (_, i) => (
                          <Heart
                            key={i}
                            className={`h-3.5 w-3.5 ${i < entry.lives ? 'fill-current text-red-500' : 'text-slate-700'}`}
                          />
                        ))}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="font-mono text-2xl font-bold tabular-nums">{entry.score.toLocaleString('pt-BR')}</p>
                    <p className="text-[10px] font-mono text-slate-500">
                      recorde {entry.best.toLocaleString('pt-BR')} · {entry.attempts}ª tentativa
                    </p>
                  </div>
                </motion.li>
              )
            })}
          </ol>
        )}
      </div>
    </div>
  )
}
