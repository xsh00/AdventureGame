// 游戏类型定义

export interface PlayerStats {
  health: number
  maxHealth: number
  gold: number
  experience: number
  level: number
}

export interface GameData {
  currentScene: string
  playerStats: PlayerStats
  inventory: string[]
  skills: string[]
  visitedScenes: string[]
  currentEnemy: Enemy | null
  inCombat: boolean
}

export interface Enemy {
  name: string
  health: number
  maxHealth: number
  attack: number
  defense: number
  exp: number
  gold: number
}

export interface Choice {
  text: string
  action: string
}

export interface GameEvent {
  type: 'treasure' | 'enemy' | 'loot' | 'shop' | 'rest'
  text: string
  gold?: number
  exp?: number
  item?: string
  enemy?: string
  health?: number
  shop?: boolean
  rest?: boolean
}

// Reverie SDK 类型定义

export interface ReverieMessage {
  type: string
  payload: any
  requestId?: string
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMRequest {
  messages: LLMMessage[]
  temperature?: number
  maxTokens?: number
  modelType?: 'free' | 'paid' | 'custom'
}

export interface LLMResponse {
  success: boolean
  data?: {
    choices: Array<{
      message: {
        role: string
        content: string
      }
    }>
  }
  creditsUsed?: number
  modelUsed?: string
  message?: string
}

export interface SaveRequest {
  saveKey: string
  saveData: any
}

export interface LoadRequest {
  saveKey: string
}

export interface CreditsRequest {
  creditCost: number
  purpose: string
}
