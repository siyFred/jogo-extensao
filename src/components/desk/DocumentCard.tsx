import { motion, HTMLMotionProps } from 'framer-motion'
import { Eye, EyeOff, Search, FileText, Mail, QrCode, CreditCard, BadgeCheck, Lock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
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
        className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
        layout
      >
        <div className="flex items-center gap-2 text-slate-500">
          <EyeOff className="w-4 h-4" />
          <span className="text-sm font-mono text-slate-400">{field.label}</span>
          <span className="text-xs text-slate-600 uppercase">oculto</span>
          <motion.span
            className="ml-auto px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400"
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

  const displayValue = field.type === 'url' && field.value.length > 50
    ? field.value.substring(0, 50) + '...'
    : field.value

  return (
    <motion.div
      className={`px-3 py-2 rounded-lg border transition-colors ${
        xrayActive && !field.visible
          ? 'bg-amber-900/30 border-amber-600/50'
          : 'bg-slate-800/50 border-slate-700'
      }`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{field.label}</span>
            {xrayActive && !field.visible && (
              <motion.span
                className="px-1.5 py-0.5 bg-amber-600/30 text-amber-300 rounded text-xs font-mono"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                REVELADO
              </motion.span>
            )}
            {isSuspicious && (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm break-all ${
              isSuspicious ? 'text-amber-300' : 'text-slate-100'
            }`}>
              {displayValue}
            </span>
            {field.type === 'url' && field.value.length > 50 && (
              <span className="text-xs text-slate-500 flex-shrink-0">(truncado)</span>
            )}
          </div>

          {field.suspiciousHint && (xrayActive || isSuspicious) && (
            <motion.p
              className="mt-1.5 text-xs text-amber-300/90 flex items-center gap-1"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
            >
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              {field.suspiciousHint}
            </motion.p>
          )}
        </div>

        {onClick && (
          <motion.button
            onClick={onClick}
            className="p-1.5 text-slate-500 hover:text-slate-200 rounded transition-colors flex-shrink-0"
            whileTap={{ scale: 0.9 }}
            aria-label={`Inspecionar ${field.label}`}
          >
            <Search className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export function DocumentCard({ document, xrayActive, onFieldClick, index }: DocumentCardProps) {
  const Icon = getDocumentIcon(document.type)
  const visibleFields = document.fields.filter((f) => f.visible || xrayActive)
  const hiddenCount = document.fields.filter((f) => !f.visible).length
  const revealedHiddenCount = document.fields.filter((f) => !f.visible && xrayActive).length

  // Calculate drag constraints based on viewport
  const constraints = {
    top: -100,
    bottom: 100,
    left: -150,
    right: 150,
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
      initial={{ opacity: 0, y: 30, rotate: (index % 2 === 0 ? -3 : 3) }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: 0.1 * index, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.01, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}
      whileDrag={{ scale: 1.02, rotate: 0, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)', zIndex: 999 }}
    >
      {/* Document Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700/50 bg-slate-900/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-slate-100">{document.type}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {hiddenCount > 0 && (
            <motion.div
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${
                xrayActive && revealedHiddenCount > 0
                  ? 'bg-amber-900/30 text-amber-300 border border-amber-600/30'
                  : 'bg-slate-700/50 text-slate-500'
              }`}
              layout
            >
              <Eye className="w-3 h-3" />
              <span>{revealedHiddenCount}/{hiddenCount}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Document Fields */}
      <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
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
            className="pt-2 border-t border-amber-600/30"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
          >
            <div className="flex items-center gap-2 mb-2 text-amber-300 text-xs font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>CAMPOS OCULTOS (Raio-X)</span>
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