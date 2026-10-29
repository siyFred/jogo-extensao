import { useState } from 'react'
import { ClipboardList, Search, Sparkles, FileText, Mail, QrCode, BadgeCheck } from 'lucide-react'
import { DocumentCard } from './DocumentCard'
import type { TravelerCase, DocumentField } from '../../types/game'

interface InspectionDeskProps {
  currentCase: TravelerCase | null
  xrayActive: boolean
  onFieldInspect?: (field: DocumentField) => void
}

const documentTabIcons: Record<string, React.ComponentType<{ className?: string }>> = {
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

function getDocumentTabIcon(type: string) {
  return documentTabIcons[type] ?? documentTabIcons['default']
}

function getTabLabel(type: string): string {
  if (type.includes('Crachá') || type.includes('Identidade')) return '🪪 Identidade'
  if (type.includes('E-mail') || type.includes('SMS')) return '✉️ Mensagem'
  if (type.includes('QR')) return '📱 QR Code'
  if (type.includes('Página Web') || type.includes('Print')) return '🌐 Web'
  if (type.includes('Ordem') || type.includes('Compra')) return '📋 Ordem'
  return '📄 Documento'
}

export function InspectionDesk({ currentCase, xrayActive, onFieldInspect }: InspectionDeskProps) {
  if (!currentCase) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900/30">
        <ClipboardList className="w-10 h-10 text-slate-700 mb-2" />
        <p className="text-slate-500 text-sm">Nenhum documento para inspecionar</p>
        <p className="text-slate-600 text-xs mt-1">Aguardando viajante...</p>
      </div>
    )
  }

  const documents = currentCase.documents
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  // Ensure active tab is valid when documents change
  if (activeTabIndex >= documents.length) {
    setActiveTabIndex(0)
  }

  const activeDocument = documents[activeTabIndex]

  return (
    <div className="h-full w-full flex flex-col bg-slate-900/20">
      {/* X-Ray indicator at top */}
      {xrayActive && (
        <div className="flex justify-end p-2 pr-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-900/40 border border-amber-600/50 rounded-lg backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider">Raio-X Ativo</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>
      )}

      {/* Document Tabs - only show if more than 1 document */}
      {documents.length > 1 && (
        <div className="flex gap-1 px-2 pb-2 border-b border-slate-800 bg-slate-900/30 flex-shrink-0 overflow-x-auto no-scrollbar">
          {documents.map((doc, index) => {
            const Icon = getDocumentTabIcon(doc.type)
            const label = getTabLabel(doc.type)
            const isActive = index === activeTabIndex
            return (
              <button
                key={doc.id}
                onClick={() => setActiveTabIndex(index)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-slate-100 border-b-2 border-amber-500 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
                aria-selected={isActive}
                aria-label={`Ver ${doc.type}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Active Document Card - fills remaining space */}
      <div className="flex-1 min-h-0 p-2 relative">
        {activeDocument ? (
          <DocumentCard
            document={activeDocument}
            xrayActive={xrayActive}
            onFieldClick={onFieldInspect}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            <p className="text-xs">Selecione um documento</p>
          </div>
        )}
      </div>
    </div>
  )
}