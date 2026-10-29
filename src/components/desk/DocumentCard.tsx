import { Eye, EyeOff, Search, FileText, Mail, QrCode, BadgeCheck, Lock, AlertTriangle } from 'lucide-react'
import type { Document, DocumentField } from '../../types/game'

interface DocumentCardProps {
  document: Document
  xrayActive: boolean
  onFieldClick?: (field: DocumentField) => void
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
      <div className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2 text-slate-500">
          <EyeOff className="w-4 h-4" />
          <span className="text-xs font-mono text-slate-400">{field.label}</span>
          <span className="text-[10px] text-slate-600 uppercase">oculto</span>
          <span className="ml-auto px-2 py-0.5 bg-slate-700/50 rounded text-[10px] text-slate-400">
            Requer Raio-X
          </span>
        </div>
      </div>
    )
  }

  const displayValue = field.type === 'url' && field.value.length > 50
    ? field.value.substring(0, 50) + '...'
    : field.value

  return (
    <div className={`px-3 py-2 rounded-lg border transition-colors ${
      xrayActive && !field.visible
        ? 'bg-amber-900/30 border-amber-600/50'
        : 'bg-slate-800/50 border-slate-700'
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{field.label}</span>
            {xrayActive && !field.visible && (
              <span className="px-1.5 py-0.5 bg-amber-600/30 text-amber-300 rounded text-[10px] font-mono">
                REVELADO
              </span>
            )}
            {isSuspicious && (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-mono text-sm break-all ${
              isSuspicious ? 'text-amber-300' : 'text-slate-100'
            }`}>
              {displayValue}
            </span>
            {field.type === 'url' && field.value.length > 50 && (
              <span className="text-[10px] text-slate-500 flex-shrink-0">(truncado)</span>
            )}
          </div>

          {field.suspiciousHint && (xrayActive || isSuspicious) && (
            <p className="mt-1.5 text-xs text-amber-300/90 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              {field.suspiciousHint}
            </p>
          )}
        </div>

        {onClick && (
          <button
            onClick={onClick}
            className="p-1.5 text-slate-500 hover:text-slate-200 rounded transition-colors flex-shrink-0"
            aria-label={`Inspecionar ${field.label}`}
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export function DocumentCard({ document, xrayActive, onFieldClick }: DocumentCardProps) {
  const Icon = getDocumentIcon(document.type)
  const hiddenCount = document.fields.filter((f) => !f.visible).length
  const revealedHiddenCount = document.fields.filter((f) => !f.visible && xrayActive).length

  return (
    <div className={`h-full w-full bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden ${
      xrayActive && revealedHiddenCount > 0 ? 'ring-2 ring-amber-500/50' : ''
    }`}>
      {/* Document Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700/50 bg-slate-900/50 rounded-t-xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-sm text-slate-100">{document.type}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {hiddenCount > 0 && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${
              xrayActive && revealedHiddenCount > 0
                ? 'bg-amber-900/30 text-amber-300 border border-amber-600/30'
                : 'bg-slate-700/50 text-slate-500'
            }`}>
              <Eye className="w-3 h-3" />
              <span>{revealedHiddenCount}/{hiddenCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Document Fields - scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-3 space-y-2">
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
          <div className="pt-2 border-t border-amber-600/30">
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
          </div>
        )}
      </div>
    </div>
  )
}