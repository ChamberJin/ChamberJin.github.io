import { EVENT_COLORS } from '../utils/constants.js'
import { addDays, startOfDay } from '../utils/date.js'

const CHAOS_ANCHOR = new Date(2026, 5, 22)
const LIVE_ANCHOR = new Date(2026, 6, 3)
const UPDATE_ANCHOR = new Date(2026, 6, 15)

const RULE_DEFS = [
  {
    id: 'daily', name: '每日活跃', color: EVENT_COLORS.daily,
    check() { return true },
    getReward() { return { stellarJade: 60, specialPass: 0, regularPass: 0 } }
  },
  {
    id: 'monthlyCard', name: '月卡奖励', color: EVENT_COLORS.monthlyCard,
    check(date, opts) {
      if (!opts?.monthlyCardEnabled) return false
      // If remaining days specified, only apply for first N days from today
      const days = opts?.remainingCardDays || 0
      if (days > 0) {
        const today = startOfDay(new Date())
        const diff = Math.round((date - today) / 86400000)
        return diff >= 0 && diff < days
      }
      return true  // enabled with no day limit — always apply
    },
    getReward() { return { stellarJade: 90, specialPass: 0, regularPass: 0 } }
  },
  {
    id: 'simulatedUniverse', name: '模拟宇宙', color: EVENT_COLORS.simulatedUniverse,
    check(date) { return date.getDay() === 1 },
    getReward() { return { stellarJade: 225, specialPass: 0, regularPass: 1 } }
  },
  {
    id: 'chaosMemory', name: '混沌回忆', color: EVENT_COLORS.chaosMemory,
    check(date) {
      if (date.getDay() !== 1) return false
      const diff = Math.round((date - CHAOS_ANCHOR) / 86400000)
      return diff >= 0 && diff % 14 === 0
    },
    getReward() { return { stellarJade: 900, specialPass: 0, regularPass: 0 } }
  },
  {
    id: 'shopExchange', name: '商城兑换', color: EVENT_COLORS.shopExchange,
    check(date) { return date.getDate() === 1 },
    getReward() { return { stellarJade: 0, specialPass: 5, regularPass: 5 } }
  },
  {
    id: 'livePreview', name: '前瞻获取', color: EVENT_COLORS.livePreview,
    check(date) {
      if (date.getDay() !== 5) return false
      const diff = Math.round((date - LIVE_ANCHOR) / 86400000)
      return diff >= 0 && diff % 42 === 0
    },
    getReward() { return { stellarJade: 300, specialPass: 0, regularPass: 0 } }
  },
  {
    id: 'versionUpdate', name: '版本更新', color: EVENT_COLORS.versionUpdate,
    check(date) {
      if (date.getDay() !== 3) return false
      const diff = Math.round((date - UPDATE_ANCHOR) / 86400000)
      return diff >= 0 && diff % 42 === 0
    },
    getReward() { return { stellarJade: 600, specialPass: 0, regularPass: 0 } }
  }
]

export function useRules() {
  function getEventsForDate(date, opts) {
    return RULE_DEFS.filter(r => r.check(date, opts))
  }

  function calculateRange(start, end, opts) {
    const result = {}
    for (const rule of RULE_DEFS) {
      result[rule.id] = { stellarJade: 0, specialPass: 0, regularPass: 0, name: rule.name, color: rule.color }
    }
    result._total = { stellarJade: 0, specialPass: 0, regularPass: 0 }

    let cur = new Date(start)
    while (cur <= end) {
      for (const rule of RULE_DEFS) {
        if (rule.check(cur, opts)) {
          const reward = rule.getReward(cur, opts)
          result[rule.id].stellarJade += reward.stellarJade
          result[rule.id].specialPass += reward.specialPass
          result[rule.id].regularPass += reward.regularPass
          result._total.stellarJade += reward.stellarJade
          result._total.specialPass += reward.specialPass
          result._total.regularPass += reward.regularPass
        }
      }
      cur = addDays(cur, 1)
    }
    return result
  }

  const RULES = RULE_DEFS

  return { getEventsForDate, calculateRange, RULES }
}
