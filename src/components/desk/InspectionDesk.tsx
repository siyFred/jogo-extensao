import { motion } from 'framer-motion'
import { ClipboardList, Search, Sparkles } from 'lucide-react'
import { DocumentCard } from './DocumentCard'
import type { TravelerCase, DocumentField } from '../../types/game'

interface InspectionDeskProps {
  currentCase: TravelerCase | null
  xrayActive: boolean
  onFieldInspect?: (field: DocumentField) => void
}

export function InspectionDesk({ currentCase, xrayActive, onFieldInspect }: InspectionDeskProps) {
  if (!currentCase) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-full w-full bg-slate-900/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ClipboardList className="w-12 h-12 text-slate-700 mb-3" />
        <p className="text-slate-500 text-base">Nenhum documento para inspecionar</p>
        <p className="text-slate-600 text-xs mt-1">Aguardando viajante...</p>
      </motion.div>
    )
  }

  const documents = currentCase.documents

  return (
    <motion.section
      className="flex flex-1 min-h-0 w-full overflow-hidden relative"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Desk surface */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/10 to-slate-900/30" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="deskGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#deskGrid)" />
        </svg>
      </div>

      {/* X-Ray overlay indicator */}
      {xrayActive && (
        <motion.div
          className="absolute top-2 right-2 z-20 flex items-center gap-1.5 px-2 py-1 bg-amber-900/40 border border-amber-600/50 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-amber-400 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider">Raio-X</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </motion.div>
      )}

      {/* Documents area - no scroll, fills available space */}
      <div className="relative z-10 h-full w-full p-2 overflow-hidden">
        <motion.div
          className="flex flex-col gap-2.5 max-w-sm mx-auto w-full h-full"
          layout
        >
          {documents.map((doc, i) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              xrayActive={xrayActive}
              onFieldClick={onFieldInspect}
              index={i}
            />
          ))}

          {/* Empty state hint */}
          {documents.length === 0 && (
            <motion.div className="flex-1 flex flex-col items-center justify-center text-slate-600">
              <Search className="w-8 h-8 mx-auto mb-1.5 opacity-30" />
              <p className="text-xs">Arraste para inspecionar</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Drop zone hint - only show when not too cramped */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-slate-600/50 text-[10px] font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <kbd className="px-1.5 py-0.5 bg-slate-800/50 rounded border border-slate-700">Arrastar</kbd>
        <span>para reposicionar</span>
      </motion.div>
    </motion.section>
  )
}