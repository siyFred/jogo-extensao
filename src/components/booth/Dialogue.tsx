import { MessageSquare, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface DialogueProps {
  text: string
  travelerName: string
  isTyping?: boolean
}

export function Dialogue({ text, travelerName, isTyping = false }: DialogueProps) {
  return (
    <motion.div
      className="relative mx-4 mt-4 px-4 py-3 bg-slate-800/60 rounded-xl border border-slate-700"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Speaker indicator */}
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-300">{travelerName}</span>
        <span className="text-xs text-slate-500 font-mono">diz:</span>
      </div>

      {/* Speech bubble */}
      <div className="relative">
        <motion.p
          className="text-slate-100 text-base leading-relaxed whitespace-pre-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: isTyping ? 0.8 : 0.3, delay: 0.4 }}
        >
          {text}
        </motion.p>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            className="flex items-center gap-1 mt-2 text-slate-500"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-sm">Digitando</span>
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" style={{ animationDelay: '0.4s' }} />
          </motion.div>
        )}
      </div>

      {/* Arrow pointer */}
      <div className="absolute -bottom-2 left-6 w-0 h-0 border-4 border-transparent border-t-slate-800" />
    </motion.div>
  )
}