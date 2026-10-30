import { useState } from 'react'
import { ClipboardList, Search, Sparkles, FileText, Mail, QrCode, BadgeCheck, MessageSquare } from 'lucide-react'
import { DocumentCard } from './DocumentCard'
import { Dialogue } from '../booth/Dialogue'
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
  if (type.includes('Crachá') || type.includes('Identidade')) return 'Identidade'
  if (type.includes('E-mail') || type.includes('SMS')) return 'Mensagem'
  if (type.includes('QR')) return 'QR Code'
  if (type.includes('Página Web') || type.includes('Print')) return 'Web'
  if (type.includes('Ordem') || type.includes('Compra')) return 'Ordem'
  return 'Documento'
}

const DIALOGUE_TAB = -1

function EmptyDesk() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900/30">
      <ClipboardList className="w-10 h-10 text-slate-700 mb-2" />
      <p className="text-slate-500 text-sm">Nenhum documento para inspecionar</p>
      <p className="text-slate-600 text-xs mt-1">Aguardando viajante...</p>
    </div>
  )
}

/**
 * Mesa de inspeção em modelo de abas: uma aba "Fala" (viajante) + uma por documento.
 * Apenas uma visão fica ativa por vez, ocupando toda a área central.
 */
export function InspectionDesk({ currentCase, xrayActive, onFieldInspect }: InspectionDeskProps) {
  const [activeTab, setActiveTab] = useState<number>(DIALOGUE_TAB)

  if (!currentCase) return <EmptyDesk />

  const documents = currentCase.documents
  const activeIndex = activeTab >= documents.length ? DIALOGUE_TAB : activeTab
  const activeDocument = activeIndex === DIALOGUE_TAB ? null : documents[activeIndex]

  const tabClass = (isActive: boolean) =>
    `flex items-center justify-center gap-1.5 px-3 h-9 min-w-[44px] rounded-t-lg text-xs font-medium whitespace-nowrap flex-shrink-0 border-b-2 transition-colors touch-manipulation ${
      isActive
        ? 'bg-slate-900 text-slate-100 border-amber-500'
        : 'text-slate-500 border-transparent active:bg-slate-800/60'
    }`

  return (
    <div className="h-full w-full flex flex-col bg-slate-900/20">
      {/* Mini-abas no topo */}
      <div
        role="tablist"
        className="flex items-end gap-1 px-2 pt-1 border-b border-slate-800 bg-slate-900/30 flex-shrink-0 overflow-x-auto no-scrollbar"
      >
        <button
          role="tab"
          aria-selected={activeIndex === DIALOGUE_TAB}
          onClick={() => setActiveTab(DIALOGUE_TAB)}
          className={tabClass(activeIndex === DIALOGUE_TAB)}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Fala</span>
        </button>
        {documents.map((doc, index) => {
          const Icon = getDocumentTabIcon(doc.type)
          return (
            <button
              key={doc.id}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Ver ${doc.type}`}
              onClick={() => setActiveTab(index)}
              className={tabClass(index === activeIndex)}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{getTabLabel(doc.type)}</span>
            </button>
          )
        })}
        {xrayActive && (
          <div className="ml-auto mb-1 flex items-center gap-1 px-2 py-0.5 bg-amber-900/40 border border-amber-600/50 rounded-md flex-shrink-0">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-amber-300 uppercase">Raio-X</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </div>
        )}
      </div>

      {/* Visão ativa ocupa o centro */}
      <div className="flex-1 min-h-0 p-2">
        {activeDocument ? (
          <DocumentCard document={activeDocument} xrayActive={xrayActive} onFieldClick={onFieldInspect} />
        ) : (
          <Dialogue
            text={currentCase.dialogue}
            travelerName={currentCase.travelerName}
            avatarId={currentCase.avatarId}
          />
        )}
      </div>
    </div>
  )
}
