import { MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar } from './Avatar'

interface DialogueProps {
  text: string
  travelerName: string
  avatarId: string
  isTyping?: boolean
}

/** Painel do viajante (avatar + fala completa), exibido como uma aba. */
export function Dialogue({ text, travelerName, avatarId, isTyping = false }: DialogueProps) {
  return (
    <div className="h-full w-full overflow-y-auto no-scrollbar bg-slate-900 border border-slate-800 rounded-xl p-3">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <Avatar avatarId={avatarId} type={isTyping ? 'loading' : 'traveler'} />
          <span className="text-[11px] font-medium text-slate-200 max-w-[72px] text-center leading-tight">
            {travelerName}
          </span>
        </div>

        <motion.div
          className="flex-1 min-w-0 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700"
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-300 truncate">{travelerName}</span>
            <span className="text-[10px] text-slate-500 font-mono">diz:</span>
          </div>
          <p className="text-slate-100 text-sm leading-snug whitespace-pre-line">{text}</p>
        </motion.div>
      </div>
    </div>
  )
}
