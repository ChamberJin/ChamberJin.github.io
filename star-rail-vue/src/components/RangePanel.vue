<template>
  <div class="card">
    <div class="panel-section">
      <div class="panel-section-title">已选区间</div>
      <div class="toggle-row" style="margin-bottom:6px;">
        <label style="font-size:0.78rem;">📌 固定今日（从今天开始计算）</label>
        <div class="toggle-switch" :class="{ active: rangeManager.fixedToday.value }" @click="toggleFixed"></div>
      </div>
      <div class="range-list">
        <template v-if="rangeManager.hasSelection.value">
          <div class="range-item" style="border:1px solid var(--gold);">
            <div>
              <div class="range-label">📅 {{ startLabel }} → {{ endLabel }}</div>
              <div class="range-days">共 {{ rangeManager.totalDays.value }} 天</div>
            </div>
            <button class="range-del" @click="$emit('clear')">✕</button>
          </div>
        </template>
        <div v-else class="range-empty">{{ emptyHint }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject } from 'vue'
import { startOfDay } from '../utils/date.js'

const props = defineProps({ rangeManager: Object })
const emit = defineEmits(['clear', 'toggle-fixed'])

const rangeManager = inject('rangeManager')

const emptyHint = computed(() => {
  if (rangeManager.fixedToday.value) return '点击未来日期开始计算'
  return rangeManager.pendingStart.value
    ? '已选起点，点击终点完成区间'
    : '点击日期选择起点'
})

const startLabel = computed(() => {
  if (rangeManager.fixedToday.value) return '今天'
  const d = rangeManager.effectiveStartDate.value
  return `${d.getMonth()+1}/${d.getDate()}`
})

const endLabel = computed(() => {
  const d = rangeManager.selectedDate.value
  if (!d) return ''
  return `${d.getMonth()+1}/${d.getDate()}`
})

function toggleFixed() {
  rangeManager.setFixedToday(!rangeManager.fixedToday.value)
  rangeManager.clear()
}
</script>
