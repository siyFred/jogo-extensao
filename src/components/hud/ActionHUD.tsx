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

  const renderTool = ({ id, label, icon: Icon }: (typeof tools)[number]) => {
    const active = isToolActive(id)
    return (
      <button
        key={id}
        onClick={() => !disabled && onToggleTool(id)}
        disabled={disabled || showFeedback}
        className={`relative flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-xl border transition-all duration-200 touch-manipulation ${
          active
            ? 'bg-amber-900/40 border-amber-600/50 text-amber-300'
            : 'bg-slate-800/50 border-slate-700 text-slate-300 active:bg-slate-700/50'
        } ${disabled || showFeedback ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-pressed={active}
        aria-label={label}
      >
        <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : ''}`} />
        <span className="text-[10px] font-medium leading-none">{label}</span>
        {active && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />}
      </button>
    )
  }

  return (
    <div className="w-full flex items-stretch gap-2 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-slate-900/90 backdrop-blur-sm border-t border-slate-800">
      {/* Ferramenta (esquerda): Raio-X */}
      {tools.slice(0, 1).map((t) => renderTool(t))}

      {/* DENY - Red */}
      <button
        onClick={() => !disabled && !showFeedback && onDeny()}
        disabled={disabled || showFeedback}
        className="flex-1 flex items-center justify-center gap-1.5 h-12 rounded-xl bg-red-900/30 border-2 border-red-600/50 text-red-300 active:bg-red-900/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] touch-manipulation"
      >
        <X className="w-5 h-5" strokeWidth={3} />
        <span className="text-sm font-bold uppercase tracking-wider">Barrar</span>
      </button>

      {/* APPROVE - Green */}
      <button
        onClick={() => !disabled && !showFeedback && onApprove()}
        disabled={disabled || showFeedback}
        className="flex-1 flex items-center justify-center gap-1.5 h-12 rounded-xl bg-green-900/30 border-2 border-green-600/50 text-green-300 active:bg-green-900/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] touch-manipulation"
      >
        <Check className="w-5 h-5" strokeWidth={3} />
        <span className="text-sm font-bold uppercase tracking-wider">Aprovar</span>
      </button>

      {/* Ferramenta (direita): Manual */}
      {tools.slice(1).map((t) => renderTool(t))}
    </div>
  )
}
