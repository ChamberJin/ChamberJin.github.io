import { reactive, ref, watch } from 'vue'
import { STORAGE_KEY } from '../utils/constants.js'

export function useResources() {
  const holdings = reactive({
    stellarJade: 0,
    specialPass: 0,
    regularPass: 0
  })
  const monthlyCardEnabled = ref(true)
  const remainingCardDays = ref(0)

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (data) {
        holdings.stellarJade = data.sj || 0
        holdings.specialPass = data.sp || 0
        holdings.regularPass = data.rp || 0
        if (data.mc !== undefined) monthlyCardEnabled.value = data.mc
        if (data.rcd !== undefined) remainingCardDays.value = data.rcd
      }
    } catch (e) { /* ignore */ }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      sj: holdings.stellarJade,
      sp: holdings.specialPass,
      rp: holdings.regularPass,
      mc: monthlyCardEnabled.value,
      rcd: remainingCardDays.value
    }))
  }

  load()

  watch([holdings, monthlyCardEnabled, remainingCardDays], save, { deep: true })

  return { holdings, monthlyCardEnabled, remainingCardDays, load, save }
}
