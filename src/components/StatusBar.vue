<template>
  <div class="status-bar">
    <div class="status-item">
      <span>💚 生命值:</span>
      <div class="health-bar">
        <div class="health-fill" :style="{ width: healthPercent + '%' }"></div>
      </div>
      <span>{{ health }}/{{ maxHealth }}</span>
    </div>
    <div class="status-item">
      <span>💰 金币:</span>
      <span>{{ gold }}</span>
    </div>
    <div class="status-item">
      <span>⭐ 经验:</span>
      <span>{{ experience }}</span>
    </div>
    <div class="status-item">
      <span>🎮 游戏:</span>
      <span>{{ gameStatus }}</span>
    </div>
    <div class="status-item">
      <span>🤖 AI:</span>
      <span>{{ aiStatus }}</span>
    </div>
    <div class="status-item">
      <span>💾 存档:</span>
      <span>{{ saveStatus }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  health: number
  maxHealth: number
  gold: number
  experience: number
  gameStatus: string
  aiStatus: string
  saveStatus: string
}

const props = defineProps<Props>()

const healthPercent = computed(() => {
  return (props.health / props.maxHealth) * 100
})
</script>

<style scoped>
.status-bar {
  background: rgba(26, 23, 20, 0.8);
  border: 1px solid rgba(83, 71, 65, 0.5);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  white-space: nowrap;
}

.health-bar {
  width: 100px;
  height: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #f97316);
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .status-bar {
    padding: 10px;
    gap: 6px;
  }

  .status-item {
    font-size: 0.8rem;
    gap: 4px;
  }

  .health-bar {
    width: 60px;
    height: 8px;
  }
}

@media (max-width: 480px) {
  .status-bar {
    padding: 8px;
    gap: 4px;
  }

  .status-item {
    font-size: 0.75rem;
  }

  .health-bar {
    width: 50px;
    height: 6px;
  }
}
</style>
