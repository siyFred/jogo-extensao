import { motion } from 'framer-motion'
import { Eye, EyeOff, Search, FileText, Mail, QrCode, BadgeCheck, Lock, AlertTriangle } from 'lucide-react'
import type { Document, DocumentField } from '../../types/game'

interface DocumentCardProps {
  document: Document
  xrayActive: boolean
  onFieldClick?: (field: DocumentField) => void
  index: number
}

const documentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'E-mail': Mail,
  'E-mail Recebido': Mail,
  'E-mail Interno': Mail,
  'Mensagem SMS': Mail,
  'Print da Página Web': Search,
  'Análise do QR Code': QrCode,
  'Crachá': BadgeCheck,
  'Crachá Funcional': BadgeCheck,
  'Documento de Identidade': BadgeCheck,
  'Ordem de Compra': FileText,
  'default': FileText,
}

function getDocumentIcon(type: string) {
  return documentIcons[type] ?? documentIcons['default']
}

function FieldRow({ field, xrayActive, onClick }: { field: DocumentField; xrayActive: boolean; onClick?: () => void }) {
  const isHidden = !field.visible && !xrayActive
  const isSuspicious = field.validation === 'suspicious' || field.validation === 'invalid'
  
  if (isHidden && !xrayActive) {
    return (
      <motion.div
        className="px-2.5 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700"
        layout
      >
        <div className="flex items-center gap-1.5 text-slate-500">
          <EyeOff className="w-3.5 h-3.5" />
          <span className="text-xs font-mono text-slate-400">{field.label}</span>
          <span className="text-[10px] text-slate-600 uppercase">oculto</span>
          <motion.span
            className="ml-auto px-1.5 py-0.5 bg-slate-700/50 rounded text-[10px] text-slate-400"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            Raio-X
          </motion.span>
        </div>
      </motion.div>
    )
  }

  const displayValue = field.type === 'url' && field.value.length > 45
    ? field.value.substring(0, 45) + '...'
    : field.value

  return (
    <motion.div
      className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
        xrayActive && !field.visible
          ? 'bg-amber-900/30 border-amber-600/50'
          : 'bg-slate-800/50 border-slate-700'
      }`}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 }}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{field.label}</span>
            {xrayActive && !field.visible && (
              <motion.span
                className="px-1 py-0.5 bg-amber-600/30 text-amber-300 rounded text-[10px] font-mono"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                REVELADO
              </motion.span>
            )}
            {isSuspicious && (
              <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className={`font-mono text-xs break-all ${
              isSuspicious ? 'text-amber-300' : 'text-slate-100'
            }`}>
              {displayValue}
            </span>
            {field.type === 'url' && field.value.length > 45 && (
              <span className="text-[10px] text-slate-500 flex-shrink-0">(truncado)</span>
            )}
          </div>

          {field.suspiciousHint && (xrayActive || isSuspicious) && (
            <motion.p
              className="mt-1 text-[10px] text-amber-300/90 flex items-center gap-0.5"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
            >
              <AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" />
              {field.suspiciousHint}
            </motion.p>
          )}
        </div>

        {onClick && (
          <motion.button
            onClick={onClick}
            className="p-1 text-slate-500 hover:text-slate-200 rounded transition-colors flex-shrink-0"
            whileTap={{ scale: 0.9 }}
            aria-label={`Inspecionar ${field.label}`}
          >
            <Search className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export function DocumentCard({ document, xrayActive, onFieldClick, index }: DocumentCardProps) {
  const Icon = getDocumentIcon(document.type)
  const hiddenCount = document.fields.filter((f) => !f.visible).length
  const revealedHiddenCount = document.fields.filter((f) => !f.visible && xrayActive).length

  // Staggered initial positions for stacking effect
  const initialRotate = (index % 2 === 0 ? -2 : 2)
  const initialY = 20 + index * 8
  const initialX = (index % 2 === 0 ? -15 : 15)

  // Calculate drag constraints based on viewport
  const constraints = {
    top: -80,
    bottom: 80,
    left: -120,
    right: 120,
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={constraints}
      className={`relative w-full max-w-sm bg-slate-800/60 rounded-xl border border-slate-700/50 shadow-xl transition-all duration-300 ${
        xrayActive && revealedHiddenCount > 0 ? 'ring-2 ring-amber-500/50' : ''
      }`}
      style={{ zIndex: 10 + index }}
      initial={{ opacity: 0, y: initialY, x: initialX, rotate: initialRotate }}
      animate={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
      transition={{ delay: 0.08 * index, type: 'spring', stiffness: 120 }}
      whileHover={{ scale: 1.01, boxShadow: '0 15px 30px -8px rgba(0,0,0,0.5)' }}
      whileDrag={{ scale: 1.02, rotate: 0, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)', zIndex: 999 }}
    >
      {/* Document Header */}
      <div className="flex items-center justify-between p-2 border-b border-slate-700/50 bg-slate-900/30 rounded-t-xl">
        <div className="flex items-center gap-1.5">
          <Icon className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-xs text-slate-100">{document.type}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {hiddenCount > 0 && (
            <motion.div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                xrayActive && revealedHiddenCount > 0
                  ? 'bg-amber-900/30 text-amber-300 border border-amber-600/30'
                  : 'bg-slate-700/50 text-slate-500'
              }`}
              layout
            >
              <Eye className="w-2.5 h-2.5" />
              <span>{revealedHiddenCount}/{hiddenCount}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Document Fields - no internal scroll, let parent handle */}
      <div className="p-2.5 space-y-1.5">
        {document.fields.map((field) => (
          <FieldRow
            key={field.id}
            field={field}
            xrayActive={xrayActive}
            onClick={() => onFieldClick?.(field)}
          />
        ))}

        {/* Hidden fields section when X-Ray is active */}
        {xrayActive && document.hiddenFields && document.hiddenFields.length > 0 && (
          <motion.div
            className="pt-1.5 border-t border-amber-600/30"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
          >
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 text-[10px] font-mono">
              <Lock className="w-3 h-3" />
              <span>CAMPOS OCULTOS</span>
            </div>
            {document.hiddenFields.map((field) => (
              <FieldRow
                key={field.id}
                field={{ ...field, visible: true }}
                xrayActive={true}
                onClick={() => onFieldClick?.(field)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}