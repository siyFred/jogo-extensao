import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Shield, BookOpen, Search, Eye } from 'lucide-react'
import type { ManualRule, ThreatCategory } from '../../types/game'

interface ManualModalProps {
  isOpen: boolean
  onClose: () => void
  rules: ManualRule[]
  activeCategory?: ThreatCategory
}

const categoryConfig: Record<ThreatCategory, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  phishing: { label: 'Phishing', icon: Shield, color: 'text-red-400 bg-red-900/30 border-red-600/30' },
  malware: { label: 'Malware', icon: Search, color: 'text-orange-400 bg-orange-900/30 border-orange-600/30' },
  social_engineering: { label: 'Eng. Social', icon: Eye, color: 'text-amber-400 bg-amber-900/30 border-amber-600/30' },
  data_leak: { label: 'Vazamento', icon: BookOpen, color: 'text-blue-400 bg-blue-900/30 border-blue-600/30' },
  impersonation: { label: 'Impersonação', icon: Shield, color: 'text-purple-400 bg-purple-900/30 border-purple-600/30' },
  suspicious_link: { label: 'Links Suspeitos', icon: Search, color: 'text-green-400 bg-green-900/30 border-green-600/30' },
  fake_identity: { label: 'Identidade Falsa', icon: Shield, color: 'text-pink-400 bg-pink-900/30 border-pink-600/30' },
  none: { label: 'Geral', icon: BookOpen, color: 'text-slate-400 bg-slate-800/50 border-slate-700' },
}

function CategoryTab({ 
  category, 
  isActive, 
  onClick,
  count,
}: { 
  category: ThreatCategory; 
  isActive: boolean; 
  onClick: () => void;
  count: number;
}) {
  const config = categoryConfig[category]
  const Icon = config.icon

  return (
    <motion.button
      onClick={onClick}
      aria-pressed={isActive}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? `${config.color} shadow-lg ring-1 ring-current`
          : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 border border-slate-700'
      }`}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Icon className="w-4 h-4" />
      <span>{config.label}</span>
      <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
        isActive ? 'bg-white/20 text-current' : 'bg-slate-900/50 text-slate-500'
      }`}>
        {count}
      </span>
    </motion.button>
  )
}

export function ManualModal({ isOpen, onClose, rules, activeCategory: initialCategory }: ManualModalProps) {
  const [activeCategory, setActiveCategory] = useState<ThreatCategory | undefined>(initialCategory)

  const categories: ThreatCategory[] = [
    'phishing',
    'suspicious_link',
    'social_engineering',
    'malware',
    'impersonation',
    'data_leak',
    'fake_identity',
    'none',
  ]

  const filteredRules = activeCategory
    ? rules.filter((r) => r.category === activeCategory)
    : rules

  const categoryCounts = categories
    .map((cat) => ({
      category: cat,
      count: rules.filter((r) => r.category === cat).length,
    }))
    .filter(({ count }) => count > 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="manual-title"
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-xl bg-amber-900/30 border border-amber-600/30"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <BookOpen className="w-6 h-6 text-amber-400" />
                </motion.div>
                <h2 id="manual-title" className="text-lg font-bold text-slate-100">Manual de Segurança</h2>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
                whileTap={{ scale: 0.9 }}
                whileHover={{ rotate: 90 }}
                aria-label="Fechar manual"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Category Tabs */}
            <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/30 backdrop-blur-sm sticky top-12 z-10">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {categoryCounts.map(({ category, count }) => (
                  <CategoryTab
                    key={category}
                    category={category}
                    isActive={activeCategory === category}
                    onClick={() => setActiveCategory(activeCategory === category ? undefined : category)}
                    count={count}
                  />
                ))}
                <motion.button
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    !activeCategory
                      ? 'bg-slate-200 text-slate-900 border-slate-200 shadow-lg'
                      : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 border-slate-700'
                  }`}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCategory(undefined)}
                  aria-pressed={!activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span>Todas</span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${!activeCategory ? 'bg-slate-900/15 text-slate-700' : 'bg-slate-900/50 text-slate-500'}`}>
                    {rules.length}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Rules List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
              {filteredRules.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-12 text-center text-slate-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <BookOpen className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-lg font-medium">Nenhuma regra nesta categoria</p>
                  <p className="text-sm mt-1">Selecione outra aba ou continue jogando para desbloquear mais regras.</p>
                </motion.div>
              ) : (
                filteredRules.map((rule, index) => (
                  <motion.div
                    key={rule.id}
                    className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                      activeCategory
                        ? `${categoryConfig[rule.category].color}`
                        : 'bg-slate-800/50 border-slate-700/50 hover:border-amber-600/30'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    layout
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-900/30 border border-amber-600/30 flex items-center justify-center">
                        <span className="text-sm font-mono text-amber-300 font-bold">{rule.priority}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-slate-100">{rule.title}</h3>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-900/30 text-amber-300 border border-amber-600/30">
                            Dia {rule.unlockedDay}
                          </span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${categoryConfig[rule.category].color}`}>
                            {categoryConfig[rule.category].label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed mb-3">{rule.description}</p>
                        
                        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                          <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-400">
                            <Search className="w-3.5 h-3.5" />
                            <span className="font-mono">Exemplo:</span>
                          </div>
                          <p className="text-xs font-mono text-slate-300 whitespace-pre-line bg-slate-900/30 p-2 rounded border border-slate-700/50">
                            {rule.example}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expandable hint */}
                    <motion.div
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: 10 }}
                      animate={{ x: 0 }}
                    >
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </motion.div>
                  </motion.div>
                ))
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}