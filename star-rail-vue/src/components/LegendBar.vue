<template>
  <div class="card legend-bar">
    <span style="font-size:0.75rem;color:var(--text-dim);font-weight:500;margin-right:4px;">图例</span>
    <span v-for="item in items" :key="item.label" class="legend-item">
      <span class="legend-dot" :class="item.cls || ''"
        :style="{ background: item.color, borderColor: item.border || 'transparent' }"></span>
      {{ item.label }}
    </span>
  </div>
</template>
<script setup>
import { EVENT_COLORS } from '../utils/constants.js'
const items = [
  { label: '今日', color: 'transparent', cls: 'today-dot', border: 'var(--gold)' },
  { label: '每日活跃', color: EVENT_COLORS.daily },
  { label: '月卡奖励', color: EVENT_COLORS.monthlyCard },
  { label: '模拟宇宙', color: EVENT_COLORS.simulatedUniverse },
  { label: '混沌回忆', color: EVENT_COLORS.chaosMemory },
  { label: '商城兑换', color: EVENT_COLORS.shopExchange },
  { label: '前瞻获取', color: EVENT_COLORS.livePreview },
  { label: '版本更新', color: EVENT_COLORS.versionUpdate },
]
</script>
