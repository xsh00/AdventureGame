import type {
  ReverieMessage,
  LLMRequest,
  LLMResponse,
  SaveRequest,
  LoadRequest,
  CreditsRequest
} from '@/types/game'

/**
 * Reverie 游戏 SDK
 * 封装与 Reverie 平台的通信逻辑
 */
class ReverieSDK {
  private isConnected = false
  private userId: string | null = null
  private gameId: string | null = null
  private sessionId: string | null = null
  private pendingRequests: Map<string, { resolve: Function; reject: Function }> = new Map()
  private messageHandlers: Map<string, Function> = new Map()

  constructor() {
    // 监听来自 Reverie 的消息
    window.addEventListener('message', (event) => {
      this.handleReverieMessage(event.data)
    })
  }

  /**
   * 初始化 SDK
   */
  init() {
    // 通知 Reverie 游戏已准备就绪
    this.sendToReverie('ready', {})
    console.log('🎮 Reverie SDK 初始化完成')
  }

  /**
   * 设置消息处理器
   */
  onMessage(type: string, handler: Function) {
    this.messageHandlers.set(type, handler)
  }

  /**
   * 发送消息到 Reverie 平台
   */
  private sendToReverie(type: string, payload: any): string {
    const requestId = this.generateRequestId()
    const message: ReverieMessage = { type, payload, requestId }

    console.log('🎮 发送到 Reverie:', message)
    window.parent.postMessage(message, '*')

    return requestId
  }

  /**
   * 处理来自 Reverie 的消息
   */
  private handleReverieMessage(message: any) {
    if (!message || typeof message !== 'object') return

    console.log('📨 收到 Reverie 消息:', message)

    const { type, payload, requestId } = message

    switch (type) {
      case 'init':
        this.handleInit(payload)
        break
      case 'llm-response':
        this.handleResponse(requestId, payload)
        break
      case 'save-response':
        this.handleResponse(requestId, payload)
        break
      case 'load-response':
        this.handleResponse(requestId, payload)
        break
      case 'credits-response':
        this.handleResponse(requestId, payload)
        break
      case 'error':
        this.handleError(requestId, payload)
        break
    }

    // 调用自定义处理器
    const handler = this.messageHandlers.get(type)
    if (handler) {
      handler(payload)
    }
  }

  /**
   * 处理初始化消息
   */
  private handleInit(payload: any) {
    this.userId = payload.userId
    this.gameId = payload.gameId
    this.sessionId = payload.sessionId
    this.isConnected = true

    console.log('✅ 已连接到 Reverie:', payload)

    const handler = this.messageHandlers.get('init')
    if (handler) {
      handler(payload)
    }
  }

  /**
   * 处理响应
   */
  private handleResponse(requestId: string, payload: any) {
    if (this.pendingRequests.has(requestId)) {
      const { resolve, reject } = this.pendingRequests.get(requestId)!

      if (payload.success) {
        resolve(payload)
      } else {
        reject(new Error(payload.message || '请求失败'))
      }

      this.pendingRequests.delete(requestId)
    }
  }

  /**
   * 处理错误
   */
  private handleError(requestId: string, payload: any) {
    console.error('❌ Reverie 错误:', payload)

    if (this.pendingRequests.has(requestId)) {
      const { reject } = this.pendingRequests.get(requestId)!
      reject(new Error(payload.message || '未知错误'))
      this.pendingRequests.delete(requestId)
    }
  }

  /**
   * 调用 LLM API
   */
  async callLLM(request: LLMRequest): Promise<LLMResponse> {
    if (!this.isConnected) {
      throw new Error('尚未连接到 Reverie 平台')
    }

    const requestId = this.sendToReverie('llm-call', {
      messages: request.messages,
      temperature: request.temperature || 0.7,
      maxTokens: request.maxTokens || 2000,
      modelType: request.modelType || 'free'
    })

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject })

      // 30 秒超时
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId)
          reject(new Error('请求超时'))
        }
      }, 30000)
    })
  }

  /**
   * 保存游戏数据
   */
  async saveGame(request: SaveRequest): Promise<any> {
    if (!this.isConnected) {
      throw new Error('尚未连接到 Reverie 平台')
    }

    const requestId = this.sendToReverie('save-data', request)

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject })

      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId)
          reject(new Error('保存超时'))
        }
      }, 10000)
    })
  }

  /**
   * 加载游戏数据
   */
  async loadGame(request: LoadRequest): Promise<any> {
    if (!this.isConnected) {
      throw new Error('尚未连接到 Reverie 平台')
    }

    const requestId = this.sendToReverie('load-data', request)

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject })

      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId)
          reject(new Error('加载超时'))
        }
      }, 10000)
    })
  }

  /**
   * 检查积分
   */
  async checkCredits(request: CreditsRequest): Promise<any> {
    if (!this.isConnected) {
      throw new Error('尚未连接到 Reverie 平台')
    }

    const requestId = this.sendToReverie('check-credits', request)

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject })

      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId)
          reject(new Error('检查超时'))
        }
      }, 5000)
    })
  }

  /**
   * 生成请求 ID
   */
  private generateRequestId(): string {
    return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * 获取连接状态
   */
  getConnectionStatus(): boolean {
    return this.isConnected
  }

  /**
   * 获取用户ID
   */
  getUserId(): string | null {
    return this.userId
  }

  /**
   * 获取游戏ID
   */
  getGameId(): string | null {
    return this.gameId
  }

  /**
   * 获取会话ID
   */
  getSessionId(): string | null {
    return this.sessionId
  }
}

// 创建全局 SDK 实例
export const reverieSDK = new ReverieSDK()
