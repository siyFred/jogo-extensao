import { motion } from 'framer-motion'
import { Check, X, Eye, BookOpen, RotateCcw } from 'lucide-react'
import type { ToolType } from '../../types/game'

interface ActionHUDProps {
  onApprove: () => void
  onDeny: () => void
  onToggleTool: (tool: ToolType) => void
  isToolActive: (tool: ToolType) => boolean
  disabled?: boolean
  showFeedback?: boolean
}

export function ActionHUD({
  onApprove,
  onDeny,
  onToggleTool,
  isToolActive,
  disabled = false,
  showFeedback = false,
}: ActionHUDProps) {
  const tools: Array<{ id: ToolType; label: string; icon: React.ComponentType<{ className?: string }>; shortcut: string }> = [
    { id: 'xray', label: 'Raio-X', icon: Eye, shortcut: 'X' },
    { id: 'manual', label: 'Manual', icon: BookOpen, shortcut: 'M' },
  ]

  return (
    <motion.footer
      className="flex flex-col items-center gap-4 p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 flex-shrink-0"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Tools Row */}
      <div className="flex items-center gap-3 w-full max-w-sm justify-center">
        {tools.map(({ id, label, icon: Icon, shortcut }) => {
          const active = isToolActive(id)
          return (
            <motion.button
              key={id}
              onClick={() => !disabled && onToggleTool(id)}
              disabled={disabled || showFeedback}
              className={`relative flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all duration-200 ${
                active
                  ? 'bg-amber-900/40 border-amber-600/50 text-amber-300 shadow-lg shadow-amber-600/10'
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-700/50'
              } ${disabled || showFeedback ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              aria-pressed={active}
              aria-label={`${label} (${shortcut})`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-amber-400' : ''}`} strokeWidth={2} />
              <span className="text-xs font-medium">{label}</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-900/50 rounded border border-slate-700 text-slate-500">
                {shortcut}
              </kbd>
              
              {active && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          )
        })}

        {/* Reset position button */}
        <motion.button
          onClick={() => {}}
          disabled={disabled || showFeedback}
          className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer"
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          aria-label="Resetar posição dos documentos"
        >
          <RotateCcw className="w-5 h-5" strokeWidth={2} />
          <span className="text-xs font-medium">Resetar</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-900/50 rounded border border-slate-700 text-slate-500">R</kbd>
        </motion.button>
      </div>

      {/* Stamp Buttons */}
      <div className="flex items-center gap-4 w-full max-w-sm">
        {/* DENY - Red */}
        <motion.button
          onClick={() => !disabled && !showFeedback && onDeny()}
          disabled={disabled || showFeedback}
          className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl bg-red-900/30 border-2 border-red-600/50 text-red-300 hover:bg-red-900/50 hover:border-red-500 hover:text-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <X className="w-6 h-6" strokeWidth={3} />
          <span className="text-lg font-bold uppercase tracking-wider">BARRAR</span>
        </motion.button>

        {/* APPROVE - Green */}
        <motion.button
          onClick={() => !disabled && !showFeedback && onApprove()}
          disabled={disabled || showFeedback}
          className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl bg-green-900/30 border-2 border-green-600/50 text-green-300 hover:bg-green-900/50 hover:border-green-500 hover:text-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
        >
          <Check className="w-6 h-6" strokeWidth={3} />
          <span className="text-lg font-bold uppercase tracking-wider">APROVAR</span>
        </motion.button>
      </div>

      {/* Keyboard hints */}
      <div className="flex items-center gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
        <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">←</kbd>
        <span className="text-slate-600">Barrar</span>
        <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">→</kbd>
        <span className="text-slate-600">Aprovar</span>
        <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">X</kbd>
        <span className="text-slate-600">Raio-X</span>
        <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">M</kbd>
        <span className="text-slate-600">Manual</span>
      </div>
    </motion.footer>
  )
}