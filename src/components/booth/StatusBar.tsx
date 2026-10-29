import { Heart, Award, Calendar } from 'lucide-react'

interface StatusBarProps {
  lives: number
  score: number
  currentDay: number
  maxLives?: number
}

export function StatusBar({ lives, score, currentDay, maxLives = 3 }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
      {/* Vidas */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Vidas</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxLives }, (_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-current' : 'text-slate-600'}`}
              strokeWidth={2.5}
            />
          ))}
        </div>
      </div>

      {/* Dia */}
      <div className="flex items-center gap-1.5 text-center">
        <Calendar className="w-4 h-4 text-slate-400" />
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Dia</span>
          <div className="text-lg font-bold text-slate-100 font-mono">{currentDay} / 5</div>
        </div>
      </div>

      {/* Pontos */}
      <div className="flex items-center gap-1.5 text-right">
        <Award className="w-4 h-4 text-slate-400" />
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Pontos</span>
          <div className="text-lg font-bold text-slate-100 font-mono tabular-nums">{score.toLocaleString('pt-BR')}</div>
        </div>
      </div>
    </div>
  )
}