import { useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGameEngine } from './hooks/useGameEngine'
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

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if typing in input
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
      case 'r':
        e.preventDefault()
        // Reset document positions - could dispatch event
        window.dispatchEvent(new CustomEvent('reset-documents'))
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
    // For day report, restart to next day (placeholder - would load day 2 cases)
    restartGame()
  }, [restartGame])

  return (
    <AnimatePresence mode="wait">
      <div className="flex flex-col h-[100dvh] max-w-md mx-auto overflow-hidden bg-slate-950 text-slate-100 relative">
        {/* Main Game Layout */}
        {phase === 'playing' && currentCase && (
          <>
            <Booth
              currentCase={currentCase}
              lives={lives}
              score={score}
              currentDay={currentDay}
              avatarState="traveler"
            />
            <InspectionDesk
              currentCase={currentCase}
              xrayActive={isToolActive('xray')}
              onFieldInspect={() => {}}
            />
            <ActionHUD
              onApprove={() => handleStamp('approve')}
              onDeny={() => handleStamp('deny')}
              onToggleTool={toggleTool}
              isToolActive={isToolActive}
              disabled={false}
              showFeedback={feedbackTicket.isOpen}
            />
          </>
        )}

        {phase === 'playing' && !currentCase && (
          <div className="flex flex-col h-full items-center justify-center bg-slate-950">
            <p className="text-slate-500">Carregando próximo viajante...</p>
          </div>
        )}

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
                            (gameState.lives < 3 ? 1 : 0)} // approximation
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