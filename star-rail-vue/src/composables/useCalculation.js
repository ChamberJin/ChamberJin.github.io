import { addDays, startOfDay, isSameDay } from '../utils/date.js'
import { VERSION_DAYS } from '../utils/constants.js'

export function useCalculation(rulesFn, getVersion, getVersionLabel, getVersionStartDate) {
  const { RULES, calculateRange } = rulesFn

  function calculateGoal(targetJade, opts, holdings) {
    const today = startOfDay(new Date())
    const start = addDays(today, 1) // skip today
    const currentTotal = holdings.stellarJade + holdings.specialPass * 160
    const remaining = Math.max(0, targetJade - currentTotal)

    if (remaining <= 0) {
      return { reached: true, date: today, daysNeeded: 0, totalJade: currentTotal, specialPassTotal: 0, alreadyMet: true }
    }

    // Pre-compute future unstarted versions for story rewards
    const futureVersions = []
    if (getVersion && getVersionStartDate) {
      const farEnd = addDays(today, 730)
      const firstVer = getVersion(today)
      if (firstVer) {
        let vStart = getVersionStartDate(firstVer)
        let vLabel = getVersionLabel(firstVer)
        while (vStart <= farEnd) {
          if (vStart > today && !futureVersions.some(v => v.label === vLabel)) {
            futureVersions.push({ label: vLabel, startDate: vStart })
          }
          vStart = addDays(vStart, VERSION_DAYS)
          vLabel = getVersionLabel(getVersion(vStart))
        }
      }
    }

    let cumulative = 0
    let specialPassTotal = 0
    let cur = new Date(start)
    const maxDays = 730
    const dailyBreakdown = []

    for (let i = 0; i < maxDays; i++) {
      let dayTotal = 0
      // Add one-time story rewards for future versions
      for (const fv of futureVersions) {
        if (isSameDay(cur, fv.startDate)) {
          dayTotal += 4000 + 10 * 160
          specialPassTotal += 10
        }
      }
      for (const rule of RULES) {
        if (rule.check(cur, opts)) {
          const reward = rule.getReward(cur, opts)
          dayTotal += reward.stellarJade + reward.specialPass * 160
          specialPassTotal += reward.specialPass
        }
      }
      cumulative += dayTotal
      dailyBreakdown.push({ date: new Date(cur), jade: dayTotal, cumulative })

      if (cumulative >= remaining) {
        return {
          reached: true,
          date: cur,
          daysNeeded: i + 1,
          totalJade: currentTotal + cumulative,
          specialPassTotal,
          remaining,
          dailyBreakdown
        }
      }
      cur = addDays(cur, 1)
    }

    return {
      reached: false,
      date: null,
      daysNeeded: maxDays,
      totalJade: currentTotal + cumulative,
      specialPassTotal,
      remaining,
      dailyBreakdown
    }
  }

  return { calculateRange, calculateGoal, RULES }
}
