/**
 * Central type definitions for the Digital Security Inspection Game
 * All case structures, game state, and document fields are defined here.
 */

/** Unique identifier for a traveler case */
export type CaseId = string & { readonly __brand: unique symbol }

/** Day number in the campaign (1-5) */
export type DayNumber = 1 | 2 | 3 | 4 | 5

/** Document field types that can be inspected */
export type FieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'phone'
  | 'date'
  | 'select'
  | 'boolean'
  | 'hidden'

/** Result of a field validation */
export type ValidationResult = 'valid' | 'invalid' | 'suspicious' | 'unknown'

/** Player's decision on a case */
export type PlayerDecision = 'approve' | 'deny'

/** Correct decision for a case */
export type CorrectDecision = 'approve' | 'deny'

/** Severity of a security issue found */
export type Severity = 'low' | 'medium' | 'high' | 'critical'

/** Category of security threat */
export type ThreatCategory =
  | 'phishing'
  | 'malware'
  | 'social_engineering'
  | 'data_leak'
  | 'impersonation'
  | 'suspicious_link'
  | 'fake_identity'
  | 'none'

/** Tool types available to the player */
export type ToolType = 'xray' | 'manual' | 'uv_light' | 'magnifier'

/** Game phase/screen */
export type GamePhase = 'menu' | 'playing' | 'day_transition' | 'day_report' | 'game_over'

/** Document field definition */
export interface DocumentField {
  /** Unique field identifier */
  id: string
  /** Human-readable label */
  label: string
  /** Type of field for validation and rendering */
  type: FieldType
  /** Current value in the document */
  value: string
  /** Whether this field is visible to player initially */
  visible: boolean
  /** Validation result after inspection */
  validation?: ValidationResult
  /** Hint shown when field is suspicious */
  suspiciousHint?: string
  /** Expected format/pattern for validation */
  pattern?: string
  /** For select fields, available options */
  options?: string[]
}

/** A single document in a traveler's case */
export interface Document {
  /** Unique document identifier */
  id: string
  /** Document type/name (e.g., "Passaporte", "E-mail Corporativo", "QR Code") */
  type: string
  /** Fields contained in this document */
  fields: DocumentField[]
  /** Whether document has been inspected with X-Ray tool */
  xrayRevealed: boolean
  /** Hidden fields only visible with tools */
  hiddenFields?: DocumentField[]
}

/** A single discrepancy/finding in a case */
export interface Discrepancy {
  /** Unique identifier */
  id: string
  /** Document field this discrepancy relates to */
  fieldId: string
  /** Document ID this discrepancy relates to */
  documentId: string
  /** Category of threat */
  category: ThreatCategory
  /** Severity level */
  severity: Severity
  /** Description of the issue */
  description: string
  /** Educational explanation for the player */
  explanation: string
  /** Whether this discrepancy alone warrants denial */
  isBlocking: boolean
}

/** A complete traveler case */
export interface TravelerCase {
  /** Unique case identifier */
  id: CaseId
  /** Day this case appears */
  day: DayNumber
  /** Order within the day */
  order: number
  /** Traveler's displayed name */
  travelerName: string
  /** Traveler's avatar identifier */
  avatarId: string
  /** Dialogue shown when traveler arrives */
  dialogue: string
  /** Documents presented by traveler */
  documents: Document[]
  /** All discrepancies in this case */
  discrepancies: Discrepancy[]
  /** Correct decision for this case */
  correctDecision: CorrectDecision
  /** Explanation shown after player decides */
  feedback: {
    approve: string
    deny: string
  }
  /** Points awarded for correct decision */
  points: number
  /** Whether this is a tutorial case */
  isTutorial?: boolean
}

/** Unlocked manual rule */
export interface ManualRule {
  /** Unique rule identifier */
  id: string
  /** Day this rule is unlocked */
  unlockedDay: DayNumber
  /** Rule title */
  title: string
  /** Detailed description */
  description: string
  /** Example of the threat */
  example: string
  /** Threat category this rule covers */
  category: ThreatCategory
  /** Priority/order in manual */
  priority: number
}

/** Player's current game state */
export interface GameState {
  /** Current day (1-5) */
  currentDay: DayNumber
  /** Current case index within the day */
  currentCaseIndex: number
  /** Cases for the current day */
  dailyCases: TravelerCase[]
  /** All cases completed so far */
  completedCases: TravelerCase[]
  /** Player's lives remaining (0-3) */
  lives: number
  /** Player's total score */
  score: number
  /** Current phase */
  phase: GamePhase
  /** Unlocked manual rules */
  unlockedRules: ManualRule[]
  /** Available tools */
  availableTools: ToolType[]
  /** Tools used in current case */
  toolsUsed: ToolType[]
  /** Whether X-Ray is currently active */
  xrayActive: boolean
  /** Whether manual is open */
  manualOpen: boolean
  /** Current case being inspected (null if between cases) */
  currentCase: TravelerCase | null
  /** Player's decision on current case */
  playerDecision: PlayerDecision | null
  /** Whether feedback modal is showing */
  showFeedback: boolean
  /** Time remaining in seconds (optional) */
  timeRemaining?: number
}

/** Result of evaluating a case */
export interface CaseEvaluation {
  /** Whether player's decision matches correct decision */
  isCorrect: boolean
  /** Points earned */
  pointsEarned: number
  /** Lives lost (0 or 1) */
  livesLost: number
  /** Discrepancies found by player */
  foundDiscrepancies: Discrepancy[]
  /** Discrepancies missed by player */
  missedDiscrepancies: Discrepancy[]
  /** Feedback message */
  feedbackMessage: string
}

/** Day summary for report screen */
export interface DayReport {
  day: DayNumber
  casesTotal: number
  casesCorrect: number
  casesIncorrect: number
  totalScore: number
  livesRemaining: number
  unlockedRules: ManualRule[]
  perfectDay: boolean
}

/** Complete game save data */
export interface GameSaveData {
  gameState: GameState
  timestamp: number
  version: string
}

/** Configuration for a day's cases */
export interface DayConfig {
  day: DayNumber
  title: string
  description: string
  cases: TravelerCase[]
  unlockedRules: ManualRule[]
  availableTools: ToolType[]
  timeLimit?: number // seconds per case, optional
}