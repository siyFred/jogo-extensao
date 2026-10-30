import { StatusBar } from './StatusBar'

interface BoothProps {
  lives: number
  score: number
  currentDay: number
}

/** Topo do jogo: apenas a barra de status compacta (vidas, dia, pontos). */
export function Booth({ lives, score, currentDay }: BoothProps) {
  return (
    <header className="w-full flex-shrink-0 bg-slate-900/60 border-b border-slate-800">
      <StatusBar lives={lives} score={score} currentDay={currentDay} />
    </header>
  )
}
