<template>
  <div class="controls">
    <button class="control-button" @click="$emit('save')">💾 保存游戏</button>
    <button class="control-button" @click="$emit('load')">📁 加载游戏</button>
    <button class="control-button" @click="$emit('checkCredits')">💎 查看积分</button>
    <button class="control-button" @click="$emit('reset')">🔄 重新开始</button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  save: []
  load: []
  checkCredits: []
  reset: []
}>()
</script>

<style scoped>
.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.control-button {
  padding: 8px 16px;
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 120px;
  text-align: center;
}

.control-button:hover {
  background: rgba(245, 158, 11, 0.2);
}

@media (max-width: 768px) {
  .controls {
    margin-bottom: 10px;
  }

  .control-button {
    padding: 6px 12px;
    font-size: 0.8rem;
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .controls {
    flex-direction: column;
    gap: 6px;
  }

  .control-button {
    width: 100%;
    min-width: unset;
    padding: 8px 12px;
    font-size: 0.85rem;
  }
}
</style>
