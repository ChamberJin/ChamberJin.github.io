<template>
  <div class="day-cell"
    :class="cls"
    :data-date="dateKey(date)"
    @mouseenter="onEnter"
    @mousemove="onMove"
    @mouseleave="onLeave"
    @click="$emit('click')"
  >
    <template v-if="hasVersionUpdate">
      <span style="font-size:0.65rem;line-height:1.1;display:block;">{{ date.getDate() }}</span>
      <span style="font-size:0.55rem;line-height:1.1;display:block;font-weight:600;"
        :style="{ color: verColor.text }">{{ verLabel }}</span>
    </template>
    <template v-else>
      {{ date.getDate() }}
    </template>

    <div v-if="events.length > 0" class="event-bar">
      <div v-for="ev in events" :key="ev.id" class="event-marker"
        :class="{ 'version-update': ev.id === 'versionUpdate' }"
        :style="{ background: ev.color }"></div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject } from 'vue'
import { isPast, isToday, isSameDay, dateKey } from '../utils/date.js'

const props = defineProps({
  date: Object,
  rangeManager: Object,
  monthlyCardEnabled: Boolean,
  remainingCardDays: { type: Number, default: 0 }
})
defineEmits(['click'])

const rules = inject('rules')
const getVersion = inject('getVersion')
const getVersionLabel = inject('getVersionLabel')
const getVersionColor = inject('getVersionColor')
const tooltip = inject('tooltip')

const opts = computed(() => ({
  monthlyCardEnabled: props.monthlyCardEnabled,
  remainingCardDays: props.remainingCardDays
}))
const events = computed(() => rules.getEventsForDate(props.date, opts.value))
const hasVersionUpdate = computed(() => events.value.some(ev => ev.id === 'versionUpdate'))
const ri = computed(() => props.rangeManager.getRangeInfo(props.date))

const ver = computed(() => hasVersionUpdate.value ? getVersion(props.date) : null)
const verLabel = computed(() => ver.value ? getVersionLabel(ver.value) : '')
const verColor = computed(() => ver.value ? getVersionColor(ver.value) : {})

const cls = computed(() => ({
  past: isPast(props.date) && !isToday(props.date),
  today: isToday(props.date),
  'in-range': props.rangeManager.isInRange(props.date),
  'range-start': ri.value?.isStart,
  'range-end': ri.value?.isEnd,
  'range-single': ri.value?.isSingle,
  selected: props.rangeManager.isPendingStart(props.date)
}))

function onEnter(e) {
  if (isPast(props.date) && !isToday(props.date)) return
  if (tooltip.show) tooltip.show(e, props.date, events.value)
}
function onMove(e) {
  if (tooltip.move) tooltip.move(e)
}
function onLeave() {
  if (tooltip.hide) tooltip.hide()
}
</script>
