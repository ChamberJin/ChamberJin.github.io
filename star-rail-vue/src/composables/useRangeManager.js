import { ref, computed } from 'vue'
import { startOfDay, isSameDay, daysBetween } from '../utils/date.js'

export function useRangeManager() {
  const selectedDate = ref(null)   // end date
  const startDate = ref(null)      // custom start
  const pendingStart = ref(null)   // first click in custom mode
  const fixedToday = ref(true)

  function setFixedToday(v) {
    fixedToday.value = v
    if (v) { startDate.value = null; pendingStart.value = null }
    else { startDate.value = null; pendingStart.value = null }
  }

  function select(date) {
    const d = startOfDay(new Date(date))
    if (fixedToday.value) {
      selectedDate.value = d
    } else {
      if (pendingStart.value === null) {
        pendingStart.value = d
        startDate.value = null
        selectedDate.value = null
      } else {
        const s = pendingStart.value
        if (isSameDay(s, d)) { pendingStart.value = null; return }
        startDate.value = s < d ? s : d
        selectedDate.value = s < d ? d : s
        pendingStart.value = null
      }
    }
  }

  function clear() {
    selectedDate.value = null
    startDate.value = null
    pendingStart.value = null
  }

  function isSelected(date) {
    const d = startOfDay(new Date(date))
    if (pendingStart.value && isSameDay(d, pendingStart.value)) return true
    if (selectedDate.value && isSameDay(d, selectedDate.value)) return true
    if (!fixedToday.value && startDate.value && isSameDay(d, startDate.value)) return true
    return false
  }

  const hasSelection = computed(() => selectedDate.value !== null)

  const effectiveStartDate = computed(() => {
    if (fixedToday.value || !startDate.value) return startOfDay(new Date())
    return startDate.value
  })

  function isInRange(date) {
    if (!selectedDate.value) return false
    const ts = date.getTime()
    return ts >= effectiveStartDate.value.getTime() && ts <= selectedDate.value.getTime()
  }

  function getRangeInfo(date) {
    if (!selectedDate.value) return null
    const ts = date.getTime()
    const s = effectiveStartDate.value.getTime()
    const e = selectedDate.value.getTime()
    if (ts < s || ts > e) return null
    return { isStart: ts === s, isEnd: ts === e, isSingle: s === e }
  }

  function isPendingStart(date) {
    return pendingStart.value !== null && isSameDay(date, pendingStart.value)
  }

  const totalDays = computed(() => {
    if (!selectedDate.value) return 0
    return daysBetween(effectiveStartDate.value, selectedDate.value) + 1
  })

  return {
    selectedDate, startDate, pendingStart, fixedToday,
    setFixedToday, select, clear, isSelected,
    hasSelection, effectiveStartDate,
    isInRange, getRangeInfo, isPendingStart, totalDays
  }
}
