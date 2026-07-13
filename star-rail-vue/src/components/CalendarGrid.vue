<template>
  <div class="calendar-grid">
    <div v-for="m in 12" :key="m" class="month-card" :class="{ 'current-month': m - 1 === now.getMonth() && year === now.getFullYear() }">
      <div class="month-header">
        <span class="month-name">{{ MONTH_NAMES[m - 1] }}</span>
        <span class="version-tag" :style="vStyle(m - 1)">{{ vLabel(m - 1) }}</span>
      </div>
      <div class="weekday-row">
        <span v-for="w in 7" :key="w">{{ WEEKDAY_NAMES[w - 1] }}</span>
      </div>
      <div class="days-grid">
        <div v-for="e in getFirstDayOfMonth(year, m - 1)" :key="'e'+e" class="day-cell empty"></div>
        <DayCell
          v-for="d in getMonthDays(year, m - 1)" :key="d"
          :date="new Date(year, m - 1, d)"
          :rangeManager="rangeManager"
          :monthlyCardEnabled="monthlyCardEnabled"
          :remainingCardDays="remainingCardDays"
          @click="$emit('select-date', new Date(year, m - 1, d))"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject } from 'vue'
import { getMonthDays, getFirstDayOfMonth } from '../utils/date.js'
import { MONTH_NAMES, WEEKDAY_NAMES } from '../utils/constants.js'
import DayCell from './DayCell.vue'

const props = defineProps({ year: Number, rangeManager: Object, monthlyCardEnabled: Boolean, remainingCardDays: Number })
defineEmits(['select-date'])

const now = new Date()
const getVersion = inject('getVersion')
const getVersionLabel = inject('getVersionLabel')
const getVersionColor = inject('getVersionColor')

function vStyle(m) {
  const mid = new Date(props.year, m, 15)
  const ver = getVersion(mid)
  const c = getVersionColor(ver)
  return { background: c.bg, color: c.text }
}
function vLabel(m) {
  const mid = new Date(props.year, m, 15)
  return getVersionLabel(getVersion(mid))
}
</script>
