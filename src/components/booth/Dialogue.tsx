import { MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

interface DialogueProps {
  text: string
  travelerName: string
  isTyping?: boolean
}

export function Dialogue({ text, travelerName, isTyping = false }: DialogueProps) {
  return (
    <motion.div
      className="relative mx-3 mt-2 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700 max-h-[120px] overflow-hidden"
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      {/* Speaker indicator */}
      <div className="flex items-center gap-1.5 mb-1">
        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs font-medium text-slate-300 truncate">{travelerName}</span>
        <span className="text-[10px] text-slate-500 font-mono">diz:</span>
      </div>

      {/* Speech bubble */}
      <div className="relative">
        <motion.p
          className="text-slate-100 text-xs leading-snug whitespace-pre-line line-clamp-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: isTyping ? 0.6 : 0.2, delay: 0.3 }}
        >
          {text}
        </motion.p>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            className="flex items-center gap-1 mt-1.5 text-slate-500"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-xs">Digitando</span>
            <span className="w-1 h-1 bg-slate-500 rounded-full" />
            <span className="w-1 h-1 bg-slate-500 rounded-full" style={{ animationDelay: '0.2s' }} />
            <span className="w-1 h-1 bg-slate-500 rounded-full" style={{ animationDelay: '0.4s' }} />
          </motion.div>
        )}
      </div>

      {/* Arrow pointer */}
      <div className="absolute -bottom-1.5 left-5 w-0 h-0 border-3 border-transparent border-t-slate-800" />
    </motion.div>
  )
}