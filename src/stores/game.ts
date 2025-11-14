import { defineStore } from 'pinia'
import type { GameData, Choice, Enemy, GameEvent } from '@/types/game'
import { reverieSDK } from '@/utils/reverieSDK'

export const useGameStore = defineStore('game', {
  state: (): {
    gameData: GameData
    storyText: string
    choices: Choice[]
    isConnected: boolean
    gameStatus: string
    aiStatus: string
    saveStatus: string
    isLoading: boolean
    offlineMode: boolean
  } => ({
    gameData: {
      currentScene: 'start',
      playerStats: {
        health: 100,
        maxHealth: 100,
        gold: 50,
        experience: 0,
        level: 1
      },
      inventory: ['旧剑', '面包'],
      skills: [],
      visitedScenes: [],
      currentEnemy: null,
      inCombat: false
    },
    storyText: '正在连接Reverie系统...',
    choices: [],
    isConnected: false,
    gameStatus: '初始化中...',
    aiStatus: '未连接',
    saveStatus: '未保存',
    isLoading: false,
    offlineMode: false
  }),

  getters: {
    healthPercent: (state) => {
      return (state.gameData.playerStats.health / state.gameData.playerStats.maxHealth) * 100
    },
    canAfford: (state) => (cost: number) => {
      return state.gameData.playerStats.gold >= cost
    },
    hasItem: (state) => (itemName: string) => {
      return state.gameData.inventory.includes(itemName)
    },
    hasSkill: (state) => (skillName: string) => {
      return state.gameData.skills.includes(skillName)
    }
  },

  actions: {
    // 初始化游戏
    async initGame() {
      // 设置离线模式超时（5秒）
      const offlineTimeout = setTimeout(() => {
        this.startOfflineMode()
      }, 5000)

      // 监听 Reverie 初始化消息
      reverieSDK.onMessage('init', (payload: any) => {
        clearTimeout(offlineTimeout)
        this.isConnected = true
        this.gameStatus = '已连接'
        this.aiStatus = '就绪'
        this.offlineMode = false
        this.startGame()
        this.showSuccess('已成功连接到Reverie系统！')
      })

      // 初始化 SDK
      reverieSDK.init()
    },

    // 启动离线模式
    startOfflineMode() {
      if (this.isConnected) return

      console.log('🔄 启动离线模式')
      this.offlineMode = true
      this.gameStatus = '离线模式'
      this.aiStatus = '不可用'
      this.startGame()
      this.showSuccess('已切换到离线模式,游戏可以正常进行!')
    },

    // 开始游戏
    startGame() {
      this.storyText = `
        欢迎来到神秘森林冒险！

        你是一名勇敢的冒险者,刚刚踏入了一片充满魔法和危险的森林。
        传说中,这里隐藏着古老的宝藏和强大的魔法生物。

        当前状态:
        💚 生命值: ${this.gameData.playerStats.health}/${this.gameData.playerStats.maxHealth}
        💰 金币: ${this.gameData.playerStats.gold}
        ⭐ 经验: ${this.gameData.playerStats.experience} (等级 ${this.gameData.playerStats.level})
        🎒 物品: ${this.gameData.inventory.join(', ')}
      `

      this.choices = [
        { text: '🌲 深入森林探索', action: 'explore_forest' },
        { text: '🏠 寻找村庄', action: 'find_village' },
        { text: '🤖 向AI寻求建议', action: 'ask_ai' },
        { text: '💾 保存当前进度', action: 'save' }
      ]
    },

    // 更新故事文本
    setStoryText(text: string) {
      this.storyText = text
    },

    // 设置选择
    setChoices(choices: Choice[]) {
      this.choices = choices
    },

    // 更新玩家状态
    updatePlayerStats(updates: Partial<typeof this.gameData.playerStats>) {
      Object.assign(this.gameData.playerStats, updates)
    },

    // 添加物品到背包
    addItem(item: string) {
      this.gameData.inventory.push(item)
    },

    // 移除物品
    removeItem(item: string) {
      const index = this.gameData.inventory.indexOf(item)
      if (index > -1) {
        this.gameData.inventory.splice(index, 1)
      }
    },

    // 添加技能
    addSkill(skill: string) {
      if (!this.gameData.skills.includes(skill)) {
        this.gameData.skills.push(skill)
      }
    },

    // 开始战斗
    startCombat(enemy: Enemy) {
      this.gameData.currentEnemy = enemy
      this.gameData.inCombat = true
    },

    // 结束战斗
    endCombat() {
      this.gameData.currentEnemy = null
      this.gameData.inCombat = false
    },

    // 升级
    levelUp() {
      this.gameData.playerStats.level++
      this.gameData.playerStats.maxHealth += 20
      this.gameData.playerStats.health = this.gameData.playerStats.maxHealth
    },

    // 检查升级
    checkLevelUp() {
      const expNeeded = this.gameData.playerStats.level * 100
      if (this.gameData.playerStats.experience >= expNeeded) {
        this.levelUp()
        return true
      }
      return false
    },

    // 显示成功消息
    showSuccess(message: string) {
      // 触发UI显示成功消息
      console.log('✅', message)
    },

    // 显示错误消息
    showError(message: string) {
      // 触发UI显示错误消息
      console.error('❌', message)
    },

    // 重置游戏
    resetGame() {
      this.gameData = {
        currentScene: 'start',
        playerStats: {
          health: 100,
          maxHealth: 100,
          gold: 50,
          experience: 0,
          level: 1
        },
        inventory: ['旧剑', '面包'],
        skills: [],
        visitedScenes: [],
        currentEnemy: null,
        inCombat: false
      }
      this.startGame()
    }
  }
})
