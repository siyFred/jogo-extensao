import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, ChevronRight, Award, Heart } from 'lucide-react'
import type { FeedbackTicket } from '../../hooks/useGameEngine'
import type { Discrepancy } from '../../types/game'

interface FeedbackModalProps {
  ticket: FeedbackTicket
  onClose: () => void
  onNext: () => void
}

function DiscrepancyItem({ discrepancy, isFound }: { discrepancy: Discrepancy; isFound: boolean }) {
  const severityColors: Record<string, string> = {
    low: 'text-slate-400 bg-slate-800/50 border-slate-700',
    medium: 'text-amber-300 bg-amber-900/30 border-amber-600/30',
    high: 'text-orange-300 bg-orange-900/30 border-orange-600/30',
    critical: 'text-red-300 bg-red-900/30 border-red-600/30',
  }

  const severityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    low: AlertTriangle,
    medium: AlertTriangle,
    high: AlertTriangle,
    critical: XCircle,
  }

  const Icon = severityIcons[discrepancy.severity] ?? AlertTriangle
  const colors = severityColors[discrepancy.severity] ?? severityColors.low

  return (
    <motion.div
      className={`flex items-start gap-3 p-3 rounded-lg border ${colors} ${isFound ? 'opacity-100' : 'opacity-60'}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="flex-shrink-0 mt-0.5">
        {isFound ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-slate-200">{discrepancy.description}</span>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/30">
            {discrepancy.category}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{discrepancy.explanation}</p>
        {discrepancy.isBlocking && (
          <motion.span
            className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-mono bg-red-900/30 text-red-300 rounded border border-red-600/30"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            BLOQUEANTE
          </motion.span>
        )}
      </div>
      {isFound && (
        <motion.div
          className="flex-shrink-0 text-green-400"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
        >
          <CheckCircle className="w-5 h-5" />
        </motion.div>
      )}
    </motion.div>
  )
}

export function FeedbackModal({ ticket, onClose, onNext }: FeedbackModalProps) {
  if (!ticket.isOpen) return null

  const { isCorrect, pointsEarned, livesLost, message, discrepancies, caseTitle } = ticket

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
      >
        <motion.div
          className={`relative w-full max-w-md bg-slate-900 rounded-2xl border-2 overflow-hidden ${
            isCorrect ? 'border-green-600/50' : 'border-red-600/50'
          } shadow-2xl`}
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isCorrect ? 'bg-green-900/30 border-green-600/30' : 'bg-red-900/30 border-red-600/30'
          }`}>
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-2 rounded-xl ${
                  isCorrect ? 'bg-green-900/40' : 'bg-red-900/40'
                }`}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
              >
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </motion.div>
              <div>
                <h2 id="feedback-title" className="text-lg font-bold text-slate-100">
                  {isCorrect ? 'SUCESSO' : 'VIOLAÇÃO DETECTADA'}
                </h2>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                  {caseTitle}
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label="Fechar"
            >
              <ChevronRight className="w-5 h-5 rotate-90" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
            {/* Result message */}
            <motion.div
              className={`p-4 rounded-xl border ${
                isCorrect
                  ? 'bg-green-900/20 border-green-600/30 text-green-300'
                  : 'bg-red-900/20 border-red-600/30 text-red-300'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">{message}</p>
            </motion.div>

            {/* Score/Lives change */}
            <motion.div
              className="flex items-center justify-around gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-center">
                <Award className={`w-5 h-5 ${pointsEarned > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
                <div>
                  <p className={`text-lg font-bold font-mono tabular-nums ${
                    pointsEarned > 0 ? 'text-amber-300' : 'text-slate-400'
                  }`}>
                    {pointsEarned > 0 ? `+${pointsEarned}` : '+0'}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase">Pontos</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="flex items-center gap-2 text-center">
                <Heart className={`w-5 h-5 ${livesLost > 0 ? 'text-red-400' : 'text-slate-500'}`} />
                <div>
                  <p className={`text-lg font-bold font-mono tabular-nums ${
                    livesLost > 0 ? 'text-red-300' : 'text-slate-400'
                  }`}>
                    {livesLost > 0 ? `-${livesLost}` : '0'}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase">Vidas</p>
                </div>
              </div>
            </motion.div>

            {/* Discrepancies */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Discrepâncias do Caso
              </h3>
              <div className="space-y-2">
                {discrepancies.map((disc: Discrepancy) => (
                  <DiscrepancyItem
                    key={disc.id}
                    discrepancy={disc}
                    isFound={disc.isBlocking && !isCorrect} // Se barrou, encontrou as blocking
                  />
                ))}
              </div>
            </motion.div>

            {/* Educational tip highlight */}
            <motion.div
              className="p-3 bg-slate-800/50 rounded-xl border border-slate-700"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <span className="flex-shrink-0 mt-0.5 w-5 h-5 text-amber-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx={12} cy={12} r={10} />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </span>
                <span>
                  <span className="font-medium text-amber-300">Dica: </span>
                  {isCorrect
                    ? 'Continue verificando domínio, remetente e links antes de aprovar.'
                    : 'Sempre passe o mouse sobre links para ver a URL real. Domínios .tk, .ml, .xyz, .ga são suspeitos.'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Next button */}
          <motion.button
            onClick={onNext}
            className="w-full mx-4 mb-4 py-3 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-200 ${
              isCorrect
                ? 'bg-green-600 hover:bg-green-500 text-slate-100 border border-green-500'
                : 'bg-red-600 hover:bg-red-500 text-slate-100 border border-red-500'
            }"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Próximo Viajante
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}