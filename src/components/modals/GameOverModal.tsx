import { motion } from 'framer-motion'
import { Skull, RefreshCw, Award, Heart, AlertTriangle, ChevronRight } from 'lucide-react'
import type { ManualRule } from '../../types/game'

interface GameOverModalProps {
  finalScore: number
  dayReached: number
  casesCompleted: number
  onRestart: () => void
  onMainMenu: () => void
}

export function GameOverModal({
  finalScore,
  dayReached,
  casesCompleted,
  onRestart,
  onMainMenu,
}: GameOverModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
    >
      <motion.div
        className="relative w-full max-w-md bg-slate-900 rounded-2xl border-2 border-red-600/50 shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="relative p-8 bg-gradient-to-b from-red-900/30 to-slate-900 border-b border-red-600/30 text-center">
          <div className="absolute inset-0 opacity-5" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="gameOverGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="currentColor" strokeWidth="0.2" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#gameOverGrid)" />
            </svg>
          </div>

          <motion.div
            className="relative mx-auto mb-4 w-20 h-20 rounded-2xl bg-red-900/40 border-2 border-red-600/50 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          >
            <Skull className="w-10 h-10 text-red-400" />
          </motion.div>

          <motion.h2
            id="game-over-title"
            className="text-2xl font-bold text-slate-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            SISTEMA COMPROMETIDO
          </motion.h2>

          <motion.p
            className="text-slate-400 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Suas credenciais de acesso foram revogadas por falhas críticas de segurança.
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          className="p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<Award className="w-6 h-6 text-amber-400" />}
              value={finalScore.toLocaleString('pt-BR')}
              label="Pontuação Final"
              color="amber"
            />
            <StatCard
              icon={<AlertTriangle className="w-6 h-6 text-orange-400" />}
              value={`Dia ${dayReached} / 5`}
              label="Dia Alcançado"
              color="orange"
            />
            <StatCard
              icon={<Heart className="w-6 h-6 text-red-400" />}
              value={casesCompleted.toString()}
              label="Casos Processados"
              color="red"
            />
          </div>

          {/* Message */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="flex items-start gap-3 text-slate-300 text-sm">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-medium text-red-300">Falha na inspeção:</span>{' '}
                Muitos documentos maliciosos passaram pela sua verificação. 
                Revise as regras do manual e tente novamente.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="px-6 pb-6 pt-2 flex flex-col gap-3 border-t border-slate-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={onRestart}
            className="w-full py-3 rounded-xl font-bold text-lg uppercase tracking-wider bg-red-600 hover:bg-red-500 text-slate-100 border border-red-500 flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
          >
            <RefreshCw className="w-5 h-5" />
            Tentar Novamente (Dia 1)
          </motion.button>
          
          <motion.button
            onClick={onMainMenu}
            className="w-full py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-slate-200 bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            Menu Principal
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode
  value: string
  label: string
  color: 'amber' | 'red' | 'green' | 'blue' | 'orange'
}) {
  const colorMap = {
    amber: 'bg-amber-900/30 border-amber-600/30 text-amber-300',
    red: 'bg-red-900/30 border-red-600/30 text-red-300',
    green: 'bg-green-900/30 border-green-600/30 text-green-300',
    blue: 'bg-blue-900/30 border-blue-600/30 text-blue-300',
    orange: 'bg-orange-900/30 border-orange-600/30 text-orange-300',
  }

  const classes = colorMap[color]

  return (
    <div className={`p-3 rounded-xl border ${classes} text-center`}>
      <div className="mb-1">{icon}</div>
      <p className="text-xl font-bold font-mono tabular-nums">{value}</p>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  )
}