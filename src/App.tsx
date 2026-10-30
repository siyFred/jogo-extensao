import { useEffect, useCallback, useState, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGameEngine } from './hooks/useGameEngine'
import { MousePointerClick } from 'lucide-react'
import { Booth } from './components/booth/Booth'
import { InspectionDesk } from './components/desk/InspectionDesk'
import { ActionHUD } from './components/hud/ActionHUD'
import { FeedbackModal } from './components/modals/FeedbackModal'
import { DayReportModal } from './components/modals/DayReportModal'
import { GameOverModal } from './components/modals/GameOverModal'
import { ManualModal } from './components/modals/ManualModal'

function App() {
  const {
    gameState,
    currentCase,
    feedbackTicket,
    handleStamp,
    closeFeedback,
    nextCase,
    restartGame,
    toggleTool,
    isToolActive,
  } = useGameEngine()

  const { phase, lives, score, currentDay, unlockedRules } = gameState

  // Fullscreen state for mobile
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false)
  const fullscreenElementRef = useRef<HTMLDivElement>(null)

  // Detect mobile device and check fullscreen support
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      // Show prompt only on mobile devices that support fullscreen
      if (mobile && document.fullscreenEnabled) {
        setShowFullscreenPrompt(true)
      }
    }
    checkMobile()
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreen = document.fullscreenElement === fullscreenElementRef.current
      setIsFullscreen(fullscreen)
      if (fullscreen) {
        setShowFullscreenPrompt(false)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const requestFullscreen = useCallback(async () => {
    try {
      if (fullscreenElementRef.current) {
        await fullscreenElementRef.current.requestFullscreen({
          navigationUI: 'hide' // Hide browser UI on mobile
        })
      }
    } catch (error) {
      console.warn('Fullscreen request failed:', error)
      // If fullscreen fails, hide prompt anyway so user can play
      setShowFullscreenPrompt(false)
    }
  }, [])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    if (feedbackTicket.isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        nextCase()
      }
      return
    }

    switch (e.key.toLowerCase()) {
      case 'arrowleft':
      case 'b':
        e.preventDefault()
        handleStamp('deny')
        break
      case 'arrowright':
      case 'a':
        e.preventDefault()
        handleStamp('approve')
        break
      case 'x':
        e.preventDefault()
        toggleTool('xray')
        break
      case 'm':
        e.preventDefault()
        toggleTool('manual')
        break
    }
  }, [feedbackTicket.isOpen, handleStamp, nextCase, toggleTool])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent context menu on long press for mobile
  useEffect(() => {
    const preventContextMenu = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault()
    }
    document.addEventListener('touchstart', preventContextMenu, { passive: false })
    return () => document.removeEventListener('touchstart', preventContextMenu)
  }, [])

  const handleNextCase = useCallback(() => {
    closeFeedback()
    nextCase()
  }, [closeFeedback, nextCase])

  const handleRestart = useCallback(() => {
    restartGame()
  }, [restartGame])

  const handleMainMenu = useCallback(() => {
    restartGame()
  }, [restartGame])

  const handleContinueDay = useCallback(() => {
    restartGame()
  }, [restartGame])

  return (
    <AnimatePresence mode="wait">
      {/* Mobile Fullscreen Prompt Overlay */}
      {showFullscreenPrompt && !isFullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm text-slate-100"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fullscreen-prompt-title"
        >
          <div className="text-center px-6 max-w-xs">
            <div className="mb-6 flex justify-center">
              <div className="relative w-24 h-24">
                <svg
                  className="absolute inset-0 w-full h-full text-slate-600 animate-pulse"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                <MousePointerClick
                  className="absolute inset-0 w-full h-full text-amber-400 animate-bounce"
                  size={48}
                  aria-hidden="true"
                />
              </div>
            </div>
            <h2 id="fullscreen-prompt-title" className="text-xl md:text-2xl font-bold mb-3 tracking-tight">
              Toque para iniciar em Tela Cheia
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Para a melhor experiência, o jogo entrará em modo tela cheia.
              Isso remove as barras do navegador e usa toda a tela do seu dispositivo.
            </p>
            <button
              onClick={requestFullscreen}
              className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-semibold rounded-lg transition-colors touch-manipulation select-none"
              type="button"
            >
              Entrar em Tela Cheia
            </button>
            <p className="mt-4 text-xs text-slate-500">
              Funciona em retrato ou paisagem.
            </p>
          </div>
        </div>
      )}

      {/* Main Game Content - Flexbox layout without fixed heights */}
      <div
        ref={fullscreenElementRef}
        className={`flex flex-col overflow-hidden bg-slate-950 text-slate-100 touch-manipulation select-none ${
          isFullscreen ? 'h-[100dvh] w-[100dvw] fixed inset-0 z-[50]' : 'h-[100dvh] w-full max-w-md mx-auto'
        }`}
        style={isFullscreen ? { position: 'fixed', top: 0, left: 0 } : undefined}
      >
        {/* === TOPO: status === */}
        {phase === 'playing' && currentCase ? (
          <Booth lives={lives} score={score} currentDay={currentDay} />
        ) : (
          <div className="flex h-10 flex-shrink-0 items-center justify-center bg-slate-950">
            <p className="text-slate-500 text-xs">
              {phase === 'playing' ? 'Carregando próximo viajante...' : 'Aguardando...'}
            </p>
          </div>
        )}

        {/* === CENTRO: abas + documento ativo === */}
        <main className="flex-1 min-h-0 relative">
          {phase === 'playing' && currentCase && (
            <InspectionDesk
              key={currentCase.id}
              currentCase={currentCase}
              xrayActive={isToolActive('xray')}
              onFieldInspect={() => {}}
            />
          )}
          {phase === 'playing' && !currentCase && (
            <div className="flex h-full items-center justify-center bg-slate-950">
              <p className="text-slate-500">Nenhum documento para inspecionar</p>
            </div>
          )}
        </main>

        {/* === BASE: carimbos fixos === */}
        <div className="flex-shrink-0">
          {phase === 'playing' && (
            <ActionHUD
              onApprove={() => handleStamp('approve')}
              onDeny={() => handleStamp('deny')}
              onToggleTool={toggleTool}
              isToolActive={isToolActive}
              disabled={false}
              showFeedback={feedbackTicket.isOpen}
            />
          )}
        </div>

        {/* Modals - rendered on top */}
        <AnimatePresence>
          {feedbackTicket.isOpen && (
            <FeedbackModal
              ticket={feedbackTicket}
              onClose={closeFeedback}
              onNext={handleNextCase}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'day_report' && (
            <DayReportModal
              day={currentDay}
              casesTotal={gameState.completedCases.length}
              casesCorrect={gameState.completedCases.filter((c) => c.correctDecision === 'approve').length + 
                            gameState.completedCases.filter((c) => c.correctDecision === 'deny').length - 
                            (gameState.lives < 3 ? 1 : 0)}
              casesIncorrect={3 - lives > 0 ? 3 - lives : 0}
              totalScore={score}
              livesRemaining={lives}
              unlockedRules={unlockedRules}
              perfectDay={lives === 3 && gameState.completedCases.length > 0}
              onContinue={handleContinueDay}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'game_over' && (
            <GameOverModal
              finalScore={score}
              dayReached={currentDay}
              casesCompleted={gameState.completedCases.length}
              onRestart={handleRestart}
              onMainMenu={handleMainMenu}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isToolActive('manual') && (
            <ManualModal
              isOpen={true}
              onClose={() => toggleTool('manual')}
              rules={unlockedRules}
            />
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  )
}

export default App