import { motion } from 'framer-motion'
import { Check, X, Eye, BookOpen } from 'lucide-react'
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
  const tools: Array<{ id: ToolType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'xray', label: 'Raio-X', icon: Eye },
    { id: 'manual', label: 'Manual', icon: BookOpen },
  ]

  return (
    <motion.footer
      className="flex flex-col items-center gap-2 p-2.5 bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 flex-shrink-0 max-h-[20dvh]"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      {/* Tools Row - compact */}
      <div className="flex items-center gap-2 w-full max-w-sm justify-center">
        {tools.map(({ id, label, icon: Icon }) => {
          const active = isToolActive(id)
          return (
            <motion.button
              key={id}
              onClick={() => !disabled && onToggleTool(id)}
              disabled={disabled || showFeedback}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                active
                  ? 'bg-amber-900/40 border-amber-600/50 text-amber-300 shadow-lg shadow-amber-600/10'
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-700/50'
              } ${disabled || showFeedback ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              aria-pressed={active}
              aria-label={label}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
              
              {active && (
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Stamp Buttons - larger touch targets */}
      <div className="flex items-center gap-3 w-full max-w-sm">
        {/* DENY - Red */}
        <motion.button
          onClick={() => !disabled && !showFeedback && onDeny()}
          disabled={disabled || showFeedback}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-900/30 border-2 border-red-600/50 text-red-300 hover:bg-red-900/50 hover:border-red-500 hover:text-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <X className="w-5 h-5" strokeWidth={3} />
          <span className="text-base font-bold uppercase tracking-wider">BARRAR</span>
        </motion.button>

        {/* APPROVE - Green */}
        <motion.button
          onClick={() => !disabled && !showFeedback && onApprove()}
          disabled={disabled || showFeedback}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-900/30 border-2 border-green-600/50 text-green-300 hover:bg-green-900/50 hover:border-green-500 hover:text-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
        >
          <Check className="w-5 h-5" strokeWidth={3} />
          <span className="text-base font-bold uppercase tracking-wider">APROVAR</span>
        </motion.button>
      </div>
    </motion.footer>
  )
}