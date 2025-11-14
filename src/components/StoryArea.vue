<template>
  <div class="story-area">
    <div class="story-text" v-html="formattedStory"></div>
    <div class="choices">
      <button
        v-for="(choice, index) in choices"
        :key="index"
        class="choice-button"
        @click="$emit('choice', choice.action)"
        :disabled="disabled"
      >
        {{ choice.text }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Choice } from '@/types/game'

interface Props {
  story: string
  choices: Choice[]
  disabled?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  choice: [action: string]
}>()

const formattedStory = computed(() => {
  return props.story.replace(/\n/g, '<br>')
})
</script>

<style scoped>
.story-area {
  background: rgba(26, 23, 20, 0.8);
  border: 1px solid rgba(83, 71, 65, 0.5);
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  min-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.story-text {
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 1rem;
  flex-shrink: 0;
  white-space: pre-wrap;
}

.choices {
  margin-top: auto;
  flex-shrink: 0;
}

.choice-button {
  display: block;
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.choice-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #f97316, #ea580c);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
}

.choice-button:disabled {
  background: #666;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .story-area {
    padding: 15px;
    min-height: 180px;
  }

  .story-text {
    font-size: 0.95rem;
    line-height: 1.5;
  }
}

@media (max-width: 480px) {
  .story-area {
    padding: 12px;
    min-height: 160px;
  }

  .story-text {
    font-size: 0.9rem;
  }
}
</style>
