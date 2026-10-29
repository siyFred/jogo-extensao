import { useState, useCallback, useMemo } from 'react'
import type {
  TravelerCase,
  GameState,
  GamePhase,
  PlayerDecision,
  CorrectDecision,
  Discrepancy,
  DayNumber,
  ManualRule,
  ToolType,
  CaseEvaluation,
} from '../types/game'
import { getCasesForDay, getRulesForDay } from '../data/cases'
import { manualRules } from '../data/manualRules'

interface FeedbackTicket {
  isOpen: boolean
  isCorrect: boolean
  pointsEarned: number
  livesLost: number
  message: string
  discrepancies: Discrepancy[]
  caseTitle: string
}

interface UseGameEngineReturn {
  // Estado do jogo
  gameState: GameState
  // Caso atual
  currentCase: TravelerCase | null
  // Feedback
  feedbackTicket: FeedbackTicket
  // Ações
  handleStamp: (decision: PlayerDecision) => void
  closeFeedback: () => void
  nextCase: () => void
  restartGame: () => void
  // Ferramentas
  toggleTool: (tool: ToolType) => void
  isToolActive: (tool: ToolType) => boolean
}

function createInitialGameState(): GameState {
  const day1Cases = getCasesForDay(1)
  const day1Rules = getRulesForDay(1).map((id) => manualRules.find((r) => r.id === id)!).filter(Boolean)
  
  return {
    currentDay: 1,
    currentCaseIndex: 0,
    dailyCases: day1Cases,
    completedCases: [],
    lives: 3,
    score: 0,
    phase: 'playing',
    unlockedRules: day1Rules,
    availableTools: ['xray', 'manual'],
    toolsUsed: [],
    xrayActive: false,
    manualOpen: false,
    currentCase: day1Cases[0] ?? null,
    playerDecision: null,
    showFeedback: false,
  }
}

function evaluateCase(
  currentCase: TravelerCase,
  playerDecision: PlayerDecision
): CaseEvaluation {
  const isCorrect = playerDecision === currentCase.correctDecision
  const pointsEarned = isCorrect ? currentCase.points : 0
  const livesLost = isCorrect ? 0 : 1
  
  // Discrepâncias que são "blocking" = essenciais para barrar
  const blockingDiscrepancies = currentCase.discrepancies.filter((d) => d.isBlocking)
  const nonBlockingDiscrepancies = currentCase.discrepancies.filter((d) => !d.isBlocking)
  
  // Se o jogador barrou, considera que encontrou as blocking
  // Se aprovou, considera que perdeu as blocking
  const foundDiscrepancies = playerDecision === 'deny' 
    ? blockingDiscrepancies 
    : []
  const missedDiscrepancies = playerDecision === 'approve'
    ? blockingDiscrepancies
    : []

  const feedbackMessage = isCorrect
    ? currentCase.feedback.approve
    : currentCase.feedback.deny

  return {
    isCorrect,
    pointsEarned,
    livesLost,
    foundDiscrepancies,
    missedDiscrepancies,
    feedbackMessage,
  }
}

export function useGameEngine(): UseGameEngineReturn {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState)
  const [feedbackTicket, setFeedbackTicket] = useState<FeedbackTicket>({
    isOpen: false,
    isCorrect: false,
    pointsEarned: 0,
    livesLost: 0,
    message: '',
    discrepancies: [],
    caseTitle: '',
  })

  const currentCase = gameState.currentCase

  const handleStamp = useCallback((decision: PlayerDecision) => {
    if (!currentCase || feedbackTicket.isOpen) return

    const evaluation = evaluateCase(currentCase, decision)
    const newLives = gameState.lives - evaluation.livesLost
    const newScore = gameState.score + evaluation.pointsEarned

    // Atualiza estado do jogo
    setGameState((prev) => ({
      ...prev,
      lives: newLives,
      score: newScore,
      playerDecision: decision,
      showFeedback: true,
      completedCases: [...prev.completedCases, currentCase],
      toolsUsed: [],
      xrayActive: false,
      manualOpen: false,
    }))

    // Abre ticket de feedback
    setFeedbackTicket({
      isOpen: true,
      isCorrect: evaluation.isCorrect,
      pointsEarned: evaluation.pointsEarned,
      livesLost: evaluation.livesLost,
      message: evaluation.feedbackMessage,
      discrepancies: currentCase.discrepancies,
      caseTitle: `${currentCase.travelerName} - ${currentCase.documents[0]?.type ?? 'Documentos'}`,
    })

    // Verifica game over
    if (newLives <= 0) {
      setGameState((prev) => ({ ...prev, phase: 'game_over' }))
    }
  }, [currentCase, feedbackTicket.isOpen, gameState.lives, gameState.score])

  const closeFeedback = useCallback(() => {
    setFeedbackTicket((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const nextCase = useCallback(() => {
    setGameState((prev) => {
      const nextIndex = prev.currentCaseIndex + 1
      const hasMoreCases = nextIndex < prev.dailyCases.length

      if (!hasMoreCases) {
        // Fim do dia
        return {
          ...prev,
          phase: 'day_report',
          currentCase: null,
          playerDecision: null,
          showFeedback: false,
        }
      }

      return {
        ...prev,
        currentCaseIndex: nextIndex,
        currentCase: prev.dailyCases[nextIndex],
        playerDecision: null,
        showFeedback: false,
        toolsUsed: [],
        xrayActive: false,
        manualOpen: false,
      }
    })
    closeFeedback()
  }, [closeFeedback])

  const restartGame = useCallback(() => {
    setGameState(createInitialGameState)
    setFeedbackTicket({
      isOpen: false,
      isCorrect: false,
      pointsEarned: 0,
      livesLost: 0,
      message: '',
      discrepancies: [],
      caseTitle: '',
    })
  }, [])

  const toggleTool = useCallback((tool: ToolType) => {
    setGameState((prev) => {
      if (tool === 'xray') {
        return {
          ...prev,
          xrayActive: !prev.xrayActive,
          toolsUsed: prev.toolsUsed.includes('xray') ? prev.toolsUsed : [...prev.toolsUsed, 'xray'],
        }
      }
      if (tool === 'manual') {
        return {
          ...prev,
          manualOpen: !prev.manualOpen,
        }
      }
      return prev
    })
  }, [])

  const isToolActive = useCallback((tool: ToolType) => {
    if (tool === 'xray') return gameState.xrayActive
    if (tool === 'manual') return gameState.manualOpen
    return false
  }, [gameState.xrayActive, gameState.manualOpen])

  // Validação de tipos: garante que o estado está consistente
  const validatedState = useMemo(() => ({
    ...gameState,
    currentCase: gameState.dailyCases[gameState.currentCaseIndex] ?? null,
  }), [gameState])

  return {
    gameState: validatedState,
    currentCase,
    feedbackTicket,
    handleStamp,
    closeFeedback,
    nextCase,
    restartGame,
    toggleTool,
    isToolActive,
  }
}