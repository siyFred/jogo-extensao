import { useState, useCallback, useMemo, useRef } from 'react'
import type {
  TravelerCase,
  GameState,
  PlayerDecision,
  Discrepancy,
  ToolType,
  CaseEvaluation,
  DayNumber,
} from '../types/game'
import { getCasesForDay } from '../data/cases'
import { getRulesForDay } from '../data/manualRules'

export interface FeedbackTicket {
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
  startNextDay: () => void
  hasNextDay: boolean
  // Ferramentas
  toggleTool: (tool: ToolType) => void
  isToolActive: (tool: ToolType) => boolean
}

/** Embaralha (Fisher-Yates) sem alterar o array original */
function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function createDayState(day: DayNumber, score = 0, lives = 3): GameState {
  const cases = shuffle(getCasesForDay(day))
  const rules = getRulesForDay(day)

  return {
    currentDay: day,
    currentCaseIndex: 0,
    dailyCases: cases,
    completedCases: [],
    dayResults: [],
    lives,
    score,
    phase: 'playing',
    unlockedRules: rules,
    availableTools: ['xray', 'manual'],
    toolsUsed: [],
    xrayActive: false,
    manualOpen: false,
    currentCase: cases[0] ?? null,
    playerDecision: null,
    showFeedback: false,
  }
}

function createInitialGameState(): GameState {
  return createDayState(1)
}

function hasCasesForDay(day: number): boolean {
  return day >= 1 && day <= 5 && getCasesForDay(day as DayNumber).length > 0
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
  // Trava contra toque duplo: evita carimbar o mesmo caso duas vezes
  const stampLockRef = useRef(false)

  const handleStamp = useCallback((decision: PlayerDecision) => {
    if (!currentCase || feedbackTicket.isOpen || stampLockRef.current) return
    stampLockRef.current = true

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
      dayResults: [
        ...prev.dayResults,
        { caseId: currentCase.id, decision, isCorrect: evaluation.isCorrect },
      ],
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
    stampLockRef.current = false
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

  const resetFeedback = useCallback(() => {
    stampLockRef.current = false
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

  const startNextDay = useCallback(() => {
    setGameState((prev) => {
      const nextDay = prev.currentDay + 1
      if (!hasCasesForDay(nextDay)) return prev
      return createDayState(nextDay as DayNumber, prev.score, prev.lives)
    })
    resetFeedback()
  }, [resetFeedback])

  const restartGame = useCallback(() => {
    stampLockRef.current = false
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
    startNextDay,
    hasNextDay: hasCasesForDay(gameState.currentDay + 1),
    toggleTool,
    isToolActive,
  }
}