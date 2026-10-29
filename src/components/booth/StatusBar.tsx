import { Heart, Award, Calendar } from 'lucide-react'

interface StatusBarProps {
  lives: number
  score: number
  currentDay: number
  maxLives?: number
}

export function StatusBar({ lives, score, currentDay, maxLives = 3 }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/60 backdrop-blur-sm border-b border-slate-800">
      {/* Vidas */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Vidas</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxLives }, (_, i) => (
            <Heart
              key={i}
              className={`w-4 h-4 ${i < lives ? 'text-red-500 fill-current' : 'text-slate-700'}`}
              strokeWidth={2.5}
            />
          ))}
        </div>
      </div>

      {/* Dia */}
      <div className="flex items-center gap-1 text-center">
        <Calendar className="w-3.5 h-3.5 text-slate-500" />
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Dia</span>
          <div className="text-sm font-bold text-slate-100 font-mono">{currentDay} / 5</div>
        </div>
      </div>

      {/* Pontos */}
      <div className="flex items-center gap-1 text-right">
        <Award className="w-3.5 h-3.5 text-slate-500" />
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Pts</span>
          <div className="text-sm font-bold text-slate-100 font-mono tabular-nums">{score.toLocaleString('pt-BR')}</div>
        </div>
      </div>
    </div>
  )
}