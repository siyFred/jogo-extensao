import { motion } from 'framer-motion'
import { CheckCircle, Award, Heart, Star, ArrowRight, Calendar, TrendingUp } from 'lucide-react'
import type { ManualRule } from '../../types/game'

interface DayReportModalProps {
  day: number
  casesTotal: number
  casesCorrect: number
  casesIncorrect: number
  approvedCorrect: number
  deniedCorrect: number
  totalScore: number
  livesRemaining: number
  unlockedRules: ManualRule[]
  perfectDay: boolean
  hasNextDay: boolean
  onContinue: () => void
  onRestart: () => void
}

export function DayReportModal({
  day,
  casesTotal,
  casesCorrect,
  casesIncorrect,
  approvedCorrect,
  deniedCorrect,
  totalScore,
  livesRemaining,
  unlockedRules,
  perfectDay,
  hasNextDay,
  onContinue,
  onRestart,
}: DayReportModalProps) {
  const accuracy = casesTotal > 0 ? Math.round((casesCorrect / casesTotal) * 100) : 0

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-report-title"
    >
      <motion.div
        className="relative w-full max-w-md max-h-[92dvh] flex flex-col bg-slate-900 rounded-2xl border-2 border-amber-600/50 shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="relative flex-shrink-0 p-4 sm:p-6 bg-gradient-to-r from-amber-900/40 via-slate-900 to-amber-900/40 border-b border-amber-600/30">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="reportGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#reportGrid)" />
            </svg>
          </div>
          
          <div className="relative flex flex-col items-center text-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h2 id="day-report-title" className="text-xl font-bold text-slate-100">
                FIM DO EXPEDIENTE - DIA {day}
              </h2>
            </div>
            
            {perfectDay && (
              <motion.div
                className="flex items-center gap-2 px-3 py-1 bg-amber-900/40 border border-amber-600/50 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, delay: 0.3 }}
              >
                <Star className="w-4 h-4 text-amber-300 fill-current" />
                <span className="text-xs font-mono text-amber-200 uppercase tracking-wider">Dia Perfeito!</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-5">
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard
              icon={<Award className="w-6 h-6 text-amber-400" />}
              value={totalScore.toLocaleString('pt-BR')}
              label="Pontuação Total"
              color="amber"
            />
            <StatCard
              icon={<Heart className="w-6 h-6 text-red-400" />}
              value={`${livesRemaining} / 3`}
              label="Vidas Restantes"
              color="red"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6 text-green-400" />}
              value={`${casesCorrect} / ${casesTotal}`}
              label="Casos Corretos"
              color="green"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6 text-blue-400" />}
              value={`${accuracy}%`}
              label="Precisão"
              color="blue"
            />
          </motion.div>

          {/* Case breakdown */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Detalhamento
            </h3>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
              <span className="text-sm text-slate-300">Aprovados corretamente</span>
              <span className="font-mono text-green-300">{approvedCorrect}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
              <span className="text-sm text-slate-300">Barrados corretamente</span>
              <span className="font-mono text-green-300">{deniedCorrect}</span>
            </div>
            {casesIncorrect > 0 && (
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-sm text-slate-300">Erros cometidos</span>
                <span className="font-mono text-red-300">{casesIncorrect}</span>
              </div>
            )}
          </motion.div>

          {/* Unlocked Rules */}
          {unlockedRules.length > 0 && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Regras Desbloqueadas (Dia {day})
              </h3>
              <div className="space-y-2">
                {unlockedRules.map((rule) => (
                  <motion.div
                    key={rule.id}
                    className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-amber-600/30 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * (unlockedRules.indexOf(rule) + 1) }}
                    layout
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-amber-900/30 border border-amber-600/30 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-amber-300">{rule.priority}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-100 text-sm">{rule.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{rule.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <motion.div
          className="flex-shrink-0 px-4 sm:px-6 pb-4 sm:pb-6 pt-3 flex flex-col gap-2 border-t border-slate-800 bg-slate-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={onContinue}
            className="w-full py-3 rounded-xl font-bold text-lg uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-slate-100 border border-amber-500 flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
          >
            {hasNextDay ? (
              <>
                <ArrowRight className="w-5 h-5" />
                Próximo Dia
              </>
            ) : (
              <>
                <Star className="w-5 h-5 fill-current" />
                Jogar Novamente
              </>
            )}
          </motion.button>
          
          <motion.button
            onClick={onRestart}
            className="w-full py-3 rounded-xl font-medium text-sm text-slate-400 hover:text-slate-200 bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            Refazer Dia {day}
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
  color: 'amber' | 'red' | 'green' | 'blue'
}) {
  const colorMap = {
    amber: 'bg-amber-900/30 border-amber-600/30 text-amber-300',
    red: 'bg-red-900/30 border-red-600/30 text-red-300',
    green: 'bg-green-900/30 border-green-600/30 text-green-300',
    blue: 'bg-blue-900/30 border-blue-600/30 text-blue-300',
  }

  const classes = colorMap[color]

  return (
    <div className={`p-4 rounded-xl border ${classes} text-center`}>
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-bold font-mono tabular-nums">{value}</p>
      <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{label}</p>
    </div>
  )
}