<template>
  <div class="game-container">
    <div class="game-header">
      <h1 class="game-title">🗡️ 神秘森林冒险</h1>
      <p class="game-subtitle">一个AI驱动的文字冒险游戏</p>
    </div>

    <StatusBar
      :health="gameStore.gameData.playerStats.health"
      :maxHealth="gameStore.gameData.playerStats.maxHealth"
      :gold="gameStore.gameData.playerStats.gold"
      :experience="gameStore.gameData.playerStats.experience"
      :gameStatus="gameStore.gameStatus"
      :aiStatus="gameStore.aiStatus"
      :saveStatus="gameStore.saveStatus"
    />

    <ControlBar
      @save="handleSave"
      @load="handleLoad"
      @checkCredits="handleCheckCredits"
      @reset="handleReset"
    />

    <StoryArea
      :story="gameStore.storyText"
      :choices="gameStore.choices"
      :disabled="gameStore.isLoading"
      @choice="handleChoice"
    />

    <!-- 消息提示 -->
    <Transition name="fade">
      <div v-if="message.show" :class="['message', message.type]">
        {{ message.text }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useGameStore } from '@/stores/game'
import StatusBar from '@/components/StatusBar.vue'
import StoryArea from '@/components/StoryArea.vue'
import ControlBar from '@/components/ControlBar.vue'
import { useGameActions } from '@/composables/useGameActions'

const gameStore = useGameStore()
const gameActions = useGameActions()

const message = reactive({
  show: false,
  text: '',
  type: 'success'
})

onMounted(() => {
  gameStore.initGame()
})

const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
  message.show = true
  message.text = text
  message.type = type

  setTimeout(() => {
    message.show = false
  }, type === 'success' ? 3000 : 5000)
}

const handleChoice = async (action: string) => {
  gameStore.isLoading = true
  try {
    await gameActions.handleChoice(action)
  } catch (error: any) {
    showMessage('操作失败: ' + error.message, 'error')
  } finally {
    gameStore.isLoading = false
  }
}

const handleSave = async () => {
  try {
    await gameActions.saveGame()
    showMessage('游戏进度已保存!')
  } catch (error: any) {
    showMessage('保存失败: ' + error.message, 'error')
  }
}

const handleLoad = async () => {
  try {
    await gameActions.loadGame()
    showMessage('游戏进度已恢复!')
  } catch (error: any) {
    showMessage('加载失败: ' + error.message, 'error')
  }
}

const handleCheckCredits = async () => {
  try {
    const result = await gameActions.checkCredits()
    if (result) {
      showMessage(`当前积分: ${result.currentCredits.toFixed(2)}`)
    }
  } catch (error: any) {
    showMessage('查询失败: ' + error.message, 'error')
  }
}

const handleReset = () => {
  if (confirm('确定要重新开始游戏吗?这将丢失当前进度!')) {
    gameStore.resetGame()
    showMessage('游戏已重置!')
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #0a0906 0%, #1a1714 100%);
  color: #f4e8c1;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.game-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 15px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.game-header {
  text-align: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.game-title {
  font-size: 2.2rem;
  font-weight: bold;
  background: linear-gradient(90deg, #f59e0b, #f97316, #eab308);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.game-subtitle {
  color: #a18d6f;
  font-size: 1rem;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.message.success {
  background: rgba(16, 185, 129, 0.9);
  color: white;
  border: 1px solid #10b981;
}

.message.error {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: 1px solid #ef4444;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .game-container {
    padding: 10px;
  }

  .game-title {
    font-size: 1.6rem;
  }

  .game-subtitle {
    font-size: 0.9rem;
  }

  .message {
    top: 10px;
    right: 10px;
    left: 10px;
    padding: 12px 15px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .game-container {
    padding: 8px;
  }

  .game-title {
    font-size: 1.4rem;
  }

  .game-header {
    margin-bottom: 15px;
  }
}
</style>
