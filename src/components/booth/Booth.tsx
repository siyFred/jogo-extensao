import { motion } from 'framer-motion'
import { StatusBar } from './StatusBar'
import { Avatar } from './Avatar'
import { Dialogue } from './Dialogue'
import type { TravelerCase } from '../../types/game'

interface BoothProps {
  currentCase: TravelerCase | null
  lives: number
  score: number
  currentDay: number
  avatarState?: 'traveler' | 'approved' | 'denied' | 'loading'
}

export function Booth({
  currentCase,
  lives,
  score,
  currentDay,
  avatarState = 'traveler',
}: BoothProps) {
  if (!currentCase) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-24 w-full bg-slate-900/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center text-slate-500">
          <p className="text-base font-medium">Nenhum viajante na fila</p>
          <p className="text-xs mt-1">Aguardando próximo caso...</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.section
      className="flex flex-col w-full bg-slate-900/40 backdrop-blur-sm border-b border-slate-800 flex-shrink-0 h-[clamp(100px,20dvh,140px)]"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <StatusBar lives={lives} score={score} currentDay={currentDay} />

      <div className="flex flex-1 min-h-0 items-center justify-center gap-2 px-3 py-1.5 overflow-hidden">
        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <Avatar avatarId={currentCase.avatarId} type={avatarState} />
          <motion.p
            className="mt-1 text-xs font-medium text-slate-200 truncate max-w-[100px] text-center"
            key={currentCase.travelerName}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentCase.travelerName}
          </motion.p>
        </div>

        {/* Dialogue */}
        <div className="flex-1 min-w-0 flex flex-col justify-center min-h-0">
          <Dialogue
            text={currentCase.dialogue}
            travelerName={currentCase.travelerName}
            isTyping={avatarState === 'loading'}
          />
        </div>
      </div>
    </motion.section>
  )
}