import { useEffect, useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGameEngine } from './hooks/useGameEngine'
import { Booth } from './components/booth/Booth'
import { InspectionDesk } from './components/desk/InspectionDesk'
import { ActionHUD } from './components/hud/ActionHUD'
import { FeedbackModal } from './components/modals/FeedbackModal'
import { DayReportModal } from './components/modals/DayReportModal'
import { GameOverModal } from './components/modals/GameOverModal'
import { ManualModal } from './components/modals/ManualModal'
import { NameEntryScreen } from './components/screens/NameEntryScreen'
import { joinLeaderboard, reportScore } from './lib/leaderboardApi'

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

  // Nome do jogador (null = tela de nome)
  const [playerName, setPlayerName] = useState<string | null>(null)

  // Sincroniza pontuação/vidas com o placar ao vivo
  useEffect(() => {
    if (!playerName) return
    void reportScore({
      name: playerName,
      score,
      lives,
      day: currentDay,
      status: phase === 'game_over' ? 'game_over' : phase === 'day_report' ? 'finished' : 'playing',
    })
  }, [playerName, score, lives, currentDay, phase])

  const handleStartGame = useCallback(
    async (name: string) => {
      await joinLeaderboard(name)
      restartGame()
      setPlayerName(name)
    },
    [restartGame],
  )

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!playerName) return
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
  }, [playerName, feedbackTicket.isOpen, handleStamp, nextCase, toggleTool])

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

  // Tentar novamente: mesmo nome, rodada zerada
  const handleRestart = useCallback(() => {
    if (playerName) void joinLeaderboard(playerName)
    restartGame()
  }, [playerName, restartGame])

  // Menu principal: volta para a tela de nome
  const handleMainMenu = useCallback(() => {
    restartGame()
    setPlayerName(null)
  }, [restartGame])

  const handleContinueDay = handleRestart

  if (!playerName) {
    return <NameEntryScreen onSubmit={handleStartGame} />
  }

  return (
    <AnimatePresence mode="wait">
      {/* Main Game Content - Flexbox layout without fixed heights */}
      <div className="flex flex-col overflow-hidden bg-slate-950 text-slate-100 touch-manipulation select-none h-[100dvh] w-full max-w-md mx-auto lg:max-w-none">
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