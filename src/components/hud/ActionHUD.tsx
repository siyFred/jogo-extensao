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
    <div className="h-full w-full flex flex-col bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 flex-shrink-0">
      {/* Tools Row - Top of HUD area */}
      <div className="flex items-center justify-center gap-2 px-3 py-2 flex-shrink-0">
        {tools.map(({ id, label, icon: Icon }) => {
          const active = isToolActive(id)
          return (
            <button
              key={id}
              onClick={() => !disabled && onToggleTool(id)}
              disabled={disabled || showFeedback}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                active
                  ? 'bg-amber-900/40 border-amber-600/50 text-amber-300 shadow-lg shadow-amber-600/10'
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-700/50'
              } ${disabled || showFeedback ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-pressed={active}
              aria-label={label}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
              {active && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              )}
            </button>
          )
        })}
      </div>

      {/* Spacer - pushes stamp buttons to bottom */}
      <div className="flex-1 min-h-0" />

      {/* Stamp Buttons - Fixed at bottom of HUD area */}
      <div className="flex items-center gap-3 px-3 pb-3 pt-1 flex-shrink-0">
        {/* DENY - Red */}
        <button
          onClick={() => !disabled && !showFeedback && onDeny()}
          disabled={disabled || showFeedback}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-900/30 border-2 border-red-600/50 text-red-300 hover:bg-red-900/50 hover:border-red-500 hover:text-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <X className="w-5 h-5" strokeWidth={3} />
          <span className="text-base font-bold uppercase tracking-wider">BARRAR</span>
        </button>

        {/* APPROVE - Green */}
        <button
          onClick={() => !disabled && !showFeedback && onApprove()}
          disabled={disabled || showFeedback}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-900/30 border-2 border-green-600/50 text-green-300 hover:bg-green-900/50 hover:border-green-500 hover:text-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <Check className="w-5 h-5" strokeWidth={3} />
          <span className="text-base font-bold uppercase tracking-wider">APROVAR</span>
        </button>
      </div>
    </div>
  )
}