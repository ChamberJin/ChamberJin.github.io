import { reactive, computed } from 'vue'
import { useVersion } from './useVersion.js'
import { addDays, isSameDay, startOfDay } from '../utils/date.js'
import { VERSION_DAYS } from '../utils/constants.js'

export function useStoryRewards() {
  const { getVersion, getVersionLabel, getVersionColor } = useVersion()
  const state = reactive({})

  function getVersionStartDate(ver) {
    const anchor = new Date(2026, 6, 15)
    let testVer = getVersion(anchor)
    let testDate = new Date(anchor)
    const targetLabel = getVersionLabel(ver)

    while (getVersionLabel(testVer) !== targetLabel && testDate.getFullYear() < 2035) {
      testDate = addDays(testDate, VERSION_DAYS)
      testVer = getVersion(testDate)
    }
    if (getVersionLabel(testVer) === targetLabel) return testDate

    testDate = new Date(anchor)
    while (getVersionLabel(testVer) !== targetLabel && testDate.getFullYear() > 2020) {
      testDate = addDays(testDate, -VERSION_DAYS)
      testVer = getVersion(testDate)
    }
    return testDate
  }

  function findVersionsInRange(start, end) {
    const versions = []
    const seen = new Set()
    const firstVer = getVersion(start)
    if (!firstVer) return versions
    let curStart = getVersionStartDate(firstVer)
    let curLabel = getVersionLabel(firstVer)
    while (curStart <= end) {
      if (!seen.has(curLabel)) {
        seen.add(curLabel)
        const curVer = getVersion(curStart)
        if (curVer) {
          versions.push({ label: curLabel, ver: curVer, startDate: new Date(curStart) })
        }
      }
      curStart = addDays(curStart, VERSION_DAYS)
      curLabel = getVersionLabel(getVersion(curStart))
    }
    return versions
  }

  function update(start, end) {
    // Clear state if no range
    if (!start || !end) {
      for (const key of Object.keys(state)) delete state[key]
      return []
    }

    const versions = findVersionsInRange(start, end)

    // Initialize new versions
    for (const v of versions) {
      if (!(v.label in state)) {
        const todayDate = startOfDay(new Date())
        const isFutureVersion = v.startDate > todayDate
        state[v.label] = { checked: isFutureVersion || v.startDate > start, startDate: v.startDate }
      }
    }

    // Remove stale versions
    const currentLabels = new Set(versions.map(v => v.label))
    for (const key of Object.keys(state)) {
      if (!currentLabels.has(key)) delete state[key]
    }

    return versions
  }

  function getRewardTotal() {
    let jade = 0, special = 0
    for (const key of Object.keys(state)) {
      if (state[key].checked) {
        jade += 4000
        special += 10
      }
    }
    return { stellarJade: jade, specialPass: special }
  }

  function getDailyBreakdown(cur) {
    let jade = 0, special = 0
    for (const key of Object.keys(state)) {
      if (state[key].checked && isSameDay(cur, state[key].startDate)) {
        jade += 4000
        special += 10
      }
    }
    return { stellarJade: jade, specialPass: special }
  }

  return { state, update, findVersionsInRange, getVersionStartDate, getRewardTotal, getDailyBreakdown }
}
